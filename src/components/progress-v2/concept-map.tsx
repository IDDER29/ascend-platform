import Link from "next/link";
import type { ConceptShade, ProgressV2Model } from "@/lib/progress/progress-v2-model";

const SHADES: Record<ConceptShade, string> = {
  0: "border-2 border-dashed border-[var(--coach-border-strong)] bg-transparent",
  1: "bg-[var(--coach-scale-1)]",
  2: "bg-[var(--coach-scale-2)]",
  3: "bg-[var(--coach-scale-3)]",
  4: "bg-[var(--coach-scale-4)]",
};

const LEGEND: { shade: ConceptShade; label: string }[] = [
  { shade: 0, label: "Not practiced" },
  { shade: 1, label: "Fresh" },
  { shade: 2, label: "Taking hold" },
  { shade: 3, label: "Mostly solid" },
  { shade: 4, label: "Solid" },
];

export function ConceptMap({ concepts }: { concepts: ProgressV2Model["concepts"] }) {
  return (
    <section
      aria-labelledby="concepts-title"
      className="flex min-w-0 flex-col gap-5 rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-5 sm:p-6"
    >
      <div className="flex flex-col gap-1">
        <h2 id="concepts-title" className="m-0 text-lg font-semibold">
          Concept map
        </h2>
        <p className="m-0 text-[13px] text-[var(--coach-ink-secondary)]">
          One tile per lesson. Darker means more of its cards are solid.
        </p>
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-4">
        {concepts.map((level) => (
          <div key={level.id} className="flex flex-col gap-2">
            <span className="font-mono text-xs text-[var(--coach-ink-muted)]">
              L{level.number} · {level.name}
            </span>
            <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
              {level.tiles.map((tile) => (
                <li key={tile.key}>
                  <Link
                    href={tile.href}
                    title={tile.label}
                    aria-label={tile.label}
                    className={`block size-9 rounded-lg ${SHADES[tile.shade]}`}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <ul aria-label="Legend" className="m-0 flex list-none flex-wrap gap-x-4 gap-y-2 p-0 text-xs text-[var(--coach-ink-secondary)]">
        {LEGEND.map((item) => (
          <li key={item.shade} className="flex items-center gap-1.5">
            <span className={`size-3 rounded-[3px] ${SHADES[item.shade]}`} />
            {item.label}
          </li>
        ))}
      </ul>
    </section>
  );
}
