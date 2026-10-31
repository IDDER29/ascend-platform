"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const SETTINGS_SECTIONS = [
  { href: "/settings", label: "Profile" },
  { href: "/settings/preferences", label: "Daily goal" },
  { href: "/settings/appearance", label: "Appearance" },
  { href: "/settings/account", label: "Account" },
] as const;

/** Settings' sections: a column beside the content on wide screens, a row of pills on phones. */
export function SettingsNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Settings sections" className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
      <ul className="m-0 flex list-none gap-1.5 p-0 md:flex-col">
        {SETTINGS_SECTIONS.map((s) => {
          const current = pathname === s.href;
          return (
            <li key={s.href} className="shrink-0">
              <Link
                href={s.href}
                aria-current={current ? "page" : undefined}
                className={`flex min-h-11 items-center rounded-full px-4 text-[15px] no-underline md:rounded-xl ${
                  current
                    ? "bg-[var(--coach-ink)] font-semibold text-[var(--coach-bg)]"
                    : "font-medium text-[var(--coach-ink-secondary)] hover:bg-[var(--coach-tint-neutral-bg)] hover:text-[var(--coach-ink)]"
                }`}
              >
                {s.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
