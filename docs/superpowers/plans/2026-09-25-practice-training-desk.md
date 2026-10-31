# Practice training desk Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Practice feel elite and motivating via a shared “training desk” visual system (home → drill-in → session) plus honest momentum — without XP/streak theater or IA changes.

**Architecture:** Pure momentum helpers on existing session history; shared Tailwind class tokens for desk materials; redesign `PracticeHub` Due stage + Training rail; quiet heat on drill-in headers/CTAs; cool session chrome + warmer results. No SM-2 / bank / tree route changes.

**Tech Stack:** TypeScript, Next.js App Router, React, Tailwind, Phosphor tokens, `npx tsx --test`, existing `animate-rise` in `globals.css`.

## Global Constraints

- Phosphor only — green/teal/gold heat; no purple inventing; legacy `brand-violet` class OK (values are green)
- No XP, levels, streak flames, confetti, mastery claims
- Due primary on home; Path → section → lesson IA unchanged
- Hub max 960 (`HUB_CONTENT_CLASS`); session/results max 640
- Momentum from existing `PracticeSessionRecord[]` + cards — no new DB tables
- Motions: Due rise-in, path row hover sheen, session progress tick only

## File map

| File | Role |
|------|------|
| `src/lib/practice/momentum.ts` | `cardsClearedToday`, `sessionsThisWeek`, `trainingMomentum` |
| `src/lib/practice/momentum.test.ts` | Unit tests |
| `src/components/practice/practice-desk.ts` | Shared class-name tokens (wash, stage, CTA punch) |
| `src/components/practice/practice-home.tsx` | Hub Due stage, Training rail, drill-in heat, SessionView chrome, ResultsView |
| Spec | Status Implementing → Done |

---

### Task 1: Momentum helpers + desk style tokens

**Files:**
- Create: `src/lib/practice/momentum.ts`
- Create: `src/lib/practice/momentum.test.ts`
- Create: `src/components/practice/practice-desk.ts`
- Modify: `docs/superpowers/specs/2026-09-25-practice-training-desk-design.md` (Status → Implementing)

**Interfaces:**
- Consumes: `PracticeSessionRecord` from `@/lib/practice/history`; `localDayKey` from `@/lib/practice/sm2` if useful for day boundaries
- Produces:
  ```ts
  export type TrainingMomentum = {
    cardsClearedToday: number; // sum of session.total for sessions with local day === today
    sessionsThisWeek: number;  // distinct sessions with at >= start of local week (Mon 00:00 or Sun — pick Mon)
    nextReviewLabel: string | null; // pass-through helper optional; may stay in hub
  };
  export function cardsClearedToday(sessions: PracticeSessionRecord[], now?: Date): number;
  export function sessionsThisWeek(sessions: PracticeSessionRecord[], now?: Date): number;
  export function trainingMomentum(sessions: PracticeSessionRecord[], now?: Date): TrainingMomentum;
  ```
  ```ts
  // practice-desk.ts — string constants only
  export const DESK_WASH_HOME = "..."; // soft phosphor wash for home stage
  export const DESK_WASH_QUIET = "..."; // whisper for drill-in
  export const DESK_STAGE = "..."; // stage shell (not promo card)
  export const DESK_STUDY_PUNCH = "..."; // strong Study CTA wrapper if needed
  export const DESK_ROW_SHEEN = "..."; // group-hover sheen on path rows
  ```

- [ ] **Step 1: Write failing tests for momentum**

