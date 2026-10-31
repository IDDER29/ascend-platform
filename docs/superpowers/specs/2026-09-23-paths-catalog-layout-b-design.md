# Paths catalog — Layout B (path gallery)

**Date:** 2026-09-23  
**Status:** Approved  
**Supersedes catalog layout in:** `docs/superpowers/specs/2026-09-23-paths-catalog-design.md` § Layout A (catalog surface only)  
**Related:** `docs/design/PHOSPHOR-THEME.md`, locked path copy in the original paths catalog spec

## Goal

`/paths` is an Odin-shaped **path map**: the student gazes at available paths, understands Foundations as the on-ramp when needed, and chooses any path (foundations or role) they want. Clarity over density.

## Locked decisions

| Decision | Choice |
|----------|--------|
| Primary job | Present paths so the student can **choose a track** |
| Layout | **B — Path gallery** (equal cards for foundations + roles) |
| Keep from prior polish | Header CTA (**Start Foundations**), outline meta, closing tip |
| Foundations placement | **Same gallery card weight** as roles (not chips); grouped under Foundations |
| Gallery contents | 2 foundation cards + 4 role cards |
| Detail pages | Unchanged |
| Progress / continue | Out of scope this pass |

## Catalog data (unchanged)

- Foundations: `foundations` (live), `python-foundations` (soon)
- Roles: `systems-programmer` (live), `linux-engineer`, `network-engineer`, `ai-engineer` (soon)
- Locked body copy from original paths catalog spec

## Page structure (`/paths`)

Top → bottom:

1. **Header** — thesis + **Start Foundations** CTA  
2. **How to choose** — guidance band (new? → Foundations; know role? → pick it; click card vs Start button)  
3. **Choose a path** — single gallery of **all six paths** as equal **action cards**  
4. No demoted chip strip; Foundations are full paths with optional “Best if you're new” hint  

### Action card

- Whole card clickable → `/paths/[slug]` (explore)  
- Separate **button** above the hit layer: **Start** / **Start path** (live) or **Preview** (soon)  
- Live: brand edge + action bar; Soon: quieter  
- Meta: lessons/courses/requires

## Components

| Piece | Behavior |
|-------|----------|
| `PathActionCard` | Equal weight for foundations + roles; stretched link to detail; real `Button` for Start/Preview |
| How-to-choose band | New-student clarity only — not a second catalog |
| Live vs soon | Live: brand edge + stronger action bar; Soon: muted + Preview |
| Phosphor | Tokens only; no purple |

## Non-goals

- Retarget landing/sidebar
- Change `/paths/[slug]` detail layouts
- Progress, streak, or continue chrome on catalog
- Reordering catalog data or rewriting locked path body copy
- Separate Platform/Docker path

## Success

- Student can scan **all six paths** as equal destinations (foundations + roles)
- Foundations are not demoted to chips — same card chrome as roles
- Live/soon contrast clear at a glance
- Meta shows course/lesson shape + requires
- Light + dark Phosphor-correct; lint clean
