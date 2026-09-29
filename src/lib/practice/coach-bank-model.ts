import { cardStrength, type CardStrength } from "./coach-home-model";
import type { PracticeSessionRecord } from "./history";
import { completionKey, unlockedQuestions } from "./session";
import type { PracticeCard } from "./sm2";
import { practiceLessonTitle } from "./tree";
import type { PracticeItem } from "./types";

const LOCALE = "en-US";

export type BankStrength = CardStrength;
export type BankFormat = PracticeItem["kind"];

export const BANK_FORMAT_LABELS: Record<BankFormat, string> = {
  mcq: "Choices",
  flashcard: "Flashcard",
  typed: "Short answer",
  cloze: "Cloze",
};

export type BankRow = {
  id: string;
  text: string;
  format: BankFormat;
  formatLabel: string;
  lessonKey: string;
  lessonTitle: string;
  strength: BankStrength;
  dueLabel: string;
  dueToday: boolean;
  dueSort: number;
  correct: number;
  seen: number;
};

export type CoachBankModel = {
  rows: BankRow[];
  total: number;
  dueToday: number;
  strengthCounts: Record<BankStrength, number>;
  lessons: { key: string; title: string }[];
  formats: { value: BankFormat; label: string }[];
};

export type BankFilters = {
  query: string;
  lesson: string | null;
  format: BankFormat | null;
  strength: BankStrength | null;
};

export type CoachBankInput = {
  cards: PracticeCard[];
  history: PracticeSessionRecord[];
  completedKeys: Set<string>;
  now: Date;
};

function cardText(question: PracticeItem): string {
  if (question.kind === "flashcard") return question.front;
  if (question.kind === "cloze") {
    return question.template?.replace("{{blank}}", "___") ?? question.reviewLabel;
  }
  return question.prompt;
}

function historyTallies(history: PracticeSessionRecord[]) {
  const tallies = new Map<string, { correct: number; seen: number }>();
  for (const session of history) {
    const missed = new Set(session.missIds);
    for (const id of session.questionIds) {
      const tally = tallies.get(id) ?? { correct: 0, seen: 0 };
      tally.seen += 1;
      if (!missed.has(id)) tally.correct += 1;
      tallies.set(id, tally);
    }
  }
  return tallies;
}

export function buildCoachBankModel({
  cards,
  history,
  completedKeys,
  now,
}: CoachBankInput): CoachBankModel {
  const cardsById = new Map(cards.map((c) => [c.questionId, c] as const));
  const tallies = historyTallies(history);
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime();

  const rows = unlockedQuestions(completedKeys).map((question): BankRow => {
    const card = cardsById.get(question.id);
    const strength = card ? cardStrength(card) : "new";
    const due = card && strength !== "new" ? Date.parse(card.dueAt) : Number.NaN;
    const scheduled = Number.isFinite(due);
    const dueToday = scheduled && due < endOfToday;
    const lessonKey = completionKey(question.lessonLevel, question.lessonSlug);
    const tally = tallies.get(question.id) ?? { correct: 0, seen: 0 };
    return {
      id: question.id,
      text: cardText(question),
      format: question.kind,
      formatLabel: BANK_FORMAT_LABELS[question.kind],
      lessonKey,
      lessonTitle: practiceLessonTitle(lessonKey) ?? question.lessonSlug,
      strength,
      dueLabel: !scheduled
        ? "Not seen yet"
        : dueToday
          ? "Today"
          : new Date(due).toLocaleDateString(LOCALE, {
              weekday: "short",
              month: "short",
              day: "numeric",
            }),
      dueToday,
      dueSort: scheduled ? due : Number.POSITIVE_INFINITY,
      correct: tally.correct,
      seen: tally.seen,
    };
  });
  rows.sort((a, b) => a.dueSort - b.dueSort || a.text.localeCompare(b.text));

  const strengthCounts = { new: 0, learning: 0, solid: 0, mastered: 0 };
  for (const row of rows) strengthCounts[row.strength] += 1;

  const lessons = new Map<string, string>();
  const formats = new Set<BankFormat>();
  for (const row of rows) {
    lessons.set(row.lessonKey, row.lessonTitle);
    formats.add(row.format);
  }

  return {
    rows,
    total: rows.length,
    dueToday: rows.filter((row) => row.dueToday).length,
    strengthCounts,
    lessons: [...lessons].map(([key, title]) => ({ key, title })),
    formats: (Object.keys(BANK_FORMAT_LABELS) as BankFormat[])
      .filter((value) => formats.has(value))
      .map((value) => ({ value, label: BANK_FORMAT_LABELS[value] })),
  };
}

export function filterBankRows(rows: BankRow[], filters: BankFilters): BankRow[] {
  const query = filters.query.trim().toLowerCase();
  return rows.filter(
    (row) =>
      (!query ||
        row.text.toLowerCase().includes(query) ||
        row.lessonTitle.toLowerCase().includes(query)) &&
      (!filters.lesson || row.lessonKey === filters.lesson) &&
      (!filters.format || row.format === filters.format) &&
      (!filters.strength || row.strength === filters.strength),
  );
}
