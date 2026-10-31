/**
 * The tiny CPU Foundations uses all the way through: the instruction set of Ben Eater's 8-bit breadboard
 * computer. One byte per instruction (4-bit opcode, 4-bit operand), 16 one-byte memory boxes, register A
 * (and B for the second operand of ADD/SUB), zero and carry flags set by ADD and SUB, and an output display.
 * Pure and deterministic, so lessons, projects and tests all run the same machine.
 */

export const OPCODES = {
  NOP: 0b0000,
  LDA: 0b0001,
  ADD: 0b0010,
  SUB: 0b0011,
  STA: 0b0100,
  LDI: 0b0101,
  JMP: 0b0110,
  JC: 0b0111,
  JZ: 0b1000,
  OUT: 0b1110,
  HLT: 0b1111,
} as const;

export type Mnemonic = keyof typeof OPCODES;

const WITH_OPERAND = new Set<Mnemonic>(["LDA", "ADD", "SUB", "STA", "LDI", "JMP", "JC", "JZ"]);
const BY_OPCODE = new Map<number, Mnemonic>(Object.entries(OPCODES).map(([m, op]) => [op, m as Mnemonic]));

export const MEMORY_SIZE = 16;
/** A runaway program (an endless loop) stops after this many steps. */
export const MAX_STEPS = 256;

export type Machine = {
  mem: number[];
  /** Program counter: the address of the next instruction to fetch. */
  pc: number;
  a: number;
  b: number;
  /** Instruction register: the instruction being executed (last fetched). */
  ir: number;
  carry: boolean;
  zero: boolean;
  halted: boolean;
  out: number[];
  steps: number;
};

export type StepEvent = {
  /** Where the instruction was fetched from. */
  at: number;
  instruction: string;
  /** What it did, in plain words. */
  text: string;
  /** The memory address written, if any (STA). */
  wrote?: number;
  /** Whether the program counter was changed by a jump. */
  jumped?: boolean;
  /** The value shown, if OUT. */
  output?: number;
};

export function byteBits(n: number): string {
  const s = (n & 0xff).toString(2).padStart(8, "0");
  return `${s.slice(0, 4)} ${s.slice(4)}`;
}

/** A byte read as an instruction: "LDA 14", "OUT", or "?" for an unused opcode. */
export function decode(byte: number): string {
  const op = (byte >> 4) & 0xf;
  const operand = byte & 0xf;
  const m = BY_OPCODE.get(op);
  if (!m) return "?";
  return WITH_OPERAND.has(m) ? `${m} ${operand}` : m;
}

/**
 * Turn instruction lines ("LDA 14", "OUT") into 16 bytes: the program from address 0, then `data` placed
 * at its addresses (numbers 0–255). Throws on anything the tiny CPU can't hold.
 */
export function assemble(program: string[], data: Record<string | number, number> = {}): number[] {
  if (program.length > MEMORY_SIZE) throw new Error(`A program can be at most ${MEMORY_SIZE} instructions`);
  const mem = new Array<number>(MEMORY_SIZE).fill(0);
  program.forEach((line, i) => {
    const [name, arg, extra] = line.trim().toUpperCase().split(/\s+/);
    if (!(name in OPCODES) || extra !== undefined) throw new Error(`Line ${i}: can't read "${line}"`);
    const m = name as Mnemonic;
    let operand = 0;
    if (WITH_OPERAND.has(m)) {
      operand = Number(arg);
      if (!Number.isInteger(operand) || operand < 0 || operand > 15) {
        throw new Error(`Line ${i}: ${m} needs a number from 0 to 15`);
      }
    } else if (arg !== undefined) throw new Error(`Line ${i}: ${m} takes no number`);
    mem[i] = (OPCODES[m] << 4) | operand;
  });
  for (const [addr, value] of Object.entries(data)) {
    const a = Number(addr);
    if (!Number.isInteger(a) || a < 0 || a >= MEMORY_SIZE) throw new Error(`No address ${addr}`);
    if (!Number.isInteger(value) || value < 0 || value > 255) throw new Error(`Address ${addr}: a byte is 0 to 255`);
    mem[a] = value;
  }
  return mem;
}

