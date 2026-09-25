# Practice Phase C — SM-2 Card Schedule Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the flat miss queue with per-card SM-2 scheduling (Again/Good from MCQ) so Due is real due dates for guests and signed-in users.

**Architecture:** Pure `sm2.ts` grades cards; `cards.ts` owns localStorage + miss-queue migrate + due selection; DB `practice_cards` + server actions sync signed-in state; `buildSession` / Practice hub consume card due sets instead of miss IDs. Batch upsert on session end.

**Tech Stack:** Next.js App Router, React client, Drizzle (SQLite + Postgres schemas), TypeScript, Node `node:test` via `npx tsx --test` (no project test runner yet).

## Global Constraints

- Phosphor only — no purple; no Practice XP / streaks / email
- Grades: wrong → Again; correct → Good (no Hard/Easy UI)
- Due sessions: due reviews/learning unlimited + new under 20/day cap; soft session size 8; no filler
- Free study also calls `gradeCard` and consumes the daily new allowance when leaving `new`
- Guests: `localStorage`; signed-in: DB wins on load, mirror to local cache
- Hit rate / Recent stay correct÷seen from session history — not ease/mastery

## File map

| File | Responsibility |
|------|----------------|
| `src/lib/practice/sm2.ts` | Pure card factory + `gradeCard` + date helpers |
| `src/lib/practice/sm2.test.ts` | Unit tests for grade transitions |
| `src/lib/practice/cards.ts` | Storage, ensure, migrate, due counts, new-day meta |
| `src/lib/practice/cards.test.ts` | Migrate + due selection + new cap |
| `src/lib/practice/session.ts` | `buildSession` takes due ids / cards instead of miss queue |
| `src/lib/practice/actions.ts` | `listPracticeCardsForUser` / `upsertPracticeCardsAction` |
| `src/lib/db/schema.pg.ts` / `schema.sqlite.ts` / `sqlite-ddl.ts` | `practice_cards` table |
| `src/app/(learner)/practice/page.tsx` | Load initial cards for signed-in |
| `src/components/practice/practice-home.tsx` | Hub Due copy + grade on finish + drop miss CTAs |
| `src/lib/practice/demo.ts` (+ home demo seeds) | Demo card states for `?demo=1` |
| Spec status | `docs/superpowers/specs/2026-09-25-practice-sm2-phase-c-design.md` |

---

### Task 1: Pure SM-2 grader

**Files:**
- Create: `src/lib/practice/sm2.ts`
- Create: `src/lib/practice/sm2.test.ts`
- Modify: `docs/superpowers/specs/2026-09-25-practice-sm2-phase-c-design.md` (Status → Implementing)

**Interfaces:**
- Produces:
  - `export type CardState = "new" | "learning" | "review"`
  - `export type PracticeGrade = "again" | "good"`
  - `export type PracticeCard = { questionId: string; state: CardState; reps: number; ease: number; intervalDays: number; dueAt: string; lapses: number; updatedAt: string }`
  - `export function createNewCard(questionId: string, now?: Date): PracticeCard`
  - `export function gradeCard(card: PracticeCard, grade: PracticeGrade, now?: Date): PracticeCard`
  - `export function localDayKey(now?: Date): string` → `YYYY-MM-DD` in local TZ
  - `export function addDaysIso(now: Date, days: number): string`

- [ ] **Step 1: Write failing tests**

