"use client";

import { usePathname } from "next/navigation";
import { PRACTICE_ROUTES } from "@/lib/practice/routes";

const FOCUS_ROUTES = [PRACTICE_ROUTES.session];

/** Focus-mode routes (an active practice session) hide the sidebar, the footer and the phone tab bar. */
export function isFocusRoute(pathname: string | null): boolean {
  return Boolean(pathname && FOCUS_ROUTES.some((route) => pathname.startsWith(route)));
}

/** Hides the site footer on focus-mode routes (e.g. an active practice session). */
export function ShellFooter({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (isFocusRoute(pathname)) return null;
  return children;
}
