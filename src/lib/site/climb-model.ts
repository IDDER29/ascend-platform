/** The homepage's staircase: one step for each path on the track, from a single bit upwards. Pure. */
import { durationLabel } from "@/lib/paths/paths-v2-model";

/** What the staircase needs to know about a path (a `PathView` has all of it). */
export type ClimbPath = {
  slug: string;
  title: string;
  href: string;
  stage: number | null;
  soon: boolean;
  branchOf: string | null;
  milestone: string | null;
  minutes: number;
  courses: unknown[];
};

export type ClimbStage = { slug: string; stage: number; title: string; goal: string; size: string; href: string };

/** Where each path leads, in a few words. */
const GOALS: Record<string, string> = {
  foundations: "From a bit to a computer",
  "systems-programmer": "Write your own shell",
  "computer-architect": "Design your own processor",
};

/** Live paths on the track, bottom first. The bottom step starts the first lesson. */
export function climbStages(paths: ClimbPath[], firstLessonHref: string): ClimbStage[] {
  return paths
    .filter((p): p is ClimbPath & { stage: number } => !p.soon && p.stage !== null && p.branchOf === null)
    .sort((a, b) => a.stage - b.stage)
    .map((p, i) => ({
      slug: p.slug,
      stage: p.stage,
      title: p.title,
      goal: GOALS[p.slug] ?? p.milestone ?? "",
      size: `${p.courses.length} courses · ${durationLabel(p.minutes)}`,
      href: i === 0 ? firstLessonHref : p.href,
    }));
}

/** How far right a step sits (percent): evenly spread from 0 for the bottom step to `max` for the top one. */
export function stairOffset(index: number, count: number, max: number): number {
  return count > 1 ? (index / (count - 1)) * max : 0;
}
