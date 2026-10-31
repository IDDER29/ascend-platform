# Practice v2 Functional Review Loop Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `/practicev2` a real Home → Session → Complete review loop driven by the shared SM-2 practice engine, while keeping live `/practice` unchanged.

**Architecture:** Reuse `src/lib/practice/*` (bank, unlock, SM-2 cards, due queue, history, grade actions). Add pure Coach-v2 helpers for scope parsing and session lookup. Replace static `/practicev2/session` and `/practicev2/complete` (and Home Start CTAs) with data-bound Coach cream UI. One stateful session route swaps prompt/feedback in place; complete loads a saved history record by `?session=`.

**Tech Stack:** Next.js App Router, React client components, existing `loadPracticePageData`, Phosphor cream Coach chrome, `npx tsx --test`.

## Global Constraints

- Stay on `/practicev2` — do not cut over or alter live `/practice` behavior.
- Shared engine only — no second SM-2 / miss-queue implementation.
- Grades: wrong / Missed it → `again`; correct / Got it → `good` (typed/cloze may use again/hard/good via existing helpers if present in queue).
- Honesty: zero unlocks → empty/caught-up or redirect home; never invent cards, streaks, or XP.
- Wrong feedback must show hint + lesson link when `reviewHrefs[id]` exists.
- Preserve Coach cream look (`#F6F4EE`); prefer React Coach chrome over large `dangerouslySetInnerHTML` for interactive states.
- Static reference routes (`/session/choices`, `/correct`, `/wrong`, `/feedback`, `/flashcard`) may remain; live Start must not depend on them.
- Do not git commit unless the user explicitly asks (user rule overrides per-task commit steps — skip commit steps or stop and ask).
- Spec: `docs/superpowers/specs/2026-09-25-practicev2-functional-review-loop-design.md`

## File map

| File | Responsibility |
|------|----------------|
| `src/lib/practice/coach-v2-flow.ts` | Pure: parse scope from search params; find session record; label scope |
| `src/lib/practice/coach-v2-flow.test.ts` | Unit tests for parse + find |
| `src/components/practice/practice-coach-v2-session-live.tsx` | Stateful session host (queue, grade, in-place chrome) |
| `src/app/(learner)/practicev2/session/page.tsx` | Server: load practice data + searchParams → live session |
| `src/components/practice/practice-coach-v2-complete-live.tsx` | Complete UI from `PracticeSessionRecord` |
| `src/app/(learner)/practicev2/complete/page.tsx` | Server shell + pass reviewHrefs; client reads `?session=` |
| `src/components/practice/practice-coach-v2-home-live.tsx` | Home: real due count + Start/Retry hrefs |
| `src/app/(learner)/practicev2/page.tsx` | Load practice data → home live |
| `src/components/practice/practice-coach-v2-session.tsx` | Keep as static reference **or** re-export live — prefer leave static file unused by page |
| Spec status | Mark Implemented when success criteria met |

---

### Task 1: Pure Coach v2 flow helpers

**Files:**
- Create: `src/lib/practice/coach-v2-flow.ts`
- Create: `src/lib/practice/coach-v2-flow.test.ts`

**Interfaces:**
- Consumes: `PracticeScope` from `@/lib/practice/session`; `PracticeSessionRecord` from `@/lib/practice/history`
- Produces:
  - `parseCoachV2Scope(params: URLSearchParams | Record<string, string | string[] | undefined>): PracticeScope`
  - `labelCoachV2Scope(scope: PracticeScope): { scope: PracticeScope; scopeLabel: string; pathSlug: string | null }`
  - `findCoachV2SessionRecord(history: PracticeSessionRecord[], sessionId: string | null | undefined): PracticeSessionRecord | null`

- [ ] **Step 1: Write the failing tests**

Create `src/lib/practice/coach-v2-flow.test.ts`:

