import { Fragment } from "react";
import Link from "next/link";
import { ArrowDown, ArrowRight, Flag } from "lucide-react";
import type { PathView } from "@/lib/paths/paths-v2-model";
import { PathIcon } from "./path-parts";

const COL = ["md:col-start-1", "md:col-start-2", "md:col-start-3", "md:col-start-4", "md:col-start-5"];

/** How many stages the main track has (Foundations → Systems Programmer → Computer Architect). */
export const TRACK_STAGES = 3;

function StageCard({ path, here, progress }: { path: PathView; here: boolean; progress: boolean }) {
  return (
    <Link
      href={path.href}
      className={`flex h-full flex-col gap-3 rounded-[20px] border-2 bg-[var(--coach-surface)] p-4 text-[var(--coach-ink)] no-underline hover:border-[var(--coach-border-strong)] sm:p-5 ${
        here ? "border-[var(--coach-ink)]" : "border-[var(--coach-border)]"
      } ${path.soon ? "bg-transparent" : ""}`}
    >
      <div className="flex items-start gap-3">
        <PathIcon slug={path.slug} muted={path.soon} />
        <div className="min-w-0 flex-1">
          <p className="m-0 text-[12.5px] font-semibold text-[var(--coach-ink-muted)]">
            Stage {path.stage}
            {path.soon ? " · Coming soon" : ""}
          </p>
          <h3 className="m-0 text-[17px] font-bold leading-tight">{path.title}</h3>
        </div>
        {here && (
          <span className="shrink-0 rounded-full bg-[var(--coach-lime)] px-2 py-0.5 text-[11.5px] font-semibold text-[var(--coach-lime-ink)]">
            You&apos;re here
          </span>
        )}
      </div>
      {progress && !path.soon && (
        <div className="flex flex-col gap-1">
          <span
            aria-hidden
            className="block h-1.5 overflow-hidden rounded-full bg-[var(--coach-scale-empty)]"
          >
            <span
              className="block h-full rounded-full bg-[var(--coach-ink)]"
              style={{
                width: `${path.lessons.total > 0 ? Math.round((path.lessons.done / path.lessons.total) * 100) : 0}%`,
              }}
            />
          </span>
          <span className="text-[12.5px] tabular-nums text-[var(--coach-ink-secondary)]">
            {path.lessons.done} of {path.lessons.total} lessons
          </span>
        </div>
      )}
      {(path.milestone || path.courses.some((c) => c.milestone)) && (
        <ul className="m-0 mt-auto flex list-none flex-col gap-1 p-0">
          {path.courses
            .filter((c) => c.milestone)
            .map((c) => (
              <li key={c.id} className="flex items-start gap-2 text-[13.5px] text-[var(--coach-ink-secondary)]">
                <Flag size={14} strokeWidth={2.4} aria-hidden className="mt-0.5 shrink-0 text-[var(--coach-ink-muted)]" />
                <span>
                  {c.milestone} <span className="text-[var(--coach-ink-muted)]">after {c.title}</span>
                </span>
              </li>
            ))}
          {path.milestone && (
            <li className="flex items-start gap-2 text-[13.5px] text-[var(--coach-ink-secondary)]">
              <Flag size={14} strokeWidth={2.4} aria-hidden className="mt-0.5 shrink-0 text-[var(--coach-ink-muted)]" />
              <span>
                <span className="sr-only">Leaves you: </span>
                {path.milestone}
              </span>
            </li>
          )}
        </ul>
      )}
    </Link>
  );
}

function Branches({ paths }: { paths: PathView[] }) {
  if (paths.length === 0) return null;
  return (
    <div className="flex flex-col gap-1.5 px-1">
      <p className="m-0 text-[12.5px] text-[var(--coach-ink-muted)]">Side paths from here</p>
      <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
        {paths.map((p) => (
          <li key={p.slug}>
            <Link
              href={p.href}
              className="inline-flex items-center gap-1.5 rounded-full border-2 border-[var(--coach-border)] px-2.5 py-0.5 text-[12.5px] text-[var(--coach-ink-secondary)] no-underline hover:border-[var(--coach-border-strong)]"
            >
              {p.title}
              {p.soon && <span className="text-[var(--coach-ink-muted)]">· soon</span>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * The main track, in order, with each stage's milestone and the side paths that branch off it.
 * With `progress`, it shows lessons done and marks the stage you're on (the first one not finished).
 */
export function TrackMap({ views, progress = false }: { views: PathView[]; progress?: boolean }) {
  const stages = views.filter((v) => v.stage !== null).sort((a, b) => a.stage! - b.stage!);
  if (stages.length === 0) return null;
  const here = progress ? stages.find((s) => !s.soon && !s.finished && s.lessons.done > 0) : undefined;

  return (
    <section aria-labelledby="track-title" className="flex flex-col gap-3">
      <div className="flex flex-col gap-0.5">
        <h2 id="track-title" className="m-0 text-[18px] font-bold">
          The track
        </h2>
        <p className="m-0 text-[13.5px] text-[var(--coach-ink-muted)]">
          From bits to designing processors, in three stages. Side paths branch off along the way.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] md:gap-3">
        {stages.map((s, i) => (
          <Fragment key={s.slug}>
            {i > 0 && (
              <span
                aria-hidden
                className={`flex items-center justify-center text-[var(--coach-ink-muted)] md:row-start-1 ${COL[2 * i - 1]}`}
              >
                <ArrowDown size={18} className="md:hidden" />
                <ArrowRight size={18} className="hidden md:block" />
              </span>
            )}
            {/* Cards share the first row on wide screens, so they line up; side paths sit under each. */}
            <div className={`md:row-start-1 ${COL[2 * i]}`}>
              <StageCard path={s} here={here?.slug === s.slug} progress={progress} />
            </div>
            <div className={`md:row-start-2 ${COL[2 * i]}`}>
              <Branches paths={views.filter((v) => v.branchOf === s.slug)} />
            </div>
          </Fragment>
        ))}
      </div>
    </section>
  );
}
