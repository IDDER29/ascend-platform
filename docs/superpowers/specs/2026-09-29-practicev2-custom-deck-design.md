# Practice v2 — Custom deck + saved decks

## Problem

`/practicev2/custom` injects static markup: fake lessons and counts, inert
checkboxes, a "Start 6 cards" button that goes nowhere, and a "Save as a
deck" button with no storage behind it. Hex colors, no dark mode, 1100px.

## Design

Hub scale (960px, 32px title). Breadcrumb "Practice / Custom deck". Header
"Build a custom deck", lede "Pick the lessons you want to drill. Answers
still count toward your schedule and daily goal."

- **Saved decks** (signed in, ≥ 1 deck): row of deck cards above the
  builder — name, live count ("14 cards · 3 due", or "No cards right
  now"), Start, Edit (loads the recipe into the builder), Delete.
- **Lesson picker** (left): lessons with unlocked cards, grouped by path →
  section (curriculum order). Row: checkbox, title, "{n} cards · {d} due" or
  "none seen yet", small strength bar, tag "Needs work" / "Not started".
  Path header "Select all" / "Clear". Quick picks "Needs work", "Has due
  cards", "Not started" replace the selection. Footnote "Finish more lessons
  to add their cards."
- **Your deck panel** (right, sticky on `lg`; below on mobile): card count,
  "From {n} lessons · {titles}"; "Which cards" segmented All / Weak only /
  Due only with counts; format checkboxes (only formats present, with
  counts); lime Start "Start {n} cards" or "Start 20 of {n}" (Enter
  starts); "Save as a deck" → inline name field prefilled from lesson titles
  (≤ 40 chars). When a saved deck is loaded the button reads "Save changes"
  and a "New deck" link clears the builder. Guests: "Sign in to save decks"
  link. Nothing picked or zero cards: Start disabled, "Pick at least one
  lesson" / "No cards match".

### Rules

- Weak card = strength "learning". Due = due before end of today.
- Lesson "Needs work" = at least a third of its cards are weak (and ≥ 1).
  "Not started" = every card new.
- Deck > 20 cards: due first (most overdue first), then weak, then solid,
  mastered, new; take 20.
- Session: `cards=` ids plus new optional `label=` (trimmed, ≤ 40 chars).
  Label is "Custom deck" or the saved deck name; default "Selected cards".
  scopeType stays "all".

### Saved decks (database)

- Table `practice_decks`: `id`, `user_id` (FK users, cascade), `name`,
  `lesson_keys` (JSON), `filter` (`all|weak|due`), `formats` (JSON),
  `created_at`, `updated_at`; index on `user_id`. Added to Postgres schema,
  SQLite schema and SQLite DDL.
- Stores the recipe, not card ids. Lessons no longer unlocked are skipped at
  build time.
- Server actions: save (insert or update own deck) and delete. Signed in
  only; name trimmed 1–40; lesson keys must exist in the practice bank,
  deduped, ≥ 1; filter valid; formats ⊆ the four kinds, ≥ 1; max 20 decks
  per user.
- `listPracticeDecksForUser` loaded with the other practice page data.

### Home

"Your decks" card in the right column under Card strength: up to 3 decks
(name, count, Start), "All decks" → Custom. Hidden for guests and users with
no decks.

## Code

- `src/lib/practice/deck-recipe.ts` — types + `normalizeDeckInput` (tested).
- `src/lib/practice/coach-custom-model.ts` — lesson groups, quick picks,
  deck summary + prioritized pick, default name, session href (tested).
- `src/lib/practice/coach-v2-flow.ts` — `parseCoachV2Label` (tested).
- `src/lib/practice/{actions,queries,server-page-data}.ts`, DB schemas/DDL.
- `src/components/practice/coach-custom/*`, rewritten
  `practice-coach-v2-custom.tsx`; `coach-home/your-decks.tsx`. Delete
  `practice-coach-v2-custom-markup.ts`.
