"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { CURRICULUM_HREF, FIRST_LESSON_HREF } from "@/lib/routes";

const NAV = [
  { href: CURRICULUM_HREF, label: "Curriculum" },
  { href: "/#explore", label: "How it feels" },
  { href: "/#why", label: "Why Ascend" },
  { href: "/community", label: "Community" },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const onCommunity = pathname?.startsWith("/community");
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 border-b border-black/[0.06] bg-white/80 backdrop-blur-[14px] backdrop-saturate-[1.4]">
      <div className="mx-auto flex h-[74px] w-full max-w-[1200px] items-center gap-3 px-6 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[11px] bg-brand-gradient shadow-glow">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 15 6-6 6 6" />
              <path d="m6 9 6-6 6 6" opacity=".55" />
            </svg>
          </div>
          <span className="font-display text-[21px] font-extrabold tracking-tight">Ascend</span>
        </Link>

        <div className="ml-6 hidden items-center gap-6 text-[14.5px] font-medium text-ink-secondary md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7B4DFF]/40 focus-visible:ring-offset-2 rounded-sm",
                item.href === CURRICULUM_HREF && "font-semibold text-ink",
                item.href === "/community" && onCommunity && "font-bold text-ink",
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <Link
            href="/signin"
            className="text-[14.5px] font-semibold text-ink-secondary hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7B4DFF]/40 focus-visible:ring-offset-2 rounded-sm"
          >
            Sign in
          </Link>
          <Button href={CURRICULUM_HREF} variant="dark" size="sm" className="hidden sm:inline-flex">
            Start free
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Button>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-card-border bg-white text-ink md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7B4DFF]/40 focus-visible:ring-offset-2"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} strokeWidth={2.2} /> : <Menu size={20} strokeWidth={2.2} />}
          </button>
        </div>
      </div>

      {open ? (
        <div
          id="mobile-nav"
          className="border-t border-black/[0.06] bg-white px-6 py-4 md:hidden"
        >
          <div className="flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-xl px-3 py-3 text-[15px] font-semibold text-ink-secondary hover:bg-[#F8F5FF] hover:text-ink",
                  item.href === "/community" && onCommunity && "bg-[#F8F5FF] text-ink",
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/signin"
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-3 text-[15px] font-semibold text-ink-secondary hover:bg-[#F8F5FF] hover:text-ink"
            >
              Sign in
            </Link>
            <div className="pt-2">
              <Button href={CURRICULUM_HREF} variant="dark" size="md" className="w-full" onClick={() => setOpen(false)}>
                Start free
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </nav>
  );
}

/** @deprecated Prefer CURRICULUM_HREF / FIRST_LESSON_HREF from @/lib/routes */
export const LESSON_URL = FIRST_LESSON_HREF;
export const CURRICULUM_URL = CURRICULUM_HREF;
