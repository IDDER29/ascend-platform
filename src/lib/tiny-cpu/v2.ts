/**
 * The tiny CPU, version 2: the machine for Assembly Language and everything after it. It is the
 * curriculum blueprint's FS-8 v1.0, implemented exactly as specified in Appendix A of
 * `docs/curriculum/sugestion/06_course_05_cpu_architecture.md` (and in
 * `docs/superpowers/specs/2026-11-01-tiny-cpu-v2-design.md`): 256 bytes, registers R0–R3, PC, SP and a
 * zero flag, two-byte instructions, a stack, CALL/RET and IN/OUT. Version 1 (`machine.ts`) stays for
 * Build a CPU. Pure and deterministic; any change to the instruction set needs a new version.
 */

export const MEMORY_SIZE = 256;
/** Code lives in 0x00–0x7F, two bytes per instruction, at even addresses. */
export const CODE_END = 0x7e;
export const STACK_BOTTOM = 0xc0;
export const STACK_TOP = 0xf0;
export const MAX_STEPS = 1000;

type Format = "N" | "U" | "I" | "A" | "R" | "J";

const INSTRUCTIONS = {
  NOP: { op: 0, fmt: "N" },
  LDI: { op: 1, fmt: "I" },
  LDA: { op: 2, fmt: "A" },
  STA: { op: 3, fmt: "A" },
  MOV: { op: 4, fmt: "R" },
  ADD: { op: 5, fmt: "R" },
  SUB: { op: 6, fmt: "R" },
  AND: { op: 7, fmt: "R" },
  OR: { op: 8, fmt: "R" },
  XOR: { op: 9, fmt: "R" },
  SHL: { op: 10, fmt: "I" },
  SHR: { op: 11, fmt: "I" },
  CMP: { op: 12, fmt: "R" },
  JMP: { op: 13, fmt: "J" },
  JZ: { op: 14, fmt: "J" },
  JNZ: { op: 15, fmt: "J" },
  OUT: { op: 16, fmt: "U" },
  PUSH: { op: 17, fmt: "U" },
  POP: { op: 18, fmt: "U" },
  CALL: { op: 19, fmt: "J" },
  RET: { op: 20, fmt: "N" },
  HALT: { op: 21, fmt: "N" },
  INC: { op: 22, fmt: "U" },
  DEC: { op: 23, fmt: "U" },
  LDR: { op: 24, fmt: "R" },
  STR: { op: 25, fmt: "R" },
  ADDI: { op: 26, fmt: "I" },
  SUBI: { op: 27, fmt: "I" },
  CMPI: { op: 28, fmt: "I" },
  IN: { op: 29, fmt: "U" },
} as const satisfies Record<string, { op: number; fmt: Format }>;

export type Mnemonic = keyof typeof INSTRUCTIONS;
const BY_OPCODE = new Map<number, Mnemonic>(
  (Object.keys(INSTRUCTIONS) as Mnemonic[]).map((m) => [INSTRUCTIONS[m].op, m]),
);
/** Brackets mark a memory operand: LDA R0, [0x80] and LDR R0, [R1]. */
const BRACKETED = new Set<Mnemonic>(["LDA", "STA", "LDR", "STR"]);

export type Fault = "BAD_PC" | "INVALID_OPCODE" | "INVALID_FIELD" | "STACK_OVERFLOW" | "STACK_UNDERFLOW";

export type Machine = {
  mem: number[];
  r: [number, number, number, number];
  pc: number;
  sp: number;
  z: boolean;
  halted: boolean;
  /** Bytes sent by OUT, in order. */
  out: number[];
  /** Bytes waiting for IN. */
  input: number[];
  steps: number;
};

export type Decoded = { name: Mnemonic; rd: number; byte1: number; text: string };

export type StepResult =
  | { kind: "ok"; machine: Machine; text: string; wrote?: number }
  | { kind: "halted"; machine: Machine }
  | { kind: "fault"; machine: Machine; fault: Fault; text: string }
  /** IN with nothing to read: nothing changed, and the step can be retried once input arrives. */
  | { kind: "blocked"; machine: Machine; text: string };