```ts
// src/lib/practice/momentum.test.ts
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  cardsClearedToday,
  sessionsThisWeek,
  trainingMomentum,
} from "./momentum";
import type { PracticeSessionRecord } from "./history";

function session(
  partial: Partial<PracticeSessionRecord> & { at: string; total: number },
): PracticeSessionRecord {
  return {
    id: partial.id ?? `s_${partial.at}`,
    at: partial.at,
    scopeType: "due",
    scopeLabel: "Due",
    pathSlug: "foundations",
    correct: partial.correct ?? partial.total,
    total: partial.total,
    missIds: [],
    questionIds: [],
  };
}

it("cardsClearedToday sums totals for sessions on the local calendar day", () => {
  const now = new Date("2026-09-25T15:00:00");
  const sessions = [
    session({ at: "2026-09-25T10:00:00", total: 5 }),
    session({ at: "2026-09-25T12:00:00", total: 3 }),
    session({ at: "2026-09-24T22:00:00", total: 10 }),
  ];
  assert.equal(cardsClearedToday(sessions, now), 8);
});

it("sessionsThisWeek counts sessions from local Monday 00:00 through now", () => {
  // 2026-09-25 is a Friday; Monday is 2026-09-21
  const now = new Date("2026-09-25T15:00:00");
  const sessions = [
    session({ id: "a", at: "2026-09-22T10:00:00", total: 2 }),
    session({ id: "b", at: "2026-09-24T10:00:00", total: 2 }),
    session({ id: "c", at: "2026-09-20T10:00:00", total: 2 }), // Sunday before Mon
  ];
  assert.equal(sessionsThisWeek(sessions, now), 2);
});

it("trainingMomentum packages both metrics", () => {
  const now = new Date("2026-09-25T15:00:00");
  const m = trainingMomentum(
    [session({ at: "2026-09-25T10:00:00", total: 4 })],
    now,
  );
  assert.equal(m.cardsClearedToday, 4);
  assert.equal(m.sessionsThisWeek, 1);
});
```

- [ ] **Step 2: Run tests — expect FAIL (module missing)**

```bash
npx tsx --test src/lib/practice/momentum.test.ts
```

Expected: FAIL cannot find module `./momentum`

- [ ] **Step 3: Implement momentum.ts**

```ts
import type { PracticeSessionRecord } from "./history";

function startOfLocalDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** Local Monday 00:00 of the week containing `d`. */
function startOfLocalWeekMonday(d: Date): Date {
  const day = d.getDay(); // 0 Sun .. 6 Sat
  const diff = day === 0 ? 6 : day - 1;
  const mon = startOfLocalDay(d);
  mon.setDate(mon.getDate() - diff);
  return mon;
}

export function cardsClearedToday(
  sessions: PracticeSessionRecord[],
  now = new Date(),
): number {
  const start = startOfLocalDay(now).getTime();
  const end = start + 86_400_000;
  return sessions.reduce((sum, s) => {
    const t = new Date(s.at).getTime();
    if (Number.isNaN(t) || t < start || t >= end) return sum;
    return sum + s.total;
  }, 0);
}

export function sessionsThisWeek(
  sessions: PracticeSessionRecord[],
  now = new Date(),
): number {
  const start = startOfLocalWeekMonday(now).getTime();
  const end = now.getTime();
  const ids = new Set<string>();
  for (const s of sessions) {
    const t = new Date(s.at).getTime();
    if (Number.isNaN(t) || t < start || t > end) continue;
    ids.add(s.id);
  }
  return ids.size;
}

export type TrainingMomentum = {
  cardsClearedToday: number;
  sessionsThisWeek: number;
};

export function trainingMomentum(
  sessions: PracticeSessionRecord[],
  now = new Date(),
): TrainingMomentum {
  return {
    cardsClearedToday: cardsClearedToday(sessions, now),
    sessionsThisWeek: sessionsThisWeek(sessions, now),
  };
}
```

- [ ] **Step 4: Add practice-desk.ts tokens**

Use Phosphor tokens only. Example shape (tune visually in Task 2):

```ts
/** Shared Practice training-desk class tokens — Phosphor only. */
export const DESK_WASH_HOME =
  "bg-[radial-gradient(ellipse_at_top_left,color-mix(in_oklab,var(--xp-bg)_85%,transparent),transparent_55%)]";
export const DESK_WASH_QUIET =
  "bg-[radial-gradient(ellipse_at_top_left,color-mix(in_oklab,var(--xp-bg)_40%,transparent),transparent_50%)]";
export const DESK_STAGE =
  "relative overflow-hidden rounded-[20px] border border-divider/80 px-5 py-6 sm:px-7 sm:py-7";
export const DESK_ROW_SHEEN =
  "transition-colors hover:bg-elevated/70 group-hover:[&_.desk-sheen]:opacity-100";
```

