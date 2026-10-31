"use client";

import { useId, useMemo, useState } from "react";
import { Check, FastForward, RotateCcw, StepForward, X } from "lucide-react";
import { runClocked } from "@/lib/gate-lab/model";

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
 * The Clock Lab: a circuit with clocked registers. "REG := expression" is a register's value after the
 * next tick; "NAME = expression" is a wire. Press Tick to step through the given inputs and watch each
 * register change only on the tick, checked against a target. JSON-string props (MDX drops expressions):
 * inputsJson, registersJson, startJson, targetJson, ticksJson, initJson, outputsJson.
 */
export function ClockLab({
  caption,
  inputsJson,
  registersJson,
  startJson,
  targetJson,
  ticksJson,
  initJson,
  outputsJson,
}: {
  caption?: string;
  inputsJson?: string;
  registersJson: string;
  startJson?: string;
  targetJson?: string;
  ticksJson: string;
  initJson?: string;
  outputsJson?: string;
}) {
  const inputs = useMemo(() => parseJson<string[]>(inputsJson, []), [inputsJson]);
  const registers = useMemo(() => parseJson<string[]>(registersJson, ["Q"]), [registersJson]);
  const target = useMemo(() => parseJson<string[] | undefined>(targetJson, undefined), [targetJson]);
  const ticks = useMemo(() => parseJson<Record<string, number>[]>(ticksJson, [{}]).slice(0, 16), [ticksJson]);
  const init = useMemo(() => parseJson<Record<string, number>>(initJson, {}), [initJson]);
  const watch = useMemo(() => parseJson<string[]>(outputsJson, []), [outputsJson]);
  const start = useMemo(
    () => parseJson<string[]>(startJson, registers.map((r) => `${r} := ${r}`)).join("\n"),
    [startJson, registers],
  );

  const editorId = useId();
  const [source, setSource] = useState(start);
  const [shown, setShown] = useState(0);
  const lines = useMemo(() => source.split("\n"), [source]);

  const result = useMemo(() => {
    try {
      return runClocked({ inputs, registers, init, lines, ticks, target, watch });
    } catch (e) {
      return { ok: false as const, line: 0, message: e instanceof Error ? e.message : "This lab is set up wrongly." };
    }
  }, [inputs, registers, init, lines, ticks, target, watch]);

  const cols = [...registers, ...watch];
  const visible = result.ok ? result.rows.slice(0, shown) : [];
  const current = visible.length ? visible[visible.length - 1].after : Object.fromEntries(registers.map((r) => [r, init[r] ?? 0]));
  const allShown = shown >= ticks.length;
  const matching = visible.filter((r) => r.ok).length;

  const status = !result.ok
    ? { tone: "error", text: `Line ${result.line}: ${result.message}.` }
    : shown === 0
      ? { tone: "info", text: "Ready. Before each Tick, predict every register's next value." }
      : !target
        ? { tone: "info", text: `After tick ${shown}.` }
        : allShown && result.solved
          ? { tone: "good", text: `Solved: every tick matches, with ${result.gates.total} ${result.gates.total === 1 ? "gate" : "gates"}.` }
          : { tone: matching === visible.length ? "info" : "error", text: `${matching} of ${visible.length} ticks match so far.` };

  return (
    <figure className="not-prose my-6 overflow-hidden rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] text-[var(--coach-ink)]">
      <figcaption className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[var(--coach-border)] px-4 py-3">
        <span className="text-[15px] font-bold">{caption ?? "The Clock Lab"}</span>
        <span className="flex gap-2">
          <button
            type="button"
            onClick={() => setShown((n) => Math.min(ticks.length, n + 1))}
            disabled={!result.ok || allShown}
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[var(--coach-lime)] px-3.5 text-[13.5px] font-bold text-[var(--coach-lime-ink)] shadow-[0_2px_0_var(--coach-lime-shadow)] disabled:opacity-40"
          >
            <StepForward size={15} strokeWidth={2.4} aria-hidden /> Tick
          </button>
          <button
            type="button"
            onClick={() => setShown(ticks.length)}
            disabled={!result.ok || allShown}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border-2 border-[var(--coach-border-strong)] px-3 text-[13.5px] font-semibold disabled:opacity-40"
          >
            <FastForward size={15} aria-hidden /> All ticks
          </button>
          <button
            type="button"
            onClick={() => {
              setShown(0);
              setSource(start);
            }}
            aria-label="Reset the circuit and the clock"
            className="inline-flex size-9 items-center justify-center rounded-full border-2 border-[var(--coach-border-strong)]"
          >
            <RotateCcw size={15} aria-hidden />
          </button>
        </span>
      </figcaption>

      <div className="grid gap-4 p-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={editorId} className="text-[12.5px] font-semibold text-[var(--coach-ink-secondary)]">
            Your circuit: REG := next value, NAME = wire
          </label>
          <textarea
            id={editorId}
            value={source}
            onChange={(e) => {
              setSource(e.target.value);
              setShown(0);
            }}
            spellCheck={false}
            rows={Math.max(3, lines.length + 1)}
            className={`w-full resize-y rounded-xl border-2 border-[var(--coach-border)] bg-[var(--coach-code-bg)] p-3 text-[13.5px] leading-relaxed text-[var(--coach-code-ink)] outline-none focus-visible:border-[var(--coach-focus)] ${MONO}`}
          />
          <p className="m-0 text-[12px] leading-snug text-[var(--coach-ink-muted)]">
            {inputs.length > 0 && (
              <>
                Inputs: <span className={MONO}>{inputs.join(", ")}</span>.{" "}
              </>
            )}
            Registers: <span className={MONO}>{registers.join(", ")}</span>, each changing only on a tick. Editing
            restarts the clock.
          </p>
          <dl className={`m-0 mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[14px] ${MONO}`}>
            {registers.map((r) => (
              <div key={r} className="flex gap-1.5">
                <dt className="text-[var(--coach-ink-muted)]">{r}</dt>
                <dd className="m-0 font-bold">{current[r]}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="overflow-x-auto">
          <table className={`w-full border-separate border-spacing-0 text-center text-[13px] ${MONO}`}>
            <caption className="sr-only">Timeline, one row per tick</caption>
            <thead>
              <tr className="text-[12px] text-[var(--coach-ink-muted)]">
                <th scope="col" className="px-1.5 py-1 font-semibold">tick</th>
                {inputs.map((n) => (
                  <th key={n} scope="col" className="px-1.5 py-1 font-semibold">
                    {n}
                  </th>
                ))}
                {cols.map((n) => (
                  <th key={n} scope="col" className="border-l-2 border-[var(--coach-border)] px-1.5 py-1 font-bold text-[var(--coach-ink)]">
                    {n}
                  </th>
                ))}
                {target && (
                  <th scope="col">
                    <span className="sr-only">Matches the target</span>
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {ticks.map((t, i) => {
                const row = visible[i];
                return (
                  <tr key={i} className={row && target && !row.ok ? "bg-[var(--coach-wrong-soft)]" : ""}>
                    <td className="px-1.5 py-[3px] text-[var(--coach-ink-muted)]">{i + 1}</td>
                    {inputs.map((n) => (
                      <td key={n} className="px-1.5 py-[3px] text-[var(--coach-ink-secondary)]">
                        {t[n] ?? 0}
                      </td>
                    ))}
                    {cols.map((n) => (
                      <td key={n} className="border-l-2 border-[var(--coach-border)] px-1.5 py-[3px] font-bold">
                        {row ? row.after[n] : <span className="font-normal text-[var(--coach-ink-muted)]">?</span>}
                        {row?.want && row.want[n] !== row.after[n] ? (
                          <span className="ml-1 text-[11px] font-normal text-[var(--coach-ink-muted)]">want {row.want[n]}</span>
                        ) : null}
                      </td>
                    ))}
                    {target && (
                      <td className="px-1.5 py-[3px]">
                        {row ? (
                          row.ok ? (
                            <Check size={14} strokeWidth={3} className="inline" aria-label="matches" />
                          ) : (
                            <X size={14} strokeWidth={3} className="inline text-[var(--coach-wrong-title)]" aria-label="doesn't match" />
                          )
                        ) : null}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="m-0 mt-1 text-[11.5px] text-[var(--coach-ink-muted)]">Each row shows the registers after that tick.</p>
        </div>
      </div>

      <p
        aria-live="polite"
        className={`m-0 border-t-2 border-[var(--coach-border)] px-4 py-3 text-[14px] leading-snug ${
          status.tone === "good" ? "bg-[var(--coach-tint-lime-bg)] font-semibold" : status.tone === "error" ? "bg-[var(--coach-wrong-soft)]" : ""
        }`}
      >
        {status.text}
      </p>
    </figure>
  );
}
