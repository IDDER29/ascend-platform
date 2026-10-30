/**
 * /achievementsv3: the same badges as /achievementsv2, told as a changelog.
 * Finishing a level is a release (v0.1 … v0.4, Core Complete is v1.0);
 * every other badge is an entry in the release period it was earned in.
 */
import type { AchievementPart, AchievementsModel } from "./achievements-model";
import type { AchievementGroup } from "./catalog";

/** Release versions, in curriculum order: each one ships with its badge. */
export const RELEASES: { version: string; badgeId: string }[] = [
  { version: "0.1", badgeId: "groundwork" },
  { version: "0.2", badgeId: "machine-head" },
  { version: "0.3", badgeId: "the-craft" },
  { version: "0.4", badgeId: "systems-sage" },
  { version: "1.0", badgeId: "core-complete" },
];

/** The verb a changelog would use for each kind of entry. */
const VERB: Record<AchievementGroup, string> = {
  level: "Released",
  core: "Released",
  project: "Shipped",
  memory: "Held",
  habit: "Kept up",
};

export type ChangelogEntry = {
  id: string;
  verb: string;
  label: string;
  glyph: string;
  means: string;
  at: string;
  dateLabel: string;
  /** Short, stable commit-style id for the entry. */
  hash: string;
  repoUrl: string | null;
  repoLabel: string | null;
};

export type Release = {
  version: string;
  label: string;
  glyph: string;
  means: string;
  at: string;
  dateLabel: string;
  hash: string;
  /** Other badges earned in this release's period, newest first. */
  entries: ChangelogEntry[];
};

export type RoadmapItem = {
  version: string;
  label: string;
  how: string;
  distance: string | null;
  progress: { done: number; total: number } | null;
  /** Badges that ship alongside this release, like ShellForge with v0.4. */
  alongside: { label: string; how: string }[];
};

export type ChangelogModel = {
  /** "0.1.2": latest release plus entries since; "0.0.n" before the first release. */
  currentVersion: string;
  summary: string;
  /** Earned since the latest release, newest first. */
  unreleased: ChangelogEntry[];
  inProgress: AchievementPart[];
  /** Released versions, newest first. */
  releases: Release[];
  roadmap: RoadmapItem[];
  /** Open badges that aren't tied to a release and aren't in progress. */
  alsoOpen: { label: string; how: string }[];
};

/** FNV-1a, shown as 7 hex digits: stable per badge and date, looks like a commit id. */
function shortHash(text: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16).padStart(8, "0").slice(0, 7);
}

function entryFor(part: AchievementPart): ChangelogEntry {
  return {
    id: part.id,
    verb: VERB[part.group],
    label: part.label,
    glyph: part.glyph,
    means: part.means,
    at: part.earnedAt!,
    dateLabel: part.earnedLabel!,
    hash: shortHash(`${part.id}:${part.earnedAt}`),
    repoUrl: part.repoUrl,
    repoLabel: part.repoLabel,
  };
}

const byNewest = (a: { at: string }, b: { at: string }) => Date.parse(b.at) - Date.parse(a.at);

export function buildChangelogModel(model: AchievementsModel): ChangelogModel {
  const partById = new Map(model.parts.map((p) => [p.id, p]));
  const releaseIds = new Set(RELEASES.map((r) => r.badgeId));

  const released = RELEASES.map((r) => ({ ...r, part: partById.get(r.badgeId)! }))
    .filter((r) => r.part.earned)
    .sort((a, b) => Date.parse(a.part.earnedAt!) - Date.parse(b.part.earnedAt!));

  // Each entry belongs to the first release on or after its date; later ones are unreleased.
  const entries = model.parts.filter((p) => p.earned && !releaseIds.has(p.id)).map(entryFor);
  const releaseOf = (entry: ChangelogEntry) =>
    released.find((r) => Date.parse(entry.at) <= Date.parse(r.part.earnedAt!)) ?? null;

  const releases: Release[] = released
    .map((r) => ({
      version: r.version,
      label: r.part.label,
      glyph: r.part.glyph,
      means: r.part.means,
      at: r.part.earnedAt!,
      dateLabel: r.part.earnedLabel!,
      hash: shortHash(`${r.badgeId}:${r.part.earnedAt}`),
      entries: entries.filter((e) => releaseOf(e)?.badgeId === r.badgeId).sort(byNewest),
    }))
    .reverse();
  const unreleased = entries.filter((e) => !releaseOf(e)).sort(byNewest);

  const latest = released.at(-1) ?? null;
  const currentVersion = `${latest ? latest.version : "0.0"}.${unreleased.length}`;

  const inProgress = model.upNext;
  const inProgressIds = new Set(inProgress.map((p) => p.id));

  const roadmap: RoadmapItem[] = RELEASES.filter((r) => !partById.get(r.badgeId)!.earned).map((r) => {
    const part = partById.get(r.badgeId)!;
    const level = model.columns.find((c) => c.level.id === r.badgeId);
    const alongside = level?.project && !level.project.earned ? [{ label: level.project.label, how: level.project.how }] : [];
    return {
      version: r.version,
      label: part.label,
      how: part.how,
      distance: part.distance,
      progress: part.progress,
      alongside,
    };
  });
  const onRoadmap = new Set(
    RELEASES.flatMap((r) => {
      const level = model.columns.find((c) => c.level.id === r.badgeId);
      return [r.badgeId, ...(level?.project ? [level.project.id] : [])];
    }),
  );
  const alsoOpen = model.parts
    .filter((p) => !p.earned && !inProgressIds.has(p.id) && !onRoadmap.has(p.id))
    .map((p) => ({ label: p.label, how: p.how }));

  const next = roadmap[0];
  const nextLine = next ? ` Next release: v${next.version} ${next.label}${next.distance ? `, ${next.distance}` : ""}.` : "";
  const summary = !latest
    ? `No release yet. v0.1 ships when you finish Level 00${next?.distance ? `, ${next.distance}` : ""}.`
    : roadmap.length === 0
      ? `v1.0 is out. Every release has shipped${unreleased.length ? `, with ${unreleased.length} more since` : ""}.`
      : `Released v${latest.version} ${latest.part.label} on ${latest.part.earnedLabel}.` +
        (unreleased.length ? ` ${unreleased.length === 1 ? "One badge" : `${unreleased.length} badges`} since.` : "") +
        nextLine;

  return { currentVersion, summary, unreleased, inProgress, releases, roadmap, alsoOpen };
}
