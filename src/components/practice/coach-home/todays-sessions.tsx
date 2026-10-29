import Link from "next/link";
import type {
  CoachHomeModel,
  CoachSessionRow,
} from "@/lib/practice/coach-home-model";
import { PRACTICE_ROUTES } from "@/lib/practice/routes";

const RETRY_HREF = `${PRACTICE_ROUTES.session}?scope=due`;

function ResultBars({ results }: { results: boolean[] }) {
  return (
    <div aria-hidden="true" className="flex flex-wrap gap-[3px]">
      {results.map((correct, i) => (
        <span
          key={i}
          className={`h-3.5 w-1.5 rounded-[2px] ${
            correct ? "bg-[var(--coach-blue)]" : "bg-[var(--coach-orange)]"
          }`}
        />
      ))}
    </div>
  );
}

function RowAction({ row }: { row: CoachSessionRow }) {
  if (row.misses > 0) {
    return (
      <Link
        href={RETRY_HREF}
        className="inline-flex h-8 items-center whitespace-nowrap rounded-lg border-2 border-[var(--coach-border-strong)] px-3 text-[13px] font-semibold text-[var(--coach-ink)] no-underline"
      >
        Retry {row.misses} {row.misses === 1 ? "miss" : "misses"}
      </Link>
    );
  }
  return (
    <span className="inline-flex h-8 items-center gap-1.5 pr-3 text-[13px] text-[var(--coach-success)]">
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M5 12l5 5 9-10" />
      </svg>
      Perfect
    </span>
  );
}

function Chip({
  value,
  label,
  tone = "neutral",
}: {
  value: number;
  label: string;
  tone?: "neutral" | "orange";
}) {
  return (
    <span
      className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs ${
        tone === "orange"
          ? "bg-[var(--coach-tint-orange-bg)] text-[var(--coach-tint-orange-strong)]"
          : "bg-[var(--coach-chip)]"
      }`}
    >
      <strong className="font-semibold">{value}</strong> {label}
    </span>
  );
}

export function TodaysSessions({
  sessions,
  isGuest,
}: {
  sessions: CoachHomeModel["sessions"];
  isGuest: boolean;
}) {
  const { rows } = sessions;

  return (
    <section
      aria-labelledby="recent-title"
      className="flex flex-col gap-4 rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <h2 id="recent-title" className="m-0 text-[17px] font-semibold">
            Today&apos;s sessions
          </h2>
          <span className="text-xs text-[var(--coach-ink-muted)]">
            {isGuest ? "Saved on this device" : "Synced to your account"}
          </span>
        </div>
        {rows.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            <Chip value={sessions.answered} label="answered" />
            <Chip value={sessions.correct} label="correct" />
            {sessions.toFix > 0 ? (
              <Chip value={sessions.toFix} label="to fix" tone="orange" />
            ) : null}
          </div>
        ) : null}
      </div>

      {rows.length === 0 ? (
        <p className="m-0 border-t border-[var(--coach-divider)] pt-4 text-sm text-[var(--coach-ink-secondary)]">
          No sessions yet today. Start one above.
        </p>
      ) : (
        <>
          <table className="hidden w-full border-collapse text-[13px] sm:table">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-[0.06em] text-[var(--coach-ink-muted)]">
                <th scope="col" className="pb-2.5 font-medium">Session</th>
                <th scope="col" className="pb-2.5 font-medium">Time</th>
                <th scope="col" className="pb-2.5 font-medium">Result</th>
                <th scope="col" className="pb-2.5 text-right font-medium">Score</th>
                <th scope="col" className="pb-2.5 text-right font-medium">
                  <span className="sr-only">Action</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-[var(--coach-divider)]">
                  <td className="py-2 align-middle font-semibold">{row.title}</td>
                  <td className="whitespace-nowrap py-2 align-middle text-[var(--coach-ink-secondary)]">
                    {row.timeLabel}
                  </td>
                  <td className="py-2 align-middle">
                    <ResultBars results={row.results} />
                  </td>
                  <td className="py-2 text-right align-middle font-mono">
                    {row.correct}/{row.total}
                  </td>
                  <td className="w-[130px] py-2 text-right align-middle">
                    <RowAction row={row} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <ul className="m-0 flex list-none flex-col p-0 sm:hidden">
            {rows.map((row) => (
              <li
                key={row.id}
                className="flex flex-col gap-2 border-t border-[var(--coach-divider)] py-3 text-sm"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="font-semibold">{row.title}</span>
                  <span className="whitespace-nowrap text-[13px] text-[var(--coach-ink-secondary)]">
                    {row.timeLabel}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <ResultBars results={row.results} />
                  <span className="font-mono">
                    {row.correct}/{row.total}
                  </span>
                </div>
                <div>
                  <RowAction row={row} />
                </div>
              </li>
            ))}
          </ul>

          <div className="flex gap-4 text-xs text-[var(--coach-ink-secondary)]">
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-1.5 rounded-[2px] bg-[var(--coach-blue)]" />
              Correct
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-1.5 rounded-[2px] bg-[var(--coach-orange)]" />
              Missed
            </span>
          </div>
        </>
      )}
    </section>
  );
}
