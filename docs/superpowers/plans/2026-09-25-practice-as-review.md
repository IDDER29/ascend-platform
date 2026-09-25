# Practice as Review Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the free-C Playground with one Practice surface that quizzes completed lessons and resurfaces misses locally.

**Architecture:** Pure bank + session builder (`src/lib/practice/*`) filter questions by completed `level/slug`. A client miss queue in localStorage feeds the next session. Practice page becomes a server shell (completions) + client session UI (empty / ready / in-session / results). Playground is removed from chrome and permanently redirected to `/practice`.

**Tech Stack:** Next.js App Router, existing `listCompletedLessons`, Phosphor hub chrome (`HUB_NARROW`), localStorage, `npx tsx` assert scripts (no Jest/Vitest in repo).

## Global Constraints

- Phosphor tokens only — no purple / lavender hex leftovers.
- No “spaced repetition” interval marketing until v2; v1 copy = “Misses come back in your next session.”
- Guest or zero completions → empty state, never a fake unlock-all drill.
- Results never invent streak days or badges.
- No git commits unless the user asks.
- Lesson labs stay the place to run code; Practice is knowledge check only.

## File map

| File | Responsibility |
|------|----------------|
| `src/app/(learner)/playground/page.tsx` | Replace with permanent redirect to `/practice` |
| `src/lib/playground-snippets.ts` | Delete if unused |
| `src/components/ui/sidebar.tsx` | Drop Playground Learn item |
| `src/components/homepage/footer.tsx` | Drop Playground link |
| `src/components/command-palette.tsx` | Drop Playground action |
| `src/app/(learner)/layout.tsx` | Comment update (no Playground) |
| `src/lib/practice/types.ts` | `PracticeQuestion` + answer types |
| `src/lib/practice/bank.ts` | Seed bank with lesson mappings |
| `src/lib/practice/session.ts` | `buildSession`, unlock filter |
| `src/lib/practice/miss-queue.ts` | localStorage miss queue helpers |
| `src/lib/practice-questions.ts` | Temporary re-export bridge, then unused |
| `src/app/(learner)/practice/page.tsx` | Server: load completions → client |
| `src/components/practice/practice-home.tsx` | Client: four UI states |
| `docs/superpowers/specs/2026-09-25-practice-as-review-design.md` | Status → Implemented |

---

### Task 1: Playground teardown + redirect

**Files:**
- Modify: `src/components/ui/sidebar.tsx`
- Modify: `src/components/homepage/footer.tsx`
- Modify: `src/components/command-palette.tsx`
- Modify: `src/app/(learner)/layout.tsx`
- Replace: `src/app/(learner)/playground/page.tsx`
- Delete: `src/lib/playground-snippets.ts` (after confirming no other imports)

**Produces:**
- No Playground in Learn nav / footer / ⌘K
- `/playground` permanently redirects to `/practice`

- [ ] **Step 1: Remove Playground from sidebar**

In `LEARN_ITEMS`, delete the Playground entry. Remove unused `Play` import if nothing else uses it.

```ts
const LEARN_ITEMS = [
  { href: "/dashboard", label: "Continue", icon: LayoutDashboard },
  { href: PATHS_HREF, label: "Paths", icon: Map },
  { href: "/practice", label: "Practice", icon: Swords },
];
```

- [ ] **Step 2: Remove from footer + command palette**

Footer LEARN links: drop `{ href: "/playground", label: "Playground" }`.

Command palette: delete the “Open the Playground” action object; remove unused `Play` import if applicable.

- [ ] **Step 3: Replace playground page with redirect**

Replace `src/app/(learner)/playground/page.tsx` entirely:

```tsx
import { permanentRedirect } from "next/navigation";

export default function PlaygroundRedirectPage() {
  permanentRedirect("/practice");
}
```

- [ ] **Step 4: Delete snippets module**

```bash
rg -l 'playground-snippets' --glob '*.{ts,tsx}' .
```

Expected: no matches (page no longer imports it). Then delete `src/lib/playground-snippets.ts`.

Update layout comment to drop Playground mention.

- [ ] **Step 5: Verify**

```bash
./node_modules/.bin/tsc --noEmit
```

Expected: exit 0.

Manual: open `/playground` → lands on `/practice`. Sidebar has Continue / Paths / Practice only under Learn.

---

### Task 2: Question bank + session builder (pure)

