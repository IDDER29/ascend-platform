import assert from "node:assert/strict";
import { test } from "node:test";
import { parseProgram, runPipeline, type PipelineOptions } from "./model";

const FWD: PipelineOptions = { forwarding: true, branch: "predict-not-taken" };
const NOFWD: PipelineOptions = { forwarding: false, branch: "predict-not-taken" };

function run(lines: string[], opts: PipelineOptions, data?: Record<number, number>) {
  const r = runPipeline(lines, opts, data);
  assert.ok(r.ok, r.ok ? "" : r.message);
  return r;
}
const row = (r: ReturnType<typeof run>, n: number) => Array.from(r.timing.rows[n].cells, (c) => c ?? ".").join(" ");

test("independent instructions: one finishes every cycle after the pipeline fills", () => {
  const r = run(["addi x1, x0, 1", "addi x2, x0, 2", "addi x3, x0, 3", "addi x4, x0, 4", "addi x5, x0, 5"], FWD);
  assert.equal(r.timing.cycles, 9);
  assert.equal(r.timing.stalls, 0);
  assert.equal(row(r, 0), "IF ID EX MEM WB");
  assert.equal(row(r, 4), ". . . . IF ID EX MEM WB");
});

test("an ALU result is forwarded with no stall; without forwarding it waits two cycles", () => {
  const prog = ["addi x1, x0, 5", "add x2, x1, x1"];
  assert.equal(run(prog, FWD).timing.cycles, 6);
  const slow = run(prog, NOFWD);
  assert.equal(slow.timing.stalls, 2);
  assert.equal(slow.timing.cycles, 8);
  assert.equal(row(slow, 1), ". IF ID stall stall EX MEM WB");
  assert.equal(slow.timing.rows[1].note, "waits for x1");
});

test("a load's result costs one stall even with forwarding (the load-use hazard)", () => {
  const r = run(["lw x1, 0(x0)", "add x2, x1, x1"], FWD, { 0: 21 });
  assert.equal(r.timing.stalls, 1);
  assert.equal(r.timing.cycles, 7);
  assert.equal(r.exec.regs[2], 42);
  assert.equal(row(r, 1), ". IF ID stall EX MEM WB");
});

test("one instruction in between hides the load-use stall", () => {
  const r = run(["lw x1, 0(x0)", "addi x3, x0, 1", "add x2, x1, x1"], FWD, { 0: 21 });
  assert.equal(r.timing.stalls, 0);
  assert.equal(r.timing.cycles, 7);
});

test("a stall holds the next instruction in IF", () => {
  const r = run(["lw x1, 0(x0)", "add x2, x1, x1", "addi x3, x0, 1"], FWD);
  assert.equal(row(r, 2), ". . IF stall ID EX MEM WB");
});

test("a taken branch flushes the two instructions fetched after it", () => {
  const r = run(["beq x0, x0, skip", "addi x1, x0, 1", "addi x2, x0, 2", "skip: addi x3, x0, 3"], FWD);
  assert.equal(r.timing.flushes, 2);
  assert.deepEqual(
    r.timing.rows.map((x) => [x.text, x.flushed]),
    [
      ["beq x0, x0, skip", false],
      ["addi x1, x0, 1", true],
      ["addi x2, x0, 2", true],
      ["addi x3, x0, 3", false],
    ],
  );
  assert.equal(row(r, 3), ". . . IF ID EX MEM WB");
  assert.equal(r.timing.cycles, 8);
  assert.deepEqual([r.exec.regs[1], r.exec.regs[2], r.exec.regs[3]], [0, 0, 3]);
});

test("a branch that isn't taken costs nothing when predicted not taken, two bubbles when stalling", () => {
  const prog = ["bne x0, x0, end", "addi x1, x0, 1", "end: addi x2, x0, 2"];
  const guess = run(prog, FWD);
  assert.equal(guess.timing.cycles, 7);
  assert.equal(guess.timing.flushes, 0);
  const wait = run(prog, { forwarding: true, branch: "stall" });
  assert.equal(wait.timing.bubbles, 2);
  assert.equal(wait.timing.cycles, 9);
});

test("a loop runs for its real path and results", () => {
  const r = run(["addi x1, x0, 3", "addi x2, x0, 0", "loop: add x2, x2, x1", "addi x1, x1, -1", "bne x1, x0, loop"], FWD);
  assert.equal(r.exec.regs[2], 6);
  assert.equal(r.timing.instructions, 2 + 3 * 3);
  assert.equal(r.timing.flushes, 4); // taken twice, then falls through
});

test("stores and loads go through memory", () => {
  const r = run(["addi x1, x0, 7", "sw x1, 8(x0)", "lw x2, 8(x0)"], FWD);
  assert.equal(r.exec.mem[8], 7);
  assert.equal(r.exec.regs[2], 7);
});

test("parse errors name the line", () => {
  const p = parseProgram(["addi x1, x0, 1", "mul x2, x1, x1"]);
  assert.deepEqual(p.ok ? null : [p.line, p.message], [2, `"mul" isn't an instruction this pipeline knows`]);
  const q = parseProgram(["beq x1, x0, nowhere"]);
  assert.equal(q.ok ? "" : q.message, `there's no label "nowhere"`);
  const r = parseProgram(["lw x1, x2"]);
  assert.equal(r.ok ? "" : r.message, "lw needs an address like 8(x2)");
});

test("x0 is never a dependency and always reads 0", () => {
  const r = run(["addi x0, x0, 5", "add x1, x0, x0"], NOFWD);
  assert.equal(r.timing.stalls, 0);
  assert.equal(r.exec.regs[0], 0);
});
