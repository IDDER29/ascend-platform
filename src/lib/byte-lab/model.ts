/**
 * The Byte Lab: the same bytes read several ways. Pure, so the lesson component and its tests agree.
 * Nothing here decides what a byte "is"; each function is one way of reading it.
 */

export const MAX_BYTES = 8;

export type ByteReading = {
  unsigned: number;
  /** As an 8-bit two's complement number. */
  signed: number;
  hex: string;
  bits: string;
  /** The ASCII character, if the byte is a printable one (32 to 126); null otherwise. */
  ascii: string | null;
};

export function readByte(byte: number): ByteReading {
  const b = byte & 0xff;
  return {
    unsigned: b,
    signed: b >= 128 ? b - 256 : b,
    hex: b.toString(16).toUpperCase().padStart(2, "0"),
    bits: b.toString(2).padStart(8, "0"),
    ascii: b >= 32 && b <= 126 ? String.fromCharCode(b) : null,
  };
}

/** The bytes as UTF-8 text, or null when they aren't valid UTF-8 (for example a lone 0xC3). */
export function asUtf8(bytes: number[]): string | null {
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(new Uint8Array(bytes));
  } catch {
    return null;
  }
}

/** The first three bytes as a colour (red, green, blue), e.g. "#FF8000"; null with fewer than three. */
export function asRgb(bytes: number[]): string | null {
  if (bytes.length < 3) return null;
  return `#${bytes
    .slice(0, 3)
    .map((b) => readByte(b).hex)
    .join("")}`;
}

/** Two bytes as one 16-bit number, little-endian (low byte first) and big-endian. */
export function asWord(bytes: number[]): { little: number; big: number } | null {
  if (bytes.length < 2) return null;
  const [a, b] = bytes;
  return { little: a | (b << 8), big: (a << 8) | b };
}

export type BitOp = "AND" | "OR" | "XOR" | "NOT" | "SHL" | "SHR";

/** One bitwise operation on a byte, kept to 8 bits. `operand` is the mask, or the shift count. */
export function bitwise(op: BitOp, a: number, operand: number): number {
  switch (op) {
    case "AND":
      return a & operand & 0xff;
    case "OR":
      return (a | operand) & 0xff;
    case "XOR":
      return (a ^ operand) & 0xff;
    case "NOT":
      return ~a & 0xff;
    case "SHL":
      return (a << (operand & 7)) & 0xff;
    case "SHR":
      return (a & 0xff) >> (operand & 7);
  }
}

/** Flip one bit; `bit` 7 is the leftmost (worth 128). */
export function flipBit(byte: number, bit: number): number {
  return (byte ^ (1 << bit)) & 0xff;
}

/** Parse a byte typed as decimal (65), hex (0x41) or binary (0b01000001); null if it isn't 0 to 255. */
export function parseByte(text: string): number | null {
  const t = text.trim().toLowerCase();
  const n = /^0x[0-9a-f]{1,2}$/.test(t)
    ? parseInt(t.slice(2), 16)
    : /^0b[01]{1,8}$/.test(t)
      ? parseInt(t.slice(2), 2)
      : /^-?\d{1,3}$/.test(t)
        ? Number(t)
        : NaN;
  if (!Number.isInteger(n)) return null;
  // A negative number is accepted as its two's complement byte.
  if (n < 0) return n >= -128 ? n + 256 : null;
  return n <= 255 ? n : null;
}
