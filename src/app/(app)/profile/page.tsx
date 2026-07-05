"use client";

import { useState } from "react";
import Link from "next/link";
import { Share2, Flame, Settings, LogOut, Link2 } from "lucide-react";
import { LabeledSidebar } from "@/components/ui/labeled-sidebar";
import { AppTopbar } from "@/components/ui/app-topbar";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { LEVELS, levelIds } from "@/lib/content/schema";
import { BADGES } from "@/lib/achievements-data";
import { useAuthUser } from "@/lib/auth/context";
import { signOutAction } from "@/lib/auth/actions";

const LEVEL_ACCENT: Record<string, string> = {
  "level-00-bits-logic": "bg-level-00",
  "level-01-machine-memory": "bg-level-01",
  "level-02-the-c-language": "bg-level-02",
  "level-03-systems-software": "bg-level-03",
};

const SKILL_LABEL: Record<string, string> = {
  "level-00-bits-logic": "Bits, logic & the CPU",
  "level-01-machine-memory": "Assembly & memory model",
  "level-02-the-c-language": "C & pointers",
  "level-03-systems-software": "Processes & syscalls",
};

const LEVEL_DONE: Record<string, number> = {
  "level-00-bits-logic": 5,
  "level-01-machine-memory": 6,
  "level-02-the-c-language": 2,
  "level-03-systems-software": 0,
};

const earnedBadges = BADGES.filter((b) => b.status === "earned");

function GitHubGlyph() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

const PASSED_PROJECTS = [
  {
    id: "shellforge",
    name: "Shellforge",
    score: "90/100",
    gradient: "from-[#7B4DFF] to-[#C13AE0]",
    description: "A working command-line shell — parse input, spawn processes, wire up pipes, handle signals.",
    tags: ["C", "processes", "pipes"],
    date: "Jul 4",
    resultHref: "/projects/shellforge/result?outcome=passed",
    briefHref: "/projects/shellforge",
  },
];

