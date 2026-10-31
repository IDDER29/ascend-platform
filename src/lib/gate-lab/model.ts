/**
 * The Gate Lab: circuits written as gate expressions, one wire per line ("SUM = A XOR B"), evaluated
 * over every input combination. Pure, so the lesson component, the projects and the tests agree.
 * Grammar: NOT (prefix), AND, NAND (bind tightest after NOT), XOR, then OR, NOR; parentheses; 0 and 1.
 */

export const GATES = ["NOT", "AND", "OR", "XOR", "NAND", "NOR"] as const;
export type GateName = (typeof GATES)[number];
export const MAX_INPUTS = 6;

type Node =
  | { kind: "const"; value: 0 | 1 }
  | { kind: "ref"; name: string }
  | { kind: "not"; arg: Node }
  | { kind: "bin"; op: Exclude<GateName, "NOT">; left: Node; right: Node };

export type Circuit = {
  wires: { name: string; expr: Node; line: number }[];
  /** Clocked registers' next values ("Q := expr"), taken all at once on each tick. */
  next: { name: string; expr: Node; line: number }[];
};
export type ParseResult = { ok: true; circuit: Circuit } | { ok: false; line: number; message: string };

const NAME = /^[A-Za-z_][A-Za-z0-9_]*$/;

function tokenize(text: string): string[] {
  return text.match(/\(|\)|[A-Za-z_][A-Za-z0-9_]*|[01]|\S/g) ?? [];
}

/** Parse one expression; `known` are the names it may use. Throws a readable message. */
function parseExpr(text: string, known: Set<string>): Node {
  const tokens = tokenize(text);
  let i = 0;
  const peek = () => tokens[i]?.toUpperCase();
  const binary = (next: () => Node, ops: string[]): Node => {
    let left = next();
    while (peek() && ops.includes(peek()!)) {
      const op = peek() as Exclude<GateName, "NOT">;
      i++;
      left = { kind: "bin", op, left, right: next() };
    }
    return left;
  };
  const atom = (): Node => {
    const t = tokens[i];
    if (t === undefined) throw new Error("the expression ends too early");
    if (t.toUpperCase() === "NOT") {
      i++;
      return { kind: "not", arg: atom() };
    }
    if (t === "(") {
      i++;
      const inner = or();
      if (tokens[i] !== ")") throw new Error("a bracket is opened but never closed");
      i++;
      return inner;
    }
    if (t === "0" || t === "1") {
      i++;
      return { kind: "const", value: t === "1" ? 1 : 0 };
    }
    if (NAME.test(t) && !(GATES as readonly string[]).includes(t.toUpperCase())) {
      if (!known.has(t)) throw new Error(`"${t}" isn't an input or a wire defined above this line`);
      i++;
      return { kind: "ref", name: t };
    }
    throw new Error(`didn't expect "${t}" here`);
  };
  const and = () => binary(atom, ["AND", "NAND"]);
  const xor = () => binary(and, ["XOR"]);
  const or = (): Node => binary(xor, ["OR", "NOR"]);
  const node = or();
  if (i < tokens.length) throw new Error(`didn't expect "${tokens[i]}" here`);
  return node;
}

/**
 * Parse circuit lines; blank lines and "#" comments are ignored. "NAME = expression" is a wire;
 * "REG := expression" (registers only) is the value REG takes on the next clock tick.
 */
