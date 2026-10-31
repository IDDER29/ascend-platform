import assert from "node:assert/strict";
import { test } from "node:test";
import { clientIp, LIMITS, overLimit } from "./rate-limit-rules";

test("the limit counts only attempts inside the window", () => {
  const now = 1_000_000;
  const rule = { limit: 3, windowMs: 1000 };
  assert.equal(overLimit([now - 100, now - 200], now, rule), false);
  assert.equal(overLimit([now - 100, now - 200, now - 300], now, rule), true);
  assert.equal(overLimit([now - 100, now - 200, now - 5000], now, rule), false);
});

test("sign-in is limited per email (case-insensitive) and per IP", () => {
  const [byEmail, byIp] = LIMITS.signIn("  Ada@Example.com ", "1.2.3.4");
  assert.equal(byEmail.key, "signin:email:ada@example.com");
  assert.equal(byIp.key, "signin:ip:1.2.3.4");
  assert.ok(byEmail.limit < byIp.limit);
});

test("the client IP comes from the first forwarded address", () => {
  const h = (map: Record<string, string>) => (name: string) => map[name] ?? null;
  assert.equal(clientIp(h({ "x-forwarded-for": "9.9.9.9, 10.0.0.1" })), "9.9.9.9");
  assert.equal(clientIp(h({ "x-real-ip": "8.8.8.8" })), "8.8.8.8");
  assert.equal(clientIp(h({})), "unknown");
});
