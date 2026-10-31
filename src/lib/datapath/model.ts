/**
 * The tiny CPU's datapath, one clock tick at a time, driven by Ben Eater's control signals. Each tick,
 * at most one part puts a value on the bus (CO, RO, IO, AO, EO) and every "in" signal loads it, all from
 * the values before the tick. A control table (microcode) of these signals, per opcode and step, is the
 * control unit; `runMicrocode` runs a program on any table, so a learner's table can be checked against
 * the reference simulator in `src/lib/tiny-cpu/machine.ts`.
 */

export const SIGNALS = ["CO", "RO", "IO", "AO", "EO", "MI", "RI", "II", "AI", "BI", "OI", "CE", "J", "SU", "FI", "HLT"] as const;
export type Signal = (typeof SIGNALS)[number];
export const OUT_SIGNALS: Signal[] = ["CO", "RO", "IO", "AO", "EO"];
const IN_SIGNALS: Signal[] = ["MI", "RI", "II", "AI", "BI", "OI", "J"];

export const SIGNAL_MEANING: Record<Signal, string> = {
  CO: "program counter out",
  RO: "RAM out (the box MAR points at)",
  IO: "instruction register out (its low 4 bits)",
  AO: "A out",
  EO: "ALU out (A + B, or A - B with SU)",
  MI: "memory address register in",
  RI: "RAM in (writes the box MAR points at)",
  II: "instruction register in",
  AI: "A in",
  BI: "B in",
  OI: "output in (the display)",
  CE: "program counter + 1",
  J: "jump: program counter in",
  SU: "subtract instead of add",
  FI: "flags in, from the ALU",
  HLT: "halt",
};

export type Datapath = {
  mem: number[];
  pc: number;
  mar: number;
  ir: number;
  a: number;
  b: number;
  carry: boolean;
  zero: boolean;
  out: number[];
  halted: boolean;
  ticks: number;
};

export function bootDatapath(mem: number[]): Datapath {
  return { mem: [...mem], pc: 0, mar: 0, ir: 0, a: 0, b: 0, carry: false, zero: false, out: [], halted: false, ticks: 0 };
}

/** What the ALU computes right now (it always computes; EO decides whether anyone sees it). */
export function alu(d: Datapath, subtract: boolean): { value: number; carry: boolean } {
  const sum = subtract ? d.a + (~d.b & 0xff) + 1 : d.a + d.b;
  return { value: sum & 0xff, carry: sum > 0xff };
}

export type TickOutcome = { ok: true; d: Datapath; bus: number | null } | { ok: false; error: string };

/** One clock tick with these signals on. Nothing changes if the signals clash. */
export function tickDatapath(d: Datapath, on: Signal[]): TickOutcome {
  const set = new Set(on);
  const outs = OUT_SIGNALS.filter((s) => set.has(s));
  if (outs.length > 1) return { ok: false, error: `${outs.join(" and ")} both try to put a value on the bus` };
  const ins = IN_SIGNALS.filter((s) => set.has(s));
  if (set.has("J") && set.has("CE")) return { ok: false, error: "J and CE both try to change the program counter" };
  const result = alu(d, set.has("SU"));
  const bus =
    outs[0] === "CO"
      ? d.pc
      : outs[0] === "RO"
        ? d.mem[d.mar]
        : outs[0] === "IO"
          ? d.ir & 0xf
          : outs[0] === "AO"
            ? d.a
            : outs[0] === "EO"
              ? result.value
              : null;
  if (ins.length > 0 && bus === null) return { ok: false, error: `${ins.join(" and ")} load from the bus, but nothing is on it` };

  const n: Datapath = { ...d, mem: [...d.mem], out: [...d.out], ticks: d.ticks + 1 };
  if (bus !== null) {
    if (set.has("MI")) n.mar = bus & 0xf;
    if (set.has("RI")) n.mem[d.mar] = bus;
    if (set.has("II")) n.ir = bus;
    if (set.has("AI")) n.a = bus;
    if (set.has("BI")) n.b = bus;
    if (set.has("OI")) n.out.push(bus);
    if (set.has("J")) n.pc = bus & 0xf;
  }
  if (set.has("CE")) n.pc = (d.pc + 1) & 0xf;
  if (set.has("FI")) {
    n.carry = result.carry;
    n.zero = result.value === 0;
  }
  if (set.has("HLT")) n.halted = true;
  return { ok: true, d: n, bus };
}

/** One step of an instruction: its signals, and an optional flag it depends on (a conditional jump). */
export type MicroStep = { signals: Signal[]; when?: "C" | "Z" };
export type Microcode = { fetch: MicroStep[]; ops: Partial<Record<string, MicroStep[]>> };

const OPCODE_NAMES: Record<number, string> = {
  0: "NOP", 1: "LDA", 2: "ADD", 3: "SUB", 4: "STA", 5: "LDI", 6: "JMP", 7: "JC", 8: "JZ", 14: "OUT", 15: "HLT",
};
export const OPCODE_OF = Object.fromEntries(Object.entries(OPCODE_NAMES).map(([k, v]) => [v, Number(k)]));

export type ParseMicro = { ok: true; micro: Microcode } | { ok: false; line: number; message: string };

/**
 * Read a control table: one line per instruction, steps separated by "|", signals by spaces, and
 * "if C" or "if Z" at the end of a step that only happens when that flag is set:
 *   FETCH: CO MI | RO II CE
 *   JZ: IO J if Z
 */
