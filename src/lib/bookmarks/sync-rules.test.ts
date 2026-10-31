import assert from "node:assert/strict";
import { test } from "node:test";
import type { Bookmark } from "./model";
import { cleanBookmark, firstMerge } from "./sync-rules";

const bm = (ref: string, note = ""): Bookmark => ({
  ref,
  kind: "lesson",
  title: ref,
  where: "",
  href: `/lessons/${ref}`,
  topic: null,
  lessonKey: null,
  reason: "later",
  note,
  savedAt: "2026-11-01T10:00:00.000Z",
});

test("a first sync keeps both devices' bookmarks, the account's copy winning on a clash", () => {
  const { merged, toUpload } = firstMerge([bm("a", "local"), bm("b")], [bm("a", "remote"), bm("c")]);
  assert.deepEqual(merged.map((b) => [b.ref, b.note]), [["a", "remote"], ["c", ""], ["b", ""]]);
  assert.deepEqual(toUpload.map((b) => b.ref), ["b"]);
});

test("bookmarks from the browser are checked before they're stored", () => {
  assert.ok(cleanBookmark(bm("a")));
  assert.equal(cleanBookmark({ ...bm("a"), reason: "spam" }), null);
  assert.equal(cleanBookmark({ ...bm("a"), href: "javascript:alert(1)" }), null);
  assert.equal(cleanBookmark({ ...bm("a"), ref: "x".repeat(600) }), null);
  assert.equal(cleanBookmark({ ...bm("a"), note: "x".repeat(5000) })?.note, "");
  assert.equal(cleanBookmark("nope"), null);
  // Unknown fields are dropped.
  assert.equal("evil" in (cleanBookmark({ ...bm("a"), evil: 1 }) ?? {}), false);
});
