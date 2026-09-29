# Practice v2 — Review complete page (React rebuild)

## Problem

`/practicev2/complete` injects static Coach HTML and regex-patches a few spots.
Accuracy, last-time score, daily goal, streak and card-strength numbers are
hard-coded; the result bar assumes 8 cards; Enter does nothing; colors are hex
(no dark mode); the layout is a fixed 1100px with a 52px title, much larger
than the rest of the app.

## Design

Same Coach look, app hub scale (960px, 32px title, 44px buttons), real data.

**Left column**

- Header: 64px check tile, "Review complete" (28/32px), summary
  "{correct} of {total} right." plus "The N you missed are already scheduled
  to come back." or "You're caught up for now."
- Result bar: one segment per answered card in session order (blue correct,
  orange missed), flexible width; legend.
- Stat tiles:
  - Accuracy: `round(correct / total * 100)%`; sub "Last time N%" from the
    newest earlier session in history, else "First session".
  - Daily goal: cards answered today (`cardsClearedToday`) / goal
    (`readDailyGoal`); sub "Goal met" or "N to go".
  - Streak: `streakDays(history, now)`; sub "Safe for today" when > 0.
    Orange tile when > 0, neutral otherwise.
- Card strength: "{correct} moved up", "{missed} back to Learning".

**Right column**

- Coming back: one row per miss — card `reviewLabel` (mono), "Answer: …"
  (MCQ option / flashcard back / first typed answer), lesson link from
  `reviewHrefs`. Empty: "Nothing to fix — every card was right."
- Actions: misses → lime "Fix N misses now" (`/practicev2/session?scope=due`)
  plus outline "Back to practice"; none → lime "Back to practice" only.
  Enter triggers the lime action (ignored in inputs/buttons/links).

**States**: skeleton while local history loads; Coach "No session yet" card
when the session id is not found.

**Dark mode**: `--coach-*` variables only; page `main` gets
`practice-coach-v2` and `HUB_CONTENT_CLASS`.

## Code

- `src/lib/practice/coach-complete-model.ts` — pure
  `buildCoachCompleteModel({ record, history, goal, now })`, tested.
- `src/components/practice/coach-complete/*` — header, result bar, stat tiles,
  strength, coming-back, actions, skeleton.
- Rewrite `practice-coach-v2-complete-live.tsx`; delete
  `practice-coach-v2-complete-markup.ts` and the unused static
  `practice-coach-v2-complete.tsx`.

## Out of scope

Storing the learner's typed/selected answer ("You said …").