const hex = (n: number) => `0x${n.toString(16).toUpperCase().padStart(2, "0")}`;
const isCodeAddress = (a: number) => a >= 0 && a <= CODE_END && a % 2 === 0;

/** Two bytes for one instruction: byte0 = opcode << 3 | Rd << 1, byte1 depends on the format. */
export function encode(name: Mnemonic, rd = 0, operand = 0): [number, number] {
  const { op, fmt } = INSTRUCTIONS[name];
  const byte1 = fmt === "R" ? (operand & 3) << 6 : fmt === "I" || fmt === "A" || fmt === "J" ? operand & 0xff : 0;
  return [(op << 3) | ((rd & 3) << 1), byte1];
}

/** Read two bytes as an instruction, checking every rule (reserved bits, register fields, jump targets). */
export function decode(byte0: number, byte1: number): { ok: true; d: Decoded } | { ok: false; fault: Fault } {
  const op = byte0 >> 3;
  const rd = (byte0 >> 1) & 3;
  const name = BY_OPCODE.get(op);
  if (!name) return { ok: false, fault: "INVALID_OPCODE" };
  const { fmt } = INSTRUCTIONS[name];
  const field =
    (byte0 & 1) !== 0 ||
    ((fmt === "J" || fmt === "N") && rd !== 0) ||
    (fmt === "R" && (byte1 & 0x3f) !== 0) ||
    ((fmt === "U" || fmt === "N") && byte1 !== 0) ||
    ((name === "SHL" || name === "SHR") && byte1 > 7);
  if (field) return { ok: false, fault: "INVALID_FIELD" };
  if (fmt === "J" && !isCodeAddress(byte1)) return { ok: false, fault: "BAD_PC" };
  return { ok: true, d: { name, rd, byte1, text: disassembleOne(name, rd, byte1) } };
}

function disassembleOne(name: Mnemonic, rd: number, byte1: number): string {
  const R = (n: number) => `R${n}`;
  switch (INSTRUCTIONS[name].fmt) {
    case "N":
      return name;
    case "U":
      return `${name} ${R(rd)}`;
    case "I":
      return `${name} ${R(rd)}, ${byte1}`;
    case "A":
      return `${name} ${R(rd)}, [${hex(byte1)}]`;
    case "R":
      return BRACKETED.has(name) ? `${name} ${R(rd)}, [${R(byte1 >> 6)}]` : `${name} ${R(rd)}, ${R(byte1 >> 6)}`;
    case "J":
      return `${name} ${hex(byte1)}`;
  }
}

/** The instructions in memory from 0 up to `end`, one line per address. */
export function disassemble(mem: number[], end = CODE_END): string[] {
  const lines: string[] = [];
  for (let a = 0; a <= end; a += 2) {
    const d = decode(mem[a], mem[a + 1]);
    lines.push(`${hex(a)}: ${d.ok ? d.d.text : "??"}`);
  }
  return lines;
}

function parseNumber(token: string, labels: Map<string, number>, line: number): number {
  const t = token.trim();
  if (labels.has(t)) return labels.get(t)!;
  const n = /^0x[0-9a-f]+$/i.test(t) ? parseInt(t, 16) : /^\d+$/.test(t) ? Number(t) : NaN;
  if (!Number.isInteger(n) || n < 0 || n > 255) throw new Error(`Line ${line}: "${token}" isn't a number from 0 to 255 or a label`);
  return n;
}

function parseRegister(token: string | undefined, line: number): number {
  const m = /^R([0-3])$/i.exec((token ?? "").trim());
  if (!m) throw new Error(`Line ${line}: expected a register R0 to R3, got "${token ?? ""}"`);
  return Number(m[1]);
}

/** Strip [ ] from a memory operand, which those instructions require. */
function unbracket(token: string | undefined, line: number): string {
  const m = /^\[(.+)\]$/.exec((token ?? "").trim());
  if (!m) throw new Error(`Line ${line}: expected a memory operand in brackets, like [0x80]`);
  return m[1];
}

