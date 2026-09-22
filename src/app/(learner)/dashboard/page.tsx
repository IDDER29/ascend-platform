import Link from "next/link";
import { Flame, CheckCircle2, ChevronRight } from "lucide-react";
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
import { PageHeader, HUB_CONTENT_CLASS, HUB_MAIN_CLASS } from "@/components/ui/page-header";

export const metadata = {
  title: "Continue — Ascend",
};

const FALLBACK_LEVEL: LevelId = "level-00-bits-logic";
const FALLBACK_ORDER = 1;

const LEVEL_ACCENT: Record<string, string> = {
  "level-00-bits-logic": "bg-level-00",
  "level-01-machine-memory": "bg-level-01",
  "level-02-the-c-language": "bg-level-02",
  "level-03-systems-software": "bg-level-03",
};

function greetingForHour(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatHeaderDate(d: Date): string {
  return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const lessons = getAllLessons();
  const totalLessons = lessons.length;

  let continueHref = lessons[0]
    ? `/curriculum/${lessons[0].meta.level}/${lessons[0].meta.slug}`
    : "/curriculum";
  let currentLevel: LevelId = FALLBACK_LEVEL;
  let currentOrder = FALLBACK_ORDER;
  let levelDone: Record<string, number> = Object.fromEntries(levelIds.map((id) => [id, 0]));
  let streakCurrent = 0;
  let totalCompleted = 0;

  if (user) {
    try {
      const cont = await getContinueLesson(user.id);
      continueHref = cont.href;
      currentLevel = cont.level as LevelId;
      currentOrder = cont.order;

      const [streak, completed, doneCounts] = await Promise.all([
        getStreak(user.id),
        listCompletedLessons(user.id),
        Promise.all(
          levelIds.map(async (id) => [id, await countCompletedInLevel(user.id, id)] as const),
        ),
      ]);

      streakCurrent = streak?.current ?? 0;
      totalCompleted = completed.length;
      levelDone = Object.fromEntries(doneCounts);
    } catch {
      // db unavailable — keep open-path defaults
    }
  }

  const currentIndex = lessons.findIndex(
    (l) => l.meta.level === currentLevel && l.meta.order === currentOrder,
  );
  const safeIndex = currentIndex >= 0 ? currentIndex : 0;
  const currentLesson = lessons[safeIndex];
  const upNext = lessons.slice(safeIndex, safeIndex + 4);

  const firstName = user?.name?.trim().split(/\s+/)[0] ?? "";
  const now = new Date();
  const greeting = greetingForHour(now.getHours());
  const levelMeta = currentLesson ? LEVELS[currentLesson.meta.level] : LEVELS[FALLBACK_LEVEL];
  const doneInCurrentLevel = currentLesson ? (levelDone[currentLesson.meta.level] ?? 0) : 0;
  const remainingInLevel = Math.max(levelMeta.totalConcepts - doneInCurrentLevel, 0);
  const lessonProgressPct = currentLesson
    ? Math.round((doneInCurrentLevel / levelMeta.totalConcepts) * 100)
    : 0;

  const levelsFullyDone = levelIds.filter(
    (id) => (levelDone[id] ?? 0) >= LEVELS[id].totalConcepts,
  ).length;

  const pathPct = totalLessons ? Math.round((totalCompleted / totalLessons) * 100) : 0;

  return (
    <main className={HUB_MAIN_CLASS}>
      <div className={HUB_CONTENT_CLASS}>
        <PageHeader
          eyebrow="Learn / Continue"
          title={user && firstName ? `${greeting}, ${firstName}.` : `${greeting}.`}
          description={
            user ? (
              remainingInLevel > 0 ? (
                <>
                  You&apos;re <b className="text-[#5A32D6]">{remainingInLevel} concepts</b> from
                  finishing {levelMeta.name}.
                </>
              ) : (
                <>You&apos;ve completed every lesson in the curriculum. Review anytime.</>
              )
            ) : (
              <>
                The full path is open —{" "}
                <Link href="/signin" className="font-bold text-brand-violet hover:underline">
                  sign in
                </Link>{" "}
                to save progress.
              </>
            )
          }
          actions={
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2.5 text-[13px] text-ink-secondary">
                <span className="font-mono">{formatHeaderDate(now)}</span>
                {user && streakCurrent > 0 ? (
                  <>
                    <span className="h-1 w-1 rounded-full bg-[#CFC9DE]" />
                    <span className="flex items-center gap-1 font-bold text-streak-text">
                      <Flame size={14} className="fill-current" /> Day {streakCurrent}
                    </span>
                  </>
                ) : null}
              </div>
              <Button href={continueHref} variant="dark">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="6 3 20 12 6 21 6 3" />
                </svg>
                {user ? "Resume" : "Start"}
              </Button>
            </div>
          }
        />

            <div className="relative mb-5 overflow-hidden rounded-[24px] bg-gradient-to-br from-[#6A3EF0] via-[#9A34D6] to-[#FF6B4A] p-8 text-white shadow-[0_24px_50px_rgba(106,62,240,0.32)]">
              <div className="animate-blob pointer-events-none absolute -right-10 -top-[90px] h-[320px] w-[320px] rounded-full bg-white/[0.13] blur-[10px]" />
              <div className="relative flex flex-wrap items-end gap-6">
                {currentLesson ? (
                  <>
                    <div className="min-w-[230px] flex-1">
                      <span className="mb-3 block font-mono text-[11px] uppercase tracking-[0.12em] opacity-85">
                        Continue learning
                      </span>
                      <div className="mb-3 flex items-center gap-2.5">
                        <span className="flex h-[52px] w-[52px] flex-none items-center justify-center rounded-2xl border border-white/30 bg-white/[0.16] font-mono text-lg font-bold">
                          {String(currentLesson.meta.order).padStart(2, "0")}
                        </span>
                        <div className="font-mono text-[11.5px] opacity-80">
                          {levelMeta.name} · {doneInCurrentLevel} / {levelMeta.totalConcepts}
                        </div>
                      </div>
                      <div className="mb-4 font-display text-[26px] font-extrabold leading-tight tracking-tight sm:text-[28px]">
                        {currentLesson.meta.title}
                      </div>
                      <div className="flex max-w-[320px] items-center gap-3">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.26]">
                          <div
                            className="h-full rounded-full bg-white"
                            style={{ width: `${lessonProgressPct}%` }}
                          />
                        </div>
                        <span className="font-mono text-[12.5px] font-bold">{lessonProgressPct}%</span>
                      </div>
                    </div>
                    <Button href={continueHref} variant="invert">
                      {user ? "Resume lesson" : "Start lesson"}
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#6A3EF0" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </Button>
                  </>
                ) : null}
              </div>
            </div>

            {user ? (
              <div className="mb-5 flex flex-wrap gap-4">
                <Card className="flex-[1_1_180px] p-5" hover={false}>
                  <div className="flex items-center gap-2 text-streak-text">
                    <Flame size={16} className="fill-current" />
                    <span className="font-display text-[24px] font-extrabold">{streakCurrent}</span>
                  </div>
                  <div className="mt-1 text-[12.5px] text-ink-muted">Day streak</div>
                </Card>
                <Card className="flex-[1_1_180px] p-5" hover={false}>
                  <div className="flex items-center gap-2 text-[#12A472]">
                    <CheckCircle2 size={16} />
                    <span className="font-display text-[24px] font-extrabold">
                      {totalCompleted}/{totalLessons}
                    </span>
                  </div>
                  <div className="mt-1 text-[12.5px] text-ink-muted">Lessons done · {pathPct}%</div>
                </Card>
              </div>
            ) : null}

            <div className="flex flex-wrap items-start gap-5">
              <Card hover={false} className="min-w-0 flex-[100_1_480px]">
                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="font-display text-[17px] font-extrabold">
                      Up next in {levelMeta.name}
                    </div>
                    <Link
                      href="/curriculum"
                      className="flex items-center gap-1 text-[12.5px] font-bold text-brand-violet"
                    >
                      View path <ChevronRight size={13} />
                    </Link>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    {upNext.map((lesson, i) => {
                      const isCurrent = i === 0;
                      const accent = LEVEL_ACCENT[lesson.meta.level] ?? "bg-level-00";
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
                              isCurrent ? `${accent} text-white` : "bg-[#F2F0F8] text-[#A8A3BC]"
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
                              {lesson.meta.timeMin} min
                            </div>
                          </div>
                          {isCurrent ? (
                            <span className="whitespace-nowrap text-[11.5px] font-bold text-[#C13AE0]">
                              {user ? "up next" : "start here"}
                            </span>
                          ) : null}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </Card>

              <Card hover={false} className="w-full min-w-[280px] max-w-[360px] flex-1">
                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="font-display text-[17px] font-extrabold">Your climb</div>
                    <span className="font-mono text-[12.5px] text-ink-faint">
                      {levelsFullyDone} / {levelIds.length} levels
                    </span>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {levelIds.map((levelId) => {
                      const level = LEVELS[levelId];
                      const done = levelDone[levelId] ?? 0;
                      const pct = Math.round((done / level.totalConcepts) * 100);
                      const isCurrent = levelId === currentLevel;
                      const isCompleted = done >= level.totalConcepts;
                      const firstLesson = lessons.find((l) => l.meta.level === levelId);
                      const levelHref = firstLesson
                        ? `/curriculum/${firstLesson.meta.level}/${firstLesson.meta.slug}`
                        : "/curriculum";

                      return (
                        <div
                          key={levelId}
                          className={`flex items-center gap-3.5 rounded-[15px] border p-3.5 ${
                            isCurrent
                              ? "border-[#F3D9EE] bg-gradient-to-r from-[#FDF7FE] to-white"
                              : "border-[#F0EEF6]"
                          }`}
                        >
                          <div
                            className={`flex h-11 w-11 flex-none items-center justify-center rounded-[13px] ${LEVEL_ACCENT[levelId]} font-display text-base font-extrabold text-white`}
                          >
                            {isCompleted ? (
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
                          <Link
                            href={isCurrent ? continueHref : levelHref}
                            className="flex-none whitespace-nowrap rounded-full border border-card-border-soft px-3.5 py-2 text-[12.5px] font-semibold text-ink-secondary"
                          >
                            {isCurrent ? "Continue" : isCompleted ? "Review" : "Open"}
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
  );
}
