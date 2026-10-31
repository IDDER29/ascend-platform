# Practice flashcards (active recall) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add handcrafted flashcards to the mixed Practice queue with Reveal → Again/Hard/Good/Easy, extend SM-2 to four grades, keep MCQ auto-mapped to Again/Good.

**Architecture:** Discriminated `PracticeItem` bank; pure `gradeCard` gains hard/easy; session UI branches on `kind`; `applyGrades` accepts explicit grades (MCQ still maps boolean). Same due store and unlock rules.

**Tech Stack:** TypeScript, Next.js App Router, React, Tailwind/Phosphor, `npx tsx --test`.

## Global Constraints

- Phosphor only — no purple; no XP/streaks/mastery claims
- Mixed Due/Study queue — no Quiz vs Flashcards mode picker
- MCQ: wrong→again, correct→good (no Hard/Easy UI)
- Flashcard: Reveal then again|hard|good|easy
- Handcrafted flashcards only (not derived from MCQ options)
- Hit rate / results: Good+Easy = correct; Again+Hard (+ MCQ wrong) = miss
- Typed / cloze / explain out of this plan

## File map

| File | Role |
|------|------|
| `src/lib/practice/types.ts` | `PracticeItem` union; deprecate bare `PracticeQuestion` alias |
| `src/lib/practice/bank.ts` / `bank-flashcards.ts` | MCQ migrate + flashcard seeds |
| `src/lib/practice/sm2.ts` + `sm2.test.ts` | 4-grade SM-2 |
| `src/lib/practice/cards.ts` + tests | `applyGrades` with optional grade |
| `src/lib/practice/session.ts` | Use `PracticeItem` |
| `src/components/practice/practice-home.tsx` | Flashcard panel + finishSession grades |
| `src/lib/practice/demo.ts` | Demo includes a flashcard |
| Spec | `docs/superpowers/specs/2026-09-25-practice-flashcards-active-recall-design.md` |

---

### Task 1: Types + migrate bank to `kind: "mcq"` + flashcard seeds

**Files:**
- Modify: `src/lib/practice/types.ts`
- Modify: `src/lib/practice/bank.ts`
- Create: `src/lib/practice/bank-flashcards.ts`
- Modify: spec Status → Implementing

**Interfaces:**
- Produces: `PracticeItem`, `McqItem`, `FlashcardItem`; `PRACTICE_BANK: PracticeItem[]`
- `export type PracticeQuestion = McqItem` **deprecated alias** OR replace all imports with `PracticeItem` / narrow where needed

- [ ] **Step 1: Types**

```ts
export type PracticeItemBase = {
  id: string;
  lessonLevel: string;
  lessonSlug: string;
  conceptId: string;
  reviewLabel: string;
  hint?: string;
};

export type McqItem = PracticeItemBase & {
  kind: "mcq";
  prompt: string;
  code?: string[];
  options: string[];
  correct: number;
};

export type FlashcardItem = PracticeItemBase & {
  kind: "flashcard";
  front: string;
  frontCode?: string[];
  back: string;
};

export type PracticeItem = McqItem | FlashcardItem;
```

- [ ] **Step 2: Add `kind: "mcq"` to every existing bank object**

- [ ] **Step 3: Author `bank-flashcards.ts`** — 8–15 cards, Foundations-first (`level-00-bits-logic` and any already-mapped lessons). Example shape:

```ts
{
  kind: "flashcard",
  id: "bits-fc-01",
  front: "What is a bit?",
  back: "The smallest unit of information — a value that is either 0 or 1.",
  reviewLabel: "What is a bit?",
  lessonLevel: "level-00-bits-logic",
  lessonSlug: /* real slug from curriculum */,
  conceptId: "bit",
  hint: "Think binary, not bytes.",
}
```

Use **real** `lessonSlug` values that exist in the curriculum map (grep content or path-map). Prefer concept definitions, operator meanings, “what does X mean” — not trick recognition.

- [ ] **Step 4: Export** `PRACTICE_BANK = [...MCQ, ...FLASHCARDS]`

