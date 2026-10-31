import type { ReactNode } from "react";
import Link from "next/link";
import { Route } from "lucide-react";
import { CrestPatch } from "@/components/achievements/emblems";
import { PATH_ICONS } from "@/components/paths/path-catalog";
import { joinPathV2Action } from "@/lib/paths/actions";
import { durationLabel, type PathCourse, type PathView } from "@/lib/paths/paths-v2-model";

export const CARD = "rounded-[20px] border-2 border-[var(--coach-border)] bg-[var(--coach-surface)]";
export const PRIMARY =
  "inline-flex h-10 items-center rounded-xl bg-[var(--coach-solid-btn-bg)] px-4 text-[14px] font-bold text-[var(--coach-solid-btn-ink)] no-underline";
export const SECONDARY =
  "inline-flex h-10 items-center rounded-xl border-2 border-[var(--coach-border)] px-4 text-[14px] font-semibold text-[var(--coach-ink)] no-underline hover:border-[var(--coach-border-strong)]";

export function PathIcon({ slug, size = "md", muted = false }: { slug: string; size?: "md" | "lg"; muted?: boolean }) {
  const Icon = PATH_ICONS[slug] ?? Route;
  return (
    <span
      aria-hidden
      className={`flex shrink-0 items-center justify-center rounded-xl ${size === "lg" ? "size-14" : "size-11"} ${
        muted
          ? "bg-[var(--coach-tint-neutral-bg)] text-[var(--coach-ink-muted)]"
          : "bg-[var(--coach-hero-bg)] text-[var(--coach-lime)]"
      }`}
    >
      <Icon size={size === "lg" ? 24 : 20} strokeWidth={2.2} />
    </span>
  );
}

/** Just the path's icon, for placing on a tile of your own. */
export function PathGlyph({ slug, size = 24 }: { slug: string; size?: number }) {
  const Icon = PATH_ICONS[slug] ?? Route;
  return <Icon size={size} strokeWidth={2.2} aria-hidden />;
}

/** "18 lessons and 3 projects planned": a course none of whose lessons are written yet. */
export function plannedSummary(course: PathCourse): string {
  const soon = course.sections.flatMap((s) => s.upcoming);
  const projects = soon.filter((i) => i.project).length;
  const lessons = soon.length - projects;
  const parts = [
    lessons > 0 ? `${lessons} ${lessons === 1 ? "lesson" : "lessons"}` : null,
    projects > 0 ? `${projects} ${projects === 1 ? "project" : "projects"}` : null,
  ].filter(Boolean);
  return `${parts.join(" and ")} planned`;
}

/**
 * A course's outline. Once it has a written lesson, every row shows; until then it folds behind
 * "See every lesson" (titles and descriptions one click away) so unwritten courses don't fill the page.
 */
export function OutlineFold({ course, children }: { course: PathCourse; children: ReactNode }) {
  if (course.total > 0) return <>{children}</>;
  return (
    <details className="group rounded-xl border-2 border-dashed border-[var(--coach-border)] px-4 py-2">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-1.5 text-[14px] font-semibold text-[var(--coach-ink)] [&::-webkit-details-marker]:hidden">
        <span>
          See every lesson
          <span className="ml-2 font-normal text-[var(--coach-ink-muted)]">{plannedSummary(course)}</span>
        </span>
        <span aria-hidden className="text-[var(--coach-ink-muted)] transition-transform group-open:rotate-180">
          ▾
        </span>
      </summary>
      <div className="pt-3 pb-2">{children}</div>
    </details>
  );
}

/** What to take first: "Foundations", or "Foundations, through Assembly Language" when only part of it is needed. */
export function requiresName(requires: NonNullable<PathView["requires"]>): string {
  return requires.throughTitle ? `${requires.title}, through ${requires.throughTitle}` : requires.title;
}

/** "19 lessons · about 3 h · 2 projects", or what's planned for a path coming soon. */
export function pathMeta(path: PathView): string {
  if (path.soon) {
    const planned = path.courses.length;
    return `Coming soon · ${planned} ${planned === 1 ? "course" : "courses"} planned`;
  }
  return [
    `${path.lessons.total} ${path.lessons.total === 1 ? "lesson" : "lessons"}`,
    durationLabel(path.minutes),
    path.projects > 0 ? `${path.projects} ${path.projects === 1 ? "project" : "projects"}` : null,
  ]
    .filter(Boolean)
    .join(" · ");
}

/** One bar for the path: a segment per topic, filled by lessons done; finished topics show their crest. */
export function TopicBar({ path }: { path: PathView }) {
  const topics = path.courses.filter((c) => c.kind === "topic");
  return (
    <div className="flex flex-col gap-2">
      <div
        role="img"
        aria-label={`${path.lessons.done} of ${path.lessons.total} lessons done`}
        className="flex gap-1.5"
      >
        {topics.map((t) => (
          <span
            key={t.id}
            className="h-2 overflow-hidden rounded-full bg-[var(--coach-scale-empty)]"
            style={{ flexGrow: Math.max(1, t.total), flexBasis: 0 }}
          >
            <span
              className="block h-full rounded-full bg-[var(--coach-ink)]"
              style={{ width: `${t.total > 0 ? Math.round((t.done / t.total) * 100) : 0}%` }}
            />
          </span>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12.5px] text-[var(--coach-ink-secondary)]">
        <span className="tabular-nums">
          {path.lessons.done} of {path.lessons.total} lessons
        </span>
        <span aria-hidden className="text-[var(--coach-border-strong)]">
          ·
        </span>
        <span className="tabular-nums">
          {topics.filter((t) => t.finished).length} of {topics.length} {topics.length === 1 ? "topic" : "topics"}
        </span>
        {topics
          .filter((t) => t.finished && t.crest)
          .map((t) => (
            <span key={t.id} title={`${t.title} finished`}>
              <CrestPatch crest={t.crest!} earned size="sm" onDark={false} />
            </span>
          ))}
      </div>
    </div>
  );
}

export function JoinButton({
  slug,
  label = "Join path",
  className = PRIMARY,
}: {
  slug: string;
  label?: string;
  className?: string;
}) {
  return (
    <form action={joinPathV2Action}>
      <input type="hidden" name="slug" value={slug} />
      <button type="submit" className={`${className} cursor-pointer`}>
        {label}
      </button>
    </form>
  );
}

export function ContinueLink({ path }: { path: PathView }) {
  if (!path.next) return null;
  return (
    <Link href={path.next.href} className={PRIMARY}>
      Continue
    </Link>
  );
}
