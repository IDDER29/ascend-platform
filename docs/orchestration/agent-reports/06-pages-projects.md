# Agent J — Projects (Shellforge)

**Role:** Projects / Shellforge (Wave 2)  
**Date:** 2026-09-22  
**Scope:** `/projects/shellforge`, `/projects/shellforge/submit`, `/projects/shellforge/result`, and `src/components/projects/*`  
**Method:** Read-only audit; no application code changes.  
**Context:** Wave 1 reports (`01-product-objectives.md`, `02-architecture.md`) — Shellforge is the curriculum north-star capstone; schema includes `shellforge_submissions` but pages do not use it.

---

## End-to-end project flow

Shellforge is the **Level 03 capstone** (“Build your own shell in C”). It sits **outside the MDX lesson chain**: after the last Level 03 lesson, `getLessonNavigation` returns no `next` lesson; the intended successor is this project (`src/lib/content/lessons.ts`, comment lines 71–72).

```
Curriculum / marketing
  └─ Level 03 complete (level-complete) ──► /projects/shellforge  (brief)
  └─ ⌘K command palette ───────────────────► /projects/shellforge
  └─ Profile “Projects” fixture ─────────────► brief + result (passed)

/projects/shellforge (brief)
  ├─ Self-track requirements checklist (client state)
  ├─ “Start project” / sidebar CTA ────────► /projects/shellforge/submit
  └─ “Clone starter repo” ───────────────────► demo notice only (no repo)

/projects/shellforge/submit
  ├─ User enters repo URL (local state only; not sent forward)
  └─ “Simulate: all checks pass” | “needs fixes”
        └── router.push ──► /projects/shellforge/result?outcome=passed|failed

/projects/shellforge/result
  ├─ Renders static PASSED_GROUPS or FAILED_GROUPS from query param
  ├─ Fixture submission metadata (repo, commit, attempt, dates)
  ├─ passed: rewards (+800 XP, Shell Architect), build log, PeerSolutions
  └─ failed: fix hint, resubmit → submit, lesson link (pipes), community CTA
```

**Entry points (outside this agent’s page files but part of the product story):**

| Source | Target | Evidence |
|--------|--------|----------|
| Last level in `level-complete/[level]` when no next level | `/projects/shellforge` | `src/app/level-complete/[level]/page.tsx` lines 64–71 |
| Command palette | Brief + pre-baked passed result | `src/components/command-palette.tsx` lines 30–31 |
| Profile demo projects | Brief + `outcome=passed` result | `src/app/(app)/profile/page.tsx` `PASSED_PROJECTS` |
| Notifications fixture | Result (passed) | `src/lib/notifications-data.ts` |
| Homepage curriculum preview | “Build Shellforge” topic only (no route) | `src/components/homepage/curriculum-preview.tsx` |

**Platform placement:** All three routes live under `src/app/(app)/`, so `(app)/layout.tsx` runs `getCurrentUser()` and wraps `AuthProvider` (`02-architecture.md`). There is **no middleware auth gate** — unsigned visitors can still hit these URLs; sidebar/topbar fall back to demo user when session is absent (same as other `(app)` pages).

**Honesty model (aligned with README):** The flow is a **high-fidelity UX prototype** of clone → auto-grade → resubmit → unlock peers. Copy explicitly disclaims real cloning, grading, starter repo, and DB persistence.

---

## Per-route inventory

### `/projects/shellforge`

| Field | Detail |
|-------|--------|
| **Purpose** | Present the capstone brief: requirements, milestones, resources, and CTAs to submit or (fictionally) clone a starter repo. |
| **Key files** | Page: `src/app/(app)/projects/shellforge/page.tsx` (RSC: hero + shell). Component: `src/components/projects/shellforge-brief.tsx` (`"use client"`). Shared chrome: `AppSidebar`, `AppTopbar`, `Card`. |
| **Data source** | **Static in source:** hero stats (+800 XP, ~6h, “2,140” completed), `REQUIREMENTS`, `MILESTONES`, `STARTER_FILES`, `RESOURCES` (external man7.org links). **Client state:** checklist `checked` map; `cloneNotice` toggle. No MDX, no API, no DB. |
| **Real vs stub** | **Real:** Navigation, layout, requirement copy, working external doc links, interactive checklist and progress sidebar. **Stub:** All completion counts and “2,140 completed” are decorative; checklist does not gate submit; “Clone starter repo” shows demo notice; peer block on brief is blurred placeholder until “Submit to unlock” (unlock is not tied to actual pass state). Sidebar copy claims “auto-checked in ~30s” — not implemented. |
| **Risks / gaps** | (1) Checklist progress **lost on refresh** — no `localStorage` or DB. (2) **No link from last lesson page** — learners must discover Shellforge via level-complete, palette, or profile. (3) Level 03 is `locked: true` in content schema but Shellforge route has **no completion/lock guard**. (4) “Start project” goes to submit, not an external repo or in-app editor. (5) Marketing mentions **Corelib** alongside Shellforge with **no `/projects/*` route**. |
| **Severity** | **medium** — core pedagogical payoff is documented in UI but backend and curriculum wiring are incomplete; misleading “auto-checked” line is **low** if README/limitations are read, **medium** for casual users. |

---

### `/projects/shellforge/submit`

