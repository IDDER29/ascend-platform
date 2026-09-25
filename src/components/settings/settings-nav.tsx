"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, KeyRound, SlidersHorizontal, Palette } from "lucide-react";
import { cn } from "@/lib/cn";

export const SETTINGS_NAV = [
  {
    href: "/settings",
    label: "Public profile",
    shortLabel: "Profile",
    description: "Name and bio",
    icon: User,
    match: (path: string) => path === "/settings",
  },
  {
    href: "/settings/account",
    label: "Account",
    shortLabel: "Account",
    description: "Email and security",
    icon: KeyRound,
    match: (path: string) => path.startsWith("/settings/account"),
  },
  {
    href: "/settings/preferences",
    label: "Preferences",
    shortLabel: "Prefs",
    description: "Pace and alerts",
    icon: SlidersHorizontal,
    match: (path: string) => path.startsWith("/settings/preferences"),
  },
  {
    href: "/settings/appearance",
    label: "Appearance",
    shortLabel: "Theme",
    description: "Light or dark",
    icon: Palette,
    match: (path: string) => path.startsWith("/settings/appearance"),
  },
] as const;

export function SettingsNav() {
  const pathname = usePathname() ?? "/settings";

  return (
    <nav aria-label="Settings sections">
      {/* Mobile chips */}
      <div className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 lg:hidden">
        {SETTINGS_NAV.map((item) => {
          const active = item.match(pathname);
          return (
            <Link
              key={`m-${item.href}`}
              href={item.href}
              prefetch
              aria-label={item.label}
              className={cn(
                "flex-none rounded-full px-3.5 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.07em] transition-colors",
                active
                  ? "bg-xp-bg text-xp-text"
                  : "bg-elevated/80 text-ink-fainter hover:text-ink",
              )}
            >
              {item.shortLabel}
            </Link>
          );
        })}
      </div>

      {/* Desktop rail — GitHub-quiet */}
      <div className="hidden lg:block">
        <p className="mb-2 px-3 font-mono text-[10.5px] font-bold uppercase tracking-[0.12em] text-ink-fainter">
          Sections
        </p>
        <ul className="flex flex-col gap-0.5 border-l border-divider">
          {SETTINGS_NAV.map((item) => {
            const active = item.match(pathname);
            const Icon = item.icon;
            return (
              <li key={item.href} className="-ml-px">
                <Link
                  href={item.href}
                  prefetch
                  className={cn(
                    "group flex items-start gap-2.5 border-l-2 py-2 pl-3 pr-2 transition-colors",
                    active
                      ? "border-brand-violet bg-xp-bg/60 text-xp-text"
                      : "border-transparent text-ink-secondary hover:border-divider hover:bg-elevated/50 hover:text-ink",
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon
                    size={15}
                    strokeWidth={2.1}
                    className={cn(
                      "mt-0.5 flex-none transition-colors",
                      active
                        ? "text-xp-text"
                        : "text-ink-fainter group-hover:text-ink-secondary",
                    )}
                    aria-hidden
                  />
                  <span className="min-w-0">
                    <span className="block text-[13.5px] font-bold leading-tight">
                      {item.label}
                    </span>
                    <span
                      className={cn(
                        "mt-0.5 block text-[11.5px] leading-snug",
                        active ? "text-xp-text/75" : "text-ink-fainter",
                      )}
                    >
                      {item.description}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
