# Dashboard v2 ("Today")

**Goal:** the first screen each day. In a few seconds: what to do now, then a glance at where you stand.

**User stories**
- I see my next lesson and start or continue it in one press.
- I see whether today's Practice is done: cards due, daily goal, streak.
- I see what I marked "Didn't get it" in Bookmarks.
- I see my title, my newest badge and my open project, each opening its own page.

**Layout (Coach style, like Practice / Achievements)**
1. Greeting, "N of M lessons done", date.
2. Next lesson (dark card): topic and place in it, time, blurb, a bar per lesson in the topic, Start/Continue, and the next few lessons. After every lesson: ShellForge.
3. Your day (shared with Practice: streak, daily goal ring, goal choice).
4. Practice: cards due and a review button, or caught up / no cards yet. To revisit: up to 3 "Didn't get it" bookmarks (hidden when none).
5. Title (with the next one and its open step), latest badge (or the closest one), the open project with its next step. Guests get a sign-in prompt instead.

**Decisions**
- No levels, no duplicated percentages, no path-selection widgets.
- Next lesson = the first open lesson in curriculum order.
- Guests see their own day (no sample learner): first lesson, their browser's Practice and Bookmarks.
- Built at `/dashboardv2`; the old `/dashboard` stays until promoted.
- Model: `src/lib/dashboard/today-model.ts` (tested).

## Today checklist, one goal, one streak (2026-10-30)
- **Today** replaces "Your day" on the dashboard: a checklist sized by the daily goal — Casual: review your due cards; Regular: plus one lesson; Serious: plus two. Items tick from what really happened today; "Done for today" when all are ticked. With nothing due, the day asks for one lesson. Model: `src/lib/dashboard/day-plan.ts` (tested).
- **One goal**, set once: onboarding's pace step saves it; Settings › Preferences changes it (it also writes the older `pace`). Practice and the dashboard show it as "Regular goal · change" — no picker there. Practice still uses it as a card target (10 / 20 / 40).
- **One streak:** a day counts when a lesson is finished or a review session is done (`streakDays` in `coach-home-model.ts`, now taking lesson dates). Used by the dashboard, Practice home and summary, and Progress.
- **Still on the old lesson-only streak** (the `streaks` table): the old `/dashboard`, the lesson footer, `/streak-lost`, the curriculum pages. To move when those pages get their pass.
