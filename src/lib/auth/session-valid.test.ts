import assert from "node:assert/strict";
import { test } from "node:test";

// sessionStillValid is pure; import it without pulling the server-only auth module's db.
import { sessionStillValid } from "./session-rules";

test("a session issued before the last password change is no longer valid", () => {
  const changed = new Date(2026, 10, 1, 12, 0, 0, 500);
  const changedSec = Math.floor(changed.getTime() / 1000);
  assert.equal(sessionStillValid(changedSec - 60, changed), false);
  // The session issued for this device in the same second as the change stays valid.
  assert.equal(sessionStillValid(changedSec, changed), true);
  assert.equal(sessionStillValid(changedSec + 5, changed.getTime()), true);
  assert.equal(sessionStillValid(0, null), true);
});
