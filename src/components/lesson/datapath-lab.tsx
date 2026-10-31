"use client";

import { useMemo, useState } from "react";
import { RotateCcw, StepForward } from "lucide-react";
import {
  OUT_SIGNALS,
  SIGNALS,
  SIGNAL_MEANING,
  alu,
  bootDatapath,
  tickDatapath,
  type Datapath,
  type Signal,
} from "@/lib/datapath/model";
import { assemble, byteBits, decode } from "@/lib/tiny-cpu/machine";

const MONO = "font-[family-name:var(--font-plex-mono)]";
const IN_GROUP: Signal[] = ["MI", "RI", "II", "AI", "BI", "OI", "J"];
const OTHER_GROUP: Signal[] = ["CE", "SU", "FI", "HLT"];

type Goal = { A?: number; B?: number; PC?: number; MAR?: number; IR?: number; mem?: Record<string, number>; out?: number[] };

function parseJson<T>(text: string | undefined, fallback: T): T {
  if (!text) return fallback;
  try {
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

function goalReached(d: Datapath, goal: Goal): boolean {
  if (goal.A !== undefined && d.a !== goal.A) return false;
  if (goal.B !== undefined && d.b !== goal.B) return false;
  if (goal.PC !== undefined && d.pc !== goal.PC) return false;
  if (goal.MAR !== undefined && d.mar !== goal.MAR) return false;
  if (goal.IR !== undefined && d.ir !== goal.IR) return false;
  if (goal.mem && Object.entries(goal.mem).some(([a, v]) => d.mem[Number(a)] !== v)) return false;
  if (goal.out && JSON.stringify(d.out) !== JSON.stringify(goal.out)) return false;
  return true;
}

/**
 * The tiny CPU's datapath, driven by hand: switch control signals on for this step, then Tick. One "out"
 * signal puts a value on the bus and every "in" signal loads it. JSON-string props: programJson,
 * dataJson, goalJson ('{"A":28}', '{"mem":{"13":42}}', '{"out":[42]}').
 */
export function DatapathLab({
  caption,
  programJson,
  dataJson,
  goalJson,
}: {
  caption?: string;
  programJson: string;
  dataJson?: string;
  goalJson?: string;
}) {
  const start = useMemo(() => {
    try {
      return { mem: assemble(JSON.parse(programJson), dataJson ? JSON.parse(dataJson) : {}), error: null };
    } catch (e) {
      return { mem: null, error: e instanceof Error ? e.message : "This program can't load." };
    }
  }, [programJson, dataJson]);
  const goal = useMemo(() => parseJson<Goal | undefined>(goalJson, undefined), [goalJson]);

  const [d, setD] = useState<Datapath | null>(start.mem ? bootDatapath(start.mem) : null);
  const [on, setOn] = useState<Set<Signal>>(new Set());
  const [log, setLog] = useState<{ signals: Signal[]; bus: number | null }[]>([]);
  const [error, setError] = useState<string | null>(null);

  if (!d) {
    return (
      <div className="not-prose my-6 rounded-2xl border-2 border-[var(--coach-wrong-border)] bg-[var(--coach-wrong-soft)] p-4 text-[14px]">
        Datapath: {start.error}
      </div>
    );
  }

  const outs = OUT_SIGNALS.filter((s) => on.has(s));
  const result = alu(d, on.has("SU"));
  const busPreview =
    outs.length !== 1
      ? null
      : outs[0] === "CO"
        ? d.pc
        : outs[0] === "RO"
          ? d.mem[d.mar]
          : outs[0] === "IO"
            ? d.ir & 0xf
            : outs[0] === "AO"
              ? d.a
              : result.value;
  const reached = goal ? goalReached(d, goal) : false;

  function toggle(s: Signal) {
    setOn((cur) => {
      const next = new Set(cur);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  }

  function tick() {
    if (!d || d.halted) return;
    const signals = SIGNALS.filter((s) => on.has(s));
    const r = tickDatapath(d, signals);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    setError(null);
    setD(r.d);
    setLog((l) => [...l, { signals, bus: r.bus }]);
    setOn(new Set());
  }

  const button = (s: Signal) => (
    <button
      key={s}
      type="button"
      aria-pressed={on.has(s)}
      title={SIGNAL_MEANING[s]}
      onClick={() => toggle(s)}
      className={`h-9 min-w-[44px] rounded-lg px-2 text-[13px] font-bold ${MONO} ${
        on.has(s)
          ? "bg-[var(--coach-ink)] text-[var(--coach-surface)]"
          : "border-2 border-[var(--coach-border)] text-[var(--coach-ink-secondary)]"
      }`}
    >
      {s}
    </button>
  );

  const reg = (name: string, value: number, note?: string) => (
    <div className="flex items-baseline gap-2">
      <dt className="w-10 text-[var(--coach-ink-muted)]">{name}</dt>
      <dd className="m-0 font-bold">
        {value}
        <span className="ml-2 font-normal text-[var(--coach-ink-muted)]">{note ?? byteBits(value)}</span>
      </dd>
    </div>
  );

  return (
    <figure className="not-prose my-6 overflow-hidden rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] text-[var(--coach-ink)]">
      <figcaption className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[var(--coach-border)] px-4 py-3">
        <span className="text-[15px] font-bold">{caption ?? "The datapath"}</span>
        <span className="flex gap-2">
          <button
            type="button"
            onClick={tick}
            disabled={d.halted}
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[var(--coach-lime)] px-3.5 text-[13.5px] font-bold text-[var(--coach-lime-ink)] shadow-[0_2px_0_var(--coach-lime-shadow)] disabled:opacity-40"
          >
            <StepForward size={15} strokeWidth={2.4} aria-hidden /> Tick
          </button>
          <button
            type="button"
            onClick={() => {
              setD(start.mem ? bootDatapath(start.mem) : null);
              setOn(new Set());
              setLog([]);
              setError(null);
            }}
            aria-label="Reset the datapath"
            className="inline-flex size-9 items-center justify-center rounded-full border-2 border-[var(--coach-border-strong)]"
          >
            <RotateCcw size={15} aria-hidden />
          </button>
        </span>
      </figcaption>

      {/* The control signals for this tick. Hover or focus one to see what it does. */}
      <div className="flex flex-col gap-2 border-b-2 border-[var(--coach-border)] p-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="w-[86px] text-[12px] font-semibold text-[var(--coach-ink-muted)]">onto the bus</span>
          {OUT_SIGNALS.map(button)}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="w-[86px] text-[12px] font-semibold text-[var(--coach-ink-muted)]">off the bus</span>
          {IN_GROUP.map(button)}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="w-[86px] text-[12px] font-semibold text-[var(--coach-ink-muted)]">other</span>
          {OTHER_GROUP.map(button)}
        </div>
        <p className={`m-0 text-[13px] ${MONO}`}>
          bus this tick:{" "}
          <b>
            {outs.length > 1 ? "two values at once!" : busPreview === null ? "nothing" : `${busPreview} (${byteBits(busPreview)})`}
          </b>
        </p>
      </div>

      <div className="grid gap-4 p-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <dl className={`m-0 flex flex-col gap-1 text-[13.5px] ${MONO}`}>
          {reg("PC", d.pc, `next instruction at box ${d.pc}`)}
          {reg("MAR", d.mar, `points at box ${d.mar}`)}
          {reg("IR", d.ir, d.ticks > 0 ? decode(d.ir) : "-")}
          {reg("A", d.a)}
          {reg("B", d.b)}
          {reg("ALU", result.value, on.has("SU") ? "A - B, right now" : "A + B, right now")}
          <div className="flex items-baseline gap-2">
            <dt className="w-10 text-[var(--coach-ink-muted)]">flags</dt>
            <dd className="m-0">
              C={d.carry ? 1 : 0} Z={d.zero ? 1 : 0}
            </dd>
          </div>
          <div className="mt-1 rounded-xl bg-[var(--coach-code-bg)] px-3 py-2 text-[var(--coach-code-ink)]">
            <span className="block text-[11px] text-[var(--coach-hero-muted)]">display</span>
            <span className="text-[17px] font-bold">{d.out.length ? d.out.join("  ") : "nothing yet"}</span>
          </div>
        </dl>

        <div className="overflow-x-auto">
          <table className={`w-full border-separate border-spacing-0 text-[12.5px] ${MONO}`}>
            <caption className="sr-only">Memory</caption>
            <tbody>
              {d.mem.map((byte, addr) => (
                <tr
                  key={addr}
                  className={addr === d.mar ? "bg-[var(--coach-tint-blue-bg)]" : byte === 0 ? "text-[var(--coach-ink-muted)]" : ""}
                >
                  <td className="px-1.5 py-[1px]">
                    {addr}
                    {addr === d.mar ? <span className="ml-1 font-sans text-[10.5px] font-bold">MAR</span> : null}
                  </td>
                  <td className="px-1.5 py-[1px] whitespace-nowrap">{byteBits(byte)}</td>
                  <td className="px-1.5 py-[1px] whitespace-nowrap">{decode(byte)}</td>
                  <td className="px-1.5 py-[1px] text-right">{byte}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {log.length > 0 && (
        <ol className={`m-0 flex max-h-[140px] list-none flex-col gap-0.5 overflow-y-auto border-t-2 border-[var(--coach-border)] px-4 py-3 text-[12.5px] ${MONO}`}>
          {log.map((e, i) => (
            <li key={i}>
              tick {i + 1}: {e.signals.length ? e.signals.join(" ") : "(no signals)"}
              {e.bus !== null ? `, bus = ${e.bus}` : ""}
            </li>
          ))}
        </ol>
      )}

      <p
        aria-live="polite"
        className={`m-0 border-t-2 border-[var(--coach-border)] px-4 py-3 text-[14px] leading-snug ${
          error ? "bg-[var(--coach-wrong-soft)]" : reached ? "bg-[var(--coach-tint-lime-bg)] font-semibold" : ""
        }`}
      >
        {error
          ? `Nothing changed: ${error}.`
          : reached
            ? `Goal reached in ${d.ticks} ${d.ticks === 1 ? "tick" : "ticks"}.`
            : d.halted
              ? "Halted."
              : "Switch on the signals for this step, then Tick. The fetch is always CO MI, then RO II CE."}
      </p>
    </figure>
  );
}
