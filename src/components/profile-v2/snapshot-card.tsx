import type { ProfileModel } from "@/lib/profile/profile-model";
import { CARD } from "./styles";

export function SnapshotCard({ snapshot }: { snapshot: ProfileModel["snapshot"] }) {
  const rows: [string, string][] = [
    ["Lessons done", `${snapshot.lessonsDone}/${snapshot.lessonTotal}`],
    ["Projects shipped", String(snapshot.projectsShipped)],
    ["Own projects", String(snapshot.ownProjects)],
    ["Member since", snapshot.memberSince],
  ];
  return (
    <section aria-labelledby="snapshot-title" className={`${CARD} h-full`}>
      <h2 id="snapshot-title" className="m-0 font-mono text-xs font-normal uppercase tracking-[0.08em] text-[var(--coach-ink-muted)]">
        Snapshot
      </h2>
      <dl className="m-0 grid grid-cols-2 gap-x-4 gap-y-3 lg:grid-cols-1">
        {rows.map(([label, value]) => (
          <div key={label} className="flex flex-col gap-0.5 lg:flex-row lg:items-baseline lg:justify-between">
            <dt className="text-[13.5px] text-[var(--coach-ink-secondary)]">{label}</dt>
            <dd className="m-0 font-mono text-[17px] font-semibold">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
