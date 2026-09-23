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

### `/paths` (catalog) — Layout A

1. Header: **All paths** + short thesis  
2. Section **Start here** — Foundations + Python Foundations as **2 compact side-by-side tiles** (whole tile clickable)  
3. Section **Then choose a learning path** — four **full-width role rows** (title + short body + status; whole row clickable; no fat bordered card corridor)  
4. Live rows stronger; soon rows quieter + “Coming soon”  
5. Links → `/paths/[slug]`

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

| Card | Body (locked) |
|------|----------------|
| Foundations | Hands-on first principles — how a bit becomes a decision, and what you'll lean on before systems paths. |
| Python Foundations | The Python on-ramp for applied AI — language basics you'll need before RAG, agents, and LLM apps. |
| Systems Programmer | Understand the machine and write C that touches it — through systems software and a working shell. |
| Linux Engineer | From distro and shell to VMs and containers — run and ship real Linux systems bone to bone. |
| Network Engineer | How machines talk — protocols, stacks, and the paths packets take. |
| AI Engineer | Build with LLMs — RAG, agents, contract decoding, and applied AI systems. |

Header lead: *Start with the right foundations, then choose the role you're training for.*

## Files

| Path | Role |
|------|------|
| `src/lib/paths/catalog.ts` | All path defs, courses, status, href helpers |
| `src/components/paths/path-catalog.tsx` | Foundation tiles + role rows (Layout A) |
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
