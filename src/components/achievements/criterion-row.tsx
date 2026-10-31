import { Check } from "lucide-react";
import type { Criterion } from "@/lib/achievements/achievements-model";
import { Medallion } from "./medallion";
import { ProgressBar } from "./progress-bar";

function shortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** One condition of a badge's rule: ticked and dated when met, with progress while open. */
export function CriterionRow({
  c,
  partGlyph,
  onSelectPart,
}: {
  c: Criterion;
  partGlyph: string | null;
  /** A combination's part opens that badge's citation. */
  onSelectPart: (id: string) => void;
}) {
  const partName = c.text.replace(/^Earn /, "");
  const marker = partGlyph ? (
    <button type="button" onClick={() => onSelectPart(c.badgeId!)} aria-label={`Show ${partName}`} className="shrink-0 rounded-full">
      <Medallion glyph={partGlyph} earned={c.done} size="xs" />
    </button>
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
