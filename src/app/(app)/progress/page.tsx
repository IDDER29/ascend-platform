"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ChevronRight, Zap } from "lucide-react";
import { AppSidebar } from "@/components/ui/sidebar";
import { AppTopbar } from "@/components/ui/app-topbar";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { LEVELS, levelIds } from "@/lib/content/schema";

const LEVEL_ACCENT: Record<string, string> = {
  "level-00-bits-logic": "bg-level-00",
  "level-01-machine-memory": "bg-level-01",
  "level-02-the-c-language": "bg-level-02",
  "level-03-systems-software": "bg-level-03",
};

const LEVEL_PROGRESS: Record<string, { done: number; time: string }> = {
  "level-00-bits-logic": { done: 5, time: "2h 10m" },
  "level-01-machine-memory": { done: 6, time: "4h 05m" },
  "level-02-the-c-language": { done: 2, time: "3h 40m" },
  "level-03-systems-software": { done: 0, time: "not started" },
};

const RECENT_COMPLETIONS = [
  { title: "Stack vs heap", href: "/curriculum/level-02-the-c-language/stack-vs-heap", when: "Today", xp: 50, kind: "lesson" as const },
  { title: "Structs & unions", href: "/curriculum/level-02-the-c-language/structs-and-unions", when: "Yesterday", xp: 50, kind: "lesson" as const },
  { title: "Double pointers", href: "/curriculum/level-02-the-c-language/double-pointers", when: "2 days ago", xp: 50, kind: "lesson" as const },
  { title: "Pointers drill · 100%", href: "/practice", when: "3 days ago", xp: 90, kind: "quiz" as const },
];

const XP_POINTS = [130, 122, 108, 112, 88, 74, 52, 40, 18];
const XP_LABELS = ["Jun 6", "Jun 13", "Jun 20", "Jun 27", "Jul 4"];

function xpPath(points: number[], w: number, h: number) {
  const step = w / (points.length - 1);
  return points.map((y, i) => `${(i * step).toFixed(1)},${y.toFixed(1)}`).join(" L");
}

const RANGES = ["This month", "All time"] as const;

export default function ProgressPage() {
  const [range, setRange] = useState<(typeof RANGES)[number]>("This month");
  const line = xpPath(XP_POINTS, 760, 160);

  return (
    <div className="flex min-h-screen bg-radial-wash text-ink">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar />
        <main className="flex-1 px-5 py-8 sm:px-10">
          <div className="mx-auto w-full max-w-[1240px]">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-5">
              <div>
                <h1 className="mb-1.5 font-display text-[26px] font-extrabold leading-tight tracking-[-0.028em] sm:text-[29px]">
                  Your progress
                </h1>
                <p className="text-[14.5px] text-ink-secondary">
                  Every concept, every session — the whole climb, measured.
                </p>
              </div>
              <div className="inline-flex rounded-[11px] bg-[#EDEAF6] p-[3px]">
                {RANGES.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRange(r)}
                    className={cn(
                      "rounded-[9px] px-4 py-2 text-[13px] font-bold transition-colors",
                      range === r
                        ? "bg-white text-[#2A2540] shadow-[0_4px_10px_rgba(28,18,64,0.08)]"
                        : "text-[#7A7590]",
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5 flex flex-wrap gap-4">
              {[
                { value: range === "This month" ? "14h 20m" : "62h 45m", label: "Time studied" },
                { value: "19/25", label: "Concepts mastered" },
                { value: "96%", label: "Avg quiz accuracy" },
                { value: "18 days", label: "Longest streak" },
              ].map((s) => (
                <Card key={s.label} className="flex-[1_1_210px] p-5">
                  <div className="font-display text-[26px] font-extrabold leading-none tracking-tight">
                    {s.value}
                  </div>
                  <div className="mt-1 text-[12.5px] text-ink-muted">{s.label}</div>
                </Card>
              ))}
            </div>

            <Card hover={false} className="mb-5 p-6">
              <div className="mb-1.5 flex items-center justify-between">
                <div className="font-display text-[16.5px] font-extrabold">XP over time</div>
                <span className="rounded-full bg-[#E7F8F0] px-2.5 py-0.5 font-mono text-xs text-[#12A472]">
                  ▲ 22% vs last month
                </span>
              </div>
              <svg viewBox="0 0 760 160" width="100%" height="160" preserveAspectRatio="none" className="block overflow-visible">
                <defs>
                  <linearGradient id="pxp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#7B4DFF" stopOpacity=".28" />
                    <stop offset="1" stopColor="#7B4DFF" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={`M0 160 L${line} L760 160 Z`} fill="url(#pxp)" />
                <path
                  d={`M${line}`}
                  fill="none"
                  stroke="#7B4DFF"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-grow"
                />
                <circle cx="760" cy={XP_POINTS[XP_POINTS.length - 1]} r="4.5" fill="#7B4DFF" />
              </svg>
              <div className="mt-1.5 flex justify-between font-mono text-[11px] text-ink-fainter">
                {XP_LABELS.map((l) => (
                  <span key={l}>{l}</span>
                ))}
              </div>
            </Card>

            <div className="flex flex-wrap items-start gap-5">
              <div className="min-w-0 flex-[2_1_460px]">
                <Card hover={false} className="p-6">
                  <div className="mb-4 font-display text-[16.5px] font-extrabold">Mastery by level</div>
                  <div className="flex flex-col gap-3.5">
                    {levelIds.map((levelId) => {
                      const level = LEVELS[levelId];
                      const progress = LEVEL_PROGRESS[levelId];
                      const pct = Math.round((progress.done / level.totalConcepts) * 100);
                      const notStarted = progress.done === 0;
                      return (
                        <div key={levelId} className={notStarted ? "opacity-55" : ""}>
                          <div className="mb-1.5 flex justify-between text-[13.5px]">
                            <span className="font-bold text-[#2A2540]">
                              {levelId.slice(6, 8)} · {level.name}
                            </span>
                            <span className="font-mono text-xs text-ink-muted">
                              {progress.done}/{level.totalConcepts} · {progress.time}
                            </span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-[#F0EEF7]">
                            <div
                              className={cn("h-full rounded-full", LEVEL_ACCENT[levelId])}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>

              <div className="min-w-[280px] flex-[1_1_300px]">
                <Card hover={false} className="p-6">
                  <div className="mb-3.5 font-display text-[16.5px] font-extrabold">Recent completions</div>
                  <div className="flex flex-col gap-0.5">
                    {RECENT_COMPLETIONS.map((c) => (
                      <Link
                        key={c.title}
                        href={c.href}
                        className="-mx-1.5 flex items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-[#FAF9FE]"
                      >
                        <span
                          className={cn(
                            "flex h-[30px] w-[30px] flex-none items-center justify-center rounded-[9px]",
                            c.kind === "lesson" ? "bg-[#E7F8F0] text-[#12A472]" : "bg-[#FEF4E1] text-[#E0900A]",
                          )}
                        >
                          {c.kind === "lesson" ? (
                            <Check size={15} strokeWidth={2.6} />
                          ) : (
                            <Zap size={13} strokeWidth={2.4} />
                          )}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-[13px] font-bold text-[#2A2540]">{c.title}</div>
                          <div className="font-mono text-[11px] text-ink-faint">
                            {c.when} · +{c.xp} XP
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Link
                    href="/curriculum"
                    className="mt-3 flex items-center justify-center gap-1 border-t border-[#F2F0F8] pt-3 text-[12.5px] font-bold text-brand-violet"
                  >
                    View full curriculum <ChevronRight size={13} />
                  </Link>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
