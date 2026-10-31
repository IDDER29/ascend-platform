import { truthTable, type Gate } from "@/lib/practice/figures";

export type Cell = 0 | 1 | null;
type CellState = "idle" | "right" | "wrong" | "shown";

const MONO = "font-[family-name:var(--font-plex-mono)]";

function BitButton({
  value,
  state,
  label,
  size,
  onToggle,
}: {
  value: Cell;
  state: CellState;
  label: string;
  size: "lg" | "md" | "sm";
  onToggle: () => void;
}) {
  const look =
    state === "right"
      ? "border-[var(--coach-correct-border)] bg-[var(--coach-correct-bg)] text-[var(--coach-correct-ink)]"
      : state === "wrong"
        ? "border-[var(--coach-wrong-border)] bg-[var(--coach-wrong-bg)] text-[var(--coach-wrong-ink)]"
        : state === "shown"
          ? "border-dashed border-[var(--coach-ink-muted)] bg-[var(--coach-well)] text-[var(--coach-ink)]"
          : value === 1
            ? "border-[var(--coach-ink)] bg-[var(--coach-ink)] text-[var(--coach-bg)] shadow-[0_4px_0_var(--coach-border-strong)]"
            : "border-[var(--coach-border-strong)] bg-[var(--coach-surface)] text-[var(--coach-ink-muted)] shadow-[0_4px_0_var(--coach-border)]";
  return (
    <button
      type="button"
      data-coach-choice
      aria-label={`${label}: ${value === null ? "not set" : value}`}
      aria-pressed={value === 1}
      disabled={state !== "idle"}
      onClick={onToggle}
      className={`bit-flip flex items-center justify-center rounded-xl border-2 font-bold transition-colors disabled:cursor-default ${MONO} ${look} ${
        size === "lg"
          ? "size-12 text-[20px] sm:size-14 sm:text-[22px]"
          : size === "md"
            ? "size-8 rounded-lg text-[15px] sm:size-12 sm:rounded-xl sm:text-[20px]"
            : "size-10 text-[17px]"
      }`}
    >
      {value === null ? "?" : value}
    </button>
  );
}

/**
 * Flip the bits: a row of switches (with place values), or a gate's truth table with its output
 * column to fill. After Check every cell shows the right value: green where you had it, orange where not.
 */
export function BitsCard({
  answer,
  cells,
  places,
  gate,
  phase,
  onToggle,
}: {
  answer: string;
  cells: Cell[];
  places?: boolean;
  gate?: Gate;
  /** "prompt" while answering; "checked" or "shown" (after "I don't know") afterwards. */
  phase: "prompt" | "checked" | "shown";
  onToggle: (i: number) => void;
}) {
  const stateOf = (i: number): CellState =>
    phase === "prompt" ? "idle" : phase === "shown" ? "shown" : String(cells[i]) === answer[i] ? "right" : "wrong";
  const valueOf = (i: number): Cell => (phase === "prompt" ? cells[i] : (Number(answer[i]) as 0 | 1));

  if (gate) {
    const table = truthTable(gate);
    const width = table.outputs.length;
    const cell = `px-3 py-2 text-center ${MONO}`;
    return (
      <div className="overflow-x-auto rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-4">
        <table className="mx-auto border-separate border-spacing-0 text-[15px]">
          <thead>
            <tr>
              {table.inputs.map((h) => (
                <th
                  key={h}
                  className={`${cell} border-b-2 border-[var(--coach-border)] font-semibold text-[var(--coach-ink-muted)]`}
                >
                  {h}
                </th>
              ))}
              {table.outputs.map((h) => (
                <th key={h} className={`${cell} border-b-2 border-l-2 border-[var(--coach-border)] font-semibold`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, r) => (
              <tr key={r}>
                {row.in.map((v, j) => (
                  <td key={j} className={`${cell} text-[var(--coach-ink-secondary)]`}>
                    {v}
                  </td>
                ))}
                {row.out.map((_, j) => {
                  const i = r * width + j;
                  return (
                    <td key={`o${j}`} className="border-l-2 border-[var(--coach-border)] px-2 py-1.5 text-center">
                      <span className="inline-flex">
                        <BitButton
                          value={valueOf(i)}
                          state={stateOf(i)}
                          label={`${table.outputs[j]} when ${table.inputs.map((h, k) => `${h} is ${row.in[k]}`).join(" and ")}`}
                          size="sm"
                          onToggle={() => onToggle(i)}
                        />
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    // A full byte stays on one line on a phone: smaller switches, tighter gaps.
    <div
      className={`flex justify-center rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] px-3 py-5 sm:px-4 ${
        cells.length > 5 ? "gap-1 sm:gap-2" : "gap-2 sm:gap-3"
      }`}
    >
      {cells.map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-1.5">
          {places ? (
            <span className={`text-[12px] text-[var(--coach-ink-muted)] ${MONO}`}>{2 ** (cells.length - 1 - i)}</span>
          ) : null}
          <BitButton
            value={valueOf(i)}
            state={stateOf(i)}
            label={`Bit ${i + 1}${places ? `, worth ${2 ** (cells.length - 1 - i)}` : ""}`}
            size={cells.length > 5 ? "md" : "lg"}
            onToggle={() => onToggle(i)}
          />
          <span
            aria-hidden
            className={`text-[11px] text-[var(--coach-ink-muted)] [@media(pointer:coarse)]:hidden ${MONO}`}
          >
            {i < 9 ? i + 1 : ""}
          </span>
        </div>
      ))}
    </div>
  );
}