```ts
// src/lib/practice/sm2.test.ts
import assert from "node:assert/strict";
import { test } from "node:test";
import { createNewCard, gradeCard } from "./sm2";

test("Again on new → learning, due now, ease floor path", () => {
  const now = new Date("2026-09-25T12:00:00.000Z");
  const card = createNewCard("bits-01", now);
  const next = gradeCard(card, "again", now);
  assert.equal(next.state, "learning");
  assert.equal(next.reps, 0);
  assert.equal(next.dueAt, now.toISOString());
  assert.ok(next.ease <= card.ease);
});

test("Good on new → review, interval 1 day", () => {
  const now = new Date("2026-09-25T12:00:00.000Z");
  const next = gradeCard(createNewCard("bits-01", now), "good", now);
  assert.equal(next.state, "review");
  assert.equal(next.reps, 1);
  assert.equal(next.intervalDays, 1);
  assert.equal(next.dueAt, new Date("2026-09-26T12:00:00.000Z").toISOString());
});

test("Good on review multiplies interval by ease", () => {
  const now = new Date("2026-09-25T12:00:00.000Z");
  let card = gradeCard(createNewCard("bits-01", now), "good", now);
  const day2 = new Date("2026-09-26T12:00:00.000Z");
  card = gradeCard(card, "good", day2);
  assert.equal(card.state, "review");
  assert.equal(card.reps, 2);
  assert.equal(card.intervalDays, Math.max(1, Math.round(1 * 2.6))); // ease bumped +0.1 from 2.5
  assert.ok(card.ease >= 2.5);
});

test("Again on review increments lapses and due now", () => {
  const now = new Date("2026-09-25T12:00:00.000Z");
  let card = gradeCard(createNewCard("bits-01", now), "good", now);
  const later = new Date("2026-09-26T12:00:00.000Z");
  card = gradeCard(card, "again", later);
  assert.equal(card.state, "learning");
  assert.equal(card.lapses, 1);
  assert.equal(card.dueAt, later.toISOString());
});
```

- [ ] **Step 2: Run tests — expect FAIL (module missing)**

```bash
npx --yes tsx --test src/lib/practice/sm2.test.ts
```

Expected: cannot find module `./sm2` or similar failure.

- [ ] **Step 3: Implement `sm2.ts`**

```ts
// src/lib/practice/sm2.ts
export type CardState = "new" | "learning" | "review";
export type PracticeGrade = "again" | "good";

export type PracticeCard = {
  questionId: string;
  state: CardState;
  reps: number;
  ease: number;
  intervalDays: number;
  dueAt: string;
  lapses: number;
  updatedAt: string;
};

const MIN_EASE = 1.3;
const MAX_EASE = 3.0;
const DEFAULT_EASE = 2.5;

export function localDayKey(now = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDaysIso(now: Date, days: number): string {
  const t = new Date(now.getTime());
  t.setDate(t.getDate() + days);
  return t.toISOString();
}

export function createNewCard(questionId: string, now = new Date()): PracticeCard {
  const iso = now.toISOString();
  return {
    questionId,
    state: "new",
    reps: 0,
    ease: DEFAULT_EASE,
    intervalDays: 0,
    dueAt: iso,
    lapses: 0,
    updatedAt: iso,
  };
}

export function gradeCard(
  card: PracticeCard,
  grade: PracticeGrade,
  now = new Date(),
): PracticeCard {
  const iso = now.toISOString();
  if (grade === "again") {
    return {
      ...card,
      state: "learning",
      reps: 0,
      ease: Math.max(MIN_EASE, card.ease - 0.2),
      intervalDays: 0,
      dueAt: iso,
      lapses: card.state === "review" ? card.lapses + 1 : card.lapses,
      updatedAt: iso,
    };
  }
  // Good
  if (card.state === "new" || card.state === "learning") {
    return {
      ...card,
      state: "review",
      reps: 1,
      intervalDays: 1,
      dueAt: addDaysIso(now, 1),
      updatedAt: iso,
    };
  }
  const ease = Math.min(MAX_EASE, card.ease + 0.1);
  const intervalDays = Math.max(1, Math.round(card.intervalDays * ease));
  return {
    ...card,
    state: "review",
    reps: card.reps + 1,
    ease,
    intervalDays,
    dueAt: addDaysIso(now, intervalDays),
    updatedAt: iso,
  };
}
```

Fix the test’s ease expectation to match this implementation (after first Good ease stays 2.5; second Good uses `ease = min(3, 2.5+0.1)=2.6`, interval `round(1*2.6)=3`).

- [ ] **Step 4: Run tests — expect PASS**

```bash
npx --yes tsx --test src/lib/practice/sm2.test.ts
```

- [ ] **Step 5: Set spec Status to Implementing; commit**

