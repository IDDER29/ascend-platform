import type { BankRow, BankStrength } from "./coach-bank-model";
import { COACH_V2_MAX_SIZE } from "./coach-v2-flow";
import {
  DECK_FORMATS,
  DECK_NAME_MAX,
  type DeckFilter,
  type DeckFormat,
  type DeckRecipe,
  type SavedDeck,
} from "./deck-recipe";
import { PRACTICE_TREE } from "./tree";
import { PRACTICE_ROUTES } from "./routes";

export const DECK_FORMAT_LABELS: Record<DeckFormat, string> = {
  mcq: "Choices",
  flashcard: "Flashcards",
  cloze: "Fill in the blank",
  output: "Predict the output",
  bug: "Spot the bug",
  order: "Put in order",
  bits: "Flip the bits",
  typed: "Short answer",
};

export type LessonTag = "needs-work" | "not-started" | null;

export type CustomLesson = {
  key: string;
  title: string;
  total: number;
  due: number;
  weak: number;
  seen: number;
  strength: Record<BankStrength, number>;
  tag: LessonTag;
};

export type CustomSection = { id: string; title: string; lessons: CustomLesson[] };

export type CustomPath = {
  pathSlug: string;
  title: string;
  sections: CustomSection[];
  lessonKeys: string[];
  cardCount: number;
};

export type QuickPick = "needs-work" | "due" | "not-started";

export type DeckSummary = {
  total: number;
  counts: Record<DeckFilter, number>;
  formats: { value: DeckFormat; label: string; count: number }[];
  pickedIds: string[];
  lessonTitles: string[];
};

const isWeak = (row: BankRow) => row.strength === "learning";

function rowsByLesson(rows: BankRow[]): Map<string, BankRow[]> {
  const map = new Map<string, BankRow[]>();
  for (const row of rows) {
    const list = map.get(row.lessonKey) ?? [];
    list.push(row);
    map.set(row.lessonKey, list);
  }
  return map;
}

function lessonSummary(key: string, title: string, rows: BankRow[]): CustomLesson {
  const strength = { new: 0, learning: 0, solid: 0, mastered: 0 };
  for (const row of rows) strength[row.strength] += 1;
  const weak = strength.learning;
  const seen = rows.length - strength.new;
  return {
    key,
    title,
    total: rows.length,
    due: rows.filter((row) => row.dueToday).length,
    weak,
    seen,
    strength,
    tag: seen === 0 ? "not-started" : weak > 0 && weak * 3 >= rows.length ? "needs-work" : null,
  };
}

export function buildCustomLessons(rows: BankRow[]): CustomPath[] {
  const byLesson = rowsByLesson(rows);
  return PRACTICE_TREE.map((path): CustomPath => {
    const sections = path.sections
      .map((section) => ({
        id: section.id,
        title: section.title,
        lessons: section.lessons
          .filter((lesson) => byLesson.has(lesson.key))
          .map((lesson) => lessonSummary(lesson.key, lesson.title, byLesson.get(lesson.key)!)),
      }))
      .filter((section) => section.lessons.length > 0);
    const lessons = sections.flatMap((section) => section.lessons);
    return {
      pathSlug: path.pathSlug,
      title: path.title,
      sections,
      lessonKeys: lessons.map((lesson) => lesson.key),
      cardCount: lessons.reduce((sum, lesson) => sum + lesson.total, 0),
    };
  }).filter((path) => path.sections.length > 0);
}

export function quickPickKeys(paths: CustomPath[], pick: QuickPick): string[] {
  return paths
    .flatMap((path) => path.sections.flatMap((section) => section.lessons))
    .filter((lesson) => (pick === "due" ? lesson.due > 0 : lesson.tag === pick))
    .map((lesson) => lesson.key);
}

const MATCHES_FILTER: Record<DeckFilter, (row: BankRow) => boolean> = {
  all: () => true,
  weak: isWeak,
  due: (row) => row.dueToday,
};

const STRENGTH_RANK: Record<BankStrength, number> = { learning: 1, solid: 2, mastered: 3, new: 4 };

function priority(row: BankRow): number {
  return row.dueToday ? 0 : STRENGTH_RANK[row.strength];
}

const LESSON_ORDER = new Map(
  PRACTICE_TREE.flatMap((path) =>
    path.sections.flatMap((section) => section.lessons.map((lesson) => [lesson.key, lesson.title] as const)),
  ).map(([key, title], index) => [key, { title, index }] as const),
);

export function summarizeDeck(rows: BankRow[], recipe: DeckRecipe): DeckSummary {
  const lessonKeys = new Set(recipe.lessonKeys);
  const formats = new Set(recipe.formats);
  const inLessons = rows.filter((row) => lessonKeys.has(row.lessonKey));
  const inFormats = inLessons.filter((row) => formats.has(row.format));
  const inFilter = inLessons.filter(MATCHES_FILTER[recipe.filter]);
  const deck = inFilter.filter((row) => formats.has(row.format));

  const formatCounts = DECK_FORMATS.map((value) => ({
    value,
    label: DECK_FORMAT_LABELS[value],
    count: inFilter.filter((row) => row.format === value).length,
  })).filter((format) => format.count > 0);

  const presentLessons = [...new Set(inLessons.map((row) => row.lessonKey))]
    .filter((key) => LESSON_ORDER.has(key))
    .sort((a, b) => LESSON_ORDER.get(a)!.index - LESSON_ORDER.get(b)!.index);

  return {
    total: deck.length,
    counts: {
      all: inFormats.length,
      weak: inFormats.filter(MATCHES_FILTER.weak).length,
      due: inFormats.filter(MATCHES_FILTER.due).length,
    },
    formats: formatCounts,
    pickedIds: [...deck]
      .sort((a, b) => priority(a) - priority(b) || a.dueSort - b.dueSort || a.id.localeCompare(b.id))
      .slice(0, COACH_V2_MAX_SIZE)
      .map((row) => row.id),
    lessonTitles: presentLessons.map((key) => LESSON_ORDER.get(key)!.title),
  };
}

export function defaultDeckName(titles: string[]): string {
  const name =
    titles.length === 0
      ? "Custom deck"
      : titles.length === 1
        ? titles[0]!
        : titles.length === 2
          ? `${titles[0]} + ${titles[1]}`
          : `${titles[0]} + ${titles.length - 1} more`;
  return name.length > DECK_NAME_MAX ? `${name.slice(0, DECK_NAME_MAX - 1)}…` : name;
}

export function deckSessionHref(ids: string[], label: string): string {
  return `${PRACTICE_ROUTES.session}?scope=all&cards=${ids.join(",")}&label=${encodeURIComponent(label)}`;
}

export type SavedDeckItem = { deck: SavedDeck; summary: DeckSummary; href: string | null };

export function savedDeckItems(rows: BankRow[], decks: SavedDeck[]): SavedDeckItem[] {
  return decks.map((deck) => {
    const summary = summarizeDeck(rows, deck);
    return {
      deck,
      summary,
      href: summary.total > 0 ? deckSessionHref(summary.pickedIds, deck.name) : null,
    };
  });
}
