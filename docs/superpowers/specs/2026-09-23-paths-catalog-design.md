# Paths catalog — multi-path roles (Odin-shaped)

**Date:** 2026-09-23  
**Status:** Approved for implementation  
**Related:** `docs/design/PHOSPHOR-THEME.md`, `docs/design/AUTH-PATH-COPY-PLAYBOOK.md`

## Goal

`/paths` is Ascend’s future learner entry: Odin-style catalog of **role paths** + path detail pages. Phosphor feel. Not a TOP clone. Not level-ID heroes. Not curriculum2 board.

## Locked catalog

### Start here (foundations)

| Slug | Title | Status | Content |
|------|-------|--------|---------|
| `foundations` | Foundations | **Live** | L00 Bits & Logic |
| `python-foundations` | Python Foundations | **Soon** | Outline only — on-ramp for AI Engineer |

### Then choose a learning path (roles)

| Slug | Title | Requires | Status | Content |
|------|-------|----------|--------|---------|
| `systems-programmer` | Systems Programmer | Foundations | **Live** | L01 + L02 + L03 + Shellforge |
| `linux-engineer` | Linux Engineer | Foundations | **Soon** | Linux/Ubuntu/Debian, VMs, Docker & containers, bone→bone projects |
| `network-engineer` | Network Engineer | Foundations | **Soon** | Networking stack |
| `ai-engineer` | AI Engineer | Python Foundations | **Soon** | LLMs, RAG, agents, contract decoding |

**VMs + Docker:** courses inside **Linux Engineer**, not a separate path.

## Page surfaces

### `/paths` (catalog) — Layout C (current)

See **`docs/superpowers/specs/2026-09-23-paths-catalog-layout-c-design.md`**.

1. Header + short thesis  
2. **Featured Foundations** — Start + Explore (first move for new students)  
3. **All paths** — equal tiles for all six paths (Foundations included)  
4. Tile → detail; button → Start / Preview  
5. No instructional “how to choose” band; Foundations not demoted to chips

### `/paths/[slug]` (detail)

**Foundations (`/paths/foundations`) — course page (TOP rhythm):**

- Header + **Start** → first L00 lesson  
- Overview (how this course works)  
- Ordered **Lessons** list (L00 rows)  
- **Choose your path forward** → role paths that require Foundations  

**Other paths:**

- Title + overview body  
- Requires line (if any)  
- **Select path** (live) / Coming soon (soon)  
- **Courses** list with Open course or outline  
- Systems Programmer live: one course per level + Shellforge  
- Soon paths: planned course titles only  

## Copy (catalog)

Longer Odin-style bodies live in `src/lib/paths/catalog.ts` (`PATHS[].body`). Pattern: what the path is → take courses in order → outcome. Catalog cards show up to ~5 lines (`line-clamp-5`).

| Card | Intent |
|------|--------|
| Foundations | Where it all begins — hands-on bits/logic; foundations for later paths |
| Python Foundations | Python on-ramp for AI; language + tooling before RAG/agents |
| Systems Programmer | Full systems curriculum in order → Shellforge |
| Linux Engineer | Distro → VMs → containers → bone-to-bone ops |
| Network Engineer | Packets → protocols → operating networks |
| AI Engineer | LLM apps → RAG → agents → contracts |

## Files

| Path | Role |
|------|------|
| `src/lib/paths/catalog.ts` | All path defs, courses, status, href helpers |
| `src/components/paths/path-catalog.tsx` | On-ramp chips + role gallery cards (Layout B) |
| `src/components/paths/path-detail.tsx` | Detail layout (courses list) |
| `src/app/(learner)/paths/page.tsx` | Catalog |
| `src/app/(learner)/paths/[slug]/page.tsx` | Detail + `generateStaticParams` |

## Non-goals (this pass)

- Retarget landing/sidebar to `/paths`  
- Authoring full Linux/Network/AI/Python MDX  
- Deleting `/curriculum2`  
- Separate Platform/Docker path  

## Success

- Catalog shows 2 foundations + 4 roles with correct live/soon  
- Live Explore → detail → real Open course / Select path  
- Soon paths have honest outline pages  
- Phosphor; no purple; production `/curriculum` unchanged  
