"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/homepage/theme-toggle";
import { brandMarkClass } from "@/components/homepage/landing-styles";
import { cn } from "@/lib/cn";
import { CURRICULUM_HREF, FIRST_LESSON_HREF, SIGNIN_HREF } from "@/lib/routes";

/**
 * Marketing nav — Odin-style destinations + Get Started CTA + theme toggle.
 *
 * Layout: brand | flat links | theme · Sign in · Get Started
 * (No center pill — four links need breathing room.)
 */
const NAV = [
  { href: CURRICULUM_HREF, label: "All Paths" },
  { href: "/#why", label: "About" },
  { href: "/community", label: "Community" },
  { href: "/#open", label: "Support us" },
] as const;

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet/35 focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

export function SiteHeader() {
  const pathname = usePathname();
  const onCommunity = pathname?.startsWith("/community");
  const onCurriculum = pathname?.startsWith("/curriculum");
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-card-border/70 bg-bg/80 backdrop-blur-xl backdrop-saturate-150 dark:bg-bg/75 dark:border-card-border/50">
      <nav
        className="mx-auto flex h-16 w-full min-w-0 max-w-[var(--layout-max)] items-center gap-3 px-4 sm:h-[68px] sm:gap-4 sm:px-8 lg:gap-6"
        aria-label="Primary"
      >
        <Link
          href="/"
          className={cn("flex shrink-0 items-center gap-2.5 rounded-lg", focusRing)}
          onClick={() => setOpen(false)}
        >
          <span className={brandMarkClass}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="m6 15 6-6 6 6" />
              <path d="m6 9 6-6 6 6" opacity=".55" />
            </svg>
          </span>
          <span className="font-display text-[20px] font-extrabold tracking-tight text-ink">
            Ascend
          </span>
        </Link>

        <ul className="hidden flex-1 items-center justify-center gap-0.5 lg:flex">
          {NAV.map((item) => {
            const active =
              (item.href === "/community" && onCommunity) ||
              (item.href === CURRICULUM_HREF && onCurriculum);
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={cn(
                    "inline-flex h-9 items-center rounded-full px-3 text-[13.5px] font-medium transition-colors xl:px-3.5 xl:text-[14px]",
                    focusRing,
                    active
                      ? "bg-xp-bg font-semibold text-xp-text"
                      : "text-ink-secondary hover:bg-black/[0.03] hover:text-ink dark:hover:bg-white/[0.06]",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="ml-auto flex items-center gap-2 sm:gap-2.5">
          <ThemeToggle className="hidden sm:inline-flex" />
          <Link
            href={SIGNIN_HREF}
            className={cn(
              "hidden rounded-full px-3 py-2 text-[14px] font-semibold text-ink-secondary transition-colors hover:text-ink md:inline-flex",
              focusRing,
            )}
          >
            Sign in
          </Link>
          <Button href={FIRST_LESSON_HREF} size="sm" className="hidden sm:inline-flex">
            Get Started
          </Button>
          <button
            type="button"
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-xl border border-card-border bg-bg text-ink transition-colors hover:bg-xp-bg lg:hidden",
              focusRing,
            )}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} strokeWidth={2.2} /> : <Menu size={20} strokeWidth={2.2} />}
          </button>
        </div>
      </nav>

      {open ? (
        <div
          id="mobile-nav"
          className="border-t border-card-border bg-bg px-5 py-5 lg:hidden sm:px-8"
        >
          <ul className="flex flex-col gap-0.5">
            {NAV.map((item) => {
              const active =
                (item.href === "/community" && onCommunity) ||
                (item.href === CURRICULUM_HREF && onCurriculum);
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex rounded-xl px-3.5 py-3 text-[15px] font-semibold transition-colors",
                      active
                        ? "bg-xp-bg text-xp-text"
                        : "text-ink-secondary hover:bg-black/[0.03] hover:text-ink dark:hover:bg-white/[0.06]",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 flex flex-col gap-3 border-t border-card-border pt-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-[13px] font-medium text-ink-muted">Appearance</span>
              <ThemeToggle />
            </div>
            <Link
              href={SIGNIN_HREF}
              onClick={() => setOpen(false)}
              className="rounded-xl px-3.5 py-3 text-center text-[15px] font-semibold text-ink-secondary hover:bg-black/[0.03] hover:text-ink dark:hover:bg-white/[0.06]"
            >
              Sign in
            </Link>
            <Button
              href={FIRST_LESSON_HREF}
              size="md"
              className="w-full"
              onClick={() => setOpen(false)}
            >
              Get Started
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}

/** @deprecated Prefer CURRICULUM_HREF / FIRST_LESSON_HREF from @/lib/routes */
export const LESSON_URL = FIRST_LESSON_HREF;
export const CURRICULUM_URL = CURRICULUM_HREF;
