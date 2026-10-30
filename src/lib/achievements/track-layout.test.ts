import assert from "node:assert/strict";
import { test } from "node:test";
import { placeOnTrack } from "./track-layout";

test("badges sit by how close they are, inside the lane edges", () => {
  const spots = placeOnTrack([
    { id: "far", ratio: 0 },
    { id: "close", ratio: 0.8 },
  ]);
  assert.deepEqual(spots.map((s) => s.id), ["far", "close"]);
  assert.equal(spots[0].pos, 4);
  assert.ok(Math.abs(spots[1].pos - (4 + 0.8 * 92)) < 1e-9);
  assert.deepEqual(spots.map((s) => s.row), [0, 0]);
});

test("crowded badges alternate rows, then nudge right just enough", () => {
  const spots = placeOnTrack(
    [0, 0, 0, 0].map((ratio, i) => ({ id: String(i), ratio })),
    9,
  );
  assert.deepEqual(spots.map((s) => s.row), [0, 1, 0, 1]);
  assert.deepEqual(spots.map((s) => s.pos), [4, 4, 13, 13]);
});