- [ ] **Step 5: Spec Status → Implementing**

- [ ] **Step 6: Run tests + tsc**

```bash
npx tsx --test src/lib/practice/momentum.test.ts
npx tsc --noEmit
```

Expected: all momentum tests PASS; tsc exit 0

- [ ] **Step 7: Commit**

```bash
git add src/lib/practice/momentum.ts src/lib/practice/momentum.test.ts \
  src/components/practice/practice-desk.ts \
  docs/superpowers/specs/2026-09-25-practice-training-desk-design.md
git commit -m "$(cat <<'EOF'
feat(practice): training momentum helpers and desk tokens

EOF
)"
```

---

### Task 2: Home Due stage + Training rail

**Files:**
- Modify: `src/components/practice/practice-home.tsx` (`PracticeHub` only — Due section ~870–960, Paths polish ~962–1038, aside ~1129–1210)
- Consume: `trainingMomentum` from `@/lib/practice/momentum`; tokens from `@/components/practice/practice-desk`

**Interfaces:**
- Consumes: existing `PracticeHub` props unchanged
- Produces: same `onStart` callbacks; visual + rail copy only

- [ ] **Step 1: Due stage redesign**

Replace the current `border-xp-border/60 bg-xp-bg` promo-tile section with desk stage:

- Wrapper: `cn(DESK_STAGE, DESK_WASH_HOME, "animate-rise")`
- Eyebrow mono: keep Due now / Caught up
- Display headline: bump to ~28–32px on sm (`text-[26px] sm:text-[30px]`) — Due owns emotion; keep page header short
- Oversized due count remains visual anchor (48–56px display)
- Primary CTA unchanged behavior (`due` / `all`)
- Remove “card farm” feel: avoid heavy `bg-xp-bg` fill as the whole tile; wash sits on paper/desk

- [ ] **Step 2: Paths denser + sheen**

- Slightly tighter padding (`py-3` / `gap-3`)
- Apply `DESK_ROW_SHEEN` / quiet hover; keep Link → `/practice/[pathSlug]`
- Custom lessons stay one dashed quiet row (no layout competition)

- [ ] **Step 3: Training rail**

Rename header from “Hit rate” block + “Recent” to a unified **Training** rail:

```tsx
const momentum = useMemo(() => trainingMomentum(history), [history]);
```

Rail order:
1. Section title **Training** + one-line “Correct ÷ seen — not a schedule”
2. Stats row (mono): `Cleared today · N` · `Sessions · N this week` · next review if available
3. Hit rate list (existing `pathProgressFromHistory`)
4. Recent (existing slice)

Empty copy: “Study once and training stats land here.”

- [ ] **Step 4: tsc**

```bash
npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
git add src/components/practice/practice-home.tsx
git commit -m "$(cat <<'EOF'
feat(practice): elite Due stage and Training rail on home

EOF
)"
```

---

### Task 3: Drill-in path/section heat

**Files:**
- Modify: `src/components/practice/practice-home.tsx` — `PathDrillInPanel` / `SectionDrillInPanel` (or whatever names exist around the path/section UI ~609–787)
- Consume: `DESK_WASH_QUIET`, `DESK_STUDY_PUNCH` / stage tokens

**Interfaces:**
- Consumes: existing drill-in view models + `onStart`
- Produces: same scopes; stronger Study CTA presence

- [ ] **Step 1: Header block**

- Optional quiet wash behind header (`DESK_WASH_QUIET`)
- Title + quiet due count unchanged meaning
- Study CTA: use primary `Button` size `md` (already) — ensure visual punch via surrounding spacing/weight, not a second hero competing with home