```bash
git add src/lib/practice/sm2.ts src/lib/practice/sm2.test.ts docs/superpowers/specs/2026-09-25-practice-sm2-phase-c-design.md
git commit -m "feat(practice): add SM-2 grade helper"
```

---

### Task 2: Card store, migrate, due selection

**Files:**
- Create: `src/lib/practice/cards.ts`
- Create: `src/lib/practice/cards.test.ts`
- Keep: `src/lib/practice/miss-queue.ts` (read-only for migrate)

**Interfaces:**
- Consumes: `PracticeCard`, `createNewCard`, `gradeCard`, `localDayKey` from `sm2.ts`; `readMissIds` / `missQueueKey` from `miss-queue.ts`; unlocked question ids
- Produces:
  - `export type NewDayMeta = { date: string; count: number }`
  - `export const NEW_PER_DAY = 20`
  - `export function cardsStorageKey(userId: string | null): string`
  - `export function newDayStorageKey(userId: string | null): string`
  - `export function readCards(userId: string | null): PracticeCard[]`
  - `export function writeCards(userId: string | null, cards: PracticeCard[]): void`
  - `export function readNewDayMeta(userId: string | null): NewDayMeta`
  - `export function writeNewDayMeta(userId: string | null, meta: NewDayMeta): void`
  - `export function ensureUnlockedCards(userId: string | null, unlockedIds: string[], now?: Date): PracticeCard[]`
  - `export function migrateMissQueueOnce(userId: string | null, now?: Date): PracticeCard[]`
  - `export function applyGrades(userId: string | null, grades: { questionId: string; correct: boolean }[], now?: Date): PracticeCard[]`
  - `export function dueQueueIds(cards: PracticeCard[], meta: NewDayMeta, now?: Date, size?: number): string[]`
  - `export function dueCount(cards: PracticeCard[], meta: NewDayMeta, now?: Date): number`
  - `export function nextReviewAt(cards: PracticeCard[], now?: Date): string | null`

- [ ] **Step 1: Write failing tests for due cap + migrate**

```ts
// src/lib/practice/cards.test.ts
import assert from "node:assert/strict";
import { test } from "node:test";
import { createNewCard, gradeCard } from "./sm2";
import { NEW_PER_DAY, dueCount, dueQueueIds } from "./cards";

test("dueCount respects new-per-day remaining", () => {
  const now = new Date("2026-09-25T15:00:00");
  const cards = Array.from({ length: 25 }, (_, i) =>
    createNewCard(`q-${i}`, now),
  );
  const meta = { date: "2026-09-25", count: 0 };
  assert.equal(dueCount(cards, meta, now), NEW_PER_DAY);
  const ids = dueQueueIds(cards, meta, now, 8);
  assert.equal(ids.length, 8);
});

test("reviews due are unlimited ahead of new drip", () => {
  const now = new Date("2026-09-25T15:00:00");
  const review = gradeCard(createNewCard("r1", now), "good", now);
  review.dueAt = now.toISOString();
  review.state = "review";
  const news = Array.from({ length: 5 }, (_, i) => createNewCard(`n-${i}`, now));
  const meta = { date: "2026-09-25", count: 0 };
  const ids = dueQueueIds([review, ...news], meta, now, 8);
  assert.equal(ids[0], "r1");
});
```

(For migrate, either mock `localStorage` in the test environment or export a pure `migrateMissIdsIntoCards(cards, missIds, now)` and test that.)

Add pure helper:

```ts
export function mergeMissesAsLearning(
  cards: PracticeCard[],
  missIds: string[],
  now = new Date(),
): PracticeCard[] {
  const map = new Map(cards.map((c) => [c.questionId, c]));
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
```

- [ ] **Step 2: Run tests — expect FAIL**

```bash
npx --yes tsx --test src/lib/practice/cards.test.ts
```

- [ ] **Step 3: Implement `cards.ts`**

