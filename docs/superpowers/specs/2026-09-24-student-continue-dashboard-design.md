# Student Continue Dashboard — focused home

**Date:** 2026-09-24  
**Status:** Complete  
**Route:** `/dashboard`

## Reading order (top → bottom)

1. **Orient** — greeting + one-line status · date (+ account tenure when signed in); no breadcrumb eyebrow (Continue is home; sidebar owns the label)
2. **Act** — Continue / Start band (only hero; owns level progress)
3. **Pulse** — streak · lessons · projects · path % + habit line
4. **Urgency (optional)** — only when a real project submission needs work
5. **Work** — Up next *or* path handoff + Path + Build & prove aside
6. **Standing** — not mounted; `MonthPulseStrip` kept for future real APIs

Narrow content (`HUB_NARROW_CLASS` / `max-w-[960px]`). Catalog hubs use `HUB_CONTENT_CLASS` (`1200px`). Phosphor tokens only. No school-attendance / Material cockpits.

## Code map

| Piece | File |
|-------|------|
| Page data + composition | `src/app/(learner)/dashboard/page.tsx` |
| Helpers | `src/lib/dashboard/continue.ts` |
| Continue / pulse / work / proof UI | `src/components/dashboard/continue-home.tsx` |
| Path aside | `EnrolledPathsPanel` in `learner-standing.tsx` |

## Continue band

One continuous band (no floating glass island):

1. Top row — status chip + lesson index + level name (inline)
2. Wide title + blurb (~40rem) + structure line
3. Bottom row — CTAs
4. **Level mastery ring** (right zone, ~128px) — bold **%** in center; label under; path tenure caption under label (`N days on path`) — never replaces the %
5. Optional faint background subject cue (desktop only), never its own module

## Pulse habit

- Signed-in only: `~N min keeps your streak` with Resume link, or “Day N secured” when last active is today

## Up next / handoff

- Lookahead after current when queue non-empty
- Empty queue + level clear → `resolvePathHandoff` (next course / capstone / path complete)
- Empty queue + level not clear → finish-this-lesson nudge

## Proof aside

- Next proof launch card (project / Shellforge / explore)
- Recent with pass/fix tones when present

## Tenure

- **Account** — `Day N on Ascend` from `users.createdAt` (header actions, signed-in only)
- **Path** — days since **first completed lesson** on that path (hide until then); not cookie enter / account age
- **Your paths** — following set only (Select / Unselect); Continue hero = last completed lesson or project
- Ring stays **% only** — tenure is a separate caption under the label when known

## Explicit non-goals

- Fake SRS, cohort chips, top search, locked-lesson theater, demo Standing
- Invented within-lesson progress % (needs real checkpoint APIs later)
- Tenure numbers inside the mastery ring
- Switching Continue on Select alone
