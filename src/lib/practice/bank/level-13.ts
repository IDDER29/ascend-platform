import type { PracticeItem } from "../types";

const L13 = "level-13-caches-memory";

/** Caches & memory systems: the project's cards. The lessons' cards are in level-13-a.ts. */
export const LEVEL_13_BANK: PracticeItem[] = [
  {
    kind: "typed",
    id: "cachesim-typed-01",
    prompt: "A row-by-row walk over 4-byte ints, with 32-byte lines and a cold cache, hits how many of every 8 accesses?",
    answers: ["7", "seven"],
    hint: "A line holds 8 ints; only the first one misses.",
    reviewLabel: "Spatial locality in a row walk",
    lessonLevel: L13,
    lessonSlug: "project-cache-sim",
    conceptId: "spatial-locality",
  },
  {
    kind: "typed",
    id: "cachesim-typed-02",
    prompt: "Rows are 64 bytes and lines 32 bytes, in a cache with 8 sets. Going down a column, how many different sets do 16 rows use?",
    answers: ["4", "four"],
    hint: "Each row jumps two lines: index = line number mod 8.",
    reviewLabel: "Rows that pile into few sets",
    lessonLevel: L13,
    lessonSlug: "project-cache-sim",
    conceptId: "conflict-misses",
  },
  {
    kind: "mcq",
    id: "cachesim-01",
    prompt: "A column walk misses every time, though its 16 lines would fit in the cache. What kind of misses are these?",
    options: ["Conflict misses", "Compulsory misses", "Capacity misses", "Coherence misses"],
    correct: 0,
    hint: "A fully associative cache of the same size would hit.",
    reviewLabel: "Naming the misses",
    lessonLevel: L13,
    lessonSlug: "project-cache-sim",
    conceptId: "conflict-misses",
  },
  {
    kind: "mcq",
    id: "cachesim-02",
    prompt: "Why does padding each 16-int row to 17 ints cut the misses of a column walk?",
    options: [
      "Rows no longer land on whole lines, so they use all sets",
      "Padding makes each cache line hold many more ints",
      "The extra int gets prefetched into the cache early",
      "It turns the cache into a fully associative cache",
    ],
    correct: 0,
    hint: "Look at the index bits of successive rows.",
    reviewLabel: "Padding to dodge conflicts",
    lessonLevel: L13,
    lessonSlug: "project-cache-sim",
    conceptId: "padding",
  },
  {
    kind: "flashcard",
    id: "cachesim-fc-01",
    front: "Why check a cache simulator against a second, independent model?",
    back: "Two implementations rarely share the same bug, so agreement is strong evidence both are right; when they disagree, the first access that differs points straight at the bug (address split, LRU update, empty-way choice).",
    reviewLabel: "Checking a simulator",
    lessonLevel: L13,
    lessonSlug: "project-cache-sim",
    conceptId: "reference-model",
  },
];
