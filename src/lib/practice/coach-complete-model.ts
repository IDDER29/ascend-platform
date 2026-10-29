import { PRACTICE_BANK } from "./bank";
import { streakDays } from "./coach-home-model";
import type { DailyGoal } from "./daily-goal";
import type { PracticeSessionRecord } from "./history";
import { cardsClearedToday } from "./momentum";
import { completionKey } from "./session";
import { practiceLessonTitle } from "./tree";
import type { PracticeItem } from "./types";
import { PRACTICE_ROUTES } from "./routes";

const FIX_HREF = `${PRACTICE_ROUTES.session}?scope=due`;
const BACK: CoachCompleteLink = { label: "Back to practice", href: PRACTICE_ROUTES.home };

const questionsById = new Map(PRACTICE_BANK.map((q) => [q.id, q] as const));

export type CoachCompleteInput = {
  record: PracticeSessionRecord;
  history: PracticeSessionRecord[];
  goal: DailyGoal;
  now: Date;
};

export type CoachCompleteMiss = {
  id: string;
  label: string;
  answer: string | null;
  lessonTitle: string | null;
};

export type CoachCompleteLink = { label: string; href: string };

export type CoachCompleteModel = {
  correct: number;
  total: number;
  missed: number;
  summary: string;
  results: boolean[];
  accuracy: { percent: number; lastPercent: number | null };
  goal: { answeredToday: number; goal: DailyGoal; met: boolean; remaining: number };
  streak: number;
  strength: { movedUp: number; backToLearning: number };
  misses: CoachCompleteMiss[];
  primary: CoachCompleteLink;
  secondary: CoachCompleteLink | null;
};

function percent(record: PracticeSessionRecord): number {
  return record.total > 0 ? Math.round((record.correct / record.total) * 100) : 0;
}

function correctAnswer(question: PracticeItem): string | null {
  if (question.kind === "mcq") return question.options[question.correct] ?? null;
  if (question.kind === "flashcard") return question.back;
  return question.answers[0] ?? null;
}

function toMiss(id: string): CoachCompleteMiss {
  const question = questionsById.get(id);
  if (!question) return { id, label: id, answer: null, lessonTitle: null };
  return {
    id,
    label: question.reviewLabel,
    answer: correctAnswer(question),
    lessonTitle: practiceLessonTitle(
      completionKey(question.lessonLevel, question.lessonSlug),
    ),
  };
}

function summary(correct: number, total: number, missed: number): string {
  const score = `${correct} of ${total} right.`;
  if (missed === 0) return `${score} You're caught up for now.`;
  const verb = missed === 1 ? "is" : "are";
  return `${score} The ${missed} you missed ${verb} already scheduled to come back.`;
}

export function buildCoachCompleteModel({
  record,
  history,
  goal,
  now,
}: CoachCompleteInput): CoachCompleteModel {
  const missSet = new Set(record.missIds);
  const missed = record.missIds.length;
  const previous = history
    .filter((row) => row.id !== record.id && row.at < record.at)
    .sort((a, b) => b.at.localeCompare(a.at))[0];
  const answeredToday = cardsClearedToday(history, now);

  return {
    correct: record.correct,
    total: record.total,
    missed,
    summary: summary(record.correct, record.total, missed),
    results: record.questionIds.map((id) => !missSet.has(id)),
    accuracy: {
      percent: percent(record),
      lastPercent: previous ? percent(previous) : null,
    },
    goal: {
      answeredToday,
      goal,
      met: answeredToday >= goal,
      remaining: Math.max(0, goal - answeredToday),
    },
    streak: streakDays(history, now),
    strength: { movedUp: record.correct, backToLearning: missed },
    misses: record.missIds.map(toMiss),
    primary:
      missed > 0
        ? { label: `Fix ${missed} ${missed === 1 ? "miss" : "misses"} now`, href: FIX_HREF }
        : BACK,
    secondary: missed > 0 ? BACK : null,
  };
}