**Files:**
- Create: `src/lib/practice/types.ts`
- Create: `src/lib/practice/bank.ts`
- Create: `src/lib/practice/session.ts`
- Modify: `src/lib/practice-questions.ts` (re-export bridge)

**Interfaces:**
- Produces:
  - `PracticeQuestion` with `id`, `prompt`, `code?`, `options`, `correct`, `hint`, `reviewLabel`, `lessonLevel`, `lessonSlug`, `conceptId`
  - `PRACTICE_BANK: PracticeQuestion[]`
  - `completionKey(level, slug): string`
  - `unlockedQuestions(completedKeys: Set<string>): PracticeQuestion[]`
  - `buildSession({ completedKeys, missIds, size? }): PracticeQuestion[]`

- [ ] **Step 1: Types**

Create `src/lib/practice/types.ts`:

```ts
export type PracticeQuestion = {
  id: string;
  prompt: string;
  code?: string[];
  options: string[];
  correct: number;
  hint: string;
  reviewLabel: string;
  /** Curriculum level id, e.g. "level-02-the-c-language" */
  lessonLevel: string;
  lessonSlug: string;
  conceptId: string;
};

export type PracticeAnswer = {
  questionId: string;
  selected: number;
  correct: boolean;
};
```

- [ ] **Step 2: Bank — migrate pointers + Foundations seed**

Create `src/lib/practice/bank.ts`. Migrate every item from `POINTERS_DRILL` with stable ids (`ptr-01` …) and map to real level-02 lessons:

| Concept | `lessonLevel` | `lessonSlug` |
|---------|---------------|--------------|
| address-of / declare pointer / deref | `level-02-the-c-language` | `what-a-pointer-really-is` |
| pointer arithmetic / array decay | `level-02-the-c-language` | `pointer-arithmetic` |
| double pointers | `level-02-the-c-language` | `double-pointers` |
| uninitialized / UB | `level-02-the-c-language` | `undefined-behaviour` |
| swap by pointer | `level-02-the-c-language` | `what-a-pointer-really-is` |
| const pointer | `level-02-the-c-language` | `what-a-pointer-really-is` |

Also add **at least 4** Foundations questions so early completers unlock Practice:

| id | maps to |
|----|---------|
| `bits-01` … | `level-00-bits-logic` / `what-is-a-bit` |
| `bits-02` … | `level-00-bits-logic` / `binary-and-number-bases` |
| `bool-01` … | `level-00-bits-logic` / `boolean-logic-and-truth-tables` |
| `gates-01` … | `level-00-bits-logic` / `logic-gates-from-switches-to-circuits` |

Keep prompts honest and short (MCQ, one correct index).

Export `PRACTICE_BANK`.

Update `src/lib/practice-questions.ts` to:

```ts
export type { PracticeQuestion } from "@/lib/practice/types";
export { PRACTICE_BANK as POINTERS_DRILL } from "@/lib/practice/bank";
```

(Temporary bridge until Practice page stops importing the old path in Task 4.)

- [ ] **Step 3: Session builder**

Create `src/lib/practice/session.ts`:

```ts
import { PRACTICE_BANK } from "./bank";
import type { PracticeQuestion } from "./types";

export function completionKey(level: string, slug: string): string {
  return `${level}/${slug}`;
}

export function unlockedQuestions(
  completedKeys: Set<string>,
): PracticeQuestion[] {
  return PRACTICE_BANK.filter((q) =>
    completedKeys.has(completionKey(q.lessonLevel, q.lessonSlug)),
  );
}

/**
 * Misses first (still unlocked), then shuffle remaining unlocked.
 * Caps at `size` (default 8). Never includes locked items.
 */
export function buildSession(opts: {
  completedKeys: Set<string>;
  missIds: string[];
  size?: number;
}): PracticeQuestion[] {
  const size = opts.size ?? 8;
  const unlocked = unlockedQuestions(opts.completedKeys);
  const byId = new Map(unlocked.map((q) => [q.id, q]));
  const picked: PracticeQuestion[] = [];
  const seen = new Set<string>();

  for (const id of opts.missIds) {
    const q = byId.get(id);
    if (!q || seen.has(q.id)) continue;
    picked.push(q);
    seen.add(q.id);
    if (picked.length >= size) return picked;
  }

  const rest = unlocked.filter((q) => !seen.has(q.id));
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

- [ ] **Step 4: Assert script**

Run:

```bash
npx tsx -e '
import { buildSession, completionKey, unlockedQuestions } from "./src/lib/practice/session.ts";
import { PRACTICE_BANK } from "./src/lib/practice/bank.ts";

