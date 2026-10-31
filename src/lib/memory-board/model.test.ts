import assert from "node:assert/strict";
import { test } from "node:test";
import { boardFrom, goalMet, readBoard, selectBoxes, tickBoard } from "./model";

test("a write changes only the addressed box, and only with write on", () => {
  const mem = boardFrom(16, { 3: 42 });
  const off = tickBoard(mem, { address: 5, data: 7, write: false });
  assert.deepEqual(off.changed, []);
  assert.equal(off.mem, mem);
  const on = tickBoard(mem, { address: 5, data: 7, write: true });
  assert.deepEqual(on.changed, [5]);
  assert.equal(on.mem[5], 7);
  assert.equal(on.mem[3], 42);
  assert.equal(readBoard(on.mem, 3), 42);
});

test("a decoder that ignores address bit 0 writes 0x22 and 0x23 together", () => {
  assert.deepEqual(selectBoxes(0x22, 256, { ignoreAddressBit: 0 }), [0x22, 0x23]);
  assert.deepEqual(selectBoxes(0x23, 256, { ignoreAddressBit: 0 }), [0x22, 0x23]);
  const r = tickBoard(boardFrom(256), { address: 0x22, data: 9, write: true }, { ignoreAddressBit: 0 });
  assert.deepEqual(r.changed, [0x22, 0x23]);
});

test("a goal needs the named boxes right and every other box untouched", () => {
  const start = boardFrom(16, { 1: 5 });
  let mem = tickBoard(start, { address: 4, data: 9, write: true }).mem;
  assert.deepEqual(goalMet(mem, start, { 4: 9 }), { met: true, wrong: [] });
  mem = tickBoard(mem, { address: 1, data: 0, write: true }).mem;
  assert.deepEqual(goalMet(mem, start, { 4: 9 }), { met: false, wrong: [1] });
});
