import assert from "node:assert/strict";
import { test } from "node:test";
import { climbStages, stairOffset, type ClimbPath } from "./climb-model";

const path = (slug: string, stage: number | null, over: Partial<ClimbPath> = {}): ClimbPath => ({
  slug,
  title: slug,
  href: `/catalog/${slug}`,
  stage,
  soon: false,
  branchOf: null,
  milestone: `${slug} done`,
  minutes: 1434,
  courses: [{}, {}],
  ...over,
});

test("one step per live path on the track, in stage order", () => {
  const stages = climbStages(
    [
      path("computer-architect", 3),
      path("foundations", 1),
      path("systems-programmer", 2),
      path("python-foundations", 1, { soon: true }),
      path("network-engineer", null),
      path("linux-engineer", 2, { branchOf: "systems-programmer" }),
    ],
    "/lessons/first",
  );
  assert.deepEqual(
    stages.map((s) => [s.stage, s.slug]),
    [
      [1, "foundations"],
      [2, "systems-programmer"],
      [3, "computer-architect"],
    ],
  );
});

test("the first step opens the first lesson; the others open their path", () => {
  const stages = climbStages([path("foundations", 1), path("systems-programmer", 2)], "/lessons/first");
  assert.deepEqual(
    stages.map((s) => s.href),
    ["/lessons/first", "/catalog/systems-programmer"],
  );
});

test("each step says where it leads and how big it is", () => {
  const [known, other] = climbStages([path("foundations", 1), path("new-path", 2)], "/lessons/first");
  assert.equal(known.goal, "From a bit to a computer");
  assert.equal(known.size, "2 courses · about 24 h");
  // A path with no line of its own shows its milestone.
  assert.equal(other.goal, "new-path done");
});

test("stair offsets stay inside the staircase however many steps there are", () => {
  assert.deepEqual(
    [0, 1, 2].map((i) => stairOffset(i, 3, 24)),
    [0, 12, 24],
  );
  assert.equal(stairOffset(19, 20, 24), 24);
  assert.equal(stairOffset(0, 1, 24), 0);
});
