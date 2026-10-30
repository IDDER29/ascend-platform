import { Check, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { ProfileModel, ProfileProject } from "@/lib/profile/profile-model";
import { ProjectLinkForm } from "./project-link-form";
import { MUTED_LINE } from "./styles";

function ProjectCard({ project }: { project: ProfileProject }) {
  const shipped = project.state === "shipped";
  return (
    <li
      className={`flex min-w-0 flex-col gap-3 rounded-2xl border-2 p-4 ${
        project.state === "next"
          ? "border-dashed border-[var(--coach-border)] bg-transparent"
          : "border-[var(--coach-border)] bg-[var(--coach-surface)]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <span className="font-mono text-[11.5px] uppercase tracking-[0.06em] text-[var(--coach-ink-muted)]">
            L{project.levelNumber} · {shipped ? `Shipped ${project.shippedLabel}` : project.state === "ready" ? "Lesson done" : "Next up"}
          </span>
          <h3 className="m-0 flex items-center gap-1.5 text-[16px] font-semibold">
            {shipped ? (
              <span className="flex size-5 items-center justify-center rounded-full bg-[var(--coach-success)] text-white">
                <Check size={12} strokeWidth={3} aria-hidden="true" />
              </span>
            ) : null}
            {project.title}
          </h3>
        </div>
        {shipped && project.badge ? (
          <span
            title={`Badge: ${project.badge.label}`}
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-[var(--coach-tint-lime-bg)] px-2.5 py-1 text-[12px] font-semibold text-[var(--coach-tint-lime-ink)]"
          >
            <span aria-hidden="true">{project.badge.glyph}</span>
            {project.badge.label}
          </span>
        ) : null}
      </div>
      <p className="m-0 text-[14px] leading-relaxed text-[var(--coach-ink-secondary)]">{project.proves}</p>
      {shipped && project.repoUrl ? (
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noopener noreferrer nofollow ugc"
          className="flex min-w-0 items-center gap-1.5 font-mono text-[12.5px] text-[var(--coach-blue)] no-underline hover:underline"
        >
          <ExternalLink size={13} aria-hidden="true" className="shrink-0" />
          <span className="truncate">{project.repoLabel}</span>
        </a>
      ) : null}
      {project.state === "ready" ? (
        <ProjectLinkForm projectId={project.id} badgeLabel={project.badge?.label ?? null} />
      ) : null}
      {project.state === "next" ? (
        <Link href={project.href} className="text-[13px] font-semibold text-[var(--coach-ink)] underline underline-offset-2">
          See the project
        </Link>
      ) : null}
    </li>
  );
}

export function CurriculumProjects({ model }: { model: ProfileModel }) {
  const projects = model.curriculumProjects;
  const shipped = model.snapshot.projectsShipped;
  return (
    <section aria-labelledby="curriculum-projects-title" className="flex min-w-0 flex-col gap-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="curriculum-projects-title" className="m-0 text-lg font-semibold">
          Curriculum projects
        </h2>
        {shipped > 0 ? (
          <span className="font-mono text-xs text-[var(--coach-ink-muted)]">
            {shipped} of {model.projectTotal} shipped
          </span>
        ) : null}
      </div>
      {projects.length === 0 ? (
        <p className={MUTED_LINE}>No curriculum projects shipped yet.</p>
      ) : (
        <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </ul>
      )}
    </section>
  );
}
