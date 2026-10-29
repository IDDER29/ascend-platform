"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/auth";
import { db, schema } from "@/lib/db/client";
import {
  MAX_DECKS,
  normalizeDeckInput,
  type DeckInput,
  type SavedDeck,
} from "@/lib/practice/deck-recipe";
import { isDailyGoal } from "@/lib/practice/daily-goal";
import type { PracticeScopeType } from "@/lib/practice/history";
import { PRACTICE_BANK } from "@/lib/practice/bank";
import { completionKey } from "@/lib/practice/session";
import type { PracticeCard } from "@/lib/practice/sm2";
import { PRACTICE_ROUTES } from "@/lib/practice/routes";

export type PracticeActionResult =
  | { ok: true }
  | { ok: false; error: string };

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

const MAX_UPSERT_CARDS = 8;
const MIN_EASE = 1.3;
const MAX_EASE = 3.0;
const PRACTICE_BANK_IDS = new Set(PRACTICE_BANK.map((q) => q.id));
const VALID_CARD_STATES = new Set<PracticeCard["state"]>([
  "new",
  "learning",
  "review",
]);

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

function isParseableDateString(value: unknown): value is string {
  if (typeof value !== "string" || value.length === 0) return false;
  const time = new Date(value).getTime();
  return Number.isFinite(time);
}

function validatePracticeCardInput(
  raw: unknown,
): { ok: true; card: PracticeCard } | { ok: false; error: string } {
  if (raw === null || typeof raw !== "object") {
    return { ok: false, error: "Invalid practice card payload." };
  }
  const c = raw as Record<string, unknown>;
  const questionId = c.questionId;
  if (typeof questionId !== "string" || !PRACTICE_BANK_IDS.has(questionId)) {
    return { ok: false, error: "Unknown or invalid practice question id." };
  }
  const state = c.state;
  if (
    typeof state !== "string" ||
    !VALID_CARD_STATES.has(state as PracticeCard["state"])
  ) {
    return { ok: false, error: "Invalid practice card state." };
  }
  if (
    !isNonNegativeInteger(c.reps) ||
    !isNonNegativeInteger(c.lapses) ||
    !isNonNegativeInteger(c.intervalDays)
  ) {
    return {
      ok: false,
      error: "Practice card reps, lapses, and interval must be non-negative integers.",
    };
  }
  const ease = c.ease;
  if (
    typeof ease !== "number" ||
    !Number.isFinite(ease) ||
    ease < MIN_EASE ||
    ease > MAX_EASE
  ) {
    return {
      ok: false,
      error: "Practice card ease must be a finite number between 1.3 and 3.0.",
    };
  }
  if (!isParseableDateString(c.dueAt) || !isParseableDateString(c.updatedAt)) {
    return { ok: false, error: "Practice card dates must be valid ISO timestamps." };
  }
  return {
    ok: true,
    card: {
      questionId,
      state: state as PracticeCard["state"],
      reps: c.reps,
      ease,
      intervalDays: c.intervalDays,
      dueAt: c.dueAt,
      lapses: c.lapses,
      updatedAt: c.updatedAt,
    },
  };
}

function validateUpsertCardsInput(
  input: unknown,
): { ok: true; cards: PracticeCard[] } | { ok: false; error: string } {
  if (!Array.isArray(input)) {
    return { ok: false, error: "Practice cards must be an array." };
  }
  if (input.length > MAX_UPSERT_CARDS) {
    return {
      ok: false,
      error: `At most ${MAX_UPSERT_CARDS} practice cards per sync.`,
    };
  }
  const cards: PracticeCard[] = [];
  for (const item of input) {
    const validated = validatePracticeCardInput(item);
    if (!validated.ok) return validated;
    cards.push(validated.card);
  }
  return { ok: true, cards };
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

  const validated = validateUpsertCardsInput(cards);
  if (!validated.ok) return validated;

  try {
    for (const card of validated.cards) {
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

const PRACTICE_LESSON_KEYS = new Set(
  PRACTICE_BANK.map((q) => completionKey(q.lessonLevel, q.lessonSlug)),
);

function revalidateDecks() {
  revalidatePath(PRACTICE_ROUTES.home);
  revalidatePath(PRACTICE_ROUTES.custom);
}

export async function savePracticeDeckAction(
  input: DeckInput & { id?: string },
): Promise<{ ok: true; deck: SavedDeck } | { ok: false; error: string }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Sign in to save decks." };
  if (!db) return { ok: false, error: "Database unavailable." };

  const normalized = normalizeDeckInput(input, PRACTICE_LESSON_KEYS);
  if (!normalized.ok) return normalized;
  const { deck } = normalized;
  const fields = {
    name: deck.name,
    lessonKeys: JSON.stringify(deck.lessonKeys),
    filter: deck.filter,
    formats: JSON.stringify(deck.formats),
  };
  const now = new Date();

  try {
    const owned = await db
      .select({ id: schema.practiceDecks.id })
      .from(schema.practiceDecks)
      .where(eq(schema.practiceDecks.userId, user.id));

    let id = typeof input.id === "string" ? input.id : null;
    if (id) {
      if (!owned.some((row) => row.id === id)) {
        return { ok: false, error: "Deck not found." };
      }
      await db
        .update(schema.practiceDecks)
        .set({ ...fields, updatedAt: now })
        .where(and(eq(schema.practiceDecks.id, id), eq(schema.practiceDecks.userId, user.id)));
    } else {
      if (owned.length >= MAX_DECKS) {
        return { ok: false, error: `You can keep up to ${MAX_DECKS} decks. Delete one first.` };
      }
      id = crypto.randomUUID();
      await db.insert(schema.practiceDecks).values({
        id,
        userId: user.id,
        ...fields,
        createdAt: now,
        updatedAt: now,
      });
    }
    revalidateDecks();
    return { ok: true, deck: { id, ...deck, updatedAt: now.toISOString() } };
  } catch {
    return { ok: false, error: "Could not save the deck (table may need a migration)." };
  }
}

export async function deletePracticeDeckAction(id: string): Promise<PracticeActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Sign in to manage decks." };
  if (!db) return { ok: false, error: "Database unavailable." };
  if (typeof id !== "string" || id.length === 0) return { ok: false, error: "Deck not found." };

  try {
    await db
      .delete(schema.practiceDecks)
      .where(and(eq(schema.practiceDecks.id, id), eq(schema.practiceDecks.userId, user.id)));
    revalidateDecks();
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not delete the deck." };
  }
}

export async function savePracticeDailyGoalAction(
  goal: number,
): Promise<PracticeActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Sign in to sync your daily goal." };
  if (!db) return { ok: false, error: "Database unavailable." };
  if (!isDailyGoal(goal)) return { ok: false, error: "Invalid daily goal." };

  const updatedAt = new Date();
  try {
    await db
      .insert(schema.practiceSettings)
      .values({ userId: user.id, dailyGoal: goal, updatedAt })
      .onConflictDoUpdate({
        target: schema.practiceSettings.userId,
        set: { dailyGoal: goal, updatedAt },
      });
    return { ok: true };
  } catch {
    return {
      ok: false,
      error: "Could not save the daily goal (table may need a migration).",
    };
  }
}
