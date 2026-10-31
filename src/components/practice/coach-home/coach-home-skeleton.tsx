import { CoachHeader } from "./coach-header";

const PANEL =
  "rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)]";

export function CoachHomeSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading practice" className="flex flex-col gap-8">
      <CoachHeader />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(250px,280px)]">
        <div className="h-[300px] rounded-[20px] bg-[var(--coach-hero-bg)] lg:h-[232px]" />
        <div className={`h-[260px] !rounded-[20px] ${PANEL}`} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`h-[128px] ${PANEL}`} />
        ))}
      </div>
    </div>
  );
}
