import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "ascend_session";
const SESSION_DAYS = 30;

let warnedDevSecret = false;

function getSecretKey() {
  const secret = process.env.AUTH_SECRET;
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

export async function verifySessionToken(token: string): Promise<string | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return typeof payload.sub === "string" ? payload.sub : null;
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

export async function getSessionUserId(): Promise<string | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
