# Practice Phase C — SM-2 card schedule

**Date:** 2026-09-25  
**Status:** Done
**Route:** `/practice`  
**Builds on:** `2026-09-25-practice-retention-home-design.md` (Phase A+B Done)  
**Chosen approach:** Per-card schedule store (DB + guest localStorage)

## Goal

Replace the flat miss queue with a real **per-card SM-2 schedule** so Due means “due now,” free study still advances intervals, and copy can honestly say “next review …” — without email, Hard/Easy grades, or streak theater.

## Decisions (locked)

| Topic | Choice |
|-------|--------|
| Algorithm | SM-2-shaped schedule (2 grades only) |
| Grades | MCQ wrong → **Again**; correct → **Good** (no Hard/Easy UI) |
| Who | Signed-in **and** guests |
| Persistence | Signed-in → DB `practice_cards` (DB wins on load); guests → `localStorage` |
| Card entry | On **unlock** (Foundations default + completed lessons) → `state: new` |
| Due new-card drip | **20 new / calendar day** (local tz); due **reviews unlimited** |
| Free study | Path / lessons / unlocked sessions **also** call `gradeCard` |
| Legacy miss queue | **Migrate once** → cards due now (`learning`), then drop queue key |
| Session length | Soft cap ~**8** items per Due session when the pile is large |
| Out | Email reminders, minute learning steps, Hard/Easy, multi-device CRDT, Practice XP/streaks |

## Card model

One record per `(owner, questionId)`:

| Field | Type | Meaning |
|-------|------|---------|
| `questionId` | string | Bank id |
| `state` | `new` \| `learning` \| `review` | Lifecycle |
| `reps` | number | Successful review count (SM-2 `n`) |
| `ease` | number | Ease factor; start **2.5** |
| `intervalDays` | number | Current interval length |
| `dueAt` | ISO string | Eligible when `dueAt <= now` |
| `lapses` | number | Failures from `review` (optional counter) |
| `updatedAt` | ISO string | Last grade |

### Ensure on unlock

On Practice load: for every unlocked bank question missing from the store, insert:

- `state: new`
- `reps: 0`, `ease: 2.5`, `intervalDays: 0`
- `dueAt: now` (eligible as new immediately)
- `lapses: 0`

### Grade rules (simplified SM-2, Again / Good only)

- **Again** (any state):
  - `state → learning`
  - `reps = 0`
  - `ease = max(1.3, ease − 0.2)`
  - if previous state was `review`, `lapses += 1`
  - `dueAt = now` (returns to today’s Due; no minute-step timers in this pass)

- **Good from `new` or `learning`:**
  - graduate → `state: review`, `reps = 1`
  - `intervalDays = 1`
  - `dueAt = now + 1 day`

- **Good from `review`:**
  - `reps += 1`
  - `intervalDays = max(1, round(previousIntervalDays * ease))` (graduate already set the first interval to 1 day)
  - `ease = min(3.0, ease + 0.1)`
  - `dueAt = now + intervalDays` days

Exact arithmetic lives in a pure `sm2.ts` helper so unit tests own the edge cases.

## Due composition

**Due now** = cards with `dueAt <= now`, split by state:

1. All **review** + **learning** due now (unlimited)
2. **New** due now, limited by remaining **daily new allowance** (20 − new cards that left `new` today)

**Hub Due count** = full size of that set (can be >8). **Due session build** orders reviews/learning first then new, then takes up to **8** items. No random filler outside the due set.

**Daily new counter:** whenever any session (Due or free study) grades a card out of `state: new`, increment today’s count (local calendar date). Cap applies to **Due queue construction and Due hub new slice** only — free study may still open new cards in-scope, and those grades still consume the day’s allowance so Due does not immediately re-offer another 20.

**Meta storage:** `{ date: "YYYY-MM-DD", count: number }` beside the card map (`localStorage` for guests; same shape cached for signed-in, persisted with card upserts or a tiny companion row — plan picks one write path).

## Hub & session UX

### Due band

- Count = due reviews/learning + new still allowed under today’s cap
- Count > 0 → primary **Study due cards** (`scope: due`)
- Count = 0 → **Nothing due** + earliest future `dueAt` as “Next review …” when any card exists
- Retire miss-queue copy (“N misses waiting”)

### Free study (path / lessons / unlocked)

- Same entry points as Phase B
- Prefer due-in-scope first, then other unlocked in scope
- Every answered item runs `gradeCard` (Again/Good)

### Results

- Score + miss → lesson links unchanged
- Optional quiet line: cards scheduled later — **no** streaks / XP / badges

### Hit rate / Recent

- Still correct÷seen from session history — **not** relabeled as mastery or ease

### Demo (`?demo=1`)

- Seed card states so Due / next-due / empty photograph correctly

## Architecture

```
Practice page load
  ├─ completedKeys, session history (existing)
  └─ cards: DB (signed-in) | localStorage (guest)
       → ensureUnlockedCards
       → migrateMissQueueOnce (if old key present)
       → hub Due counts

Session answers
  └─ on finish: grade each → persist cards + save session history
```

### Modules

| Module | Role |
|--------|------|
| `src/lib/practice/sm2.ts` | Pure grade + due helpers |
| `src/lib/practice/cards.ts` | Read/write card map; guest storage; one-shot miss migrate |
| `src/lib/practice/actions.ts` | `listPracticeCards` / batch upsert for signed-in |
| `src/lib/practice/session.ts` | Due session builder uses card due set + new cap |
| DB schemas + `sqlite-ddl.ts` | `practice_cards` table |

### Sync

- **Batch upsert on session end** (not per-click server writes)
- Signed-in: always mirror to local cache after load/save; **DB replaces cache on load**
- Last session write wins — no CRDT
- If DB missing/fails: keep local cards; soft failure copy (same honesty as session history)

### Migration

1. Read `ascend_practice_misses_v1:*`
2. For each id: upsert card `state: learning`, `dueAt: now`, ease floor rules as Again
3. Delete miss-queue key
4. Remove miss-queue reads from hub CTAs (keep module only if needed for migrate, then dead-code later)

## Honesty

- May claim spaced schedule / next review **only** because `dueAt` is real
- Do not invent “due tomorrow” without writing `dueAt`
- Do not pad Due with non-due cards
- No Practice streaks, XP, or email in this pass

## Success criteria

- [x] Due count matches SM-2 due set + new-cap, not miss-queue length
- [x] Wrong → Again (due now); correct → Good (interval advanced)
- [x] Unlock creates `new` cards; Due respects 20 new/day
- [x] Path/free study grades update the same store
- [x] Guests persist in localStorage; signed-in round-trip via DB when available
- [x] One-shot miss-queue migrate → learning/due now
- [x] Hit rate / Recent semantics unchanged; no streak UI

## Out of scope (later)

- Email / push reminders
- Hard / Easy grades and minute learning steps
- Multi-device merge UI
- Server-only with zero guest schedule
- SM-2 ease shown in the rail
