const PANEL =
  "rounded-[20px] border-2 border-[var(--coach-border)] bg-[var(--coach-surface)]";

export function CoachHomeSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading practice" className="flex flex-col gap-10">
      <div className="flex flex-col gap-2.5">
        <span className="h-4 w-40 rounded bg-[var(--coach-divider)]" />
        <span className="h-10 w-56 rounded-lg bg-[var(--coach-divider)] sm:h-14" />
        <span className="h-12 w-full max-w-[640px] rounded-lg bg-[var(--coach-divider)]" />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(260px,320px)]">
        <div className="h-[340px] rounded-[24px] bg-[var(--coach-hero-bg)] lg:h-[272px]" />
        <div className={`h-[300px] !rounded-[24px] ${PANEL}`} />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`h-[150px] ${PANEL}`} />
        ))}
      </div>
    </div>
  );
}
