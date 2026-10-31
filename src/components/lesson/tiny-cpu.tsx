"use client";

import { useEffect, useMemo, useState } from "react";
import { Pause, Play, RotateCcw, StepForward } from "lucide-react";
import {
  MAX_STEPS,
  assemble,
  boot,
  byteBits,
  decode,
  step,
  type Machine,
  type StepEvent,
} from "@/lib/tiny-cpu/machine";

const MONO = "font-[family-name:var(--font-plex-mono)]";
const RUN_MS = 650;

/**
 * The tiny CPU, live in a lesson. Pass the program and its data as JSON strings (MDX drops expression
 * props): programJson='["LDA 14","ADD 15","OUT","HLT"]' dataJson='{"14":28,"15":14}'.
 * Step through it (predict first), run it, reset it. Every lesson and project uses this one machine.
 */
export function TinyCpu({
  caption,
  programJson,
  dataJson,
}: {
  caption?: string;
  programJson: string;
  dataJson?: string;
}) {
  const start = useMemo(() => {
    try {
      return { mem: assemble(JSON.parse(programJson), dataJson ? JSON.parse(dataJson) : {}), error: null };
    } catch (e) {
      return { mem: null, error: e instanceof Error ? e.message : "This program can't run." };
    }
  }, [programJson, dataJson]);

  const [machine, setMachine] = useState<Machine | null>(() => (start.mem ? boot(start.mem) : null));
  const [last, setLast] = useState<StepEvent | null>(null);
  const [running, setRunning] = useState(false);

  const done = !machine || machine.halted || machine.steps >= MAX_STEPS;

  function stepOnce() {
    if (!machine || machine.halted || machine.steps >= MAX_STEPS) return;
    const r = step(machine);
    setMachine(r.machine);
    setLast(r.event);
  }

  function reset() {
    setRunning(false);
    setLast(null);
    setMachine(start.mem ? boot(start.mem) : null);
  }

  useEffect(() => {
    if (!running) return;
    if (done) {
      queueMicrotask(() => setRunning(false));
      return;
    }
    const t = window.setTimeout(stepOnce, RUN_MS);
    return () => window.clearTimeout(t);
  });

  if (!machine) {
    return (
      <div className="not-prose my-6 rounded-2xl border-2 border-[var(--coach-wrong-border)] bg-[var(--coach-wrong-soft)] p-4 text-[14px]">
        Tiny CPU: {start.error}
      </div>
    );
  }

  const status = machine.halted
    ? "Halted."
    : machine.steps >= MAX_STEPS
      ? `Stopped after ${MAX_STEPS} steps: this program loops forever.`
      : last
        ? last.text
        : "Ready. Before each Step, predict what will change.";

  return (
    <figure className="not-prose my-6 overflow-hidden rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] text-[var(--coach-ink)]">
      <figcaption className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[var(--coach-border)] px-4 py-3">
        <span className="text-[15px] font-bold">{caption ?? "The tiny CPU"}</span>
        <span className="flex gap-2">
          <button
            type="button"
            onClick={stepOnce}
            disabled={done || running}
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[var(--coach-lime)] px-3.5 text-[13.5px] font-bold text-[var(--coach-lime-ink)] shadow-[0_2px_0_var(--coach-lime-shadow)] disabled:opacity-40"
          >
            <StepForward size={15} strokeWidth={2.4} aria-hidden /> Step
          </button>
          <button
            type="button"
            onClick={() => setRunning((r) => !r)}
            disabled={done}
            aria-pressed={running}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border-2 border-[var(--coach-border-strong)] px-3 text-[13.5px] font-semibold disabled:opacity-40"
          >
            {running ? <Pause size={15} aria-hidden /> : <Play size={15} aria-hidden />} {running ? "Pause" : "Run"}
          </button>
          <button
            type="button"
            onClick={reset}
            aria-label="Reset the program"
            className="inline-flex size-9 items-center justify-center rounded-full border-2 border-[var(--coach-border-strong)]"
          >
            <RotateCcw size={15} aria-hidden />
          </button>
        </span>
      </figcaption>

      <div className="grid gap-4 p-4 md:grid-cols-[minmax(0,1fr)_200px]">
        {/* Memory: 16 one-byte boxes. The next instruction (PC) is marked; a box just written is lime. */}
        <div className="overflow-x-auto">
          <table className={`w-full border-separate border-spacing-0 text-[13px] ${MONO}`}>
            <thead>
              <tr className="text-left text-[11.5px] text-[var(--coach-ink-muted)]">
                <th className="px-2 py-1 font-semibold">addr</th>
                <th className="px-2 py-1 font-semibold">bits</th>
                <th className="px-2 py-1 font-semibold">as instruction</th>
                <th className="px-2 py-1 text-right font-semibold">as number</th>
              </tr>
            </thead>
            <tbody>
              {machine.mem.map((byte, addr) => {
                const isPc = addr === machine.pc && !machine.halted;
                const wrote = last?.wrote === addr;
                return (
                  <tr
                    key={addr}
                    className={
                      wrote
                        ? "bg-[var(--coach-tint-lime-bg)]"
                        : isPc
                          ? "bg-[var(--coach-tint-blue-bg)]"
                          : byte === 0
                            ? "text-[var(--coach-ink-muted)]"
                            : ""
                    }
                  >
                    <td className="px-2 py-[3px]">
                      {addr}
                      {isPc ? (
                        <span className="ml-1 font-sans text-[11px] font-bold text-[var(--coach-tint-blue-ink)]">
                          PC
                        </span>
                      ) : null}
                    </td>
                    <td className="px-2 py-[3px] whitespace-nowrap">{byteBits(byte)}</td>
                    <td className="px-2 py-[3px] whitespace-nowrap">{decode(byte)}</td>
                    <td className="px-2 py-[3px] text-right">{byte}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Registers, flags and the display. */}
        <div className="flex flex-col gap-3">
          <dl className={`m-0 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-[13.5px] ${MONO}`}>
            <dt className="text-[var(--coach-ink-muted)]">PC</dt>
            <dd className="m-0 font-bold">{machine.pc}</dd>
            <dt className="text-[var(--coach-ink-muted)]">IR</dt>
            <dd className="m-0">{machine.steps > 0 ? decode(machine.ir) : "-"}</dd>
            <dt className="text-[var(--coach-ink-muted)]">A</dt>
            <dd className="m-0 font-bold">
              {machine.a} <span className="font-normal text-[var(--coach-ink-muted)]">{byteBits(machine.a)}</span>
            </dd>
            <dt className="text-[var(--coach-ink-muted)]">flags</dt>
            <dd className="m-0">
              <span className={machine.zero ? "font-bold" : "text-[var(--coach-ink-muted)]"}>
                Z={machine.zero ? 1 : 0}
              </span>{" "}
              <span className={machine.carry ? "font-bold" : "text-[var(--coach-ink-muted)]"}>
                C={machine.carry ? 1 : 0}
              </span>
            </dd>
          </dl>
          <div className="rounded-xl bg-[var(--coach-code-bg)] px-3 py-2 text-[var(--coach-code-ink)]">
            <span className="block text-[11px] text-[var(--coach-hero-muted)]">display</span>
            <span
              className={`${machine.out.length ? "text-[20px] font-bold" : "text-[13px] text-[var(--coach-hero-muted)]"} ${MONO}`}
            >
              {machine.out.length ? machine.out.join("  ") : "nothing yet"}
            </span>
          </div>
          <p className="m-0 text-[12px] text-[var(--coach-ink-muted)]">Steps: {machine.steps}</p>
        </div>
      </div>

      <p aria-live="polite" className="m-0 border-t-2 border-[var(--coach-border)] px-4 py-3 text-[14px] leading-snug">
        {last && !machine.halted ? <span className={`mr-1.5 font-bold ${MONO}`}>{last.instruction}:</span> : null}
        {status}
      </p>
    </figure>
  );
}
