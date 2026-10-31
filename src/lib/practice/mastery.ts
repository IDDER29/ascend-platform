import type { PracticeItem } from "./types";

/**
 * What a card asks you to do, from least to most: recognise an answer, explain it in your own words,
 * predict what code or a machine will do, build something (set the bits), or debug it. Derived from the
 * card's kind, so a topic's cards show whether it's only recognised or truly understood.
 */
export type MasterySkill = "recognise" | "explain" | "predict" | "build" | "debug";

export const MASTERY_SKILLS: { value: MasterySkill; label: string }[] = [
  { value: "recognise", label: "Recognise" },
  { value: "explain", label: "Explain" },
  { value: "predict", label: "Predict" },
  { value: "build", label: "Build" },
  { value: "debug", label: "Debug" },
];

const OF_KIND: Record<PracticeItem["kind"], MasterySkill> = {
  flashcard: "recognise",
  mcq: "recognise",
  typed: "explain",
  cloze: "explain",
  output: "predict",
  order: "predict",
  bits: "build",
  bug: "debug",
};

export function masteryOf(kind: PracticeItem["kind"]): MasterySkill {
  return OF_KIND[kind];
}

export function masteryLabel(skill: MasterySkill): string {
  return MASTERY_SKILLS.find((s) => s.value === skill)!.label;
}
