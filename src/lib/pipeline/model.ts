/**
 * A classic five-stage in-order pipeline (IF ID EX MEM WB), for Computer Architect's Pipelining course.
 * The program is a small RISC-V subset; it is first run for its results (registers, memory and the
 * real path through branches), then timed cycle by cycle with the chosen hazard handling:
 *  - forwarding on: a result can be used by the next instruction's EX straight away, except a load's,
 *    which arrives a cycle later (the load-use stall); off: sources are read in ID, after the producer's WB.
 *  - branches are resolved in EX; "stall" fetches nothing until then, "predict-not-taken" keeps fetching
 *    the next instructions and flushes them if the branch is taken.
 * Pure and deterministic.
 */

export type Op = "add" | "sub" | "and" | "or" | "slt" | "addi" | "lw" | "sw" | "beq" | "bne" | "nop";
export type Instr = { op: Op; rd: number; rs1: number; rs2: number; imm: number; target: string | null; text: string; line: number };
export type BranchPolicy = "stall" | "predict-not-taken";
export type PipelineOptions = { forwarding: boolean; branch: BranchPolicy };

export const MAX_DYNAMIC = 60;
export const STAGES = ["IF", "ID", "EX", "MEM", "WB"] as const;

const R_OPS = new Set<Op>(["add", "sub", "and", "or", "slt"]);

export type ParseResult = { ok: true; program: Instr[]; labels: Record<string, number> } | { ok: false; line: number; message: string };

function reg(t: string): number {
  const m = /^x([0-9]|[12][0-9]|3[01])$/.exec(t.trim());
  if (!m) throw new Error(`"${t.trim()}" isn't a register (x0 to x31)`);
  return Number(m[1]);
}
function num(t: string): number {
  const n = Number(t.trim());
  if (!Number.isInteger(n) || n < -2048 || n > 2047) throw new Error(`"${t.trim()}" isn't a whole number from -2048 to 2047`);
  return n;
}

