import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "ascend_session";
const SESSION_DAYS = 30;

let warnedDevSecret = false;

/** Production signs sessions only with a real secret: at least 32 characters, set in the environment. */
const MIN_SECRET_LENGTH = 32;

function isProduction(): boolean {
  return process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL);
}

function getSecretKey() {
  const secret = process.env.AUTH_SECRET;
  if (isProduction() && (!secret || secret.length < MIN_SECRET_LENGTH)) {
    throw new Error(
      `AUTH_SECRET must be set to a random string of at least ${MIN_SECRET_LENGTH} characters in production ` +
        "(for example: openssl rand -base64 48).",
    );
  }
  if (!secret) {
    if (!warnedDevSecret) {
      console.warn(
        "[auth] AUTH_SECRET is not set -- using an insecure development-only default. " +
          "Set AUTH_SECRET in your environment before deploying anywhere real.",
      );
      warnedDevSecret = true;
    }
    return new TextEncoder().encode("ascend-dev-only-insecure-secret-do-not-deploy");
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(userId: string): Promise<string> {
  return new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DAYS}d`)
    .sign(getSecretKey());
}

export type Session = { userId: string; /** Seconds since the epoch, when the session was issued. */ issuedAt: number };

export async function verifySessionToken(token: string): Promise<Session | null> {
  let key: Uint8Array;
  try {
    key = getSecretKey();
  } catch (err) {
    // A missing production secret is a deployment error, not a signed-out visitor: say so loudly.
    console.error("[auth]", err);
    return null;
  }
  try {
    const { payload } = await jwtVerify(token, key);
    return typeof payload.sub === "string" && typeof payload.iat === "number"
      ? { userId: payload.sub, issuedAt: payload.iat }
      : null;
  } catch {
    return null;
  }
}

export async function setSessionCookie(userId: string, persistent = true) {
  const token = await createSessionToken(userId);
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    // Non-persistent ("keep me signed in" unchecked): no maxAge means the
    // cookie is a browser-session cookie, cleared when the browser closes.
    // The JWT itself still expires after SESSION_DAYS either way.
    ...(persistent ? { maxAge: SESSION_DAYS * 24 * 60 * 60 } : {}),
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

/** The session in this request's cookie, if it's valid. Revocation (a password change) is checked by getCurrentUser. */
export async function getSession(): Promise<Session | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
