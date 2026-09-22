# App Shell + Start CTA Implementation Plan

> **For agentic workers:** Inline execution in this session (user said go).

**Goal:** Start → `/curriculum`; shared AppShell; sidebar Learn / You / More.

**Architecture:** Shared `AppShell` in `(app)`, `curriculum`, and `practice` layouts. Sidebar restores full nav with groups. Pages drop local chrome. Lesson/practice auto-collapse when no stored preference.

**Tech Stack:** Next.js App Router, existing AppSidebar/AppTopbar, AuthProvider.

## Global Constraints

- Start primary CTA → `/curriculum` only
- No fake XP in chrome
- Marketing SiteHeader stays on `/`, community, privacy, terms
- Lint + build must pass

---

### Task 1: Routes + Start CTAs
### Task 2: Sidebar Learn / You / More + auto-collapse
### Task 3: AppShell + layouts
### Task 4: Strip per-page chrome
### Task 5: Lint + build
