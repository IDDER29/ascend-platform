import { missQueueKey, readMissIds } from "./miss-queue";
import {
  createNewCard,
  gradeCard,
  localDayKey,
  type PracticeCard,
  type PracticeGrade,
} from "./sm2";

export type NewDayMeta = { date: string; count: number };

export const NEW_PER_DAY = 20;

const CARDS_PREFIX = "ascend_practice_cards_v1";
const NEW_DAY_PREFIX = "ascend_practice_new_day_v1";

export function cardsStorageKey(userId: string | null): string {
  return `${CARDS_PREFIX}:${userId ?? "guest"}`;
}

export function newDayStorageKey(userId: string | null): string {
  return `${NEW_DAY_PREFIX}:${userId ?? "guest"}`;
}

export function readCards(userId: string | null): PracticeCard[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(cardsStorageKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as PracticeCard[]) : [];
  } catch {
    return [];
  }
}

export function writeCards(
  userId: string | null,
  cards: PracticeCard[],
): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(cardsStorageKey(userId), JSON.stringify(cards));
  } catch {
    // Ignore quota and private-mode storage errors.
  }
}

export function readNewDayMeta(userId: string | null): NewDayMeta {
  const fallback = { date: localDayKey(), count: 0 };
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(newDayStorageKey(userId));
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<NewDayMeta>;
    if (
      typeof parsed.date !== "string" ||
      typeof parsed.count !== "number" ||
      !Number.isFinite(parsed.count)
    ) {
      return fallback;
    }
    return { date: parsed.date, count: parsed.count };
  } catch {
    return fallback;
  }
}

export function writeNewDayMeta(
  userId: string | null,
  meta: NewDayMeta,
): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(newDayStorageKey(userId), JSON.stringify(meta));
  } catch {
    // Ignore quota and private-mode storage errors.
  }
}

export function ensureUnlockedCards(
  userId: string | null,
  unlockedIds: string[],
  now = new Date(),
): PracticeCard[] {
  const cards = readCards(userId);
  const knownIds = new Set(cards.map((card) => card.questionId));
  for (const id of unlockedIds) {
    if (!knownIds.has(id)) {
      cards.push(createNewCard(id, now));
      knownIds.add(id);
    }
  }
  writeCards(userId, cards);
  return cards;
}

export function mergeMissesAsLearning(
  cards: PracticeCard[],
  missIds: string[],
  now = new Date(),
): PracticeCard[] {
  const map = new Map(cards.map((card) => [card.questionId, card]));
  const iso = now.toISOString();
  for (const id of missIds) {
    const existing = map.get(id);
    if (existing) {
      map.set(id, {
        ...existing,
        state: "learning",
        reps: 0,
        ease: Math.max(1.3, existing.ease - 0.2),
        intervalDays: 0,
        dueAt: iso,
        updatedAt: iso,
      });
    } else {
      map.set(id, {
        ...createNewCard(id, now),
        state: "learning",
        dueAt: iso,
      });
    }
  }
  return [...map.values()];
}

export function migrateMissQueueOnce(
  userId: string | null,
  now = new Date(),
): PracticeCard[] {
  const cards = readCards(userId);
  const missIds = readMissIds(userId);
  if (missIds.length === 0) return cards;

  const next = mergeMissesAsLearning(cards, missIds, now);
  writeCards(userId, next);
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(missQueueKey(userId));
    } catch {
      // Ignore private-mode storage errors.
    }
  }
  return next;
}

export function syncLocalCards(
  userId: string | null,
  serverCards: PracticeCard[],
  unlockedIds: string[],
): PracticeCard[] {
  if (serverCards.length > 0) writeCards(userId, serverCards);
  migrateMissQueueOnce(userId);
  return ensureUnlockedCards(userId, unlockedIds);
}

export function applyGrades(
  userId: string | null,
  grades: { questionId: string; grade: PracticeGrade }[],
  now = new Date(),
): PracticeCard[] {
  const cards = readCards(userId);
  const indexes = new Map(
    cards.map((card, index) => [card.questionId, index] as const),
  );
  const day = localDayKey(now);
  const storedMeta = readNewDayMeta(userId);
  const meta =
    storedMeta.date === day ? storedMeta : { date: day, count: 0 };

  for (const { questionId, grade } of grades) {
    const index = indexes.get(questionId);
    if (index === undefined) continue;
    const previous = cards[index];
    cards[index] = gradeCard(previous, grade, now);
    if (previous.state === "new") meta.count += 1;
  }

  writeCards(userId, cards);
  writeNewDayMeta(userId, meta);
  return cards;
}

export function gradeFromMcqCorrect(correct: boolean): PracticeGrade {
  return correct ? "good" : "again";
}

export function dueCards(
  cards: PracticeCard[],
  meta: NewDayMeta,
  now: Date,
): PracticeCard[] {
  const nowMs = now.getTime();
  const due = cards.filter((card) => Date.parse(card.dueAt) <= nowMs);
  const reviews = due.filter((card) => card.state !== "new");
  const usedToday =
    meta.date === localDayKey(now) ? meta.count : 0;
  const remaining = Math.max(0, NEW_PER_DAY - usedToday);
  const newCards = due.filter((card) => card.state === "new").slice(0, remaining);
  return [...reviews, ...newCards];
}

export function dueQueueIds(
  cards: PracticeCard[],
  meta: NewDayMeta,
  now = new Date(),
  size = 8,
): string[] {
  return dueCards(cards, meta, now)
    .slice(0, Math.max(0, size))
    .map((card) => card.questionId);
}

export function dueCount(
  cards: PracticeCard[],
  meta: NewDayMeta,
  now = new Date(),
): number {
  return dueCards(cards, meta, now).length;
}

export function nextReviewAt(
  cards: PracticeCard[],
  now = new Date(),
): string | null {
  const nowMs = now.getTime();
  let next: PracticeCard | undefined;
  for (const card of cards) {
    const dueMs = Date.parse(card.dueAt);
    if (
      dueMs > nowMs &&
      (!next || dueMs < Date.parse(next.dueAt))
    ) {
      next = card;
    }
  }
  return next?.dueAt ?? null;
}
