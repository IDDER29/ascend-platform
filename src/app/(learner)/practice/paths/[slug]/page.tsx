import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PracticeCoachV2PathLive } from "@/components/practice/practice-coach-v2-path-live";
import { getAllLessons } from "@/lib/content/lessons";
import { lessonHref } from "@/lib/paths/lesson-urls";
import { practicePathSlugs } from "@/lib/practice/coach-path-model";
import { PRACTICE_PATH_TITLES } from "@/lib/practice/path-map";
import { completionKey } from "@/lib/practice/session";
import { loadPracticePageData } from "@/lib/practice/server-page-data";
import { practiceTreeForPath } from "@/lib/practice/tree";
import { PageShell } from "@/components/ui/page-shell";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const title = PRACTICE_PATH_TITLES[slug];
  return { title: title ? `${title} · Practice` : "Practice" };
}

export default async function PracticePathPage({ params }: Props) {
  const { slug } = await params;
  const tree = practiceTreeForPath(slug);
  if (!tree || !practicePathSlugs().includes(slug)) notFound();

  const data = await loadPracticePageData();
  const lessonHrefs = Object.fromEntries(
    tree.sections.flatMap((section) =>
      section.lessons.map((lesson) => [lesson.key, lessonHref(lesson.level, lesson.slug)]),
    ),
  );
  const lessonTitles = Object.fromEntries(
    getAllLessons().map(({ meta }) => [completionKey(meta.level, meta.slug), meta.title]),
  );

  return (
    <PageShell>
      <PracticeCoachV2PathLive
        slug={slug}
        title={PRACTICE_PATH_TITLES[slug] ?? tree.title}
        userId={data.userId}
        completedKeys={data.completedKeys}
        initialCards={data.initialCards}
        initialHistory={data.initialHistory}
        lessonHrefs={lessonHrefs}
        lessonTitles={lessonTitles}
      />
    </PageShell>
  );
}
