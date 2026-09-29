import Link from "next/link";
import { Fragment } from "react";
import type { CoachHomeModel } from "@/lib/practice/coach-home-model";

const PATH_HREF = "/practicev2/foundations";

export function FoundationsPathCard({
  path,
}: {
  path: CoachHomeModel["path"];
}) {
  const hit = path.hitRate;

  return (
    <section
      aria-labelledby="path-title"
      className="flex flex-col gap-5 rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-5 sm:p-6"
    >
      <div className="flex w-full flex-wrap items-start justify-between gap-4 sm:flex-nowrap sm:gap-5">
        <div className="flex min-w-0 basis-full items-center gap-3.5 sm:flex-1 sm:basis-auto">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[var(--coach-mark-bg)] font-display text-xl font-extrabold text-[var(--coach-mark-ink)]">
            {path.mark}
          </span>
          <div className="flex min-w-0 flex-col gap-0.5">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <h2 id="path-title" className="m-0 text-[17px] font-semibold">
                {path.title}
              </h2>
              <span className="rounded-full bg-[var(--coach-tint-blue-bg)] px-2 py-0.5 text-[11px] font-semibold text-[var(--coach-tint-blue-ink)]">
                Always open
              </span>
            </div>
            <span className="text-[13px] text-[var(--coach-ink-secondary)]">
              {path.blurb}{" "}
              <span className="font-mono text-xs text-[var(--coach-ink-muted)]">
                {path.cardCount} cards · {path.lessonCount} lessons
              </span>
            </span>
          </div>
        </div>
        <Link
          href={PATH_HREF}
          className="flex h-10 w-full shrink-0 items-center justify-center rounded-xl border-2 border-[var(--coach-ink)] px-4 text-sm font-semibold text-[var(--coach-ink)] no-underline sm:w-auto"
        >
          Open path
        </Link>
      </div>

      <ol
        aria-label={`${path.title} lessons`}
        className="relative m-0 flex w-full min-w-0 list-none items-start overflow-x-auto p-0 pb-1"
      >
        {path.steps.map((step, i) => (
          <Fragment key={step.key}>
            {i > 0 ? (
              <li
                aria-hidden="true"
                className={`mt-[17px] h-[2px] min-w-4 flex-[1_1_16px] ${
                  step.done ? "bg-[var(--coach-mark-bg)]" : "bg-[var(--coach-border)]"
                }`}
              />
            ) : null}
            <li className="flex-[0_0_72px]">
              <Link
                href={PATH_HREF}
                title={step.title}
                className={`flex w-[72px] flex-col items-center gap-1.5 no-underline ${
                  step.done ? "text-[var(--coach-ink)]" : "text-[var(--coach-ink-secondary)]"
                }`}
              >
                <span
                  className={`flex size-9 items-center justify-center rounded-full text-sm font-bold ${
                    step.done
                      ? "bg-[var(--coach-mark-bg)] text-[var(--coach-mark-ink)]"
                      : "border-2 border-[var(--coach-border-strong)]"
                  }`}
                >
                  {i + 1}
                  <span className="sr-only">{step.done ? " (practiced)" : ""}</span>
                </span>
                <span
                  className={`line-clamp-3 min-h-[2.6em] text-center text-xs leading-[1.3] ${
                    step.done ? "font-semibold" : ""
                  }`}
                >
                  {step.title}
                </span>
              </Link>
            </li>
          </Fragment>
        ))}
      </ol>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="w-16 text-[13px] text-[var(--coach-ink-secondary)]">
          Hit rate
        </span>
        <div
          role="img"
          aria-label={hit ? `Hit rate ${hit.accuracy} percent` : "No sessions yet"}
          className="h-2 min-w-[120px] grow overflow-hidden rounded-full bg-[var(--coach-divider)]"
        >
          {hit ? (
            <div
              className="h-full rounded-full bg-[var(--coach-blue)]"
              style={{ width: `${hit.accuracy}%` }}
            />
          ) : null}
        </div>
        <span className="font-mono text-xs">
          {hit
            ? `${hit.accuracy}% · ${hit.correct}/${hit.total} correct · ${hit.sessions} ${
                hit.sessions === 1 ? "session" : "sessions"
              }`
            : "No sessions yet"}
        </span>
      </div>
    </section>
  );
}
