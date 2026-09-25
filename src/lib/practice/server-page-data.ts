import "server-only";

import { getCurrentUser } from "@/lib/auth/auth";
import { lessonHref } from "@/lib/paths/lesson-urls";
import { PRACTICE_BANK } from "@/lib/practice/bank";
import type { PracticeSessionRecord } from "@/lib/practice/history";
import {
  listPracticeCardsForUser,
  listPracticeSessionsForUser,
} from "@/lib/practice/queries";
import { completionKey } from "@/lib/practice/session";
import type { PracticeCard } from "@/lib/practice/sm2";
import { listCompletedLessons } from "@/lib/progress/queries";

const reviewHrefs = Object.fromEntries(
  PRACTICE_BANK.map((question) => [
    question.id,
    lessonHref(question.lessonLevel, question.lessonSlug),
  ]),
);

export async function loadPracticePageData(): Promise<{
  userId: string | null;
  completedKeys: string[];
  reviewHrefs: Record<string, string>;
  initialHistory: PracticeSessionRecord[];
  initialCards: PracticeCard[];
}> {
  const user = await getCurrentUser();
  let completedKeys: string[] = [];
  let initialHistory: PracticeSessionRecord[] = [];
  let initialCards: PracticeCard[] = [];

  if (user) {
    try {
      const rows = await listCompletedLessons(user.id);
      completedKeys = rows.map((row) => completionKey(row.level, row.slug));
    } catch {
      completedKeys = [];
    }
    initialHistory = await listPracticeSessionsForUser(user.id);
    initialCards = await listPracticeCardsForUser(user.id);
  }

  return {
    userId: user?.id ?? null,
    completedKeys,
    reviewHrefs,
    initialHistory,
    initialCards,
  };
}