```ts
import assert from "node:assert/strict";
import { test } from "node:test";
import {
  findCoachV2SessionRecord,
  labelCoachV2Scope,
  parseCoachV2Scope,
} from "./coach-v2-flow";
import type { PracticeSessionRecord } from "./history";

test("parseCoachV2Scope defaults to due", () => {
  assert.deepEqual(parseCoachV2Scope({}), { type: "due" });
});

test("parseCoachV2Scope reads scope=all", () => {
  assert.deepEqual(parseCoachV2Scope({ scope: "all" }), { type: "all" });
});

test("parseCoachV2Scope reads path + pathSlug", () => {
  assert.deepEqual(parseCoachV2Scope({ scope: "path", path: "foundations" }), {
    type: "path",
    pathSlug: "foundations",
  });
});

test("parseCoachV2Scope invalid scope falls back to due", () => {
  assert.deepEqual(parseCoachV2Scope({ scope: "nope" }), { type: "due" });
});

test("labelCoachV2Scope due label", () => {
  const labeled = labelCoachV2Scope({ type: "due" });
  assert.equal(labeled.scope.type, "due");
  assert.ok(labeled.scopeLabel.length > 0);
  assert.equal(labeled.pathSlug, null);
});

test("findCoachV2SessionRecord by id", () => {
  const row: PracticeSessionRecord = {
    id: "s1",
    at: "2026-09-25T12:00:00.000Z",
    scopeType: "due",
    scopeLabel: "Due",
    pathSlug: null,
    correct: 6,
    total: 8,
    missIds: ["a", "b"],
    questionIds: ["a", "b", "c", "d", "e", "f", "g", "h"],
  };
  assert.equal(findCoachV2SessionRecord([row], "s1")?.id, "s1");
  assert.equal(findCoachV2SessionRecord([row], "missing"), null);
  assert.equal(findCoachV2SessionRecord([row], null)?.id, "s1"); // latest fallback
});
```

- [ ] **Step 2: Run tests — expect FAIL**

Run: `npx tsx --test src/lib/practice/coach-v2-flow.test.ts`  
Expected: FAIL (module not found / exports missing)

- [ ] **Step 3: Implement helpers**

Create `src/lib/practice/coach-v2-flow.ts`:

```ts
import type { PracticeSessionRecord } from "@/lib/practice/history";
import type { PracticeScope } from "@/lib/practice/session";
import { PRACTICE_PATH_TITLES } from "@/lib/practice/path-map";

function first(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function asParams(
  input: URLSearchParams | Record<string, string | string[] | undefined>,
): { get(name: string): string | undefined } {
  if (input instanceof URLSearchParams) {
    return { get: (name) => input.get(name) ?? undefined };
  }
  return { get: (name) => first(input[name]) };
}

export function parseCoachV2Scope(
  input: URLSearchParams | Record<string, string | string[] | undefined>,
): PracticeScope {
  const p = asParams(input);
  const scope = p.get("scope") ?? "due";
  if (scope === "all") return { type: "all" };
  if (scope === "due") return { type: "due" };
  if (scope === "path") {
    const pathSlug = p.get("path") ?? p.get("pathSlug") ?? "foundations";
    return { type: "path", pathSlug };
  }
  if (scope === "section") {
    const pathSlug = p.get("path") ?? "foundations";
    const sectionId = p.get("section") ?? "";
    return { type: "section", pathSlug, sectionId };
  }
  return { type: "due" };
}

export function labelCoachV2Scope(scope: PracticeScope): {
  scope: PracticeScope;
  scopeLabel: string;
  pathSlug: string | null;
} {
  if (scope.type === "due") {
    return { scope, scopeLabel: "Due review", pathSlug: null };
  }
  if (scope.type === "all") {
    return { scope, scopeLabel: "Free study", pathSlug: null };
  }
  if (scope.type === "path") {
    const title =
      PRACTICE_PATH_TITLES[scope.pathSlug] ?? scope.pathSlug;
    return { scope, scopeLabel: title, pathSlug: scope.pathSlug };
  }
  if (scope.type === "section") {
    return {
      scope,
      scopeLabel: `${scope.pathSlug} · ${scope.sectionId}`,
      pathSlug: scope.pathSlug,
    };
  }
  // lessons
  return {
    scope,
    scopeLabel: "Selected lessons",
    pathSlug: null,
  };
}

export function findCoachV2SessionRecord(
  history: PracticeSessionRecord[],
  sessionId: string | null | undefined,
): PracticeSessionRecord | null {
  if (sessionId) {
    return history.find((row) => row.id === sessionId) ?? null;
  }
  if (history.length === 0) return null;
  return [...history].sort((a, b) => b.at.localeCompare(a.at))[0] ?? null;
}
```

