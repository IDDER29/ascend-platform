# Practice active recall — cloze + typed (slice 2)

**Date:** 2026-09-25  
**Status:** Done  
**Route:** `/practice`  
**Builds on:** `2026-09-25-practice-flashcards-active-recall-design.md`  
**Chosen approach:** Shared produce shell + `kind: "cloze" | "typed"`; hybrid auto-check then Again/Hard on miss  
**Later:** explain-this-code (not this pass)

## Goal

Add two more **produce** formats to the mixed Practice queue so students type answers (short answer + fill-in-blank in code/prose), not only recognize (MCQ) or self-reveal (flashcard). Keep one unpredictable shuffled session and the same SM-2 store.

## Decisions (locked)

| Topic | Choice |
|-------|--------|
| Formats | **Cloze + typed** together |
| Grading | **Hybrid:** normalize match → Good; miss → reveal + **Again / Hard** only |
| Content | Handcrafted ~6–10 each, Foundations-first, real lesson slugs |
| Session | Mixed shuffled queue (no mode picker) |
| After reveal | No Good (saw the answer) |
| Out | Multi-blank cloze, Levenshtein fuzzy, explain kind, MCQ-derived items |

## 1. Bank model

```ts
type TypedItem = PracticeItemBase & {
  kind: "typed";
  prompt: string;
  code?: string[];
  answers: string[]; // ≥1 accepted forms
};

type ClozeItem = PracticeItemBase & {
  kind: "cloze";
  /** Prose with a single `{{blank}}` placeholder */
  template?: string;
  /** Code lines; exactly one line (or joined view) contains `{{blank}}` */
  templateCode?: string[];
  answers: string[];
};

// PracticeItem = McqItem | FlashcardItem | TypedItem | ClozeItem
```

**Cloze rule (v1):** exactly one `{{blank}}` across `template` / `templateCode`. Prefer `templateCode` for C/systems tokens.

**Seeds:** new files `bank-typed.ts` + `bank-cloze.ts`, merged into `PRACTICE_BANK`. Quality over volume (definitions, operators, keywords in context).

## 2. Normalize + hybrid grade

**`normalizeAnswer(raw: string): string`**
- trim
- collapse internal whitespace to single spaces
- ASCII casefold (`toLowerCase`)
- strip a single trailing `;` (C comfort)

**`answersMatch(input, answers): boolean`** — true if normalize(input) equals any normalize(answers[i]).

**Flow**
1. Type → **Check** (Enter = Check while unresolved)
2. Match → emit grade `good`, advance
3. Miss → show primary accepted answer (and quiet “also accepted…” if multiple) → **Again** | **Hard** → advance

Hit rate / results: Good (+ flashcard Easy) = hit; Again/Hard (+ MCQ wrong) = miss.

## 3. Session UI

Shared produce panel in `practice-home.tsx` (or small `practice-produce-panel.tsx` if file bloats):

| State | UI |
|-------|-----|
| Input | Prompt/template + input + Check |
| Cloze display | Render template with blank as underlined input slot / monospace field in code chrome |
| Resolved hit | Brief correct flash optional; advance immediately on Good |
| Resolved miss | Answer reveal + Again / Hard |

Keep 640 session column; Phosphor tokens; no purple/XP/streaks.

MCQ + flashcard panels unchanged. `buildSession` already shuffles final order — new kinds participate automatically once in the bank.

## 4. Demo + hub

- `sampleSession` / demo prefer list includes ≥1 typed id and ≥1 cloze id  
- Hub description may mention mixed recall formats in one short line

## 5. Roadmap

| Slice | Status |
|-------|--------|
| Flashcards | Done |
| **Cloze + typed** | Done |
| Explain | Later |

## Success criteria

- [x] `typed` and `cloze` in bank; unlock rules unchanged  
- [x] Hybrid grade path works; normalize unit-tested  
- [x] Mixed shuffled sessions include new kinds  
- [x] Miss never offers Good after reveal  
- [x] Demo shows both formats  
- [x] Phosphor; no mastery theater  

## Out of scope

- Multiple blanks per cloze  
- Fuzzy / Levenshtein match  
- Explain format  
- Good-after-seeing-answer  
- Separating Write mode on the hub  
