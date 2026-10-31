/**
 * Password reset: ask for a link by email, then choose a new password with it. Links are single-use,
 * expire after RESET_LINK_TTL_MINUTES, and only a hash of each token is stored. Asking for a link
 * always looks the same, whether or not the email has an account.
 */

"use server";

import { and, eq, isNull } from "drizzle-orm";
import { headers } from "next/headers";
import { after } from "next/server";
import { setNewPassword } from "@/lib/auth/auth";
import { hitRateLimit, requestIp } from "@/lib/auth/rate-limit";
import { LIMITS, TOO_MANY } from "@/lib/auth/rate-limit-rules";
import { MIN_PASSWORD_LENGTH, RESET_NEW_PASSWORD_HREF } from "@/lib/auth/reset-flow";
import { hashResetToken, newResetToken, RESET_TTL_MS, resetEmail, resetTokenUsable } from "@/lib/auth/reset-tokens";
import { db, schema } from "@/lib/db/client";
import { emailConfigured, sendEmail } from "@/lib/email";

export type ResetActionState = { error?: string; ok?: boolean };

const NOT_AVAILABLE = "Password reset by email isn't available yet.";
const BAD_LINK = "This reset link is invalid or expired. Ask for a new one.";

/**
 * The site's own address for the link. Production uses only NEXT_PUBLIC_SITE_URL: building the link
 * from the request's Host header would let anyone who can set that header mail real users a reset link
 * to a site they control. Local development falls back to the request's host.
 */
async function siteUrl(): Promise<string | null> {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (configured) return configured;
  if (process.env.NODE_ENV === "production" || process.env.VERCEL) return null;
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

export async function requestPasswordResetAction(
  _prev: ResetActionState,
  formData: FormData,
): Promise<ResetActionState> {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Enter a valid email address." };
  }
  if (!emailConfigured() || !db) return { error: NOT_AVAILABLE };
  if (await hitRateLimit(LIMITS.resetRequest(email, await requestIp()))) return { error: TOO_MANY };

  // Everything that depends on whether the account exists runs after the response, so a known and an
  // unknown email take the same time to answer (otherwise the delay would reveal who has an account).
  const conn = db;
  const base = await siteUrl();
  after(async () => {
    const user = await conn.query.users.findFirst({ where: eq(schema.users.email, email) });
    if (!user) return;
    // One live link at a time: older unused ones stop working.
    await conn
      .update(schema.passwordResetTokens)
      .set({ usedAt: new Date() })
      .where(and(eq(schema.passwordResetTokens.userId, user.id), isNull(schema.passwordResetTokens.usedAt)));
    const { token, hash } = newResetToken();
    const now = Date.now();
    await conn.insert(schema.passwordResetTokens).values({
      id: crypto.randomUUID(),
      userId: user.id,
      tokenHash: hash,
      expiresAt: new Date(now + RESET_TTL_MS),
      usedAt: null,
      createdAt: new Date(now),
    });
    if (!base) {
      console.error("[reset] NEXT_PUBLIC_SITE_URL is not set, so no reset link can be sent.");
      return;
    }
    const link = `${base}${RESET_NEW_PASSWORD_HREF}?token=${encodeURIComponent(token)}`;
    await sendEmail({ to: email, ...resetEmail(link) });
  });
  // The same answer either way, so this can't be used to find out who has an account.
  return { ok: true };
}

export async function resetPasswordAction(_prev: ResetActionState, formData: FormData): Promise<ResetActionState> {
  const token = String(formData.get("token") || "");
  const password = String(formData.get("password") || "");
  const confirm = String(formData.get("confirm") || "");

  if (!token) return { error: BAD_LINK };
  if (password.length < MIN_PASSWORD_LENGTH) {
    return { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.` };
  }
  if (password !== confirm) return { error: "Passwords don't match." };
  if (!emailConfigured() || !db) return { error: NOT_AVAILABLE };
  if (await hitRateLimit(LIMITS.resetSubmit(await requestIp()))) return { error: TOO_MANY };

  const row = await db.query.passwordResetTokens.findFirst({
    where: eq(schema.passwordResetTokens.tokenHash, hashResetToken(token)),
  });
  if (!row || !resetTokenUsable(row, Date.now())) return { error: BAD_LINK };

  // Use the link up first, so it can't be used twice even if two requests race.
  const used = await db
    .update(schema.passwordResetTokens)
    .set({ usedAt: new Date() })
    .where(and(eq(schema.passwordResetTokens.id, row.id), isNull(schema.passwordResetTokens.usedAt)))
    .returning({ id: schema.passwordResetTokens.id });
  if (used.length === 0) return { error: BAD_LINK };

  // A new password also signs out every existing session.
  await setNewPassword(row.userId, password);
  return { ok: true };
}
