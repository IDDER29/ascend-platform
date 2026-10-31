import assert from "node:assert/strict";
import { test } from "node:test";
import { confirmationMatches, PROGRESS_TABLES, storageKeysToClear } from "./account-rules";

test("confirming means typing your username, ignoring case and outer spaces", () => {
  assert.equal(confirmationMatches(" Ada ", "ada"), true);
  assert.equal(confirmationMatches("ad", "ada"), false);
  assert.equal(confirmationMatches("", ""), false);
});

test("a reset clears progress but keeps the account, profile and settings", () => {
  for (const kept of ["users", "profiles", "profileSettings", "practiceSettings", "profileLinks", "ownProjects"]) {
    assert.equal((PROGRESS_TABLES as readonly string[]).includes(kept), false, kept);
  }
  assert.ok(PROGRESS_TABLES.includes("lessonProgress"));
});

test("only this learner's browser progress is cleared; a deleted account also loses its goal", () => {
  const keys = [
    "ascend_practice_history_v1:u1",
    "ascend_practice_history_v1:u2",
    "ascend_practice_history_v1:guest",
    "ascend_practice_cards_v1:u1",
    "ascend_practice_daily_goal_v1:u1",
    "ascend:check-yourself:level-00/what-is-a-bit",
    "ascend:bookmarks",
    "ascend-theme",
  ];
  assert.deepEqual(storageKeysToClear(keys, "u1", "progress"), [
    "ascend_practice_history_v1:u1",
    "ascend_practice_cards_v1:u1",
    "ascend:check-yourself:level-00/what-is-a-bit",
  ]);
  assert.ok(storageKeysToClear(keys, "u1", "account").includes("ascend_practice_daily_goal_v1:u1"));
  // Bookmarks belong to the account: a deletion clears them from this browser, a reset keeps them.
  assert.ok(storageKeysToClear([...keys, "ascend:bookmarks-synced:u1"], "u1", "account").includes("ascend:bookmarks"));
  assert.ok(storageKeysToClear([...keys, "ascend:bookmarks-synced:u1"], "u1", "account").includes("ascend:bookmarks-synced:u1"));
  assert.ok(!storageKeysToClear(keys, "u1", "progress").includes("ascend:bookmarks"));
});
