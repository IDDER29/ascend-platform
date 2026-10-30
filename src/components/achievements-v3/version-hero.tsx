import { RELEASES, type ChangelogModel } from "@/lib/achievements/changelog-model";

/** The learner's version as the headline, with the release train underneath. */
export function VersionHero({ log }: { log: ChangelogModel }) {
  const released = new Map(log.releases.map((r) => [r.version, r]));
  const nextVersion = log.roadmap[0]?.version ?? null;
  return (
    <section
      aria-labelledby="version-title"
      className="flex min-w-0 flex-col gap-6 rounded-[24px] bg-[var(--coach-hero-bg)] px-6 py-7 text-[var(--coach-hero-ink)] sm:px-9 sm:py-9"
    >
      <div className="flex flex-col gap-3">
        <span className="text-[14px] text-[var(--coach-hero-muted)]">You&apos;re on</span>
        <h2
          id="version-title"
          className="m-0 font-display text-[64px] font-extrabold leading-[0.9] tracking-[-0.05em] text-[var(--coach-lime)] sm:text-[96px]"
        >
          <span className="text-[var(--coach-hero-muted)]">v</span>
          {log.currentVersion}
        </h2>
        <p className="m-0 max-w-[60ch] text-[15.5px] leading-relaxed">{log.summary}</p>
      </div>

      <nav aria-label="Releases">
        <ol className="m-0 flex list-none flex-wrap items-center gap-x-1 gap-y-3 p-0">
          {RELEASES.map((r, i) => {
            const done = released.get(r.version);
            const next = r.version === nextVersion;
            return (
              <li key={r.version} className="flex items-center gap-1">
                {i > 0 ? (
                  <span aria-hidden="true" className={`h-[3px] w-4 sm:w-8 ${done ? "bg-[var(--coach-lime)]" : "bg-[var(--coach-hero-track)]"}`} />
                ) : null}
                <a
                  href={done ? `#release-${r.version}` : "#roadmap"}
                  className={`inline-flex h-8 items-center gap-1.5 rounded-full px-3 font-mono text-[12.5px] no-underline ${
                    done
                      ? "bg-[var(--coach-lime)] font-semibold text-[var(--coach-lime-ink)]"
                      : next
                        ? "border-2 border-[var(--coach-blue)] text-[var(--coach-hero-ink)]"
                        : "border-2 border-dashed border-[var(--coach-hero-track)] text-[var(--coach-hero-muted)]"
                  }`}
                >
                  v{r.version}
                  {done ? <span className="font-sans text-[11.5px] font-normal">{done.dateLabel}</span> : null}
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
    </section>
  );
}
