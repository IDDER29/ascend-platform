"use client";

import { useId, useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import { LATENCY, parseBlock, schedule, type OooOptions } from "@/lib/ooo/model";

const MONO = "font-[family-name:var(--font-plex-mono)]";

function parseJson<T>(text: string | undefined, fallback: T): T {
  if (!text) return fallback;
  try {
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

/**
 * The Out-of-Order Lab: a block of instructions scheduled on an idealised core (src/lib/ooo/model.ts):
 * in order or out of order, 1, 2 or 4 issued per cycle, a window (reorder buffer) of a chosen size, and
 * register renaming on or off. Each row shows when an instruction waits, executes and commits.
 * JSON-string props: blockJson (["lw r1, 0(r2)","add r3, r1, r1"]), optionsJson
 * ('{"outOfOrder":false,"width":1,"window":32,"renaming":true}'), goalJson ('{"maxCycles":6}').
 * With `editable` the learner edits the block; with `fixed` the settings are locked.
 */
export function OooLab({
  caption,
  blockJson,
  optionsJson,
  goalJson,
  editable = false,
  fixed = false,
}: {
  caption?: string;
  blockJson: string;
  optionsJson?: string;
  goalJson?: string;
  editable?: boolean;
  fixed?: boolean;
}) {
  const start = useMemo(() => parseJson<string[]>(blockJson, []).join("\n"), [blockJson]);
  const startOpts = useMemo<OooOptions>(
    () => ({ outOfOrder: false, width: 1, window: 32, renaming: true, ...parseJson<Partial<OooOptions>>(optionsJson, {}) }),
    [optionsJson],
  );
  const goal = parseJson<{ maxCycles?: number } | null>(goalJson, null);
  const [source, setSource] = useState(start);
  const [opts, setOpts] = useState<OooOptions>(startOpts);
  const editorId = useId();

  const parsed = useMemo(() => parseBlock(source.split("\n")), [source]);
  const s = useMemo(() => (parsed.ok ? schedule(parsed.block, opts) : null), [parsed, opts]);
  const met = goal?.maxCycles !== undefined && s !== null && s.rows.length > 0 && s.cycles <= goal.maxCycles;
  const set = (patch: Partial<OooOptions>) => setOpts((o) => ({ ...o, ...patch }));
  const pill = (on: boolean) =>
    `h-9 rounded-full px-3 text-[12.5px] font-bold disabled:opacity-60 ${on ? "bg-[var(--coach-ink)] text-[var(--coach-surface)]" : "border-2 border-[var(--coach-border)] text-[var(--coach-ink-secondary)]"}`;

  return (
    <figure className="not-prose my-6 overflow-hidden rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] text-[var(--coach-ink)]">
      <figcaption className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[var(--coach-border)] px-4 py-3">
        <span className="text-[15px] font-bold">{caption ?? "Scheduling instructions"}</span>
        {editable && (
          <button
            type="button"
            onClick={() => setSource(start)}
            aria-label="Reset the instructions"
            className="inline-flex size-9 items-center justify-center rounded-full border-2 border-[var(--coach-border-strong)]"
          >
            <RotateCcw size={15} aria-hidden />
          </button>
        )}
      </figcaption>
      <div className="flex flex-col gap-3 p-4">
        <div className="flex flex-wrap items-center gap-2 text-[12.5px]" role="group" aria-label="Core settings">
          <button type="button" disabled={fixed} aria-pressed={!opts.outOfOrder} onClick={() => set({ outOfOrder: false })} className={pill(!opts.outOfOrder)}>
            in order
          </button>
          <button type="button" disabled={fixed} aria-pressed={opts.outOfOrder} onClick={() => set({ outOfOrder: true })} className={pill(opts.outOfOrder)}>
            out of order
          </button>
          <label className="ml-2 flex items-center gap-1.5 font-semibold text-[var(--coach-ink-secondary)]">
            per cycle
            <select disabled={fixed} value={opts.width} onChange={(e) => set({ width: Number(e.target.value) })} className="h-9 rounded-lg border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] px-2">
              {[1, 2, 4].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-1.5 font-semibold text-[var(--coach-ink-secondary)]">
            window
            <select disabled={fixed} value={opts.window} onChange={(e) => set({ window: Number(e.target.value) })} className="h-9 rounded-lg border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] px-2">
              {[2, 4, 8, 32].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <button type="button" disabled={fixed} aria-pressed={opts.renaming} onClick={() => set({ renaming: !opts.renaming })} className={pill(opts.renaming)}>
            renaming {opts.renaming ? "on" : "off"}
          </button>
        </div>

        {editable && (
          <div className="flex flex-col gap-1">
            <label htmlFor={editorId} className="text-[12.5px] font-semibold text-[var(--coach-ink-secondary)]">
              The instructions
            </label>
            <textarea
              id={editorId}
              value={source}
              onChange={(e) => setSource(e.target.value)}
              spellCheck={false}
              rows={Math.max(4, source.split("\n").length + 1)}
              className={`w-full resize-y rounded-xl border-2 border-[var(--coach-border)] bg-[var(--coach-code-bg)] p-3 text-[13px] text-[var(--coach-code-ink)] outline-none focus-visible:border-[var(--coach-focus)] ${MONO}`}
            />
            <p className="m-0 text-[12px] text-[var(--coach-ink-muted)]">
              Latencies in cycles: {Object.entries(LATENCY).map(([op, l]) => `${op} ${l}`).join(", ")}.
            </p>
          </div>
        )}

        {s && (
          <div className="overflow-x-auto">
            <table className={`border-separate border-spacing-[2px] text-[11.5px] ${MONO}`}>
              <caption className="sr-only">Each instruction, cycle by cycle: E executing, C committing</caption>
              <thead>
                <tr>
                  <th scope="col" className="sticky left-0 bg-[var(--coach-surface)] pr-2 text-left font-semibold text-[var(--coach-ink-muted)]">
                    instruction
                  </th>
                  {Array.from({ length: s.cycles }, (_, c) => (
                    <th key={c} scope="col" className="min-w-[24px] text-center font-normal text-[var(--coach-ink-muted)]">
                      {c + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {s.rows.map((r, i) => (
                  <tr key={i}>
                    <th scope="row" className="sticky left-0 whitespace-nowrap bg-[var(--coach-surface)] pr-2 text-left font-normal">
                      {r.text}
                      {r.waited ? <span className="ml-1 font-sans text-[10.5px] text-[var(--coach-wrong-title)]">waits: {r.waited}</span> : null}
                    </th>
                    {Array.from({ length: s.cycles }, (_, c) => {
                      const cycle = c + 1;
                      const executing = cycle >= r.issue && cycle < r.done;
                      const committing = cycle === r.commit;
                      return (
                        <td
                          key={c}
                          className={`rounded px-1 py-[3px] text-center ${
                            committing
                              ? "bg-[var(--coach-ink)] text-[var(--coach-surface)]"
                              : executing
                                ? "bg-[var(--coach-tint-lime-bg)] text-[var(--coach-tint-lime-ink)]"
                                : ""
                          }`}
                        >
                          {committing ? "C" : executing ? "E" : ""}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <p
        aria-live="polite"
        className={`m-0 border-t-2 border-[var(--coach-border)] px-4 py-3 text-[14px] leading-snug ${
          !parsed.ok ? "bg-[var(--coach-wrong-soft)]" : met ? "bg-[var(--coach-tint-lime-bg)] font-semibold" : ""
        }`}
      >
        {!parsed.ok
          ? `Line ${parsed.line}: ${parsed.message}.`
          : s
            ? `${s.rows.length} instructions in ${s.cycles} cycles (IPC ${s.ipc.toFixed(2)}).${
                goal?.maxCycles !== undefined ? (met ? " The goal is met." : ` The goal is ${goal.maxCycles} cycles or fewer.`) : ""
              } E is executing, C is committing in order.`
            : ""}
      </p>
    </figure>
  );
}