Key behaviors:
- Storage prefix `ascend_practice_cards_v1` / `ascend_practice_new_day_v1`
- `ensureUnlockedCards`: insert `createNewCard` for missing ids; persist
- `migrateMissQueueOnce`: if miss key has ids, `mergeMissesAsLearning`, write cards, `localStorage.removeItem(missQueueKey)`, return cards
- `applyGrades`: for each answer, `gradeCard`; if previous state was `new`, bump `NewDayMeta.count` for `localDayKey(now)` (reset count if date rolled)
- `dueQueueIds`: filter `dueAt <= now`; partition learning+review vs new; take all due learning/review then new up to `max(0, NEW_PER_DAY - meta.count)`; slice `size` (default 8)
- `dueCount`: same set size without session slice
- `nextReviewAt`: min `dueAt` among cards with `dueAt > now`, else null
- Guard all `window` access like `miss-queue.ts`

- [ ] **Step 4: Run tests — expect PASS**

```bash
npx --yes tsx --test src/lib/practice/sm2.test.ts src/lib/practice/cards.test.ts
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/practice/cards.ts src/lib/practice/cards.test.ts
git commit -m "feat(practice): card store, due selection, miss migrate"
```

---

### Task 3: DB `practice_cards` + server actions

**Files:**
- Modify: `src/lib/db/schema.sqlite.ts`
- Modify: `src/lib/db/schema.pg.ts`
- Modify: `src/lib/db/sqlite-ddl.ts`
- Modify: `src/lib/practice/actions.ts`
- Modify: `src/lib/practice/types.ts` (optional re-export of `PracticeCard` if useful)

**Interfaces:**
- Consumes: `PracticeCard` from `sm2.ts`
- Produces:
  - table `practice_cards`
  - `listPracticeCardsForUser(userId: string): Promise<PracticeCard[]>`
  - `upsertPracticeCardsAction(cards: PracticeCard[]): Promise<PracticeActionResult>`

- [ ] **Step 1: Add SQLite table + DDL**

```ts
// schema.sqlite.ts — after practiceSessions
export const practiceCards = sqliteTable("practice_cards", {
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  questionId: text("question_id").notNull(),
  state: text("state").notNull(),
  reps: integer("reps").notNull().default(0),
  ease: text("ease").notNull().default("2.5"), // store as text to avoid float quirks, parse Float
  intervalDays: integer("interval_days").notNull().default(0),
  dueAt: text("due_at").notNull(),
  lapses: integer("lapses").notNull().default(0),
  updatedAt: text("updated_at").notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.questionId] }),
}));
```

Use whatever primary-key helper this codebase already uses for composites; if none, use a single `id` text PK `${userId}:${questionId}` instead (simpler — **prefer composite-free `id` text PK** to match `practice_sessions` style):

```ts
export const practiceCards = sqliteTable("practice_cards", {
  id: text("id").primaryKey(), // `${userId}:${questionId}`
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  questionId: text("question_id").notNull(),
  state: text("state").notNull(),
  reps: integer("reps").notNull().default(0),
  ease: real("ease").notNull().default(2.5),
  intervalDays: integer("interval_days").notNull().default(0),
  dueAt: text("due_at").notNull(),
  lapses: integer("lapses").notNull().default(0),
  updatedAt: text("updated_at").notNull(),
});
```

Mirror in `schema.pg.ts` (`real` → `doublePrecision` or `real` as used elsewhere in pg schema).

DDL:

```sql
CREATE TABLE IF NOT EXISTS practice_cards (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  state TEXT NOT NULL,
  reps INTEGER NOT NULL DEFAULT 0,
  ease REAL NOT NULL DEFAULT 2.5,
  interval_days INTEGER NOT NULL DEFAULT 0,
  due_at TEXT NOT NULL,
  lapses INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS practice_cards_user_due_idx ON practice_cards(user_id, due_at);
```

- [ ] **Step 2: Actions**

```ts
export async function listPracticeCardsForUser(userId: string): Promise<PracticeCard[]> {
  if (!db) return [];
  try {
    const rows = await db.select().from(schema.practiceCards)
      .where(eq(schema.practiceCards.userId, userId));
    return rows.map(rowToCard);
  } catch {
    return [];
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
      const id = `${user.id}:${card.questionId}`;
      await db
        .insert(schema.practiceCards)
        .values({ id, userId: user.id, ...cardFields(card) })
        .onConflictDoUpdate({
          target: schema.practiceCards.id,
          set: cardFields(card),
        });
    }
    revalidatePath("/practice");
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not sync Practice cards (table may need a migration)." };
  }
}
```