Check `PracticeScope` and `PRACTICE_PATH_TITLES` shapes in `session.ts` / `path-map.ts` and adjust labels if titles map differs — keep types exact.

- [ ] **Step 4: Run tests — expect PASS**

Run: `npx tsx --test src/lib/practice/coach-v2-flow.test.ts`  
Expected: all tests PASS

- [ ] **Step 5: Commit (only if user asked)**

```bash
git add src/lib/practice/coach-v2-flow.ts src/lib/practice/coach-v2-flow.test.ts
git commit -m "feat(practicev2): add pure scope and session lookup helpers"
```

---

### Task 2: Live session host (in-place Coach chrome)

**Files:**
- Create: `src/components/practice/practice-coach-v2-session-live.tsx`
- Modify: `src/app/(learner)/practicev2/session/page.tsx`

**Interfaces:**
- Consumes: `loadPracticePageData()` fields; `parseCoachV2Scope` / `labelCoachV2Scope`; `buildSession`, `unlockedQuestions`, `dueQueueIds`, `ensureUnlockedCards`, `migrateMissQueueOnce`, `applyGrades`, `gradeFromMcqCorrect`, `readCards`, `readNewDayMeta`, `prependLocalSession`, `newSessionId`, `savePracticeSessionAction`, `upsertPracticeCardsAction`
- Produces: `<PracticeCoachV2SessionLive … />` that grades cards and navigates to `/practicev2/complete?session=<id>`

- [ ] **Step 1: Create session page server loader**

Replace `src/app/(learner)/practicev2/session/page.tsx` body to load data and pass searchParams:

```tsx
import type { Metadata } from "next";
import { PracticeCoachV2SessionLive } from "@/components/practice/practice-coach-v2-session-live";
import { loadPracticePageData } from "@/lib/practice/server-page-data";

export const metadata: Metadata = {
  title: "Review session — Practice Coach (v2) — Ascend",
};

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;
  const data = await loadPracticePageData();
  return (
    <main className="flex-1 bg-[#F6F4EE] px-5 py-8 sm:px-10">
      <div className="mx-auto w-full max-w-[1100px]">
        <PracticeCoachV2SessionLive
          userId={data.userId}
          completedKeys={data.completedKeys}
          reviewHrefs={data.reviewHrefs}
          initialCards={data.initialCards}
          searchParams={params}
        />
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Implement live session host**

Create `practice-coach-v2-session-live.tsx` as a `"use client"` component that:

1. On mount: `migrateMissQueueOnce`, `ensureUnlockedCards`, seed `initialCards` if present (same pattern as `PracticeSessionHost` in `practice-home.tsx` ~318–331).
2. Build queue once via `startSession` logic mirrored from `practice-home.tsx` `startSession` (lines ~415–448), using `parseCoachV2Scope(searchParams)` then `labelCoachV2Scope`.
3. If queue empty → `router.replace("/practicev2")` (or `/practicev2/caught-up` when unlocked > 0 and due scope empty — prefer `/practicev2` for simplicity unless caught-up already exists and feels better).
4. UI phases: `"prompt" | "feedback"`.
5. Render **Coach cream React chrome** (not full static HTML inject for the interactive card):
   - Progress `n / total`, scope label, Skip (advance without grade **or** treat Skip as leave card ungraded — prefer Skip = discard card without grading, do not call `applyGrades` for it; only graded answers count toward complete totals).
   - MCQ: options, Check → set feedback correct/wrong.
   - Flashcard: front → Reveal → Missed it / Got it.
   - Typed/cloze: minimal prompt + input + Again/Hard/Good (reuse `answersMatch` from `normalize.ts`) so mixed bank queues don’t break.
6. On grade: append to `answered`, show feedback chrome (correct/wrong) with hint + `reviewHrefs[id]` lesson link on wrong; Continue → next index or finish.
7. `finishSession`: same as `practice-home.tsx` `finishSession` (~461–507) but then `router.push(`/practicev2/complete?session=${record.id}`)` instead of in-page results. Always write local history; call server actions when `userId` set.

Keep CSS tokens: cream background already on page; use Coach colors from existing markup (`#16181D`, `#D7F26B`, `#D9622B`, borders `#E2DED3`).

