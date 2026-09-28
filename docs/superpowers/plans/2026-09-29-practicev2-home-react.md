# Practice v2 home — real React Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static Coach HTML on `/practicev2` with React components driven by real practice data, keeping the look pixel-identical and adding dark mode.

**Architecture:** A pure `buildCoachHomeModel` turns cards / history / new-day meta / goal / `now` into view data. `PracticeCoachV2HomeLive` hydrates storage once and renders section components under `src/components/practice/coach-home/`. Colors are `--coach-*` CSS variables in `globals.css` with a `.dark` override.

**Tech Stack:** Next.js App Router, React 19 client components, Tailwind v4 arbitrary values, `node:test` via `npx tsx --test`.

Spec: `docs/superpowers/specs/2026-09-29-practicev2-home-react-design.md`

## Global Constraints

- Visual parity with the pre-change Coach HTML (spacing, radii, type sizes, hues).
- No hardcoded hex in components — only `var(--coach-*)`.
- No fake numbers anywhere; empty states instead.
- Tests: `npx tsx --test <file>`; type-check `npx tsc --noEmit`; lint `npm run lint`.

---

### Task 1: Model + daily goal (TDD)

**Files:**
- Create: `src/lib/practice/coach-home-model.ts`, `src/lib/practice/coach-home-model.test.ts`
- Create: `src/lib/practice/daily-goal.ts`

**Interfaces — Produces:**
- `type DailyGoal = 10 | 20 | 40`; `DAILY_GOALS`; `readDailyGoal(userId): DailyGoal`; `writeDailyGoal(userId, goal)`
- `selectCoachHomeAction(dueNow, unlockedCount): CoachHomeAction` (moved from home-live; label `Start review` for due)
- `buildCoachHomeModel({ cards, history, meta, completedKeys, goal, now }): CoachHomeModel` with sections: `header`, `hero`, `day`, `modes`, `path`, `sessions`, `strength`, `week`, `days`, `bankTotal`
- Helpers exported for tests: `streakDays(history, now)`, `strengthBuckets(cards)`, `dueWeek(cards, meta, now)`, `practiceDaysGrid(history, now)`

- [ ] Write failing tests covering: streak today / yesterday-alive / broken; goal met vs unmet; strength buckets; due week; heatmap intensity + future cells + today flag; today-only sessions newest first; guest empty model; primary action; Foundations step fill.
- [ ] Run `npx tsx --test src/lib/practice/coach-home-model.test.ts` → FAIL (module missing).
- [ ] Implement model + daily goal.
- [ ] Re-run → PASS. Commit `feat(practicev2): coach home model from real practice data`.

### Task 2: Coach palette

**Files:** Modify `src/app/globals.css` (append `.practice-coach-v2` + `.dark .practice-coach-v2` variable blocks).

- [ ] Add light + dark variables per spec "Dark palette". Commit with Task 3.

### Task 3: Section components + live wrapper

**Files:**
- Create: `src/components/practice/coach-home/{coach-header,due-hero,your-day-card,mode-grid,foundations-path-card,todays-sessions,card-strength,practice-days}.tsx`
- Rewrite: `src/components/practice/practice-coach-v2-home-live.tsx`
- Modify: `src/app/(learner)/practicev2/page.tsx` (background var)

**Interfaces — Consumes:** `CoachHomeModel` section types from Task 1.

- [ ] Port each HTML section to JSX with Tailwind arbitrary values; apply mobile fixes from spec.
- [ ] Live wrapper: hydrate storage in effect, hold `goal` state, global `Enter` handler via `useRouter().push`.
- [ ] `npx tsc --noEmit` clean. Commit `feat(practicev2): render Coach home as React with live data`.

### Task 4: Session `size` param

**Files:** Modify `src/components/practice/practice-coach-v2-session-live.tsx` (`size: 8` → parsed `size` clamped 1–20); add `parseCoachV2Size` to `src/lib/practice/coach-v2-flow.ts` + test in `coach-v2-flow.test.ts`.

- [ ] Test → implement → pass → commit `feat(practicev2): session size param for Quick 5`.

### Task 5: Cleanup

- [ ] Delete `practice-coach-v2-markup.ts`, `practice-coach-v2.tsx`; move `selectCoachHomeAction` tests into model test; delete `practice-coach-v2-home-live.test.ts`.
- [ ] `rg PRACTICE_COACH_V2_` returns nothing. Commit `chore(practicev2): drop static Coach home markup`.

### Task 6: Verify

- [ ] All practice tests, `npx tsc --noEmit`, `npm run lint`.
- [ ] Playwright screenshots 1440 light/dark + 390 mobile; seed localStorage with sample cards/history for a populated view; compare with `/tmp/pwshot/out/home*.png`.
