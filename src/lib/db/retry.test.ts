import assert from "node:assert/strict";
import { test } from "node:test";
import { isTransientDbError, withRetry } from "./retry";

const noSleep = async () => {};

test("transient errors are recognised, including wrapped ones; others aren't", () => {
  assert.ok(isTransientDbError({ code: "ECONNRESET" }));
  assert.ok(isTransientDbError({ code: "57P01" }));
  assert.ok(isTransientDbError(new Error("query failed", { cause: { code: "CONNECT_TIMEOUT" } })));
  assert.ok(!isTransientDbError({ code: "23505" })); // unique violation
  assert.ok(!isTransientDbError(new Error("syntax")));
  assert.ok(!isTransientDbError(null));
});

test("a transient failure is retried once, then succeeds", async () => {
  let calls = 0;
  const value = await withRetry(
    async () => {
      calls++;
      if (calls === 1) throw { code: "ECONNRESET" };
      return 42;
    },
    { sleep: noSleep },
  );
  assert.deepEqual([value, calls], [42, 2]);
});

test("a real error isn't retried, and retries stop after the limit", async () => {
  let calls = 0;
  await assert.rejects(withRetry(async () => { calls++; throw { code: "23505" }; }, { sleep: noSleep }));
  assert.equal(calls, 1);
  calls = 0;
  await assert.rejects(withRetry(async () => { calls++; throw { code: "ETIMEDOUT" }; }, { sleep: noSleep, retries: 2 }));
  assert.equal(calls, 3);
});
