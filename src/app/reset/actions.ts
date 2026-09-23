/**
 * Password-reset server actions — stubs until email + tokens ship.
 * Wire these when flipping RESET_EMAIL_ENABLED in `@/lib/auth/reset-flow`.
 */

"use server";

import { RESET_EMAIL_ENABLED } from "@/lib/auth/reset-flow";

export type ResetActionState = { error?: string; ok?: boolean };

export async function requestPasswordResetAction(
  _prev: ResetActionState,
  formData: FormData,
): Promise<ResetActionState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Enter a valid email address." };
  }
  if (!RESET_EMAIL_ENABLED) {
    // UI flow handles local preview; keep action honest.
    return { ok: true };
  }
  // TODO: create token, send email, always return ok (no account enumeration).
  return { ok: true };
}

export async function resetPasswordAction(
  _prev: ResetActionState,
  formData: FormData,
): Promise<ResetActionState> {
  const token = String(formData.get("token") || "");
  const password = String(formData.get("password") || "");
  const confirm = String(formData.get("confirm") || "");

  if (!token) return { error: "This reset link is invalid or expired." };
  if (password.length < 12) {
    return { error: "Password must be at least 12 characters." };
  }
  if (password !== confirm) return { error: "Passwords don't match." };
  if (!RESET_EMAIL_ENABLED) {
    return { ok: true };
  }
  // TODO: validate token, hash password, invalidate token, create session.
  return { ok: true };
}
