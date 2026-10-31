import assert from "node:assert/strict";
import { test } from "node:test";
import { safeNextHref } from "./next-href";

test("a page on this site is kept, with its query", () => {
  assert.equal(safeNextHref("/practice"), "/practice");
  assert.equal(
    safeNextHref("/lessons/foundations-bits-what-is-a-bit?x=1"),
    "/lessons/foundations-bits-what-is-a-bit?x=1",
  );
});

test("other sites and tricks are refused", () => {
  for (const bad of [
    "https://evil.example",
    "//evil.example",
    "/\\evil.example",
    "javascript:alert(1)",
    "dashboard",
    "/a\nb",
  ]) {
    assert.equal(safeNextHref(bad), null, bad);
  }
});

test("nothing, or the sign-in page itself, gives null", () => {
  assert.equal(safeNextHref(null), null);
  assert.equal(safeNextHref(""), null);
  assert.equal(safeNextHref("/signin"), null);
  assert.equal(safeNextHref("/signin?mode=signup"), null);
});
