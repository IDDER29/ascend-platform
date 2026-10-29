import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PracticeCoachV2PathLive } from "@/components/practice/practice-coach-v2-path-live";
import { HUB_CONTENT_CLASS } from "@/components/ui/page-header";
import { getAllLessons } from "@/lib/content/lessons";
import { lessonHref } from "@/lib/paths/lesson-urls";
import { practicePathSlugs } from "@/lib/practice/coach-path-model";
import { PRACTICE_PATH_TITLES } from "@/lib/practice/path-map";
import { completionKey } from "@/lib/practice/session";
import { loadPracticePageData } from "@/lib/practice/server-page-data";
import { practiceTreeForPath } from "@/lib/practice/tree";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const title = PRACTICE_PATH_TITLES[slug];
  return { title: title ? `${title} — Practice — Ascend` : "Practice — Ascend" };
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
    <main className="practice-coach-v2 flex-1 overflow-x-clip bg-[var(--coach-bg)] px-5 py-8 font-sans text-[var(--coach-ink)] antialiased sm:px-10">
      <div className={HUB_CONTENT_CLASS}>
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
      </div>
    </main>
  );
}
