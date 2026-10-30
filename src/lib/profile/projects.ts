import type { LevelId } from "@/lib/content/schema";

/** What a curriculum project needs before its badge can be earned. */
export type ProjectRequirement =
  | { kind: "lesson"; level: LevelId; slug: string }
  | { kind: "level"; level: LevelId };

export type CurriculumProject = {
  id: string;
  title: string;
  /** One sentence: what shipping it proves. */
  proves: string;
  level: LevelId;
  requires: ProjectRequirement;
  /** Badge from `BADGES` earned when the requirement is met and a repo link is added. */
  badgeId: string;
  /** Where the project lives; null means the lesson page (resolved by the caller). */
  href: string | null;
};

/** Curriculum project work, in curriculum order. Every `project-*` lesson must appear here. */
export const CURRICULUM_PROJECTS: CurriculumProject[] = [
  {
    id: "half-adder",
    title: "Half adder",
    proves: "Adds two bits using nothing but logic gates.",
    level: "level-00-bits-logic",
    requires: { kind: "lesson", level: "level-00-bits-logic", slug: "project-half-adder" },
    badgeId: "gate-builder",
    href: null,
  },
  {
    id: "shellforge",
    title: "ShellForge",
    proves: "A working Unix shell: processes, pipes, redirection and signals.",
    level: "level-03-systems-software",
    requires: { kind: "level", level: "level-03-systems-software" },
    badgeId: "ship-it",
    href: "/projects/shellforge",
  },
];

export function curriculumProject(id: string): CurriculumProject | undefined {
  return CURRICULUM_PROJECTS.find((p) => p.id === id);
}
