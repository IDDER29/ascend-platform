// src/lib/practice/sm2.ts
export type CardState = "new" | "learning" | "review";
export type PracticeGrade = "again" | "good";

export type PracticeCard = {
  questionId: string;
  state: CardState;
  reps: number;
  ease: number;
  intervalDays: number;
  dueAt: string;
  lapses: number;
  updatedAt: string;
};

const MIN_EASE = 1.3;
const MAX_EASE = 3.0;
const DEFAULT_EASE = 2.5;

export function localDayKey(now = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDaysIso(now: Date, days: number): string {
  const t = new Date(now.getTime());
  t.setDate(t.getDate() + days);
  return t.toISOString();
}

export function createNewCard(questionId: string, now = new Date()): PracticeCard {
  const iso = now.toISOString();
  return {
    questionId,
    state: "new",
    reps: 0,
    ease: DEFAULT_EASE,
    intervalDays: 0,
    dueAt: iso,
    lapses: 0,
    updatedAt: iso,
  };
}

export function gradeCard(
  card: PracticeCard,
  grade: PracticeGrade,
  now = new Date(),
): PracticeCard {
  const iso = now.toISOString();
  if (grade === "again") {
    return {
      ...card,
      state: "learning",
      reps: 0,
      ease: Math.max(MIN_EASE, card.ease - 0.2),
      intervalDays: 0,
      dueAt: iso,
      lapses: card.state === "review" ? card.lapses + 1 : card.lapses,
      updatedAt: iso,
    };
  }
  // Good
  if (card.state === "new" || card.state === "learning") {
    return {
      ...card,
      state: "review",
      reps: 1,
      intervalDays: 1,
      dueAt: addDaysIso(now, 1),
      updatedAt: iso,
    };
  }
  const ease = Math.min(MAX_EASE, card.ease + 0.1);
  const intervalDays = Math.max(1, Math.round(card.intervalDays * ease));
  return {
    ...card,
    state: "review",
    reps: card.reps + 1,
    ease,
    intervalDays,
    dueAt: addDaysIso(now, intervalDays),
    updatedAt: iso,
  };
}
