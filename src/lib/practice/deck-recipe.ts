import type { PracticeItem } from "./types";

export type DeckFilter = "all" | "weak" | "due";
export type DeckFormat = PracticeItem["kind"];

export const DECK_FILTERS: DeckFilter[] = ["all", "weak", "due"];
export const DECK_FORMATS: DeckFormat[] = ["mcq", "flashcard", "cloze", "typed"];
export const DECK_NAME_MAX = 40;
export const MAX_DECKS = 20;

export type DeckRecipe = {
  lessonKeys: string[];
  filter: DeckFilter;
  formats: DeckFormat[];
};

export type DeckInput = DeckRecipe & { name: string };

export type SavedDeck = DeckInput & { id: string; updatedAt: string };

/** Collapses whitespace and drops control characters. */
export function cleanDeckText(value: string): string {
  return value.replace(/\s+/g, " ").replace(/[\u0000-\u001f\u007f]/g, "").trim();
}

function uniqueStrings(value: unknown, keep: (item: string) => boolean): string[] | null {
  if (!Array.isArray(value)) return null;
  const items = value.filter((item): item is string => typeof item === "string" && keep(item));
  return [...new Set(items)];
}

export function normalizeDeckInput(
  raw: unknown,
  knownLessonKeys: Set<string>,
): { ok: true; deck: DeckInput } | { ok: false; error: string } {
  if (raw === null || typeof raw !== "object") {
    return { ok: false, error: "Invalid deck." };
  }
  const input = raw as Record<string, unknown>;

  const name = typeof input.name === "string" ? cleanDeckText(input.name) : "";
  if (name.length === 0 || name.length > DECK_NAME_MAX) {
    return { ok: false, error: `Deck names need 1 to ${DECK_NAME_MAX} characters.` };
  }

  const lessonKeys = uniqueStrings(input.lessonKeys, (key) => knownLessonKeys.has(key));
  if (!lessonKeys || lessonKeys.length === 0) {
    return { ok: false, error: "Pick at least one lesson." };
  }

  const filter = input.filter;
  if (typeof filter !== "string" || !DECK_FILTERS.includes(filter as DeckFilter)) {
    return { ok: false, error: "Invalid card filter." };
  }

  const formats = uniqueStrings(input.formats, (format) =>
    DECK_FORMATS.includes(format as DeckFormat),
  ) as DeckFormat[] | null;
  if (!formats || formats.length === 0) {
    return { ok: false, error: "Pick at least one format." };
  }

  return { ok: true, deck: { name, lessonKeys, filter: filter as DeckFilter, formats } };
}

export function parseStoredList(raw: string): string[] {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}
