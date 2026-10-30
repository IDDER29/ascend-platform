import { ExternalLink } from "lucide-react";
import { badgeAnchor, type ChangelogEntry } from "@/lib/achievements/changelog-model";
import { Medallion } from "./medallion";

const VERB_STYLE: Record<string, string> = {
  Shipped: "bg-[var(--coach-tint-lime-bg)] text-[var(--coach-tint-lime-ink)]",
  Held: "bg-[var(--coach-tint-blue-bg)] text-[var(--coach-tint-blue-ink)]",
  "Kept up": "bg-[var(--coach-chip)] text-[var(--coach-ink-secondary)]",
  Released: "bg-[var(--coach-hero-bg)] text-[var(--coach-lime)]",
};

/** Highlight for the row the badge shelf jumped to. */
export const TARGET_RING =
  "scroll-mt-6 rounded-xl target:bg-[var(--coach-tint-blue-bg)] target:ring-2 target:ring-[var(--coach-blue)]";

type Entry = Pick<
  ChangelogEntry,
  "id" | "verb" | "label" | "glyph" | "means" | "dateLabel" | "hash" | "repoUrl" | "repoLabel"
>;

/** One changelog line, led by the badge it's about. */
export function EntryRow({ entry }: { entry: Entry }) {
  return (
    <li
      id={badgeAnchor(entry.id)}
      className={`grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-3 gap-y-1 border-t border-[var(--coach-divider)] px-1 py-3 first:border-t-0 sm:grid-cols-[2.75rem_minmax(0,1fr)_auto] ${TARGET_RING}`}
    >
      <Medallion glyph={entry.glyph} earned size="md" />
      <div className="flex min-w-0 flex-col gap-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-[15px] font-semibold">{entry.label}</span>
          <span
            className={`rounded-md px-1.5 py-0.5 text-[11.5px] font-semibold ${VERB_STYLE[entry.verb] ?? VERB_STYLE["Kept up"]}`}
          >
            {entry.verb}
          </span>
        </span>
        <span className="text-[13.5px] leading-snug text-[var(--coach-ink-secondary)]">{entry.means}</span>
        {entry.repoUrl ? (
          <a
            href={entry.repoUrl}
            target="_blank"
            rel="noopener noreferrer nofollow ugc"
            className="flex min-w-0 items-center gap-1.5 text-[12.5px] text-[var(--coach-blue)] no-underline hover:underline"
          >
            <ExternalLink size={12} aria-hidden="true" className="shrink-0" />
            <span className="truncate font-mono">{entry.repoLabel}</span>
          </a>
        ) : null}
      </div>
      <span className="col-start-2 flex gap-3 text-[12px] text-[var(--coach-ink-muted)] sm:col-start-3 sm:flex-col sm:items-end sm:gap-0.5">
        <span>{entry.dateLabel}</span>
        <span className="font-mono">{entry.hash}</span>
      </span>
    </li>
  );
}
