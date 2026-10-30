"use client";

import { Check, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { ProfileProject } from "@/lib/profile/profile-model";
import { ProjectLinkForm } from "./project-link-form";

/** A curriculum project pinned to the end of its layer in the stack. */
export function StackProject({ project, onDark }: { project: ProfileProject; onDark: boolean }) {
  const [linking, setLinking] = useState(false);

  if (project.state === "shipped") {
    return (
      <div className="flex min-w-0 flex-col items-start gap-1.5 sm:items-end">
        <span
          title={project.proves}
          className={`inline-flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3.5 text-[13.5px] font-semibold ${
            onDark
              ? "bg-[var(--coach-lime)] text-[var(--coach-lime-ink)]"
              : "bg-[var(--coach-tint-lime-bg)] text-[var(--coach-tint-lime-ink)]"
          }`}
        >
          <span className="flex size-5 items-center justify-center rounded-full bg-[var(--coach-lime-ink)] text-[var(--coach-lime)]">
            <Check size={12} strokeWidth={3} aria-hidden="true" />
          </span>
          {project.title} shipped
        </span>
        {project.repoUrl ? (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer nofollow ugc"
            className={`flex max-w-full items-center gap-1.5 text-[12.5px] no-underline hover:underline ${
              onDark ? "text-[var(--coach-hero-ink)]" : "text-[var(--coach-blue)]"
            }`}
          >
            <ExternalLink size={12} aria-hidden="true" className="shrink-0" />
            <span className="truncate font-mono">{project.repoLabel}</span>
          </a>
        ) : null}
        {project.badge ? (
          <span className={`text-[12px] ${onDark ? "text-[var(--coach-hero-muted)]" : "text-[var(--coach-ink-muted)]"}`}>
            Earned {project.badge.label} on {project.shippedLabel}
          </span>
        ) : null}
      </div>
    );
  }

  if (project.state === "ready") {
    return linking ? (
      <div className="w-full rounded-xl bg-[var(--coach-surface)] p-3 text-[var(--coach-ink)] sm:w-[240px]">
        <p className="m-0 mb-2 text-[13px] leading-snug text-[var(--coach-ink-secondary)]">{project.proves}</p>
        <ProjectLinkForm projectId={project.id} badgeLabel={project.badge?.label ?? null} />
      </div>
    ) : (
      <button
        type="button"
        onClick={() => setLinking(true)}
        className="inline-flex h-10 items-center gap-2 rounded-xl bg-[var(--coach-lime)] px-4 text-[13.5px] font-bold text-[var(--coach-lime-ink)] shadow-[0_3px_0_var(--coach-lime-shadow)]"
      >
        Ship {project.title}: add your repo
      </button>
    );
  }

  return (
    <Link
      href={project.href}
      className="inline-flex items-center gap-2 rounded-full border-2 border-dashed border-[var(--coach-border-strong)] px-3.5 py-1.5 text-[13px] font-semibold text-[var(--coach-ink-secondary)] no-underline hover:border-[var(--coach-focus)] hover:text-[var(--coach-ink)]"
    >
      Next project: {project.title}
    </Link>
  );
}
