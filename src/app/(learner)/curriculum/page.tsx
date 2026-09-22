import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getAllLessons } from "@/lib/content/lessons";
import { LEVELS, levelIds, type LevelId } from "@/lib/content/schema";
import { getCurrentUser } from "@/lib/auth/auth";
import {
  getContinueLesson,
  countCompletedInLevel,
  getStreak,
  listCompletedLessons,
} from "@/lib/progress/queries";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CurriculumLevelsPanel } from "@/components/curriculum/curriculum-levels-panel";
import { PageHeader, HUB_CONTENT_CLASS, HUB_MAIN_CLASS } from "@/components/ui/page-header";

export const metadata = {
  title: "Curriculum — Ascend",
  description: "The full 24-lesson, 4-level Ascend curriculum.",
};

const CURRENT_LEVEL: LevelId = "level-00-bits-logic";
const CURRENT_ORDER = 1; // first lesson — fallback when signed out

const LEVEL_ACCENT: Record<string, string> = {
  "level-00-bits-logic": "bg-level-00",
  "level-01-machine-memory": "bg-level-01",
  "level-02-the-c-language": "bg-level-02",
  "level-03-systems-software": "bg-level-03",
};

export default async function CurriculumPage() {
  const user = await getCurrentUser();
  const lessons = getAllLessons();

  let currentLevel: LevelId = CURRENT_LEVEL;
  let currentOrder = CURRENT_ORDER;
  let levelDone: Record<string, number> = Object.fromEntries(levelIds.map((id) => [id, 0]));
  let totalCompleted = 0;
  let streakCurrent = 0;

  if (user) {
    try {
      const cont = await getContinueLesson(user.id);
      currentLevel = cont.level as LevelId;
      currentOrder = cont.order;
      const [doneCounts, completed, streak] = await Promise.all([
        Promise.all(
          levelIds.map(async (id) => [id, await countCompletedInLevel(user.id, id)] as const),
        ),
        listCompletedLessons(user.id),
        getStreak(user.id),
      ]);
      levelDone = Object.fromEntries(doneCounts);
      totalCompleted = completed.length;
      streakCurrent = streak?.current ?? 0;
    } catch {
      // db unavailable — keep open-path defaults
    }
  }

  const pathPct = lessons.length
    ? Math.round((totalCompleted / lessons.length) * 100)
    : 0;

  const currentIndex = lessons.findIndex(
    (l) => l.meta.level === currentLevel && l.meta.order === currentOrder,
  );
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const current = lessons[safeIndex];
  const upNext = lessons.slice(safeIndex, safeIndex + 3);

  const lessonsByLevel: Record<string, { level: string; slug: string; title: string; order: number; timeMin: number }[]> = {};
  for (const levelId of levelIds) {
    lessonsByLevel[levelId] = lessons
      .filter((l) => l.meta.level === levelId)
      .map((l) => ({
        level: l.meta.level,
        slug: l.meta.slug,
        title: l.meta.title,
        order: l.meta.order,
        timeMin: l.meta.timeMin,
      }));
  }

  const levelPanelData = levelIds.map((id) => ({
    id,
    name: LEVELS[id].name,
    short: LEVELS[id].short,
    timeLabel: LEVELS[id].timeLabel,
    totalConcepts: LEVELS[id].totalConcepts,
    done: levelDone[id] ?? 0,
    accent: LEVEL_ACCENT[id],
  }));

  return (
    <main className={HUB_MAIN_CLASS}>
      <div className={HUB_CONTENT_CLASS}>
        <PageHeader
          eyebrow="Learn / Curriculum"
          title="The path to the machine"
          description="Four levels, bottom-up — from single bits to real, working systems."
        />

              {current && (
                <div className="relative mb-6 overflow-hidden rounded-[22px] bg-gradient-to-br from-[#6A3EF0] via-[#9A34D6] to-[#FF6B4A] p-7 text-white shadow-[0_22px_46px_rgba(106,62,240,0.3)]">
                  <div className="animate-blob pointer-events-none absolute -right-8 -top-[70px] h-[280px] w-[280px] rounded-full bg-white/[0.13] blur-[9px]" />
                  <div className="relative flex flex-wrap items-center gap-6">
                    <span className="flex h-[54px] w-[54px] flex-none items-center justify-center rounded-2xl border border-white/[0.28] bg-white/[0.16] font-mono text-lg font-bold">
                      {String(current.meta.order).padStart(2, "0")}
                    </span>
                    <div className="min-w-[200px] flex-1">
                      <div className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.1em] opacity-85">
                        Pick up where you left off
                      </div>
                      <div className="mb-1 font-display text-[22px] font-extrabold tracking-tight">{current.meta.title}</div>
                      <div className="text-[13px] opacity-90">
                        {LEVELS[current.meta.level].name} · concept {current.meta.order} of{" "}
                        {LEVELS[current.meta.level].totalConcepts}
                      </div>
                    </div>
                    <div className="flex flex-none items-center gap-4">
                      <Button href={`/curriculum/${current.meta.level}/${current.meta.slug}`} variant="invert">
                        {user ? "Continue" : "Start"}
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
                    currentLevel={currentLevel}
                    currentOrder={currentOrder}
                    totalLessons={lessons.length}
                  />
                </div>

                <div className="flex w-full min-w-[290px] max-w-[372px] flex-1 flex-col gap-5">
                  <Card hover={false} className="p-6">
                    <div className="mb-4 font-display text-base font-extrabold">Your progress</div>
                    {user ? (
                      <>
                        <div className="mb-1 flex items-baseline justify-between gap-2">
                          <span className="font-display text-[28px] font-extrabold tracking-tight text-brand-violet">
                            {totalCompleted}
                            <span className="text-base font-bold text-[#B0A6D0]">/{lessons.length}</span>
                          </span>
                          <span className="font-mono text-[12px] text-ink-fainter">{pathPct}% of path</span>
                        </div>
                        <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-[#F0EEF7]">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#7B4DFF] to-[#C13AE0]"
                            style={{ width: `${pathPct}%` }}
                          />
                        </div>
                        <div className="flex gap-3">
                          <div className="flex-1 rounded-[13px] border border-[#FFE3D8] bg-[#FFF6F2] p-3">
                            <div className="font-display text-lg font-extrabold text-[#F0562F]">
                              {streakCurrent}
                            </div>
                            <div className="mt-0.5 text-[11.5px] text-[#9A8E8A]">day streak</div>
                          </div>
                          <div className="flex-1 rounded-[13px] border border-[#E9E1FB] bg-[#F5F1FE] p-3">
                            <div className="font-display text-lg font-extrabold text-brand-violet">
                              {totalCompleted}
                            </div>
                            <div className="mt-0.5 text-[11.5px] text-[#9A93AE]">lessons done</div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="text-[13.5px] leading-relaxed text-ink-secondary">
                        The full path is open.{" "}
                        <Link href="/signin" className="font-bold text-brand-violet hover:underline">
                          Sign in
                        </Link>{" "}
                        to save completed lessons and pick up where you left off.
                      </p>
                    )}
                  </Card>

                  <Card hover={false} className="p-6">
                    <div className="mb-4.5 flex items-center justify-between">
                      <div className="font-display text-[17px] font-extrabold">Up next</div>
                      <span className="font-mono text-[11.5px] text-ink-fainter">{LEVELS[currentLevel].name}</span>
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
                            <div className="font-mono text-[11px] text-ink-fainter">{lesson.meta.timeMin} min</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </Card>

                  <Card hover={false} className="p-6">
                    <div className="mb-2 font-display text-[17px] font-extrabold">How the path works</div>
                    <p className="mb-4 text-[13px] leading-relaxed text-ink-secondary">
                      Every lesson is open. Order is a recommendation — finish earlier levels first if you want the story to land.
                    </p>
                    <Link
                      href="/projects/shellforge"
                      className="inline-flex items-center gap-1 text-[13px] font-bold text-brand-violet hover:underline"
                    >
                      Capstone: Shellforge <ChevronRight size={14} />
                    </Link>
                  </Card>
                </div>
              </div>
            </div>
          </main>
  );
}
