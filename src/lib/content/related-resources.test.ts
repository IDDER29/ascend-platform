import assert from "node:assert/strict";
import { test } from "node:test";
import { relatedResources, type LearnMoreResource } from "./related-resources";

const LESSON: LearnMoreResource[] = [
  { title: "Crash Course: Early Computing", type: "video", meta: "12 min", url: "https://example.com/a" },
  {
    title: "Two's complement (Wikipedia)",
    type: "doc",
    meta: "Reference: signed integers",
    url: "https://example.com/b",
  },
  { title: "Voltage levels in digital logic", type: "doc", meta: "Why two states", url: "https://example.com/c" },
];

test("the lesson's resources that share words with the question come first", () => {
  const r = relatedResources(
    { question: "Why do computers use two voltage states?", answer: "Telling two voltage levels apart is reliable." },
    LESSON,
  );
  assert.equal(r[0].url, "https://example.com/c");
});

test("nothing in common: the lesson's first resources, still real links", () => {
  const r = relatedResources({ question: "Zebra?", answer: "Quokka." }, LESSON, 2);
  assert.deepEqual(
    r.map((x) => x.url),
    ["https://example.com/a", "https://example.com/b"],
  );
});

test("a question's own hand-picked resources win", () => {
  const own = [{ title: "Petzold, ch. 2", type: "doc" as const, url: "https://example.com/own" }];
  const r = relatedResources({ question: "Why two?", answer: "x", resources: own }, LESSON);
  assert.deepEqual(r, [{ ...own[0], meta: "" }]);
});