- [ ] **Step 2: Lists denser**

- Tighten row padding; Continue hover; mono meta unchanged
- Breadcrumbs stay mono/thin (if present on pages — leave page.tsx alone unless class tweak needed)

- [ ] **Step 3: tsc + smoke paths**

```bash
npx tsc --noEmit
# Manual: /practice/foundations and a section URL still Start sessions
```

- [ ] **Step 4: Commit**

```bash
git add src/components/practice/practice-home.tsx
git commit -m "$(cat <<'EOF'
feat(practice): quieter desk heat on path and section drill-in

EOF
)"
```

---

### Task 4: Session chrome + warmer results

**Files:**
- Modify: `src/components/practice/practice-home.tsx` — `SessionView` (~1224+) and `ResultsView` (~1715+)

**Interfaces:**
- Consumes: existing session props (`questions`, `index`, `answered`, grades callbacks)
- Produces: same grade wiring; UI chrome only

- [ ] **Step 1: Session top chrome**

Keep 640 column. Replace or augment the dot strip header with thin meta:

- Left: Exit
- Center: mono `n / N` (1-based index) + optional quiet session hit so far  
  `hits = answered.filter(a => gradeIsHit(a.grade)).length` → show `hits/answered.length` only when `answered.length > 0`
- Scope label: if available from parent, pass `scopeLabel?: string` into SessionView; otherwise omit (don’t invent)

Prefer simplifying the 20px dot strip if it fights calm focus — either keep a thinner progress bar OR keep dots but smaller. Spec: thin chrome — prefer `n/N` + slim track over large dots.

Example slim track:

```tsx
<div className="h-1 flex-1 overflow-hidden rounded-full bg-elevated">
  <div
    className="h-full rounded-full bg-brand-gradient transition-[width] duration-300"
    style={{ width: `${((index + (answered[index] ? 1 : 0)) / questions.length) * 100}%` }}
  />
</div>
```

- [ ] **Step 2: Grade feedback**

- Good / primary advance: strongest text weight (already)
- Tiny tick: optional `animate-rise` on advancing card wrapper key={q.id} — no confetti

- [ ] **Step 3: Results warmer wrap-up**

- Soft wash or slightly stronger display for session hit rate
- Keep Back / Study again actions
- No XP copy

- [ ] **Step 4: tsc + practice tests**

```bash
npx tsc --noEmit
npx tsx --test src/lib/practice/*.test.ts
```

Expected: all pass

- [ ] **Step 5: Commit**

```bash
git add src/components/practice/practice-home.tsx
git commit -m "$(cat <<'EOF'
feat(practice): cool session chrome and warmer results desk

EOF
)"
```

---

### Task 5: Spec Done + verify

**Files:**
- Modify: `docs/superpowers/specs/2026-09-25-practice-training-desk-design.md`

- [ ] **Step 1: Mark Status Done; check success criteria**

- [ ] **Step 2: Manual smoke**

- `/practice` — Due stage → Paths → Training rail reads as one composition  
- `/practice/foundations` (+ section) — Study punch, quieter heat  
- Start session — cool chrome; finish — warmer results  
- Confirm no XP/streak/confetti  

- [ ] **Step 3: Full verify**

```bash
npx tsc --noEmit
npx tsx --test src/lib/practice/*.test.ts
```

- [ ] **Step 4: Commit**

```bash
git add docs/superpowers/specs/2026-09-25-practice-training-desk-design.md
git commit -m "$(cat <<'EOF'
docs: mark Practice training desk spec Done

EOF
)"
```

---

## Spec coverage

| Spec requirement | Task |
|------------------|------|
| Shared visual system / tokens | 1 |
| Momentum helpers (cleared today / sessions week) | 1 |
| Home Due stage + Paths + Training rail | 2 |
| Drill-in quieter heat + Study punch | 3 |
| Session cool + results warm | 4 |
| Success criteria / Done | 5 |
| Out: IA / SM-2 / formats / weak / personal | — (untouched) |
