# Practice v2 — Card bank (React rebuild)

## Problem

`/practicev2/bank` injects a static 10-row table. Search, lesson/format
selects, strength filter, checkboxes, "Practice these 2" and pagination are
inert; numbers are fake; hex colors (no dark mode); 48px title at 1100px.

## Design

Hub scale (960px, 32px title). Breadcrumb "Practice / Card bank".

- Header: "Card bank", lede "Every card you've unlocked, how well you know
  it, and when it comes back.", right side "{n} cards · {d} due today".
- Filters (combine): search (card text + lesson title), Lesson select
  (lessons that have unlocked cards), Format select (Choices, Flashcard,
  Short answer, Cloze), strength segmented control with counts (All, New,
  Learning, Solid, Mastered). "Clear filters" when any is active.
- List: all matching unlocked cards, no pagination. Columns: select, card
  text, format badge, lesson (link), strength meter + label, next due,
  correct/seen from history ("—" when unseen). Sort: next due ascending,
  never-seen last. Due today/overdue = orange "Today"; new = "Not seen yet".
  Table from `sm`, stacked rows below. Empty: "No cards match these
  filters." + Clear filters.
- Selection: header checkbox toggles visible rows; max 20 selected (session
  cap) — remaining boxes disable with a note. Dark bar: "{n} selected",
  Clear, lime "Practice these {n}" →
  `/practicev2/session?scope=all&cards=id1,id2`.
- Session page: `cards` param (comma list, deduped, max 20, unlocked only)
  replaces the pool; label "Selected cards"; saved with scopeType "all".

Strength: new = state new; learning = state learning; mastered = review with
interval ≥ 21 days; solid = other review. Shared `cardStrength()` also used
by home.

## Code

- `src/lib/practice/coach-bank-model.ts` — `buildCoachBankModel`,
  `filterBankRows` (tested).
- `src/lib/practice/coach-v2-flow.ts` — `parseCoachV2CardIds` (tested).
- `src/lib/practice/coach-home-model.ts` — export `cardStrength`.
- `src/lib/practice/tree.ts` — `practiceLessonTitle(key)` shared with the
  complete model.
- `src/components/practice/coach-bank/*`, rewritten
  `practice-coach-v2-bank.tsx`; delete `practice-coach-v2-bank-markup.ts`.
