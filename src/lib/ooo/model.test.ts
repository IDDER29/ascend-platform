import assert from "node:assert/strict";
import { test } from "node:test";
import { parseBlock, schedule, type OooOptions } from "./model";

const IO1: OooOptions = { outOfOrder: false, width: 1, window: 32, renaming: true };
const OO1: OooOptions = { ...IO1, outOfOrder: true };
const OO2: OooOptions = { ...OO1, width: 2 };

function block(lines: string[]) {
  const p = parseBlock(lines);
  assert.ok(p.ok, p.ok ? "" : p.message);
  return p.block;
}

const LOAD = block(["lw r1, 0(r2)", "add r3, r1, r1", "add r4, r5, r5", "add r6, r4, r4", "add r7, r6, r6", "add r8, r9, r9"]);

test("in order, one per cycle: everything after the load waits behind it", () => {
  const s = schedule(LOAD, IO1);
  assert.deepEqual(s.rows.map((r) => r.issue), [1, 4, 5, 6, 7, 8]);
  assert.equal(s.cycles, 9);
  assert.equal(s.rows[1].waited, "r1 from lw r1, 0(r2)");
});

test("out of order, independent work runs during the load's latency", () => {
  const s = schedule(LOAD, OO1);
  assert.deepEqual(s.rows.map((r) => r.issue), [1, 4, 2, 3, 5, 6]);
  assert.equal(s.cycles, 7);
  // Commit is still in program order.
  assert.deepEqual(s.rows.map((r) => r.commit), [4, 5, 5, 5, 6, 7]);
});

test("two per cycle, out of order, is fastest; a tiny window takes the gain away", () => {
  assert.equal(schedule(LOAD, { ...IO1, width: 2 }).cycles, 7);
  assert.equal(schedule(LOAD, OO2).cycles, 6);
  const small = schedule(LOAD, { ...OO2, window: 2 });
  assert.equal(small.cycles, 9);
  assert.equal(small.rows[2].waited, "the window is full");
});

test("without renaming, reusing a register name creates a false dependence", () => {
  const reuse = block(["mul r1, r2, r3", "add r4, r1, r1", "addi r1, r5, 1", "add r6, r1, r1", "add r7, r6, r6", "add r8, r7, r7"]);
  const without = schedule(reuse, { ...OO2, renaming: false });
  assert.equal(without.cycles, 8);
  assert.equal(without.rows[2].issue, 4);
  assert.equal(without.rows[2].waited, "r1 still to be read by add r4, r1, r1");
  const withRenaming = schedule(reuse, OO2);
  assert.equal(withRenaming.cycles, 6);
  assert.equal(withRenaming.rows[2].issue, 1);
});

test("write after write without renaming: the later write must land last", () => {
  const s = schedule(block(["mul r1, r2, r3", "add r1, r4, r4"]), { ...OO2, renaming: false });
  assert.ok(s.rows[1].done > s.rows[0].done);
});

test("parse errors", () => {
  const p = parseBlock(["add r1, r2"]);
  assert.equal(p.ok ? "" : p.message, "add takes 3 registers");
  const q = parseBlock(["jump r1"]);
  assert.equal(q.ok ? 0 : q.line, 1);
});
