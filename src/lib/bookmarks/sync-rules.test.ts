import assert from "node:assert/strict";
import { test } from "node:test";
import type { Bookmark } from "./model";
import { cleanBookmark, firstMerge, laterMerge, NOTE_MAX } from "./sync-rules";

const bm = (ref: string, note = "", savedAt = "2026-11-01T10:00:00.000Z"): Bookmark => ({
  ref,
  kind: "lesson",
  title: ref,
  where: "",
  href: `/lessons/${ref}`,
  topic: null,
  lessonKey: null,
  reason: "later",
  note,
  savedAt,
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
  assert.equal(cleanBookmark({ ...bm("a"), href: "//evil.example/x" }), null);
  assert.equal(cleanBookmark({ ...bm("a"), href: "/lessons/x" })?.href, "/lessons/x");
  assert.equal(cleanBookmark({ ...bm("a"), ref: "x".repeat(600) }), null);
  // A long note is cut short, never thrown away.
  assert.equal(cleanBookmark({ ...bm("a"), note: "x".repeat(5000) })?.note, "x".repeat(NOTE_MAX));
  assert.equal(cleanBookmark("nope"), null);
  // Unknown fields are dropped.
  assert.equal("evil" in (cleanBookmark({ ...bm("a"), evil: 1 }) ?? {}), false);
});

test("a later sync follows the account but uploads what was saved since the last one", () => {
  const lastSync = Date.parse("2026-11-10T00:00:00Z");
  const local = [bm("kept", "old copy"), bm("removed-elsewhere"), bm("unsent", "", "2026-11-12T00:00:00Z")];
  const { merged, toUpload, dropped } = laterMerge(local, [bm("kept", "account copy")], lastSync);
  assert.deepEqual(merged.map((b) => [b.ref, b.note]), [["kept", "account copy"], ["unsent", ""]]);
  assert.deepEqual(toUpload.map((b) => b.ref), ["unsent"]);
  assert.deepEqual(dropped.map((b) => b.ref), ["removed-elsewhere"]);
});

test("with no record of a last sync, nothing is pushed back and what's dropped is returned", () => {
  const { merged, toUpload, dropped } = laterMerge([bm("local-only")], [], null);
  assert.deepEqual([merged, toUpload, dropped.map((b) => b.ref)], [[], [], ["local-only"]]);
});
