import { desc, eq } from "drizzle-orm";
import { db, schema } from "@/lib/db/client";
import { isDailyGoal, type DailyGoal } from "@/lib/practice/daily-goal";
import {
  DECK_FILTERS,
  DECK_FORMATS,
  parseStoredList,
  type DeckFilter,
  type DeckFormat,
  type SavedDeck,
} from "@/lib/practice/deck-recipe";
import type {
  PracticeScopeType,
  PracticeSessionRecord,
} from "@/lib/practice/history";
import type { PracticeCard } from "@/lib/practice/sm2";

function parseJsonArray(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is string => typeof x === "string");
  } catch {
    return [];
  }
}

function rowToRecord(row: {
  id: string;
  scopeType: string;
  scopeLabel: string;
  pathSlug: string | null;
  correct: number;
  total: number;
  missIds: string;
  questionIds: string;
  createdAt: Date | number;
}): PracticeSessionRecord {
  const at =
    row.createdAt instanceof Date
      ? row.createdAt.toISOString()
      : new Date(row.createdAt).toISOString();
  return {
    id: row.id,
    at,
    scopeType: row.scopeType as PracticeScopeType,
    scopeLabel: row.scopeLabel,
    pathSlug: row.pathSlug,
    correct: row.correct,
    total: row.total,
    missIds: parseJsonArray(row.missIds),
    questionIds: parseJsonArray(row.questionIds),
  };
}

function rowToCard(row: {
  questionId: string;
  state: string;
  reps: number;
  ease: number;
  intervalDays: number;
  dueAt: string;
  lapses: number;
  updatedAt: string;
}): PracticeCard {
  return {
    questionId: row.questionId,
    state: row.state as PracticeCard["state"],
    reps: row.reps,
    ease: row.ease,
    intervalDays: row.intervalDays,
    dueAt: row.dueAt,
    lapses: row.lapses,
    updatedAt: row.updatedAt,
  };
}

export function rowToDeck(row: {
  id: string;
  name: string;
  lessonKeys: string;
  filter: string;
  formats: string;
  updatedAt: Date | number;
}): SavedDeck {
  const filter = DECK_FILTERS.includes(row.filter as DeckFilter)
    ? (row.filter as DeckFilter)
    : "all";
  const formats = parseStoredList(row.formats).filter((format): format is DeckFormat =>
    DECK_FORMATS.includes(format as DeckFormat),
  );
  return {
    id: row.id,
    name: row.name,
    lessonKeys: parseStoredList(row.lessonKeys),
    filter,
    formats: formats.length > 0 ? formats : [...DECK_FORMATS],
    updatedAt: new Date(row.updatedAt).toISOString(),
  };
}

export async function listPracticeDecksForUser(userId: string): Promise<SavedDeck[]> {
  if (!db) return [];
  try {
    const rows = await db
      .select()
      .from(schema.practiceDecks)
      .where(eq(schema.practiceDecks.userId, userId))
      .orderBy(desc(schema.practiceDecks.updatedAt));
    return rows.map(rowToDeck);
  } catch {
    // Table may not exist yet on Postgres until migrated.
    return [];
  }
}

export async function listPracticeSessionsForUser(
  userId: string,
  limit = 20,
): Promise<PracticeSessionRecord[]> {
  if (!db) return [];
  try {
    const rows = await db
      .select()
      .from(schema.practiceSessions)
      .where(eq(schema.practiceSessions.userId, userId))
      .orderBy(desc(schema.practiceSessions.createdAt))
      .limit(limit);
    return rows.map(rowToRecord);
  } catch {
    // Table may not exist yet on Postgres until migrated.
    return [];
  }
}

export async function listPracticeCardsForUser(
  userId: string,
): Promise<PracticeCard[]> {
  if (!db) return [];
  try {
    const rows = await db
      .select()
      .from(schema.practiceCards)
      .where(eq(schema.practiceCards.userId, userId));
    return rows.map(rowToCard);
  } catch {
    // Table may not exist yet on Postgres until migrated.
    return [];
  }
}

/** The signed-in learner's saved daily goal, or null when none is stored. */
export async function getPracticeDailyGoal(userId: string): Promise<DailyGoal | null> {
  if (!db) return null;
  try {
    const rows = await db
      .select({ dailyGoal: schema.practiceSettings.dailyGoal })
      .from(schema.practiceSettings)
      .where(eq(schema.practiceSettings.userId, userId))
      .limit(1);
    const goal = rows[0]?.dailyGoal;
    return isDailyGoal(goal) ? goal : null;
  } catch {
    // Table may not exist yet on Postgres until migrated.
    return null;
  }
}
