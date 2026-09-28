"use client";

import { usePathname } from "next/navigation";

const FOCUS_ROUTES = ["/practicev2/session"];

/** Hides the site footer on focus-mode routes (e.g. an active practice session). */
export function ShellFooter({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (FOCUS_ROUTES.some((route) => pathname.startsWith(route))) return null;
  return children;
}
