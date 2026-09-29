const PANEL =
  "rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)]";

export function CompleteSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-label="Loading session results"
      className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px]"
    >
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-5">
          <span className="size-16 rounded-[18px] bg-[var(--coach-divider)]" />
          <div className="flex flex-1 flex-col gap-2">
            <span className="h-8 w-56 rounded-lg bg-[var(--coach-divider)]" />
            <span className="h-5 w-full max-w-[420px] rounded bg-[var(--coach-divider)]" />
          </div>
        </div>
        <span className="h-2.5 rounded-full bg-[var(--coach-divider)]" />
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`h-[100px] ${PANEL}`} />
          ))}
        </div>
      </div>
      <div className={`h-[220px] ${PANEL}`} />
    </div>
  );
}
