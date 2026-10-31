# /progressv2 — design (2026-10-29)

## Goal
Dashboard answers "what next?", Practice answers "what's due?". Progress
answers **"am I actually getting better, and where do I stand?"** — the
long view, read weekly. Honest (built only from lesson completions and
Practice history), reflective, motivating without guilt.

Built at `/progressv2` beside the existing `/progress`, in the Practice
"Coach" look (`.practice-coach-v2` tokens). **Cutover (2026-10-30):** v2
now lives at `/progress`; the old page is deleted and `/progressv2`
redirects there.

## Layout (main column + 280px aside, like the Practice home)
1. **Header** — mono date eyebrow, "Progress", one-line subtitle.
2. **Hero (dark)** — "You are here": current level, lessons done of 25,
   four-level track (one dot per lesson), next lesson, lime **Continue**.
   **Aside: This week** — lessons done, cards answered, accuracy vs last
   week, streak.
3. **Learned vs remembered** (full width) — per level: lessons done bar
   (ink) and remembered bar (share of unlocked cards at solid/mastered,
   Practice's blue scale).
4. **Concept map** — one tile per lesson, shade = retention, links to the
   lesson. **Aside: Slipping (dark)** — up to 3 lessons with overdue or
   often-missed cards, each with a one-click review; a calm line when none.
5. **Momentum** — 12 weekly bars (lessons completed + cards answered) and
   weekly accuracy. **Aside: Milestones** — dated, real events only
   (first lesson, each level finished, first practice session, session
   counts).
6. **Practice days** — the Practice heatmap component.

Phone: one column; Slipping moves up under "Learned vs remembered".
New learner: hero says "You're at the start" with a Start button; other
cards show one honest line each, never zeros or empty charts.

## Data
- Lessons (MDX meta) and `lesson_progress` (with `completedAt`).
- Practice cards + session history (server for signed-in, merged with
  local for guests — same pattern as Practice).
- Streak: `streaks.current` when signed in, else practice-day streak.

## Architecture
- Pure `src/lib/progress/progress-v2-model.ts` + tests.
- Client wrapper `src/components/progress-v2/progress-v2-live.tsx`
  (syncs local cards/history like the Practice screens).
- Presentational components in `src/components/progress-v2/`.
- Server page `src/app/(learner)/progress/page.tsx` (was `progressv2/`).

## Not in scope
New DB tables, XP/badges.
