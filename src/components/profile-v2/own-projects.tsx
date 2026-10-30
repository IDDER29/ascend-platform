"use client";

import { ExternalLink, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { addOwnProjectAction, removeOwnProjectAction } from "@/lib/profile/actions";
import { MAX_OWN_PROJECTS } from "@/lib/profile/links";
import type { ProfileModel } from "@/lib/profile/profile-model";
import { FIELD, SMALL_BUTTON } from "./styles";
import { useProfileAction } from "./use-profile-action";

type OwnProject = ProfileModel["ownProjects"][number];

function ProjectCard({ project, editable }: { project: OwnProject; editable: boolean }) {
  const { pending, error, run } = useProfileAction();
  return (
    <li className="flex min-w-0 flex-col gap-2.5 rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="m-0 min-w-0 text-[16px] font-semibold [overflow-wrap:anywhere]">{project.title}</h3>
        {editable ? (
          <button
            type="button"
            disabled={pending}
            aria-label={`Remove ${project.title}`}
            onClick={() => run(() => removeOwnProjectAction(project.id))}
            className="flex size-7 shrink-0 items-center justify-center rounded-lg text-[var(--coach-ink-muted)] hover:bg-[var(--coach-well)] hover:text-[var(--coach-wrong-ink)]"
          >
            <Trash2 size={14} aria-hidden="true" />
          </button>
        ) : null}
      </div>
      {project.description ? (
        <p className="m-0 text-[14px] leading-relaxed text-[var(--coach-ink-secondary)] [overflow-wrap:anywhere]">
          {project.description}
        </p>
      ) : null}
      {project.tags.length > 0 ? (
        <ul aria-label="Tags" className="m-0 flex list-none flex-wrap gap-1.5 p-0">
          {project.tags.map((tag) => (
            <li key={tag} className="rounded-md bg-[var(--coach-chip)] px-2 py-0.5 font-mono text-[11.5px] text-[var(--coach-ink-secondary)]">
              {tag}
            </li>
          ))}
        </ul>
      ) : null}
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer nofollow ugc"
        className="mt-auto flex min-w-0 items-center gap-1.5 font-mono text-[12.5px] text-[var(--coach-blue)] no-underline hover:underline"
      >
        <ExternalLink size={13} aria-hidden="true" className="shrink-0" />
        <span className="truncate">{project.urlLabel}</span>
      </a>
      {error ? (
        <p role="alert" className="m-0 text-[13px] text-[var(--coach-wrong-ink)]">
          {error}
        </p>
      ) : null}
    </li>
  );
}

function AddProjectTile() {
  const { pending, error, run } = useProfileAction();
  const [open, setOpen] = useState(false);
  const [fields, setFields] = useState({ title: "", description: "", url: "", tags: "" });
  const set = (key: keyof typeof fields) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFields((f) => ({ ...f, [key]: e.target.value }));

  if (!open) {
    return (
      <li>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-full min-h-[132px] w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[var(--coach-border-strong)] bg-transparent p-4 text-[14px] font-semibold text-[var(--coach-ink-secondary)] hover:border-[var(--coach-focus)] hover:text-[var(--coach-ink)]"
        >
          <Plus size={18} aria-hidden="true" />
          Add something you&apos;ve built
        </button>
      </li>
    );
  }

  return (
    <li className="sm:col-span-2">
      <form
        className="flex flex-col gap-3 rounded-2xl border-2 border-[var(--coach-focus)] bg-[var(--coach-surface)] p-4"
        onSubmit={(event) => {
          event.preventDefault();
          run(() => addOwnProjectAction(fields), () => {
            setOpen(false);
            setFields({ title: "", description: "", url: "", tags: "" });
          });
        }}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-[13px] font-semibold">
            Name
            <input autoFocus required maxLength={60} value={fields.title} onChange={set("title")} placeholder="cpu-sim" className={FIELD} />
          </label>
          <label className="flex flex-col gap-1.5 text-[13px] font-semibold">
            Link
            <input required value={fields.url} onChange={set("url")} placeholder="github.com/you/cpu-sim" className={FIELD} />
          </label>
          <label className="flex flex-col gap-1.5 text-[13px] font-semibold sm:col-span-2">
            One line about it
            <input maxLength={140} value={fields.description} onChange={set("description")} placeholder="A 6502 emulator in Rust" className={FIELD} />
          </label>
          <label className="flex flex-col gap-1.5 text-[13px] font-semibold sm:col-span-2">
            Tags <span className="font-normal text-[var(--coach-ink-muted)]">comma separated, up to 5</span>
            <input value={fields.tags} onChange={set("tags")} placeholder="Rust, emulators" className={FIELD} />
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="submit"
            disabled={pending}
            className="h-9 rounded-lg bg-[var(--coach-lime)] px-4 text-[13px] font-bold text-[var(--coach-lime-ink)] shadow-[0_3px_0_var(--coach-lime-shadow)] disabled:opacity-60"
          >
            Add project
          </button>
          <button type="button" onClick={() => setOpen(false)} className={SMALL_BUTTON}>
            Cancel
          </button>
        </div>
        {error ? (
          <p role="alert" className="m-0 text-[13px] text-[var(--coach-wrong-ink)]">
            {error}
          </p>
        ) : null}
      </form>
    </li>
  );
}

export function OwnProjects({ projects, editable }: { projects: OwnProject[]; editable: boolean }) {
  return (
    <section aria-labelledby="own-projects-title" className="flex min-w-0 flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h2 id="own-projects-title" className="m-0 font-display text-[22px] font-extrabold tracking-[-0.02em]">
          Own projects
        </h2>
        <p className="m-0 text-[14px] text-[var(--coach-ink-secondary)]">
          Built outside the curriculum, so they don&apos;t earn curriculum badges.
        </p>
      </div>
      <ul className="m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} editable={editable} />
        ))}
        {editable && projects.length < MAX_OWN_PROJECTS ? <AddProjectTile /> : null}
      </ul>
    </section>
  );
}
