# Paths catalog — Layout C (featured start + equal paths)

**Date:** 2026-09-23  
**Status:** Approved (user chose direction 1)  
**Supersedes:** Layout B gallery-only / how-to band on `/paths`  
**Related:** `docs/superpowers/specs/2026-09-23-paths-catalog-design.md`, Phosphor theme

## Goal

Odin-shaped path map. A new student sees a clear first move; every path (including Foundations) remains an equal destination in the grid.

## Layout

```
[ Header — short thesis; optional quiet CTA or none if hero carries Start ]
[ FEATURE: Foundations — body, meta, Start + Explore ]
[ All paths — equal tiles including Foundations + Python + 4 roles ]
```

### Featured Foundations

- Only the **live** Foundations path (`foundations`)
- Full-width inviting block (not a demoted chip)
- **Start** → first lesson (`pathSelectHref`)
- **Explore** → `/paths/foundations`
- Short hint that this is the shared on-ramp for systems paths — not a tutorial checklist

### Equal path grid

- All entries from `PATHS` (6), same tile chrome
- Foundations included again so it is not “only a hero”
- Tile (stretched link) → path detail
- Button: **Start** / **Start path** if live+selectable; **Preview** if soon
- Live stronger; soon quieter
- Meta via `pathOutlineMeta`

### Explicitly out

- “How to choose” instructional band
- Chip strip that demotes Foundations
- Dual section “Foundations / Roles” that reads like old Layout A

## Success

- First viewport answers “where do I start?”
- Grid answers “what can I choose?”
- Foundations is both featured and a peer path
- Phosphor; lint clean
