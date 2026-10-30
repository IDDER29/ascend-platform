import Link from "next/link";
import type { ProfileModel, ProfileProject, ProfileSkill } from "@/lib/profile/profile-model";
import { StackProject } from "./stack-project";

/** Delay per layer and per pip for the one bottom-up light-up on load. */
const LAYER_DELAY_MS = 260;
const PIP_DELAY_MS = 45;

const LAYER: Record<ProfileSkill["state"], string> = {
  done: "border-transparent bg-[var(--coach-hero-bg)] text-[var(--coach-hero-ink)]",
  current: "border-[var(--coach-blue)] bg-[var(--coach-surface)] shadow-[inset_4px_0_0_var(--coach-blue)]",
  next: "border-dashed border-[var(--coach-border-strong)] bg-transparent",
};

const NUMBER: Record<ProfileSkill["state"], string> = {
  done: "text-[var(--coach-lime)]",
  current: "text-[var(--coach-blue)]",
  next: "text-[var(--coach-ink-muted)]",
};

const PIP: Record<ProfileSkill["state"], { on: string; off: string }> = {
  done: { on: "bg-[var(--coach-lime)]", off: "bg-[var(--coach-hero-track)]" },
  current: { on: "bg-[var(--coach-blue)]", off: "bg-[var(--coach-scale-empty)]" },
  next: { on: "bg-[var(--coach-blue)]", off: "bg-[var(--coach-scale-empty)]" },
};

function statusLine(skill: ProfileSkill, owner: boolean): string {
  if (skill.state === "done") return `All ${skill.total} lessons done`;
  if (skill.state === "current") {
    return skill.done === 0
      ? owner
        ? "You're about to start here"
        : "Starting here next"
      : `Climbing now, ${skill.done} of ${skill.total} lessons`;
  }
  return `${skill.total} lessons ahead`;
}

function Layer({
  skill,
  projects,
  owner,
  index,
  next,
}: {
  skill: ProfileSkill;
  projects: ProfileProject[];
  owner: boolean;
  index: number;
  /** The owner's next lesson, shown on the layer being climbed. */
  next: ProfileModel["next"];
}) {
  const done = skill.state === "done";
  const pip = PIP[skill.state];
  return (
    <li
      className={`grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-4 gap-y-3 rounded-2xl border-2 p-4 sm:grid-cols-[3.25rem_minmax(0,1fr)_auto] sm:items-center sm:p-5 ${LAYER[skill.state]}`}
    >
      <span
        aria-hidden="true"
        className={`row-span-2 self-start font-display text-[32px] font-extrabold leading-none tracking-[-0.04em] sm:row-span-1 sm:self-center sm:text-[40px] ${NUMBER[skill.state]}`}
      >
        {skill.levelNumber}
      </span>

      <div className="flex min-w-0 flex-col gap-2">
        <div className="flex flex-col gap-0.5">
          <h3 className="m-0 text-[16px] font-semibold leading-snug">
            <span className="sr-only">Level {skill.levelNumber}: </span>
            {skill.levelName}
          </h3>
          <p
            className={`m-0 text-[14px] leading-snug ${
              done
                ? "text-[var(--coach-hero-muted)]"
                : skill.state === "next"
                  ? "text-[var(--coach-ink-muted)]"
                  : "text-[var(--coach-ink-secondary)]"
            }`}
          >
            {skill.statement}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <span
            role="img"
            aria-label={`${skill.done} of ${skill.total} lessons done`}
            className="flex gap-1"
          >
            {skill.lessons.map((lesson, i) => (
              <span
                key={lesson.href}
                title={lesson.title}
                style={{ ["--pip-delay" as string]: `${index * LAYER_DELAY_MS + i * PIP_DELAY_MS}ms` }}
                className={`h-2 w-5 origin-bottom rounded-full sm:w-6 ${lesson.done ? `${pip.on} profile-pip-rise` : pip.off}`}
              />
            ))}
          </span>
          <span
            className={`text-[12.5px] ${
              done
                ? "text-[var(--coach-hero-muted)]"
                : skill.state === "current"
                  ? "font-semibold text-[var(--coach-blue)]"
                  : "text-[var(--coach-ink-muted)]"
            }`}
          >
            {statusLine(skill, owner)}
          </span>
        </div>
        {next && skill.state === "current" ? (
          <Link
            href={next.href}
            className="mt-1 inline-flex min-h-10 w-fit max-w-full items-center rounded-xl bg-[var(--coach-lime)] px-4 py-2 text-left text-[13.5px] font-bold leading-snug text-[var(--coach-lime-ink)] no-underline shadow-[0_3px_0_var(--coach-lime-shadow)]"
          >
            Continue with {next.title}
          </Link>
        ) : null}
      </div>

      {projects.length > 0 ? (
        <div className="col-span-2 flex flex-col items-start gap-2 sm:col-span-1 sm:max-w-[240px] sm:items-end">
          {projects.map((project) => (
            <StackProject key={project.id} project={project} onDark={done} />
          ))}
        </div>
      ) : null}
    </li>
  );
}

/** The learner's climb drawn as the classic abstraction stack: Level 00 at the bottom. */
export function StackSection({ model }: { model: ProfileModel }) {
  const { skills, owner } = model;
  const projectsFor = (skill: ProfileSkill) =>
    model.curriculumProjects.filter((p) => p.levelNumber === skill.levelNumber);

  return (
    <section aria-labelledby="stack-title" className="flex min-w-0 flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 id="stack-title" className="m-0 font-display text-[22px] font-extrabold tracking-[-0.02em]">
          The stack
        </h2>
        <p className="m-0 max-w-[560px] text-[14px] leading-relaxed text-[var(--coach-ink-secondary)]">
          {owner ? "Your climb" : "The climb so far"}, from a single bit at the bottom to a working shell at the top.
          Each layer is a level; its project is pinned beside it.
        </p>
      </div>
      {/* DOM order is the climb (00 first); the column is reversed so it reads as a tower. */}
      <ol className="m-0 flex list-none flex-col-reverse gap-2 p-0">
        {skills.map((skill, i) => (
          <Layer
            key={skill.levelNumber}
            skill={skill}
            projects={projectsFor(skill)}
            owner={owner}
            index={i}
            next={model.next}
          />
        ))}
      </ol>
    </section>
  );
}
