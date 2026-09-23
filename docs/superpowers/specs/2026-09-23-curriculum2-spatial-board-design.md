# Curriculum2 spatial board (sandbox)

**Date:** 2026-09-23  
**Status:** Approved for planning  
**Related:** `docs/design/PHOSPHOR-THEME.md`, `docs/design/PHOSPHOR-LESSONS-AND-RUNBOOK.md`, `docs/superpowers/specs/2026-09-22-app-shell-nav-design.md`

## Goal

Sandbox a new **curriculum hub** layout at `/curriculum2` without touching production `/curriculum`. Explore a **spatial board** map metaphor: survey the whole path, focus a level region, resume from an intro strip. Keep AppTopbar; open with sidebar collapsed.

## Locked decisions

| Decision | Choice |
|----------|--------|
| Scope | Curriculum hub only (not Continue merge, not full shell rethink) |
| Route | `/curriculum2` under `(learner)` |
| Map metaphor | Spatial board — Approach 1: **focused regions** |
| Continue UI | Intro strip above the board (greeting + context + Continue/Start) |
| Chrome | AppTopbar on; sidebar **forced collapsed** on this route |
| Nav | URL-only sandbox — do **not** add Curriculum2 to sidebar yet |
| Production | `/curriculum` unchanged until experiment wins |

## Non-goals (v1)

- Free pan/zoom canvas or game-engine map
- Merging `/dashboard` + `/curriculum`
- Lesson locking / new progress DB
- Replacing production `/curriculum`
- Adding this route to permanent sidebar nav
- Mobile hamburger redesign

## Page anatomy

### 1. Intro strip (compact)

- Title: **The path to the machine** (same job as production hub; no PageHeader eyebrow stack)
- One line of context: signed-in → level name · concept N of M; signed-out → open-path honesty
- Primary **Continue / Start** → real continue lesson URL
- Signed-in only: compact text meta (`{pct}% of path` · `{streak} day streak` when streak > 0) — not a progress-card stack

### 2. Spatial board (fills remaining viewport)

- Phosphor wash background (tokens only — no purple hero slab)
- Four **level regions** visible at once (00–03)
- Soft connectors / spine so regions read as one path
- Current lesson = “you are here” marker

### 3. Focus mode

- Click/tap a region → expand; lesson nodes listed inside
- Other regions dim/shrink
- Escape / click background → survey view
- Lesson node → `/curriculum/[level]/[slug]` (existing lesson pages)

## Data

Reuse production hub queries — no fixtures:

| Need | Source |
|------|--------|
| Lessons / levels | `getAllLessons()`, `LEVELS`, `levelIds` |
| Continue | `getContinueLesson` when signed in; first lesson when signed out |
| Progress | `countCompletedInLevel`, `listCompletedLessons`, `getStreak` |
| Signed-out | Open-path honesty copy (curriculum stays open; sign-in saves progress) |

## Files

| Path | Role |
|------|------|
| `src/app/(learner)/curriculum2/page.tsx` | Server data load + composition |
| `src/app/(learner)/curriculum2/layout.tsx` | Force sidebar collapsed for this segment |
| `src/components/curriculum2/intro-strip.tsx` | Intro strip |
| `src/components/curriculum2/path-board.tsx` | Board + focus state (client) |
| `src/components/curriculum2/level-region.tsx` | One level region + lesson nodes |
| `src/components/ui/app-shell.tsx` / `sidebar.tsx` | Minimal prop/helper to force collapsed on this route |

Do **not** rewrite `src/app/(learner)/curriculum/page.tsx` or `curriculum-levels-panel.tsx` for this experiment.

## Visual & motion (Phosphor)

- Tokens only: `bg-bg` / `bg-paper` / `bg-elevated` / brand utilities — no purple continue slab, no one-off brand hex
- Level accents via existing `bg-level-00`…`03`, kept quiet
- Board = atmosphere + regions, not a card corridor

**Motion (2–3 intentional):**

1. Region focus expand/dim
2. Soft breathe / pulse on “you are here”
3. Subtle intro CTA hover / enter

**Mobile:** Intro strip stacks; CTA full-width. Board becomes a vertical stack of regions (still spatial, not accordion chrome); tap to focus; no drag-pan required.

## Shell detail

`AppShell` currently has no `defaultCollapsed` prop; sidebar collapse is localStorage-only (`ascend:sidebar-collapsed`). For `/curriculum2`, add a **minimal** force-collapsed path (layout prop or tiny client helper) so the experiment opens with sidebar out. Do not break other routes’ stored preference permanently if avoidable — prefer route-scoped force while mounted on `/curriculum2`.

## Success criteria

- Opening `/curriculum2` feels like surveying a path map, not a dashboard of cards
- Continue/Start uses real progress data (or open-path defaults when signed out)
- Light + dark both read correctly under Phosphor
- Production `/curriculum` unchanged

## Verification

- [ ] `/curriculum2` loads under AppShell with topbar; sidebar collapsed
- [ ] Four level regions visible; focus expands lessons; nodes link to real lessons
- [ ] Continue/Start hits correct lesson for signed-in and signed-out
- [ ] No purple hero; tokens only; light + dark check
- [ ] `/curriculum` still matches pre-experiment behavior
