# Ascend Platform — Master Project Report

**Date:** 2026-09-22  
**Orchestration:** See `00-GOALS-AND-SYSTEM.md`  
**Sources:** Agent reports 01–06 (Product, Architecture, Marketing/Auth, Curriculum, Learner App, Projects)

---

## Executive summary

**Ascend** is an open-source, bottom-up computer-science learning platform: **4 levels, 24 real MDX lessons**, a polished Next.js UI, and **real email/password accounts** (bcrypt + JWT cookie) against SQLite locally or Postgres/Supabase in production.

The **curriculum and marketing shell are production-quality**. The **engagement layer** (XP, streaks, badges, bookmarks, settings persistence, Shellforge grading) is largely a **high-fidelity demo** backed by fixture “Amine” data — even after a real sign-in. Database tables for progress exist but are mostly unused by pages.

**One-line verdict:** Strong learning content product with a real auth foundation; post-login “learner OS” still sells a story the backend does not keep yet.

---

## Goals checklist (orchestration G1–G5)

| Goal | Status |
|------|--------|
| G1 Understand product object | **Met** — Agent P |
| G2 Map architecture | **Met** — Agent A |
| G3 Inventory every route | **Met** — Agents M, C, L, J |
| G4 Surface gaps & risks | **Met** — consolidated below |
| G5 Durable docs | **Met** — this folder |

---

## What Ascend is (product object)

| Aspect | Reality |
|--------|---------|
| Promise | Bit → C → systems → working shell (Shellforge capstone) |
| Users | Self-paced learners (fundamentals, C/systems, exam prep, explorers) |
| Content | 24 MDX files, Zod-validated frontmatter, SSG lesson pages |
| Engagement | XP, streaks, badges, practice, bookmarks — **mostly fixtures** |
| Accounts | **Real** sign-up/sign-in; OAuth and password-reset email are stubs |
| Capstone | Shellforge UX is rich; **no real clone/grader** |

---

## Architecture snapshot

```
Marketing / Lessons (SSG)     ← no cookie read in root layout (by design)
         │
Curriculum index              ← session + AuthProvider
         │
(app)/* shell                 ← session + AuthProvider (dashboard, etc.)
         │
Auth: bcrypt + jose JWT cookie (`ascend_session`)
DB:   DATABASE_URL → Postgres | else SQLite + DDL bootstrap
```

**Key quirks:**

- No `middleware.ts` — routes are not auth-gated at the edge.
- Lesson pages and `/practice` use `AppSidebar` **without** `AuthProvider` → signed-in users still see demo **“Amine”**.
- Build uses `next build --webpack` (Turbopack + `next/font` regression workaround).

---

## Route inventory (condensed)

| Domain | Routes | Solid | Stub / fixture |
|--------|--------|-------|----------------|
| **M** Marketing & Auth | `/`, community, legal, onboarding, signin, reset/*, streak-lost, errors | Homepage, legal, **real sign-in/up**, error/404 UX | Community local-only; full reset flow; onboarding not persisted; OAuth buttons |
| **C** Curriculum | curriculum, lessons, practice, level-complete | 24 MDX lessons, nav, KC, finish-level | Progress/locks cosmetic; practice = one drill; CodeLab canned |
| **L** Learner app | dashboard, progress, profile, settings, achievements, bookmarks, playground | Session on shell; playground honesty; ⌘K | XP/streaks/badges/settings/bookmarks not DB-backed |
| **J** Projects | shellforge ×3 | Brief/submit/result pedagogy UI | No grader/DB; URL spoiler to “passed” |

Full per-page detail: `agent-reports/03`–`06`.

---

## Cross-cutting risk matrix

| ID | Risk | Severity | Domains |
|----|------|----------|---------|
| R1 | **“Progress saves as you go”** vs no `lesson_progress` wiring | **high** | P, M, C, L |
| R2 | **Post-login dashboard/settings** show Amine fixtures; settings don’t persist profile | **high** | L, A |
| R3 | **Password reset** looks complete but doesn’t change credentials / session | **high** (if treated as prod) | M |
| R4 | **Shellforge** has no real grader/submission persistence | **high** (product) | J |
| R5 | Lesson/practice **outside AuthProvider** (demo sidebar identity) | **medium** | A, C |
| R6 | Curriculum **locks are UI-only** (deep links work) | **medium** | C |
| R7 | Bookmarks: lesson toggle ≠ `/bookmarks` ≠ DB table | **medium** | L |
| R8 | Default / weak **AUTH_SECRET** & password rules inconsistency | **medium** | A, M |
| R9 | Fragmented start CTAs (pointer lesson vs `what-is-a-bit` vs orphan onboarding) | **medium** | M |
| R10 | Serverless SQLite under `/tmp` is ephemeral | **medium** (deploy) | A |

---

## What’s genuinely strong (keep)

1. **MDX curriculum pipeline** — real content, validated frontmatter, SSG, rich lesson components.
2. **Design system / UX polish** — homepage, error pages, practice quiz interaction, Shellforge teaching UI.
3. **Auth core** — real users/profiles/streaks rows, hashed passwords, JWT cookie, dual DB backends.
4. **Honest disclaimers** in several places (playground, Shellforge submit, privacy/terms demo language).
5. **Global ⌘K command palette** over all 24 lessons.

---

## Recommended next workstreams (priority)

Not implemented in this audit — suggested follow-ups:

1. **Wire `lesson_progress` + streaks** to footer / dashboard / continue CTA; fix homepage copy until then.
2. **AuthProvider coverage** for lesson + practice layouts; greet with real `profiles.name` on dashboard.
3. **Settings → update `profiles`**; stop session-only theater.
4. **Either ship or demote password reset** (remove from funnel or implement tokens + email).
5. **Connect Shellforge** from last L03 lesson; keep demo grader labeled until real checks exist.
6. **Optional:** edge middleware for protected `(app)` routes.

---

## Orchestration execution record

| Wave | Agents | Output |
|------|--------|--------|
| 0 | Coordinator | `00-GOALS-AND-SYSTEM.md` |
| 1 | P Product, A Architecture | `01-product-objectives.md`, `02-architecture.md` |
| 2 | M Marketing/Auth, C Curriculum, L Learner, J Projects | `03`–`06` page reports |
| 3 | Coordinator synthesizer | **this file** |

**Method:** Parallel specialized agents (isolated roles, read-only), wave-gated, coordinator merge. No application code was changed during the audit.

---

## Doc index

| File | Contents |
|------|----------|
| `00-GOALS-AND-SYSTEM.md` | Goals, roles, ownership map, rules |
| `agent-reports/01-product-objectives.md` | Product object & status |
| `agent-reports/02-architecture.md` | Stack, auth, DB, render model |
| `agent-reports/03-pages-marketing-auth.md` | Public + auth routes |
| `agent-reports/04-pages-curriculum.md` | Lessons + practice |
| `agent-reports/05-pages-learner-app.md` | Dashboard shell |
| `agent-reports/06-pages-projects.md` | Shellforge |
| `99-MASTER-PROJECT-REPORT.md` | This synthesis |
