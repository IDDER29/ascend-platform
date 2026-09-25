# Practice as Review (Playground teardown)

**Date:** 2026-09-25  
**Status:** Implemented  
**Route:** `/practice` (primary) · `/playground` → redirect to `/practice`

## Goal

One Learn surface for **self-testing knowledge from completed lessons** and **resurfacing misses** so students keep reviewing. Drop Playground as a primary “free C IDE” — that was the wrong job for Ascend.

## Job

| Does | Does not |
|------|----------|
| Quiz on concepts from lessons the student has completed | Free-form C compiler / scratch IDE |
| Put misses back into the next session (v1 local queue) | Full spaced-repetition intervals (v2) |
| Empty state when nothing is unlocked | Fake streaks, badges, or XP persistence |
| Phosphor hub chrome matching Continue / Settings | Purple leftover playground chrome |

## IA

**Learn nav:** Continue → Paths → **Practice**  
**Remove:** Playground from sidebar, footer, command palette, not-found quick links  
**Redirect:** `/playground` → `/practice` (permanent) so old links don’t 404  

Name stays **Practice** (route `/practice`). No rename to Review in this pass.

## Session model (v1)

### Who can practice

- Signed-in with ≥1 completed lesson → session built from unlocked concepts  
- Guest or zero completions → empty state → Continue / Paths (no fake drill)

### Session contents

- Short quiz (~5–8 multiple-choice items)  
- Prefer items whose `lessonLevel` + `lessonSlug` the user has completed  
- If the bank has nothing unlocked → empty (honest), not a random locked drill  
- Existing pointers drill remains only as seed content mapped to Foundations lessons once those lessons are completed

### Miss → resurface (v1)

- Wrong answer → enqueue `questionId` in a **client miss queue** (localStorage; key includes user id when signed in)  
- Next session: misses first, then fresh unlocked items  
- Copy: “Misses come back in your next session” — **not** full SR interval language until v2  

### Results

- Correct / miss counts  
- Miss list with links back to the related lesson when slug exists  
- CTAs: Practice again · Continue  
- No invented streak days or badge earn UI

## Question bank shape

```ts
{
  id: string;
  prompt: string;
  code?: string[];
  options: string[];
  correct: number;
  hint: string;
  reviewLabel: string;
  lessonLevel: string;   // e.g. "00"
  lessonSlug: string;    // curriculum slug
  conceptId: string;
}
```

v1: seed from current `POINTERS_DRILL` + map to real Foundations lesson slugs. Expand bank later.

## UI (Phosphor)

- Shell: `HUB_MAIN` + `HUB_NARROW` (960) — focused session, not a wide IDE  
- `PageHeader`: **Practice** · short description about checking what you’ve learned  
- Tokens only — no lavender hex / purple chrome from old Playground  

### States

1. **Empty** — nothing unlocked yet → Continue / Paths  
2. **Ready** — Start session (+ optional “N misses waiting”)  
3. **In session** — one question, hint, check; progress `n / total`  
4. **Results** — score, miss → lesson links, Practice again / Continue  

### Out of v1 UI

- Playground editor / file tabs / Run sandbox  
- Fake “12-day streak” / badge theater on results  
- Marketing “spaced repetition keeps you sharp” until miss-queue (or intervals) is real

## Playground teardown

- Remove nav / footer / ⌘K / not-found entries  
- Redirect `/playground` → `/practice`  
- Delete or stop shipping unused playground page + `playground-snippets` if nothing else imports them  

## Rollout order

1. Teardown Playground chrome + redirect  
2. Rebuild Practice UI (four states) on Phosphor  
3. Completed-lesson filter + local miss queue  
4. Honest copy only — no SR claims beyond what v1 does  

## Success criteria

- [x] No Playground in primary Learn nav, footer, or ⌘K  
- [x] `/playground` lands on Practice  
- [x] Practice never claims lesson-tied or resurfacing behavior it doesn’t implement  
- [x] Completing a mapped Foundations lesson unlocks related items  
- [x] Guest / zero-progress empty state is clear and useful  
- [x] Results don’t invent streaks or badges  

## Out of scope (later)

- Server-persisted miss queue + SM-2 / interval scheduling (v2)  
- In-browser C compilation scratchpad  
- Adaptive difficulty beyond “completed unlocks + miss first”  
- Practice XP written to progress DB  

## Open product note

Lesson labs remain the place to **run code in context**. Practice is **knowledge check + review**, not a replacement for labs.