const empty = unlockedQuestions(new Set());
if (empty.length !== 0) throw new Error("locked leak");

const bits = new Set([completionKey("level-00-bits-logic", "what-is-a-bit")]);
const u = unlockedQuestions(bits);
if (!u.every(q => q.lessonSlug === "what-is-a-bit")) throw new Error("wrong unlock");
if (u.length < 1) throw new Error("need bits seed");

const session = buildSession({ completedKeys: bits, missIds: [], size: 8 });
if (session.length < 1 || session.length > 8) throw new Error("bad size");
if (session.some(q => !bits.has(completionKey(q.lessonLevel, q.lessonSlug)))) {
  throw new Error("session included locked");
}

const missId = PRACTICE_BANK.find(q => q.lessonSlug === "what-a-pointer-really-is")!.id;
const withMiss = buildSession({
  completedKeys: new Set([completionKey("level-02-the-c-language", "what-a-pointer-really-is")]),
  missIds: [missId],
  size: 3,
});
if (withMiss[0].id !== missId) throw new Error("miss not first");
console.log("session ok", { bank: PRACTICE_BANK.length, unlockedBits: u.length });
'
```

Expected: prints `session ok` with bank length ≥ 14.

- [ ] **Step 5: tsc**

```bash
./node_modules/.bin/tsc --noEmit
```

Expected: exit 0.

---

### Task 3: Miss queue (client)

**Files:**
- Create: `src/lib/practice/miss-queue.ts`

**Interfaces:**
- Produces:
  - `missQueueKey(userId: string | null): string`
  - `readMissIds(userId: string | null): string[]`
  - `writeMissIds(userId: string | null, ids: string[]): void`
  - `enqueueMisses(userId: string | null, ids: string[]): string[]`
  - `clearMissesResolved(userId: string | null, correctIds: string[]): string[]`

- [ ] **Step 1: Implement**

```ts
const PREFIX = "ascend_practice_misses_v1";

export function missQueueKey(userId: string | null): string {
  return `${PREFIX}:${userId ?? "guest"}`;
}

export function readMissIds(userId: string | null): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(missQueueKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is string => typeof x === "string");
  } catch {
    return [];
  }
}

export function writeMissIds(userId: string | null, ids: string[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(missQueueKey(userId), JSON.stringify(ids));
  } catch {
    // ignore quota / private mode
  }
}

export function enqueueMisses(
  userId: string | null,
  ids: string[],
): string[] {
  const next = [...readMissIds(userId)];
  for (const id of ids) {
    if (!next.includes(id)) next.push(id);
  }
  writeMissIds(userId, next);
  return next;
}

/** After correct answers, drop those ids from the queue. */
export function clearMissesResolved(
  userId: string | null,
  correctIds: string[],
): string[] {
  const drop = new Set(correctIds);
  const next = readMissIds(userId).filter((id) => !drop.has(id));
  writeMissIds(userId, next);
  return next;
}
```

- [ ] **Step 2: Assert keys**

```bash
npx tsx -e '
import { missQueueKey } from "./src/lib/practice/miss-queue.ts";
if (missQueueKey(null) !== "ascend_practice_misses_v1:guest") throw new Error("guest key");
if (missQueueKey("u1") !== "ascend_practice_misses_v1:u1") throw new Error("user key");
console.log("miss-queue keys ok");
'
```

Expected: `miss-queue keys ok`.

---

### Task 4: Practice UI (four states)

**Files:**
- Create: `src/components/practice/practice-home.tsx`
- Rewrite: `src/app/(learner)/practice/page.tsx`

**Consumes:**
- `listCompletedLessons` (server)
- `buildSession`, `completionKey` from session
- miss-queue helpers
- `lessonHref(level, slug)` for miss → lesson links
- `HUB_MAIN_CLASS`, `HUB_NARROW_CLASS`, `PageHeader`, `Button`
- `PATHS_HREF` from `@/lib/routes`

**Produces:**
- Empty / Ready / In session / Results on `/practice`

- [ ] **Step 1: Server page**

Rewrite `src/app/(learner)/practice/page.tsx`:

```tsx
import { getCurrentUser } from "@/lib/auth/auth";
import { listCompletedLessons } from "@/lib/progress/queries";
import { PracticeHome } from "@/components/practice/practice-home";
import {
  HUB_MAIN_CLASS,
  HUB_NARROW_CLASS,
  PageHeader,
} from "@/components/ui/page-header";
import { completionKey } from "@/lib/practice/session";

