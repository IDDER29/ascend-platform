import { assemble, boot, byteBits, run } from "@/lib/tiny-cpu/machine";
import type { PracticeItem } from "./types";

/**
 * Fresh-number cards: one card id (so SM-2 schedules it like any other), but new numbers on every
 * review, with the answer computed rather than stored. They test the skill (convert, decode, trace)
 * instead of the memory of one answer. `freshVariant` picks the numbers from the card's review count;
 * the bank holds the seed-0 version so every other part of the app sees a normal card.
 */

const L00 = "level-00-bits-logic";

/** A small deterministic generator (mulberry32), so a seed always gives the same card. */
function random(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(text: string): number {
  let h = 2166136261;
  for (const ch of text) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return h >>> 0;
}

/** A whole number from lo to hi inclusive. */
const between = (r: () => number, lo: number, hi: number) => lo + Math.floor(r() * (hi - lo + 1));

const bin8 = (n: number) => (n & 0xff).toString(2).padStart(8, "0");
const hex2 = (n: number) => (n & 0xff).toString(16).toUpperCase().padStart(2, "0");

/** `seed` is the review count; generators draw numbers from `r` and may use `seed` to alternate forms. */
type Generator = (r: () => number, seed: number) => PracticeItem;

const GENERATORS: Record<string, Generator> = {
  "gen-bin-to-dec": (r) => {
    const n = between(r, 20, 250);
    return {
      kind: "typed",
      id: "gen-bin-to-dec",
      prompt: `What number is the byte ${byteBits(n)} in decimal?`,
      answers: [String(n)],
      reviewLabel: "Binary to decimal, fresh numbers",
      lessonLevel: L00,
      lessonSlug: "binary-and-number-bases",
      conceptId: "binary-to-decimal",
      hint: "Add the place values of the 1s: 128, 64, 32, 16, 8, 4, 2, 1.",
    };
  },
  "gen-dec-to-bin": (r) => {
    const n = between(r, 10, 250);
    return {
      kind: "bits",
      id: "gen-dec-to-bin",
      prompt: `Set the byte to ${n}.`,
      bits: bin8(n),
      places: true,
      reviewLabel: "Decimal to binary, fresh numbers",
      lessonLevel: L00,
      lessonSlug: "binary-and-number-bases",
      conceptId: "decimal-to-binary",
      hint: "Take the biggest place value that fits, then the next.",
    };
  },
  "gen-hex-to-bin": (r) => {
    const n = between(r, 17, 254);
    return {
      kind: "typed",
      id: "gen-hex-to-bin",
      prompt: `Write the hex byte 0x${hex2(n)} in binary (8 bits).`,
      answers: [bin8(n), byteBits(n)],
      reviewLabel: "Hex to binary, fresh numbers",
      lessonLevel: L00,
      lessonSlug: "binary-and-number-bases",
      conceptId: "hex-to-binary",
      hint: "Each hex digit is exactly four bits.",
    };
  },
  "gen-twos": (r) => {
    // Mostly negative patterns (top bit 1), sometimes a positive one, so the top bit has to be read.
    const n = r() < 0.75 ? between(r, 129, 254) : between(r, 5, 126);
    const value = n >= 128 ? n - 256 : n;
    return {
      kind: "typed",
      id: "gen-twos",
      prompt: `Read the byte ${byteBits(n)} as an 8-bit two's complement number. What is it in decimal?`,
      answers: [String(value)],
      reviewLabel: "Two's complement, fresh numbers",
      lessonLevel: L00,
      lessonSlug: "negative-numbers",
      conceptId: "twos-complement-read",
      hint: "The top bit is worth -128; add the rest as usual.",
    };
  },
  "gen-wrap-add": (r) => {
    const a = between(r, 120, 250);
    const b = between(r, 60, 200);
    return {
      kind: "typed",
      id: "gen-wrap-add",
      prompt: `An 8-bit register holds ${a}. You add ${b}. What does the register hold now?`,
      answers: [String((a + b) & 0xff)],
      reviewLabel: "8-bit wraparound, fresh numbers",
      lessonLevel: L00,
      lessonSlug: "negative-numbers",
      conceptId: "fixed-width-wrap",
      hint: "If the sum is 256 or more, take 256 away.",
    };
  },
  "gen-cpu-trace": (r, seed) => {
    // An add and a countdown take turns, so two reviews in a row never show the same program.
    // The output is whatever the tiny CPU really shows.
    if (seed % 2 === 0) {
      const a = between(r, 10, 120);
      const b = between(r, 10, 120);
      const program = ["LDA 14", "ADD 15", "OUT", "HLT"];
      const out = run(boot(assemble(program, { 14: a, 15: b }))).machine.out;
      return {
        kind: "output",
        id: "gen-cpu-trace",
        prompt: `Address 14 holds ${a} and address 15 holds ${b}. What does the tiny CPU show?`,
        code: program.map((line, i) => `${i}: ${line}`),
        output: out.join("\n"),
        reviewLabel: "Trace the tiny CPU, fresh numbers",
        lessonLevel: L00,
        lessonSlug: "jumps-and-loops",
        conceptId: "trace-tiny-cpu",
        hint: "Load, add, show, stop.",
      };
    }
    const start = between(r, 2, 5);
    const program = [`LDI ${start}`, "OUT", "SUB 15", "JZ 5", "JMP 1", "HLT"];
    const out = run(boot(assemble(program, { 15: 1 }))).machine.out;
    return {
      kind: "output",
      id: "gen-cpu-trace",
      prompt: "Address 15 holds 1. What numbers does the tiny CPU show?",
      code: program.map((line, i) => `${i}: ${line}`),
      output: out.join("\n"),
      reviewLabel: "Trace the tiny CPU, fresh numbers",
      lessonLevel: L00,
      lessonSlug: "jumps-and-loops",
      conceptId: "trace-tiny-cpu",
      hint: "JZ jumps to HLT once A reaches 0, before showing it.",
    };
  },
};

/** The card for a seed: the same id, new numbers. */
export function generatedCard(id: string, seed: number): PracticeItem | null {
  const make = GENERATORS[id];
  return make ? make(random(hash(id) + seed * 7919), seed) : null;
}

/** Every fresh-number card in its seed-0 form, for the bank. */
export const GENERATED_BANK: PracticeItem[] = Object.keys(GENERATORS).map((id) => generatedCard(id, 0)!);

/** Swap a fresh-number card for the numbers of this review (`seed`: how many times it has been answered). */
export function freshVariant(item: PracticeItem, seed: number): PracticeItem {
  return generatedCard(item.id, seed) ?? item;
}
