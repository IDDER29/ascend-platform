import assert from "node:assert/strict";
import { test } from "node:test";
import { PRACTICE_BANK } from "./bank";
import { bitPatterns, groupBits, hexBytes, hexGroups, placeTerms, structLayout, truthTable } from "./figures";

test("gate truth tables", () => {
  const outs = (g: Parameters<typeof truthTable>[0]) => truthTable(g).rows.map((r) => r.out.join(""));
  assert.deepEqual(outs("AND"), ["0", "0", "0", "1"]);
  assert.deepEqual(outs("OR"), ["0", "1", "1", "1"]);
  assert.deepEqual(outs("XOR"), ["0", "1", "1", "0"]);
  assert.deepEqual(outs("NAND"), ["1", "1", "1", "0"]);
  assert.deepEqual(outs("NOR"), ["1", "0", "0", "0"]);
  assert.deepEqual(outs("NOT"), ["1", "0"]);
  assert.deepEqual(outs("HALF_ADDER"), ["00", "10", "10", "01"]);
  assert.deepEqual(truthTable("HALF_ADDER").outputs, ["Sum", "Carry"]);
  // Full adder: Sum and carry-out for 000 … 111 (1 + 1 + 1 = 11 in binary).
  assert.deepEqual(outs("FULL_ADDER"), ["00", "10", "10", "01", "10", "01", "01", "11"]);
});

test("n bits make 2ⁿ patterns, in counting order", () => {
  assert.deepEqual(bitPatterns(2), ["00", "01", "10", "11"]);
  assert.equal(bitPatterns(3).length, 8);
  assert.equal(bitPatterns(9).length, 16); // capped to fit a card
});

test("bits group from the right", () => {
  assert.deepEqual(groupBits("01000001", 4), ["0100", "0001"]);
  assert.deepEqual(groupBits("101101", 4), ["10", "1101"]);
});

test("place values add up", () => {
  const { terms, total } = placeTerms("1011", 2);
  assert.deepEqual(
    terms.map((t) => t.value),
    [8, 0, 2, 1],
  );
  assert.equal(total, 11);
  assert.equal(placeTerms("FF", 16).total, 255);
  assert.equal(placeTerms("305", 10).total, 305);
});

test("hex groups", () => {
  assert.deepEqual(hexGroups("10101111"), [
    { bits: "1010", hex: "A" },
    { bits: "1111", hex: "F" },
  ]);
  assert.deepEqual(hexGroups("110"), [{ bits: "0110", hex: "6" }]);
});

test("every figure in the bank is well formed", () => {
  for (const q of PRACTICE_BANK) {
    if (q.kind !== "flashcard" || !q.figure) continue;
    const f = q.figure;
    if (f.type === "bits" || f.type === "hex") assert.match(f.bits, /^[01 ]+$/, q.id);
    if (f.type === "places")
      assert.ok(
        placeTerms(f.digits, f.base).terms.every((t) => t.value >= 0),
        q.id,
      );
    if (f.type === "cycle") assert.ok(f.steps.length >= 2, q.id);
    if (f.type === "patterns") assert.ok(f.n >= 1, q.id);
  }
});

test("struct layout pads each member to its alignment and the end to the largest", () => {
  const l = structLayout([
    { name: "c", type: "char", size: 1 },
    { name: "i", type: "int", size: 4 },
    { name: "d", type: "char", size: 1 },
  ]);
  assert.deepEqual(
    l.fields.map((f) => f.offset),
    [0, 4, 8],
  );
  assert.equal(l.size, 12); // matches sizeof on x86-64
  assert.deepEqual(l.padding, [1, 2, 3, 9, 10, 11]);
  const u = structLayout(
    [
      { name: "i", type: "int", size: 4 },
      { name: "f", type: "float", size: 4 },
    ],
    true,
  );
  assert.equal(u.size, 4);
  assert.deepEqual(
    u.fields.map((f) => f.offset),
    [0, 0],
  );
});

test("hex bytes, most significant first", () => {
  assert.deepEqual(hexBytes("0x12345678"), ["12", "34", "56", "78"]);
  assert.deepEqual(hexBytes("0xABC"), ["0A", "BC"]);
});
