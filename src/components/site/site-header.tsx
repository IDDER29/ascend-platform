"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/homepage/theme-toggle";
import { FIRST_LESSON_HREF, SIGNIN_HREF } from "@/lib/routes";
import { SITE_NAV, isCurrent } from "@/lib/site/site-nav";
import { BrandMark, WRAP } from "./site-ui";

const START =
  "inline-flex h-10 items-center rounded-full bg-[var(--coach-lime)] px-4 text-[14px] font-bold text-[var(--coach-lime-ink)] no-underline shadow-[0_2px_0_var(--coach-lime-shadow)]";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the phone menu on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b-2 border-[var(--coach-border)] bg-[var(--coach-bg)]/90 backdrop-blur-md">
      <nav aria-label="Main" className={`${WRAP} flex h-16 items-center gap-4`}>
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex shrink-0 items-center gap-2.5 rounded-lg text-[var(--coach-ink)] no-underline"
        >
          <BrandMark />
          <span className="font-display text-[20px] font-extrabold tracking-[-0.02em]">Ascend</span>
        </Link>

        <ul className="m-0 hidden flex-1 list-none items-center justify-center gap-1 p-0 lg:flex">
          {SITE_NAV.map((item) => {
            const current = isCurrent(item.href, pathname);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={current ? "page" : undefined}
                  className={`inline-flex h-9 items-center rounded-full px-3.5 text-[14.5px] no-underline ${
                    current
                      ? "bg-[var(--coach-ink)] font-semibold text-[var(--coach-bg)]"
                      : "font-medium text-[var(--coach-ink-secondary)] hover:bg-[var(--coach-tint-neutral-bg)] hover:text-[var(--coach-ink)]"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <ThemeToggle className="hidden sm:inline-flex" />
          <Link
            href={SIGNIN_HREF}
            className="hidden h-10 items-center rounded-full px-3 text-[14.5px] font-semibold text-[var(--coach-ink-secondary)] no-underline hover:text-[var(--coach-ink)] sm:inline-flex"
          >
            Sign in
          </Link>
          <Link href={FIRST_LESSON_HREF} className={START}>
            Start free
          </Link>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] text-[var(--coach-ink)] lg:hidden"
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} strokeWidth={2.2} /> : <Menu size={20} strokeWidth={2.2} />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="site-menu" className="border-t-2 border-[var(--coach-border)] bg-[var(--coach-bg)] lg:hidden">
          <div className={`${WRAP} flex flex-col gap-4 py-4`}>
            <ul className="m-0 flex list-none flex-col gap-1 p-0">
              {SITE_NAV.map((item) => {
                const current = isCurrent(item.href, pathname);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={current ? "page" : undefined}
                      className={`flex min-h-12 items-center rounded-xl px-3.5 text-[16px] font-semibold no-underline ${
                        current
                          ? "bg-[var(--coach-ink)] text-[var(--coach-bg)]"
                          : "text-[var(--coach-ink)] hover:bg-[var(--coach-tint-neutral-bg)]"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="flex items-center justify-between border-t-2 border-[var(--coach-divider)] px-1 pt-4">
              <span className="text-[14px] text-[var(--coach-ink-muted)]">Appearance</span>
              <ThemeToggle />
            </div>
            {/* "Start free" stays in the bar above. */}
            <Link
              href={SIGNIN_HREF}
              onClick={() => setOpen(false)}
              className="inline-flex min-h-12 items-center justify-center rounded-full border-2 border-[var(--coach-border)] text-[15px] font-semibold text-[var(--coach-ink)] no-underline sm:hidden"
            >
              Sign in
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