export function boot(mem: number[]): Machine {
  return { mem: [...mem], pc: 0, a: 0, b: 0, ir: 0, carry: false, zero: false, halted: false, out: [], steps: 0 };
}

/** Fetch one instruction, move the program counter on, then execute it. */
export function step(m: Machine): { machine: Machine; event: StepEvent | null } {
  if (m.halted) return { machine: m, event: null };
  const at = m.pc;
  const ir = m.mem[at];
  const next: Machine = { ...m, mem: [...m.mem], out: [...m.out], ir, pc: (at + 1) % MEMORY_SIZE, steps: m.steps + 1 };
  const op = ir >> 4;
  const n = ir & 0xf;
  const instruction = decode(ir);
  const ev = (text: string, extra: Partial<StepEvent> = {}): StepEvent => ({ at, instruction, text, ...extra });

  switch (op) {
    case OPCODES.LDA:
      next.a = next.mem[n];
      return { machine: next, event: ev(`Loaded the byte at address ${n} into A: A = ${next.a}.`) };
    case OPCODES.ADD: {
      next.b = next.mem[n];
      const sum = next.a + next.b;
      next.carry = sum > 0xff;
      next.a = sum & 0xff;
      next.zero = next.a === 0;
      return {
        machine: next,
        event: ev(
          `Added the byte at address ${n} (${next.b}) to A: A = ${next.a}${next.carry ? ", with a carry out (the sum didn't fit in 8 bits)" : ""}.`,
        ),
      };
    }
    case OPCODES.SUB: {
      next.b = next.mem[n];
      // Subtract by adding the two's complement of B: A + NOT B + 1. Carry = 1 means no borrow was needed.
      const r = next.a + (~next.b & 0xff) + 1;
      next.carry = r > 0xff;
      next.a = r & 0xff;
      next.zero = next.a === 0;
      return {
        machine: next,
        event: ev(
          `Subtracted the byte at address ${n} (${next.b}) from A: A = ${next.a}${next.zero ? ", so the zero flag is set" : ""}.`,
        ),
      };
    }
    case OPCODES.STA:
      next.mem[n] = next.a;
      return { machine: next, event: ev(`Stored A (${next.a}) into address ${n}.`, { wrote: n }) };
    case OPCODES.LDI:
      next.a = n;
      return { machine: next, event: ev(`Put the number ${n} itself into A.`) };
    case OPCODES.JMP:
      next.pc = n;
      return { machine: next, event: ev(`Jumped: the next instruction comes from address ${n}.`, { jumped: true }) };
    case OPCODES.JC:
      if (next.carry) next.pc = n;
      return {
        machine: next,
        event: ev(
          next.carry
            ? `The carry flag is set, so it jumped to address ${n}.`
            : "The carry flag is clear, so it carried on.",
          { jumped: next.carry },
        ),
      };
    case OPCODES.JZ:
      if (next.zero) next.pc = n;
      return {
        machine: next,
        event: ev(
          next.zero
            ? `The zero flag is set, so it jumped to address ${n}.`
            : "The zero flag is clear, so it carried on.",
          { jumped: next.zero },
        ),
      };
    case OPCODES.OUT:
      next.out.push(next.a);
      return { machine: next, event: ev(`Showed A on the display: ${next.a}.`, { output: next.a }) };
    case OPCODES.HLT:
      next.halted = true;
      next.pc = at;
      return { machine: next, event: ev("Halted. The program is finished.") };
    case OPCODES.NOP:
      return { machine: next, event: ev("Did nothing (NOP).") };
    default:
      next.halted = true;
      next.pc = at;
      return { machine: next, event: ev(`${byteBits(ir)} isn't an instruction this CPU knows, so it stopped.`) };
  }
}

/** Step until HLT, or until MAX_STEPS (an endless loop). */
export function run(m: Machine, max = MAX_STEPS): { machine: Machine; events: StepEvent[]; stoppedEarly: boolean } {
  let machine = m;
  const events: StepEvent[] = [];
  while (!machine.halted && machine.steps < max) {
    const r = step(machine);
    machine = r.machine;
    if (r.event) events.push(r.event);
  }
  return { machine, events, stoppedEarly: !machine.halted };
}