export function parseProgram(lines: string[]): ParseResult {
  const program: Instr[] = [];
  const labels: Record<string, number> = {};
  const pending: { line: number; text: string; label: string | null }[] = [];
  for (let i = 0; i < lines.length; i++) {
    let t = lines[i].replace(/#.*/, "").trim();
    if (!t) continue;
    const lm = /^([A-Za-z_]\w*):\s*(.*)$/.exec(t);
    if (lm) {
      if (labels[lm[1]] !== undefined) return { ok: false, line: i + 1, message: `the label "${lm[1]}" is used twice` };
      labels[lm[1]] = pending.length;
      t = lm[2].trim();
      if (!t) continue;
    }
    pending.push({ line: i + 1, text: t, label: null });
  }
  for (const p of pending) {
    try {
      const [mn, ...rest] = p.text.split(/\s+/);
      const op = mn.toLowerCase() as Op;
      const args = rest.join(" ").split(",").map((a) => a.trim()).filter(Boolean);
      const need = (n: number) => {
        if (args.length !== n) throw new Error(`${op} takes ${n} operands`);
      };
      const base: Instr = { op, rd: 0, rs1: 0, rs2: 0, imm: 0, target: null, text: p.text.replace(/\s+/g, " "), line: p.line };
      if (R_OPS.has(op)) {
        need(3);
        program.push({ ...base, rd: reg(args[0]), rs1: reg(args[1]), rs2: reg(args[2]) });
      } else if (op === "addi") {
        need(3);
        program.push({ ...base, rd: reg(args[0]), rs1: reg(args[1]), imm: num(args[2]) });
      } else if (op === "lw" || op === "sw") {
        need(2);
        const m = /^(-?\d+)\((x\d+)\)$/.exec(args[1].replace(/\s+/g, ""));
        if (!m) throw new Error(`${op} needs an address like 8(x2)`);
        const r = reg(args[0]);
        program.push(op === "lw" ? { ...base, rd: r, rs1: reg(m[2]), imm: num(m[1]) } : { ...base, rs2: r, rs1: reg(m[2]), imm: num(m[1]) });
      } else if (op === "beq" || op === "bne") {
        need(3);
        if (labels[args[2]] === undefined) throw new Error(`there's no label "${args[2]}"`);
        program.push({ ...base, rs1: reg(args[0]), rs2: reg(args[1]), target: args[2] });
      } else if (op === "nop") {
        need(0);
        program.push(base);
      } else {
        throw new Error(`"${mn}" isn't an instruction this pipeline knows`);
      }
    } catch (e) {
      return { ok: false, line: p.line, message: e instanceof Error ? e.message : "can't read this line" };
    }
  }
  return { ok: true, program, labels };
}

/** Which registers an instruction reads, and which it writes (x0 is never a dependency). */
export function sources(i: Instr): number[] {
  const s = R_OPS.has(i.op) || i.op === "sw" || i.op === "beq" || i.op === "bne" ? [i.rs1, i.rs2] : i.op === "addi" || i.op === "lw" ? [i.rs1] : [];
  return s.filter((r) => r !== 0);
}
export function dest(i: Instr): number | null {
  return (R_OPS.has(i.op) || i.op === "addi" || i.op === "lw") && i.rd !== 0 ? i.rd : null;
}

export type Executed = { regs: number[]; mem: Record<number, number>; path: number[]; taken: boolean[]; stopped: "done" | "limit" | "bad-address" };

/** Run the program for its results and its real path (indices into the program). */
export function execute(program: Instr[], labels: Record<string, number>, data: Record<number, number> = {}): Executed {
  const regs = new Array(32).fill(0);
  const mem: Record<number, number> = { ...data };
  const path: number[] = [];
  const taken: boolean[] = [];
  let pc = 0;
  while (pc < program.length) {
    if (path.length >= MAX_DYNAMIC) return { regs, mem, path, taken, stopped: "limit" };
    const i = program[pc];
    path.push(pc);
    let next = pc + 1;
    let t = false;
    const a = regs[i.rs1];
    const b = regs[i.rs2];
    const set = (v: number) => {
      if (i.rd !== 0) regs[i.rd] = v | 0;
    };
    switch (i.op) {
      case "add": set(a + b); break;
      case "sub": set(a - b); break;
      case "and": set(a & b); break;
      case "or": set(a | b); break;
      case "slt": set(a < b ? 1 : 0); break;
      case "addi": set(a + i.imm); break;
      case "lw":
      case "sw": {
        const addr = a + i.imm;
        if (addr % 4 !== 0 || addr < 0) {
          taken.push(false);
          return { regs, mem, path, taken, stopped: "bad-address" };
        }
        if (i.op === "lw") set(mem[addr] ?? 0);
        else mem[addr] = b;
        break;
      }
      case "beq":
      case "bne":
        t = i.op === "beq" ? a === b : a !== b;
        if (t) next = labels[i.target!];
        break;
      case "nop": break;
    }
    taken.push(t);
    pc = next;
  }
  return { regs, mem, path, taken, stopped: "done" };
}

export type Cell = "IF" | "ID" | "EX" | "MEM" | "WB" | "stall";
export type Row = {
  /** Index into the program, or null for a flushed instruction past the end. */
  pc: number | null;
  text: string;
  /** cells[c] is what this instruction does in cycle c + 1 (null: not in the pipeline). */
  cells: (Cell | null)[];
  flushed: boolean;
  /** For a stall, why: the register it waited for, or "branch". */
  note: string | null;
};
export type Timing = {
  rows: Row[];
  cycles: number;
  instructions: number;
  /** Cycles an instruction waited in ID for a register. */
  stalls: number;
  /** Cycles nothing was fetched because a branch hadn't resolved (branch policy "stall"). */
  bubbles: number;
  /** Wrong-path instructions thrown away after a taken branch (policy "predict-not-taken"). */
  flushes: number;
};

export function time(program: Instr[], exec: Executed, opts: PipelineOptions): Timing {
  type T = { IF: number; ID: number; EX: number; MEM: number; WB: number };
  const t: T[] = [];
  const rows: Row[] = [];
  let stalls = 0;
  let bubbles = 0;
  let flushes = 0;
  let nextIF = 1;
  const lastWriter = new Map<number, number>(); // register -> index into t
  for (let k = 0; k < exec.path.length; k++) {
    const pc = exec.path[k];
    const ins = program[pc];
    const prev = t[k - 1];
    const IF = nextIF;
    const ID = Math.max(IF + 1, prev ? prev.EX : 0);
    let ready = 0;
    let waitedFor: number | null = null;
    for (const r of sources(ins)) {
      const w = lastWriter.get(r);
      if (w === undefined) continue;
      const p = t[w];
      const producer = program[exec.path[w]];
      const need = opts.forwarding ? (producer.op === "lw" ? p.MEM + 1 : p.EX + 1) : p.WB + 1;
      if (need > ready) {
        ready = need;
        waitedFor = r;
      }
    }
    const EX = Math.max(ID + 1, prev ? prev.MEM : 0, ready);
    const MEM = EX + 1;
    const WB = MEM + 1;
    t.push({ IF, ID, EX, MEM, WB });
    const d = dest(ins);
    if (d !== null) lastWriter.set(d, k);

    const cells: (Cell | null)[] = [];
    for (let c = IF; c < ID; c++) cells[c - 1] = c === IF ? "IF" : "stall";
    for (let c = ID; c < EX; c++) cells[c - 1] = c === ID ? "ID" : "stall";
    cells[EX - 1] = "EX";
    cells[MEM - 1] = "MEM";
    cells[WB - 1] = "WB";
    const stalledHere = EX - ID - 1;
    stalls += stalledHere;
    rows.push({ pc, text: ins.text, cells, flushed: false, note: stalledHere > 0 && waitedFor !== null ? `waits for x${waitedFor}` : null });

    // The next fetch: when this one has left IF, or after a branch resolves in EX.
    nextIF = ID;
    if (ins.op === "beq" || ins.op === "bne") {
      const resolved = EX + 1;
      if (opts.branch === "stall") {
        bubbles += resolved - ID; // fetch waits from when the branch reaches ID until it resolves
        nextIF = resolved;
      } else if (exec.taken[k]) {
        // The two instructions after the branch were fetched on the guess "not taken", then flushed.
        const wrong = [pc + 1, pc + 2].map((w) => (w < program.length ? w : null));
        const first: (Cell | null)[] = [];
        for (let c = ID; c < EX; c++) first[c - 1] = c === ID ? "IF" : "stall";
        first[EX - 1] = "ID";
        const second: (Cell | null)[] = [];
        second[EX - 1] = "IF";
        [first, second].forEach((cells, n) =>
          rows.push({
            pc: wrong[n],
            text: wrong[n] !== null ? program[wrong[n]!].text : "(past the end)",
            cells,
            flushed: true,
            note: null,
          }),
        );
        flushes += 2;
        nextIF = resolved;
      }
    }
  }
  const cycles = t.length ? t[t.length - 1].WB : 0;
  return { rows, cycles, instructions: exec.path.length, stalls, bubbles, flushes };
}

export type PipelineRun =
  | { ok: true; program: Instr[]; exec: Executed; timing: Timing }
  | { ok: false; line: number; message: string };

export function runPipeline(lines: string[], opts: PipelineOptions, data: Record<number, number> = {}): PipelineRun {
  const p = parseProgram(lines);
  if (!p.ok) return p;
  const exec = execute(p.program, p.labels, data);
  return { ok: true, program: p.program, exec, timing: time(p.program, exec, opts) };
}
