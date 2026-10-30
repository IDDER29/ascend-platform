import Link from "next/link";
import type { AchievementPart } from "@/lib/achievements/achievements-model";
import type { ChangelogModel } from "@/lib/achievements/changelog-model";
import { EntryRow } from "./entry-row";

function Progress({ part }: { part: AchievementPart }) {
  const p = part.progress;
  if (!p || p.total <= 1) return null;
  return (
    <span role="img" aria-label={`${p.done} of ${p.total}`} className="block h-1.5 w-full max-w-[220px] overflow-hidden rounded-full bg-[var(--coach-scale-empty)]">
      <span className="block h-full rounded-full bg-[var(--coach-blue)]" style={{ width: `${Math.round((p.done / p.total) * 100)}%` }} />
    </span>
  );
}

export function UnreleasedCard({ log }: { log: ChangelogModel }) {
  const since = log.releases[0] ? `since v${log.releases[0].version}` : "before your first release";
  return (
    <section
      id="unreleased"
      aria-labelledby="unreleased-title"
      className="flex min-w-0 flex-col gap-5 rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="unreleased-title" className="m-0 font-display text-[22px] font-extrabold tracking-[-0.02em]">
          Unreleased
        </h2>
        <span className="text-[13px] text-[var(--coach-ink-muted)]">Changes {since}</span>
      </div>

      {log.unreleased.length > 0 ? (
        <ul className="m-0 flex list-none flex-col p-0">
          {log.unreleased.map((entry) => (
            <EntryRow key={entry.id} entry={entry} />
          ))}
        </ul>
      ) : null}

      {log.inProgress.length > 0 ? (
        <div className="flex flex-col gap-3">
          <h3 className="m-0 text-[14px] font-semibold text-[var(--coach-ink-secondary)]">In progress</h3>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {log.inProgress.map((part, i) => (
              <li
                key={part.id}
                className="flex flex-col gap-3 rounded-xl border-2 border-dashed border-[var(--coach-border-strong)] p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 flex-col gap-1.5">
                  <span className="text-[14.5px] font-semibold">
                    <span aria-hidden="true" className="mr-1.5 text-[var(--coach-ink-muted)]">
                      {part.glyph}
                    </span>
                    {part.label}
                  </span>
                  <span className="text-[13.5px] text-[var(--coach-ink-secondary)]">
                    {part.how}
                    {part.distance ? <span className="font-semibold text-[var(--coach-blue)]"> — {part.distance}</span> : null}
                  </span>
                  <Progress part={part} />
                </div>
                {part.action ? (
                  <Link
                    href={part.action.href}
                    className={`inline-flex min-h-10 shrink-0 items-center justify-center rounded-xl px-4 py-2 text-[13.5px] font-bold no-underline ${
                      i === 0
                        ? "bg-[var(--coach-lime)] text-[var(--coach-lime-ink)] shadow-[0_3px_0_var(--coach-lime-shadow)]"
                        : "bg-[var(--coach-solid-btn-bg)] text-[var(--coach-solid-btn-ink)] shadow-[0_3px_0_var(--coach-solid-btn-shadow)]"
                    }`}
                  >
                    {part.action.label}
                  </Link>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {log.unreleased.length === 0 && log.inProgress.length === 0 ? (
        <p className="m-0 text-[14px] text-[var(--coach-ink-secondary)]">Nothing new since the last release.</p>
      ) : null}
    </section>
  );
}
