"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { Chip } from "./chip";
import { useAuthUser } from "@/lib/auth/context";

/** Quiet Odin-style chrome: search + identity. No notification theater. */
export function AppTopbar({ streakDays = null }: { streakDays?: number | null }) {
  const user = useAuthUser();
  const signedIn = Boolean(user);
  const initial = (user?.name?.trim() || "?").charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center gap-2.5 border-b border-divider bg-white/85 px-4 backdrop-blur-[14px] backdrop-saturate-[1.4] sm:gap-4 sm:px-8">
      <button
        type="button"
        onClick={() => window.dispatchEvent(new CustomEvent("ascend:open-palette"))}
        className="flex min-w-0 flex-1 items-center gap-2.5 rounded-xl border border-card-border-soft bg-[#F3F1FA] px-3.5 py-2.5 text-left text-ink-faint sm:max-w-[460px]"
      >
        <Search size={16} strokeWidth={2.2} />
        <span className="min-w-0 flex-1 truncate text-sm">Search lessons…</span>
        <span className="hidden rounded-md border border-[#E2DDEF] px-1.5 py-0.5 font-mono text-[11px] text-[#B4AECB] sm:inline">
          ⌘K
        </span>
      </button>
      <div className="ml-auto flex flex-none items-center gap-1.5 sm:gap-2.5">
        {signedIn && streakDays != null && streakDays > 0 ? (
          <Chip variant="streak" className="hidden sm:inline-flex">
            <span className="animate-flame inline-block h-[15px] w-3 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-gradient-to-b from-[#FFCE4A] to-[#FF6B4A]" />
            {streakDays}
          </Chip>
        ) : null}
        <Link
          href="/curriculum"
          className="hidden text-[13.5px] font-bold text-ink-secondary hover:text-ink sm:inline"
        >
          Curriculum
        </Link>
        {!signedIn ? (
          <Link
            href="/signin"
            className="hidden text-[13.5px] font-bold text-ink-secondary hover:text-ink sm:inline"
          >
            Sign in
          </Link>
        ) : null}
        <Link
          href={signedIn ? "/profile" : "/signin"}
          className="flex h-[39px] w-[39px] flex-none items-center justify-center rounded-xl bg-brand-gradient font-display font-extrabold text-white shadow-glow"
          title={signedIn ? "Profile" : "Sign in"}
        >
          {signedIn ? initial : "?"}
        </Link>
      </div>
    </header>
  );
}
