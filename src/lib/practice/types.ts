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

export type PracticeItem = McqItem | FlashcardItem | TypedItem | ClozeItem;

/** @deprecated Use McqItem for MCQ-only code or PracticeItem for mixed sessions. */
export type PracticeQuestion = McqItem;

export type PracticeAnswer = {
  questionId: string;
  selected: number;
  correct: boolean;
};
