import assert from "node:assert/strict";
import { test } from "node:test";
import { isCurrent } from "./site-nav";

test("a nav link is current on its own page and the pages under it", () => {
  assert.equal(isCurrent("/catalog", "/catalog"), true);
  assert.equal(isCurrent("/catalog", "/catalog/foundations"), true);
});

test("a nav link isn't current on a page that only starts with the same letters", () => {
  assert.equal(isCurrent("/about", "/aboutness"), false);
  assert.equal(isCurrent("/faq", "/"), false);
  assert.equal(isCurrent("/faq", null), false);
});