/**
 * Assemble source into 256 bytes of memory, in two passes: the first finds each label's byte address
 * (two bytes per instruction, from 0), the second encodes every line. `data` sets bytes after the code.
 * Lines: `loop: DEC R0`, `JNZ loop`, `LDA R1, [0x80]`, `LDR R0, [R1]`; `;` starts a comment.
 */
export function assemble(source: string[], data: Record<string | number, number> = {}): number[] {
  // Pass one: where does each instruction go, and where is each label?
  const labels = new Map<string, number>();
  const lines: { text: string; line: number; at: number }[] = [];
  let at = 0;
  source.forEach((raw, i) => {
    let text = raw.replace(/;.*/, "").trim();
    const label = /^([A-Za-z_]\w*):\s*(.*)$/.exec(text);
    if (label) {
      if (labels.has(label[1])) throw new Error(`Line ${i}: label "${label[1]}" is defined twice`);
      labels.set(label[1], at);
      text = label[2].trim();
    }
    if (!text) return;
    lines.push({ text, line: i, at });
    at += 2;
  });
  if (at > CODE_END + 2) throw new Error(`The program is ${at / 2} instructions; at most ${(CODE_END + 2) / 2} fit`);

  // Pass two: encode each line with labels resolved.
  const mem = new Array<number>(MEMORY_SIZE).fill(0);
  for (const { text, line, at: addr } of lines) {
    const [head, ...rest] = text.split(/\s+/);
    const name = head.toUpperCase() as Mnemonic;
    if (!(name in INSTRUCTIONS)) throw new Error(`Line ${line}: no instruction called "${head}"`);
    const args = rest.join(" ").split(",").map((s) => s.trim()).filter(Boolean);
    const { fmt } = INSTRUCTIONS[name];
    const want = { N: 0, U: 1, I: 2, A: 2, R: 2, J: 1 }[fmt];
    if (args.length !== want) throw new Error(`Line ${line}: ${name} takes ${want} operand${want === 1 ? "" : "s"}`);
    let rd = 0;
    let operand = 0;
    if (fmt === "U") rd = parseRegister(args[0], line);
    if (fmt === "I") {
      rd = parseRegister(args[0], line);
      operand = parseNumber(args[1], labels, line);
      if ((name === "SHL" || name === "SHR") && operand > 7) throw new Error(`Line ${line}: shift by 0 to 7`);
    }
    if (fmt === "A") {
      rd = parseRegister(args[0], line);
      operand = parseNumber(unbracket(args[1], line), labels, line);
    }
    if (fmt === "R") {
      rd = parseRegister(args[0], line);
      operand = parseRegister(BRACKETED.has(name) ? unbracket(args[1], line) : args[1], line);
    }
    if (fmt === "J") {
      operand = parseNumber(args[0], labels, line);
      if (!isCodeAddress(operand)) throw new Error(`Line ${line}: ${hex(operand)} isn't an even address in 0x00 to 0x7E`);
    }
    [mem[addr], mem[addr + 1]] = encode(name, rd, operand);
  }
  for (const [a, value] of Object.entries(data)) {
    const addr = Number(a);
    if (!Number.isInteger(addr) || addr < 0 || addr >= MEMORY_SIZE) throw new Error(`No address ${a}`);
    if (addr < at) throw new Error(`Data at ${hex(addr)} would overwrite the program`);
    if (!Number.isInteger(value) || value < 0 || value > 255) throw new Error(`Address ${a}: a byte is 0 to 255`);
    mem[addr] = value;
  }
  return mem;
}

export function boot(mem: number[], input: number[] = []): Machine {
  return { mem: [...mem], r: [0, 0, 0, 0], pc: 0, sp: STACK_TOP, z: false, halted: false, out: [], input: [...input], steps: 0 };
}

