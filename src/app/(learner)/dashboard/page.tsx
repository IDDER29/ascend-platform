import type { Metadata } from "next";
import { NextLessonCard } from "@/components/dashboard-v2/next-lesson-card";
import { TodayGrid } from "@/components/dashboard-v2/practice-today";
import { StandingRow } from "@/components/dashboard-v2/standing-row";
import { YourPaths } from "@/components/dashboard-v2/your-paths";
import { HUB_CONTENT_CLASS, PageHeader } from "@/components/ui/page-header";
import { greetingForHour } from "@/lib/dashboard/continue";
import { loadToday } from "@/lib/dashboard/today-page-data";
import { loadPracticePageData } from "@/lib/practice/server-page-data";

export const metadata: Metadata = {
  title: "Today",
  description: "Your next lesson, today's Practice, and where you stand.",
};

const MAIN =
  "practice-coach-v2 flex-1 overflow-x-clip bg-[var(--coach-bg)] px-5 py-8 font-sans text-[var(--coach-ink)] antialiased sm:px-10";

export default async function DashboardPage() {
  const [{ today, paths, firstName, lessonsDone }, practice] = await Promise.all([loadToday(), loadPracticePageData()]);
  const active = paths.find((p) => p.active);
  const now = new Date();
  const greeting = greetingForHour(now.getHours());

  return (
    <main className={MAIN}>
      <div className={`${HUB_CONTENT_CLASS} flex flex-col gap-6`}>
        <PageHeader
          title={firstName ? `${greeting}, ${firstName}.` : `${greeting}.`}
          lead={
            today.lessons.done === 0
              ? `Your first lesson takes about ${today.next.timeMin ?? 5} minutes.`
              : `${today.lessons.done} of ${today.lessons.total} lessons done.`
          }
          aside={now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        />

        <TodayGrid
          next={<NextLessonCard next={today.next} />}
          lessonsDone={lessonsDone}
          activePath={active ? { slug: active.slug, title: active.title } : null}
          otherPaths={paths.filter((p) => !p.active).map((p) => ({ slug: p.slug, title: p.title }))}
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
            initialDecks: practice.initialDecks,
          }}
        />

        <YourPaths paths={paths} />

        <StandingRow standing={today.standing} />
      </div>
    </main>
  );
}
