import Link from "next/link";
import { Route } from "lucide-react";
import { PATH_ICONS } from "@/components/paths/path-catalog";
import type { PathCard } from "@/lib/dashboard/paths-model";

const CARD =
  "flex min-w-0 flex-col gap-4 rounded-[20px] border-2 bg-[var(--coach-surface)] p-5 text-[var(--coach-ink)]";

/** One joined path: its mark, progress, sections finished, and a way in. */
function PathTile({ path }: { path: PathCard }) {
  const Icon = PATH_ICONS[path.slug] ?? Route;
  const share = path.total > 0 ? path.done / path.total : 0;
  return (
    <section
      aria-labelledby={`path-${path.slug}`}
      className={`${CARD} ${path.active ? "border-[var(--coach-ink)]" : "border-[var(--coach-border)]"}`}
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[var(--coach-hero-bg)] text-[var(--coach-lime)]"
        >
          <Icon size={20} strokeWidth={2.2} />
        </span>
        <div className="min-w-0 flex-1">
          <h3 id={`path-${path.slug}`} className="m-0 text-[16px] font-bold leading-tight [text-wrap:balance]">
            {path.title}
          </h3>
          <p className="m-0 mt-0.5 text-[13px] text-[var(--coach-ink-muted)]">
            {path.finished
              ? "Finished"
              : `${path.sections.done} of ${path.sections.total} ${path.sections.total === 1 ? "section" : "sections"} done`}
          </p>
        </div>
        {path.active && (
          <span className="shrink-0 rounded-full bg-[var(--coach-lime)] px-2.5 py-0.5 text-[12px] font-semibold text-[var(--coach-lime-ink)]">
            Active
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <span
          role="img"
          aria-label={`${path.done} of ${path.total} lessons done`}
          className="block h-2 overflow-hidden rounded-full bg-[var(--coach-scale-empty)]"
        >
          <span
            className="block h-full rounded-full bg-[var(--coach-ink)]"
            style={{ width: `${Math.round(share * 100)}%` }}
          />
        </span>
        <span className="text-[12.5px] tabular-nums text-[var(--coach-ink-secondary)]">
          {path.done} of {path.total} lessons
        </span>
      </div>

      <div className="mt-auto flex flex-wrap gap-2">
        {path.next && !path.finished && (
          <Link
            href={path.next.href}
            className="inline-flex h-10 items-center rounded-xl bg-[var(--coach-solid-btn-bg)] px-4 text-[14px] font-bold text-[var(--coach-solid-btn-ink)] no-underline"
          >
            Continue
          </Link>
        )}
        <Link
          href={path.href}
          className="inline-flex h-10 items-center rounded-xl border-2 border-[var(--coach-border)] px-4 text-[14px] font-semibold text-[var(--coach-ink)] no-underline hover:border-[var(--coach-border-strong)]"
        >
          View path
        </Link>
      </div>
    </section>
  );
}

/** Every path the learner joined, as a grid: the active one first. */
export function YourPaths({ paths }: { paths: PathCard[] }) {
  return (
    <section aria-labelledby="paths-title" className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="paths-title" className="m-0 text-[18px] font-bold">
          Your paths
        </h2>
        <Link href="/paths" className="text-[13px] text-[var(--coach-ink-muted)] underline-offset-2 hover:underline">
          Browse paths
        </Link>
      </div>
      {paths.length === 0 ? (
        <Link
          href="/paths"
          className="block rounded-[20px] border-2 border-dashed border-[var(--coach-border)] p-5 text-[14.5px] text-[var(--coach-ink-secondary)] no-underline hover:border-[var(--coach-border-strong)]"
        >
          You haven&apos;t joined a path yet.{" "}
          <span className="font-semibold text-[var(--coach-ink)]">Pick one to follow</span> and your next lesson will
          come from it.
        </Link>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {paths.map((p) => (
            <PathTile key={p.slug} path={p} />
          ))}
        </div>
      )}
    </section>
  );
}
