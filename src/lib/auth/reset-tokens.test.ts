import assert from "node:assert/strict";
import { test } from "node:test";
import { hashResetToken, newResetToken, RESET_TTL_MS, resetEmail, resetTokenUsable } from "./reset-tokens";

test("tokens are random and long, and only their hash is kept", () => {
  const a = newResetToken();
  const b = newResetToken();
  assert.notEqual(a.token, b.token);
  assert.ok(a.token.length >= 43); // 32 random bytes
  assert.equal(a.hash, hashResetToken(a.token));
  assert.notEqual(a.hash, a.token);
  assert.match(a.hash, /^[0-9a-f]{64}$/);
});

test("a token works once and only before it expires", () => {
  const now = Date.now();
  assert.equal(resetTokenUsable({ expiresAt: now + RESET_TTL_MS, usedAt: null }, now), true);
  assert.equal(resetTokenUsable({ expiresAt: new Date(now - 1), usedAt: null }, now), false);
  assert.equal(resetTokenUsable({ expiresAt: now + RESET_TTL_MS, usedAt: new Date(now - 1000) }, now), false);
});

test("the email carries the link and the time limit", () => {
  const mail = resetEmail("https://ascend.example/reset/new-password?token=abc");
  assert.match(mail.text, /token=abc/);
  assert.match(mail.html, /href="https:\/\/ascend\.example\/reset\/new-password\?token=abc"/);
  assert.match(mail.text, /30 minutes/);
});
