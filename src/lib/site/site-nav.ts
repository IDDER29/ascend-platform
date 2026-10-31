/** The public site's pages: one source for the header, footer and sitemap. */
export const CATALOG_HREF = "/catalog";
export const HOW_IT_WORKS_HREF = "/how-it-works";
export const ABOUT_HREF = "/about";
export const OPEN_SOURCE_HREF = "/open-source";
export const FAQ_HREF = "/faq";

export const SITE_NAV = [
  { href: CATALOG_HREF, label: "Paths" },
  { href: HOW_IT_WORKS_HREF, label: "How it works" },
  { href: ABOUT_HREF, label: "About" },
  { href: OPEN_SOURCE_HREF, label: "Open source" },
  { href: FAQ_HREF, label: "FAQ" },
] as const;

/** Whether a nav link is the page you're on (or a page under it). */
export function isCurrent(href: string, pathname: string | null): boolean {
  if (!pathname) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Where the site is served; set NEXT_PUBLIC_SITE_URL in production for the sitemap and link previews. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
