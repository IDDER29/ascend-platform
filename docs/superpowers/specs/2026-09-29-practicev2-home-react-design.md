# Practice v2 home — real React + real data

**Status:** approved 2026-09-29  
**Route:** `/practicev2` (home only; session + sub-pages are out of scope)

## Problem

`/practicev2` renders a static HTML string (`PRACTICE_COACH_V2_HTML`) via
`dangerouslySetInnerHTML`, then `patchCoachHomeDom` rewrites two nodes and some
link `href`s by matching visible text. Everything else is hardcoded: the date,
streak, goal ring (28/20), today's sessions table, card strength, due-this-week,
the 12-week heatmap, "Last time 5/8", mode badge counts. Guests see six fake
sessions. Daily-goal buttons and the `Enter` hint do nothing. Dark mode leaves
the page cream. On mobile the Foundations header overlaps, the "F" mark
squashes, the step track clips, and the sessions table overflows.

## Decisions (from user)

| Topic | Decision |
|---|---|
| Look | **Pixel-identical** to the Coach HTML (blue / lime / cream). No Phosphor recolor. |
| Dark mode | Add a matching dark Coach palette; colors become CSS variables. |
| Empty data | Keep every section; show honest zero/empty states with a nudge. |
| Daily goal | Wire Casual 10 / Regular 20 / Serious 40, persisted per user on device. |
| Scope | Home only, including mobile fixes. |

## Architecture

- `src/app/(learner)/practicev2/page.tsx` — server component (unchanged data
  loading via `loadPracticePageData`); page background uses the Coach
  background variable instead of `bg-[#F6F4EE]`.
- `src/lib/practice/coach-home-model.ts` — pure
  `buildCoachHomeModel(input) → CoachHomeModel`. No DOM, no storage. Unit tested.
- `src/lib/practice/daily-goal.ts` — `readDailyGoal` / `writeDailyGoal`
  (localStorage key `ascend_practice_daily_goal_v1:<userId|guest>`, values
  10 / 20 / 40, default 20).
- `src/components/practice/coach-home/*` — one component per section, rendered
  by `PracticeCoachV2HomeLive`, which hydrates cards/history/meta/goal from
  storage once on mount (same seeding as today: write server cards, migrate miss
  queue, ensure unlocked cards).
- Coach palette lives in `src/app/globals.css` as `--coach-*` variables scoped to
  `.practice-coach-v2`, with a `.dark .practice-coach-v2` override block.
  Components use Tailwind arbitrary values (`bg-[var(--coach-surface)]`), the
  same idiom as `practice-coach-v2-session-live.tsx`.

Remove `practice-coach-v2-markup.ts` and the unused `practice-coach-v2.tsx`
once nothing imports them. `patchCoachHomeDom` is deleted.

## Model (what each section shows)

`now` is injected for testability. All dates are local time.

- **Header:** `now` formatted `Weekday, Mon D`.
- **Due hero:** `dueNow = dueCount(cards, meta, now)`; `sessionSize =
  min(8, dueNow)` segments in the bar. Subtitle: `N due · next K in this
  session` (or `Nothing due right now` when 0). Primary action from
  `selectCoachHomeAction(dueNow, unlockedCount)`; label `Start review` for
  due, `Free study`, `Continue learning`. Heading `Due review` / `All caught up`
  when 0. "Last time" = latest session `correct/total` (hidden when no history).
  "Next review" = `nextReviewAt(cards, now)` formatted `Mon D, h:mm AM`
  (hidden when null).
- **Your day:** `streakDays` = consecutive local days with ≥1 session ending
  today (or yesterday if none today — streak still alive). Copy: `N day streak`
  / `Practice tomorrow to make it N+1`; when 0: `No streak yet` /
  `Finish a session to start one`. Goal ring: `answeredToday` =
  `cardsClearedToday(history, now)` vs `goal`; ring fill = min(1, ratio).
  Copy: met → `Daily goal met` / `Anything more today is a bonus.`; else
  `N to go` / `Answer N more cards to hit today's goal.`
