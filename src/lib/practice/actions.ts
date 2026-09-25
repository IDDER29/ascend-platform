"use server";

import { revalidatePath } from "next/cache";
import { desc, eq } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth/auth";
import { db, schema } from "@/lib/db/client";
import type {
  PracticeScopeType,
  PracticeSessionRecord,
} from "@/lib/practice/history";
import type { PracticeCard } from "@/lib/practice/sm2";

export type PracticeActionResult =
  | { ok: true }
  | { ok: false; error: string };

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

function cardFields(card: PracticeCard) {
  return {
    questionId: card.questionId,
    state: card.state,
    reps: card.reps,
    ease: card.ease,
    intervalDays: card.intervalDays,
    dueAt: card.dueAt,
    lapses: card.lapses,
    updatedAt: card.updatedAt,
  };
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

export async function savePracticeSessionAction(input: {
  id: string;
  scopeType: PracticeScopeType;
  scopeLabel: string;
  pathSlug: string | null;
  correct: number;
  total: number;
  missIds: string[];
  questionIds: string[];
  at?: string;
}): Promise<PracticeActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Sign in to sync Practice history." };
  if (!db) return { ok: false, error: "Database unavailable." };

  const createdAt = input.at ? new Date(input.at) : new Date();

  try {
    await db.insert(schema.practiceSessions).values({
      id: input.id,
      userId: user.id,
      scopeType: input.scopeType,
      scopeLabel: input.scopeLabel,
      pathSlug: input.pathSlug,
      correct: input.correct,
      total: input.total,
      missIds: JSON.stringify(input.missIds),
      questionIds: JSON.stringify(input.questionIds),
      createdAt,
    });
    revalidatePath("/practice");
    return { ok: true };
  } catch {
    return {
      ok: false,
      error: "Could not sync Practice history (table may need a migration).",
    };
  }
}

export async function upsertPracticeCardsAction(
  cards: PracticeCard[],
): Promise<PracticeActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Sign in to sync Practice cards." };
  if (!db) return { ok: false, error: "Database unavailable." };

  try {
    for (const card of cards) {
      const fields = cardFields(card);
      await db
        .insert(schema.practiceCards)
        .values({
          id: `${user.id}:${card.questionId}`,
          userId: user.id,
          ...fields,
        })
        .onConflictDoUpdate({
          target: schema.practiceCards.id,
          set: fields,
        });
    }
    revalidatePath("/practice");
    return { ok: true };
  } catch {
    return {
      ok: false,
      error: "Could not sync Practice cards (table may need a migration).",
    };
  }
}
