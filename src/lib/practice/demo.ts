import { addDaysIso, createNewCard, type PracticeCard } from "./sm2";

/** Shared Practice demo view helpers — safe for server + client. */

export const PRACTICE_DEMO_VIEWS = [
  "empty",
  "ready",
  "session",
  "results",
] as const;

export type PracticeDemoView = (typeof PRACTICE_DEMO_VIEWS)[number];

const DEMO_LEARNING_IDS = ["bits-01", "bits-02"];
const DEMO_NEW_IDS = ["bool-01", "ptr-01", "ptr-03"];
const DEMO_FUTURE_REVIEW_ID = "gates-01";

/**
 * A small, deterministic schedule for screenshots and interactive demo views.
 * It intentionally includes due learning cards, new cards, and a future review.
 */
export function practiceDemoCards(now = new Date()): PracticeCard[] {
  const iso = now.toISOString();
  const learning = DEMO_LEARNING_IDS.map((questionId) => ({
    ...createNewCard(questionId, now),
    state: "learning" as const,
    ease: 2.3,
  }));
  const newCards = DEMO_NEW_IDS.map((questionId) =>
    createNewCard(questionId, now),
  );
  const futureReview: PracticeCard = {
    ...createNewCard(DEMO_FUTURE_REVIEW_ID, now),
    state: "review",
    reps: 2,
    intervalDays: 3,
    dueAt: addDaysIso(now, 1),
    updatedAt: iso,
  };

  return [...learning, ...newCards, futureReview];
}

export function isPracticeDemoView(
  value: string | null,
): value is PracticeDemoView {
  return (
    value === "empty" ||
    value === "ready" ||
    value === "session" ||
    value === "results"
  );
}
