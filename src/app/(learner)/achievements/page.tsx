"use client";

import { useState } from "react";
import { Lock, Check } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  PageHeader,
  HUB_CONTENT_CLASS,
  HUB_MAIN_CLASS,
} from "@/components/ui/page-header";
import {
  BADGES,
  BADGE_STATS,
  type Badge,
  type BadgeRarity,
} from "@/lib/achievements-data";

const RARITY_STYLE: Record<
  BadgeRarity,
  { bg: string; text: string; ring: string }
> = {
  common: {
    bg: "bg-[#F5F3FB]",
    text: "text-[#8A8698]",
    ring: "from-[#C6C1D8] via-[#A9A3BC] to-[#C6C1D8]",
  },
  rare: {
    bg: "bg-[#F4F0FE]",
    text: "text-[#6D46F2]",
    ring: "from-[#9A6BF0] via-[#C13AE0] to-[#7B4DFF]",
  },
  legendary: {
    bg: "bg-[#FEF7E6]",
    text: "text-[#C77A0A]",
    ring: "from-[#FFE08A] via-[#FF8A4C] to-[#FFD86B]",
  },
};

const FILTERS = [
  { key: "all", label: "All", count: BADGE_STATS.total },
  { key: "locked", label: "Locked", count: BADGE_STATS.locked },
  { key: "rare", label: "Rare", count: BADGE_STATS.rare },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

function BadgeCard({ badge }: { badge: Badge }) {
  const rarity = RARITY_STYLE[badge.rarity];
  const earned = badge.status === "earned";

  return (
    <div
      className={cn(
        "rounded-[18px] border bg-white p-5 text-center shadow-[0_6px_20px_rgba(28,18,64,0.05)] transition-transform duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(28,18,64,0.12)]",
        earned
          ? badge.rarity === "common"
            ? "border-[#E7E3F2]"
            : badge.rarity === "rare"
              ? "border-[#C9B8F5]"
              : "border-[#FFD86B]"
          : "border-[#EEECF6] opacity-90",
      )}
    >
      <div className="mb-3.5 flex justify-center">
        {earned ? (
          <div
            className={cn(
              "flex h-[66px] w-[66px] items-center justify-center rounded-full bg-gradient-to-br shadow-[0_8px_20px_rgba(28,18,64,0.16)]",
              rarity.ring,
            )}
          >
            <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-white text-2xl text-ink-muted">
              {badge.glyph}
            </div>
          </div>
        ) : (
          <div className="relative flex h-[66px] w-[66px] items-center justify-center rounded-full border-2 border-dashed border-[#DCD7E8] bg-[#F1EFF6] text-xl text-[#C6C1D4]">
            {badge.glyph}
            <span className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full border border-[#EEECF6] bg-white">
              <Lock size={11} className="text-[#B0ACBC]" strokeWidth={2.3} />
            </span>
          </div>
        )}
      </div>
      <div
        className={cn(
          "mb-1 text-[15px] font-bold",
          earned ? "text-[#2A2540]" : "text-[#8A8698]",
        )}
      >
        {badge.label}
      </div>
      <div className="min-h-[36px] text-[12.5px] leading-relaxed text-ink-faint">
        {badge.description}
      </div>
      <div className="mt-3 flex items-center justify-center gap-2 border-t border-[#F4F2FA] pt-3">
        <span
          className={cn(
            "rounded-full px-2.5 py-0.5 font-mono text-[10px] font-extrabold uppercase tracking-[0.04em]",
            rarity.bg,
            rarity.text,
          )}
        >
          {badge.rarity}
        </span>
        {earned ? (
          <span className="inline-flex items-center gap-1 font-mono text-[11.5px] text-[#12B981]">
            <Check size={12} strokeWidth={3} /> {badge.meta}
          </span>
        ) : (
          <span className="font-mono text-[11.5px] text-[#B0ACBC]">
            {badge.meta}
          </span>
        )}
      </div>
    </div>
  );
}

export default function AchievementsPage() {
  const [filter, setFilter] = useState<FilterKey>("all");
  const visible = BADGES.filter((b) => {
    if (filter === "all") return true;
    if (filter === "rare")
      return b.rarity === "rare" || b.rarity === "legendary";
    return b.status === filter;
  });

  return (
    <main className={HUB_MAIN_CLASS}>
      <div className={HUB_CONTENT_CLASS}>
        <PageHeader
          eyebrow="You / Achievements"
          title="Achievements"
          description="A preview of badges we may award later. Nothing here is earned yet — Ascend doesn't have a badge engine."
        />
        <div className="mb-6 rounded-xl border border-[#E4DBFB] bg-[#F1EDFE] px-4 py-3 text-[13px] leading-relaxed text-[#5A32D6]">
          Catalog only. Marking lessons complete tracks real progress; badges
          are not awarded.
        </div>

        {/* Hero banner */}
        <div className="relative mb-6 overflow-hidden rounded-[24px] bg-gradient-to-br from-[#1B1730] via-[#2A2440] to-[#3A2A55] p-7 text-white shadow-[0_24px_50px_rgba(23,20,31,0.3)] sm:p-8">
          <div className="animate-blob pointer-events-none absolute -right-10 -top-[70px] h-[290px] w-[290px] rounded-full bg-[radial-gradient(circle,rgba(123,77,255,0.4),transparent_66%)] blur-[10px]" />
          <div className="relative flex flex-wrap items-center gap-8">
            <div>
              <div className="font-display text-[22px] font-extrabold leading-tight">
                Badge catalog
              </div>
              <div className="mt-1 text-[13.5px] text-[#B9B3D0]">
                {BADGE_STATS.total} ideas · 0 earned (engine not built)
              </div>
            </div>
            <div className="ml-auto flex flex-wrap gap-6">
              <div>
                <div className="font-display text-[26px] font-extrabold leading-none text-[#FFD86B]">
                  0
                </div>
                <div className="mt-1 text-xs text-[#9990B8]">Earned</div>
              </div>
              <div>
                <div className="font-display text-[26px] font-extrabold leading-none text-[#C6A6FF]">
                  {BADGE_STATS.total}
                </div>
                <div className="mt-1 text-xs text-[#9990B8]">In catalog</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter chips */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[13.5px] font-bold transition-transform hover:-translate-y-0.5",
                filter === f.key
                  ? "bg-[#181528] text-white"
                  : "border border-[#E9E5F4] bg-white text-[#55516A]",
              )}
            >
              {f.label}
              <span
                className={cn(
                  "font-mono text-[11px]",
                  filter === f.key ? "text-white/70" : "text-ink-faint",
                )}
              >
                {f.count}
              </span>
            </button>
          ))}
        </div>

        {/* All badges grid */}
        <div className="mb-4 flex items-center gap-2">
          <div className="font-display text-lg font-extrabold">All badges</div>
          <span className="font-mono text-[13px] text-ink-faint">
            · {visible.length}
          </span>
        </div>
        {visible.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#DCD7EC] bg-[#FAF9FD] p-8 text-center text-[13.5px] text-ink-secondary">
            No badges match this filter.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {visible.map((b) => (
              <BadgeCard key={b.id} badge={b} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
