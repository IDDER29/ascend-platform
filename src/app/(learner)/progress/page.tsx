import type { Metadata } from "next";
import { ProgressV2Live } from "@/components/progress-v2/progress-v2-live";
import { getAllLessons } from "@/lib/content/lessons";
import { lessonHref } from "@/lib/paths/lesson-urls";
import { completionKey } from "@/lib/practice/session";
import { loadPracticePageData } from "@/lib/practice/server-page-data";
import type { ProgressLesson } from "@/lib/progress/progress-v2-model";
import { getStreak, listCompletedLessons } from "@/lib/progress/queries";
import { PageShell } from "@/components/ui/page-shell";

export const metadata: Metadata = {
  title: "Progress",
  description: "What you've learned, and how much of it is sticking.",
};

export default async function ProgressPage() {
  const data = await loadPracticePageData();
  const lessons: ProgressLesson[] = getAllLessons().map(({ meta }) => ({
    key: completionKey(meta.level, meta.slug),
    level: meta.level,
    slug: meta.slug,
    title: meta.title,
    href: lessonHref(meta.level, meta.slug),
  }));

  let completions: { key: string; completedAt: string }[] = [];
  let serverStreak: number | null = null;
  if (data.userId) {
    try {
      completions = (await listCompletedLessons(data.userId)).map((row) => ({
        key: completionKey(row.level, row.slug),
        completedAt: row.completedAt.toISOString(),
      }));
    } catch {
      completions = [];
    }
    serverStreak = (await getStreak(data.userId))?.current ?? null;
  }

  return (
    <PageShell>
      <ProgressV2Live
        userId={data.userId}
        lessons={lessons}
        completions={completions}
        initialCards={data.initialCards}
        initialHistory={data.initialHistory}
        serverStreak={serverStreak}
      />
    </PageShell>
  );
}
