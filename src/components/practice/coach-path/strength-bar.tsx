import type { StrengthBuckets } from "@/lib/practice/coach-home-model";

export const STRENGTH_LEVELS = [
  { key: "new", label: "New", color: "bg-[var(--coach-scale-1)]" },
  { key: "learning", label: "Learning", color: "bg-[var(--coach-scale-2)]" },
  { key: "solid", label: "Solid", color: "bg-[var(--coach-scale-3)]" },
  { key: "mastered", label: "Mastered", color: "bg-[var(--coach-scale-4)]" },
] as const;

/** Segmented card-strength bar; empty buckets are skipped. */
export function StrengthBar({
  strength,
  className = "h-2.5",
}: {
  strength: StrengthBuckets;
  className?: string;
}) {
  const levels = STRENGTH_LEVELS.filter((level) => strength[level.key] > 0);
  const label = levels.map((level) => `${level.label} ${strength[level.key]}`).join(", ");
  return (
    <div role="img" aria-label={label || "No cards"} className={`flex gap-0.5 ${className}`}>
      {levels.map((level, i) => (
        <span
          key={level.key}
          className={`${level.color} ${i === 0 ? "rounded-l" : ""} ${
            i === levels.length - 1 ? "rounded-r" : ""
          }`}
          style={{ flex: `${strength[level.key]} 1 0` }}
        />
      ))}
    </div>
  );
}
