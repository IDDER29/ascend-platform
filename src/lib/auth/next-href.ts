/** Where signing in sends you by default: your Today page. */
export const AFTER_SIGN_IN_HREF = "/dashboard";
/** Where creating an account sends you: pick a daily goal, then the first lesson. */
export const AFTER_SIGN_UP_HREF = "/onboarding";

/**
 * A `next` page to return to after signing in, if it's a page on this site.
 * Anything else (other sites, `//host`, back-slash tricks, the sign-in page itself) gives null.
 */
export function safeNextHref(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const href = raw.trim();
  if (!href.startsWith("/") || href.startsWith("//") || href.includes("\\")) return null;
  if (/[\u0000-\u001f]/.test(href)) return null;
  if (href === "/signin" || href.startsWith("/signin?") || href.startsWith("/signin/")) return null;
  return href;
}