- **Modes:** Fix your misses → `/practicev2/session?scope=due`, badge =
  count of cards with `state === "learning"` and due now (`N today`);
  Quick 5 → `/practicev2/session?scope=all&size=5`, badge `5 cards`;
  Everything unlocked → `?scope=all`, badge `unlockedCount cards`;
  Custom deck → `/practicev2/custom`, badge `Your pick`.
- **Foundations path:** real tree (`practiceTreeForPath("foundations")`),
  6 lessons flattened in order; a step is filled when every bank card for that
  lesson has left `new`. Header meta: `<cards> cards · <lessons> lessons`.
  Hit rate row from `pathProgressFromHistory(history)` foundations row;
  empty → `No sessions yet`.
- **Today's sessions:** today's history rows newest first. Title =
  `scopeLabel`, time `h:mm AM`, result bars (one per `questionIds` entry in
  order; orange if in `missIds`, else blue), score, action
  `Retry N misses` (→ due) or `Perfect`. Chips: answered / correct / to fix
  totals. Empty: `No sessions yet today — start one above.`
- **Card strength:** New = `state new`; Learning = `state learning`;
  Solid = `review && intervalDays < 21`; Mastered = `review && intervalDays ≥ 21`.
  `<total> in your bank`. Segments with 0 count are omitted.
- **Due this week:** next 7 local days starting today; today counts
  `dueNow`, later days count cards whose `dueAt` falls on that day. Bar height
  scales to the max (72px max, 0 → no bar). Today's bar dark, others light.
- **Practice days:** 12 weeks (84 days) Monday-first grid ending with the
  current week; intensity 0–4 from session count per day (0, 1, 2, 3–4, 5+);
  future days dashed; today ringed. Footer `N days practiced · <range>`.
- **Browse link:** `Browse all <total> cards` → `/practicev2/bank`.

## Behavior

- `Enter` on the page (not inside input/textarea/select/button/contenteditable,
  no modifier keys) navigates to the primary action.
- Goal buttons set `aria-pressed`, persist, and update the ring immediately.
- Session page reads optional `size` param (1–20, default 8) — the only change
  outside home.
- Before storage hydrates, render with server props (no fake numbers): zero
  states are acceptable for the first frame.

## Mobile (≤639px unless noted)

- Foundations header: badge wraps below title; "Open path" never overlaps.
- "F" mark fixed 52×52 (`shrink-0`).
- Step track scrolls horizontally inside the card.
- Today's sessions table becomes stacked rows (title+time / bars+score / action).
- Decorative card stack in the hero hidden.
- ≤1023px layout rules from the existing CSS preserved (single column hero/
  bottom grids, 2-col modes; 1-col modes ≤639px, h1 40px).

## Dark palette

Same hues, adjusted surfaces: bg `#101114`, surface `#1A1C21`, borders
`#2E3138`/`#3A3D45`, ink `#ECEAE3`, secondary `#B4B7BF`, muted `#9A9EA7`;
lime unchanged; blue `#6F86F2`; tints become translucent (e.g. orange
`rgba(217,98,43,.18)` with `#F4A57A` text). Filled steps/marks flip to lime
background with dark ink so they stay prominent.

## Testing

- `src/lib/practice/coach-home-model.test.ts` (node:test via `npx tsx --test`):
  streak (today, yesterday-alive, broken), goal met/unmet, strength buckets,
  due-week counts, heatmap intensity + future cells, today's sessions filter,
  empty model for guests, primary action selection, Foundations step fill.
- `daily-goal` read/write fallback.
- `npx tsc --noEmit`, `npm run lint`.
- Playwright screenshots at 1440 light, 1440 dark, 390 mobile; compare with
  the pre-change screenshots for layout parity.
