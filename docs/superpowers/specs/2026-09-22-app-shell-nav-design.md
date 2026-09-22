# App shell + Start CTA (Approach 2)

**Date:** 2026-09-22  
**Status:** superseded by single `(learner)` layout (2026-09-22) — AppShell mounts once for all learner routes.  
**Approved approach:** Shared AppShell + restored/organized nav; Start → curriculum map

## Goals

1. **Start the path** lands on `/curriculum` (map first), not lesson 1.
2. **One universal learner chrome** — same sidebar + topbar across curriculum, lessons, continue, practice, playground, progress, profile, settings, shellforge, achievements, bookmarks.
3. **Sidebar feels complete and organized** — restore the fuller original set, grouped clearly, without re-promoting demos as the spine.
4. Use the **Next.js App Router layout** pattern so pages stop each mounting their own shell.

## Non-goals

- Building a real badge/bookmarks engine.
- Enforcing lesson locks.
- Changing marketing SiteHeader on `/`, `/community`, `/privacy`, `/terms` (those stay marketing chrome).
- Mobile hamburger redesign (desktop sidebar remains primary; existing md:hidden behavior stays unless trivial).

## Start CTA

| Surface | Primary CTA | Destination |
|---------|-------------|-------------|
| Landing header “Start the path” | Primary | `/curriculum` |
| Hero “Start the path” | Primary | `/curriculum` |
| Final CTA “Start the path” | Primary | `/curriculum` |
| Hero secondary | Keep | `/curriculum` is redundant — change secondary to **Start lesson 1** → first lesson URL, or drop secondary if both would hit curriculum |
| Onboarding “Start learning” | Keep lesson 1 | First-lesson deep link is fine after onboarding |
| Signed-in Continue | Unchanged | `getContinueLesson` / `/dashboard` resume |

**Constant:** Export `CURRICULUM_HREF = "/curriculum"` from homepage header (or a small `src/lib/routes.ts`) and use it for Start CTAs. Keep `FIRST_LESSON_HREF` for explicit “lesson 1” links only.

## Navigation model

### Sidebar groups

**Learn** (primary)

| Label | Href | Notes |
|-------|------|--------|
| Curriculum | `/curriculum` | Map — default Start target |
| Continue | `/dashboard` | Resume / signed-out start helper |
| Practice | `/practice` | Optional drills |
| Playground | `/playground` | Scratchpad |

**You** (account / progress)

| Label | Href | Notes |
|-------|------|--------|
| Progress | `/progress` | Real completions when signed in |
| Profile | `/profile` | Identity + continue |

**More** (secondary visual weight — smaller label or muted section)

| Label | Href | Notes |
|-------|------|--------|
| Achievements | `/achievements` | Catalog / preview — honesty copy already on page |
| Bookmarks | `/bookmarks` | Not DB-backed — honesty copy already on page |

Footer card stays: guest → Sign in; signed-in → compact profile link (avoid duplicating Profile if both show — prefer footer as identity only, Profile in You group).

Settings: reachable from profile page / topbar avatar menu only (no Settings row required in sidebar unless already linked from profile).

### Active state

- `pathname.startsWith(href)` as today.
- Special-case: `/curriculum/[level]/[slug]` highlights **Curriculum** (not Continue).
- `/projects/shellforge*` can highlight Curriculum (capstone sits on the path) or no Learn item — prefer Curriculum.

### Collapse

- Single `localStorage` key `ascend:sidebar-collapsed` (existing).
- Lesson and practice routes may **default collapsed** when no stored preference — via shared shell prop or segment config, not divergent sidebar forks.
- Same component instance tree from layout → consistent width spacer + fixed aside.

## Next.js shell architecture

### New shared layout component

`src/components/ui/app-shell.tsx` (server or client wrapper):

```tsx
// Conceptual
export function AppShell({
  children,
  defaultSidebarCollapsed = false,
  streakDays = null,
}: {
  children: React.ReactNode;
  defaultSidebarCollapsed?: boolean;
  streakDays?: number | null;
}) {
  return (
    <div className="flex min-h-screen bg-radial-wash text-ink">
      <AppSidebar defaultCollapsed={defaultSidebarCollapsed} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar streakDays={streakDays} />
        <main className="flex-1 ...">{children}</main>
      </div>
    </div>
  );
}
```

Streak on topbar: either pass from layouts that can load session + streak, or load streak inside a small server `AppTopbarSlot` — prefer **server layout fetches streak once** when user exists and passes down, to avoid every page duplicating queries.

### Route wiring (preferred)

Consolidate AuthProvider + shell:

1. Keep or extend `(app)/layout.tsx` as AuthProvider + optional shell for routes already under `(app)`.
2. **Curriculum + practice** currently have separate AuthProvider layouts and each page mounts sidebar. Move shell into:
   - `src/app/curriculum/layout.tsx` — AuthProvider + AppShell (`defaultSidebarCollapsed` true for `[level]/[slug]` only if we can detect segment; else default false on index, collapsed on lesson via nested layout).
   - Nested `src/app/curriculum/[level]/[slug]/layout.tsx` — `defaultSidebarCollapsed` when no localStorage yet.
   - `src/app/practice/layout.tsx` — AuthProvider + AppShell collapsed default.
3. Strip duplicate `<AppSidebar />` / `<AppTopbar />` / outer flex wrappers from individual pages.

**Playground / Shellforge** live under `(app)` — use `(app)/layout.tsx` to wrap children in AppShell so those pages drop local chrome.

If `(app)/layout` wraps AppShell, pages under `(app)` must not double-wrap. Curriculum/practice stay outside `(app)` today for routing reasons — they get the same `AppShell` via their layouts (shared component, not shared parent if route groups differ).

### Pages to strip chrome from (non-exhaustive)

- `dashboard`, `progress`, `profile`, `settings` client, `bookmarks`, `achievements`
- `playground`, `projects/shellforge` (+ result; submit may stay modal-like without full shell or use shell)
- `curriculum/page`, `curriculum/[level]/[slug]/page`
- `practice/page`

## Visual / UX notes for sidebar

- Restore section labels: **Learn**, **You**, **More** (not Path/Optional).
- **More** section: slightly quieter (smaller type or `text-ink-fainter` labels) so Achievements/Bookmarks don’t compete with Curriculum.
- Keep collapsible control and profile footer.
- No return of fake XP / streak in sidebar body.

## Honesty

- Do not reintroduce fake progress in chrome.
- Achievements / Bookmarks remain reachable and labeled as preview on their pages; nav may stay quiet but visible under More.

## Verification

- [ ] Landing Start → `/curriculum`
- [ ] Lesson 1 still reachable from curriculum map / optional secondary CTA
- [ ] Sidebar groups match table on `/curriculum`, a lesson page, `/dashboard`, `/practice`, `/playground`
- [ ] Collapse preference persists across those routes
- [ ] Signed-in topbar streak only when streak > 0 (existing behavior)
- [ ] `npm run lint` + `npm run build` pass
- [ ] Community / homepage still use SiteHeader (no AppSidebar)

## Out of scope follow-ups

- Onboarding goal persistence
- Mobile nav parity
- Moving curriculum into `(app)` route group (optional later cleanup)
