import Link from "next/link";
import { Flame, Zap, CheckCircle2, Award, ChevronRight, Lock } from "lucide-react";
import { getAllLessons } from "@/lib/content/lessons";
import { LEVELS, levelIds } from "@/lib/content/schema";
import { AppSidebar } from "@/components/ui/sidebar";
import { AppTopbar } from "@/components/ui/app-topbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Dashboard — Ascend",
};

const CURRENT_LEVEL: (typeof levelIds)[number] = "level-02-the-c-language";
const CURRENT_ORDER = 3; // "What a pointer really is"

const LEVEL_ACCENT: Record<string, string> = {
  "level-00-bits-logic": "bg-level-00",
  "level-01-machine-memory": "bg-level-01",
  "level-02-the-c-language": "bg-level-02",
  "level-03-systems-software": "bg-level-03",
};

const LEVEL_DONE: Record<string, number> = {
  "level-00-bits-logic": 5,
  "level-01-machine-memory": 6,
  "level-02-the-c-language": 2,
  "level-03-systems-software": 0,
};

function Sparkline({ color, values }: { color: string; values: number[] }) {
  const w = 64;
  const h = 30;
  const max = Math.max(...values);
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - (v / max) * (h - 2) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const line = pts.join(" L");
  const area = `M0,${h} L${line} L${w},${h} Z`;
  const last = pts[pts.length - 1].split(",");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="block opacity-90">
      <path d={area} fill={color} opacity={0.16} />
      <path d={`M${line}`} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r="2.6" fill={color} />
    </svg>
  );
}

