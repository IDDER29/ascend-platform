# Hub width 960 + Practice study polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make AppShell learner hubs share 960px max width and polish Practice into a calmer study desk (Continue hover grammar, quieter hub, focused session/results) without changing SM-2.

**Architecture:** Change `HUB_CONTENT_CLASS` to 960 and alias `HUB_NARROW_CLASS` to the same string. Polish only `practice-home.tsx` (+ tiny demo bar if needed) and one Phosphor doc note. No new components unless a shared class string is clearly duplicated.

**Tech Stack:** Next.js App Router, React, Tailwind, Phosphor tokens.

## Global Constraints

- Learner hub max width: `max-w-[960px]` via `HUB_CONTENT_CLASS`
- AppShell hubs only — not marketing `--layout-max`, not lesson ~724 column
- Practice session/results stay `max-w-[640px]` centered
- Hover grammar: soft `bg-elevated` + chevron `ink-fainter` → `ink`; **no** translate / scale / shadow lift / violet title flash on rows
- SM-2 behavior, bank, and card store unchanged
- Phosphor only — no purple; prefer tokens over raw hex when touching option states

## File map

| File | Role |
|------|------|
| `src/components/ui/page-header.tsx` | Width tokens |
| `docs/design/PHOSPHOR-THEME.md` | One hub-width note |
| `src/components/practice/practice-home.tsx` | Hub + session + results polish |
| `src/components/practice/practice-demo-bar.tsx` | Hover only if needed |
| Spec status | `docs/superpowers/specs/2026-09-25-hub-width-practice-polish-design.md` |

---

### Task 1: Hub width → 960

**Files:**
- Modify: `src/components/ui/page-header.tsx`
- Modify: `docs/design/PHOSPHOR-THEME.md` (short note under surfaces / layout)
- Modify: spec Status → Implementing

**Interfaces:**
- Produces: `HUB_CONTENT_CLASS` and `HUB_NARROW_CLASS` both `"mx-auto w-full max-w-[960px]"`

- [ ] **Step 1: Update tokens**

```ts
/** Standard content width for AppShell learner hubs (Continue / Practice / Paths / …). */
export const HUB_CONTENT_CLASS = "mx-auto w-full max-w-[960px]";

/**
 * Alias of `HUB_CONTENT_CLASS` — kept for existing imports (e.g. dashboard).
 * Prefer `HUB_CONTENT_CLASS` on new pages.
 */
export const HUB_NARROW_CLASS = HUB_CONTENT_CLASS;
```

(If string equality is preferred for tree-shaking clarity, duplicate the same literal string in both constants.)

- [ ] **Step 2: Doc note** in `PHOSPHOR-THEME.md` near hub surfaces — one row/bullet: AppShell hub content max = 960 via `HUB_CONTENT_CLASS`; marketing still `--layout-max`.

- [ ] **Step 3: Spec Status → Implementing**

- [ ] **Step 4: Smoke** — open `/dashboard` and `/practice` (or `?demo=1`); both content columns should feel the same width.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/page-header.tsx docs/design/PHOSPHOR-THEME.md docs/superpowers/specs/2026-09-25-hub-width-practice-polish-design.md
git commit -m "feat(ui): set learner hub max width to 960"
```

---

### Task 2: Practice hub polish

**Files:**
- Modify: `src/components/practice/practice-home.tsx` (`PracticeHub` + empty panel only)

**Interfaces:**
- Consumes: existing hub props; no data API changes

- [ ] **Step 1: Path rows — Continue hover grammar**

In deck list buttons:
- Keep `hover:bg-elevated/70` (or `/60`–`/80` to match Continue)
- Change trailing “Study” + chevron: resting `text-ink-fainter`; `group-hover:text-ink`
- **Remove** `group-hover:translate-x-0.5` on the chevron SVG
- Do not change title to violet on hover

- [ ] **Step 2: Lesson picker + rail recent**

- Lesson checkbox rows: `hover:bg-elevated/70` (already partially present — align opacity)
- Recent session / miss links: same fill hover; no translate

- [ ] **Step 3: Due band calm**

- Soften or remove the floating blur orb if it reads as noise
- If H2 and primary CTA both say “Study due cards”, shorten H2 to something like “Ready to review” / keep CTA as the action label (pick one clear pair — don’t invent new product claims)
- Keep due count + next-review honesty

- [ ] **Step 4: Visual smoke** `/practice?demo=1` ready view — rows hover quietly; no chevron slide

- [ ] **Step 5: Commit**

```bash
git add src/components/practice/practice-home.tsx
git commit -m "style(practice): calm hub rows and due band"
```

---

### Task 3: Session / results polish + done

**Files:**
- Modify: `src/components/practice/practice-home.tsx` (session + results)
- Modify: `src/components/practice/practice-demo-bar.tsx` only if hover clashes
- Modify: spec Status → Done

**Interfaces:**
- No SM-2 / session builder changes

- [ ] **Step 1: MCQ options**

Before check:
- Unselected hover: `hover:bg-elevated/70` + `hover:border-divider` (or soft xp tint that does not equal selected)
- Selected: keep `border-xp-border bg-xp-bg` — hover must not override selected
- Prefer token greens for correct/wrong after check if swapping hex is one-line; otherwise leave checked colors if already shipping

Example pattern:

```tsx
let stateClass = checked
  ? /* existing checked branches */
  : isSelected
    ? "border-xp-border bg-xp-bg"
    : "border-divider bg-paper hover:bg-elevated/70";
```

- [ ] **Step 2: Results miss rows**

Ensure lesson links use `hover:bg-elevated/70` (or `/60`) without translate; quiet score/meta mono.

- [ ] **Step 3: Exit / Hint**

Keep secondary; `hover:text-ink` only — no new chrome.

- [ ] **Step 4: Verify**

```bash
npx tsc --noEmit
```

Manual: `/practice?demo=1` → ready hover → session options → results links. Confirm dashboard + practice share width.

- [ ] **Step 5: Spec Status → Done; commit**

```bash
git add src/components/practice/practice-home.tsx src/components/practice/practice-demo-bar.tsx docs/superpowers/specs/2026-09-25-hub-width-practice-polish-design.md
git commit -m "style(practice): session and results study polish"
```

---

## Spec coverage

| Requirement | Task |
|-------------|------|
| HUB_CONTENT / NARROW = 960 | 1 |
| AppShell hubs only | 1 |
| Path/lesson/recent hover grammar | 2 |
| No translate/scale/shadow on rows | 2–3 |
| Due band calm + copy | 2 |
| Session/results 640 + option hover | 3 |
| SM-2 unchanged | Global |

## Self-review

- No TBD placeholders
- Hover opacities aligned to Continue (`/60`–`/80`)
- Width change is one token — pages need no per-file width edits