Match Drizzle upsert APIs already used in the repo if different; otherwise loop delete+insert is acceptable for ≤8 cards per session.

Also persist new-day meta for signed-in: either a second small table / row `practice_card_meta(user_id, date, count)` **or** keep new-day meta **local-only** even when signed-in (acceptable for v1 — document in commit message). **Plan choice: local-only new-day meta** (simpler; Due drip is device-day). Cards themselves sync.

- [ ] **Step 3: Ensure schema export includes `practiceCards` in `src/lib/db/client` schema object** (grep how `practiceSessions` is exported and mirror).

- [ ] **Step 4: `npx tsc --noEmit` clean**

- [ ] **Step 5: Commit**

```bash
git add src/lib/db/schema.sqlite.ts src/lib/db/schema.pg.ts src/lib/db/sqlite-ddl.ts src/lib/practice/actions.ts
git commit -m "feat(practice): persist practice_cards for signed-in SM-2"
```

---

### Task 4: Session builder uses due ids

**Files:**
- Modify: `src/lib/practice/session.ts`

**Interfaces:**
- Consumes: due id list from `dueQueueIds` / caller
- Produces: updated `buildSession`

- [ ] **Step 1: Change `buildSession` signature**

Replace `missIds: string[]` with `priorityIds: string[]` (due ids for due scope; for free study = due-in-scope first).

```ts
export function buildSession(opts: {
  completedKeys: Set<string>;
  priorityIds: string[];
  size?: number;
  scope?: PracticeScope;
}): PracticeQuestion[] {
  const size = opts.size ?? 8;
  const scope = opts.scope ?? { type: "all" };
  const pool = questionsForScope(opts.completedKeys, scope);
  const byId = new Map(pool.map((q) => [q.id, q]));
  const picked: PracticeQuestion[] = [];
  const seen = new Set<string>();

  for (const id of opts.priorityIds) {
    const q = byId.get(id);
    if (!q || seen.has(q.id)) continue;
    picked.push(q);
    seen.add(q.id);
    if (picked.length >= size) return picked;
  }

  if (scope.type === "due") return picked;

  const rest = pool.filter((q) => !seen.has(q.id));
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rest[i], rest[j]] = [rest[j], rest[i]];
  }
  for (const q of rest) {
    picked.push(q);
    if (picked.length >= size) break;
  }
  return picked;
}
```

- [ ] **Step 2: Fix all call sites** (`practice-home.tsx` in Task 5 — temporarily pass `priorityIds: []` or update together in Task 5). Prefer **same commit as Task 5** if tsc breaks; otherwise commit session rename with home updated.

- [ ] **Step 3: Commit with Task 5** (see below) or alone if home already compiles.

---

### Task 5: Wire Practice UI + page load

**Files:**
- Modify: `src/app/(learner)/practice/page.tsx`
- Modify: `src/components/practice/practice-home.tsx`

**Interfaces:**
- Page passes `initialCards: PracticeCard[]` (DB list or `[]`)
- Home: on mount (client), if guest or empty server list → `readCards` / `ensureUnlockedCards` / `migrateMissQueueOnce`; if server cards present → `writeCards` cache then ensure/migrate
- Hub props: replace `waitingMisses` with `dueNow: number` and `nextReviewAt: string | null`

- [ ] **Step 1: Page load**

```ts
import { listPracticeCardsForUser } from "@/lib/practice/actions";
// ...
let initialCards: PracticeCard[] = [];
if (user && !demoOn) {
  initialCards = await listPracticeCardsForUser(user.id);
}
// pass to PracticeHome
```

- [ ] **Step 2: Home state bootstrap**

