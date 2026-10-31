import "server-only";
import { MIN_PASSWORD_LENGTH } from "./reset-flow";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db, schema } from "@/lib/db/client";
import { withRetry } from "@/lib/db/retry";
import { getSession } from "./session";
import { sessionStillValid } from "./session-rules";

/** bcrypt work factor for new and changed passwords. */
export const BCRYPT_COST = 12;

/**
 * A real bcrypt hash of a random string, compared against when an email has no account, so a sign-in
 * takes the same time whether or not the account exists (no telling which emails are registered).
 */
const DUMMY_HASH = "$2b$12$db4ApfNwu/sgzZtXKN6LtuAyyO3COwrJEc5atna9rTOFmTUOrBeoe";

/** Store a new password and end every older session (the caller re-issues this device's session). */
export async function setNewPassword(userId: string, password: string): Promise<void> {
  const conn = requireDb();
  await conn
    .update(schema.users)
    .set({ passwordHash: await bcrypt.hash(password, BCRYPT_COST), passwordChangedAt: new Date() })
    .where(eq(schema.users.id, userId));
}

export class AuthError extends Error {}

export interface PublicUser {
  id: string;
  email: string;
  name: string;
  username: string;
  /** When the account was created — for tenure (“Day N on Ascend”). */
  createdAt: Date;
}

/** Throws a user-facing message instead of a raw connection error when the db is unreachable. */
function requireDb() {
  if (!db) {
    throw new AuthError(
      "Accounts aren't available right now (the database isn't reachable in this deployment). Try again shortly.",
    );
  }
  return db;
}

function newId(): string {
  return crypto.randomUUID();
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 24) || "learner";
}

async function uniqueUsername(base: string): Promise<string> {
  const conn = requireDb();
  const root = slugify(base);
  let candidate = root;
  let suffix = 0;
  while (true) {
    const existing = await conn.query.profiles.findFirst({ where: eq(schema.profiles.username, candidate) });
    if (!existing) return candidate;
    suffix += 1;
    candidate = `${root}${suffix}`;
  }
}

/** A unique-constraint failure from Postgres (code 23505) or SQLite (local development). */
function isUniqueViolation(err: unknown): boolean {
  const e = err as { code?: string; message?: string; cause?: { code?: string; message?: string } } | null;
  return (
    e?.code === "23505" ||
    e?.cause?.code === "23505" ||
    /UNIQUE constraint failed/.test(e?.message ?? "") ||
    /UNIQUE constraint failed/.test(e?.cause?.message ?? "")
  );
}

export async function signUp(input: { email: string; password: string; name: string }): Promise<PublicUser> {
  const conn = requireDb();
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim().slice(0, 80);

  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new AuthError("Enter a valid email address.");
  if (input.password.length < MIN_PASSWORD_LENGTH)
    throw new AuthError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
  if (!name) throw new AuthError("Enter your name.");

  const existing = await conn.query.users.findFirst({ where: eq(schema.users.email, email) });
  if (existing) throw new AuthError("An account with that email already exists.");

  const passwordHash = await bcrypt.hash(input.password, BCRYPT_COST);
  const userId = newId();
  const username = await uniqueUsername(name || email.split("@")[0]);
  const now = new Date();

  try {
    await conn.insert(schema.users).values({ id: userId, email, passwordHash, createdAt: now });
  } catch (err) {
    // Two sign-ups with the same email at once: the second loses the race.
    if (isUniqueViolation(err)) throw new AuthError("An account with that email already exists.");
    throw err;
  }
  // The profile and streak must exist too, or the account could never be used: if they can't be created,
  // remove the user again (profiles and streaks cascade) so the email isn't stuck.
  try {
    let chosen = username;
    for (let attempt = 0; ; attempt++) {
      try {
        await conn.insert(schema.profiles).values({ userId, name, username: chosen, bio: "" });
        break;
      } catch (err) {
        if (!isUniqueViolation(err) || attempt >= 5) throw err;
        chosen = await uniqueUsername(`${username}${Math.floor(Math.random() * 1000)}`); // taken meanwhile
      }
    }
    await conn.insert(schema.streaks).values({ userId });
    return { id: userId, email, name, username: chosen, createdAt: now };
  } catch (err) {
    await conn.delete(schema.users).where(eq(schema.users.id, userId));
    throw err;
  }
}

export async function signIn(input: { email: string; password: string }): Promise<PublicUser> {
  const conn = requireDb();
  const email = input.email.trim().toLowerCase();
  const user = await conn.query.users.findFirst({ where: eq(schema.users.email, email) });
  if (!user) {
    await bcrypt.compare(input.password, DUMMY_HASH);
    throw new AuthError("Invalid email or password.");
  }

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) throw new AuthError("Invalid email or password.");

  const profile = await conn.query.profiles.findFirst({ where: eq(schema.profiles.userId, user.id) });
  return {
    id: user.id,
    email: user.email,
    name: profile?.name ?? "",
    username: profile?.username ?? "",
    createdAt:
      user.createdAt instanceof Date ? user.createdAt : new Date(user.createdAt),
  };
}

/**
 * Never throws: any db/session failure here degrades to "logged out"
 * rather than crashing every page that renders the sidebar/topbar. Real
 * errors are still logged server-side (see client.ts's dbInitError log).
 */
export async function getCurrentUser(): Promise<PublicUser | null> {
  try {
    // Read the session cookie first, unconditionally -- this is what tells
    // Next.js the route is request-dynamic. Checking `db` before this would
    // skip that signal whenever the db happens to be down (e.g. a transient
    // sqlite lock), letting a route get wrongly cached as static "logged out".
    const session = await getSession();
    if (!session) return null;
    const conn = db;
    if (!conn) return null;
    const { userId } = session;

    const user = await withRetry(() => conn.query.users.findFirst({ where: eq(schema.users.id, userId) }));
    if (!user) return null;
    if (!sessionStillValid(session.issuedAt, user.passwordChangedAt)) return null;
    const profile = await withRetry(() => conn.query.profiles.findFirst({ where: eq(schema.profiles.userId, userId) }));
    if (!profile) return null;

    return {
      id: user.id,
      email: user.email,
      name: profile.name,
      username: profile.username,
      createdAt:
        user.createdAt instanceof Date
          ? user.createdAt
          : new Date(user.createdAt),
    };
  } catch (err) {
    // Next's own static-render probe bails out of cookies() with this
    // digest during `next build` -- not a real failure, just how Next
    // detects the route needs dynamic rendering. Don't log it as one.
    const isNextStaticBailout = (err as { digest?: string } | null)?.digest === "DYNAMIC_SERVER_USAGE";
    if (!isNextStaticBailout) {
      console.error("[auth] getCurrentUser failed, treating request as signed-out:", err);
    }
    return null;
  }
}
