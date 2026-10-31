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
- Promoted to `/dashboard` (2026-10-30); `/dashboardv2` redirects there; the old page is kept at `/dashboardv1`. The sidebar, footer and command palette call it **Today**.
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

## To revisit (2026-10-30)
- What didn't click, from two sources: what you flagged ("Didn't get it" bookmarks, newest first), then lessons Practice shows you keep missing lately (last 30 days, at least 3 answers, under 70% right; worst first). A lesson flagged as a whole isn't listed again. Overdue cards stay on the Practice card.
- Each flag: where it is, your note, its way back (Revisit section / Try the card again …) and "I get it now" (keeps it as a reference). Each Practice lesson: "N of M right in Practice lately", Practice its cards, Reread the lesson.
- Up to 4 shown; always present, with an empty state saying how things get here.
- Model: `src/lib/dashboard/revisit-model.ts` (tested).

## Practice card (2026-10-30)
- Answers "is there a review to do, and how long is it?": "Review ready" (or "Another review ready" after one today), "8 cards · about 4 min" (about 30 s a card), then what's waiting ("35 due in all, 3 of them ones you missed."), Start review and the last score.
- Caught up: when the next card comes due, and Free study. No cards yet: finish a lesson to get some (no button).
- Under it, "Coming up": cards due today and the next six days.
- Model: `src/lib/dashboard/practice-card-model.ts` (tested).

## Memory curve (2026-10-30)
- Replaces "Coming up" on the Practice card: "You'd recall about N% of your M cards today" and a 30-day chart — reviewing when due vs if you stop — from an FSRS-style estimate over the learner's own cards. Details, formula and reasoning: `docs/learning-science/spaced-repetition.md` §3. Model: `src/lib/practice/memory-curve.ts` (tested).

## Ways to review replaces To revisit (2026-10-30)
- The user's call: To revisit had no role next to Practice; instead, the review options worth doing now, each with how much is waiting — Fix your misses (N to fix), Review <current path> (before you continue; all clear when nothing's due), other joined paths with cards due, your saved custom decks (N due / N cards), and "Didn't get it" bookmarks (N saved, links to Bookmarks). Misses and the current path always show; the rest only when there's something there. Model: `src/lib/dashboard/review-options.ts` (tested). `revisit-model.ts` and its card were removed.

## Ways to review: icons and each set's own curve (2026-10-30)
- Each row has its own icon in the dark tile used for paths: ↺ misses, pulse line for shaky, the path's own icon for path rows, stacked layers for a custom deck, a bookmark for Didn't get it.
- Under the title, the set's own memory curve (only its cards; `setMemory` in `deck-memory.ts`), from its last review to today, with a dashed rise to where a review today would take it; then "N% now → about M% if you review" (or "· holding"), and "Last reviewed <when> · about N min" (30 s a card). No curve for a set nobody has reviewed. No streaks or points per row — the slope and the date do the nudging.

## Whole-page pass (2026-10-30)
Each piece says one thing, once:
- **Practice card** = the main review (Review ready · 8 cards · about 4 min · Start review · last score) and *Your memory* (one heading; the chart's solid line is "So far"). What's waiting where ("35 due", "3 missed") lives only in Ways to review.
- **Ways to review** rows are compact: title + badge, one line of detail, then one line — mini curve, "28% → 100%" (or "· holding"), minutes. A set's last-review date shows only when it differs from your latest review (otherwise every row repeated the same date).
- **The active path's Continue** is the big next-lesson card; its path card keeps View path only. Other paths keep Continue.
- **Header line** matches the next-lesson card ("Your first lesson takes about N minutes").
Order top to bottom: what to do now (next lesson + Today checklist) → review (Practice + Ways to review) → the long journey (Your paths) → where you stand (title, badge, project; sign-in for guests).
