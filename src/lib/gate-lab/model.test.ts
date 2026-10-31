import assert from "node:assert/strict";
import { test } from "node:test";
import { chain, gateCount, inputRows, parseCircuit, runLab } from "./model";

const table = (lines: string[], inputs: string[], out: string) =>
  runLab({ inputs, outputs: [out], lines }).ok
    ? (runLab({ inputs, outputs: [out], lines }) as Extract<ReturnType<typeof runLab>, { ok: true }>).rows.map(
        (r) => r.outputs[out],
      )
    : null;

test("every gate's truth table, rows in counting order", () => {
  assert.deepEqual(inputRows(["A", "B"]), [
    { A: 0, B: 0 },
    { A: 0, B: 1 },
    { A: 1, B: 0 },
    { A: 1, B: 1 },
  ]);
  assert.deepEqual(table(["Y = A AND B"], ["A", "B"], "Y"), [0, 0, 0, 1]);
  assert.deepEqual(table(["Y = A OR B"], ["A", "B"], "Y"), [0, 1, 1, 1]);
  assert.deepEqual(table(["Y = A XOR B"], ["A", "B"], "Y"), [0, 1, 1, 0]);
  assert.deepEqual(table(["Y = A NAND B"], ["A", "B"], "Y"), [1, 1, 1, 0]);
  assert.deepEqual(table(["Y = A NOR B"], ["A", "B"], "Y"), [1, 0, 0, 0]);
  assert.deepEqual(table(["Y = NOT A"], ["A"], "Y"), [1, 0]);
});

test("precedence: NOT, then AND, then XOR, then OR; brackets override", () => {
  // A OR B AND C is A OR (B AND C)
  assert.deepEqual(table(["Y = A OR B AND C"], ["A", "B", "C"], "Y"), table(["Y = A OR (B AND C)"], ["A", "B", "C"], "Y"));
  assert.notDeepEqual(table(["Y = (A OR B) AND C"], ["A", "B", "C"], "Y"), table(["Y = A OR B AND C"], ["A", "B", "C"], "Y"));
  assert.deepEqual(table(["Y = NOT A AND B"], ["A", "B"], "Y"), [0, 1, 0, 0]);
  assert.deepEqual(table(["Y = A XOR B OR C"], ["A", "B", "C"], "Y"), table(["Y = (A XOR B) OR C"], ["A", "B", "C"], "Y"));
});

test("wires, constants, comments and case", () => {
  assert.deepEqual(table(["N = a nand b  # a comment", "Y = N nand N"], ["a", "b"], "Y"), [0, 0, 0, 1]);
  assert.deepEqual(table(["Y = A AND 1"], ["A"], "Y"), [0, 1]);
});

test("errors say which line and why", () => {
  const r = parseCircuit(["X = A AND", "Y = X"], ["A"]);
  assert.equal(r.ok, false);
  if (!r.ok) assert.equal(r.line, 1);
  const later = parseCircuit(["Y = Z", "Z = A"], ["A"]);
  assert.ok(!later.ok && /defined above/.test(later.message));
  assert.ok(!parseCircuit(["A = 1"], ["A"]).ok);
  assert.ok(!parseCircuit(["Y = (A"], ["A"]).ok);
  assert.ok(!parseCircuit(["Y = A A"], ["A"]).ok);
  assert.ok(!parseCircuit(["just words"], ["A"]).ok);
});

test("a lab checks every row against its target, counts gates and enforces the allowed ones", () => {
  const nandXor = [
    "N = A NAND B",
    "P = A NAND N",
    "Q = B NAND N",
    "OUT = P NAND Q",
  ];
  const lab = runLab({ inputs: ["A", "B"], outputs: ["OUT"], lines: nandXor, target: { OUT: "A XOR B" }, allow: ["NAND"] });
  assert.ok(lab.ok && lab.solved);
  if (lab.ok) assert.deepEqual(lab.gates, { total: 4, byGate: { NAND: 4 } });

  const wrong = runLab({ inputs: ["A", "B"], outputs: ["OUT"], lines: ["OUT = A OR B"], target: { OUT: "A XOR B" } });
  assert.ok(wrong.ok && !wrong.solved);
  if (wrong.ok) assert.deepEqual(wrong.rows.map((r) => r.ok), [true, true, true, false]);

  const cheat = runLab({ inputs: ["A", "B"], outputs: ["OUT"], lines: ["OUT = A XOR B"], target: { OUT: "A XOR B" }, allow: ["NAND"] });
  assert.ok(cheat.ok && !cheat.solved);
  if (cheat.ok) assert.deepEqual(cheat.disallowed, ["XOR"]);

  const missing = runLab({ inputs: ["A", "B"], outputs: ["S", "C"], lines: ["S = A XOR B"], target: { S: "A XOR B", C: "A AND B" } });
  assert.ok(missing.ok && !missing.solved);
  if (missing.ok) assert.deepEqual(missing.missing, ["C"]);
});

