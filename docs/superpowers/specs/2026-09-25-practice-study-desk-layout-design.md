# Practice study-desk layout

**Date:** 2026-09-25  
**Status:** Done  
**Route:** `/practice` (hub / ready phase only)  
**Builds on:** `2026-09-25-practice-retention-home-design.md` (Due · Study · Hit rate honesty)  
**Chosen approach:** Study desk (whole-picture board, option C → layout 1)

## Goal

Open Practice and see **due + decks + hit rate + recent** in one calm composition — like a study desk, not a long single-column marketing stack and not a SaaS analytics dashboard.

Session and results modes stay single-column and focused (unchanged).

## Composition

```
PageHeader (Practice)
└─ Study desk  max-w ~1100–1200px
   ├─ Main (flex-1, ~2/3)
   │  ├─ Due / Study band     primary CTA
   │  ├─ Study by path        deck list
   │  └─ Pick lessons         compact expander
   └─ Rail (sticky, ~280–320px)
      ├─ Hit rate by path
      └─ Recent sessions
```

### Width

- Hub shell: use `HUB_CONTENT_CLASS` (`max-w-[1200px]`) instead of `HUB_NARROW_CLASS` for the ready/hub view.
- Session + results: keep narrow (`max-w-[640px]` centered) so the drill stays book-like.

### Breakpoints

| Width | Layout |
|-------|--------|
| `lg+` | Two columns: main + sticky rail |
| `<lg` | Stack: Due → Decks → Pick lessons → Hit rate → Recent |

## Main column

### Due / Study band

- Same Anki-honest copy and behavior as today:
  - Due → “Study due cards” (`scope: due`, no filler)
  - Empty → “Nothing due” + “Study unlocked”
  - Optional text link: study unlocked with misses-first when due > 0
- Visual: one mint/xp band (Phosphor), not a card farm. Keep blur accent quiet.
- Last session line stays under the CTA when history exists.

### Study by path

- Deck rows (mark · title · card/lesson counts · Study).
- No hit-rate % on the row (lives in the rail only — avoid double-claiming).
- Foundations “Always open” chip unchanged.

### Pick lessons

- Dashed compact expander under decks (secondary). Not a third column.

## Rail

### Hit rate by path

- Quiet list: path name · correct/seen · % + thin bar.
- Empty: one dashed line — “Finish a session…”
- Label honesty: “Hit rate” / “Correct ÷ seen — not a schedule.”

### Recent sessions

- Last 5–8 rows: scope · when · score.
- Storage honesty copy (device / sync) stays under the heading, smaller mono/body.

### Rail behavior

- `lg+`: `sticky` under header offset so due CTA + decks scroll while stats stay visible.
- No fake XP, streaks, or “due tomorrow.”

## What does not change

- Miss queue, `buildSession`, persistence, DB actions
- Session UI (dots / options / hint / check)
- Results → Back to Practice / Practice again
- Demo `?demo=1` views
- Phosphor tokens (no purple, no new font families)

## Honesty (carry forward)

- Due ≠ “today’s set with filler”
- Hit rate ≠ mastery or SM-2 retention
- No invented schedule until Phase C

## Polish notes (post-desk)

- Due band signature: large tabular **due** count (+ bank meta), not a second card stack
- Decks: single bordered list with row hover (dashboard Continue pattern) — avoid card corridor
- Rail: `lg:border-l lg:pl-8` like Continue home; hit rate / recent as plain lists
- Custom lessons: dashed fold under decks, not a third hero block

## Out of scope

- SM-2 intervals / due dates
- Redesigning session or results chrome
- New Practice analytics charts
