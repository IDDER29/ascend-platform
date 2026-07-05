import "server-only";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db, schema } from "@/lib/db/client";
import { getSessionUserId } from "./session";

export class AuthError extends Error {}

export interface PublicUser {
  id: string;
  email: string;
  name: string;
  username: string;
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
  const root = slugify(base);
  let candidate = root;
  let suffix = 0;
  while (true) {
    const existing = await db.query.profiles.findFirst({ where: eq(schema.profiles.username, candidate) });
    if (!existing) return candidate;
    suffix += 1;
    candidate = `${root}${suffix}`;
  }
}

export async function signUp(input: { email: string; password: string; name: string }): Promise<PublicUser> {
  const email = input.email.trim().toLowerCase();
  const name = input.name.trim();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new AuthError("Enter a valid email address.");
  if (input.password.length < 6) throw new AuthError("Password must be at least 6 characters.");
  if (!name) throw new AuthError("Enter your name.");

  const existing = await db.query.users.findFirst({ where: eq(schema.users.email, email) });
  if (existing) throw new AuthError("An account with that email already exists.");

  const passwordHash = await bcrypt.hash(input.password, 10);
  const userId = newId();
  const username = await uniqueUsername(name || email.split("@")[0]);
  const now = new Date();

  await db.insert(schema.users).values({ id: userId, email, passwordHash, createdAt: now });
  await db.insert(schema.profiles).values({ userId, name, username, bio: "" });
  await db.insert(schema.streaks).values({ userId });

  return { id: userId, email, name, username };
}

export async function signIn(input: { email: string; password: string }): Promise<PublicUser> {
  const email = input.email.trim().toLowerCase();
  const user = await db.query.users.findFirst({ where: eq(schema.users.email, email) });
  if (!user) throw new AuthError("Invalid email or password.");

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) throw new AuthError("Invalid email or password.");

  const profile = await db.query.profiles.findFirst({ where: eq(schema.profiles.userId, user.id) });
  return { id: user.id, email: user.email, name: profile?.name ?? "", username: profile?.username ?? "" };
}

export async function getCurrentUser(): Promise<PublicUser | null> {
  const userId = await getSessionUserId();
  if (!userId) return null;

  const user = await db.query.users.findFirst({ where: eq(schema.users.id, userId) });
  if (!user) return null;
  const profile = await db.query.profiles.findFirst({ where: eq(schema.profiles.userId, userId) });
  if (!profile) return null;

  return { id: user.id, email: user.email, name: profile.name, username: profile.username };
}
