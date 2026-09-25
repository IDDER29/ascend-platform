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

export type PracticeItem = McqItem | FlashcardItem;

/** @deprecated Use McqItem for MCQ-only code or PracticeItem for mixed sessions. */
export type PracticeQuestion = McqItem;

export type PracticeAnswer = {
  questionId: string;
  selected: number;
  correct: boolean;
};
