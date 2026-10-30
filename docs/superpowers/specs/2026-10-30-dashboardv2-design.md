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
- **Today** replaces "Your day" on the dashboard: a checklist sized by the daily goal — Casual: one lesson; Regular: one lesson and a review; Serious: two lessons and a review (the review line only when cards are due). Items tick from what really happened today; "Done for today" when all are ticked. Model: `src/lib/dashboard/day-plan.ts` (tested).
- **One goal**, set once: onboarding's pace step saves it; Settings › Preferences changes it (it also writes the older `pace`). Practice and the dashboard show it as "Regular goal · change" — no picker there. Practice still uses it as a card target (10 / 20 / 40).
- **One streak, lessons only** (the user's call): a day counts when a lesson is finished; reviews don't. It always shows a number ("0-day streak"). Under it, this week Monday–Sunday with the lesson days filled. `src/lib/progress/streak.ts` (`lessonStreak`, `lessonWeek`, tested). Used by the dashboard, Practice home and summary, and Progress.
- **Still read from the `streaks` table** (same rule, lessons only, but stored rather than worked out): the old `/dashboard`, the lesson footer, `/streak-lost`, the curriculum pages. To move when those pages get their pass.

## Your paths (2026-10-30)
- A section under Today/Practice: one card per joined path (joined paths are the `ascend_following` cookie). The path worked on last leads (its last finished lesson, else when it was joined); finished paths come after the ones still going.
- Kept light (the user's call): a grid of small cards, one per joined path — its icon, name, "Active" on the one you're on, "N of M sections done" (or Finished), a bar with "N of M lessons", and Continue / View path. The per-group detail lives on the path's own page.
- The top card's next lesson now comes from that leading path (its topics, then its capstone), labelled with the path's name; with no path joined it's the first open lesson in the curriculum, as before.
- No path joined: a one-line prompt to pick one.
- Model: `src/lib/dashboard/paths-model.ts` (tested).
