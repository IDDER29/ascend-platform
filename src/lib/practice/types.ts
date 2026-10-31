import type { CardFigure, Gate } from "./figures";

export type PracticeItemBase = {
  id: string;
  /** Curriculum level id, e.g. "level-02-the-c-language" */
  lessonLevel: string;
  lessonSlug: string;
  conceptId: string;
  reviewLabel: string;
  hint?: string;
  /**
   * The flashcard whose diagram explains this card's answer, shown after a miss. Without it, a flashcard
   * with a diagram on the same conceptId is used (see `buildMissFigures`).
   */
  figureFrom?: string;
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

/** Put in order: arrange shuffled steps into the right sequence. */
export type OrderItem = PracticeItemBase & {
  kind: "order";
  prompt: string;
  /** The steps, in the right order (shown shuffled). */
  steps: string[];
};

/**
 * Flip the bits: switch bits on and off to make a value, or fill in a gate's output column.
 * `bits` is the answer: left to right, or (with `gate`) the output cells row by row.
 */
export type BitsItem = PracticeItemBase & {
  kind: "bits";
  prompt: string;
  bits: string;
  /** Show each bit's place value (8 4 2 1) above it. */
  places?: boolean;
  /** Fill in this gate's truth table instead of a row of bits. */
  gate?: Gate;
};

export type PracticeItem = McqItem | FlashcardItem | TypedItem | ClozeItem | OutputItem | BugItem | OrderItem | BitsItem;

/** @deprecated Use McqItem for MCQ-only code or PracticeItem for mixed sessions. */
export type PracticeQuestion = McqItem;

export type PracticeAnswer = {
  questionId: string;
  selected: number;
  correct: boolean;
};
