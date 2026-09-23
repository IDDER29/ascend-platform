# App shell / shared SiteFooter (Odin-style)

**Date:** 2026-09-23  
**Status:** Approved for planning  
**Surface:** Marketing + all learner `AppShell` pages

## Goal

Establish one shared footer across Ascend — landing/marketing and signed-in dashboard chrome — modeled on The Odin Project’s established multi-column footer, using only real Ascend destinations and Phosphor tokens.

## Decisions

| Choice | Decision |
|--------|----------|
| Scope | All `AppShell` pages (Continue, Curriculum, lessons, Practice, etc.) **and** existing marketing usages |
| Approach | Expand existing `SiteFooter`; mount once in `AppShell` |
| Links | Honest only — no Team / Blog / FAQ until those pages exist |
| Socials | Constants file; render icon only when URL is non-empty |
| Lesson chrome | Keep `LessonFooter` (prev/next); site footer sits below as shell chrome |

## Architecture

```
AppShell
  AppSidebar
  column
    AppTopbar
    {children}          ← page / lesson (includes LessonFooter when applicable)
    SiteFooter          ← new mount point

Marketing (landing, community, privacy, terms)
  …existing layout…
  SiteFooter            ← same component (already imported)
```

- Footer lives in the **content column** (right of sidebar), not full-bleed under the sidebar.
- `(learner)` routes get the footer from `AppShell` only — no per-page duplicate.
- Marketing routes outside `(learner)` keep their own `<SiteFooter />` import (no double with shell).

## Content map

**Brand**

- Ascend mark + short tagline (community-built / open-source education).

**Social** (`src/lib/brand/social.ts` or equivalent)

- Keys e.g. `github`, `discord`, (optional later: `x`, `facebook`).
- Default empty string; UI skips empty entries.

**Columns**

| Column | Links |
|--------|--------|
| Learn | Curriculum (`/curriculum`), Paths (`/paths`), Practice (`/practice`), Playground (`/playground`) |
| Community | Community (`/community`), Support us (`/#open`) |
| Account | Continue (`/dashboard`), Progress (`/progress`), Profile (`/profile`), Sign in, Create account, Start learning — **one link set** for marketing and AppShell (no `variant` prop) |
| Legal | Privacy (`/privacy`), Terms (`/terms`) |

**Bottom bar**

- `© 2026 Ascend · Free & open source`
- Existing secondary tagline line

## Visual

- Phosphor: `border-card-border`, `bg-bg/50`, `text-ink` / `ink-secondary` / `ink-muted` / `ink-faint`
- Odin-like density: brand + optional socials + multi-column nav + bottom legal strip
- Responsive: multi-column desktop; 2-col / stacked mobile
- No cards, no purple, no new visual system — evolve current `SiteFooter`

## Layout behavior

- Shell remains `min-h-screen` flex column; main content `flex-1` so short pages still push footer down.
- Long pages: footer after scroll content.
- Collapsed sidebar / FOUC CSS: unchanged; footer does not participate in sidebar width hacks.

## Out of scope

- New destination pages (Team, Blog, Success Stories, FAQ, Guides)
- Filling real social URLs (leave constants empty until product provides them)
- Redesign of `LessonFooter`
- Footer under the sidebar (full viewport width)

## Files (expected)

| File | Change |
|------|--------|
| `src/components/homepage/footer.tsx` | Expand to Odin-style columns + socials |
| `src/lib/brand/social.ts` (new) | Optional social URL constants |
| `src/components/ui/app-shell.tsx` | Render `<SiteFooter />` after children |
| Landing / community / privacy / terms | Keep existing `<SiteFooter />` (visual upgrade via shared component) |

## Success criteria

- Refresh `/dashboard`, `/curriculum`, a lesson page, `/practice`: footer present, Phosphor-correct, no double footer.
- Landing / community / privacy / terms: updated shared footer, no regressions.
- Empty social constants → no empty social icons.
- Lesson prev/next footer still works; site footer below it.
