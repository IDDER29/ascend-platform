import Link from "next/link";
import type { CoachPathModel } from "@/lib/practice/coach-path-model";
import { StrengthBar, STRENGTH_LEVELS } from "./strength-bar";

export function PathProgress({ model }: { model: CoachPathModel }) {
  const hit = model.hitRate;
  return (
    <section
      aria-labelledby="path-progress-title"
      className="flex flex-col gap-[18px] rounded-[20px] border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-6"
    >
      <h2 id="path-progress-title" className="m-0 text-lg font-semibold">
        Your progress
      </h2>
      <div className="flex flex-col gap-2.5">
        <div className="flex items-baseline justify-between">
          <span className="text-[15px] text-[var(--coach-ink-secondary)]">Hit rate</span>
          <span className="font-display text-4xl font-extrabold leading-none">
            {hit ? `${hit.accuracy}%` : "None"}
          </span>
        </div>
        <div
          role="img"
          aria-label={hit ? `Hit rate ${hit.accuracy} percent` : "No sessions yet"}
          className="h-2.5 overflow-hidden rounded-full bg-[var(--coach-divider)]"
        >
          {hit ? (
            <div className="h-full rounded-full bg-[var(--coach-blue)]" style={{ width: `${hit.accuracy}%` }} />
          ) : null}
        </div>
        <span className="font-mono text-[13px] text-[var(--coach-ink-muted)]">
          {hit
            ? `${hit.correct}/${hit.total} correct · ${hit.sessions} ${hit.sessions === 1 ? "session" : "sessions"}`
            : "No sessions on this path yet"}
        </span>
      </div>
      <div className="h-px bg-[var(--coach-divider)]" />
      <div className="flex flex-col gap-3">
        <span className="text-[15px] font-semibold">Card strength</span>
        {model.strength.total > 0 ? (
          <>
            <StrengthBar strength={model.strength} className="h-3.5" />
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              {STRENGTH_LEVELS.map((level) => (
                <span key={level.key} className="flex items-center gap-2">
                  <span className={`size-2.5 rounded-[3px] ${level.color}`} />
                  {level.label}
                  <strong className="ml-auto font-mono font-medium">{model.strength[level.key]}</strong>
                </span>
              ))}
            </div>
          </>
        ) : (
          <span className="text-sm text-[var(--coach-ink-secondary)]">
            Finish a lesson on this path to unlock its cards.
          </span>
        )}
      </div>
      <Link
        href={model.bankHref}
        className="flex h-11 items-center gap-1.5 text-sm font-semibold text-[var(--coach-blue)] no-underline"
      >
        Browse the card bank
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </Link>
    </section>
  );
}
