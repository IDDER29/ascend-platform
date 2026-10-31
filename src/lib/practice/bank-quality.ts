import type { McqItem } from "./types";

/** How much longer than every wrong option the right one may be before its length gives it away. */
export const LENGTH_CUE_RATIO = 1.2;

/**
 * Whether a multiple-choice card gives its answer away by length: the right option is the longest,
 * and by more than LENGTH_CUE_RATIO × the longest wrong one. Learners who "pick the longest" would win.
 */
export function hasLengthCue(q: Pick<McqItem, "options" | "correct">): boolean {
  const right = q.options[q.correct]?.length ?? 0;
  const longestWrong = Math.max(0, ...q.options.filter((_, i) => i !== q.correct).map((o) => o.length));
  return right > longestWrong * LENGTH_CUE_RATIO;
}

/** Share of cards (0–1) whose right option is the single longest. Chance with 4 options is about 25%. */
export function longestIsRightShare(cards: Pick<McqItem, "options" | "correct">[]): number {
  if (cards.length === 0) return 0;
  const hits = cards.filter((q) => {
    const lens = q.options.map((o) => o.length);
    const right = lens[q.correct];
    return lens.every((l, i) => i === q.correct || l < right);
  }).length;
  return hits / cards.length;
}