export const metadata = { title: "Practice — Ascend" };

export default async function PracticePage() {
  const user = await getCurrentUser();
  let completedKeys: string[] = [];
  if (user) {
    try {
      const rows = await listCompletedLessons(user.id);
      completedKeys = rows.map((r) => completionKey(r.level, r.slug));
    } catch {
      completedKeys = [];
    }
  }

  return (
    <main className={HUB_MAIN_CLASS}>
      <div className={HUB_NARROW_CLASS}>
        <PageHeader
          title="Practice"
          description="Check what you’ve learned. Misses come back in your next session."
        />
        <PracticeHome
          userId={user?.id ?? null}
          completedKeys={completedKeys}
        />
      </div>
    </main>
  );
}
```

If DB is down, catch → empty (honest empty, not crash).

- [ ] **Step 2: Client `PracticeHome` states**

Create `src/components/practice/practice-home.tsx` (`"use client"`).

Props:

```ts
{
  userId: string | null;
  completedKeys: string[];
}
```

Phase: `"ready" | "session" | "results"` (empty derived: unlocked length === 0).

**Empty** (unlocked === 0):
- Card: “Finish a lesson first — Practice unlocks from what you’ve completed.”
- Buttons: Continue (`/dashboard`), Paths (`PATHS_HREF`)

**Ready** (unlocked > 0):
- Primary: Start session
- If `readMissIds(userId).length > 0`: quiet “N misses waiting”
- On Start: `buildSession({ completedKeys: new Set(completedKeys), missIds: readMissIds(userId), size: 8 })` → enter session

**In session:**
- Progress `index+1 / total`
- Prompt + optional code block (mono, `bg-elevated`, tokens only)
- Option buttons; Check; hint after wrong check
- Next / Finish
- Track miss ids and correct ids
- End: `enqueueMisses(userId, missIds)` then `clearMissesResolved(userId, correctIds)` then results

**Results:**
- `N correct / total`
- Miss list with `Link` to `lessonHref(q.lessonLevel, q.lessonSlug)` + `reviewLabel`
- Practice again · Continue (`/dashboard`)
- **No** streak number, **no** badge earn UI, **no** XP claim

Strip purple hex (`#2A2540`, lavender, etc.). Tokens: `text-ink`, `text-ink-secondary`, `bg-xp-bg`, `border-divider`, `bg-paper`.

Drop hearts/lives and fake XP for v1 — progress is `n / total` only.

- [ ] **Step 3: Remove old practice page body**

Delete the previous client mega-page. Only server page + `PracticeHome` remain. Drop unused bridge export from `practice-questions.ts` if nothing imports it.

- [ ] **Step 4: Verify**

```bash
./node_modules/.bin/tsc --noEmit
```

Manual checklist:
- Guest `/practice` → empty → Continue / Paths
- Signed-in with Foundations bit lesson complete → Ready → session only bits items
- Miss one → finish → Ready shows miss waiting → next session leads with that item
- `/playground` still redirects
- No Playground in sidebar

---

### Task 5: Spec status + copy sweep

**Files:**
- Modify: `docs/superpowers/specs/2026-09-25-practice-as-review-design.md`

- [ ] **Step 1: Mark spec Implemented**

Set **Status:** `Implemented`. Check off completed success criteria.

- [ ] **Step 2: Grep honesty**

```bash
rg -n 'Playground|spaced repetition|12 day|POINTERS_DRILL' --glob '*.{ts,tsx}' src
```

Fix any learner-facing Playground nav leftovers or SR overclaim in Practice UI.

- [ ] **Step 3: Final tsc**

```bash
./node_modules/.bin/tsc --noEmit
```

Expected: exit 0.

---

## Spec coverage

| Spec item | Task |
|-----------|------|
| Remove Playground from nav/footer/⌘K | 1 |
| `/playground` → `/practice` | 1 |
| Delete playground snippets when unused | 1 |
| Question bank + lesson mapping | 2 |
| Unlock by completed lessons | 2 |
| Session size ~5–8, misses first | 2 |
| Foundations unlock path | 2 (bits seed) |
| localStorage miss queue | 3 |
| Empty / Ready / Session / Results UI | 4 |
| Honest copy; no fake streaks/badges | 4 |
| Spec success criteria / status | 5 |

## Out of scope (do not implement)

- Server-persisted miss queue / SM-2 intervals
- In-browser C compiler
- Practice XP → progress DB
