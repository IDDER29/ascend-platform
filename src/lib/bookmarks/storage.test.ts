import assert from "node:assert/strict";
import { test } from "node:test";
import type { Bookmark } from "./model";
import { bookmarksKey, claimGuestBookmarks, LEGACY_KEY, migrateLegacyBookmarks, readList, type KeyValue } from "./storage";

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

function memory(initial: Record<string, string> = {}) {
  const values = new Map(Object.entries(initial));
  const storage: KeyValue = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => void values.set(key, value),
    removeItem: (key) => void values.delete(key),
    keys: () => [...values.keys()],
  };
  return storage;
}
const refs = (storage: KeyValue, key: string) => readList(storage, key).map((b) => b.ref);
const legacy = (...list: Bookmark[]) => ({ [LEGACY_KEY]: JSON.stringify(list) });

test("a browser that never synced hands its old bookmarks to the guest", () => {
  const storage = memory(legacy(bm("a")));
  migrateLegacyBookmarks(storage);
  assert.deepEqual(refs(storage, bookmarksKey(null)), ["a"]);
  assert.equal(storage.getItem(LEGACY_KEY), null);
});

test("with one synced account, the old bookmarks are that account's, whoever is here now", () => {
  const storage = memory({ ...legacy(bm("a")), "ascend:bookmarks-synced:u1": "1" });
  migrateLegacyBookmarks(storage);
  assert.deepEqual(refs(storage, bookmarksKey("u1")), ["a"]);
  assert.deepEqual(refs(storage, bookmarksKey("u2")), []);
  assert.deepEqual(refs(storage, bookmarksKey(null)), []);
});

test("with two synced accounts, nobody gets the old bookmarks, and they are kept", () => {
  const storage = memory({ ...legacy(bm("a")), "ascend:bookmarks-synced:u1": "1", "ascend:bookmarks-synced:u2": "1" });
  migrateLegacyBookmarks(storage);
  for (const owner of ["u1", "u2", null]) assert.deepEqual(refs(storage, bookmarksKey(owner)), []);
  assert.deepEqual(refs(storage, "ascend:bookmarks:unclaimed"), ["a"]);
});

test("an old tab writing the old key again is merged in, its copy winning", () => {
  const storage = memory({ [bookmarksKey(null)]: JSON.stringify([bm("a", "before"), bm("b")]), ...legacy(bm("a", "after")) });
  migrateLegacyBookmarks(storage);
  migrateLegacyBookmarks(storage);
  assert.deepEqual(
    readList(storage, bookmarksKey(null)).map((b) => [b.ref, b.note]),
    [["a", "after"], ["b", ""]],
  );
});

test("unreadable old data is set aside, not destroyed", () => {
  const storage = memory({ [LEGACY_KEY]: "{not json" });
  migrateLegacyBookmarks(storage);
  assert.equal(storage.getItem("ascend:bookmarks:unreadable"), "{not json");
  assert.equal(storage.getItem(LEGACY_KEY), null);
});

test("if the new copy can't be written, the old one stays", () => {
  const storage = memory(legacy(bm("a")));
  storage.setItem = () => {
    throw new Error("full");
  };
  migrateLegacyBookmarks(storage);
  assert.notEqual(storage.getItem(LEGACY_KEY), null);
});

test("guest bookmarks move to the account that claims them, once", () => {
  const storage = memory({
    [bookmarksKey(null)]: JSON.stringify([bm("a", "guest"), bm("b")]),
    [bookmarksKey("u1")]: JSON.stringify([bm("a", "mine")]),
  });
  claimGuestBookmarks(storage, "u1");
  claimGuestBookmarks(storage, "u2");
  assert.deepEqual(
    readList(storage, bookmarksKey("u1")).map((b) => [b.ref, b.note]),
    [["a", "mine"], ["b", ""]],
  );
  assert.deepEqual(refs(storage, bookmarksKey("u2")), []);
  assert.deepEqual(refs(storage, bookmarksKey(null)), []);
});
