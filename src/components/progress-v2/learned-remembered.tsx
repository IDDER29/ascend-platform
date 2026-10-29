import type { LevelRetention } from "@/lib/progress/progress-v2-model";

function Bar({ value, label, className }: { value: number; label: string; className: string }) {
  return (
    <div role="img" aria-label={label} className="h-2.5 overflow-hidden rounded-full bg-[var(--coach-divider)]">
      <div className={`h-full rounded-full ${className}`} style={{ width: `${value}%` }} />
    </div>
  );
}

function LevelRow({ level }: { level: LevelRetention }) {
  const donePct = level.lessonCount === 0 ? 0 : Math.round((level.lessonsDone / level.lessonCount) * 100);
  return (
    <li className="grid grid-cols-[44px_minmax(0,1fr)] items-center gap-x-4 gap-y-2 sm:grid-cols-[44px_minmax(0,200px)_minmax(0,1fr)_minmax(0,1fr)]">
      <span className="flex size-11 items-center justify-center rounded-xl bg-[var(--coach-mark-bg)] font-mono text-sm font-bold text-[var(--coach-mark-ink)]">
        {level.number}
      </span>
      <span className="min-w-0 truncate text-[15px] font-semibold">{level.name}</span>
      <div className="col-span-2 flex flex-col gap-1.5 sm:col-span-1">
        <span className="flex justify-between text-xs text-[var(--coach-ink-secondary)]">
          <span>Learned</span>
          <span className="font-mono">
            {level.lessonsDone}/{level.lessonCount} lessons
          </span>
        </span>
        <Bar
          value={donePct}
          label={`Learned ${level.lessonsDone} of ${level.lessonCount} lessons`}
          className="bg-[var(--coach-ink)]"
        />
      </div>
      <div className="col-span-2 flex flex-col gap-1.5 sm:col-span-1">
        <span className="flex justify-between text-xs text-[var(--coach-ink-secondary)]">
          <span>Remembered</span>
          <span className="font-mono">
            {level.rememberedPct === null ? "locked" : `${level.rememberedPct}% solid`}
          </span>
        </span>
        <Bar
          value={level.rememberedPct ?? 0}
          label={
            level.rememberedPct === null
              ? "No cards unlocked yet"
              : `Remembered ${level.rememberedPct} percent of ${level.cardCount} unlocked cards`
          }
          className="bg-[var(--coach-blue)]"
        />
      </div>
    </li>
  );
}

export function LearnedRemembered({ levels }: { levels: LevelRetention[] }) {
  return (
    <section
      aria-labelledby="learned-title"
      className="flex flex-col gap-5 rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-5 sm:p-6"
    >
      <div className="flex flex-col gap-1">
        <h2 id="learned-title" className="m-0 text-lg font-semibold">
          Learned vs remembered
        </h2>
        <p className="m-0 text-[13px] text-[var(--coach-ink-secondary)]">
          Finishing a lesson isn&apos;t the same as knowing it. Remembered is the share of a
          level&apos;s unlocked cards you hold at solid or better in Practice.
        </p>
      </div>
      <ol className="m-0 flex list-none flex-col gap-5 p-0">
        {levels.map((level) => (
          <LevelRow key={level.id} level={level} />
        ))}
      </ol>
    </section>
  );
}
