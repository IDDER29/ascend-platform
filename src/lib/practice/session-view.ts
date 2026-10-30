import { normalizeAnswer } from "./normalize";
import type { CardFigure } from "./figures";
import type { PracticeItem } from "./types";

/** What each card type is called on screen. */
export const KIND_LABELS: Record<PracticeItem["kind"], string> = {
  mcq: "Choices",
  flashcard: "Flashcard",
  typed: "Short answer",
  cloze: "Fill in the blank",
  output: "Predict the output",
  bug: "Spot the bug",
  order: "Put in order",
  bits: "Flip the bits",
};

const CODE_CHARS = /[`{}()[\];=<>*&|^~#%\\]/;
const NUMBER_LIKE = /^[-+]?(0x[0-9a-f]+|0b[01]+|\d[\d_.,\s]*)$/i;
const IDENTIFIER = /^[A-Za-z_][\w.]*$/;

/**
 * Whether a short answer reads as code (set in mono) or as plain words (set in the body face).
 * "int *p", "0x1F", "argv[0]", "size_t" → code; "One byte of memory", "two" → words.
 */
export function looksLikeCode(text: string): boolean {
  const t = text.trim();
  if (!t) return false;
  if (CODE_CHARS.test(t) || NUMBER_LIKE.test(t)) return true;
  // A single identifier counts only when it has a code-ish shape (snake_case, a dot, a digit).
  return IDENTIFIER.test(t) && /[_.\d]/.test(t);
}

/** A fresh order for a card's options, so the answer isn't remembered by its position. */
export function shuffledOrder(length: number, rng: () => number = Math.random): number[] {
  const order = Array.from({ length }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

const BLANK = "{{blank}}";

/** A prose blank: the text before and after `{{blank}}`, or null when there is none. */
export function splitBlank(template: string | undefined): { before: string; after: string } | null {
  if (!template) return null;
  const at = template.indexOf(BLANK);
  if (at < 0) return null;
  return { before: template.slice(0, at), after: template.slice(at + BLANK.length) };
}

/** A code blank: which line holds `{{blank}}`, and that line split around it. */
export function splitCodeBlank(lines: string[] | undefined): { line: number; before: string; after: string } | null {
  if (!lines) return null;
  for (let line = 0; line < lines.length; line += 1) {
    const parts = splitBlank(lines[line]);
    if (parts) return { line, ...parts };
  }
  return null;
}

/** Width for a blank's input, in `ch`: room for the longest accepted answer, within limits. */
export function blankWidth(answers: string[]): number {
  const longest = Math.max(0, ...answers.map((a) => a.length));
  return Math.min(24, Math.max(5, longest + 2));
}

/**
 * After a right typed answer: the official wording, when it differs from what was typed
 * ("two" → "2"), so the exact term sticks. Null when they already match.
 */
export function officialWording(input: string, answers: string[]): string | null {
  const canonical = answers[0];
  if (!canonical) return null;
  return normalizeAnswer(input) === normalizeAnswer(canonical) ? null : canonical;
}

/** Program output as compared: \r\n → \n, trailing spaces on each line and trailing blank lines dropped. */
export function normalizeOutput(raw: string): string {
  return raw
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) => line.replace(/\s+$/, ""))
    .join("\n")
    .replace(/\n+$/, "")
    .replace(/^\n+/, "");
}

/** A predicted output is right when it matches the real one exactly, apart from trailing whitespace. */
export function outputMatches(input: string, expected: string): boolean {
  return normalizeOutput(input) === normalizeOutput(expected);
}

/** The answer to a card, as text (for the card page, the review summary, bookmarks). */
export function answerText(q: PracticeItem): string {
  switch (q.kind) {
    case "mcq":
      return q.options[q.correct] ?? "";
    case "flashcard":
      return q.back;
    case "output":
      return q.output;
    case "bug":
      return `Line ${q.bugLine + 1}: ${q.fix}`;
    case "order":
      return q.steps.join(" → ");
    case "bits":
      return q.bits;
    default:
      return q.answers[0] ?? "";
  }
}

/** A shuffled order that is never already right, so an ordering card always needs some moves. */
export function scrambledOrder(length: number, rng: () => number = Math.random): number[] {
  if (length < 2) return Array.from({ length }, (_, i) => i);
  for (;;) {
    const order = shuffledOrder(length, rng);
    if (order.some((v, i) => v !== i)) return order;
  }
}

/** Move the item at `from` one place up (-1) or down (+1); out-of-range moves change nothing. */
export function moveItem<T>(list: T[], from: number, step: -1 | 1): T[] {
  const to = from + step;
  if (from < 0 || from >= list.length || to < 0 || to >= list.length) return list;
  const next = [...list];
  [next[from], next[to]] = [next[to], next[from]];
  return next;
}

/** Each position of an arrangement: is the step there the one that belongs there? */
export function orderMarks(arrangement: number[]): boolean[] {
  return arrangement.map((step, position) => step === position);
}


/**
 * The diagram to show after a miss, per card id: the flashcard named in `figureFrom`, or else a flashcard
 * with a diagram on the same concept. Flashcards don't need one (the diagram is already on their back).
 */
export function buildMissFigures(bank: PracticeItem[]): Map<string, CardFigure> {
  const byId = new Map(bank.map((q) => [q.id, q]));
  const byConcept = new Map<string, CardFigure>();
  for (const q of bank) if (q.kind === "flashcard" && q.figure && !byConcept.has(q.conceptId)) byConcept.set(q.conceptId, q.figure);
  const out = new Map<string, CardFigure>();
  for (const q of bank) {
    if (q.kind === "flashcard") continue;
    const named = q.figureFrom ? byId.get(q.figureFrom) : undefined;
    const figure = (named?.kind === "flashcard" ? named.figure : undefined) ?? byConcept.get(q.conceptId);
    if (figure) out.set(q.id, figure);
  }
  return out;
}
