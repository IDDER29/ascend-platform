"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { Chip } from "./chip";
import { NotificationsBell } from "./notifications-bell";
import { useAuthUser } from "@/lib/auth/context";

export function AppTopbar() {
  const user = useAuthUser();
  const initial = (user?.name || "Amine").charAt(0).toUpperCase();
  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center gap-2.5 border-b border-divider bg-white/85 px-4 backdrop-blur-[14px] backdrop-saturate-[1.4] sm:gap-4 sm:px-8">
      <button
        onClick={() => window.dispatchEvent(new CustomEvent("ascend:open-palette"))}
        className="flex min-w-0 flex-1 items-center gap-2.5 rounded-xl border border-card-border-soft bg-[#F3F1FA] px-3.5 py-2.5 text-left text-ink-faint sm:max-w-[460px]"
      >
        <Search size={16} strokeWidth={2.2} />
        <span className="min-w-0 flex-1 truncate text-sm">Search concepts, projects, badges…</span>
        <span className="hidden rounded-md border border-[#E2DDEF] px-1.5 py-0.5 font-mono text-[11px] text-[#B4AECB] sm:inline">
          ⌘K
        </span>
      </button>
      <div className="ml-auto flex flex-none items-center gap-1.5 sm:gap-2.5">
        <Chip variant="streak" className="hidden sm:inline-flex">
          <span className="animate-flame inline-block h-[15px] w-3 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-gradient-to-b from-[#FFCE4A] to-[#FF6B4A]" />
          12
        </Chip>
        <Chip variant="xp" className="hidden sm:inline-flex">
          <span className="h-3.5 w-3.5 rounded-[5px] bg-brand-gradient" />
          1,440
        </Chip>
        <NotificationsBell />
        <Link
          href="/profile"
          title="View profile"
          aria-label="View profile"
          className="flex h-[39px] w-[39px] flex-none items-center justify-center rounded-xl bg-brand-gradient font-display font-extrabold text-white shadow-glow"
        >
          {initial}
        </Link>
      </div>
    </header>
  );
}
