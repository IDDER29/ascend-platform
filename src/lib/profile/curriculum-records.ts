/** Shared, client-safe readings of curriculum records: finished levels and shipped projects. */
import { levelIds } from "@/lib/content/schema";
import { CURRICULUM_PROJECTS, type CurriculumProject } from "./projects";

type Lesson = { key: string; level: string };
type ProjectLink = { projectId: string; repoUrl: string; addedAt: string };

export function latestIso(isos: string[]): string {
  return isos.reduce((a, b) => (Date.parse(b) > Date.parse(a) ? b : a));
}

/** Level id → when its last lesson was finished, for levels with every lesson done. */
export function levelFinishedAt(lessons: Lesson[], completedAt: ReadonlyMap<string, string>): Map<string, string> {
  const finished = new Map<string, string>();
  for (const id of levelIds) {
    const levelLessons = lessons.filter((l) => l.level === id);
    if (levelLessons.length > 0 && levelLessons.every((l) => completedAt.has(l.key))) {
      finished.set(id, latestIso(levelLessons.map((l) => completedAt.get(l.key)!)));
    }
  }
  return finished;
}

export type ProjectStatus = {
  project: CurriculumProject;
  /** When the project's lessons were done; null until then. */
  metAt: string | null;
  link: ProjectLink | null;
  /** Lessons done and repo linked: the later of the two. */
  shippedAt: string | null;
};

/** Every curriculum project, in order: met when its lessons are done, shipped once a repo is linked too. */
export function projectStatuses(
  completedAt: ReadonlyMap<string, string>,
  finishedLevels: ReadonlyMap<string, string>,
  projectLinks: ProjectLink[],
): ProjectStatus[] {
  const linkFor = new Map(projectLinks.map((p) => [p.projectId, p]));
  return CURRICULUM_PROJECTS.map((project) => {
    const { requires } = project;
    const metAt =
      requires.kind === "level"
        ? (finishedLevels.get(requires.level) ?? null)
        : (completedAt.get(`${requires.level}/${requires.slug}`) ?? null);
    const link = linkFor.get(project.id) ?? null;
    return { project, metAt, link, shippedAt: metAt && link ? latestIso([metAt, link.addedAt]) : null };
  });
}
