# Practice training desk final-review fix

- Added the missing `.desk-sheen` layer to Practice home path rows and DrillInHub section Continue rows, with clipped relative row containers and foreground content stacking.
- Added a global reduced-motion override that disables `.animate-rise`.
- Made `cardsClearedToday` use the next local midnight so its end boundary remains correct across DST changes; added a spring-forward regression test.
- Verification: `npx tsx --test src/lib/practice/*.test.ts` — 35 passed, 0 failed.
- Verification: `npx tsc --noEmit` — passed.
- HTTP smoke: `/practice` — 200; `/practice/foundations` — 200 from the running local server.
- Screenshots: none taken.
- Manual checklist remaining: inspect sheen subtlety and clipping in light/dark mode; confirm keyboard focus remains visible; confirm reduced-motion mode has no rise animation.
