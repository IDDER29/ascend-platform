import type { CardFigure } from "./figures";

export type PracticeItemBase = {
  id: string;
  /** Curriculum level id, e.g. "level-02-the-c-language" */
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
  /** A small diagram drawn under the answer on the back (see `figures.ts`). */
  figure?: CardFigure;
};

export type TypedItem = PracticeItemBase & {
  kind: "typed";
  prompt: string;
  code?: string[];
  answers: string[];
};

export type ClozeItem = PracticeItemBase & {
  kind: "cloze";
  /** Prose with a single `{{blank}}` placeholder. */
  template?: string;
  /** Code lines containing exactly one `{{blank}}` placeholder in total. */
  templateCode?: string[];
  answers: string[];
};

/** Predict the output: read the code, type exactly what it prints. */
export type OutputItem = PracticeItemBase & {
  kind: "output";
  prompt: string;
  code: string[];
  /** Exactly what the program prints (lines joined by "\n"); verified by compiling and running it. */
  output: string;
};

/** Spot the bug: click the one line that's wrong. */
export type BugItem = PracticeItemBase & {
  kind: "bug";
  prompt: string;
  code: string[];
  /** 0-based index into `code` of the faulty line. */
  bugLine: number;
  /** One sentence: what's wrong on that line and how to fix it. */
  fix: string;
};

export type PracticeItem = McqItem | FlashcardItem | TypedItem | ClozeItem | OutputItem | BugItem;

/** @deprecated Use McqItem for MCQ-only code or PracticeItem for mixed sessions. */
export type PracticeQuestion = McqItem;

export type PracticeAnswer = {
  questionId: string;
  selected: number;
  correct: boolean;
};
