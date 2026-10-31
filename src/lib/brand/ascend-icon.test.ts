import assert from "node:assert/strict";
import { test } from "node:test";
import { ASCEND_BRAND, ascendMarkSvg } from "./ascend-icon";

test("the mark is lime chevrons on an ink tile, chevrons centred at 55%", () => {
  const svg = ascendMarkSvg({ size: 32 });
  assert.match(svg, new RegExp(`fill="${ASCEND_BRAND.ink}"`));
  assert.match(svg, new RegExp(`stroke="${ASCEND_BRAND.lime}"`));
  assert.match(svg, /translate\(7\.2 7\.2\)/); // (32 - 17.6) / 2
  assert.match(svg, /rx="10"/); // BrandMark's 10px corners on a 32px tile
});

test("full-bleed icons have square corners", () => {
  assert.match(ascendMarkSvg({ size: 180, radius: 0 }), /rx="0"/);
});
