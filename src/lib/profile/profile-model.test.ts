import assert from "node:assert/strict";
import { test } from "node:test";
import { buildProfileModel, type ProfileInput, type ProfileLesson } from "./profile-model";

const L00 = "level-00-bits-logic";
const L01 = "level-01-machine-memory";
const L03 = "level-03-systems-software";

const LESSONS: ProfileLesson[] = [
  [L00, "what-is-a-bit"],
  [L00, "project-half-adder"],
  [L01, "inside-the-cpu"],
  [L03, "system-calls"],
  [L03, "signals"],
].map(([level, slug]) => ({
  key: `${level}/${slug}`,
  level,
  slug,
  title: slug,
  href: `/lessons/${slug}`,
}));

function daysAgo(n: number): string {
  return new Date(2026, 9, 30 - n, 10).toISOString();
}

function done(...slugs: string[]) {
  return slugs.map((slug, i) => {
    const lesson = LESSONS.find((l) => l.slug === slug)!;
    return { key: lesson.key, completedAt: daysAgo(10 - i) };
  });
}

function input(patch: Partial<ProfileInput> = {}): ProfileInput {
  return {
    viewer: "owner",
    profile: { name: "Ada Lovelace", username: "ada", bio: "", joinedAt: daysAgo(20) },
    isPublic: false,
    lessons: LESSONS,
    completions: [],
    projectLinks: [],
    ownProjects: [],
    links: [],
    badges: [],
    practice: { sessions: 0, firstAt: null, tenthAt: null },
    ...patch,
  };
}

test("new learner: honest start, first project is next, journey is just joining", () => {
  const model = buildProfileModel(input());
  assert.equal(model.hero.levelLabel, null);
  assert.equal(model.snapshot.lessonsDone, 0);
  assert.deepEqual(
    model.curriculumProjects.map((p) => [p.id, p.state]),
    [["half-adder", "next"]],
  );
  assert.equal(model.journey.length, 1);
  assert.match(model.journey[0].text, /Joined Ascend/);
  assert.equal(model.next?.title, "what-is-a-bit");
  assert.equal(model.skills[0].state, "current");
});

test("project lesson done without a link is ready for the owner and hidden from visitors", () => {
  const completions = done("what-is-a-bit", "project-half-adder");
  const owner = buildProfileModel(input({ completions }));
  assert.equal(owner.curriculumProjects[0].state, "ready");
  assert.equal(owner.eligibleBadges.length, 0);

  const visitor = buildProfileModel(input({ completions, viewer: "visitor" }));
  assert.deepEqual(visitor.curriculumProjects, []);
  assert.equal(visitor.next, null);
});

test("lesson done + repo link ships the project and makes its badge eligible", () => {
  const model = buildProfileModel(
    input({
      completions: done("what-is-a-bit", "project-half-adder"),
      projectLinks: [{ projectId: "half-adder", repoUrl: "https://github.com/ada/half-adder", addedAt: daysAgo(2) }],
    }),
  );
  const project = model.curriculumProjects[0];
  assert.equal(project.state, "shipped");
  assert.equal(project.repoUrl, "https://github.com/ada/half-adder");
  assert.equal(project.badge?.label, "Gate Builder");
  assert.deepEqual(model.eligibleBadges.map((b) => b.badgeId), ["gate-builder"]);
  assert.equal(model.snapshot.projectsShipped, 1);
  assert.ok(model.journey.some((e) => /Shipped Half adder/.test(e.text)));
  assert.ok(model.journey.some((e) => /Finished Level 00/.test(e.text)));
});

test("a link without the finished lesson does not ship the project", () => {
  const model = buildProfileModel(
    input({
      completions: done("what-is-a-bit"),
      projectLinks: [{ projectId: "half-adder", repoUrl: "https://github.com/ada/x", addedAt: daysAgo(1) }],
    }),
  );
  assert.equal(model.curriculumProjects[0].state, "next");
  assert.deepEqual(model.eligibleBadges, []);
});

test("ShellForge needs every Level 03 lesson", () => {
  const link = { projectId: "shellforge", repoUrl: "https://github.com/ada/sh", addedAt: daysAgo(1) };
  const partial = buildProfileModel(input({ completions: done("system-calls"), projectLinks: [link] }));
  assert.notEqual(partial.curriculumProjects.find((p) => p.id === "shellforge")?.state, "shipped");

  const full = buildProfileModel(input({ completions: done("system-calls", "signals"), projectLinks: [link] }));
  assert.equal(full.curriculumProjects.find((p) => p.id === "shellforge")?.state, "shipped");
  assert.ok(full.eligibleBadges.some((b) => b.badgeId === "ship-it"));
});

test("already-earned badges are shown, not re-awarded", () => {
  const model = buildProfileModel(
    input({
      completions: done("project-half-adder"),
      projectLinks: [{ projectId: "half-adder", repoUrl: "https://github.com/ada/h", addedAt: daysAgo(2) }],
      badges: [{ badgeId: "gate-builder", earnedAt: daysAgo(2) }],
    }),
  );
  assert.deepEqual(model.eligibleBadges, []);
  assert.deepEqual(model.achievements.map((a) => a.label), ["Gate Builder"]);
});

test("hero level, skills and links", () => {
  const model = buildProfileModel(
    input({
      completions: done("what-is-a-bit", "project-half-adder"),
      links: [
        { id: "l1", url: "https://github.com/ada", label: null },
        { id: "l2", url: "https://ada.dev", label: "Blog" },
      ],
    }),
  );
  assert.equal(model.hero.levelLabel, "Level 01 · Machine & Memory");
  assert.deepEqual(model.hero.links.map((l) => [l.kind, l.label]), [["github", "GitHub"], ["website", "Blog"]]);
  assert.deepEqual(model.skills.slice(0, 3).map((s) => s.state), ["done", "current", "next"]);
});

test("practice milestones join the journey, newest first", () => {
  const model = buildProfileModel(
    input({
      completions: done("what-is-a-bit"),
      practice: { sessions: 12, firstAt: daysAgo(8), tenthAt: daysAgo(1) },
    }),
  );
  const texts = model.journey.map((e) => e.text);
  assert.equal(texts[0], "10 review sessions in Practice");
  assert.ok(texts.includes("First review session in Practice"));
  assert.equal(texts.at(-1), "Joined Ascend");
});
