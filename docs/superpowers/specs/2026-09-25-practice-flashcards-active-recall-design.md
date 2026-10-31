# Practice active recall — flashcards (slice 1)

**Date:** 2026-09-25  
**Status:** Done
**Route:** `/practice`  
**Builds on:** `2026-09-25-practice-sm2-phase-c-design.md`, hub polish  
**Chosen approach:** Discriminated bank items + shared session shell; 4-grade SM-2 under the hood  
**Later slices (not this pass):** typed short-answer · cloze · explain-this-code

## Goal

Practice should train **active recall** — retrieve from memory, then check — not only recognition among options. Slice 1 adds **flashcards** into the same Due/Study queue and SM-2 schedule as MCQs, with Anki-shaped grades on reveal. MCQ UX stays binary (wrong→Again, correct→Good).

Grounding (How People Learn / desirable difficulty): retrieval practice beats re-reading; spacing is already our `dueAt` schedule; we do **not** claim “mastery” from a Good press.

## Decisions (locked)

| Topic | Choice |
|-------|--------|
| Formats this slice | **MCQ + flashcard** only |
| Session mix | **One mixed queue** (no Quiz vs Flashcards mode picker) |
| SM-2 grades | **`again` \| `hard` \| `good` \| `easy`** |
| MCQ UX | Auto-map wrong→`again`, correct→`good` (no Hard/Easy buttons) |
| Flashcard UX | Front → Reveal → Again / Hard / Good / Easy |
| Content | **Handcrafted** flashcards (not derived from MCQ options) |
| Hit rate | Treat Good+Easy as “correct”, Again+Hard (+ MCQ wrong) as “miss” for aggregates |
| Out | Typed / cloze / explain UI; email; Hard/Easy on MCQ; minute learning steps |

## 1. Bank model

Shared base + discriminant:

```ts
type PracticeItemBase = {
  id: string;
  lessonLevel: string;
  lessonSlug: string;
  conceptId: string;
  reviewLabel: string;
  hint?: string;
};

type McqItem = PracticeItemBase & {
  kind: "mcq";
  prompt: string;
  code?: string[];
  options: string[];
  correct: number; // index
};

type FlashcardItem = PracticeItemBase & {
  kind: "flashcard";
  front: string;
  frontCode?: string[];
  back: string;
};

type PracticeItem = McqItem | FlashcardItem;
```

- Migrate every existing bank entry to `kind: "mcq"`.
- Add a small handcrafted flashcard set (Foundations / unlocked lessons) — quality over quantity (aim ~8–15 cards covering core concepts already in the curriculum map).
- Unlock rules unchanged: Foundations default level always open; otherwise completed `lessonLevel`/`lessonSlug`.
- `PRACTICE_BANK: PracticeItem[]` (optionally composed from `bank-mcq.ts` + `bank-flashcards.ts`).

Future kinds (`typed`, `cloze`, `explain`) are reserved in the roadmap only — do not stub empty renderers.

## 2. Four-grade SM-2

Extend `PracticeGrade` to `"again" | "hard" | "good" | "easy"`.

| Grade | From `new` / `learning` | From `review` |
|-------|-------------------------|---------------|
| **Again** | → `learning`, reps 0, ease `max(1.3, ease−0.2)`, due **now**, lapse++ if was review | same |
| **Hard** | stay/enter `learning`, due **now** (no graduate) | ease `max(1.3, ease−0.15)`, `intervalDays = max(1, round(interval×1.2))`, due += interval |
| **Good** | graduate → `review`, reps 1, interval **1d**, due +1d (current behavior) | ease `min(3.0, ease+0.1)`, interval `max(1, round(interval×ease))`, due += interval |
| **Easy** | graduate → `review`, reps 1, interval **4d**, due +4d | ease `min(3.0, ease+0.15)`, interval `max(1, round(interval×ease×1.3))`, due += interval |

Pure helpers in `sm2.ts`; unit tests for all four grades × state. Existing Again/Good tests remain green.

**MCQ path:** `applyGrades` / finishSession still only emits again|good.

**Flashcard path:** pass the student’s chosen grade through to `gradeCard`.

**Upsert validation:** allow all four grade-driven card field ranges (ease still [1.3, 3.0]).

## 3. Session & UI

### Build

Unchanged due / path / lessons / new-cap logic — queue is item **ids**. Session length ~8. Mixed kinds in one sitting is intentional (varied retrieval).

### Flashcard panel (640 session column)

1. Show **front** (+ optional `frontCode` in existing code chrome).  
2. Primary control: **Reveal answer** (disabled after reveal).  
3. After reveal: show **back**; grade row **Again · Hard · Good · Easy**.  
4. Choosing a grade advances (same as Check→Next on MCQ).  
5. Optional: show `hint` as a quiet text control before reveal — not required if back is enough.

Phosphor: no purple; grade buttons quiet; **Good** can be the strongest text weight; no streak/XP theater. Match Continue hover grammar on any list chrome.

### MCQ panel

Existing option → Check → Next flow; no grade row.

### Results

- **Score:** count Good+Easy (+ MCQ correct) over answered items.  
- **Misses:** Again+Hard (+ MCQ wrong) with lesson links via `reviewHrefs`.  
- Copy: avoid “mastery”; fine to say what you missed.

### Hub

- One short description line toward recall (e.g. “Retrieve it, then check — misses come back on a schedule.”).  
- No format filter chips this slice.

### Demo (`?demo=1`)

Seed at least one flashcard in sample session so Reveal + grade row photograph.

## 4. Data flow

```
buildSession → PracticeItem[]
  ├─ mcq: select → check → grade again|good
  └─ flashcard: reveal → grade again|hard|good|easy
       → applyGrades / gradeCard → local + upsert
       → session history (missIds = again/hard/mcq-wrong)
```

History schema can keep `missIds` as today; no required new columns for grades this slice.

## 5. Roadmap (documented only)

| Slice | Format | Active-recall move |
|-------|--------|--------------------|
| **1 (this)** | Flashcard | Produce answer mentally → reveal → self-grade |
| 2 | Typed short answer | Type before reveal; exact/fuzzy or self-check |
| 3 | Cloze | Fill blank in code/prose |
| 4 | Explain | Open response + self-rate or light rubric |

## Success criteria

- [ ] Bank is discriminated; existing MCQs still work  
- [ ] Handcrafted flashcards appear in Due/Study when unlocked  
- [ ] Flashcard Reveal → 4 grades updates SM-2 correctly (unit tests)  
- [ ] MCQ still auto Again/Good with no Hard/Easy UI  
- [ ] Mixed sessions; hub has no mode picker  
- [ ] Hit rate / results treat Good+Easy vs Again+Hard honestly  
- [ ] Phosphor; no mastery/streak claims  

## Out of scope

- Typed / cloze / explain implementation  
- Deriving flashcards from MCQ options  
- Hard/Easy buttons on MCQ  
- SM-2 minute learning steps / email  
- Separating Quiz vs Flashcards modes  
