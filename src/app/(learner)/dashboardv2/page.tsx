import type { Metadata } from "next";
import { NextLessonCard } from "@/components/dashboard-v2/next-lesson-card";
import { TodayGrid } from "@/components/dashboard-v2/practice-today";
import { StandingRow } from "@/components/dashboard-v2/standing-row";
import { YourPaths } from "@/components/dashboard-v2/your-paths";
import { HUB_CONTENT_CLASS } from "@/components/ui/page-header";
import { greetingForHour } from "@/lib/dashboard/continue";
import { loadToday } from "@/lib/dashboard/today-page-data";
import { loadPracticePageData } from "@/lib/practice/server-page-data";

export const metadata: Metadata = {
  title: "Today — Ascend",
  description: "Your next lesson, today's Practice, and where you stand.",
};

const MAIN =
  "practice-coach-v2 flex-1 overflow-x-clip bg-[var(--coach-bg)] px-5 py-8 font-sans text-[var(--coach-ink)] antialiased sm:px-10";

export default async function DashboardV2Page() {
  const [{ today, paths, firstName, lessonsDone }, practice] = await Promise.all([loadToday(), loadPracticePageData()]);
  const now = new Date();
  const greeting = greetingForHour(now.getHours());

  return (
    <main className={MAIN}>
      <div className={`${HUB_CONTENT_CLASS} flex flex-col gap-6`}>
        <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-1">
          <div className="flex flex-col gap-1">
            <h1 className="m-0 font-display text-[30px] font-extrabold leading-tight tracking-[-0.035em] sm:text-[36px]">
              {firstName ? `${greeting}, ${firstName}.` : `${greeting}.`}
            </h1>
            <p className="m-0 text-[15px] text-[var(--coach-ink-secondary)]">
              {today.lessons.done === 0
                ? "Start with the first lesson. It takes a few minutes."
                : `${today.lessons.done} of ${today.lessons.total} lessons done.`}
            </p>
          </div>
          <p className="m-0 text-[13.5px] text-[var(--coach-ink-muted)]">
            {now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </header>

        <TodayGrid
          next={<NextLessonCard next={today.next} />}
          lessonsDone={lessonsDone}
          nextLessons={
            today.next.kind === "capstone"
              ? []
              : [{ title: today.next.title, href: today.next.href }, ...today.next.then]
          }
          practice={{
            userId: practice.userId,
            completedKeys: practice.completedKeys,
            completionDates: practice.completionDates,
            initialCards: practice.initialCards,
            initialHistory: practice.initialHistory,
            initialGoal: practice.initialGoal,
          }}
        />

        <YourPaths paths={paths} />

        <StandingRow standing={today.standing} />
      </div>
    </main>
  );
}
