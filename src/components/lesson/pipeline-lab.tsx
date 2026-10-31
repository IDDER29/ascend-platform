"use client";

import { useId, useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import { runPipeline, type BranchPolicy, type Cell } from "@/lib/pipeline/model";

const MONO = "font-[family-name:var(--font-plex-mono)]";

const CELL_STYLE: Record<Cell, string> = {
  IF: "bg-[var(--coach-tint-blue-bg)] text-[var(--coach-tint-blue-ink)]",
  ID: "bg-[var(--coach-tint-neutral-bg)] text-[var(--coach-ink)]",
  EX: "bg-[var(--coach-tint-lime-bg)] text-[var(--coach-tint-lime-ink)]",
  MEM: "bg-[var(--coach-tint-orange-bg)] text-[var(--coach-tint-orange-strong)]",
  WB: "bg-[var(--coach-ink)] text-[var(--coach-surface)]",
  stall: "bg-[var(--coach-wrong-soft)] text-[var(--coach-wrong-title)]",
};

type Goal = { maxCycles?: number; regs?: Record<string, number> };

function parseJson<T>(text: string | undefined, fallback: T): T {
  if (!text) return fallback;
  try {
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

/**
 * The Pipeline Lab: a RISC-V-style program run through a five-stage pipeline (src/lib/pipeline/model.ts),
 * drawn cycle by cycle, with forwarding and the branch policy as switches. JSON-string props: programJson,
 * dataJson ('{"0":21}', memory words by byte address), forwardingJson ('true'), branchJson
 * ('"predict-not-taken"' or '"stall"'), goalJson ('{"maxCycles":9,"regs":{"x2":42}}'). With `editable` the
 * learner edits the program; with `fixed` the switches are locked.
 */
export function PipelineLab({
  caption,
  programJson,
  dataJson,
  forwardingJson,
  branchJson,
  goalJson,
  editable = false,
  fixed = false,
}: {
  caption?: string;
  programJson: string;
  dataJson?: string;
  forwardingJson?: string;
  branchJson?: string;
  goalJson?: string;
  editable?: boolean;
  fixed?: boolean;
}) {
  const start = useMemo(() => parseJson<string[]>(programJson, []).join("\n"), [programJson]);
  const data = useMemo(() => parseJson<Record<string, number>>(dataJson, {}), [dataJson]);
  const goal = useMemo(() => parseJson<Goal | null>(goalJson, null), [goalJson]);
  const [source, setSource] = useState(start);
  const [forwarding, setForwarding] = useState(parseJson<boolean>(forwardingJson, true));
  const [branch, setBranch] = useState<BranchPolicy>(parseJson<BranchPolicy>(branchJson, "predict-not-taken"));
  const editorId = useId();

  const run = useMemo(
    () =>
      runPipeline(
        source.split("\n"),
        { forwarding, branch },
        Object.fromEntries(Object.entries(data).map(([k, v]) => [Number(k), v])),
      ),
    [source, forwarding, branch, data],
  );

  const misses: string[] = [];
  if (goal && run.ok) {
    if (goal.maxCycles !== undefined && run.timing.cycles > goal.maxCycles) misses.push(`it takes ${run.timing.cycles} cycles, more than ${goal.maxCycles}`);
    for (const [r, want] of Object.entries(goal.regs ?? {})) {
      const got = run.exec.regs[Number(r.slice(1))];
      if (got !== want) misses.push(`${r} should end as ${want}, not ${got}`);
    }
  }
  const cycles = run.ok ? run.timing.cycles : 0;
  const toggle = (on: boolean) =>
    `h-9 rounded-full px-3 text-[12.5px] font-bold ${on ? "bg-[var(--coach-ink)] text-[var(--coach-surface)]" : "border-2 border-[var(--coach-border)] text-[var(--coach-ink-secondary)]"} disabled:opacity-60`;

  return (
    <figure className="not-prose my-6 overflow-hidden rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] text-[var(--coach-ink)]">
      <figcaption className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[var(--coach-border)] px-4 py-3">
        <span className="text-[15px] font-bold">{caption ?? "The pipeline"}</span>
        {editable && (
          <button
            type="button"
            onClick={() => setSource(start)}
            aria-label="Reset the program"
            className="inline-flex size-9 items-center justify-center rounded-full border-2 border-[var(--coach-border-strong)]"
          >
            <RotateCcw size={15} aria-hidden />
          </button>
        )}
      </figcaption>

      <div className="flex flex-col gap-3 p-4">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Pipeline settings">
          <span className="text-[12.5px] font-semibold text-[var(--coach-ink-secondary)]">Forwarding</span>
          <button type="button" aria-pressed={forwarding} disabled={fixed} onClick={() => setForwarding(true)} className={toggle(forwarding)}>
            on
          </button>
          <button type="button" aria-pressed={!forwarding} disabled={fixed} onClick={() => setForwarding(false)} className={toggle(!forwarding)}>
            off
          </button>
          <span className="ml-2 text-[12.5px] font-semibold text-[var(--coach-ink-secondary)]">Branches</span>
          <button
            type="button"
            aria-pressed={branch === "predict-not-taken"}
            disabled={fixed}
            onClick={() => setBranch("predict-not-taken")}
            className={toggle(branch === "predict-not-taken")}
          >
            guess not taken
          </button>
          <button type="button" aria-pressed={branch === "stall"} disabled={fixed} onClick={() => setBranch("stall")} className={toggle(branch === "stall")}>
            stall
          </button>
        </div>

        {editable ? (
          <div className="flex flex-col gap-1">
            <label htmlFor={editorId} className="text-[12.5px] font-semibold text-[var(--coach-ink-secondary)]">
              The program
            </label>
            <textarea
              id={editorId}
              value={source}
              onChange={(e) => setSource(e.target.value)}
              spellCheck={false}
              rows={Math.max(4, source.split("\n").length + 1)}
              className={`w-full resize-y rounded-xl border-2 border-[var(--coach-border)] bg-[var(--coach-code-bg)] p-3 text-[13px] leading-relaxed text-[var(--coach-code-ink)] outline-none focus-visible:border-[var(--coach-focus)] ${MONO}`}
            />
            <p className="m-0 text-[12px] text-[var(--coach-ink-muted)]">
              add, sub, and, or, slt, addi, lw, sw, beq, bne, nop; registers x0 to x31; labels like <span className={MONO}>loop:</span>
            </p>
          </div>
        ) : null}

        {run.ok ? (
          <div className="overflow-x-auto">
            <table className={`border-separate border-spacing-[2px] text-[11.5px] ${MONO}`}>
              <caption className="sr-only">Which stage each instruction is in, cycle by cycle</caption>
              <thead>
                <tr>
                  <th scope="col" className="sticky left-0 bg-[var(--coach-surface)] pr-2 text-left font-semibold text-[var(--coach-ink-muted)]">
                    instruction
                  </th>
                  {Array.from({ length: cycles }, (_, c) => (
                    <th key={c} scope="col" className="min-w-[34px] text-center font-normal text-[var(--coach-ink-muted)]">
                      {c + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {run.timing.rows.map((r, i) => (
                  <tr key={i} className={r.flushed ? "opacity-60" : ""}>
                    <th
                      scope="row"
                      className={`sticky left-0 whitespace-nowrap bg-[var(--coach-surface)] pr-2 text-left font-normal ${r.flushed ? "line-through" : ""}`}
                    >
                      {r.text}
                      {r.flushed ? <span className="ml-1 font-sans text-[10.5px] no-underline">flushed</span> : null}
                      {r.note ? <span className="ml-1 font-sans text-[10.5px] text-[var(--coach-wrong-title)]">{r.note}</span> : null}
                    </th>
                    {Array.from({ length: cycles }, (_, c) => {
                      const cell = r.cells[c];
                      return (
                        <td key={c} className={`rounded px-1 py-[3px] text-center ${cell ? CELL_STYLE[cell] : ""}`}>
                          {cell === "stall" ? "-" : (cell ?? "")}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {run.ok && (
          <dl className={`m-0 flex flex-wrap gap-x-5 gap-y-1 text-[13px] ${MONO}`}>
            {[
              ["cycles", run.timing.cycles],
              ["instructions", run.timing.instructions],
              ["CPI", run.timing.instructions ? (run.timing.cycles / run.timing.instructions).toFixed(2) : "-"],
              ["stalls", run.timing.stalls],
              ["branch bubbles", run.timing.bubbles],
              ["flushed", run.timing.flushes],
            ].map(([k, v]) => (
              <div key={String(k)} className="flex gap-1.5">
                <dt className="text-[var(--coach-ink-muted)]">{k}</dt>
                <dd className="m-0 font-bold">{v}</dd>
              </div>
            ))}
            <div className="flex gap-1.5">
              <dt className="text-[var(--coach-ink-muted)]">registers</dt>
              <dd className="m-0 font-bold">
                {run.exec.regs
                  .map((v, r) => [r, v] as const)
                  .filter(([r, v]) => r !== 0 && v !== 0)
                  .map(([r, v]) => `x${r}=${v}`)
                  .join(" ") || "all 0"}
              </dd>
            </div>
          </dl>
        )}
      </div>

      <p
        aria-live="polite"
        className={`m-0 border-t-2 border-[var(--coach-border)] px-4 py-3 text-[14px] leading-snug ${
          !run.ok ? "bg-[var(--coach-wrong-soft)]" : goal && misses.length === 0 ? "bg-[var(--coach-tint-lime-bg)] font-semibold" : ""
        }`}
      >
        {!run.ok
          ? `Line ${run.line}: ${run.message}.`
          : run.exec.stopped === "limit"
            ? `Stopped after ${run.timing.instructions} instructions: does a loop never end?`
            : run.exec.stopped === "bad-address"
              ? "Stopped: a load or store used an address that isn't a multiple of 4."
              : goal
                ? misses.length === 0
                  ? `The goal is met: ${run.timing.cycles} cycles.`
                  : `Not yet: ${misses.join("; ")}.`
                : `${run.timing.instructions} instructions in ${run.timing.cycles} cycles. A - is a cycle spent waiting.`}
      </p>
    </figure>
  );
}
