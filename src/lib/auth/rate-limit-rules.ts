/**
 * Rate-limit rules for account actions, kept pure so they're easy to test. A rule is a key (what is
 * being limited, e.g. sign-ins for one email) with a number of attempts allowed in a time window.
 */

export type Limit = { key: string; limit: number; windowMs: number };

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;

const norm = (s: string) => s.trim().toLowerCase();

/** The limits for each action: per email (guessing one account) and per IP (spraying many). */
export const LIMITS = {
  signIn: (email: string, ip: string): Limit[] => [
    { key: `signin:email:${norm(email)}`, limit: 10, windowMs: 15 * MINUTE },
    { key: `signin:ip:${ip}`, limit: 50, windowMs: 15 * MINUTE },
  ],
  signUp: (ip: string): Limit[] => [{ key: `signup:ip:${ip}`, limit: 10, windowMs: HOUR }],
  resetRequest: (email: string, ip: string): Limit[] => [
    { key: `reset:email:${norm(email)}`, limit: 3, windowMs: HOUR },
    { key: `reset:ip:${ip}`, limit: 20, windowMs: HOUR },
  ],
  resetSubmit: (ip: string): Limit[] => [{ key: `reset-submit:ip:${ip}`, limit: 20, windowMs: HOUR }],
};

/** Whether one more attempt would go over the limit, given the times of earlier attempts. */
export function overLimit(earlier: number[], now: number, rule: Pick<Limit, "limit" | "windowMs">): boolean {
  return earlier.filter((t) => now - t < rule.windowMs).length >= rule.limit;
}

export const TOO_MANY = "Too many attempts. Wait a few minutes, then try again.";

/** The client's IP from the proxy headers Vercel sets; "unknown" when there are none (local dev). */
export function clientIp(get: (name: string) => string | null): string {
  const forwarded = get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || get("x-real-ip")?.trim() || "unknown";
}
