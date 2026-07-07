"use client";

import { useState } from "react";
import { Lock, Check } from "lucide-react";
import { AppSidebar } from "@/components/ui/sidebar";
import { AppTopbar } from "@/components/ui/app-topbar";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { BADGES, BADGE_STATS, type Badge, type BadgeRarity } from "@/lib/achievements-data";

const RARITY_STYLE: Record<BadgeRarity, { bg: string; text: string; ring: string }> = {
  common: { bg: "bg-[#F5F3FB]", text: "text-[#8A8698]", ring: "from-[#C6C1D8] via-[#A9A3BC] to-[#C6C1D8]" },
  rare: { bg: "bg-[#F4F0FE]", text: "text-[#6D46F2]", ring: "from-[#9A6BF0] via-[#C13AE0] to-[#7B4DFF]" },
  legendary: { bg: "bg-[#FEF7E6]", text: "text-[#C77A0A]", ring: "from-[#FFE08A] via-[#FF8A4C] to-[#FFD86B]" },
};

const FILTERS = [
  { key: "all", label: "All", count: BADGE_STATS.total },
  { key: "earned", label: "Earned", count: BADGE_STATS.earned },
  { key: "in-progress", label: "In progress", count: BADGE_STATS.inProgress },
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
      <div className={cn("mb-1 text-[15px] font-bold", earned ? "text-[#2A2540]" : "text-[#8A8698]")}>
        {badge.label}
      </div>
      <div className="min-h-[36px] text-[12.5px] leading-relaxed text-ink-faint">
        {badge.description}
      </div>
      <div className="mt-3 flex items-center justify-center gap-2 border-t border-[#F4F2FA] pt-3">
        <span className={cn("rounded-full px-2.5 py-0.5 font-mono text-[10px] font-extrabold uppercase tracking-[0.04em]", rarity.bg, rarity.text)}>
          {badge.rarity}
        </span>
        {earned ? (
          <span className="inline-flex items-center gap-1 font-mono text-[11.5px] text-[#12B981]">
            <Check size={12} strokeWidth={3} /> {badge.meta}
          </span>
        ) : (
          <span className="font-mono text-[11.5px] text-[#B0ACBC]">{badge.meta}</span>
        )}
      </div>
    </div>
  );
}