Skeleton props:

```tsx
export type PracticeCoachV2SessionLiveProps = {
  userId: string | null;
  completedKeys: string[];
  reviewHrefs: Record<string, string>;
  initialCards: PracticeCard[];
  searchParams: Record<string, string | string[] | undefined>;
};
```

- [ ] **Step 3: Manual smoke**

With `npm run dev -- --port 3000` and a user/guest that has unlocks (or temporarily open bank via completed lessons):

1. Visit `/practicev2/session?scope=all` — see a real prompt (not static mock copy alone).
2. Answer MCQ wrong → feedback with lesson link if mapped.
3. Finish queue → lands on `/practicev2/complete?session=…`.

- [ ] **Step 4: Commit (only if user asked)**

```bash
git add src/components/practice/practice-coach-v2-session-live.tsx \
  src/app/(learner)/practicev2/session/page.tsx
git commit -m "feat(practicev2): live Coach session grades via shared SM-2 engine"
```

---

### Task 3: Live complete page

**Files:**
- Create: `src/components/practice/practice-coach-v2-complete-live.tsx`
- Modify: `src/app/(learner)/practicev2/complete/page.tsx`

**Interfaces:**
- Consumes: `findCoachV2SessionRecord`, `readLocalHistory`, `PRACTICE_BANK` for miss titles, `reviewHrefs`
- Produces: Complete UI bound to real `PracticeSessionRecord`

- [ ] **Step 1: Server page**

```tsx
import type { Metadata } from "next";
import { PracticeCoachV2CompleteLive } from "@/components/practice/practice-coach-v2-complete-live";
import { loadPracticePageData } from "@/lib/practice/server-page-data";

export const metadata: Metadata = {
  title: "Review complete — Practice Coach (v2) — Ascend",
};

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;
  const data = await loadPracticePageData();
  const sessionParam = Array.isArray(params.session)
    ? params.session[0]
    : params.session;
  return (
    <main className="flex-1 bg-[#F6F4EE] px-5 py-8 sm:px-10">
      <div className="mx-auto w-full max-w-[1100px]">
        <PracticeCoachV2CompleteLive
          userId={data.userId}
          reviewHrefs={data.reviewHrefs}
          initialHistory={data.initialHistory}
          sessionId={sessionParam ?? null}
        />
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Complete client**

On mount, merge `initialHistory` with `readLocalHistory(userId)` (same merge pattern as practice-home). Resolve record via `findCoachV2SessionRecord`. If null → show “No session yet” + link home.

Render Coach-styled complete:
- Headline score: `{correct} of {total} right`
- Subcopy: if `missIds.length`, “The N you missed are already scheduled to come back.” else “You’re caught up for now.”
- Result ticks grid from `questionIds` × miss set
- “Coming back” list: each miss → `reviewLabel` + lesson `Link` from `reviewHrefs`
- CTA: `Fix N misses now` → `/practicev2/session?scope=due` when misses; else `/practicev2`
- Secondary: Back to Practice → `/practicev2`

- [ ] **Step 3: Smoke**

Finish a session → complete shows matching score and miss links. Refresh page with same `?session=` still shows record (localStorage and/or server history).

- [ ] **Step 4: Commit (only if user asked)**

```bash
git add src/components/practice/practice-coach-v2-complete-live.tsx \
  src/app/(learner)/practicev2/complete/page.tsx
