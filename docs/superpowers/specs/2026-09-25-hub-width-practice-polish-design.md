# Hub width 960 + Practice study polish

**Date:** 2026-09-25  
**Status:** Done
**Routes:** AppShell learner hubs (shared width); `/practice` (study polish)  
**Chosen approach:** One hub width token (`HUB_CONTENT` → 960) + Practice full study pass  
**Builds on:** `2026-09-25-practice-study-desk-layout-design.md`, `2026-09-25-dashboard-list-row-hover-design.md`, `2026-09-25-practice-sm2-phase-c-design.md`

## Goal

Learner hubs share the **Continue/dashboard max width (960px)** so the main stage feels consistent. Practice gets a **calm study-desk polish** — Continue-style hover grammar, quieter composition, session/results focus — without changing SM-2 behavior.

## Decisions (locked)

| Topic | Choice |
|-------|--------|
| Shared width | **960px** (`max-w-[960px]`) |
| Scope of width | **AppShell learner hubs only** — not marketing/landing/auth, not lesson reading column |
| Practice depth | **Full study pass** — hub + session/results + copy/rhythm |
| Hover | Continue list-row grammar — no lift/scale/shadow/violet title flash |
| Session column | Stay **640px** centered inside the hub |

## 1. Shared hub width

### Token change

In `src/components/ui/page-header.tsx`:

- Set `HUB_CONTENT_CLASS = "mx-auto w-full max-w-[960px]"`
- Keep `HUB_NARROW_CLASS` as the **same string** (alias) so dashboard and any narrow imports stay valid
- Comment: learner hub max is 960; prefer `HUB_CONTENT_CLASS` for new pages

### Who picks it up

Any page already wrapping with `HUB_CONTENT_CLASS` or `HUB_NARROW_CLASS` (Practice, Paths, Settings, Progress, Achievements, Bookmarks, Profile, ShellForge, Curriculum hub, Dashboard).

### Out of width change

- Marketing / landing `--layout-max` / footer
- Lesson document reading column (~724) + TOC rail
- Auth split layouts
- Practice session/results inner `max-w-[640px]`

### Docs

Note once in `docs/design/PHOSPHOR-THEME.md` (hub width) and page-header comments. Do not invent a third hub width token.

## 2. Practice study polish

### Hover grammar (all tappable rows)

Match `2026-09-25-dashboard-list-row-hover-design.md`:

| Element | Resting | Hover |
|---------|---------|--------|
| Path / lesson / recent / miss→lesson rows | transparent / existing surface | `bg-elevated/60–80` + `transition-colors` |
| Chevron / trailing icon | `text-ink-fainter` | `group-hover:text-ink` |
| MCQ options | border divider | soft elevated or xp tint; **selected** stays xp border/bg and wins over hover |
| Text links | faint | underline + `text-ink` |
| Primary `Button` | existing | unchanged |

**Forbidden on rows:** `translate`, `scale`, shadow lift, brand-violet title color flash.

### Hub composition

- **Due band:** keep mint/xp surface and primary CTA; quiet blur; due count stays; remove competing noise that fights the CTA
- **Study by path:** one list surface with hairline dividers — not a stack of separate cards per path
- **Pick lessons:** dashed expander secondary; checkbox rows share hover grammar
- **Rail:** Hit rate + Recent as quiet lists; recent rows use hover grammar; honesty labels unchanged (hit rate ≠ schedule)

At 960 the two-column desk still works: main + ~240–280px rail; stack under `lg`.

### Session / results (640)

- Option rows: selected vs hover never fight
- Hint / Exit secondary; Check primary
- Progress `n / total` mono label
- Results: score quiet; miss→lesson links as rows with hover grammar
- No streak / XP / badge chrome

### Copy / rhythm

- One job per section; shorten redundant Due headline ↔ CTA echo where both say the same thing
- Keep honest SM-2 language (“due”, “next review”)
- No new marketing SR claims beyond real `dueAt`

### Out of polish pass

- SM-2 math, card store, bank content
- New features (email, Hard/Easy, etc.)
- Rebuilding Playground

## Success criteria

- [ ] Learner hubs visually share ~960 content width (Continue and Practice align)
- [ ] Practice path/lesson/recent/option rows use Continue hover grammar
- [ ] No row translate/scale/shadow lift
- [ ] Session/results stay 640; SM-2 behavior unchanged
- [ ] Light + dark still Phosphor-correct

## Out of scope (later)

- Marketing layout max
- Shared `ListRow` component extraction across dashboard + practice (nice-to-have if duplication hurts)
- Practice empty-state redesign beyond quiet copy tweaks
