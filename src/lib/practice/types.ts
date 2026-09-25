export type PracticeQuestion = {
  id: string;
  prompt: string;
  code?: string[];
  options: string[];
  correct: number;
  hint: string;
  reviewLabel: string;
  /** Curriculum level id, e.g. "level-02-the-c-language" */
  lessonLevel: string;
  lessonSlug: string;
  conceptId: string;
};

export type PracticeAnswer = {
  questionId: string;
  selected: number;
  correct: boolean;
};
