import { createHash, randomBytes } from "node:crypto";

/** How long a reset link works. The pages quote RESET_LINK_TTL_MINUTES, so they stay in step. */
import { RESET_LINK_TTL_MINUTES } from "./reset-flow";

export const RESET_TTL_MS = RESET_LINK_TTL_MINUTES * 60 * 1000;

/** A fresh reset token for the link, and the hash that's stored (the token itself never is). */
export function newResetToken(): { token: string; hash: string } {
  const token = randomBytes(32).toString("base64url");
  return { token, hash: hashResetToken(token) };
}

export function hashResetToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** Whether a stored token can still be used: not used yet, and not expired. */
export function resetTokenUsable(row: { expiresAt: Date | number; usedAt: Date | number | null }, now: number): boolean {
  if (row.usedAt !== null && row.usedAt !== undefined) return false;
  const expires = row.expiresAt instanceof Date ? row.expiresAt.getTime() : Number(row.expiresAt);
  return now < expires;
}

/** The email with the link, as plain text and simple HTML. */
export function resetEmail(link: string): { subject: string; text: string; html: string } {
  const subject = "Reset your Ascend password";
  const text = [
    "Someone (hopefully you) asked to reset the password for this Ascend account.",
    "",
    `Choose a new password here: ${link}`,
    "",
    `The link works for ${RESET_LINK_TTL_MINUTES} minutes and only once. If you didn't ask for this, you can ignore this email; your password hasn't changed.`,
  ].join("\n");
  const html = `<p>Someone (hopefully you) asked to reset the password for this Ascend account.</p>
<p><a href="${link}">Choose a new password</a></p>
<p>The link works for ${RESET_LINK_TTL_MINUTES} minutes and only once. If you didn't ask for this, you can ignore this email; your password hasn't changed.</p>`;
  return { subject, text, html };
}
