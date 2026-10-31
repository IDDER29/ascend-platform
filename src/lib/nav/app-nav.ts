import { PATHS_HREF } from "@/lib/routes";

export type AppNavId =
  "today" | "paths" | "practice" | "progress" | "profile" | "achievements" | "bookmarks" | "settings";

export type AppNavItem = { id: AppNavId; href: string; label: string };

const ITEMS: Record<AppNavId, AppNavItem> = {
  today: { id: "today", href: "/dashboard", label: "Today" },
  paths: { id: "paths", href: PATHS_HREF, label: "Paths" },
  practice: { id: "practice", href: "/practice", label: "Practice" },
  progress: { id: "progress", href: "/progress", label: "Progress" },
  profile: { id: "profile", href: "/profile", label: "Profile" },
  achievements: { id: "achievements", href: "/achievements", label: "Achievements" },
  bookmarks: { id: "bookmarks", href: "/bookmarks", label: "Bookmarks" },
  settings: { id: "settings", href: "/settings", label: "Settings" },
};

/** The sidebar's two groups. */
export const SIDEBAR_GROUPS: { label: string; items: AppNavItem[] }[] = [
  { label: "Learn", items: [ITEMS.today, ITEMS.paths, ITEMS.practice] },
  { label: "You", items: [ITEMS.progress, ITEMS.profile, ITEMS.achievements, ITEMS.bookmarks, ITEMS.settings] },
];

/** Phone tab bar: the four daily places; everything else sits under "More". */
export const TAB_ITEMS: AppNavItem[] = [ITEMS.today, ITEMS.paths, ITEMS.practice, ITEMS.progress];
export const MORE_ITEMS: AppNavItem[] = [ITEMS.profile, ITEMS.achievements, ITEMS.bookmarks, ITEMS.settings];

const under = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);

/** Whether a nav item is the current place. Lessons and the capstone count as Paths. */
export function isNavActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === PATHS_HREF) {
    return under(pathname, PATHS_HREF) || pathname.startsWith("/lessons/") || under(pathname, "/projects");
  }
  return under(pathname, href);
}

/** "More" is current when the page is one of the items inside it. */
export function isMoreActive(pathname: string | null): boolean {
  return MORE_ITEMS.some((item) => isNavActive(pathname, item.href));
}

/** The Practice badge: nothing at zero, and "99+" past 99. */
export function dueBadge(count: number): string | null {
  if (!Number.isFinite(count) || count <= 0) return null;
  return count > 99 ? "99+" : String(Math.floor(count));
}

/** What a screen reader hears for a nav item with a badge. */
export function navAccessibleName(label: string, count: number): string {
  if (!dueBadge(count)) return label;
  return `${label}, ${count} ${count === 1 ? "card" : "cards"} due`;
}