export default function AchievementsPage() {
  const [filter, setFilter] = useState<FilterKey>("all");
  const inProgressBadges = BADGES.filter((b) => b.status === "in-progress");

  const visible = BADGES.filter((b) => {
    if (filter === "all") return true;
    if (filter === "rare") return b.rarity === "rare" || b.rarity === "legendary";
    return b.status === filter;
  });

  return (
    <div className="flex min-h-screen bg-radial-wash text-ink">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar />
        <main className="flex-1 px-5 py-8 sm:px-10">
          <div className="mx-auto w-full max-w-[1240px]">
            <div className="mb-2 font-mono text-xs text-ink-secondary">
              You / <span className="text-brand-violet">Achievements</span>
            </div>
            <h1 className="mb-1.5 font-display text-[30px] font-extrabold leading-tight tracking-[-0.032em] sm:text-[33px]">
              Achievements
            </h1>
            <p className="mb-6 max-w-[560px] text-[15px] text-ink-secondary">
              Badges you&apos;ve earned along the climb — and the ones still waiting.
            </p>

            {/* Hero banner */}
            <div className="relative mb-6 overflow-hidden rounded-[24px] bg-gradient-to-br from-[#1B1730] via-[#2A2440] to-[#3A2A55] p-7 text-white shadow-[0_24px_50px_rgba(23,20,31,0.3)] sm:p-8">
              <div className="animate-blob pointer-events-none absolute -right-10 -top-[70px] h-[290px] w-[290px] rounded-full bg-[radial-gradient(circle,rgba(123,77,255,0.4),transparent_66%)] blur-[10px]" />
              <div className="relative flex flex-wrap items-center gap-8">
                <div className="flex items-center gap-4.5">
                  <div className="relative h-[92px] w-[92px] flex-none">
                    <svg viewBox="0 0 120 120" width="92" height="92" className="-rotate-90">
                      <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,.16)" strokeWidth="11" />
                      <circle
                        cx="60"
                        cy="60"
                        r="54"
                        fill="none"
                        stroke="url(#achRing)"
                        strokeWidth="11"
                        strokeLinecap="round"
                        strokeDasharray="339"
                        strokeDashoffset={339 - (339 * BADGE_STATS.earned) / BADGE_STATS.total}
                        className="animate-grow"
                      />
                      <defs>
                        <linearGradient id="achRing" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0" stopColor="#FFD86B" />
                          <stop offset="1" stopColor="#FF6B4A" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-display text-[22px] font-extrabold leading-none">{BADGE_STATS.earned}</span>
                      <span className="font-mono text-[9.5px] text-[#B9B3D0]">/ {BADGE_STATS.total}</span>
                    </div>
                  </div>
                  <div>
                    <div className="font-display text-[22px] font-extrabold leading-tight">Badge collector</div>
                    <div className="mt-1 text-[13.5px] text-[#B9B3D0]">
                      {Math.round((BADGE_STATS.earned / BADGE_STATS.total) * 100)}% of all badges unlocked
                    </div>
                  </div>
                </div>
                <div className="ml-auto flex flex-wrap gap-6">
                  <div>
                    <div className="font-display text-[26px] font-extrabold leading-none text-[#FFD86B]">{BADGE_STATS.earned}</div>
                    <div className="mt-1 text-xs text-[#9990B8]">Earned</div>
                  </div>
                  <div>
                    <div className="font-display text-[26px] font-extrabold leading-none text-[#C6A6FF]">{BADGE_STATS.inProgress}</div>
                    <div className="mt-1 text-xs text-[#9990B8]">In progress</div>
                  </div>
                  <div>
                    <div className="font-display text-[26px] font-extrabold leading-none text-[#12E39E]">+{BADGE_STATS.badgeXp}</div>
                    <div className="mt-1 text-xs text-[#9990B8]">Badge XP</div>
                  </div>
                  <div>
                    <div className="font-display text-[26px] font-extrabold leading-none text-[#FF9A5C]">1</div>
                    <div className="mt-1 text-xs text-[#9990B8]">Rare badge</div>
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
                  <span className={cn("font-mono text-[11px]", filter === f.key ? "text-white/70" : "text-ink-faint")}>
                    {f.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Almost there */}
            <Card hover={false} className="mb-6 p-6">
              <div className="mb-4 flex items-center gap-2.5">
                <div className="font-display text-[17px] font-extrabold">Almost there</div>
                <span className="rounded-full bg-[#F3F1F8] px-2.5 py-0.5 font-mono text-[11px] text-ink-muted">
                  {inProgressBadges.length} in progress
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {inProgressBadges.map((b) => {
                  const rarity = RARITY_STYLE[b.rarity];
                  return (
                    <div key={b.id} className="rounded-2xl border border-[#EEECF6] p-4.5">
                      <div className="mb-3.5 flex items-center gap-3">
                        <div className={cn("flex h-[46px] w-[46px] flex-none items-center justify-center rounded-[13px] text-xl", rarity.bg, rarity.text)}>
                          {b.glyph}
                        </div>
                        <div className="min-w-0">
                          <div className="text-[15px] font-bold text-[#2A2540]">{b.label}</div>
                          <div className="text-[12px] leading-tight text-ink-faint">{b.description}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="h-[7px] flex-1 overflow-hidden rounded-full bg-[#F0EEF7]">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#7B4DFF] to-[#C13AE0]"
                            style={{ width: `${b.progressPct}%` }}
                          />
                        </div>
                        <span className="whitespace-nowrap font-mono text-[11.5px] text-ink-faint">{b.meta}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* All badges grid */}
            <div className="mb-4 flex items-center gap-2">
              <div className="font-display text-lg font-extrabold">All badges</div>
              <span className="font-mono text-[13px] text-ink-faint">· {visible.length}</span>
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
      </div>
    </div>
  );
}
