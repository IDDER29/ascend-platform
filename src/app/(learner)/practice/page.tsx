import { Suspense } from "react";
import { PracticeHome } from "@/components/practice/practice-home";
import {
  HUB_CONTENT_CLASS,
  HUB_MAIN_CLASS,
  PageHeader,
} from "@/components/ui/page-header";
import { getCurrentUser } from "@/lib/auth/auth";
import { lessonHref } from "@/lib/paths/lesson-urls";
import {
  listPracticeCardsForUser,
  listPracticeSessionsForUser,
} from "@/lib/practice/queries";
import { PRACTICE_BANK } from "@/lib/practice/bank";
import {
  isPracticeDemoView,
  type PracticeDemoView,
} from "@/lib/practice/demo";
import type { PracticeSessionRecord } from "@/lib/practice/history";
import { completionKey } from "@/lib/practice/session";
import type { PracticeCard } from "@/lib/practice/sm2";
import { listCompletedLessons } from "@/lib/progress/queries";

export const metadata = { title: "Practice — Ascend" };

const reviewHrefs = Object.fromEntries(
  PRACTICE_BANK.map((question) => [
    question.id,
    lessonHref(question.lessonLevel, question.lessonSlug),
  ]),
);

type PracticePageProps = {
  searchParams: Promise<{ demo?: string; view?: string }>;
};

export default async function PracticePage({ searchParams }: PracticePageProps) {
  const params = await searchParams;
  const demoOn = params.demo === "1";
  const rawView = params.view ?? null;
  const demoView: PracticeDemoView | null = demoOn
    ? isPracticeDemoView(rawView)
      ? rawView
      : "ready"
    : null;

  const user = await getCurrentUser();
  let completedKeys: string[] = [];
  let initialHistory: PracticeSessionRecord[] = [];
  let initialCards: PracticeCard[] = [];

  if (user && !demoOn) {
    try {
      const rows = await listCompletedLessons(user.id);
      completedKeys = rows.map((row) => completionKey(row.level, row.slug));
    } catch {
      completedKeys = [];
    }
    initialHistory = await listPracticeSessionsForUser(user.id);
    initialCards = await listPracticeCardsForUser(user.id);
  }

  if (demoOn) {
    completedKeys = PRACTICE_BANK.map((q) =>
      completionKey(q.lessonLevel, q.lessonSlug),
    );
  }

  return (
    <main className={HUB_MAIN_CLASS}>
      <div className={HUB_CONTENT_CLASS}>
        <PageHeader
          title="Practice"
          description={
            demoOn
              ? "Demo layouts with example questions — not real progress."
              : "Review due cards. Study by path."
          }
        />
        <Suspense fallback={null}>
          <PracticeHome
            userId={user?.id ?? null}
            completedKeys={completedKeys}
            reviewHrefs={reviewHrefs}
            initialHistory={initialHistory}
            initialCards={initialCards}
            demoView={demoView}
          />
        </Suspense>
      </div>
    </main>
  );
}