export function parseMicrocode(lines: string[]): ParseMicro {
  const micro: Microcode = { fetch: [], ops: {} };
  let sawFetch = false;
  for (let i = 0; i < lines.length; i++) {
    const text = lines[i].replace(/#.*/, "").trim();
    if (!text) continue;
    const m = /^([A-Za-z]+)\s*:\s*(.*)$/.exec(text);
    if (!m) return { ok: false, line: i + 1, message: 'write each line as NAME: signals | signals, like "LDA: IO MI | RO AI"' };
    const name = m[1].toUpperCase();
    if (name !== "FETCH" && !(name in OPCODE_OF)) return { ok: false, line: i + 1, message: `there's no instruction called ${m[1]}` };
    const steps: MicroStep[] = [];
    for (const part of m[2].split("|").map((p) => p.trim())) {
      if (!part) continue;
      const words = part.toUpperCase().split(/\s+/);
      let when: MicroStep["when"];
      const ifAt = words.indexOf("IF");
      if (ifAt >= 0) {
        const flag = words[ifAt + 1];
        if ((flag !== "C" && flag !== "Z") || words.length !== ifAt + 2) {
          return { ok: false, line: i + 1, message: 'a condition is written "if C" or "if Z" at the end of a step' };
        }
        when = flag;
        words.splice(ifAt, 2);
      }
      for (const w of words) {
        if (!(SIGNALS as readonly string[]).includes(w)) return { ok: false, line: i + 1, message: `${w} isn't a control signal` };
      }
      steps.push({ signals: words as Signal[], when });
    }
    if (name === "FETCH") {
      if (sawFetch) return { ok: false, line: i + 1, message: "FETCH is given twice" };
      sawFetch = true;
      micro.fetch = steps;
    } else {
      if (micro.ops[name]) return { ok: false, line: i + 1, message: `${name} is given twice` };
      micro.ops[name] = steps;
    }
  }
  if (!sawFetch) return { ok: false, line: lines.length, message: "the table needs a FETCH line" };
  return { ok: true, micro };
}

/** The control table Ben Eater's computer uses (and the tiny CPU in these lessons). */
export const REFERENCE_MICROCODE = [
  "FETCH: CO MI | RO II CE",
  "NOP:",
  "LDA: IO MI | RO AI",
  "ADD: IO MI | RO BI | EO AI FI",
  "SUB: IO MI | RO BI | EO AI SU FI",
  "STA: IO MI | AO RI",
  "LDI: IO AI",
  "JMP: IO J",
  "JC: IO J if C",
  "JZ: IO J if Z",
  "OUT: AO OI",
  "HLT: HLT",
];

export type TraceRow = { tick: number; instruction: string; step: number; signals: Signal[]; bus: number | null };
export type MicroRun = {
  d: Datapath;
  instructions: number;
  error: string | null;
  stoppedEarly: boolean;
  trace: TraceRow[];
};

/**
 * Run a program on a control table: each instruction is the fetch steps, then its own steps; a step whose
 * flag isn't set is a tick with no signals. With `fixedSteps`, every instruction is padded with empty ticks
 * to that many (the simple design that wastes ticks); otherwise the next instruction starts at once.
 */
export function runMicrocode(
  mem: number[],
  micro: Microcode,
  opts: { fixedSteps?: number; maxTicks?: number } = {},
): MicroRun {
  const maxTicks = opts.maxTicks ?? 2000;
  let d = bootDatapath(mem);
  let instructions = 0;
  const trace: TraceRow[] = [];
  const run = (steps: MicroStep[], instruction: string, offset: number): string | null => {
    for (let s = 0; s < steps.length; s++) {
      const step = steps[s];
      const active = !step.when || (step.when === "C" ? d.carry : d.zero);
      const r = tickDatapath(d, active ? step.signals : []);
      if (!r.ok) return `${instruction}, step ${offset + s}: ${r.error}`;
      d = r.d;
      if (trace.length < 400) trace.push({ tick: d.ticks, instruction, step: offset + s, signals: active ? step.signals : [], bus: r.bus });
      if (d.halted || d.ticks >= maxTicks) return null;
    }
    return null;
  };
  while (!d.halted && d.ticks < maxTicks) {
    const fetchError = run(micro.fetch, "fetch", 0);
    if (fetchError) return { d, instructions, error: fetchError, stoppedEarly: false, trace };
    if (d.halted || d.ticks >= maxTicks) break;
    const name = OPCODE_NAMES[d.ir >> 4];
    const steps = name ? micro.ops[name] : undefined;
    if (!steps) {
      return { d, instructions, error: `there's no control table line for ${name ?? `opcode ${d.ir >> 4}`}`, stoppedEarly: false, trace };
    }
    const err = run(steps, name, micro.fetch.length);
    if (err) return { d, instructions, error: err, stoppedEarly: false, trace };
    instructions++;
    if (opts.fixedSteps) {
      const used = micro.fetch.length + steps.length;
      for (let k = used; k < opts.fixedSteps && !d.halted; k++) {
        const r = tickDatapath(d, []);
        if (r.ok) d = r.d;
      }
    }
  }
  return { d, instructions, error: null, stoppedEarly: !d.halted, trace };
}
