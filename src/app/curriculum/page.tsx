import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getAllLessons } from "@/lib/content/lessons";
import { LEVELS, levelIds, type LevelId } from "@/lib/content/schema";
import { getCurrentUser } from "@/lib/auth/auth";
import { AuthProvider } from "@/lib/auth/context";
import { AppSidebar } from "@/components/ui/sidebar";
import { AppTopbar } from "@/components/ui/app-topbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CurriculumLevelsPanel } from "@/components/curriculum/curriculum-levels-panel";

export const metadata = {
  title: "Curriculum — Ascend",
  description: "The full 24-lesson, 4-level Ascend curriculum.",
};

const CURRENT_LEVEL: LevelId = "level-02-the-c-language";
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

export default async function CurriculumPage() {
  const user = await getCurrentUser();
  const lessons = getAllLessons();
  const currentIndex = lessons.findIndex((l) => l.meta.level === CURRENT_LEVEL && l.meta.order === CURRENT_ORDER);
  const current = lessons[currentIndex];
  const upNext = lessons.slice(currentIndex, currentIndex + 3);

  const lessonsByLevel: Record<string, { level: string; slug: string; title: string; order: number; timeMin: number }[]> = {};
  for (const levelId of levelIds) {
    lessonsByLevel[levelId] = lessons
      .filter((l) => l.meta.level === levelId)
      .map((l) => ({ level: l.meta.level, slug: l.meta.slug, title: l.meta.title, order: l.meta.order, timeMin: l.meta.timeMin }));
  }

  const levelPanelData = levelIds.map((id) => ({
    id,
    name: LEVELS[id].name,
    short: LEVELS[id].short,
    timeLabel: LEVELS[id].timeLabel,
    totalConcepts: LEVELS[id].totalConcepts,
    done: LEVEL_DONE[id],
    accent: LEVEL_ACCENT[id],
  }));

  return (
    <AuthProvider user={user}>
      <div className="flex min-h-screen bg-radial-wash text-ink">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <AppTopbar />
          <main className="flex-1 px-5 py-8 sm:px-10">
            <div className="mx-auto w-full max-w-[1240px]">
              <div className="mb-6 flex flex-wrap items-end justify-between gap-6">
                <div>
                  <div className="mb-2 font-mono text-xs text-ink-fainter">
                    Learn / <span className="text-brand-violet">Curriculum</span>
                  </div>
                  <h1 className="mb-1.5 font-display text-[30px] font-extrabold leading-tight tracking-[-0.032em] sm:text-[33px]">
                    The path to the machine
                  </h1>
                  <p className="text-[15.5px] text-ink-secondary">
                    Four levels, bottom-up — from single bits to real, working systems.
                  </p>
                </div>
                <div className="flex flex-none rounded-[13px] bg-[#EAE7F4] p-[3px]">
                  <span className="inline-flex items-center gap-1.5 rounded-[10px] bg-white px-4 py-2.5 text-[13.5px] font-bold text-[#5A32D6] shadow-[0_2px_6px_rgba(24,21,40,0.08)]">
                    Path
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-4 py-2.5 text-[13.5px] font-semibold text-ink-fainter">
                    Grid
                  </span>
                </div>
              </div>

              {current && (
                <div className="relative mb-6 overflow-hidden rounded-[22px] bg-gradient-to-br from-[#6A3EF0] via-[#9A34D6] to-[#FF6B4A] p-7 text-white shadow-[0_22px_46px_rgba(106,62,240,0.3)]">
                  <div className="animate-blob pointer-events-none absolute -right-8 -top-[70px] h-[280px] w-[280px] rounded-full bg-white/[0.13] blur-[9px]" />
                  <div className="relative flex flex-wrap items-center gap-6">
                    <span className="flex h-[54px] w-[54px] flex-none items-center justify-center rounded-2xl border border-white/[0.28] bg-white/[0.16] font-mono text-lg font-bold">
                      *p
                    </span>
                    <div className="min-w-[200px] flex-1">
                      <div className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.1em] opacity-85">
                        Pick up where you left off
                      </div>
                      <div className="mb-1 font-display text-[22px] font-extrabold tracking-tight">{current.meta.title}</div>
                      <div className="text-[13px] opacity-90">
                        {LEVELS[CURRENT_LEVEL].name} · {current.meta.timeMin - Math.round(current.meta.timeMin * 0.38)} min left
                      </div>
                    </div>
                    <div className="flex flex-none items-center gap-4">
                      <div className="flex items-center gap-2.5">
                        <div className="h-2 w-[130px] overflow-hidden rounded-full bg-white/[0.26]">
                          <div className="animate-grow h-full rounded-full bg-white" style={{ width: "62%" }} />
                        </div>
                        <span className="font-mono text-[12.5px] font-bold">62%</span>
                      </div>
                      <Button href={`/curriculum/${current.meta.level}/${current.meta.slug}`} variant="invert">
                        Continue
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6A3EF0" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14" />
                          <path d="m12 5 7 7-7 7" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-start gap-6">
                <div className="min-w-0 flex-[100_1_520px]">
                  <CurriculumLevelsPanel
                    levels={levelPanelData}
                    lessonsByLevel={lessonsByLevel}
                    currentLevel={CURRENT_LEVEL}
                    currentOrder={CURRENT_ORDER}
                    totalLessons={lessons.length}
                  />
                </div>

                <div className="flex w-full min-w-[290px] max-w-[372px] flex-1 flex-col gap-5">
                  <Card hover={false} className="p-6">
                    <div className="mb-5 flex items-center gap-4">
                      <div
                        className="relative flex h-[78px] w-[78px] flex-none items-center justify-center rounded-full"
                        style={{ background: "conic-gradient(#6D46F2 0 72%, #EDEAF6 0)" }}
                      >
                        <div className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-white">
                          <span className="font-display text-xl font-extrabold">Lv 8</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="font-display text-base font-extrabold">Your progress</div>
                        <div className="mt-0.5 text-[12.5px] text-ink-fainter">560 XP to Level 9</div>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#F0EEF7]">
                          <div className="animate-grow h-full rounded-full bg-gradient-to-r from-[#7B4DFF] to-[#C13AE0]" style={{ width: "72%" }} />
                        </div>
                      </div>
                    </div>
                    <div className="mb-4 flex justify-between">
                      {["M", "T", "W", "T", "F", "S", "S"].map((label, i) => (
                        <div key={i} className="flex flex-col items-center gap-1.5">
                          {i < 4 ? (
                            <span className="flex h-[23px] w-[23px] items-center justify-center rounded-[7px] bg-gradient-to-br from-[#7B4DFF] to-[#C13AE0] text-white">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 6 9 17l-5-5" />
                              </svg>
                            </span>
                          ) : i === 4 ? (
                            <span className="flex h-[23px] w-[23px] items-center justify-center rounded-[7px] border-2 border-[#FF6B4A] bg-white shadow-[0_0_0_3px_rgba(255,107,74,0.15)]">
                              <span className="h-[7px] w-[7px] animate-pulse rounded-full bg-[#FF6B4A]" />
                            </span>
                          ) : (
                            <span className="h-[23px] w-[23px] rounded-[7px] border border-[#E7E4F0] bg-[#F0EEF7]" />
                          )}
                          <span className={i >= 5 ? "text-[9.5px] font-semibold text-[#B7B3C4]" : "text-[9.5px] font-semibold text-[#9A96A8]"}>
                            {label}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-1 rounded-[13px] border border-[#FFE3D8] bg-[#FFF6F2] p-3">
                        <div className="flex items-center gap-1.5">
                          <span className="animate-flame inline-block h-4 w-3 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-gradient-to-b from-[#FFCE4A] to-[#FF6B4A]" />
                          <span className="font-display text-lg font-extrabold text-[#F0562F]">12</span>
                        </div>
                        <div className="mt-0.5 text-[11.5px] text-[#9A8E8A]">day streak</div>
                      </div>
                      <div className="flex-1 rounded-[13px] border border-[#E9E1FB] bg-[#F5F1FE] p-3">
                        <div className="font-display text-lg font-extrabold text-brand-violet">
                          19<span className="text-xs text-[#B0A6D0]">/25</span>
                        </div>
                        <div className="mt-0.5 text-[11.5px] text-[#9A93AE]">concepts done</div>
                      </div>
                    </div>
                  </Card>

                  <Card hover={false} className="p-6">
                    <div className="mb-4.5 flex items-center justify-between">
                      <div className="font-display text-[17px] font-extrabold">Up next</div>
                      <span className="font-mono text-[11.5px] text-ink-fainter">{LEVELS[CURRENT_LEVEL].name}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      {upNext.map((lesson, i) => (
                        <Link
                          key={lesson.meta.slug}
                          href={`/curriculum/${lesson.meta.level}/${lesson.meta.slug}`}
                          className={`-mx-1.5 flex items-center gap-3 rounded-xl px-2.5 py-2.5 ${i === 0 ? "bg-[#FBF3FE]" : "hover:bg-[#FAF9FE]"}`}
                        >
                          <span
                            className={`flex h-8 w-8 flex-none items-center justify-center rounded-[10px] text-xs font-bold ${
                              i === 0 ? "bg-gradient-to-br from-[#C13AE0] to-[#FF6B4A] text-white" : "bg-[#F2F0F8] text-[#A8A3BC]"
                            }`}
                          >
                            {i === 0 ? (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff">
                                <polygon points="6 3 20 12 6 21 6 3" />
                              </svg>
                            ) : (
                              i + 1
                            )}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="truncate text-[13.5px] font-bold text-[#2A2540]">{lesson.meta.title}</div>
                            <div className="font-mono text-[11px] text-ink-fainter">{lesson.meta.timeMin} min · +50 XP</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </Card>

                  <Card hover={false} className="p-6">
                    <div className="mb-4.5 flex items-center justify-between">
                      <div className="font-display text-[17px] font-extrabold">Recent badges</div>
                      <Link href="/achievements" className="flex items-center gap-1 text-xs font-bold text-brand-violet">
                        See all <ChevronRight size={12} />
                      </Link>
                    </div>
                    <div className="mb-4 flex gap-2.5">
                      {[
                        { glyph: "✦", bg: "bg-[#FFF1EC]", fg: "text-[#FF6B4A]" },
                        { glyph: "★", bg: "bg-[#FEF4E1]", fg: "text-[#F59E0B]" },
                        { glyph: "◆", bg: "bg-xp-bg", fg: "text-brand-violet" },
                        { glyph: "▲", bg: "bg-[#E7F8F0]", fg: "text-[#12B981]" },
                      ].map((b, i) => (
                        <div key={i} className={`flex aspect-square flex-1 items-center justify-center rounded-2xl text-xl font-extrabold ${b.bg} ${b.fg}`}>
                          {b.glyph}
                        </div>
                      ))}
                    </div>
                    <div className="rounded-[13px] border border-dashed border-[#DCD7EC] bg-[#FAF9FD] p-3.5">
                      <div className="mb-2 flex justify-between text-xs">
                        <span className="font-bold text-[#2A2540]">Next: Pointer Wizard</span>
                        <span className="font-mono text-ink-fainter">3/4</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-[#EDEAF6]">
                        <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-[#7B4DFF] to-[#C13AE0]" />
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </AuthProvider>
  );
}