export default function DashboardPage() {
  const lessons = getAllLessons();
  const currentIndex = lessons.findIndex(
    (l) => l.meta.level === CURRENT_LEVEL && l.meta.order === CURRENT_ORDER,
  );
  const upNext = lessons.slice(currentIndex, currentIndex + 4);

  return (
    <div className="flex min-h-screen bg-radial-wash text-ink">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar />
        <main className="flex-1 px-5 py-8 sm:px-10">
          <div className="mx-auto w-full max-w-[1240px]">
            {/* Greeting */}
            <div className="mb-6 flex flex-wrap items-end justify-between gap-6">
              <div>
                <div className="mb-2.5 flex items-center gap-2.5 text-[13px] text-ink-secondary">
                  <span className="font-mono">Thursday, 4 July</span>
                  <span className="h-1 w-1 rounded-full bg-[#CFC9DE]" />
                  <span className="flex items-center gap-1 font-bold text-streak-text">
                    <Flame size={14} className="fill-current" /> Day 12
                  </span>
                </div>
                <h1 className="mb-1.5 font-display text-[30px] font-extrabold leading-tight tracking-[-0.032em] sm:text-[33px]">
                  Good afternoon, Amine.
                </h1>
                <p className="text-[15.5px] text-ink-secondary">
                  You&apos;re <b className="text-[#5A32D6]">2 concepts</b> from
                  finishing The C Language — one focused session away.
                </p>
              </div>
              <Button href={`/curriculum/${CURRENT_LEVEL}/${lessons[currentIndex].meta.slug}`} variant="dark">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="6 3 20 12 6 21 6 3" />
                </svg>
                Resume
              </Button>
            </div>

            {/* Hero + goal ring */}
            <div className="mb-5 flex flex-wrap items-stretch gap-5">
              <div className="relative flex-[2_1_520px] overflow-hidden rounded-[24px] bg-gradient-to-br from-[#6A3EF0] via-[#9A34D6] to-[#FF6B4A] p-8 text-white shadow-[0_24px_50px_rgba(106,62,240,0.32)]">
                <div className="animate-blob pointer-events-none absolute -right-10 -top-[90px] h-[320px] w-[320px] rounded-full bg-white/[0.13] blur-[10px]" />
                <div className="relative flex h-full flex-col">
                  <span className="mb-auto font-mono text-[11px] uppercase tracking-[0.12em] opacity-85">
                    Continue learning
                  </span>
                  <div className="mt-6 flex flex-wrap items-end gap-6">
                    <div className="min-w-[230px] flex-1">
                      <div className="mb-3 flex items-center gap-2.5">
                        <span className="flex h-[52px] w-[52px] flex-none items-center justify-center rounded-2xl border border-white/30 bg-white/[0.16] font-mono text-lg font-bold">
                          *p
                        </span>
                        <div className="font-mono text-[11.5px] opacity-80">
                          Level 02 · The C Language · 3 / 8
                        </div>
                      </div>
                      <div className="mb-4 font-display text-[26px] font-extrabold leading-tight tracking-tight sm:text-[28px]">
                        What a pointer really is
                      </div>
                      <div className="flex max-w-[320px] items-center gap-3">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.26]">
                          <div className="animate-grow h-full rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.6)]" style={{ width: "62%" }} />
                        </div>
                        <span className="font-mono text-[12.5px] font-bold">62%</span>
                      </div>
                    </div>
                    <Button
                      href={`/curriculum/${CURRENT_LEVEL}/${lessons[currentIndex].meta.slug}`}
                      variant="invert"
                    >
                      Resume lesson
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#6A3EF0" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>

              <Card className="flex-[1_1_260px]" hover={false}>
                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="font-display text-base font-extrabold">Today&apos;s goal</div>
                    <span className="rounded-full bg-[#E7F8F0] px-2.5 py-0.5 font-mono text-[11px] text-[#12A472]">
                      on track
                    </span>
                  </div>
                  <div className="flex items-center gap-4.5">
                    <div className="relative h-24 w-24 flex-none">
                      <svg viewBox="0 0 120 120" width="96" height="96" className="-rotate-90">
                        <circle cx="60" cy="60" r="52" fill="none" stroke="#F0EEF7" strokeWidth="13" />
                        <circle
                          cx="60"
                          cy="60"
                          r="52"
                          fill="none"
                          stroke="url(#dashRing)"
                          strokeWidth="13"
                          strokeLinecap="round"
                          strokeDasharray="327"
                          strokeDashoffset="98"
                        />
                        <defs>
                          <linearGradient id="dashRing" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0" stopColor="#7B4DFF" />
                            <stop offset="1" stopColor="#C13AE0" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center font-display text-xl font-extrabold">
                        70%
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-2.5 text-[13.5px] text-ink-secondary">
                        <b className="text-[#2A2540]">2 of 3</b> concepts done today.
                      </div>
                      <div className="flex flex-col gap-1.5 text-xs">
                        <div className="flex items-center gap-1.5 text-ink-muted">
                          <span className="flex h-[15px] w-[15px] items-center justify-center rounded-[5px] bg-[#12B981] text-[8px] font-extrabold text-white">
                            ✓
                          </span>
                          Stack vs heap
                        </div>
                        <div className="flex items-center gap-1.5 font-semibold text-[#413D50]">
                          <span className="h-[15px] w-[15px] rounded-[5px] border-2 border-dashed border-[#D3CDE4]" />
                          1 more to go
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Stat cards */}
            <div className="mb-5 flex flex-wrap gap-5">
              {[
                { icon: Flame, bg: "bg-[#FFF1EC]", fg: "text-streak-text", value: "12 days", label: "Current streak", badge: "best 18", color: "#FF6B4A", data: [2, 4, 3, 5, 6, 8, 7, 9, 8, 10] },
                { icon: Zap, bg: "bg-xp-bg", fg: "text-brand-violet", value: "1,440", label: "Total XP", badge: "▲ +120", color: "#7B4DFF", data: [2, 3, 4, 5, 6, 7, 8, 9, 10, 10] },
                { icon: CheckCircle2, bg: "bg-[#E7F8F0]", fg: "text-[#12A472]", value: "19/25", label: "Concepts done", badge: "▲ +3", color: "#12B981", data: [1, 3, 4, 6, 7, 8, 9, 9, 10, 10] },
                { icon: Award, bg: "bg-[#FEF4E1]", fg: "text-[#E0900A]", value: "9", label: "Badges earned", badge: "▲ +2", color: "#F59E0B", data: [1, 2, 3, 3, 4, 5, 6, 7, 8, 10] },
              ].map((s) => (
                <Card key={s.label} className="flex-[1_1_210px] p-5">
                  <div className="mb-3.5 flex items-center justify-between">
                    <span className={`flex h-9 w-9 items-center justify-center rounded-[11px] ${s.bg} ${s.fg}`}>
                      <s.icon size={17} strokeWidth={2.2} />
                    </span>
                    <span className="rounded-full bg-[#F3F1F8] px-2 py-0.5 font-mono text-[11.5px] font-bold text-ink-muted">
                      {s.badge}
                    </span>
                  </div>
                  <div className="flex items-end justify-between gap-2.5">
                    <div>
                      <div className="font-display text-[27px] font-extrabold leading-none tracking-tight">
                        {s.value}
                      </div>
                      <div className="mt-1 text-[12.5px] text-ink-muted">{s.label}</div>
                    </div>
                    <Sparkline color={s.color} values={s.data} />
                  </div>
                </Card>
              ))}
            </div>

            {/* Two-column: up next + climb / activity + achievements */}
            <div className="flex flex-wrap items-start gap-5">
              <div className="flex min-w-0 flex-[100_1_500px] flex-col gap-5">
                <Card hover={false}>
                  <div className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="font-display text-[17px] font-extrabold">
                        Up next in The C Language
                      </div>
                      <Link
                        href="/curriculum"
                        className="flex items-center gap-1 text-[12.5px] font-bold text-brand-violet hover:text-[#5A32D6]"
                      >
                        View path <ChevronRight size={13} />
                      </Link>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      {upNext.map((lesson, i) => {
                        const isCurrent = i === 0;
                        return (
                          <Link
                            key={lesson.meta.slug}
                            href={`/curriculum/${lesson.meta.level}/${lesson.meta.slug}`}
                            className={`-mx-1.5 flex items-center gap-3.5 rounded-[14px] px-3 py-3 ${
                              isCurrent
                                ? "bg-gradient-to-r from-[#FBF3FE] to-white shadow-[inset_3px_0_0_#C13AE0]"
                                : "hover:bg-[#FAF9FE]"
                            }`}
                          >
                            <span
                              className={`flex h-[38px] w-[38px] flex-none items-center justify-center rounded-[11px] font-mono text-[13px] font-extrabold ${
                                isCurrent
                                  ? "bg-level-02 text-white"
                                  : "bg-[#F2F0F8] text-[#A8A3BC]"
                              }`}
                            >
                              {isCurrent ? (
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff">
                                  <polygon points="6 3 20 12 6 21 6 3" />
                                </svg>
                              ) : (
                                i + 1
                              )}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-[14.5px] font-bold text-[#2A2540]">
                                {lesson.meta.title}
                              </div>
                              <div className="mt-0.5 font-mono text-xs text-ink-faint">
                                {lesson.meta.timeMin} min · +50 XP
                              </div>
                            </div>
                            {isCurrent ? (
                              <span className="whitespace-nowrap text-[11.5px] font-bold text-[#C13AE0]">
                                in progress
                              </span>
                            ) : (
                              <span className="h-[22px] w-[22px] flex-none rounded-full border-2 border-[#E4E0F0]" />
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </Card>

                <Card hover={false}>
                  <div className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="font-display text-[17px] font-extrabold">Your climb</div>
                      <span className="font-mono text-[12.5px] text-ink-faint">2 / 4 levels</span>
                    </div>
                    <div className="flex flex-col gap-2.5">
                      {levelIds.map((levelId) => {
                        const level = LEVELS[levelId];
                        const done = LEVEL_DONE[levelId];
                        const pct = Math.round((done / level.totalConcepts) * 100);
                        const isCurrent = levelId === CURRENT_LEVEL;
                        const isLocked = done === 0 && !isCurrent;
                        const firstLesson = lessons.find((l) => l.meta.level === levelId);
                        return (
                          <div
                            key={levelId}
                            className={`flex items-center gap-3.5 rounded-[15px] border p-3.5 ${
                              isCurrent
                                ? "border-[#F3D9EE] bg-gradient-to-r from-[#FDF7FE] to-white"
                                : "border-[#F0EEF6]"
                            } ${isLocked ? "opacity-60" : ""}`}
                          >
                            <div
                              className={`flex h-11 w-11 flex-none items-center justify-center rounded-[13px] ${LEVEL_ACCENT[levelId]} font-display text-base font-extrabold text-white shadow-[0_6px_16px_rgba(0,0,0,0.12)]`}
                            >
                              {done === level.totalConcepts ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M20 6 9 17l-5-5" />
                                </svg>
                              ) : (
                                levelId.slice(6, 8)
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-[15px] font-bold text-[#2A2540]">{level.name}</div>
                              <div className="mt-1.5 flex items-center gap-2.5">
                                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#F0EEF7]">
                                  <div
                                    className={`h-full rounded-full ${LEVEL_ACCENT[levelId]}`}
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                                <span className="font-mono text-[11px] text-ink-faint">
                                  {done}/{level.totalConcepts}
                                </span>
                              </div>
                            </div>
                            {isLocked ? (
                              <Lock size={13} className="flex-none text-ink-fainter" />
                            ) : isCurrent && firstLesson ? (
                              <Link
                                href={`/curriculum/${lessons[currentIndex].meta.level}/${lessons[currentIndex].meta.slug}`}
                                className="flex-none whitespace-nowrap rounded-full bg-level-02 px-4 py-2 text-[12.5px] font-bold text-white shadow-[0_8px_18px_rgba(193,58,224,0.32)] transition-transform hover:-translate-y-0.5"
                              >
                                Continue
                              </Link>
                            ) : (
                              <Link
                                href="/curriculum"
                                className="flex-none whitespace-nowrap rounded-full border border-card-border-soft px-4 py-2 text-[12.5px] font-semibold text-ink-secondary transition-transform hover:-translate-y-0.5"
                              >
                                Review
                              </Link>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Card>
              </div>

              <div className="flex w-full min-w-[290px] max-w-[376px] flex-1 flex-col gap-5">
                <Card hover={false}>
                  <div className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="font-display text-[17px] font-extrabold">Activity</div>
                      <span className="font-mono text-[12.5px] text-ink-faint">8 weeks</span>
                    </div>
                    <div className="flex justify-between gap-1">
                      {Array.from({ length: 8 }).map((_, col) => (
                        <div key={col} className="flex flex-col gap-1">
                          {Array.from({ length: 7 }).map((_, row) => {
                            const seed = (col * 7 + row * 3) % 5;
                            const shade = ["#F0EEF7", "#DDD0FA", "#B79AF2", "#8B5CE8", "#6A3EF0"][seed];
                            return (
                              <span
                                key={row}
                                className="block h-4 w-4 rounded"
                                style={{ background: shade }}
                              />
                            );
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
                  </div>
                </Card>

                <Card hover={false}>
                  <div className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="font-display text-[17px] font-extrabold">Achievements</div>
                      <Link href="/achievements" className="flex items-center gap-1 text-[12.5px] font-bold text-brand-violet hover:text-[#5A32D6]">
                        View all <ChevronRight size={13} />
                      </Link>
                    </div>
                    <div className="mb-4.5 grid grid-cols-4 gap-3">
                      {[
                        { glyph: "✦", bg: "bg-[#FFF1EC]", fg: "text-[#FF6B4A]", label: "First Steps" },
                        { glyph: "◆", bg: "bg-xp-bg", fg: "text-brand-violet", label: "Memory Master" },
                        { glyph: "▲", bg: "bg-[#E7F8F0]", fg: "text-[#12B981]", label: "Week Warrior" },
                        { glyph: "★", bg: "bg-[#FEF4E1]", fg: "text-[#F59E0B]", label: "Night Owl" },
                      ].map((b) => (
                        <div key={b.label} className="flex flex-col items-center gap-1.5">
                          <div className={`flex aspect-square w-full items-center justify-center rounded-[15px] text-xl font-extrabold ${b.bg} ${b.fg}`}>
                            {b.glyph}
                          </div>
                          <span className="text-center text-[9.5px] leading-tight text-ink-muted">
                            {b.label}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-[14px] border border-dashed border-[#DCD7EC] bg-[#FAF9FD] p-3.5">
                      <div className="mb-2 flex items-center gap-2.5">
                        <span className="flex h-7 w-7 flex-none items-center justify-center rounded-lg bg-xp-bg text-sm text-brand-violet">
                          ◆
                        </span>
                        <div className="flex-1 text-[12.5px] font-bold text-[#2A2540]">
                          Next: Pointer Wizard
                        </div>
                        <span className="font-mono text-[11px] text-ink-muted">3/4</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-[#EDEAF6]">
                        <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-[#7B4DFF] to-[#C13AE0]" />
                      </div>
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
