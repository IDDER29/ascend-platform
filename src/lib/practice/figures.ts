/**
 * Small diagrams a card can carry on its back: the answer, drawn. Each is data (stored with the card in
 * the bank) and is rendered by `src/components/practice/card-figure.tsx`; the logic lives here and is tested.
 */
export type Gate = "AND" | "OR" | "NOT" | "XOR" | "NAND" | "NOR" | "HALF_ADDER";

export type CardFigure =
  /** A row of bit boxes, optionally grouped (4 = nibbles). */
  | { type: "bits"; bits: string; group?: number; caption?: string }
  /** Every pattern n bits can make: 2ⁿ rows. */
  | { type: "patterns"; n: number }
  /** A number broken into digit × baseᵖᵒˢⁱᵗⁱᵒⁿ terms, then summed. */
  | { type: "places"; digits: string; base: 2 | 8 | 10 | 16 }
  /** Bits grouped in fours, each group under its hex digit. */
  | { type: "hex"; bits: string }
  /** A gate's full truth table, rows where the output is 1 marked. */
  | { type: "truth"; gate: Gate }
  /** The HIGH / forbidden / LOW voltage bands. */
  | { type: "voltage" }
  /** Steps in a loop (the instruction cycle). */
  | { type: "cycle"; steps: string[] };

const GATE_FN: Record<Exclude<Gate, "NOT" | "HALF_ADDER">, (a: number, b: number) => number> = {
  AND: (a, b) => a & b,
  OR: (a, b) => a | b,
  XOR: (a, b) => a ^ b,
  NAND: (a, b) => 1 - (a & b),
  NOR: (a, b) => 1 - (a | b),
};

export type TruthTable = { inputs: string[]; outputs: string[]; rows: { in: number[]; out: number[] }[] };

/** The full truth table for a gate (inputs in counting order: 00, 01, 10, 11). */
export function truthTable(gate: Gate): TruthTable {
  if (gate === "NOT")
    return { inputs: ["A"], outputs: ["NOT A"], rows: [0, 1].map((a) => ({ in: [a], out: [1 - a] })) };
  const pairs = [
    [0, 0],
    [0, 1],
    [1, 0],
    [1, 1],
  ];
  if (gate === "HALF_ADDER") {
    return {
      inputs: ["A", "B"],
      outputs: ["Sum", "Carry"],
      rows: pairs.map(([a, b]) => ({ in: [a, b], out: [a ^ b, a & b] })),
    };
  }
  const fn = GATE_FN[gate];
  return {
    inputs: ["A", "B"],
    outputs: [`A ${gate} B`],
    rows: pairs.map(([a, b]) => ({ in: [a, b], out: [fn(a, b)] })),
  };
}

/** Every n-bit pattern in counting order ("000" … "111"), capped at 4 bits so it fits on a card. */
export function bitPatterns(n: number): string[] {
  const bits = Math.max(1, Math.min(4, Math.floor(n)));
  return Array.from({ length: 2 ** bits }, (_, i) => i.toString(2).padStart(bits, "0"));
}

/** Split a bit string into groups of `size`, counted from the right (as place value works). */
export function groupBits(bits: string, size: number): string[] {
  const clean = bits.replace(/[^01]/g, "");
  if (size <= 0) return [clean];
  const groups: string[] = [];
  for (let end = clean.length; end > 0; end -= size) groups.unshift(clean.slice(Math.max(0, end - size), end));
  return groups;
}

const DIGITS = "0123456789ABCDEF";

/** digit × base^position terms, left to right, and their total. */
export function placeTerms(
  digits: string,
  base: number,
): { terms: { digit: string; power: number; value: number }[]; total: number } {
  const chars = digits.toUpperCase().split("");
  const terms = chars.map((digit, i) => {
    const power = chars.length - 1 - i;
    return { digit, power, value: DIGITS.indexOf(digit) * base ** power };
  });
  return { terms, total: terms.reduce((sum, t) => sum + t.value, 0) };
}

/** Each 4-bit group with its hex digit. */
export function hexGroups(bits: string): { bits: string; hex: string }[] {
  return groupBits(bits, 4).map((g) => ({ bits: g.padStart(4, "0"), hex: DIGITS[parseInt(g, 2)] }));
}
