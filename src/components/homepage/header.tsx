"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const LESSON_HREF = "/curriculum/level-02-the-c-language/what-a-pointer-really-is";

export function SiteHeader() {
  const pathname = usePathname();
  const onCommunity = pathname?.startsWith("/community");

  return (
    <nav className="sticky top-0 z-40 border-b border-black/[0.06] bg-white/80 backdrop-blur-[14px] backdrop-saturate-[1.4]">
      <div className="mx-auto flex h-[74px] w-full max-w-[1200px] items-center gap-3 px-6 sm:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[11px] bg-brand-gradient shadow-glow">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 15 6-6 6 6" />
              <path d="m6 9 6-6 6 6" opacity=".55" />
            </svg>
          </div>
          <span className="font-display text-[21px] font-extrabold tracking-tight">Ascend</span>
        </Link>
        <div className="ml-6 hidden items-center gap-6 text-[14.5px] font-medium text-ink-secondary md:flex">
          <Link href="/curriculum" className="hover:text-ink">Curriculum</Link>
          <a href="/#why" className="hover:text-ink">Why Ascend</a>
          <a href="/#how" className="hover:text-ink">How it works</a>
          <Link href="/community" className={cn("hover:text-ink", onCommunity && "font-bold text-ink")}>
            Community
          </Link>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Link href="/signin" className="hidden text-[14.5px] font-semibold text-ink-secondary hover:text-ink sm:inline">
            Sign in
          </Link>
          <Button href={LESSON_HREF} variant="dark" size="sm">
            Start free
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Button>
        </div>
      </div>
    </nav>
  );
}

export const LESSON_URL = LESSON_HREF;
