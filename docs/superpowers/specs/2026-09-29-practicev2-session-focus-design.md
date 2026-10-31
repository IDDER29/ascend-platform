# Practice v2 session — focus mode, progress, exit, dark

**Status:** approved 2026-09-29  
**Route:** `/practicev2/session` (complete screen + other sub-pages out of scope)

## Decisions (from user)

| Topic | Decision |
|---|---|
| Exit mid-session | Save answered cards (grades + shorter session record), return to `/practicev2`. No confirm. |
| Dark mode | Yes — session colors move to `--coach-*` variables. |
| Progress | Segmented bar, one segment per card, plus `N of M`. |

## Design

1. **Focus mode.** `ShellFooter` (client) wraps `SiteFooter` in `AppShell` and
   renders nothing when the pathname starts with `/practicev2/session`.
2. **Top bar** above the kind/scope row: ✕ `End session` button (label
   visible ≥ sm; `Esc` shortcut), segmented progress, `N of M` (mono).
   Segment states: `correct` blue, `missed` orange, `skipped` neutral-strong,
   `current` ink outline, `upcoming` light. `role="progressbar"`,
   `aria-valuenow` = cards done, `aria-valuemax` = total.
3. **Exit saves.** `saveSession(answered)` extracted from `finishSession`
   (apply grades, sync cards, prepend + sync session record) returns the
   record; `finishSession` → complete screen; `exitSession` → home (skips the
   save when nothing was answered).
4. **Bottom bar** full-bleed and `sticky bottom-0`; page drops the
   `max-w-[1100px]` wrapper so the bar spans the main column.
5. **Dark mode.** Replace session hex with `--coach-*` variables; add
   `--coach-correct-*`, `--coach-wrong-*`, `--coach-selected-bg`,
   `--coach-code-*`, `--coach-flash-back` in light + dark. Remove
   `PRACTICE_COACH_V2_SESSION_CSS` injection; page carries
   `practice-coach-v2`.

## Testing

- `sessionProgressSegments(total, answered, skipped, index)` unit tests.
- `npx tsc --noEmit`, `npm run lint`.
- Playwright: answer → segment colored; `Esc` mid-session → home shows the
  partial session; no site footer on session; light/dark/mobile screenshots.