| Field | Detail |
|-------|--------|
| **Purpose** | Collect a repository URL and branch to a **simulated** grader outcome (pass vs fail). |
| **Key files** | `src/app/(app)/projects/shellforge/submit/page.tsx` (`"use client"` only — no page-level sidebar/topbar). `Card`, `Link`, `useRouter`. |
| **Data source** | **Client state:** `repoUrl` string. **Navigation:** `router.push` with query `outcome=passed` \| `failed`. Repo URL is **never** passed to the result page (no query, no storage). |
| **Real vs stub** | **Real:** Form validation (submit disabled until non-empty URL), explicit demo disclaimer (lines 43–47, 31–33). **Stub:** No server action, no clone/build/test; buttons only pick the result template. |
| **Risks / gaps** | (1) **UX inconsistency:** full-screen centered card without `AppSidebar`/`AppTopbar` unlike brief and result — feels like a modal, easy to lose app context. (2) Still under `(app)` layout (session read cost) but **no AuthProvider consumers** on this page. (3) Any URL string passes; no GitHub URL validation. (4) **`shellforge_submissions` table unused** — no attempt counter or history. |
| **Severity** | **low** for intentional demo (disclosed); **medium** if product expectation is real submission pipeline. |

---

### `/projects/shellforge/result`

| Field | Detail |
|-------|--------|
| **Purpose** | Show auto-grader-style results, remediation, rewards, and (on pass) peer solutions — driven entirely by `?outcome=`. |
| **Key files** | `src/app/(app)/projects/shellforge/result/page.tsx` (async RSC; `searchParams` Promise). `src/components/projects/peer-solutions.tsx` (client; shown only when passed). `AppSidebar`, `AppTopbar`, `Card`. |
| **Data source** | **Static modules in page file:** `PASSED_GROUPS`, `FAILED_GROUPS` (test matrices, failure notes, scores 90 vs 68). **Query param:** `outcome` — `passed` unless `outcome=failed` (default/missing ⇒ pass). **Fixture sidebar:** repo `github.com/you/shellforge`, commits, dates, attempt #. **PeerSolutions:** hard-coded `SOLUTIONS` array; sort reorders client-side only. |
| **Real vs stub** | **Real:** Rich, pedagogically useful pass/fail narratives (pipe EOF, SIGINT notes); links to `/curriculum/level-03-systems-software/pipes-and-inter-process-communication`, `/community`, `/achievements`, resubmit. **Stub:** No connection to submitted URL; XP/badge/totals on pass card are fixture (“2,600 XP total · Level 8”); build output and fix diff are static fiction; peer cards’ “Read code” has **no href** (non-functional). |
| **Risks / gaps** | (1) **Spoiler / cheat path:** anyone can open `?outcome=passed` without submit (command palette links directly). (2) **No persistence** — “progress is saved” on fail copy is false. (3) **Rewards not wired** to `badges_earned` or profile despite “Shell Architect” in `src/lib/achievements-data.ts`. (4) Default pass when param omitted may surprise if linked without query. |
| **Severity** | **medium** — excellent teaching UI undermined by no grader/DB and spoiler-friendly URLs; **low** for disclosed demo scope. |

---

## Components (`src/components/projects/`)

| Component | Used on | Role | Real vs stub |
|-----------|---------|------|--------------|
| `shellforge-brief.tsx` | Brief page | Requirements checklist, milestones, locked peer teaser, sticky submit panel, starter file list, man pages | Checklist + clone notice: client-only; peers locked UI is static |
| `peer-solutions.tsx` | Result (passed only) | Three peer cards, sort tabs | Static data; cards not linked to repos |

No other files under `src/components/projects/` in this repo.

---

## Data layer readiness (not used by pages)

From `src/lib/db/schema.pg.ts` (mirrored in SQLite):

```text
shellforge_submissions: id, user_id, repo_url, outcome, attempt, submitted_at
```

No imports of `shellforgeSubmissions` in app routes or server actions (grep confirms schema/DDL only). Aligns with Agent A: learner progress tables exist for future wiring (`02-architecture.md` § DB).

---

## Domain summary

**Shellforge** is Ascend’s **capstone project surface**: it turns Level 03 systems concepts into a concrete “build a shell in C” assignment with requirements aligned to REPL, exec, builtins, pipes, redirection, signals, and optional quoting. The product treats it as the **final step after four levels** (result copy: “finished all four levels”). Implementation priority was **credible learner UX** — brief, submit, graded result, peer gallery, cross-links to curriculum and community — while deferring **auto-grader, starter template hosting, submission storage, XP/badge side effects, and curriculum `next` link** to a later backend milestone. The README and in-app copy are largely **honest** about simulation; a few strings (auto-check timing, “progress is saved,” peer unlock rules) still read as production behavior.

---

## Top risks (prioritized)

| # | Risk | Severity | Notes |
|---|------|----------|-------|
| 1 | **No real grader or submission persistence** — entire capstone is outcome simulation | **high** (product) / **low** (if “demo” is accepted) | Schema ready; zero app wiring |
| 2 | **Curriculum discontinuity** — last L03 lesson has no `next` → Shellforge; no in-curriculum project card | **medium** | Discovery relies on level-complete, ⌘K, profile fixtures |
| 3 | **Spoiler paths** — palette and direct URL to passed result + unlocked peers without building | **medium** | Undermines “submit to unlock” narrative on brief |
| 4 | **Fixture rewards** — +800 XP / Shell Architect / profile project row not tied to actual pass | **medium** | Same class of gap as dashboard XP (Wave 1 P report) |
| 5 | **Submit page isolation** — no app chrome; repo URL discarded before result | **low** | UX polish and future API contract |
| 6 | **Corelib** teased on homepage, no project route | **low** | Product scope ambiguity |
| 7 | **No route-level auth or level lock** | **low** | Consistent with rest of `(app)` shell; capstone content is public once URL is known |

---

## Cross-references

- Product capstone intent & stub classification: `docs/orchestration/agent-reports/01-product-objectives.md` (Shellforge row, lesson chain gap).
- `(app)` session boundary, unused `shellforge_submissions`: `docs/orchestration/agent-reports/02-architecture.md`.
- Authoritative product wording: `README.md` (Shellforge under “Done UI, honestly fake”; Known limitations).
