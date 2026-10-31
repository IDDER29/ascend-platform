/**
 * Small diagrams a card can carry on its back: the answer, drawn. Each is data (stored with the card in
 * the bank) and is rendered by `src/components/practice/card-figure.tsx`; the logic lives here and is tested.
 */
export type Gate = "AND" | "OR" | "NOT" | "XOR" | "NAND" | "NOR" | "HALF_ADDER" | "FULL_ADDER";

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
  | { type: "cycle"; steps: string[] }
  /** Variables as boxes at addresses; a pointer names the variable it points to. */
  | { type: "memory"; cells: MemoryCell[]; caption?: string }
  /** Where p + 1 lands for pointers to elements of different sizes. */
  | { type: "ptrstep"; pointers: { label: string; size: number }[] }
  /** Struct (or union) members laid out byte by byte, padding shown. */
  | { type: "layout"; layouts: { title: string; fields: Field[]; union?: boolean }[] }
  /** A process's memory map, high addresses at the top. */
  | { type: "addrspace" }
  /** Stack frames, oldest at the top, the newest where the stack pointer is. */
  | { type: "frames"; frames: { name: string; rows: string[] }[] }
  /** One value's bytes in little- and big-endian order. */
  | { type: "endian"; value: string }
  /** A file descriptor table. */
  | { type: "fds"; rows: { fd: number; target: string; changed?: boolean; closed?: boolean }[]; caption?: string }
  /** fork(): one call, two returns. */
  | { type: "fork" }
  /** A pipe: writer → kernel buffer → reader. */
  | { type: "pipe" };

export type MemoryCell = { addr: string; name: string; value: string; pointsTo?: string };
export type Field = { name: string; type: string; size: number };

const GATE_FN: Record<Exclude<Gate, "NOT" | "HALF_ADDER" | "FULL_ADDER">, (a: number, b: number) => number> = {
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
  if (gate === "FULL_ADDER") {
    // Inputs A, B, carry-in in counting order 000 … 111; Sum = A ^ B ^ Cin, carry-out = majority.
    const rows = Array.from({ length: 8 }, (_, n) => [(n >> 2) & 1, (n >> 1) & 1, n & 1]);
    return {
      inputs: ["A", "B", "Cin"],
      outputs: ["Sum", "Cout"],
      rows: rows.map(([a, b, c]) => ({ in: [a, b, c], out: [a ^ b ^ c, (a & b) | (c & (a ^ b))] })),
    };
  }
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

export type LaidOutField = Field & { offset: number };

/**
 * Lay out C struct members: each starts at the next multiple of its own size (its alignment, for the
 * primitive types used on cards), and the total rounds up to the largest alignment. A union puts every
 * member at offset 0 and is as big as its biggest member.
 */
export function structLayout(
  fields: Field[],
  union = false,
): { fields: LaidOutField[]; size: number; padding: number[] } {
  const align = Math.max(1, ...fields.map((f) => f.size));
  if (union) {
    const size = Math.ceil(Math.max(0, ...fields.map((f) => f.size)) / align) * align;
    return { fields: fields.map((f) => ({ ...f, offset: 0 })), size, padding: [] };
  }
  let at = 0;
  const laid: LaidOutField[] = [];
  const padding: number[] = [];
  for (const f of fields) {
    const offset = Math.ceil(at / f.size) * f.size;
    for (let b = at; b < offset; b++) padding.push(b);
    laid.push({ ...f, offset });
    at = offset + f.size;
  }
  const size = Math.ceil(at / align) * align;
  for (let b = at; b < size; b++) padding.push(b);
  return { fields: laid, size, padding };
}

/** A hex value's bytes, most significant first ("0x12345678" → ["12", "34", "56", "78"]). */
export function hexBytes(value: string): string[] {
  const hex = value.replace(/^0x/i, "").toUpperCase();
  const even = hex.length % 2 ? `0${hex}` : hex;
  return even.match(/../g) ?? [];
}
