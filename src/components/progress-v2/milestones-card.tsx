import type { Milestone } from "@/lib/progress/progress-v2-model";

export function MilestonesCard({ milestones }: { milestones: Milestone[] }) {
  return (
    <section
      aria-labelledby="milestones-title"
      className="flex min-w-0 flex-col gap-4 rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-5"
    >
      <h2 id="milestones-title" className="m-0 text-base font-semibold">
        Milestones
      </h2>
      {milestones.length === 0 ? (
        <p className="m-0 text-[14px] text-[var(--coach-ink-secondary)]">
          Your first finished lesson lands here, with its date.
        </p>
      ) : (
        <ol className="m-0 flex list-none flex-col gap-0 p-0">
          {milestones.map((m, i) => (
            <li key={`${m.at}-${m.label}`} className="relative flex gap-3 pb-4 last:pb-0">
              {i < milestones.length - 1 ? (
                <span aria-hidden="true" className="absolute left-[5px] top-4 h-[calc(100%-12px)] w-0.5 bg-[var(--coach-divider)]" />
              ) : null}
              <span
                aria-hidden="true"
                className={`mt-1 size-3 shrink-0 rounded-full ${
                  i === 0 ? "bg-[var(--coach-blue)]" : "border-2 border-[var(--coach-border-strong)] bg-[var(--coach-surface)]"
                }`}
              />
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="font-mono text-xs text-[var(--coach-ink-muted)]">{m.dateLabel}</span>
                <span className="text-[14px] font-medium">{m.label}</span>
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
