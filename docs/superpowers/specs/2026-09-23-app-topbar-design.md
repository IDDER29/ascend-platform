# App topbar polish (dashboard chrome) — SUPERSEDED

**Date:** 2026-09-23  
**Status:** **Superseded** — learner top bar removed entirely (2026-09-23 follow-up)  
**See instead:** `docs/design/PHOSPHOR-LESSONS-AND-RUNBOOK.md` L25–L29 · `.cursor/rules/app-shell-chrome.mdc`

## Why this was superseded

We shipped a Phosphor top bar (links + theme), then learned:

1. **Search was dead chrome** — removed.
2. **Curriculum / Paths / Community duplicated the sidebar** — Ascend is not Odin (Odin has no sidebar).
3. With only theme + avatar left, the top bar had **no job** — deleted; **ThemeToggle** moved into the **sidebar**; sticky `72px` offsets cleared.

## Original approved intent (historical)

Quiet IA + theme on `AppTopbar`, no notifications. Kept here so we don’t re-litigate the same mistakes.

Do **not** re-implement `AppTopbar` without revisiting L25–L26.
