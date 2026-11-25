import assert from "node:assert/strict";
import { test } from "node:test";
import { COACH_V2_MAX_SIZE } from "./coach-v2-flow";
import { MAX_SYNC_ITEMS, SYNC_BATCH } from "./sync-limits";

test("the largest session fits in one batch, and the server accepts every batch", () => {
  assert.ok(COACH_V2_MAX_SIZE <= SYNC_BATCH);
  assert.ok(SYNC_BATCH <= MAX_SYNC_ITEMS);
});
