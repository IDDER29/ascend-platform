"use client";

import { useMemo, useState } from "react";
import { RotateCcw, StepForward } from "lucide-react";
import { boardFrom, goalMet, readBoard, tickBoard, type MemoryFault } from "@/lib/memory-board/model";

const MONO = "font-[family-name:var(--font-plex-mono)]";
const hex = (n: number) => n.toString(16).toUpperCase().padStart(2, "0");

function parseJson<T>(text: string | undefined, fallback: T): T {
  if (!text) return fallback;
  try {
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

type LogEntry = { address: number; data: number; write: boolean; changed: number[] };

/**
 * The memory board: addressed one-byte boxes. Set the address, the data in and write enable, then Tick:
 * with write on, the selected box takes the data. Data out always shows the selected box. JSON-string
 * props: sizeJson ('16' or '256'), startJson ('{"3":42}'), goalJson (a state to reach, other boxes
 * untouched), faultJson ('{"ignoreAddressBit":0}', a decoder fault to find).
 */
export function MemoryBoard({
  caption,
  sizeJson,
  startJson,
  goalJson,
  faultJson,
}: {
  caption?: string;
  sizeJson?: string;
  startJson?: string;
  goalJson?: string;
  faultJson?: string;
}) {
  const size = parseJson<number>(sizeJson, 16) === 256 ? 256 : 16;
  const start = useMemo(() => boardFrom(size, parseJson<Record<string, number>>(startJson, {})), [size, startJson]);
  const goal = useMemo(() => parseJson<Record<string, number> | undefined>(goalJson, undefined), [goalJson]);
  const fault = useMemo(() => parseJson<MemoryFault | undefined>(faultJson, undefined), [faultJson]);

  const [mem, setMem] = useState(start);
  const [address, setAddress] = useState(0);
  const [data, setData] = useState(0);
  const [write, setWrite] = useState(false);
  const [log, setLog] = useState<LogEntry[]>([]);

  const last = log[log.length - 1];
  const out = readBoard(mem, address, fault);
  const check = goal ? goalMet(mem, start, goal) : null;
  const cols = 16;
  const rows = size / cols;

  function doTick() {
    const r = tickBoard(mem, { address, data, write }, fault);
    setMem(r.mem);
    setLog((l) => [...l, { address, data, write, changed: r.changed }]);
  }

  const field =
    "h-9 w-[76px] rounded-lg border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] px-2 text-[14px] text-[var(--coach-ink)] outline-none focus-visible:border-[var(--coach-focus)]";

  return (
    <figure className="not-prose my-6 overflow-hidden rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] text-[var(--coach-ink)]">
      <figcaption className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[var(--coach-border)] px-4 py-3">
        <span className="text-[15px] font-bold">{caption ?? "The memory board"}</span>
        <button
          type="button"
          onClick={() => {
            setMem(start);
            setLog([]);
          }}
          aria-label="Reset the memory"
          className="inline-flex size-9 items-center justify-center rounded-full border-2 border-[var(--coach-border-strong)]"
        >
          <RotateCcw size={15} aria-hidden />
        </button>
      </figcaption>

      {/* The signals going into the memory, and data out. */}
      <div className="flex flex-wrap items-end gap-3 p-4 text-[13px]">
        <label className="flex flex-col gap-1">
          <span className="text-[12px] font-semibold text-[var(--coach-ink-secondary)]">address (0 to {size - 1})</span>
          <input
            type="number"
            min={0}
            max={size - 1}
            value={address}
            onChange={(e) => setAddress(Math.max(0, Math.min(size - 1, Number(e.target.value) || 0)))}
            className={`${field} ${MONO}`}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[12px] font-semibold text-[var(--coach-ink-secondary)]">data in (0 to 255)</span>
          <input
            type="number"
            min={0}
            max={255}
            value={data}
            onChange={(e) => setData(Math.max(0, Math.min(255, Number(e.target.value) || 0)))}
            className={`${field} ${MONO}`}
          />
        </label>
        <label className="flex h-9 items-center gap-2 text-[13.5px] font-semibold">
          <input type="checkbox" checked={write} onChange={(e) => setWrite(e.target.checked)} className="size-[18px] accent-[var(--coach-blue)]" />
          write enable
        </label>
        <button
          type="button"
          onClick={doTick}
          className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[var(--coach-lime)] px-3.5 text-[13.5px] font-bold text-[var(--coach-lime-ink)] shadow-[0_2px_0_var(--coach-lime-shadow)]"
        >
          <StepForward size={15} strokeWidth={2.4} aria-hidden /> Tick
        </button>
        <span className={`ml-auto rounded-xl bg-[var(--coach-code-bg)] px-3 py-1.5 text-[var(--coach-code-ink)] ${MONO}`}>
          <span className="block text-[11px] text-[var(--coach-hero-muted)]">data out</span>
          <span className="text-[17px] font-bold">{out}</span>
        </span>
      </div>

      {/* The boxes. The selected box is outlined; boxes changed on the last tick are lime. */}
      <div className="overflow-x-auto px-4">
        <table aria-label="Memory" className={`w-full border-separate border-spacing-[2px] text-[11.5px] ${MONO}`}>
          <tbody>
            {Array.from({ length: rows }, (_, r) => (
              <tr key={r}>
                <th scope="row" className="pr-1 text-right font-normal text-[var(--coach-ink-muted)]">
                  {size === 16 ? "" : hex(r * cols)}
                </th>
                {Array.from({ length: cols }, (_, c) => {
                  const a = r * cols + c;
                  const changed = last?.changed.includes(a);
                  const sel = a === address;
                  return (
                    <td
                      key={c}
                      title={`box ${a}: ${mem[a]}`}
                      className={`rounded px-[3px] py-[2px] text-center ${
                        changed
                          ? "bg-[var(--coach-lime)] font-bold text-[var(--coach-lime-ink)]"
                          : "bg-[var(--coach-tint-neutral-bg)]"
                      } ${sel ? "outline outline-2 outline-[var(--coach-ink)]" : ""} ${mem[a] === 0 && !changed ? "text-[var(--coach-ink-muted)]" : ""}`}
                    >
                      {size === 16 && <span className="block text-[9.5px] font-normal text-[var(--coach-ink-muted)]">{a}</span>}
                      {mem[a]}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* The timeline. */}
      <div className="p-4">
        <p className="m-0 mb-1.5 text-[13px] font-bold">Timeline</p>
        {log.length === 0 ? (
          <p className="m-0 text-[13px] text-[var(--coach-ink-muted)]">No ticks yet.</p>
        ) : (
          <ol className={`m-0 flex max-h-[160px] list-none flex-col gap-0.5 overflow-y-auto p-0 text-[12.5px] ${MONO}`}>
            {log.map((e, i) => (
              <li key={i}>
                tick {i + 1}: address {e.address}, data {e.data}, write {e.write ? 1 : 0}
                {" → "}
                {e.changed.length === 0 ? "nothing changed" : `changed box ${e.changed.join(" and box ")}`}
              </li>
            ))}
          </ol>
        )}
      </div>

      <p
        aria-live="polite"
        className={`m-0 border-t-2 border-[var(--coach-border)] px-4 py-3 text-[14px] leading-snug ${
          check?.met ? "bg-[var(--coach-tint-lime-bg)] font-semibold" : ""
        }`}
      >
        {check
          ? check.met
            ? "Done: every box is right, and nothing else changed."
            : `Not yet: ${check.wrong.length} ${check.wrong.length === 1 ? "box differs" : "boxes differ"} from the goal (box ${check.wrong.slice(0, 6).join(", ")}${check.wrong.length > 6 ? ", ..." : ""}).`
          : last
            ? last.changed.length > 1
              ? `That tick changed ${last.changed.length} boxes.`
              : last.write
                ? "Written on the tick."
                : "Write enable was off, so nothing changed."
            : "Set the address and data, choose write enable, then Tick."}
      </p>
    </figure>
  );
}
