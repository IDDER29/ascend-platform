import { ArrowDown, ArrowUp, Check, X } from "lucide-react";
import { orderMarks } from "@/lib/practice/session-view";

/**
 * Put in order: the steps as a list you rearrange. Pick a step (click, or its number key), move it with
 * the arrows (or the arrow keys). After Check each step is marked: right place, or where it belongs.
 */
export function OrderCard({
  steps,
  arrangement,
  picked,
  locked,
  onPick,
  onMove,
}: {
  steps: string[];
  arrangement: number[];
  picked: number | null;
  /** After Check (or "I don't know"): no moves, marks shown. */
  locked: boolean;
  onPick: (position: number) => void;
  onMove: (position: number, step: -1 | 1) => void;
}) {
  const marks = orderMarks(arrangement);
  return (
    <ol aria-label="Steps: put them in order" className="m-0 flex list-none flex-col gap-2 p-0">
      {arrangement.map((step, position) => {
        const right = marks[position];
        const look = locked
          ? right
            ? "border-[var(--coach-correct-border)] bg-[var(--coach-correct-bg)] text-[var(--coach-correct-ink)]"
            : "border-[var(--coach-wrong-border)] bg-[var(--coach-wrong-bg)] text-[var(--coach-wrong-ink)]"
          : picked === position
            ? "border-[var(--coach-ink)] bg-[var(--coach-surface)] shadow-[0_4px_0_var(--coach-ink)]"
            : "border-[var(--coach-border)] bg-[var(--coach-surface)] shadow-[0_4px_0_var(--coach-border)]";
        return (
          <li
            key={step}
            className={`order-row flex min-h-14 items-center gap-2 rounded-xl border-2 pr-2 transition-colors ${look}`}
          >
            <button
              type="button"
              data-coach-choice
              disabled={locked}
              aria-pressed={picked === position}
              onClick={() => onPick(position)}
              className="flex min-h-14 min-w-0 flex-1 items-center gap-3 rounded-xl py-2 pl-3 text-left text-[15.5px] disabled:cursor-default"
            >
              <span
                aria-hidden
                className={`flex size-7 shrink-0 items-center justify-center rounded-md font-[family-name:var(--font-plex-mono)] text-xs ${
                  locked
                    ? right
                      ? "bg-[var(--coach-correct-ink)] text-[var(--coach-correct-bg)]"
                      : "bg-[var(--coach-wrong-strong)] text-[var(--coach-on-wrong)]"
                    : picked === position
                      ? "bg-[var(--coach-ink)] text-[var(--coach-bg)]"
                      : "border-2 border-[var(--coach-border-strong)] text-[var(--coach-ink-muted)]"
                }`}
              >
                {locked ? right ? <Check size={14} strokeWidth={3} /> : <X size={14} strokeWidth={3} /> : position + 1}
              </span>
              <span className="min-w-0">{steps[step]}</span>
              {locked && !right ? (
                <span className="ml-auto shrink-0 rounded-full bg-[var(--coach-surface)] px-2 py-0.5 text-[12px] font-semibold">
                  belongs at {step + 1}
                </span>
              ) : null}
            </button>
            {!locked ? (
              <div className="flex shrink-0 gap-1">
                {(
                  [
                    [-1, ArrowUp, "Move up"],
                    [1, ArrowDown, "Move down"],
                  ] as const
                ).map(([dir, Icon, label]) => (
                  <button
                    key={label}
                    type="button"
                    aria-label={`${label}: ${steps[step]}`}
                    disabled={(dir === -1 && position === 0) || (dir === 1 && position === arrangement.length - 1)}
                    onClick={() => onMove(position, dir)}
                    className="flex size-9 items-center justify-center rounded-lg text-[var(--coach-ink-secondary)] hover:bg-[var(--coach-tint-neutral-bg)] hover:text-[var(--coach-ink)] disabled:opacity-30"
                  >
                    <Icon size={17} strokeWidth={2.2} aria-hidden />
                  </button>
                ))}
              </div>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
