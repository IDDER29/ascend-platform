# Practice v2 Custom Deck — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Working `/practicev2/custom` builder with database-backed saved decks, surfaced on the practice home.

**Architecture:** Pure recipe validation shared by server actions and queries; pure custom model builds lesson groups and deck summaries from the bank model's rows; client component holds picker state and calls server actions; session page takes `cards` + `label`.

**Tech Stack:** Next.js App Router, React 19, Tailwind v4, Drizzle (Postgres + SQLite), `node:test` via `npx tsx --test`.

## Global Constraints

- `--coach-*` colors only; hub scale; `practice-coach-v2` on `main`.
- Max 20 cards per session; max 20 decks per user; deck name 1–40 chars.
- Session label: deck name or "Custom deck"; default "Selected cards"; scopeType "all".

---

### Task 1: Recipe validation + session label (TDD)

**Files:** create `src/lib/practice/deck-recipe.ts` + test; modify `coach-v2-flow.ts` + test.

```ts
export type DeckFilter = "all" | "weak" | "due";
export type DeckFormat = PracticeItem["kind"];
export const DECK_FORMATS: DeckFormat[] = ["mcq", "flashcard", "cloze", "typed"];
export const DECK_NAME_MAX = 40;
export const MAX_DECKS = 20;
export type DeckRecipe = { lessonKeys: string[]; filter: DeckFilter; formats: DeckFormat[] };
export type SavedDeck = DeckRecipe & { id: string; name: string; updatedAt: string };
export type DeckInput = DeckRecipe & { name: string };
export function normalizeDeckInput(raw: unknown, knownLessonKeys: Set<string>):
  { ok: true; deck: DeckInput } | { ok: false; error: string };
export function parseStoredList(raw: string): string[];
export function parseCoachV2Label(input): string | null; // in coach-v2-flow.ts
```

- [ ] Tests: name trimmed/whitespace-collapsed, empty or > 40 rejected; unknown lesson keys dropped, deduped, none left → error; bad filter → error; formats filtered to known, deduped, none → error; non-object → error. Label: missing → null, trimmed, control chars removed, capped at 40, blank → null.
- [ ] FAIL → implement → PASS.

### Task 2: Custom model (TDD)

**Files:** create `src/lib/practice/coach-custom-model.ts` + test. Consumes `BankRow` from `coach-bank-model.ts`, `PRACTICE_TREE` from `tree.ts`.

```ts
export type LessonTag = "needs-work" | "not-started" | null;
export type CustomLesson = { key; title; total; due; weak; seen; strength: Record<BankStrength, number>; tag: LessonTag };
export type CustomSection = { id; title; lessons: CustomLesson[] };
export type CustomPath = { pathSlug; title; sections: CustomSection[]; lessonKeys: string[]; cardCount: number };
export type QuickPick = "needs-work" | "due" | "not-started";
export type DeckSummary = {
  total: number; counts: Record<DeckFilter, number>;
  formats: { value: DeckFormat; label: string; count: number }[];
  pickedIds: string[]; lessonTitles: string[];
};
export function buildCustomLessons(rows: BankRow[]): CustomPath[];
export function quickPickKeys(paths: CustomPath[], pick: QuickPick): string[];
export function summarizeDeck(rows: BankRow[], recipe: DeckRecipe): DeckSummary;
export function defaultDeckName(titles: string[]): string;
export function deckSessionHref(ids: string[], label: string): string;
```

- [ ] Tests: groups follow tree order, only lessons with rows; lesson counts/tags (needs-work ≥ 1/3 weak, not-started all new); quick picks; summary counts per filter (computed after lesson + format filter), formats counted after lesson + which-cards filter, total after all; priority order due (dueSort asc) → weak → solid → mastered → new, capped 20; unknown lesson keys ignored; default name (1, 2, 3+ titles, ≤ 40); href encodes label.
- [ ] FAIL → implement → PASS.

### Task 3: Database + server actions + query

**Files:** `src/lib/db/schema.pg.ts`, `schema.sqlite.ts`, `sqlite-ddl.ts` (table `practice_decks`, index `practice_decks_user_idx`); `src/lib/practice/queries.ts` (`listPracticeDecksForUser(userId): Promise<SavedDeck[]>`, newest `updatedAt` first); `src/lib/practice/actions.ts` (`savePracticeDeckAction(input: DeckInput & { id?: string }): Promise<{ ok: true; deck: SavedDeck } | { ok: false; error: string }>`, `deletePracticeDeckAction(id: string): Promise<PracticeActionResult>`); `server-page-data.ts` adds `initialDecks`.

- [ ] Implement; tsc passes.

### Task 4: UI, session label, home card

**Files:** create `src/components/practice/coach-custom/{custom-header,saved-decks,lesson-picker,deck-panel,custom-skeleton}.tsx`; rewrite `practice-coach-v2-custom.tsx`; update `src/app/(learner)/practicev2/custom/page.tsx`; delete `practice-coach-v2-custom-markup.ts`; create `coach-home/your-decks.tsx`, wire into home-live + home page; session-live uses `parseCoachV2Label`.

- [ ] Build; Enter starts; skeleton until local data loads.
- [ ] tsc, lint, tests; Playwright: pick lessons + quick picks + filters, start over-cap deck (20 cards, label "Custom deck"), sign up → save deck → reload → deck listed on custom + home → start from home (label = deck name) → edit → delete; guest sees "Sign in to save decks"; dark; mobile no overflow.
- [ ] Commit.
