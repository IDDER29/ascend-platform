"use client";

import { usePathname } from "next/navigation";
import { PRACTICE_ROUTES } from "@/lib/practice/routes";

const FOCUS_ROUTES = [PRACTICE_ROUTES.session];

/** Hides the site footer on focus-mode routes (e.g. an active practice session). */
export function ShellFooter({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (FOCUS_ROUTES.some((route) => pathname.startsWith(route))) return null;
  return children;
}