On client after unlock set known:
1. If `initialCards.length` → `writeCards(userId, initialCards)`
2. `migrateMissQueueOnce(effectiveUserId)`
3. `ensureUnlockedCards(effectiveUserId, [...unlockedIds])`
4. Subscribe/read `dueCount` / `nextReviewAt` for hub (useState + refresh after sessions; `useSyncExternalStore` optional)

- [ ] **Step 3: `startSession`**

```ts
const cards = readCards(effectiveUserId);
const meta = readNewDayMeta(effectiveUserId);
const priorityIds =
  scope.type === "due"
    ? dueQueueIds(cards, meta, new Date(), 8)
    : dueQueueIds(
        cards.filter((c) => /* in scope pool ids */),
        meta,
        new Date(),
        8,
      ); // for free study: prefer due-in-scope; buildSession still fills from pool
const next = buildSession({
  completedKeys: completed,
  priorityIds,
  size: 8,
  scope,
});
```

For free study, simpler approach matching spec: `priorityIds = dueQueueIds(cards, meta, now, 8)` filtered to ids in `questionsForScope(...)` — implement a small `filterIdsInSet(ids, set)`.

- [ ] **Step 4: `finishSession`**

Remove `enqueueMisses` / `clearMissesResolved`. Instead:

```ts
const updated = applyGrades(effectiveUserId, nextAnswered);
if (userId) {
  void upsertPracticeCardsAction(
    updated.filter((c) => nextAnswered.some((a) => a.questionId === c.questionId)),
  );
}
// still save session history as today
```

- [ ] **Step 5: Hub copy**

- `dueNow > 0` → “Study due cards” / show count  
- else → “Nothing due” + if `nextReviewAt` → format relative/absolute “Next review …”  
- Remove “misses waiting” / miss-queue language  
- Keep study unlocked / path / lessons CTAs

- [ ] **Step 6: `npx tsc --noEmit` clean**

- [ ] **Step 7: Commit**

```bash
git add src/app/(learner)/practice/page.tsx src/components/practice/practice-home.tsx src/lib/practice/session.ts
git commit -m "feat(practice): wire SM-2 due hub and session grading"
```

---

### Task 6: Demo seeds + verify

**Files:**
- Modify: `src/lib/practice/demo.ts` and/or demo branches in `practice-home.tsx`
- Modify: `docs/superpowers/specs/2026-09-25-practice-sm2-phase-c-design.md` (Status → Done when criteria met)

- [ ] **Step 1: Demo ready view** seeds ~2 due learning + a few new + one future review so Due band and “next review” photograph

- [ ] **Step 2: Manual smoke**

- `/practice?demo=1` ready / session / results  
- Guest: complete a question → refresh → Due / next review updates  
- Signed-in (SQLite): cards survive refresh  

- [ ] **Step 3: Run unit tests + tsc**

```bash
npx --yes tsx --test src/lib/practice/sm2.test.ts src/lib/practice/cards.test.ts
npx tsc --noEmit
```

- [ ] **Step 4: Mark spec Done; commit**

```bash
git add src/lib/practice/demo.ts src/components/practice/practice-home.tsx docs/superpowers/specs/2026-09-25-practice-sm2-phase-c-design.md
git commit -m "feat(practice): demo seeds for SM-2 due desk"
```

---

## Spec coverage check

| Spec requirement | Task |
|------------------|------|
| SM-2 Again/Good rules | 1 |
| Unlock → new cards | 2 (`ensureUnlockedCards`) |
| 20 new/day + due composition + session 8 | 2 + 4/5 |
| Guest localStorage + signed-in DB | 2 + 3 + 5 |
| Free study grades cards | 5 `applyGrades` |
| Migrate miss queue | 2 |
| Hub Due / next review copy | 5 |
| Hit rate unchanged | 5 (no rail changes to meaning) |
| Demo | 6 |
| No email / Hard/Easy / streaks | Global constraints |

## Placeholder / consistency self-review

- No TBD steps; `priorityIds` renames `missIds` consistently in Tasks 4–5  
- New-day meta is **local-only** for v1 (explicit)  
- Card PK is `id = userId:questionId` text  
- Test runner: `npx tsx --test` (devDependency not required)
