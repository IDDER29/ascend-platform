# Practice v2 Complete Page — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the injected-HTML `/practicev2/complete` page with React components driven by real session data, at the app hub scale, with dark mode.

**Architecture:** A pure `buildCoachCompleteModel()` computes every number from the saved session record, merged history, daily goal and clock. Small presentational components in `src/components/practice/coach-complete/` render the model with `--coach-*` variables. The live client component loads local history, merges it with server history, and wires the Enter shortcut.

**Tech Stack:** Next.js App Router, React 19 client components, Tailwind v4 arbitrary values, `node:test` via `npx tsx --test`.

## Global Constraints

- Colors only via `--coach-*` variables inside `.practice-coach-v2` (no hex in components).
- Hub scale: `HUB_CONTENT_CLASS` (960px), 28/32px title, 15px lede, 44px buttons.
- Copy: "Review complete"; "{c} of {t} right."; "The N you missed is/are already scheduled to come back." / "You're caught up for now."; "Nothing to fix — every card was right."; "Fix N miss(es) now"; "Back to practice".
- Fix href `/practicev2/session?scope=due`; back href `/practicev2`.

---

### Task 1: Shared history merge

**Files:**
- Modify: `src/lib/practice/history.ts` — add `mergeSessionHistory(local, server)` (dedupe by id, newest first, cap 40).
- Modify: `src/components/practice/practice-coach-v2-home-live.tsx` — use it, delete local `mergeHistory`.

- [ ] Move the function, update the import, run `npx tsc --noEmit`.

### Task 2: Complete model (TDD)

**Files:**
- Create: `src/lib/practice/coach-complete-model.ts`
- Test: `src/lib/practice/coach-complete-model.test.ts`

**Interfaces — Produces:**

```ts
export type CoachCompleteInput = {
  record: PracticeSessionRecord;
  history: PracticeSessionRecord[];
  goal: DailyGoal;
  now: Date;
};
export type CoachCompleteMiss = {
  id: string;
  label: string;
  answer: string | null;
  lessonTitle: string | null;
};
export type CoachCompleteLink = { label: string; href: string };
export type CoachCompleteModel = {
  correct: number;
  total: number;
  missed: number;
  summary: string;
  results: boolean[];
  accuracy: { percent: number; lastPercent: number | null };
  goal: { answeredToday: number; goal: DailyGoal; met: boolean; remaining: number };
  streak: number;
  strength: { movedUp: number; backToLearning: number };
  misses: CoachCompleteMiss[];
  primary: CoachCompleteLink;
  secondary: CoachCompleteLink | null;
};
export function buildCoachCompleteModel(input: CoachCompleteInput): CoachCompleteModel;
```

Rules: `results[i] = !missIds.includes(questionIds[i])`; `percent = round(correct/total*100)`;
`lastPercent` from the newest history row with `at < record.at` and a different id;
`answeredToday = cardsClearedToday(history, now)`; `streak = streakDays(history, now)`;
`movedUp = correct`, `backToLearning = missed`; miss `answer` = MCQ option /
flashcard back / first typed or cloze answer; `lessonTitle` from `PRACTICE_TREE`
by `level/slug` key.

- [ ] Write tests: summary/results/accuracy/strength for a 3-of-4 session; `lastPercent` from the earlier session and `null` for the first; goal met vs remaining; misses carry label, answer and lesson title; links for misses vs none; singular "The 1 you missed is".
- [ ] Run `npx tsx --test src/lib/practice/coach-complete-model.test.ts` — expect FAIL (module missing).
- [ ] Implement the model.
- [ ] Run tests — expect PASS.

### Task 3: Components, live wrapper, page

**Files:**
- Create: `src/components/practice/coach-complete/{complete-header,result-bar,stat-tiles,strength-card,coming-back,complete-actions,complete-skeleton}.tsx`
- Rewrite: `src/components/practice/practice-coach-v2-complete-live.tsx`
- Modify: `src/app/(learner)/practicev2/complete/page.tsx` — `practice-coach-v2` main + `HUB_CONTENT_CLASS`.
- Delete: `practice-coach-v2-complete-markup.ts`, `practice-coach-v2-complete.tsx`.

- [ ] Build components from the model; lg two-column grid `minmax(0,1fr)_300px`, stacked below lg.
- [ ] Live wrapper: merge local + server history in a microtask, read goal, build model; skeleton until ready; "No session yet" card when not found; global Enter → `router.push(primary.href)` (skip modifiers, repeats, typing targets, buttons, links).
- [ ] `npx tsc --noEmit`, `npm run lint`, tests.
- [ ] Playwright: seeded session light/dark/mobile, a perfect session, missing session id; Enter navigates; no horizontal overflow at 390px.
- [ ] Commit.
