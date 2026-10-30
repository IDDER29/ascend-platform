import assert from "node:assert/strict";
import { test } from "node:test";
import { ACHIEVEMENTS } from "./catalog";
import { byPrecedence, rackRows, ribbonBackground, ribbonStripes } from "./ribbons";

test("every ribbon is symmetric, fills 100%, and is stable per badge", () => {
  for (const a of ACHIEVEMENTS) {
    const stripes = ribbonStripes(a.id, a.group);
    assert.equal(stripes.length, 5);
    assert.ok(Math.abs(stripes.reduce((s, x) => s + x.width, 0) - 100) < 1e-9, a.id);
    assert.deepEqual(stripes[0], stripes[4]);
    assert.deepEqual(stripes[1], stripes[3]);
    assert.ok(stripes.every((s) => s.width > 0), a.id);
    assert.deepEqual(ribbonStripes(a.id, a.group), stripes);
  }
});

test("ribbons are distinct from each other", () => {
  const designs = ACHIEVEMENTS.map((a) => ribbonBackground(ribbonStripes(a.id, a.group)));
  assert.equal(new Set(designs).size, designs.length);
});

test("precedence puts combinations first and keeps catalog order inside a group", () => {
  const order = byPrecedence(ACHIEVEMENTS).map((a) => a.group);
  assert.equal(order[0], "combination");
  assert.equal(order.at(-1), "habits");
  const learning = byPrecedence(ACHIEVEMENTS).filter((a) => a.group === "learning").map((a) => a.id);
  assert.deepEqual(learning, ACHIEVEMENTS.filter((a) => a.group === "learning").map((a) => a.id));
});

test("the top rack row holds the remainder", () => {
  assert.deepEqual(rackRows([1, 2, 3, 4, 5]), [[1, 2], [3, 4, 5]]);
  assert.deepEqual(rackRows([1, 2, 3]), [[1, 2, 3]]);
  assert.deepEqual(rackRows([]), []);
});
