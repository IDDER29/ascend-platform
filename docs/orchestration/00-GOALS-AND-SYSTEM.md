# Ascend Platform — Agent Orchestration System

**Date:** 2026-09-22  
**Purpose:** Deep project understanding via specialized agents with separate roles, run in waves, then synthesized into one report.

---

## 1. Goals (what success looks like)

| # | Goal | Success criteria |
|---|------|------------------|
| G1 | **Understand the product object** | Clear statement of what Ascend is, who it serves, and what “done” means today |
| G2 | **Map the architecture** | Auth, DB, content pipeline, layouts, and data flow explained without guessing |
| G3 | **Inventory every route/page** | Each page has purpose, key components, real vs stub behavior, risks |
| G4 | **Surface gaps & risks** | Honest stubs, security concerns, UX debt, missing wiring called out with severity |
| G5 | **Produce durable docs** | Orchestration definition + per-agent reports + master synthesis under `docs/orchestration/` |

**Non-goals:** Rewriting features, changing code, or “fixing” findings in this pass (audit-only unless a follow-up asks for fixes).

---

## 2. Orchestration model

```
Coordinator (this session)
    │
    ├─ Wave 1 (foundation — parallel)
    │     ├─ Agent P — Product & Objectives
    │     └─ Agent A — Architecture & Platform
    │
    ├─ Wave 2 (pages by domain — parallel)
    │     ├─ Agent M — Marketing & Auth surfaces
    │     ├─ Agent C — Curriculum & Learning
    │     ├─ Agent L — Learner App Shell
    │     └─ Agent J — Projects (Shellforge)
    │
    └─ Wave 3 (synthesis — coordinator)
          └─ Master report + gaps matrix
```

### Rules

1. **One role per agent** — no overlapping ownership of the same page set.
2. **Read, don’t rewrite** — agents inspect files and report; they do not edit app code.
3. **Evidence over opinion** — cite file paths; mark stubs vs real behavior explicitly.
4. **Wave gates** — Wave 2 starts after Wave 1 reports exist (context for “what the product is”).
5. **Coordinator synthesizes** — only the coordinator merges reports and writes the master doc.

---

## 3. Agent roster

| ID | Role | Scope | Output file |
|----|------|-------|-------------|
| **P** | Product & Objectives | README, content schema, curriculum intent, product status claims | `agent-reports/01-product-objectives.md` |
| **A** | Architecture & Platform | `lib/auth`, `lib/db`, layouts, config, session/cookies, deploy hints | `agent-reports/02-architecture.md` |
| **M** | Marketing & Auth pages | `/`, community, privacy, terms, onboarding, signin, reset/*, streak-lost, error/not-found | `agent-reports/03-pages-marketing-auth.md` |
| **C** | Curriculum & Learning | `/curriculum`, lesson pages, practice, level-complete | `agent-reports/04-pages-curriculum.md` |
| **L** | Learner App Shell | dashboard, progress, profile, settings, achievements, bookmarks, playground (+ `(app)` layout) | `agent-reports/05-pages-learner-app.md` |
| **J** | Projects | shellforge brief / submit / result | `agent-reports/06-pages-projects.md` |
| **S** | Synthesizer (coordinator) | Merge all reports | `99-MASTER-PROJECT-REPORT.md` |

---

## 4. Per-page report template (Wave 2)

Each page entry must include:

- **Route**
- **Purpose** (one sentence)
- **Key files** (page + main components)
- **Data source** (MDX, DB, static mock, client state)
- **Real vs stub**
- **Risks / gaps** (if any)
- **Severity** (`none` | `low` | `medium` | `high`)

---

## 5. Execution log

| Wave | Status | Notes |
|------|--------|-------|
| Goals & system documented | **done** | this file |
| Wave 1 | **done** | Agents P + A → `01`, `02` |
| Wave 2 | **done** | Agents M + C + L + J → `03`–`06` |
| Wave 3 | **done** | Master → `99-MASTER-PROJECT-REPORT.md` |

---

## 6. Page ownership map

| Agent | Routes |
|-------|--------|
| M | `/`, `/community`, `/privacy`, `/terms`, `/onboarding`, `/signin`, `/reset`, `/reset/expired`, `/reset/new-password`, `/streak-lost`, `error`, `not-found` |
| C | `/curriculum`, `/curriculum/[level]/[slug]`, `/practice`, `/level-complete/[level]` |
| L | `/dashboard`, `/progress`, `/profile`, `/settings`, `/achievements`, `/bookmarks`, `/playground` |
| J | `/projects/shellforge`, `/projects/shellforge/submit`, `/projects/shellforge/result` |
