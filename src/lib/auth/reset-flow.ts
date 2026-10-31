/**
 * Password-reset routes and limits, shared by the pages and the server actions. Whether reset by email
 * is on depends on the email settings (RESEND_API_KEY, EMAIL_FROM), read on the server: see
 * `emailConfigured` in `src/lib/email.ts`; the pages pass it to the views.
 */

export const RESET_HREF = "/reset";
export const RESET_NEW_PASSWORD_HREF = "/reset/new-password";
export const RESET_EXPIRED_HREF = "/reset/expired";

/** Resend cooldown in seconds (UI only until email is wired). */
export const RESET_RESEND_COOLDOWN_SEC = 30;

/** Link lifetime shown in copy (match server when wiring). */
export const RESET_LINK_TTL_MINUTES = 30;

/** The shortest password Ascend accepts, at sign-up and when resetting. */
export const MIN_PASSWORD_LENGTH = 8;