test("a 1-bit full adder chained 8 times adds bytes, carry and all", () => {
  const fa = parseCircuit(["S = A XOR B XOR CIN", "COUT = (A AND B) OR (CIN AND (A XOR B))"], ["A", "B", "CIN"]);
  assert.ok(fa.ok);
  if (!fa.ok) return;
  for (const [a, b] of [
    [28, 14],
    [200, 100],
    [255, 1],
    [0, 0],
  ]) {
    const r = chain(fa.circuit, { bits: 8, perBit: { A: a, B: b }, shared: {}, carryIn: "CIN", carryOut: "COUT", output: "S", firstCarry: 0 });
    assert.equal(r.value, (a + b) & 0xff);
    assert.equal(r.carryOut, a + b > 255 ? 1 : 0);
  }
  assert.equal(gateCount(fa.circuit).total, 6);
});

// The two Logic & Circuits projects: their targets and model answers must be right.
const ALU_TARGET = {
  OUT: "((A XOR (B XOR OP0) XOR CIN) AND NOT OP1) OR (((A AND B AND NOT OP0) OR ((A OR B) AND OP0)) AND OP1)",
  COUT: "(A AND (B XOR OP0)) OR (CIN AND (A XOR (B XOR OP0)))",
};

test("the ALU project's target, chained 8 times, adds, subtracts, ANDs and ORs bytes", () => {
  const alu = parseCircuit(
    Object.entries(ALU_TARGET).map(([k, v]) => `${k} = ${v}`),
    ["A", "B", "CIN", "OP1", "OP0"],
  );
  assert.ok(alu.ok);
  if (!alu.ok) return;
  const ops: [number, number, (a: number, b: number) => number][] = [
    [0, 0, (a, b) => a + b],
    [0, 1, (a, b) => a - b],
    [1, 0, (a, b) => a & b],
    [1, 1, (a, b) => a | b],
  ];
  for (const [op1, op0, f] of ops) {
    for (const [a, b] of [
      [28, 14],
      [200, 100],
      [3, 5],
      [12, 10],
      [255, 255],
    ]) {
      const r = chain(alu.circuit, {
        bits: 8,
        perBit: { A: a, B: b },
        shared: { OP1: op1, OP0: op0 },
        carryIn: "CIN",
        carryOut: "COUT",
        output: "OUT",
        firstCarry: op0,
      });
      assert.equal(r.value, f(a, b) & 0xff, `op ${op1}${op0} on ${a}, ${b}`);
    }
  }
});

test("the gate workbench's NAND-only answers solve their labs", () => {
  const nandOnly = (lines: string[], target: string, inputs = ["A", "B"]) => {
    const r = runLab({ inputs, outputs: ["OUT"], lines, target: { OUT: target }, allow: ["NAND"] });
    return r.ok && r.solved ? r.gates.total : null;
  };
  assert.equal(nandOnly(["OUT = A NAND A"], "NOT A", ["A"]), 1);
  assert.equal(nandOnly(["N = A NAND B", "OUT = N NAND N"], "A AND B"), 2);
  assert.equal(nandOnly(["NA = A NAND A", "NB = B NAND B", "OUT = NA NAND NB"], "A OR B"), 3);
  assert.equal(nandOnly(["N = A NAND B", "P = A NAND N", "Q = B NAND N", "OUT = P NAND Q"], "A XOR B"), 4);
  assert.equal(
    nandOnly(["NS = S NAND S", "X = A NAND NS", "Y = B NAND S", "OUT = X NAND Y"], "(A AND NOT S) OR (B AND S)", ["A", "B", "S"]),
    4,
  );
});
