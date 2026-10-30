# /achievementsv3 — design (2026-10-30)

A deliberately different take on the same 13 badges as `/achievementsv2`,
after looking at the old `/achievements` (a 25-idea catalog: grey locked
medallions, rarity tags with no data behind them, filter chips, and an
honest "nothing is awarded yet" banner — kept: honesty and the glyphs;
dropped: the wall of locks and invented rarity).

## Idea: your learning as a changelog
Ascend trains programmers, and programmers already read progress as
release notes.
- **Finishing a level is a release:** v0.1 Groundwork, v0.2 Machine Head,
  v0.3 The Craft, v0.4 Systems Sage; **v1.0** is Core Complete.
- **Your version is the headline:** `v0.1.2` = release 0.1 plus 2 badges
  earned since. `v0.0.n` before the first release.
- **Every other badge is an entry** in the release period it was earned
  in (first release on or after its date), with a changelog verb —
  Shipped (projects), Held (Memory), Kept up (habits) — its date and a
  short commit-style hash. Shipped entries link the repo.

## Layout
1. Header + one line on how the page works.
2. **Hero (dark):** "You're on" + the version in large display type, a
   one-sentence summary ("Released v0.1 Groundwork on Oct 19. 2 badges
   since. Next release: v0.2 Machine Head, 4 lessons away."), and the
   release train v0.1 → v1.0 (released = lime with date, next = blue,
   later = dashed), each linking to its release or the roadmap.
   Under the train, **Your badges**: the shelf with all 13 badges as
   medallions in a fixed album order — earned = solid lime with its date,
   not yet = dashed outline. Each links to the one place that badge lives
   on the page (its entry, its in-progress row or its roadmap line), which
   is highlighted when jumped to.
3. Main column: **Unreleased** (entries since the last release + "In
   progress" = the same Up next goals as v2, first button lime), then one
   card per **release**, newest first, "Latest" on the top one.
   Every entry and in-progress row leads with its badge medallion.
4. Aside (sticky on desktop): **Roadmap** (outlined medallions) — each unreleased version with
   what it needs, progress on the next one, what ships alongside (Ship It
   with v0.4), and "Also open" for the remaining badges.

No motion. Phones: one column; the release train wraps.

## Architecture
Pure `src/lib/achievements/changelog-model.ts` (+ tests) on top of the
achievements model; components in `src/components/achievements-v3/`;
route `src/app/(learner)/achievementsv3/page.tsx`. Same data loader and
guest sample as v2.