- [ ] **Step 5: `npx tsc --noEmit`** — fix session/home imports to `PracticeItem` and type guards (`item.kind === "mcq"`)

- [ ] **Step 6: Commit**

```bash
git commit -m "feat(practice): discriminated bank with flashcard seeds"
```

---

### Task 2: Four-grade SM-2 + applyGrades

**Files:**
- Modify: `src/lib/practice/sm2.ts`, `sm2.test.ts`
- Modify: `src/lib/practice/cards.ts`, `cards.test.ts`

**Interfaces:**
- `PracticeGrade = "again" | "hard" | "good" | "easy"`
- `applyGrades(userId, answers: { questionId: string; grade: PracticeGrade }[], now?)`

- [ ] **Step 1: Failing tests** for Hard/Easy (new + review) per spec table

- [ ] **Step 2: Implement `gradeCard` branches** exactly as spec §2

- [ ] **Step 3: Update `applyGrades`** to take `grade` (not only boolean). Keep a helper:

```ts
export function gradeFromMcqCorrect(correct: boolean): PracticeGrade {
  return correct ? "good" : "again";
}
```

- [ ] **Step 4: Fix call sites** in `practice-home` finishSession to build grade list

- [ ] **Step 5: Run** `npx tsx --test src/lib/practice/sm2.test.ts src/lib/practice/cards.test.ts`

- [ ] **Step 6: Commit**

```bash
git commit -m "feat(practice): SM-2 Again/Hard/Good/Easy grades"
```

---

### Task 3: Flashcard session UI + results + hub copy

**Files:**
- Modify: `src/components/practice/practice-home.tsx`
- Modify: `src/lib/practice/demo.ts` (and demo sample session to include a flashcard id)
- Modify: page description if needed
- Spec Status → Done

**Interfaces:**
- Session state: for flashcards track `revealed: boolean`; on grade, push `{ questionId, grade }` and advance
- MCQ unchanged except finishSession uses `gradeFromMcqCorrect`

- [ ] **Step 1: Flashcard panel**

```tsx
// Pseudocode structure
{item.kind === "flashcard" ? (
  <>
    <h2>{item.front}</h2>
    {item.frontCode ? <CodeBlock lines={item.frontCode} /> : null}
    {!revealed ? (
      <Button onClick={() => setRevealed(true)}>Reveal answer</Button>
    ) : (
      <>
        <p className="…">{item.back}</p>
        <div className="flex flex-wrap gap-2">
          {(["again","hard","good","easy"] as const).map((g) => (
            <Button key={g} variant={g === "good" ? "default" : "secondary"}
              onClick={() => onFlashGrade(g)}>
              {label[g]}
            </Button>
          ))}
        </div>
      </>
    )}
  </>
) : ( /* existing MCQ */ )}
```

Use existing Button variants; Phosphor tokens only.

- [ ] **Step 2: Answered model** — extend from `{ questionId, correct }` to store grade (or derive `correct = grade === "good" || grade === "easy"` for results/history missIds)

- [ ] **Step 3: Results + hit rate** — miss = again|hard|mcq-wrong; hub description one recall-focused sentence

- [ ] **Step 4: Demo** — include at least one flashcard id in `sampleSession`

- [ ] **Step 5: `npx tsc --noEmit` + smoke `/practice?demo=1`

- [ ] **Step 6: Spec Done; commit**

```bash
git commit -m "feat(practice): flashcard reveal and four-grade UI"
```

---

## Spec coverage

| Requirement | Task |
|-------------|------|
| Discriminated bank + handcrafted cards | 1 |
| 4-grade SM-2 + MCQ map | 2 |
| Mixed session flashcard UI | 3 |
| Results / hit rate definition | 3 |
| Roadmap only for typed/cloze/explain | Spec (no code) |

## Self-review

- No TBD in steps; Hard/Easy arithmetic matches spec table  
- `PracticeItem` replaces `PracticeQuestion` in session types  
- applyGrades signature change is explicit so MCQ call sites don’t silently break  
