/**
 * The memory board: addressed one-byte boxes written on a clock tick. Pure, so lessons and tests agree.
 * A fault can make the decoder ignore one address bit, so a write lands in two boxes: the kind of bug a
 * learner has to diagnose from the timeline.
 */

export type MemoryFault = { ignoreAddressBit: number };

export type BoardTick = { address: number; data: number; write: boolean };

export type TickResult = {
  mem: number[];
  /** Boxes whose value changed on this tick. */
  changed: number[];
  /** Boxes the decoder selected (one, unless a fault widens it). */
  selected: number[];
};

/** Which boxes an address selects: just that one, or two if the decoder ignores an address bit. */
export function selectBoxes(address: number, size: number, fault?: MemoryFault): number[] {
  const a = address % size;
  if (!fault) return [a];
  const mask = 1 << fault.ignoreAddressBit;
  return [...new Set([a & ~mask, a | mask])].filter((b) => b < size).sort((x, y) => x - y);
}

/** One clock tick: with write on, every selected box takes the data; otherwise nothing changes. */
export function tickBoard(mem: number[], t: BoardTick, fault?: MemoryFault): TickResult {
  const selected = selectBoxes(t.address, mem.length, fault);
  if (!t.write) return { mem, changed: [], selected };
  const next = [...mem];
  const changed: number[] = [];
  for (const box of selected) {
    if (next[box] !== (t.data & 0xff)) changed.push(box);
    next[box] = t.data & 0xff;
  }
  return { mem: next, changed, selected };
}

/** What data out shows: the box the address selects (the lowest one, with a fault). */
export function readBoard(mem: number[], address: number, fault?: MemoryFault): number {
  return mem[selectBoxes(address, mem.length, fault)[0]];
}

export function boardFrom(size: number, start: Record<string, number> = {}): number[] {
  const mem = new Array<number>(size).fill(0);
  for (const [a, v] of Object.entries(start)) {
    const addr = Number(a);
    if (Number.isInteger(addr) && addr >= 0 && addr < size) mem[addr] = v & 0xff;
  }
  return mem;
}

/**
 * Whether a goal is met: every box named in the goal holds its value, and every other box still holds
 * what it started with (so a write that also hit a neighbour doesn't count).
 */
export function goalMet(mem: number[], start: number[], goal: Record<string, number>): { met: boolean; wrong: number[] } {
  const wrong: number[] = [];
  mem.forEach((v, addr) => {
    const want = addr in goal ? goal[addr] : start[addr];
    if (v !== want) wrong.push(addr);
  });
  return { met: wrong.length === 0, wrong };
}
