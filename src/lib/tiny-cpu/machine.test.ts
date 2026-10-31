import assert from "node:assert/strict";
import { test } from "node:test";
import { assemble, boot, byteBits, decode, run, step } from "./machine";

test("instructions assemble to Ben Eater's encoding", () => {
  const mem = assemble(["LDA 14", "ADD 15", "OUT", "HLT"], { 14: 28, 15: 14 });
  assert.deepEqual(mem.slice(0, 4).map(byteBits), ["0001 1110", "0010 1111", "1110 0000", "1111 0000"]);
  assert.equal(mem[14], 28);
  assert.equal(decode(0b0001_1100), "LDA 12"); // the number 28, read as an instruction
  assert.equal(decode(0b1001_0000), "?");
});

test("the 28 + 14 program shows 42 and halts after four instructions", () => {
  const { machine, stoppedEarly } = run(boot(assemble(["LDA 14", "ADD 15", "OUT", "HLT"], { 14: 28, 15: 14 })));
  assert.deepEqual(machine.out, [42]);
  assert.equal(machine.halted, true);
  assert.equal(machine.steps, 4);
  assert.equal(stoppedEarly, false);
});

test("the countdown shows 3, 2, 1, 0 using SUB and JZ", () => {
  const program = ["LDI 3", "OUT", "SUB 15", "JZ 5", "JMP 1", "OUT", "HLT"];
  const { machine } = run(boot(assemble(program, { 15: 1 })));
  assert.deepEqual(machine.out, [3, 2, 1, 0]);
  assert.equal(machine.zero, true);
});

test("ADD wraps at 8 bits and sets the carry flag", () => {
  const { machine } = run(boot(assemble(["LDA 14", "ADD 15", "HLT"], { 14: 200, 15: 100 })));
  assert.equal(machine.a, 44); // 300 - 256
  assert.equal(machine.carry, true);
  assert.equal(machine.zero, false);
});

test("SUB to zero sets zero and carry (no borrow); below zero wraps without carry", () => {
  const equal = run(boot(assemble(["LDA 14", "SUB 15", "HLT"], { 14: 3, 15: 3 }))).machine;
  assert.equal(equal.a, 0);
  assert.equal(equal.zero, true);
  assert.equal(equal.carry, true);
  const below = run(boot(assemble(["LDA 14", "SUB 15", "HLT"], { 14: 3, 15: 5 }))).machine;
  assert.equal(below.a, 254); // -2 in two's complement
  assert.equal(below.carry, false);
});

test("STA writes memory; a jump changes the program counter", () => {
  let m = boot(assemble(["LDI 7", "STA 12", "JMP 0"]));
  m = step(m).machine;
  const stored = step(m);
  assert.equal(stored.machine.mem[12], 7);
  assert.equal(stored.event?.wrote, 12);
  const jumped = step(stored.machine);
  assert.equal(jumped.machine.pc, 0);
  assert.equal(jumped.event?.jumped, true);
});

test("an endless loop stops at the step limit", () => {
  const r = run(boot(assemble(["JMP 0"])), 50);
  assert.equal(r.stoppedEarly, true);
  assert.equal(r.machine.steps, 50);
});

test("assembling rejects what the tiny CPU can't hold", () => {
  assert.throws(() => assemble(["LDA 16"]));
  assert.throws(() => assemble(["MUL 3"]));
  assert.throws(() => assemble(["OUT 3"]));
  assert.throws(() => assemble(["LDA"]));
  assert.throws(() => assemble([], { 20: 1 }));
  assert.throws(() => assemble([], { 3: 300 }));
});
