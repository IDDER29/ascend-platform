import { Check, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { BadgeView, Criterion } from "@/lib/achievements/achievements-model";
import { badgeAnchor, Medallion, TARGET_RING } from "./medallion";
import { ProgressBar } from "./progress-bar";

function shortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function CriterionRow({ c, partGlyph }: { c: Criterion; partGlyph: string | null }) {
  const marker = partGlyph ? (
    <a href={`#${badgeAnchor(c.badgeId!)}`} aria-label={`Go to ${c.text.replace(/^Earn /, "")}`} className="shrink-0">
      <Medallion glyph={partGlyph} earned={c.done} size="xs" />
    </a>
  ) : (
    <span
      aria-hidden="true"
      className={`mt-px flex size-5 shrink-0 items-center justify-center rounded-full ${
        c.done ? "bg-[var(--coach-lime)] text-[var(--coach-lime-ink)]" : "border-2 border-[var(--coach-border-strong)]"
      }`}
    >
      {c.done ? <Check size={12} strokeWidth={3} /> : null}
    </span>
  );
  return (
    <li className="flex items-start gap-2.5">
      {marker}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className={`text-[13.5px] leading-snug ${c.done ? "text-[var(--coach-ink)]" : "text-[var(--coach-ink-secondary)]"}`}>
          <span className="sr-only">{c.done ? "Done: " : "Not yet: "}</span>
          {c.text}
        </span>
        {!c.done && c.progress ? (
          <span className="flex items-center gap-2">
            <ProgressBar done={c.progress.done} total={c.progress.total} />
            <span className="shrink-0 text-[12px] text-[var(--coach-ink-muted)]">
              {c.progress.done} of {c.progress.total}
            </span>
          </span>
        ) : null}
      </div>
      {c.done && c.at ? <span className="shrink-0 text-[12px] text-[var(--coach-ink-muted)]">{shortDate(c.at)}</span> : null}
    </li>
  );
}

/** One badge and its exact rule, as a checklist. */
export function BadgeCard({ badge, glyphOf }: { badge: BadgeView; glyphOf: (id: string) => string }) {
  const doneCount = badge.criteria.filter((c) => c.done).length;
  return (
    <li
      id={badgeAnchor(badge.id)}
      className={`flex min-w-0 flex-col gap-4 rounded-2xl border-2 p-5 ${
        badge.earned ? "border-[var(--coach-border)] bg-[var(--coach-surface)]" : "border-dashed border-[var(--coach-border-strong)] bg-transparent"
      } ${TARGET_RING}`}
    >
      <div className="flex items-start gap-3">
        <Medallion glyph={badge.glyph} earned={badge.earned} />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <h3 className="m-0 text-[16.5px] font-semibold">{badge.label}</h3>
          <span className={`text-[13px] ${badge.earned ? "font-semibold text-[var(--coach-tint-lime-ink)]" : "text-[var(--coach-ink-muted)]"}`}>
            {badge.earned
              ? `Earned ${badge.earnedLabel}`
              : badge.criteria.length > 1
                ? `${doneCount} of ${badge.criteria.length} conditions met`
                : "Not earned yet"}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h4 className="m-0 text-[12.5px] font-semibold text-[var(--coach-ink-muted)]">
          {badge.criteria.length > 1 ? "Earn it by meeting all of these" : "Earn it by"}
        </h4>
        <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
          {badge.criteria.map((c) => (
            <CriterionRow key={c.text} c={c} partGlyph={c.badgeId ? glyphOf(c.badgeId) : null} />
          ))}
        </ul>
      </div>

      {badge.earned ? (
        <div className="flex flex-col gap-1 border-t border-[var(--coach-divider)] pt-3">
          <p className="m-0 text-[13.5px] text-[var(--coach-ink-secondary)]">{badge.means}.</p>
          {badge.repoUrl ? (
            <a
              href={badge.repoUrl}
              target="_blank"
              rel="noopener noreferrer nofollow ugc"
              className="flex min-w-0 items-center gap-1.5 text-[12.5px] text-[var(--coach-blue)] no-underline hover:underline"
            >
              <ExternalLink size={12} aria-hidden="true" className="shrink-0" />
              <span className="truncate font-mono">{badge.repoLabel}</span>
            </a>
          ) : null}
        </div>
      ) : badge.action ? (
        <Link
          href={badge.action.href}
          className="mt-auto inline-flex h-9 w-fit items-center rounded-lg border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] px-3 text-[13px] font-semibold text-[var(--coach-ink)] no-underline hover:border-[var(--coach-border-strong)]"
        >
          {badge.action.label}
        </Link>
      ) : null}
    </li>
  );
}