export default function ProfilePage() {
  const [copied, setCopied] = useState(false);
  const user = useAuthUser();
  const displayName = user?.name || "Amine El Khaldi";
  const username = user?.username || "amine";
  const initial = displayName.charAt(0).toUpperCase();

  async function share() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — silently no-op */
    }
  }

  return (
    <div className="flex min-h-screen bg-radial-wash text-ink">
      <LabeledSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar />
        <main className="flex-1 px-5 py-8 sm:px-10">
          <div className="mx-auto w-full max-w-[1160px]">
            {/* Hero */}
            <div className="relative mb-6 overflow-hidden rounded-[24px] bg-gradient-to-br from-[#1B1730] via-[#2A2440] to-[#3A2A55] p-7 text-white shadow-[0_24px_50px_rgba(23,20,31,0.3)] sm:p-8">
              <div className="animate-blob pointer-events-none absolute -right-10 -top-[90px] h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,rgba(123,77,255,0.4),transparent_66%)] blur-[10px]" />
              <div className="relative flex flex-wrap items-start gap-6">
                <div className="relative flex-none">
                  <div className="flex h-[104px] w-[104px] items-center justify-center rounded-[26px] bg-gradient-to-br from-[#7B4DFF] via-[#C13AE0] to-[#FF6B4A] font-display text-[44px] font-extrabold shadow-[0_12px_30px_rgba(123,77,255,0.5)]">
                    {initial}
                  </div>
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/15 bg-[#181528] px-2.5 py-0.5 font-mono text-[11px] font-bold text-[#FFD86B]">
                    LV 8
                  </div>
                </div>
                <div className="min-w-[220px] flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h1 className="font-display text-[28px] font-extrabold tracking-[-0.02em] sm:text-[30px]">
                      {displayName}
                    </h1>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#12E39E]/30 bg-[#12E39E]/[0.16] px-2.5 py-0.5 font-mono text-[11.5px] text-[#12E39E]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#12E39E]" />
                      Learning now
                    </span>
                  </div>
                  <div className="mt-1 font-mono text-[13px] text-[#B9B3D0]">
                    @{username} · The Craft tier · joined Jun 2026
                  </div>
                  <p className="mt-3 max-w-[460px] text-[14.5px] leading-relaxed text-[#D3CFE2]">
                    Learning how computers really work, bottom-up. Currently deep in C &amp;
                    systems — chasing that first working shell.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.12] bg-white/[0.06] px-3 py-1.5 text-[12.5px] text-[#D3CFE2]">
                      <GitHubGlyph />
                      github.com/{username}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.12] bg-white/[0.06] px-3 py-1.5 text-[12.5px] text-[#D3CFE2]">
                      <Link2 size={13} strokeWidth={2.2} />
                      ascend.dev/@{username}
                    </span>
                  </div>
                </div>
                <div className="flex flex-none gap-2.5">
                  <button
                    onClick={share}
                    className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-[#2A2540] shadow-[0_10px_24px_rgba(0,0,0,0.2)] transition-transform hover:-translate-y-0.5"
                  >
                    <Share2 size={15} strokeWidth={2.3} />
                    {copied ? "Link copied!" : "Share"}
                  </button>
                  <Link
                    href="/settings"
                    title="Settings"
                    className="flex h-[39px] w-[39px] flex-none items-center justify-center rounded-xl border border-white/15 bg-white/[0.08] text-white transition-transform hover:-translate-y-0.5"
                  >
                    <Settings size={17} strokeWidth={2.1} />
                  </Link>
                  {user && (
                    <form action={signOutAction}>
                      <button
                        type="submit"
                        title="Sign out"
                        className="flex h-[39px] w-[39px] flex-none items-center justify-center rounded-xl border border-white/15 bg-white/[0.08] text-white transition-transform hover:-translate-y-0.5"
                      >
                        <LogOut size={17} strokeWidth={2.1} />
                      </button>
                    </form>
                  )}
                </div>
              </div>
              {!user && (
                <div className="relative mt-4 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-[12.5px] text-[#B9B3D0]">
                  You&apos;re viewing the demo profile.{" "}
                  <Link href="/signin" className="font-bold text-white underline">
                    Sign in
                  </Link>{" "}
                  to see your own.
                </div>
              )}
              <div className="relative mt-6 flex flex-wrap gap-3 border-t border-white/10 pt-5">
                {[
                  { value: "1,440", label: "Total XP" },
                  { value: "19 / 25", label: "Concepts" },
                  { value: String(PASSED_PROJECTS.length), label: "Projects passed" },
                  {
                    value: (
                      <span className="inline-flex items-center gap-1.5">
                        <Flame size={16} className="fill-current text-[#FF8A4C]" />
                        12
                      </span>
                    ),
                    label: "Day streak",
                  },
                  { value: String(earnedBadges.length), label: "Badges" },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {i > 0 && <div className="h-8 w-px bg-white/10" />}
                    <div>
                      <div className="font-display text-2xl font-extrabold leading-none">{s.value}</div>
                      <div className="mt-1 text-[11.5px] text-[#B9B3D0]">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-start gap-6">
              <div className="flex min-w-0 flex-[100_1_500px] flex-col gap-6">
                <Card hover={false} className="p-6">
                  <div className="mb-4.5 flex items-center justify-between">
                    <div className="font-display text-[17px] font-extrabold">Skills</div>
                    <span className="font-mono text-[12.5px] text-ink-faint">bottom-up</span>
                  </div>
                  <div className="flex flex-col gap-4">
                    {levelIds.map((levelId) => {
                      const level = LEVELS[levelId];
                      const done = LEVEL_DONE[levelId];
                      const pct = Math.round((done / level.totalConcepts) * 100);
                      const status = pct === 100 ? "Mastered" : pct === 0 ? "Learning" : "Advanced";
                      const statusColor =
                        pct === 100 ? "text-[#12A472]" : pct === 0 ? "text-ink-faint" : "text-[#6D46F2]";
                      return (
                        <div key={levelId}>
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-[14.5px] font-semibold text-[#2A2540]">
                              {SKILL_LABEL[levelId]}
                            </span>
                            <span className={cn("font-mono text-[11.5px] font-bold", statusColor)}>{status}</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-[#F0EEF7]">
                            <div
                              className={cn("animate-grow h-full rounded-full", LEVEL_ACCENT[levelId])}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>

                <Card hover={false} className="p-6">
                  <div className="mb-4.5 flex items-center justify-between">
                    <div className="font-display text-[17px] font-extrabold">Projects passed</div>
                    <span className="font-mono text-[12.5px] text-ink-faint">{PASSED_PROJECTS.length} shipped</span>
                  </div>
                  <div className="flex flex-col gap-3.5">
                    {PASSED_PROJECTS.map((p) => (
                      <div key={p.id} className="rounded-2xl border border-[#EEECF6] p-4.5">
                        <div className="flex items-start gap-3.5">
                          <div className={cn("flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-gradient-to-br font-mono text-[13px] font-bold text-white", p.gradient)}>
                            &gt;_
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[15.5px] font-bold text-[#2A2540]">{p.name}</span>
                              <span className="inline-flex items-center gap-1 rounded-full bg-[#E7F8F0] px-2 py-0.5 font-mono text-[10.5px] font-extrabold text-[#0E9E6E]">
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0E9E6E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M20 6 9 17l-5-5" />
                                </svg>
                                {p.score}
                              </span>
                            </div>
                            <p className="my-1.5 text-[13px] leading-relaxed text-ink-secondary">{p.description}</p>
                            <div className="flex flex-wrap items-center gap-2">
                              {p.tags.map((t) => (
                                <span key={t} className="rounded-full bg-xp-bg px-2 py-0.5 font-mono text-[11px] font-semibold text-brand-violet">
                                  {t}
                                </span>
                              ))}
                              <span className="ml-auto font-mono text-[11.5px] text-ink-fainter">{p.date}</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3.5 flex gap-2 border-t border-[#F4F2FA] pt-3.5">
                          <Link
                            href={p.resultHref}
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-[10px] border border-card-border-soft py-2 text-[12.5px] font-bold text-ink-secondary"
                          >
                            <GitHubGlyph />
                            {p.id}
                          </Link>
                          <Link
                            href={p.briefHref}
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-[10px] border border-card-border-soft py-2 text-[12.5px] font-bold text-brand-violet"
                          >
                            View brief
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              <div className="flex w-full min-w-[280px] max-w-[360px] flex-1 flex-col gap-5">
                <Card hover={false} className="p-6">
                  <div className="mb-4.5 flex items-center justify-between">
                    <div className="font-display text-[17px] font-extrabold">Badges</div>
                    <Link href="/achievements" className="text-xs font-bold text-brand-violet">
                      All {earnedBadges.length} →
                    </Link>
                  </div>
                  <div className="grid grid-cols-3 gap-3.5">
                    {earnedBadges.slice(0, 6).map((b) => (
                      <div key={b.id} className="flex flex-col items-center gap-1.5">
                        <div
                          className={cn(
                            "flex h-[58px] w-[58px] items-center justify-center rounded-full shadow-[0_6px_16px_rgba(28,18,64,0.12)]",
                            b.rarity === "legendary"
                              ? "bg-gradient-to-br from-[#FFE08A] via-[#FF8A4C] to-[#FFD86B]"
                              : b.rarity === "rare"
                                ? "bg-gradient-to-br from-[#9A6BF0] via-[#C13AE0] to-[#7B4DFF]"
                                : "bg-gradient-to-br from-[#C6C1D8] via-[#A9A3BC] to-[#C6C1D8]",
                          )}
                        >
                          <div className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-white text-lg text-ink-muted">
                            {b.glyph}
                          </div>
                        </div>
                        <span className="text-center text-[9.5px] leading-tight text-ink-muted">{b.label}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card hover={false} className="p-6">
                  <div className="mb-4.5 flex items-center justify-between">
                    <div className="font-display text-[17px] font-extrabold">Activity</div>
                    <span className="font-mono text-[12.5px] text-ink-faint">8 weeks</span>
                  </div>
                  <div className="flex justify-between gap-1">
                    {Array.from({ length: 8 }).map((_, col) => (
                      <div key={col} className="flex flex-col gap-1">
                        {Array.from({ length: 7 }).map((_, row) => {
                          const seed = (col * 7 + row * 3) % 5;
                          const shade = ["#F0EEF7", "#DDD0FA", "#B79AF2", "#8B5CE8", "#6A3EF0"][seed];
                          return <span key={row} className="block h-4 w-4 rounded" style={{ background: shade }} />;
                        })}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-[#F2F0F8] pt-4">
                    <span className="text-[12.5px] text-ink-muted">
                      <b className="font-display text-[#2A2540]">31</b> active days
                    </span>
                    <div className="flex items-center gap-1 text-[11px] text-ink-faint">
                      Less
                      {["#F0EEF7", "#DDD0FA", "#B79AF2", "#8B5CE8", "#6A3EF0"].map((c) => (
                        <span key={c} className="h-3 w-3 rounded-sm" style={{ background: c }} />
                      ))}
                      More
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
