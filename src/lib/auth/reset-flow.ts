/**
 * Password-reset flow gates & routes.
 * Flip `RESET_EMAIL_ENABLED` when email + token APIs are live;
 * keep page markup — wire submit handlers to real actions.
 */
export const RESET_EMAIL_ENABLED = false;

export const RESET_HREF = "/reset";
export const RESET_NEW_PASSWORD_HREF = "/reset/new-password";
export const RESET_EXPIRED_HREF = "/reset/expired";

/** Resend cooldown in seconds (UI only until email is wired). */
export const RESET_RESEND_COOLDOWN_SEC = 30;

/** Link lifetime shown in copy (match server when wiring). */
export const RESET_LINK_TTL_MINUTES = 30;
