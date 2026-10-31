import assert from "node:assert/strict";
import { test } from "node:test";
import { buildReviewOptions, type ReviewOptionsInput } from "./review-options";

function options(patch: Partial<ReviewOptionsInput>) {
  return buildReviewOptions({
    misses: ["m1", "m2", "m3"],
    missesHref: "/practice/session?scope=due",
    shaky: { ids: [], slow: 0, href: null },
    pathCards: {},
    dueByPath: { "systems-programmer": 4, foundations: 12 },
    activePath: { slug: "systems-programmer", title: "Systems Programmer" },
    otherPaths: [{ slug: "foundations", title: "Foundations" }],
    pathHref: (slug, n) => (n > 0 ? `/session?path=${slug}` : `/practice/paths/${slug}`),
    decks: [],
    flagged: { count: 0, cardIds: [] },
    ...patch,
  });
}

test("misses, then the current path, then other paths with cards due", () => {
  assert.deepEqual(
    options({}).map((o) => [o.title, o.badge, o.href]),
    [
      ["Fix your misses", "3 to fix", "/practice/session?scope=due"],
      ["Review Systems Programmer", "4 due", "/session?path=systems-programmer"],
      ["Foundations", "12 due", "/session?path=foundations"],
    ],
  );
});

test("nothing waiting: misses and the current path say all clear; other paths drop out", () => {
  const o = options({ misses: [], dueByPath: {} });
  assert.deepEqual(
    o.map((x) => [x.title, x.badge, x.waiting]),
    [
      ["Fix your misses", "All clear", false],
      ["Review Systems Programmer", "All clear", false],
    ],
  );
  assert.equal(o[1].href, "/practice/paths/systems-programmer");
});

test("decks with cards come in, waiting ones before the rest; flagged bookmarks last", () => {
  const o = options({
    dueByPath: {},
    decks: [
      { id: "a", name: "Pointers", due: 0, total: 9, href: "/d/a", cardIds: [] },
      { id: "b", name: "Gates", due: 2, total: 6, href: "/d/b", cardIds: [] },
      { id: "c", name: "Empty", due: 0, total: 0, href: null, cardIds: [] },
    ],
    flagged: { count: 2, cardIds: [] },
  });
  assert.deepEqual(
    o.map((x) => [x.title, x.badge]),
    [
      ["Fix your misses", "3 to fix"],
      ["Review Systems Programmer", "All clear"],
      ["Gates", "2 due"],
      ["Didn't get it", "2 saved"],
      ["Pointers", "9 cards"],
    ],
  );
});

test("shaky cards come right after misses", () => {
  const o = options({ shaky: { ids: ["a", "b", "c", "d"], slow: 3, href: "/deck/shaky" } });
  assert.deepEqual(
    o.slice(0, 3).map((x) => [x.title, x.badge]),
    [
      ["Fix your misses", "3 to fix"],
      ["Right, but shaky", "4 cards"],
      ["Review Systems Programmer", "4 due"],
    ],
  );
  assert.equal(o[1].href, "/deck/shaky");
});

test("each row knows its icon, its cards, and how many a review takes", () => {
  const o = options({ pathCards: { "systems-programmer": ["x", "y"] } });
  assert.deepEqual(
    o.map((x) => [x.icon, x.pathSlug, x.cardIds.length, x.toDo]),
    [
      ["misses", null, 3, 3],
      ["path", "systems-programmer", 2, 4],
      ["path", "foundations", 0, 12],
    ],
  );
});
