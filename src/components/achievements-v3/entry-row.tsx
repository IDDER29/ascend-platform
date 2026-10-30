import { ExternalLink } from "lucide-react";
import type { ChangelogEntry } from "@/lib/achievements/changelog-model";

const VERB_STYLE: Record<string, string> = {
  Shipped: "bg-[var(--coach-tint-lime-bg)] text-[var(--coach-tint-lime-ink)]",
  Held: "bg-[var(--coach-tint-blue-bg)] text-[var(--coach-tint-blue-ink)]",
  "Kept up": "bg-[var(--coach-chip)] text-[var(--coach-ink-secondary)]",
  Released: "bg-[var(--coach-hero-bg)] text-[var(--coach-lime)]",
};

/** One changelog line: what kind of change, the badge, what it means, when, and its id. */
export function EntryRow({ entry }: { entry: Pick<ChangelogEntry, "verb" | "label" | "glyph" | "means" | "dateLabel" | "hash" | "repoUrl" | "repoLabel"> }) {
  return (
    <li className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-x-3 gap-y-1 border-t border-[var(--coach-divider)] py-3 first:border-t-0 first:pt-0 last:pb-0 sm:grid-cols-[5.5rem_minmax(0,1fr)_auto]">
      <span className={`h-fit w-fit rounded-md px-2 py-0.5 text-[12px] font-semibold ${VERB_STYLE[entry.verb] ?? VERB_STYLE["Kept up"]}`}>
        {entry.verb}
      </span>
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="text-[14.5px] font-semibold">
          <span aria-hidden="true" className="mr-1.5 text-[var(--coach-ink-muted)]">
            {entry.glyph}
          </span>
          {entry.label}
        </span>
        <span className="text-[13.5px] leading-snug text-[var(--coach-ink-secondary)]">{entry.means}</span>
        {entry.repoUrl ? (
          <a
            href={entry.repoUrl}
            target="_blank"
            rel="noopener noreferrer nofollow ugc"
            className="mt-0.5 flex min-w-0 items-center gap-1.5 text-[12.5px] text-[var(--coach-blue)] no-underline hover:underline"
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
