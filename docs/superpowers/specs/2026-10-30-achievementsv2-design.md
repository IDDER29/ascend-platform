# /achievementsv2 — design (2026-10-30)

## Goal
Answers **"What have I earned, and what's worth going for next?"** — a
trophy shelf plus a short list of real goals. Every badge stands for
something that happened and can be checked from records; nothing rewards
time of day, speed or features that don't exist. Lowest-stakes of the
learner pages, so it stays small and honest.

Built at `/achievementsv2` beside the existing `/achievements` (untouched),
in the Practice "Coach" look.

## Badges (13, `src/lib/achievements/catalog.ts`)
- **Levels (4):** Groundwork, Machine Head, The Craft, Systems Sage —
  every lesson of the level finished.
- **Projects (2):** Gate Builder (half adder), Ship It (ShellForge) — same
  rule as the profile: lessons done + repo linked.
- **Memory (4):** every card of a level held solid (review state) in
  Practice. Can go on hold if a card slips back to learning.
- **Habits (2):** Week of Practice (7 days in a row), Comeback (a session
  after 14+ days away).
- **Core Complete:** every lesson finished and both projects shipped.

All worked out from lesson completions, project links, Practice cards and
sessions — nothing stored. The old 25-idea catalog (`achievements-data.ts`)
stays only for the old page; the profile now reads the new catalog.

## Layout
1. Header: "Achievements" + one sentence ("4 of 13 earned. Closest next:
   Machine Head, 4 lessons away.").
2. **Up next** (≤3 cards, the page's only buttons; first is lime) +
   aside **How badges are earned** (four plain rules).
   Order: Comeback when away 14+ days · a project ready to ship · the
   current level · the lowest open Memory badge · Week of Practice · Core
   Complete only within 5 lessons.
3. **The board** (signature): badges as parts on a circuit board wired in
   curriculum order. Levels are chips on the main line, Memory parts are
   round above them, Projects are modules below, Core Complete closes the
   line, Habits sit on an unwired rail. Earned = placed, lime, status
   light, date silkscreened; in progress = blue outline + n/total; not
   yet = dashed footprint. The trace is lit along the unbroken earned
   path and powers up once on load (skipped with reduced motion).
   Phones: the board stands upright, Level 00 at the bottom, Core on top.
4. **Details** under the board for the selected part: what it means /
   how to earn it, distance, repo link, one action.
   A badge earned since the last visit is marked "new" until selected
   (per browser, localStorage).

Guests (development): the profile's sample learner under the same
"Development preview" banner, behind `SHOW_SAMPLE_PROFILE_TO_GUESTS`.

## Not built yet
- **Featured on profile** (pick up to 3): needs storage — waits for the
  database work.

## Architecture
- Pure `src/lib/achievements/achievements-model.ts` + tests; shared
  `src/lib/profile/curriculum-records.ts` (finished levels, project status)
  used by the profile model too.
- `src/lib/achievements/server-page-data.ts`; components in
  `src/components/achievements-v2/`; route
  `src/app/(learner)/achievementsv2/page.tsx`.
