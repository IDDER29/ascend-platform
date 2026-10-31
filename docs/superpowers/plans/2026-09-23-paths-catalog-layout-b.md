# Paths catalog Layout B Implementation Plan

> **For agentic workers:** Implement task-by-task. Spec: `docs/superpowers/specs/2026-09-23-paths-catalog-layout-b-design.md`

**Goal:** Restructure `/paths` into on-ramp strip + equal role gallery cards while keeping header CTA, outline meta, and closing tip.

**Architecture:** Page composes catalog helpers; `path-catalog.tsx` exports on-ramp chip + gallery card; data stays in `catalog.ts`.

**Tech stack:** Next.js App Router, React Server Components, Phosphor tokens, existing `PageHeader` / `Button` / `pathOutlineMeta`.

## File map

| File | Role |
|------|------|
| `src/components/paths/path-catalog.tsx` | `PathOnrampChip`, `PathGalleryCard` (replace foundation-tile + role-row as catalog UI) |
| `src/app/(learner)/paths/page.tsx` | Layout B composition |
| `src/lib/paths/catalog.ts` | Unchanged (reuse `pathOutlineMeta`, `pathHref`, `pathSelectHref`) |

## Task 1: Catalog UI primitives

- Replace Layout A components with:
  - `PathOnrampChip` — compact on-ramp hit target
  - `PathGalleryCard` — equal role card for gallery grid
- Live/soon contrast per spec; whole control → `href`
- Run: `npx eslint src/components/paths/path-catalog.tsx`

## Task 2: Page composition

- Header + CTA (keep)
- On-ramp strip from `getFoundationPaths()`
- Gallery grid from `getRolePaths()` (2-col `sm+`)
- Closing beat (keep)
- Run: eslint on page + catalog; spot-check `/paths` light + dark

## Done when

- Roles gaze as equal cards; Foundations obvious via CTA + strip + tip
- No detail-page changes; lint clean
