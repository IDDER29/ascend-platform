import assert from "node:assert/strict";
import { test } from "node:test";
import { linkKind, linkLabel, normalizeUrl, parseTags } from "./links";

test("normalizeUrl adds https and rejects non-web schemes", () => {
  assert.equal(normalizeUrl("github.com/ada"), "https://github.com/ada");
  assert.equal(normalizeUrl("  https://ada.dev/  "), "https://ada.dev/");
  assert.equal(normalizeUrl("http://ada.dev"), "http://ada.dev/");
  assert.equal(normalizeUrl("javascript:alert(1)"), null);
  assert.equal(normalizeUrl("ftp://ada.dev"), null);
  assert.equal(normalizeUrl("localhost"), null);
  assert.equal(normalizeUrl(""), null);
  assert.equal(normalizeUrl(`https://a.dev/${"x".repeat(400)}`), null);
});

test("linkKind reads the host", () => {
  assert.equal(linkKind("https://github.com/ada"), "github");
  assert.equal(linkKind("https://www.linkedin.com/in/ada"), "linkedin");
  assert.equal(linkKind("https://x.com/ada"), "x");
  assert.equal(linkKind("https://twitter.com/ada"), "x");
  assert.equal(linkKind("https://gitlab.com/ada"), "gitlab");
  assert.equal(linkKind("https://youtube.com/@ada"), "youtube");
  assert.equal(linkKind("https://ada.dev"), "website");
});

test("linkLabel prefers the learner's label, then the service, then the host", () => {
  assert.equal(linkLabel("https://github.com/ada", "My code"), "My code");
  assert.equal(linkLabel("https://github.com/ada", null), "GitHub");
  assert.equal(linkLabel("https://www.ada.dev/blog", null), "ada.dev");
});

test("parseTags trims, dedupes and caps", () => {
  assert.deepEqual(parseTags(" C, rust ,C,, Rust "), ["C", "rust"]);
  assert.equal(parseTags("a,b,c,d,e,f,g").length, 5);
  assert.deepEqual(parseTags("x".repeat(30)), ["x".repeat(20)]);
});