/** Run one whole instruction. A fault or a blocked IN changes nothing at all. */
export function step(m: Machine): StepResult {
  if (m.halted) return { kind: "halted", machine: m };
  const fault = (f: Fault, text: string): StepResult => ({ kind: "fault", machine: m, fault: f, text });
  if (!isCodeAddress(m.pc)) return fault("BAD_PC", `The program counter, ${hex(m.pc)}, isn't an even address in the code area, so the CPU can't fetch from it.`);
  const decoded = decode(m.mem[m.pc], m.mem[m.pc + 1]);
  if (!decoded.ok) {
    const why = {
      INVALID_OPCODE: "isn't an instruction this CPU knows",
      INVALID_FIELD: "has a bit set that must be 0, or an operand out of range",
      BAD_PC: "jumps to an address that isn't an even address in the code area",
      STACK_OVERFLOW: "",
      STACK_UNDERFLOW: "",
    }[decoded.fault];
    return fault(decoded.fault, `The bytes at ${hex(m.pc)} ${why}, so the CPU stopped without changing anything.`);
  }
  const { name, rd, byte1, text } = decoded.d;
  const n: Machine = { ...m, mem: [...m.mem], r: [...m.r], out: [...m.out], input: [...m.input], steps: m.steps + 1 };
  const next = (m.pc + 2) & 0xff;
  n.pc = next;
  const rs = byte1 >> 6;
  const R = (i: number) => `R${i}`;
  const ok = (msg: string, wrote?: number): StepResult => ({ kind: "ok", machine: n, text: `${text}: ${msg}`, wrote });
  const setZ = (v: number) => {
    n.r[rd] = v & 0xff;
    n.z = n.r[rd] === 0;
  };

  switch (name) {
    case "NOP":
      return ok("did nothing.");
    case "LDI":
      n.r[rd] = byte1;
      return ok(`${R(rd)} = ${byte1}.`);
    case "LDA":
      n.r[rd] = n.mem[byte1];
      return ok(`loaded the byte at ${hex(byte1)} into ${R(rd)}: ${n.r[rd]}.`);
    case "STA":
      n.mem[byte1] = n.r[rd];
      return ok(`stored ${R(rd)} (${n.r[rd]}) at ${hex(byte1)}.`, byte1);
    case "MOV":
      n.r[rd] = n.r[rs];
      return ok(`copied ${R(rs)} into ${R(rd)}: ${n.r[rd]}.`);
    case "ADD":
      setZ(n.r[rd] + n.r[rs]);
      return ok(`${R(rd)} = ${n.r[rd]}${n.z ? ", so Z = 1" : ""}.`);
    case "SUB":
      setZ(n.r[rd] - n.r[rs]);
      return ok(`${R(rd)} = ${n.r[rd]}${n.z ? ", so Z = 1" : ""}.`);
    case "AND":
      setZ(n.r[rd] & n.r[rs]);
      return ok(`${R(rd)} = ${n.r[rd]}.`);
    case "OR":
      setZ(n.r[rd] | n.r[rs]);
      return ok(`${R(rd)} = ${n.r[rd]}.`);
    case "XOR":
      setZ(n.r[rd] ^ n.r[rs]);
      return ok(`${R(rd)} = ${n.r[rd]}.`);
    case "SHL":
      setZ(n.r[rd] << byte1);
      return ok(`${R(rd)} shifted left by ${byte1}: ${n.r[rd]}.`);
    case "SHR":
      setZ(n.r[rd] >> byte1);
      return ok(`${R(rd)} shifted right by ${byte1}: ${n.r[rd]}.`);
    case "CMP":
      n.z = n.r[rd] === n.r[rs];
      return ok(`${R(rd)} and ${R(rs)} are ${n.z ? "equal, so Z = 1" : "different, so Z = 0"}.`);
    case "CMPI":
      n.z = n.r[rd] === byte1;
      return ok(`${R(rd)} ${n.z ? "equals" : "isn't"} ${byte1}, so Z = ${n.z ? 1 : 0}.`);
    case "JMP":
      n.pc = byte1;
      return ok(`jumped to ${hex(byte1)}.`);
    case "JZ":
      if (n.z) n.pc = byte1;
      return ok(n.z ? `Z = 1, so it jumped to ${hex(byte1)}.` : "Z = 0, so it carried on.");
    case "JNZ":
      if (!n.z) n.pc = byte1;
      return ok(!n.z ? `Z = 0, so it jumped to ${hex(byte1)}.` : "Z = 1, so it carried on.");
    case "OUT":
      n.out.push(n.r[rd]);
      return ok(`sent ${n.r[rd]} to the output.`);
    case "IN":
      if (n.input.length === 0) return { kind: "blocked", machine: m, text: `${text}: no input yet, so it waits.` };
      n.r[rd] = n.input.shift()!;
      return ok(`read ${n.r[rd]} from the input into ${R(rd)}.`);
    case "PUSH":
      if (m.sp === STACK_BOTTOM) return fault("STACK_OVERFLOW", `${text}: the stack is full, so the CPU stopped without changing anything.`);
      n.sp = m.sp - 1;
      n.mem[n.sp] = n.r[rd];
      return ok(`pushed ${n.r[rd]}; SP = ${hex(n.sp)}.`, n.sp);
    case "POP":
      if (m.sp === STACK_TOP) return fault("STACK_UNDERFLOW", `${text}: the stack is empty, so the CPU stopped without changing anything.`);
      n.r[rd] = n.mem[m.sp];
      n.sp = m.sp + 1;
      return ok(`popped ${n.r[rd]} into ${R(rd)}; SP = ${hex(n.sp)}.`);
    case "CALL":
      if (!isCodeAddress(next)) return fault("BAD_PC", `${text}: there's no code address to return to after ${hex(m.pc)}.`);
      if (m.sp === STACK_BOTTOM) return fault("STACK_OVERFLOW", `${text}: the stack is full, so the CPU stopped without changing anything.`);
      n.sp = m.sp - 1;
      n.mem[n.sp] = next;
      n.pc = byte1;
      return ok(`saved the return address ${hex(next)} on the stack and jumped to ${hex(byte1)}.`, n.sp);
    case "RET": {
      if (m.sp === STACK_TOP) return fault("STACK_UNDERFLOW", `${text}: the stack is empty, so there's nowhere to return to.`);
      const back = m.mem[m.sp];
      if (!isCodeAddress(back)) return fault("BAD_PC", `${text}: the return address ${hex(back)} isn't a code address.`);
      n.sp = m.sp + 1;
      n.pc = back;
      return ok(`returned to ${hex(back)}.`);
    }
    case "HALT":
      n.halted = true;
      n.pc = m.pc;
      return ok("halted.");
    case "INC":
      setZ(n.r[rd] + 1);
      return ok(`${R(rd)} = ${n.r[rd]}${n.z ? ", so Z = 1" : ""}.`);
    case "DEC":
      setZ(n.r[rd] - 1);
      return ok(`${R(rd)} = ${n.r[rd]}${n.z ? ", so Z = 1" : ""}.`);
    case "LDR":
      n.r[rd] = n.mem[n.r[rs]];
      return ok(`loaded the byte at ${hex(n.r[rs])} (the address in ${R(rs)}) into ${R(rd)}: ${n.r[rd]}.`);
    case "STR":
      n.mem[n.r[rs]] = n.r[rd];
      return ok(`stored ${R(rd)} (${n.r[rd]}) at ${hex(n.r[rs])}, the address in ${R(rs)}.`, n.r[rs]);
    case "ADDI":
      setZ(n.r[rd] + byte1);
      return ok(`${R(rd)} = ${n.r[rd]}${n.z ? ", so Z = 1" : ""}.`);
    case "SUBI":
      setZ(n.r[rd] - byte1);
      return ok(`${R(rd)} = ${n.r[rd]}${n.z ? ", so Z = 1" : ""}.`);
  }
}

/** Step until HALT, a fault, a blocked IN, or `max` steps. */
export function run(
  m: Machine,
  max = MAX_STEPS,
): { machine: Machine; stop: "halted" | "fault" | "blocked" | "limit"; fault?: Fault } {
  let machine = m;
  while (!machine.halted && machine.steps < max) {
    const r = step(machine);
    if (r.kind === "fault") return { machine: r.machine, stop: "fault", fault: r.fault };
    if (r.kind === "blocked") return { machine: r.machine, stop: "blocked" };
    if (r.kind === "halted") break;
    machine = r.machine;
  }
  return { machine, stop: machine.halted ? "halted" : "limit" };
}
