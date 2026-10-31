/**
 * A noisy two-state channel (the blueprint's P1-X): a sender turns bits into voltages (0 V or 5 V), the
 * line adds noise, and a receiver turns each voltage back into a bit by comparing it with a threshold.
 * Optional codes: a parity bit per byte (detects one flip) or sending every bit three times (corrects
 * one flip in three by majority). A preview of communications, not an electronics model. The noise is a
 * fixed, seeded sequence scaled by the noise level, so moving a slider never reshuffles it. Pure.
 */

export type Coding = "none" | "parity" | "repeat3";
export const LOW_V = 0;
export const HIGH_V = 5;

/** Text to bits, 8 per character (character codes 0 to 255). */
export function textToBits(text: string): number[] {
  const bits: number[] = [];
  for (const ch of text) {
    const code = ch.charCodeAt(0) & 0xff;
    for (let i = 7; i >= 0; i--) bits.push((code >> i) & 1);
  }
  return bits;
}

export function bitsToText(bits: number[]): string {
  let out = "";
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    const code = bits.slice(i, i + 8).reduce((a, b) => (a << 1) | b, 0);
    out += code >= 32 && code < 127 ? String.fromCharCode(code) : "?";
  }
  return out;
}

/** What the sender actually puts on the line for these data bits. */
export function encode(bits: number[], coding: Coding): number[] {
  if (coding === "repeat3") return bits.flatMap((b) => [b, b, b]);
  if (coding === "parity") {
    const out: number[] = [];
    for (let i = 0; i < bits.length; i += 8) {
      const group = bits.slice(i, i + 8);
      out.push(...group, group.reduce((a, b) => a ^ b, 0));
    }
    return out;
  }
  return [...bits];
}

/** A seeded pseudo-random sequence (mulberry32), so the same seed gives the same noise. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** n standard-normal noise samples (mean 0, spread 1), the same for the same seed. */
export function noiseSamples(n: number, seed: number): number[] {
  const r = rng(seed);
  const out: number[] = [];
  while (out.length < n) {
    const u = Math.max(r(), 1e-12);
    const v = r();
    const mag = Math.sqrt(-2 * Math.log(u));
    out.push(mag * Math.cos(2 * Math.PI * v), mag * Math.sin(2 * Math.PI * v));
  }
  return out.slice(0, n);
}

export type ChannelSettings = { coding: Coding; noise: number; threshold: number; seed: number };

export type ChannelResult = {
  /** Bits put on the line (data plus any code bits). */
  sent: number[];
  volts: number[];
  /** Bits the receiver read, before decoding. */
  received: number[];
  /** Positions on the line where the received bit differs from the sent one. */
  lineFlips: number[];
  /** The data bits after decoding. */
  decoded: number[];
  /** Positions in the data where the decoded bit is still wrong. */
  dataErrors: number[];
  /** With parity: the bytes (by index) whose parity check failed. */
  detected: number[];
  /** With repeat3: the data bits a majority vote fixed. */
  corrected: number[];
};

export function simulate(data: number[], s: ChannelSettings): ChannelResult {
  const sent = encode(data, s.coding);
  const noise = noiseSamples(sent.length, s.seed);
  const volts = sent.map((b, i) => Math.round(((b ? HIGH_V : LOW_V) + s.noise * noise[i]) * 100) / 100);
  const received: number[] = volts.map((v) => (v >= s.threshold ? 1 : 0));
  const lineFlips = sent.flatMap((b, i) => (b !== received[i] ? [i] : []));

  let decoded: number[] = [];
  const detected: number[] = [];
  const corrected: number[] = [];
  if (s.coding === "repeat3") {
    for (let i = 0; i < data.length; i++) {
      const trio = received.slice(i * 3, i * 3 + 3);
      const ones = trio.reduce((a, b) => a + b, 0);
      const bit = ones >= 2 ? 1 : 0;
      if (trio.some((b) => b !== bit) && bit === data[i]) corrected.push(i);
      decoded.push(bit);
    }
  } else if (s.coding === "parity") {
    for (let g = 0, i = 0; i < data.length; g++, i += 8) {
      const size = Math.min(8, data.length - i);
      const start = g * 9;
      const group = received.slice(start, start + size);
      const parity = received[start + size];
      if (group.reduce((a, b) => a ^ b, 0) !== parity) detected.push(g);
      decoded.push(...group);
    }
  } else {
    decoded = [...received];
  }
  const dataErrors = data.flatMap((b, i) => (b !== decoded[i] ? [i] : []));
  return { sent, volts, received, lineFlips, decoded, dataErrors, detected, corrected };
}
