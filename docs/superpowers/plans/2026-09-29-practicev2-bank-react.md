# Practice v2 Card Bank — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static `/practicev2/bank` markup with a working, filterable card list that can start a session from picked cards.

**Architecture:** Pure model builds rows/counts/options from cards, history and unlocked questions; a pure filter narrows rows; a client component holds filter and selection state. The session page gains a `cards` URL param.

**Tech Stack:** Next.js App Router, React 19, Tailwind v4, `node:test` via `npx tsx --test`.

## Global Constraints

- `--coach-*` colors only; hub scale; `practice-coach-v2` on `main`.
- Format labels: mcq "Choices", flashcard "Flashcard", typed "Short answer", cloze "Cloze".
- Max 20 picked cards; picked session label "Selected cards", scopeType "all".

---

### Task 1: Shared helpers (TDD)

**Files:** `src/lib/practice/tree.ts` (`practiceLessonTitle(key): string | null`), `src/lib/practice/coach-home-model.ts` (export `cardStrength(card): BankStrength`, use it in `strengthBuckets`), `src/lib/practice/coach-complete-model.ts` (use `practiceLessonTitle`), `src/lib/practice/coach-v2-flow.ts` + test (`parseCoachV2CardIds(input): string[]` — comma split, trim, drop empties/unsafe, dedupe, max 20).

- [ ] Tests for `parseCoachV2CardIds` (missing → [], dedupe, cap 20, junk dropped); run → FAIL; implement; run → PASS.

### Task 2: Bank model (TDD)

**Files:** create `src/lib/practice/coach-bank-model.ts` + test.

```ts
export type BankStrength = "new" | "learning" | "solid" | "mastered";
export type BankFormat = PracticeItem["kind"];
export type BankRow = {
  id: string; text: string; format: BankFormat; formatLabel: string;
  lessonKey: string; lessonTitle: string; strength: BankStrength;
  dueLabel: string; dueToday: boolean; dueSort: number;
  correct: number; seen: number;
};
export type CoachBankModel = {
  rows: BankRow[]; total: number; dueToday: number;
  strengthCounts: Record<BankStrength, number>;
  lessons: { key: string; title: string }[];
  formats: { value: BankFormat; label: string }[];
};
export type BankFilters = {
  query: string; lesson: string | null;
  format: BankFormat | null; strength: BankStrength | null;
};
export function buildCoachBankModel(input: {
  cards: PracticeCard[]; history: PracticeSessionRecord[];
  completedKeys: Set<string>; now: Date;
}): CoachBankModel;
export function filterBankRows(rows: BankRow[], filters: BankFilters): BankRow[];
```

- [ ] Tests: rows only for unlocked questions; missing card → new; strength buckets; due labels ("Today", "Sat, Sep 26", "Not seen yet") and sort; correct/seen from history; counts; filters combine (query on text + lesson, lesson, format, strength).
- [ ] Run → FAIL; implement; run → PASS.

### Task 3: UI + session param

**Files:** create `src/components/practice/coach-bank/{bank-header,bank-filters,bank-table,selection-bar}.tsx`; rewrite `src/components/practice/practice-coach-v2-bank.tsx` (props `userId`, `completedKeys`, `initialCards`, `initialHistory`, `reviewHrefs`); update `src/app/(learner)/practicev2/bank/page.tsx` to load `loadPracticePageData()`; delete `practice-coach-v2-bank-markup.ts`; session page reads `parseCoachV2CardIds`.

- [ ] Build UI; skeleton until local data loads.
- [ ] Session: when card ids present, pool = ids ∩ unlocked, size = count, label "Selected cards".
- [ ] tsc, lint, tests; Playwright: filters, select 3 → Practice these 3 → session has 3 cards labelled Selected cards; dark; mobile no overflow.
- [ ] Commit.
