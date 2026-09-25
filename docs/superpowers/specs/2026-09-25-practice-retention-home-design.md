# Practice retention home (Due · Study · Hit rate · History)

**Date:** 2026-09-25  
**Status:** Done (Phase A + B)  
**Route:** `/practice`  
**Inspiration:** Anki — miss queue ≈ Again; due study = queue only; no invented schedule until Phase C.

## Goal

Practice is a **retention surface** you can trust: redo what you missed, free-study unlocked cards, and a plain record of sessions — not quiz chrome and not fake spaced repetition.

## Page spine

```
Practice
├─ Due / Study  → miss queue (“due”) or free study when empty
├─ By path      → deck-style scopes (misses in scope first)
├─ Hit rate     → correct ÷ seen per path (not mastery / not SM-2)
└─ Recent       → last sessions (date · scope · score)
```

Session + result stay focused modes; then return to this hub.

## What is real vs not

| Claim | Reality (Phase A+B) |
|-------|---------------------|
| Due cards | Miss IDs still in `localStorage` queue until answered correctly |
| Study due | Session = **only** those misses (no random filler) |
| Free study | Unlocked bank; misses in scope still prioritized first |
| Hit rate | Aggregate correct/seen from saved sessions |
| Intervals / “due tomorrow” | **Not built** (Phase C) |
| Streaks / XP from Practice | **Never** |

## Phase A — Persist sessions

Each finished session stores:

- `id`, `at` (ISO)
- `scopeType` (`all` \| `path` \| `lessons` \| `due`) + `scopeLabel` (+ optional `pathSlug`)
- `correct`, `total`, `missIds[]`, `questionIds[]`

| Who | Where |
|-----|--------|
| Guest | `localStorage` (`ascend_practice_history_v1:guest`) |
| Signed-in | DB `practice_sessions` when available; always mirror to `localStorage` keyed by user id as device cache |

## Phase B — Hub surfaces

- **Due:** miss-queue count → primary “Study due cards” (`scope: due`)
- **Empty due:** honest “Nothing due” + free “Study unlocked”
- **Hit rate:** per-path % and session count (quiet; labeled non-SR)
- **Recent:** last 8 sessions; score line only

## Phase C (out of this pass)

SM-2 / due dates, ease factors, server-only source of truth without local mirror, email reminders.

## Honesty

- No inventing streaks or badges from Practice
- Don’t claim “spaced repetition schedule” or “today’s set” without due dates
- Don’t pad a due session with random cards
- Empty Recent / Hit rate until first completed session

## Ops note (Postgres)

SQLite gets `practice_sessions` via `sqlite-ddl.ts` on boot. Postgres needs the table applied from `schema.pg.ts` (no checked-in drizzle migrations in this repo) before signed-in sync works; localStorage still records sessions either way.
