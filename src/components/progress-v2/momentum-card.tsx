import type { ProgressV2Model } from "@/lib/progress/progress-v2-model";

const BAR_MAX_PX = 96;

export function MomentumCard({ momentum }: { momentum: ProgressV2Model["momentum"] }) {
  const { weeks, firstAccuracy, lastAccuracy } = momentum;
  const max = Math.max(1, ...weeks.map((w) => w.cards));
  const lessonsTotal = weeks.reduce((sum, w) => sum + w.lessons, 0);
  const summary = weeks.map((w) => `${w.label}: ${w.cards} cards, ${w.lessons} lessons`).join("; ");

  return (
    <section
      aria-labelledby="momentum-title"
      className="flex min-w-0 flex-col gap-4 rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="momentum-title" className="m-0 text-lg font-semibold">
          Momentum
        </h2>
        <span className="text-xs text-[var(--coach-ink-muted)]">
          Cards answered per week · lessons finished on top
        </span>
      </div>
      {momentum.hasData ? (
        <>
          <div role="img" aria-label={summary} className="flex flex-col gap-1.5">
            <div className="grid h-[132px] grid-cols-12 items-end gap-1.5 border-b border-[var(--coach-border)]">
              {weeks.map((week) => (
                <span key={week.label} title={`Week of ${week.label}`} className="flex flex-col items-center gap-1">
                  {week.lessons > 0 ? (
                    <span className="rounded-full bg-[var(--coach-lime)] px-1.5 font-mono text-[10px] font-semibold text-[var(--coach-lime-ink)]">
                      {week.lessons}
                    </span>
                  ) : null}
                  {week.cards > 0 ? (
                    <span
                      className={`w-full max-w-6 rounded-t ${
                        week.isThisWeek ? "bg-[var(--coach-scale-4)]" : "bg-[var(--coach-scale-2)]"
                      }`}
                      style={{ height: Math.max(4, Math.round((week.cards / max) * BAR_MAX_PX)) }}
                    />
                  ) : null}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-12 gap-1.5 text-center text-[10px] text-[var(--coach-ink-muted)]">
              {weeks.map((week, i) => (
                <span key={week.label} className={week.isThisWeek ? "font-semibold text-[var(--coach-ink)]" : undefined}>
                  {week.isThisWeek ? "Now" : i % 3 === 0 ? week.label : ""}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-[13px] text-[var(--coach-ink-secondary)]">
            <span>
              Lessons finished{" "}
              <strong className="font-mono text-[var(--coach-ink)]">{lessonsTotal}</strong>
            </span>
            {firstAccuracy !== null && lastAccuracy !== null ? (
              <span>
                Accuracy{" "}
                <strong className="font-mono text-[var(--coach-ink)]">
                  {firstAccuracy === lastAccuracy ? `${lastAccuracy}%` : `${firstAccuracy}% → ${lastAccuracy}%`}
                </strong>
              </span>
            ) : null}
          </div>
        </>
      ) : (
        <p className="m-0 text-[14px] text-[var(--coach-ink-secondary)]">
          Finish a lesson or a review session and your weeks start filling in here.
        </p>
      )}
    </section>
  );
}
