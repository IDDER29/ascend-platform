import Link from "next/link";
import { Check } from "lucide-react";
import { CrestPatch } from "@/components/achievements/emblems";
import type { PathCard, PathGroup } from "@/lib/dashboard/paths-model";

const CARD = "rounded-[20px] border-2 border-[var(--coach-border)] bg-[var(--coach-surface)]";

const CAPSTONE: Record<NonNullable<PathGroup["capstone"]>, string> = {
  "not-started": "Capstone · after the lessons above",
  ready: "Capstone · ready to build",
  shipped: "Capstone · shipped",
};

function Dots({ marks, current }: { marks: boolean[]; current: boolean }) {
  return (
    <span aria-hidden className="flex flex-wrap gap-1">
      {marks.map((done, i) => (
        <span
          key={i}
          className={`size-2.5 rounded-full ${
            done
              ? "bg-[var(--coach-ink)]"
              : current
                ? "border-2 border-[var(--coach-ink)]"
                : "border-2 border-[var(--coach-border-strong)]"
          }`}
        />
      ))}
    </span>
  );
}

function GroupRow({ g }: { g: PathGroup }) {
  return (
    <li>
      <Link
        href={g.href}
        className={`-mx-2 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-1 rounded-xl px-2 py-2 no-underline hover:bg-[var(--coach-tint-neutral-bg)] sm:grid-cols-[auto_minmax(0,1fr)_auto_auto] ${
          g.current ? "bg-[var(--coach-tint-lime-bg)] hover:bg-[var(--coach-tint-lime-bg)]" : ""
        }`}
      >
        <span className="flex size-6 items-center justify-center">
          {g.finished && g.crest ? (
            <CrestPatch crest={g.crest} earned size="sm" onDark={false} />
          ) : g.finished ? (
            <Check size={16} strokeWidth={3} className="text-[var(--coach-ink)]" aria-hidden />
          ) : g.kind === "capstone" ? (
            <span aria-hidden className="size-3 rotate-45 border-2 border-[var(--coach-border-strong)]" />
          ) : (
            <span
              aria-hidden
              className={`size-3 rounded-full border-2 ${g.current ? "border-[var(--coach-ink)]" : "border-[var(--coach-border-strong)]"}`}
            />
          )}
        </span>
        <span className="min-w-0 truncate text-[14.5px] font-semibold text-[var(--coach-ink)]">
          {g.title}
          {g.current && (
            <span className="ml-2 text-[12.5px] font-medium text-[var(--coach-ink-secondary)]">You&apos;re here</span>
          )}
        </span>
        {g.kind === "topic" ? (
          <>
            <span className="col-start-2 sm:col-start-auto">
              <Dots marks={g.lessons} current={g.current} />
            </span>
            <span className="col-start-2 text-[12.5px] tabular-nums text-[var(--coach-ink-muted)] sm:col-start-auto sm:w-14 sm:text-right">
              {g.done} of {g.total}
            </span>
          </>
        ) : (
          <span className="col-start-2 text-[12.5px] text-[var(--coach-ink-muted)] sm:col-span-2 sm:col-start-auto sm:text-right">
            {CAPSTONE[g.capstone ?? "not-started"]}
          </span>
        )}
      </Link>
    </li>
  );
}

/** One bar for the whole path, a segment per lesson, gaps between groups. */
function PathBar({ path }: { path: PathCard }) {
  const topics = path.groups.filter((g) => g.kind === "topic");
  return (
    <div role="img" aria-label={`${path.done} of ${path.total} lessons done`} className="flex gap-2">
      {topics.map((g) => (
        <span key={g.id} className="flex gap-[3px]" style={{ flexGrow: g.total, flexBasis: 0 }}>
          {g.lessons.map((done, i) => (
            <span
              key={i}
              className={`h-2 grow rounded-full ${done ? "bg-[var(--coach-lime)]" : "bg-[var(--coach-scale-empty)]"}`}
            />
          ))}
        </span>
      ))}
    </div>
  );
}

function OpenPath({ path }: { path: PathCard }) {
  return (
    <section aria-labelledby={`path-${path.slug}`} className={`${CARD} flex flex-col gap-4 p-5 sm:p-6`}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 id={`path-${path.slug}`} className="m-0 font-display text-[20px] font-extrabold tracking-[-0.02em]">
          <Link href={path.href} className="text-[var(--coach-ink)] no-underline hover:underline">
            {path.title}
          </Link>
        </h3>
        <span className="text-[13.5px] tabular-nums text-[var(--coach-ink-secondary)]">
          {path.done} of {path.total} lessons
        </span>
      </div>
      <PathBar path={path} />
      <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
        {path.groups.map((g) => (
          <GroupRow key={g.id} g={g} />
        ))}
      </ul>
      {path.next && (
        <Link
          href={path.next.href}
          className="inline-flex h-11 w-fit max-w-full items-center self-end rounded-xl border-2 border-[var(--coach-border)] px-4 text-[14px] font-bold text-[var(--coach-ink)] no-underline hover:border-[var(--coach-border-strong)]"
        >
          <span className="truncate">Continue: {path.next.title}</span>
        </Link>
      )}
    </section>
  );
}

function FinishedPath({ path }: { path: PathCard }) {
  const crests = path.groups.filter((g) => g.crest);
  return (
    <Link
      href={path.href}
      className={`${CARD} flex items-center gap-3 px-5 py-3.5 no-underline text-[var(--coach-ink)] hover:border-[var(--coach-border-strong)]`}
    >
      <Check size={18} strokeWidth={3} aria-hidden />
      <span className="min-w-0 flex-1">
        <span className="font-bold">{path.title}</span>
        <span className="ml-2 text-[13px] text-[var(--coach-ink-muted)]">
          Finished · {path.done} of {path.total} lessons
        </span>
      </span>
      {crests.map((g) => (
        <CrestPatch key={g.id} crest={g.crest!} earned size="sm" onDark={false} />
      ))}
    </Link>
  );
}

/** Every path the learner joined: the one worked on last first, each split into its groups. */
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
          className={`${CARD} block border-dashed p-5 text-[14.5px] text-[var(--coach-ink-secondary)] no-underline hover:border-[var(--coach-border-strong)]`}
        >
          You haven&apos;t joined a path yet.{" "}
          <span className="font-semibold text-[var(--coach-ink)]">Pick one to follow</span> and your next lesson will
          come from it.
        </Link>
      ) : (
        paths.map((p) => (p.finished ? <FinishedPath key={p.slug} path={p} /> : <OpenPath key={p.slug} path={p} />))
      )}
    </section>
  );
}
