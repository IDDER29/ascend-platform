# Practice v2 — functional review loop

**Date:** 2026-09-25  
**Status:** Implemented
**Route:** `/practicev2` (separate from live `/practice`)  
**Builds on:** Coach screen ports; `practice-as-review`, retention home, SM-2 Phase C

## Goal

Turn `/practicev2` from static Coach shells into a **usable review loop** students can run to self-test unlocked concepts, resurface misses, and follow lesson links when wrong — without cutting over or changing live `/practice`.

## Decisions (locked)

| Topic | Choice |
|-------|--------|
| Product home | Stay on `/practicev2` (do not replace `/practice` in this pass) |
| First slice | Full review loop (not hub analytics / bank editor first) |
| Session UX | One live route `/practicev2/session` with in-place UI states |
| Engine | Shared practice libs (`sm2`, cards, unlock, history, grade actions) |
| Grades | Wrong / Missed it → Again; Correct / Got it → Good |
| Visual state URLs | `/session/choices`, `/correct`, `/wrong`, etc. remain reference/demo; live path does not depend on them |

## Page flow

```
Home (/practicev2)
  ├─ due > 0     → Start review → Session (?scope=due)
  ├─ due = 0     → Caught-up / free study → Session (?scope=all|…)
  └─ Open path   → /practicev2/foundations (visual this slice; Start → Session)

Session (/practicev2/session)
  prompt (MCQ | flashcard) → feedback (correct | wrong) → next
  queue empty → save history record → /practicev2/complete?session=<id>

Complete
  ├─ load record by `session` id (fallback: latest history entry)
  ├─ Fix misses → Session (due / misses)
  └─ Home → /practicev2
```

## Architecture

**Shared brain (reuse):** `src/lib/practice/*` — bank, unlock from completed lessons, SM-2 schedule, due composition (soft ~8 cap for due), session history, persistence (guest localStorage; signed-in DB when available).

**Coach face (v2-only):**

| Piece | Role |
|-------|------|
| Home client | Real due count + Start / Retry → `/practicev2/session?scope=…` |
| `PracticeCoachV2Session` | Build queue from scope; Coach chrome for prompt / feedback; grade; advance |
| Complete page | Real score, miss list + lesson links, Fix misses CTA |

Static markup modules may be adapted into data-bound Coach chrome; look stays Phosphor cream Coach.

## Learning honesty

- No fake cards when nothing is unlocked — empty / caught-up, redirect home from Session if needed
- Wrong feedback: hint + related lesson link when `lessonSlug` exists
- Copy about “coming back” / due only when SM-2 / schedule actually resurfaces the card
- Mid-session leave: already-applied grades keep; unfinished queue discarded
- Invalid / empty scope: free study if unlocked cards exist; else home

## Out of scope

- Full card bank / custom deck as real editors
- Foundations path heat as live analytics rewrite
- Replacing or deleting `/practice`; cutting nav to v2
- Hard/Easy grades, email reminders, Practice XP / streaks

## Success criteria

- [x] Start review on `/practicev2` runs real unlocked/due cards and writes SM-2 grades
- [x] Complete shows real score + miss → lesson links
- [x] Home due CTA matches engine due count
- [x] Coach visual language preserved on the live session path
- [x] `/practice` behavior unchanged

## Rollout order

1. Session host on `/practicev2/session` (queue + grade + in-place chrome)
2. Complete page bound to finished session record
3. Home Start / due / Retry wired to real scopes
4. Visual QA pass on live path; leave static state routes as references
