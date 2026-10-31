import { test } from "node:test";
import assert from "node:assert/strict";
import { bitsToText, encode, noiseSamples, simulate, textToBits } from "./model";

test("text to bits and back", () => {
  assert.deepEqual(textToBits("A"), [0, 1, 0, 0, 0, 0, 0, 1]);
  assert.equal(bitsToText(textToBits("Hi!")), "Hi!");
});

test("encoding adds parity per byte, or repeats every bit three times", () => {
  assert.deepEqual(encode([1, 0, 1], "repeat3"), [1, 1, 1, 0, 0, 0, 1, 1, 1]);
  assert.deepEqual(encode([1, 1, 0, 0, 0, 0, 0, 1], "parity"), [1, 1, 0, 0, 0, 0, 0, 1, 1]);
  assert.deepEqual(encode([1, 0], "parity"), [1, 0, 1]);
});

test("noise is the same for the same seed, and roughly mean 0 spread 1", () => {
  assert.deepEqual(noiseSamples(5, 7), noiseSamples(5, 7));
  assert.notDeepEqual(noiseSamples(5, 7), noiseSamples(5, 8));
  const xs = noiseSamples(4000, 1);
  const mean = xs.reduce((a, b) => a + b, 0) / xs.length;
  const sd = Math.sqrt(xs.reduce((a, b) => a + (b - mean) ** 2, 0) / xs.length);
  assert.ok(Math.abs(mean) < 0.06 && Math.abs(sd - 1) < 0.06, `${mean} ${sd}`);
});

test("no noise and a middle threshold: perfect", () => {
  const data = textToBits("OK");
  const r = simulate(data, { coding: "none", noise: 0, threshold: 2.5, seed: 1 });
  assert.deepEqual(r.decoded, data);
  assert.deepEqual(r.lineFlips, []);
});

test("a threshold near one level misreads under noise; the middle does better", () => {
  const data = textToBits("HELLO");
  const high = simulate(data, { coding: "none", noise: 1, threshold: 4.5, seed: 3 });
  const mid = simulate(data, { coding: "none", noise: 1, threshold: 2.5, seed: 3 });
  assert.ok(high.dataErrors.length > 5, `${high.dataErrors.length}`);
  assert.ok(mid.dataErrors.length < high.dataErrors.length);
});

test("parity detects a byte with one flip, without fixing it", () => {
  const data = textToBits("HELLO");
  for (let seed = 1; seed < 200; seed++) {
    const r = simulate(data, { coding: "parity", noise: 1.1, threshold: 2.5, seed });
    for (let g = 0; g < 5; g++) {
      const flips = r.lineFlips.filter((i) => Math.floor(i / 9) === g).length;
      assert.equal(r.detected.includes(g), flips % 2 === 1, `seed ${seed} byte ${g}`);
    }
  }
});

test("repeat3 corrects single flips in a trio and reports them", () => {
  const data = textToBits("HELLO");
  const none = simulate(data, { coding: "none", noise: 1.2, threshold: 2.5, seed: 9 });
  const rep = simulate(data, { coding: "repeat3", noise: 1.2, threshold: 2.5, seed: 9 });
  assert.ok(rep.dataErrors.length < none.dataErrors.length || none.dataErrors.length === 0);
  for (const i of rep.corrected) assert.equal(rep.decoded[i], data[i]);
  // Errors after repeat3 only come from trios with two or three flips.
  for (const i of rep.dataErrors) {
    const flips = rep.lineFlips.filter((k) => Math.floor(k / 3) === i).length;
    assert.ok(flips >= 2);
  }
});
