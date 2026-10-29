import type { Metadata } from "next";
import { PracticeCoachV2Custom } from "@/components/practice/practice-coach-v2-custom";
import { HUB_CONTENT_CLASS } from "@/components/ui/page-header";
import { PRACTICE_BANK } from "@/lib/practice/bank";
import { completionKey } from "@/lib/practice/session";
import { loadPracticePageData } from "@/lib/practice/server-page-data";

const LESSON_KEYS = new Set(PRACTICE_BANK.map((q) => completionKey(q.lessonLevel, q.lessonSlug)));

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/** `?lessons=level/slug,…` pre-selects lessons (e.g. from a path's focus tip). */
function parseLessonKeys(raw: string | string[] | undefined): string[] {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value) return [];
  return [...new Set(value.split(",").map((key) => key.trim()))].filter((key) => LESSON_KEYS.has(key));
}

export const metadata: Metadata = {
  title: "Custom deck — Practice Coach (v2) — Ascend",
  description: "Build a custom practice deck from the lessons you want to drill.",
};

export default async function PracticeV2CustomPage({ searchParams }: Props) {
  const params = await searchParams;
  const data = await loadPracticePageData();

  return (
    <main className="practice-coach-v2 flex-1 overflow-x-clip bg-[var(--coach-bg)] px-5 py-8 font-sans text-[var(--coach-ink)] antialiased sm:px-10">
      <div className={HUB_CONTENT_CLASS}>
        <PracticeCoachV2Custom
          userId={data.userId}
          completedKeys={data.completedKeys}
          initialCards={data.initialCards}
          initialHistory={data.initialHistory}
          initialDecks={data.initialDecks}
          initialLessonKeys={parseLessonKeys(params.lessons)}
        />
      </div>
    </main>
  );
}