export function parseCircuit(lines: string[], inputs: string[], registers: string[] = []): ParseResult {
  const known = new Set([...inputs, ...registers]);
  const wires: Circuit["wires"] = [];
  const next: Circuit["next"] = [];
  for (let n = 0; n < lines.length; n++) {
    const text = lines[n].replace(/#.*/, "").trim();
    if (!text) continue;
    const m = /^([A-Za-z_][A-Za-z0-9_]*)\s*(:?=)\s*(.+)$/.exec(text);
    if (!m) {
      return {
        ok: false,
        line: n + 1,
        message: registers.length
          ? 'write each line as NAME = expression, or REG := expression for a register'
          : 'write each line as NAME = expression, like "SUM = A XOR B"',
      };
    }
    const [, name, assign, body] = m;
    const fail = (message: string): ParseResult => ({ ok: false, line: n + 1, message });
    if (assign === ":=") {
      if (!registers.includes(name)) return fail(`${name} isn't a register, so use = for it, not :=`);
      if (next.some((w) => w.name === name)) return fail(`${name} is given its next value twice`);
    } else {
      if (inputs.includes(name)) return fail(`${name} is an input, so it can't be given a value`);
      if (registers.includes(name)) return fail(`${name} is a register: use ${name} := ... for its value after the tick`);
      if (wires.some((w) => w.name === name)) return fail(`${name} is defined twice`);
    }
    try {
      const expr = parseExpr(body, known);
      if (assign === ":=") next.push({ name, expr, line: n + 1 });
      else {
        wires.push({ name, expr, line: n + 1 });
        known.add(name);
      }
    } catch (e) {
      return fail(e instanceof Error ? e.message : "can't read this line");
    }
  }
  return { ok: true, circuit: { wires, next } };
}

function evalNode(node: Node, env: Map<string, number>): number {
  switch (node.kind) {
    case "const":
      return node.value;
    case "ref":
      return env.get(node.name)!;
    case "not":
      return evalNode(node.arg, env) ^ 1;
    case "bin": {
      const a = evalNode(node.left, env);
      const b = evalNode(node.right, env);
      return { AND: a & b, OR: a | b, XOR: a ^ b, NAND: (a & b) ^ 1, NOR: (a | b) ^ 1 }[node.op];
    }
  }
}

/** Every wire's value for one set of inputs. */
export function evaluate(circuit: Circuit, values: Record<string, number>): Record<string, number> {
  const env = new Map(Object.entries(values));
  for (const w of circuit.wires) env.set(w.name, evalNode(w.expr, env));
  return Object.fromEntries(env);
}

/** Every input combination in counting order: 00, 01, 10, 11 for two inputs (the first input is the high bit). */
export function inputRows(inputs: string[]): Record<string, number>[] {
  return Array.from({ length: 1 << inputs.length }, (_, row) =>
    Object.fromEntries(inputs.map((name, k) => [name, (row >> (inputs.length - 1 - k)) & 1])),
  );
}

/** How many gates the circuit uses, by kind (each NOT, AND, ... is one gate). */
export function gateCount(circuit: Circuit): { total: number; byGate: Partial<Record<GateName, number>> } {
  const byGate: Partial<Record<GateName, number>> = {};
  const visit = (node: Node) => {
    if (node.kind === "not") {
      byGate.NOT = (byGate.NOT ?? 0) + 1;
      visit(node.arg);
    } else if (node.kind === "bin") {
      byGate[node.op] = (byGate[node.op] ?? 0) + 1;
      visit(node.left);
      visit(node.right);
    }
  };
  for (const w of [...circuit.wires, ...circuit.next]) visit(w.expr);
  return { total: Object.values(byGate).reduce((a, b) => a + (b ?? 0), 0), byGate };
}

export type LabRow = { inputs: Record<string, number>; outputs: Record<string, number>; want: Record<string, number> | null; ok: boolean };

export type LabResult =
  | { ok: false; line: number; message: string }
  | {
      ok: true;
      rows: LabRow[];
      gates: { total: number; byGate: Partial<Record<GateName, number>> };
      /** Outputs no line defines yet. */
      missing: string[];
      /** Gates used that the lab doesn't allow. */
      disallowed: GateName[];
      /** Every row matches the target (and nothing is missing or disallowed). */
      solved: boolean;
    };

/**
 * Run a lab: the learner's lines against every input row, checked against the target expressions (if
 * any), with the gate rules applied.
 */
export function runLab(lab: {
  inputs: string[];
  outputs: string[];
  lines: string[];
  target?: Record<string, string>;
  allow?: GateName[];
}): LabResult {
  const parsed = parseCircuit(lab.lines, lab.inputs);
  if (!parsed.ok) return parsed;
  const { circuit } = parsed;
  const defined = new Set(circuit.wires.map((w) => w.name));
  const missing = lab.outputs.filter((o) => !defined.has(o));

  let reference: Circuit | null = null;
  if (lab.target) {
    const ref = parseCircuit(
      lab.outputs.map((o) => `${o} = ${lab.target![o] ?? "0"}`),
      lab.inputs,
    );
    if (!ref.ok) throw new Error(`The lab's own target is invalid: ${ref.message}`);
    reference = ref.circuit;
  }

  const rows = inputRows(lab.inputs).map((inputs): LabRow => {
    const all = evaluate(circuit, inputs);
    const outputs = Object.fromEntries(lab.outputs.map((o) => [o, all[o] ?? 0]));
    const want = reference ? Object.fromEntries(lab.outputs.map((o) => [o, evaluate(reference!, inputs)[o]])) : null;
    const ok = want ? lab.outputs.every((o) => defined.has(o) && outputs[o] === want[o]) : true;
    return { inputs, outputs, want, ok };
  });
  const gates = gateCount(circuit);
  const disallowed = lab.allow
    ? (Object.keys(gates.byGate) as GateName[]).filter((g) => !lab.allow!.includes(g))
    : [];
  return {
    ok: true,
    rows,
    gates,
    missing,
    disallowed,
    solved: reference !== null && missing.length === 0 && disallowed.length === 0 && rows.every((r) => r.ok),
  };
}

/**
 * Chain a one-bit circuit into a wider one, as a ripple-carry adder chains full adders: bit 0 first, each
 * bit's carry out feeding the next bit's carry in. `perBit` names inputs that take one bit of a number
 * (like A and B); `shared` inputs (like an operation code) are the same for every bit.
 */
export function chain(
  circuit: Circuit,
  opts: {
    bits: number;
    perBit: Record<string, number>;
    shared: Record<string, number>;
    carryIn: string;
    carryOut: string;
    output: string;
    firstCarry: number;
  },
): { value: number; carryOut: number; bitsOut: number[] } {
  let carry = opts.firstCarry;
  const bitsOut: number[] = [];
  for (let b = 0; b < opts.bits; b++) {
    const values: Record<string, number> = { ...opts.shared, [opts.carryIn]: carry };
    for (const [name, number] of Object.entries(opts.perBit)) values[name] = (number >> b) & 1;
    const out = evaluate(circuit, values);
    bitsOut.push(out[opts.output] ?? 0);
    carry = out[opts.carryOut] ?? 0;
  }
  return { value: bitsOut.reduce((v, bit, b) => v | (bit << b), 0), carryOut: carry, bitsOut };
}

export type ClockRow = {
  tick: number;
  inputs: Record<string, number>;
  /** Registers after the tick, and any watched wires for that new state. */
  after: Record<string, number>;
  want: Record<string, number> | null;
  ok: boolean;
};

/** One clock tick: wires settle from the inputs and current registers, then every register takes its next value at once. */
export function tick(circuit: Circuit, regs: Record<string, number>, inputs: Record<string, number>): {
  regs: Record<string, number>;
  wires: Record<string, number>;
} {
  const wires = evaluate(circuit, { ...inputs, ...regs });
  const env = new Map(Object.entries(wires));
  const next = { ...regs };
  for (const n of circuit.next) next[n.name] = evalNode(n.expr, env);
  return { regs: next, wires };
}

export type ClockResult =
  | { ok: false; line: number; message: string }
  | { ok: true; rows: ClockRow[]; gates: ReturnType<typeof gateCount>; solved: boolean };

/** Run a clocked lab over its ticks, comparing every register (and watched wire) after each tick with the target's. */
export function runClocked(lab: {
  inputs: string[];
  registers: string[];
  init?: Record<string, number>;
  lines: string[];
  ticks: Record<string, number>[];
  target?: string[];
  watch?: string[];
}): ClockResult {
  const parsed = parseCircuit(lab.lines, lab.inputs, lab.registers);
  if (!parsed.ok) return parsed;
  let reference: Circuit | null = null;
  if (lab.target) {
    const ref = parseCircuit(lab.target, lab.inputs, lab.registers);
    if (!ref.ok) throw new Error(`The lab's own target is invalid: line ${ref.line}, ${ref.message}`);
    reference = ref.circuit;
  }
  const start = Object.fromEntries(lab.registers.map((r) => [r, lab.init?.[r] ?? 0]));
  let mine = { ...start };
  let theirs = { ...start };
  const shown = [...lab.registers, ...(lab.watch ?? [])];
  const rows = lab.ticks.map((inputs, i): ClockRow => {
    // Watched wires are shown for the state after the tick, so each row reads as one moment.
    const a = tick(parsed.circuit, mine, inputs);
    mine = a.regs;
    const wiresAfter = evaluate(parsed.circuit, { ...inputs, ...mine });
    const after = Object.fromEntries(shown.map((n) => [n, n in mine ? mine[n] : (wiresAfter[n] ?? 0)]));
    let want: Record<string, number> | null = null;
    if (reference) {
      theirs = tick(reference, theirs, inputs).regs;
      const refWires = evaluate(reference, { ...inputs, ...theirs });
      want = Object.fromEntries(shown.map((n) => [n, n in theirs ? theirs[n] : (refWires[n] ?? 0)]));
    }
    return { tick: i + 1, inputs, after, want, ok: want ? shown.every((n) => after[n] === want![n]) : true };
  });
  return { ok: true, rows, gates: gateCount(parsed.circuit), solved: reference !== null && rows.every((r) => r.ok) };
}
