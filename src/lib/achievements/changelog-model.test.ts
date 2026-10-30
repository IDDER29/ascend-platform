import assert from "node:assert/strict";
import { test } from "node:test";
import type { PracticeSessionRecord } from "@/lib/practice/history";
import type { ProfileLesson } from "@/lib/profile/profile-model";
import { buildAchievementsModel, type AchievementsInput } from "./achievements-model";
import { buildChangelogModel } from "./changelog-model";

const NOW = new Date(2026, 9, 30, 12, 0);
const L00 = "level-00-bits-logic";
const L01 = "level-01-machine-memory";
const L02 = "level-02-the-c-language";
const L03 = "level-03-systems-software";

const LESSONS: ProfileLesson[] = [
  [L00, "what-is-a-bit"],
  [L00, "project-half-adder"],
  [L01, "inside-the-cpu"],
  [L02, "what-a-pointer-really-is"],
  [L03, "signals"],
].map(([level, slug]) => ({ key: `${level}/${slug}`, level, slug, title: slug, href: `/lessons/${slug}` }));

function daysAgo(n: number): string {
  return new Date(2026, 9, 30 - n, 10).toISOString();
}

function session(at: string): PracticeSessionRecord {
  return { id: at, at, scopeType: "due", scopeLabel: "Due", pathSlug: null, correct: 4, total: 5, missIds: [], questionIds: [] };
}

function changelog(patch: Partial<AchievementsInput> = {}) {
  return buildChangelogModel(
    buildAchievementsModel({ lessons: LESSONS, completions: [], projectLinks: [], cards: [], history: [], now: NOW, ...patch }),
  );
}

test("before any release: v0.0.0, the whole roadmap, ShellForge ships alongside v0.4", () => {
  const log = changelog();
  assert.equal(log.currentVersion, "0.0.0");
  assert.equal(log.releases.length, 0);
  assert.deepEqual(log.roadmap.map((r) => r.version), ["0.1", "0.2", "0.3", "0.4", "1.0"]);
  assert.deepEqual(log.roadmap[3].alongside.map((a) => a.label), ["Ship It"]);
  assert.match(log.summary, /No release yet/);
});

test("entries land in the release period they were earned in; later ones are unreleased", () => {
  const log = changelog({
    // Groundwork released 10 days ago (last L00 lesson).
    completions: [
      { key: `${L00}/what-is-a-bit`, completedAt: daysAgo(12) },
      { key: `${L00}/project-half-adder`, completedAt: daysAgo(10) },
    ],
    // Half adder shipped the same day as the release, so it's part of v0.1.
    projectLinks: [{ projectId: "half-adder", repoUrl: "https://github.com/a/h", addedAt: daysAgo(10) }],
    // A week of practice finished 2 days ago, after the release.
    history: [8, 7, 6, 5, 4, 3, 2].map((d) => session(daysAgo(d))),
  });
  assert.equal(log.releases.length, 1);
  assert.equal(log.releases[0].version, "0.1");
  assert.deepEqual(log.releases[0].entries.map((e) => [e.verb, e.label]), [["Shipped", "Gate Builder"]]);
  assert.deepEqual(log.unreleased.map((e) => e.label), ["Week of Practice"]);
  assert.equal(log.currentVersion, "0.1.1");
  assert.match(log.summary, /Released v0.1 Groundwork/);
  assert.match(log.summary, /Next release: v0.2 Machine Head/);
  assert.equal(log.roadmap[0].version, "0.2");
});

test("hashes are 7 hex digits and stable", () => {
  const opts = {
    completions: [
      { key: `${L00}/what-is-a-bit`, completedAt: daysAgo(12) },
      { key: `${L00}/project-half-adder`, completedAt: daysAgo(10) },
    ],
  };
  const a = changelog(opts).releases[0].hash;
  assert.match(a, /^[0-9a-f]{7}$/);
  assert.equal(changelog(opts).releases[0].hash, a);
});

test("the shelf holds every badge once, in catalog order, each pointing at one place on the page", () => {
  const log = changelog({
    completions: [
      { key: `${L00}/what-is-a-bit`, completedAt: daysAgo(12) },
      { key: `${L00}/project-half-adder`, completedAt: daysAgo(10) },
    ],
  });
  assert.equal(log.shelf.length, 13);
  assert.deepEqual(log.shelf.slice(0, 2).map((b) => [b.id, b.earned]), [["groundwork", true], ["machine-head", false]]);
  assert.equal(log.shelf[0].href, "#badge-groundwork");
  // Every badge has exactly one home: an entry, an in-progress row, a roadmap line or "also open".
  const homes = [
    ...log.releases.flatMap((r) => [RELEASE_ID[r.version], ...r.entries.map((e) => e.id)]),
    ...log.unreleased.map((e) => e.id),
    ...log.inProgressIds,
    ...log.roadmap.flatMap((r) => [r.badgeId, ...r.alongside.map((a) => a.badgeId)]).filter((id) => !log.inProgressIds.includes(id)),
    ...log.alsoOpen.map((a) => a.badgeId),
  ];
  assert.deepEqual([...homes].sort(), log.shelf.map((b) => b.id).sort());
});

const RELEASE_ID: Record<string, string> = { "0.1": "groundwork", "0.2": "machine-head", "0.3": "the-craft", "0.4": "systems-sage", "1.0": "core-complete" };
