import { RELEASES, type Release } from "@/lib/achievements/changelog-model";
import { EntryRow } from "./entry-row";

export function ReleaseCard({ release, latest }: { release: Release; latest: boolean }) {
  return (
    <section
      id={`release-${release.version}`}
      aria-labelledby={`release-${release.version}-title`}
      className="flex min-w-0 scroll-mt-6 flex-col gap-4 rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
        <h2 id={`release-${release.version}-title`} className="m-0 flex items-baseline gap-3">
          <span className="font-display text-[34px] font-extrabold leading-none tracking-[-0.04em]">
            v{release.version}
          </span>
          <span className="text-[17px] font-semibold">{release.label}</span>
          {latest ? (
            <span className="rounded-full bg-[var(--coach-lime)] px-2 py-0.5 text-[11.5px] font-bold text-[var(--coach-lime-ink)]">
              Latest
            </span>
          ) : null}
        </h2>
        <span className="text-[13px] text-[var(--coach-ink-muted)]">Released {release.dateLabel}</span>
      </div>
      <ul className="m-0 flex list-none flex-col p-0">
        <EntryRow
          entry={{
            id: RELEASES.find((r) => r.version === release.version)!.badgeId,
            verb: "Released",
            label: release.label,
            glyph: release.glyph,
            means: release.means,
            dateLabel: release.dateLabel,
            hash: release.hash,
            repoUrl: null,
            repoLabel: null,
          }}
        />
        {release.entries.map((entry) => (
          <EntryRow key={entry.id} entry={entry} />
        ))}
      </ul>
    </section>
  );
}
