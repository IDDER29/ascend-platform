import { badgeAnchor, type ChangelogModel } from "@/lib/achievements/changelog-model";
import { TARGET_RING } from "./entry-row";
import { Medallion } from "./medallion";

export function RoadmapCard({ log }: { log: ChangelogModel }) {
  const inProgress = new Set(log.inProgressIds);
  const anchor = (id: string) => (inProgress.has(id) ? undefined : badgeAnchor(id));
  return (
    <section
      id="roadmap"
      aria-labelledby="roadmap-title"
      className="flex min-w-0 scroll-mt-6 flex-col gap-4 rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-5"
    >
      <h2 id="roadmap-title" className="m-0 text-base font-semibold">
        Roadmap
      </h2>
      {log.roadmap.length === 0 ? (
        <p className="m-0 text-[14px] text-[var(--coach-ink-secondary)]">Every release has shipped.</p>
      ) : (
        <ol className="m-0 flex list-none flex-col gap-3 p-0">
          {log.roadmap.map((item, i) => (
            <li key={item.version} id={anchor(item.badgeId)} className={`flex gap-3 p-1 ${TARGET_RING}`}>
              <Medallion glyph={item.glyph} earned={false} size="sm" />
              <div className="flex min-w-0 flex-col gap-1">
                <span className="flex items-baseline gap-2">
                  <span
                    className={`font-mono text-[13px] font-semibold ${i === 0 ? "text-[var(--coach-blue)]" : "text-[var(--coach-ink-muted)]"}`}
                  >
                    v{item.version}
                  </span>
                  <span className="text-[14.5px] font-semibold">{item.label}</span>
                </span>
                <span className="text-[13px] leading-snug text-[var(--coach-ink-secondary)]">{item.how}</span>
                {i === 0 && item.progress && item.progress.total > 1 ? (
                  <span className="text-[12.5px] font-semibold text-[var(--coach-blue)]">
                    {item.progress.done} of {item.progress.total} lessons done
                  </span>
                ) : null}
                {item.alongside.map((a) => (
                  <span
                    key={a.badgeId}
                    id={anchor(a.badgeId)}
                    className={`mt-1 flex items-start gap-2 text-[12.5px] text-[var(--coach-ink-muted)] ${TARGET_RING}`}
                  >
                    <Medallion glyph={a.glyph} earned={false} size="sm" />
                    <span>
                      Ships alongside{" "}
                      <strong className="font-semibold text-[var(--coach-ink-secondary)]">{a.label}</strong>:{" "}
                      {a.how.charAt(0).toLowerCase() + a.how.slice(1)}
                    </span>
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ol>
      )}
      {log.alsoOpen.length > 0 ? (
        <div className="flex flex-col gap-2 border-t border-[var(--coach-divider)] pt-4">
          <h3 className="m-0 text-[13.5px] font-semibold text-[var(--coach-ink-secondary)]">Also open</h3>
          <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
            {log.alsoOpen.map((a) => (
              <li
                key={a.badgeId}
                id={anchor(a.badgeId)}
                className={`flex items-start gap-2 p-1 text-[13px] leading-snug text-[var(--coach-ink-secondary)] ${TARGET_RING}`}
              >
                <Medallion glyph={a.glyph} earned={false} size="sm" />
                <span>
                  <strong className="font-semibold text-[var(--coach-ink)]">{a.label}</strong>:{" "}
                  {a.how.charAt(0).toLowerCase() + a.how.slice(1)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
