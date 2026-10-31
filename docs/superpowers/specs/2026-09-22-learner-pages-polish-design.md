# Learner pages consistency polish (Approach 2)

**Date:** 2026-09-22  
**Status:** implemented  
**Scope:** Visual/layout consistency across AppShell learner pages — no new features, no deep honesty rewiring beyond removing dead teasing UI.

## Goals

1. One **page header contract** for hub pages (Continue, Curriculum, Progress, Profile, Settings, Achievements, Bookmarks, Playground, Shellforge).
2. Fix **double sticky chrome** on Lesson + Practice vs AppTopbar.
3. Remove or disarm **dead teasing UI** that looks interactive but does nothing.
4. Align spacing / max-width / title scale so the app feels one product.

## Non-goals

- New features (bookmark DB, badge engine, theme application).
- Marketing homepage redesign.
- Rewriting Practice quiz logic or Shellforge grader.
- Mobile hamburger nav.

## Page header contract

Create `src/components/ui/page-header.tsx`:

```tsx
type PageHeaderProps = {
  eyebrow?: string;       // e.g. "Learn / Curriculum" or "You / Settings"
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
};
```

**Defaults for hub pages:**

| Token | Value |
|-------|--------|
| Outer main | `flex-1 px-5 py-8 sm:px-10` |
| Content width | `mx-auto w-full max-w-[1200px]` |
| Eyebrow | `font-mono text-xs text-ink-fainter` with `Learn /` or `You /` + accent segment |
| H1 | `font-display text-[28px] font-extrabold tracking-[-0.032em] sm:text-[32px]` |
| Description | `text-[15px] text-ink-secondary` |

**Eyebrow map**

| Page | Eyebrow |
|------|---------|
| Continue | `Learn / Continue` |
| Curriculum | `Learn / Curriculum` |
| Practice | (focus chrome — no PageHeader) |
| Playground | `Learn / Playground` |
| Progress | `You / Progress` |
| Profile | optional — hero may keep name as title; add subtle eyebrow above hero or skip |
| Settings | `You / Settings` |
| Achievements | `You / Achievements` |
| Bookmarks | `You / Bookmarks` |
| Shellforge | keep linked path breadcrumb (special case) |

**Exceptions**

- **Lesson:** keep in-lesson sticky context bar; do not use PageHeader.
- **Practice:** keep session sticky bar; do not use PageHeader.
- **Profile / Shellforge heroes:** keep hero blocks; normalize outer `max-w-[1200px]` and main padding only.

## Double sticky fix

AppTopbar is `h-[72px]` sticky.

**Lesson** (`curriculum/[level]/[slug]/page.tsx`) and **Practice**:

- Change in-page sticky header from `top-0` → `top-[72px]` (sit under AppTopbar).
- Adjust any `top-[70px]` sticky side rails / `scroll-mt` to `top-[144px]` or `scroll-mt-[144px]` (72+70) where needed.
- Remove inert mobile logo button in lesson header if it has no handler (or link it to `/curriculum`).

Alternative rejected for this pass: hiding AppTopbar on lesson/practice (inconsistent shell).

## Dead / teasing UI

| Location | Action |
|----------|--------|
| Playground “New file” | Disable stays; add `title`/`aria` explaining not available, or hide button |
| Playground “Save to Bookmarks” | Change to non-button copy: “Bookmarks aren’t saved yet” or remove CTA |
| Settings danger reset/delete | Keep visible; ensure copy says not wired (if missing) |
| Curriculum continue glyph `*p` | Replace with lesson order number (zero-padded) |

## Small alignment fixes

- Practice main `py-9` → `py-8` to match hubs.
- Progress / Bookmarks adopt PageHeader + 1200 max-width.
- Dashboard (Continue) widen from 960 → 1200 and use PageHeader.
- Indentation cleanup only where touching a file.

## Out of scope (note only)

- Practice complete screen fake “12” streak / badge — honesty pass later (B).
- Applying theme/accent from settings.

## Verification

- [ ] Hub pages share max-width 1200 + PageHeader pattern (except noted)
- [ ] Lesson + Practice context bars sit under AppTopbar (no overlap)
- [ ] Playground has no fake Save/New affordance that looks live
- [ ] Curriculum continue card shows real concept number
- [ ] `npm run lint` + `npm run build` pass

## File touch list

- Create: `src/components/ui/page-header.tsx`
- Modify: dashboard, curriculum map, playground, progress, profile (padding/width), settings-client, achievements, bookmarks, shellforge page (width), lesson page, practice page
