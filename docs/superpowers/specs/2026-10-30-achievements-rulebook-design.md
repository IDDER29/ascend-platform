# Achievements: the rule book — design (2026-10-30)

## Decisions (from the user)
- **No levels on the platform.** The four lesson groups stay as named
  **topics** (Bits & Logic, Machine & Memory, The C Language, Systems &
  Software) — never "Level 00", numbers or level-ups. Internal ids
  (`level-00-…`) stay as they are; only what people see changes.
- **Each badge has its own exact rule.** Badges aren't chained to levels
  or to each other — except **combination badges**, whose rule *is* the
  list of badges they need, shown openly.

Earlier explorations built on levels (`/achievementsv2` board,
`/achievementsv3` changelog) were removed; they're in git history.

## Badges (17) — `src/lib/achievements/catalog.ts`
Every rule is data (`BadgeRule`), checked from real records only.

| Badge | Group | Rule (all must hold) |
|---|---|---|
| First Bit | Learning | Finish a lesson |
| Ten Down | Learning | Finish 10 lessons |
| Gatekeeper | Learning | Finish every lesson in Bits & Logic |
| Machinist | Learning | Finish every lesson in Machine & Memory |
| Pointer Wrangler | Learning | Finish every lesson in The C Language |
| Systems Thinker | Learning | Finish every lesson in Systems & Software |
| Gate Builder | Building | Finish the half adder lesson · Link your half adder repo on your profile |
| Shell Smith | Building | Finish every lesson in Systems & Software · Link your ShellForge repo on your profile |
| Steady Hands | Remembering | Hold 25 Practice cards solid |
| Deep Memory | Remembering | Hold 100 Practice cards solid |
| Clean Run | Remembering | Get every card right in one review session of 10 or more cards |
| Week of Practice | Habits | Practice 7 days in a row |
| Regular | Habits | Finish 25 review sessions |
| Comeback | Habits | Come back to Practice after 14 or more days away |
| Builder | Combination | Earn Gate Builder · Earn Shell Smith |
| Sharp Mind | Combination | Earn Deep Memory · Earn Clean Run · Earn Week of Practice |
| The Whole Machine | Combination | Finish every lesson in the curriculum · Earn Builder |

"Solid" = a card in Practice's review state; card badges are held while
the cards stay solid. A badge's date is when its last condition was met.
Ids `gate-builder` and `ship-it` (Shell Smith) are kept so stored
`badges_earned` rows still match.

## Page (`/achievementsv4`, beside the old `/achievements`)
1. Header + one sentence ("5 of 17 earned. Closest next: Ten Down. Finish
   10 lessons (8 of 10).").
2. **Collection (dark hero):** the earned count and every badge as a
   medallion in catalog order — earned solid lime with its date, the rest
   dashed outlines; each jumps to its card.
3. **Closest:** up to 3 open badges furthest along (Comeback first for a
   returning learner), each with its next condition, progress and one
   button (first lime).
4. **Groups** — Learning, Building, Remembering, Habits, Combinations —
   of **badge cards**. Each card: medallion, name, status ("Earned Oct 19"
   / "1 of 2 conditions met"), and the rule as a checklist: ticked +
   dated when met, progress bar + "8 of 10" when open. Combination
   conditions show the needed badge's medallion and link to its card.
   Earned cards add what it means (and the repo for projects); open cards
   get one button for the next step.

Guests (development): the sample learner, as on the profile.

## Elsewhere
Progress, Profile, the lesson list, homepage, ShellForge, the command
palette and notifications use topic names instead of levels. The topic-
complete page lost its fake XP level-up; its other made-up numbers
(quiz score, streak) still need their own pass.

## Alternative layout: the track (`/achievementsv5`)
Same 17 badges, same rules, laid out to answer "how close am I?" at a
glance.
- **The track (dark):** one lane per group. Each open badge sits along
  its lane at how far along you are (`ratio`); a lime finish line closes
  the lane and earned badges sit past it (on phones, in an "Earned" row
  under the lane). Crowded badges take a second row, then nudge right just
  enough to stay readable (`track-layout.ts`, tested). Badges slide in
  from the start once on load (skipped with reduced motion).
- **Spotlight:** the selected badge (default: the closest) as a large
  medallion, its status ("80% of the way there", "1 of 2 conditions met")
  and its rule as a checklist with the next step. Selecting a combination
  rings the badges it needs on the track; their medallions in the
  checklist select them.

## Alternative layout: the chest (`/achievementsv6`)
The user's original idea: achievements are honours you wear, like the
ribbons on a general's chest — things you're proud to show.
- **The chest (dark uniform panel):** only earned badges are worn, as
  original ribbon bars (stable, symmetric stripe patterns from the group's
  colours — `ribbons.ts`, tested; combinations carry a device with their
  glyph), racked three to a row in order of precedence — combinations,
  building, remembering, learning, habits — with the top row holding the
  remainder. A nameplate with the learner's name sits under the rack.
  Ribbons are pinned one by one on load (skipped with reduced motion).
- **Citation:** selecting a ribbon shows the full medal (ribbon drape +
  medal) and a citation built from the badge's own rule: "Awarded to
  Sample Learner on Oct 22 for practicing 7 days in a row."
- **Still to earn:** closest first, each with a faded preview of its
  ribbon, its next condition and progress; selecting one shows "Not yet
  awarded" with the full rule as a checklist and the next step.

## Decision (2026-10-30): the chest is the main page
The user chose the chest. `/achievements` now serves it; the earlier takes
stay reachable as the user asked: `/achievementsv1` (the old catalog),
`/achievementsv4` (rule book), `/achievementsv5` (track); `/achievementsv6`
redirects to `/achievements`.

Finishing touches:
- **Newly awarded:** decorations earned since the last visit (per browser,
  localStorage) glow on the rack, open first, and carry a "Newly awarded"
  tag until selected. On a first visit everything already earned counts as
  seen.
- **Worn on the profile:** the profile's Achievements card shows the same
  ribbon rack (highest first) plus the newest three by name and date, on
  the owner's page and the public `/u/<username>` alike; "Open your chest"
  links here.
