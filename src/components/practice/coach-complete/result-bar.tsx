export function ResultBar({ results }: { results: boolean[] }) {
  const correct = results.filter(Boolean).length;
  const missed = results.length - correct;

  return (
    <div className="flex flex-col gap-2.5">
      <div
        role="img"
        aria-label={`Results by card: ${correct} correct, ${missed} missed`}
        className="flex gap-1.5"
      >
        {results.map((ok, i) => (
          <span
            key={i}
            title={`Card ${i + 1} · ${ok ? "correct" : "missed"}`}
            className={`h-2.5 flex-1 rounded-full ${
              ok ? "bg-[var(--coach-blue)]" : "bg-[var(--coach-orange)]"
            }`}
          />
        ))}
      </div>
      <div className="flex gap-4 text-xs text-[var(--coach-ink-secondary)]">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-3.5 rounded-full bg-[var(--coach-blue)]" />
          Correct
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-3.5 rounded-full bg-[var(--coach-orange)]" />
          Missed
        </span>
      </div>
    </div>
  );
}