git commit -m "feat(practicev2): bind complete screen to real session records"
```

---

### Task 4: Home due count + Start wiring

**Files:**
- Create: `src/components/practice/practice-coach-v2-home-live.tsx`
- Modify: `src/app/(learner)/practicev2/page.tsx`
- Optionally keep `practice-coach-v2.tsx` / markup as unused reference

**Interfaces:**
- Consumes: `dueCount`, `ensureUnlockedCards`, `readCards`, `readNewDayMeta`, `migrateMissQueueOnce`, home markup structure for layout inspiration
- Produces: Home with real due number; Start → `/practicev2/session?scope=due` or `scope=all`

- [ ] **Step 1: Server home page**

Update `practicev2/page.tsx` to `loadPracticePageData()` and render `PracticeCoachV2HomeLive`.

- [ ] **Step 2: Home live client**

Build a Coach-looking home (can start from structure in `practice-coach-v2-markup.ts` but **must** replace static due/retry numbers):

- On mount: migrate + ensure unlocks + seed cards; `dueNow = dueCount(...)`.
- Primary CTA:
  - if `dueNow > 0`: link `/practicev2/session?scope=due` labeled with due count
  - else if unlocked > 0: link `/practicev2/session?scope=all` (“Free study” / caught-up modes)
  - else: links to Continue / Paths (use existing route helpers from `@/lib/routes` if present)
- Path chip / Open Foundations → `/practicev2/foundations` (visual OK)
- Browse bank / Custom → existing `/practicev2/bank` / `/custom` (still visual)
- Retry misses rows: if last history has `missIds`, link `/practicev2/session?scope=due`

Do not claim streaks. Prefer honest labels matching SM-2 (“Due”, “Free study”).

- [ ] **Step 3: Smoke**

1. Home due number matches `/practice` due for same user (spot-check).
2. Start review enters live session.
3. Zero unlocks → no fake Start into silent empty session.

- [ ] **Step 4: Commit (only if user asked)**

```bash
git add src/components/practice/practice-coach-v2-home-live.tsx \
  src/app/(learner)/practicev2/page.tsx
git commit -m "feat(practicev2): wire Coach home Start to real due scopes"
```

---

### Task 5: Foundations Start link + final verification

**Files:**
- Modify: `src/components/practice/practice-coach-v2-foundations.tsx` and/or markup links so Review due / Practice → `/practicev2/session?scope=path&path=foundations` (or correct path slug from `path-map`)
- Modify: `docs/superpowers/specs/2026-09-25-practicev2-functional-review-loop-design.md` status → Implemented when done

- [ ] **Step 1: Fix Foundations CTAs**

Ensure primary practice buttons on foundations page hit live session with path scope, not static `/session/choices`.

- [ ] **Step 2: Route contract smoke**

```bash
# with dev server up
for p in /practicev2 /practicev2/session?scope=all /practicev2/complete /practicev2/foundations; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000${p}")
  echo "$code $p"
done
```

Expected: `200` for each (complete may 200 with empty state).

- [ ] **Step 3: Regression**

Confirm `/practice` still loads and starts a session (unchanged).

- [ ] **Step 4: Spec checklist**

Tick success criteria in the design spec; set **Status:** Implemented.

- [ ] **Step 5: Commit (only if user asked)**

```bash
git add src/components/practice/practice-coach-v2-foundations-markup.ts \
  src/components/practice/practice-coach-v2-foundations.tsx \
  docs/superpowers/specs/2026-09-25-practicev2-functional-review-loop-design.md
git commit -m "feat(practicev2): finish functional review loop wiring"
```

---

## Self-review (plan vs spec)

| Spec requirement | Task |
|------------------|------|
| Stay on `/practicev2` | Global + all tasks |
| Full review loop first | Tasks 2–4 |
| One live session route in-place | Task 2 |
| Shared SM-2 engine | Tasks 2–4 |
| Complete via `?session=` | Tasks 2–3 |
| Home due CTA real | Task 4 |
| Lesson links on wrong / complete | Tasks 2–3 |
| Foundations Start → session | Task 5 |
| `/practice` unchanged | Task 5 regression |
| Bank/custom full editors out | Not in plan |

No TBD placeholders. Types aligned with `PracticeScope` / `PracticeSessionRecord`. Commit steps gated by user rule.
