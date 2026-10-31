"use client";

import { useEffect, useMemo, useState } from "react";
import { Pause, Play, RotateCcw, StepForward } from "lucide-react";
import {
  CODE_END,
  MAX_STEPS,
  STACK_BOTTOM,
  STACK_TOP,
  assemble,
  boot,
  decode,
  step,
  type Machine,
} from "@/lib/tiny-cpu/v2";

const MONO = "font-[family-name:var(--font-plex-mono)]";
const RUN_MS = 450;
const hex = (n: number) => n.toString(16).toUpperCase().padStart(2, "0");

/** Which part of memory an address is in, by convention: code, data, stack or scratch. */
function region(addr: number): "code" | "data" | "stack" | "scratch" {
  if (addr <= CODE_END + 1) return "code";
  if (addr < STACK_BOTTOM) return "data";
  if (addr < STACK_TOP) return "stack";
  return "scratch";
}

const REGION_BG: Record<ReturnType<typeof region>, string> = {
  code: "bg-[var(--coach-tint-blue-bg)]",
  data: "bg-[var(--coach-surface)]",
  stack: "bg-[var(--coach-tint-orange-bg)]",
  scratch: "bg-[var(--coach-tint-neutral-bg)]",
};

/**
 * The tiny CPU, version 2, live in a lesson: four registers, a stack, CALL/RET and IN/OUT over 256 bytes.
 * Pass JSON strings (MDX drops expression props):
 * programJson='["LDI R0, 2","loop: DEC R0","JNZ loop","HALT"]' dataJson='{"128":3}' inputJson='[5]'.
 */
export function TinyCpu2({
  caption,
  programJson,
  dataJson,
  inputJson,
}: {
  caption?: string;
  programJson: string;
  dataJson?: string;
  inputJson?: string;
}) {
  const start = useMemo(() => {
    try {
      const program: string[] = JSON.parse(programJson);
      const mem = assemble(program, dataJson ? JSON.parse(dataJson) : {});
      const input: number[] = inputJson ? JSON.parse(inputJson) : [];
      return { machine: boot(mem, input), lines: program.length, error: null };
    } catch (e) {
      return { machine: null, lines: 0, error: e instanceof Error ? e.message : "This program can't run." };
    }
  }, [programJson, dataJson, inputJson]);

  const [machine, setMachine] = useState<Machine | null>(start.machine);
  const [status, setStatus] = useState<{ text: string; tone: "info" | "stop" } | null>(null);
  const [wrote, setWrote] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const [stopped, setStopped] = useState(false);

  const done = !machine || machine.halted || stopped || machine.steps >= MAX_STEPS;

  function stepOnce() {
    if (!machine || done) return;
    const r = step(machine);
    if (r.kind === "ok") {
      setMachine(r.machine);
      setWrote(r.wrote ?? null);
      setStatus({ text: r.text, tone: "info" });
    } else if (r.kind === "fault") {
      setStopped(true);
      setRunning(false);
      setStatus({ text: `${r.fault}: ${r.text}`, tone: "stop" });
    } else if (r.kind === "blocked") {
      setRunning(false);
      setStatus({ text: r.text, tone: "stop" });
    }
  }

  function reset() {
    setRunning(false);
    setStopped(false);
    setWrote(null);
    setStatus(null);
    setMachine(start.machine);
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

  const program = Array.from({ length: start.lines }, (_, i) => i * 2).map((at) => {
    const d = decode(machine.mem[at], machine.mem[at + 1]);
    return { at, text: d.ok ? d.d.text : "??" };
  });
  const line =
    machine.halted
      ? "Halted."
      : machine.steps >= MAX_STEPS
        ? `Stopped after ${MAX_STEPS} steps: this program may loop forever.`
        : (status?.text ?? "Ready. Before each Step, predict what will change.");

  return (
    <figure className="not-prose my-6 overflow-hidden rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] text-[var(--coach-ink)]">
      <figcaption className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[var(--coach-border)] px-4 py-3">
        <span className="text-[15px] font-bold">{caption ?? "The tiny CPU, version 2"}</span>
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

      <div className="grid gap-4 p-4 sm:grid-cols-[minmax(0,1fr)_170px]">
        {/* The program, with the next instruction marked. */}
        <ol aria-label="Program" className={`m-0 list-none p-0 text-[13px] ${MONO}`}>
          {program.map((p) => {
            const isPc = p.at === machine.pc && !machine.halted;
            return (
              <li
                key={p.at}
                className={`flex gap-2 rounded-md px-1.5 py-[2px] ${isPc ? "bg-[var(--coach-tint-blue-bg)] font-bold" : ""}`}
              >
                <span className="text-[var(--coach-ink-muted)]">{hex(p.at)}</span>
                <span className="whitespace-nowrap">{p.text}</span>
              </li>
            );
          })}
        </ol>

        {/* Registers, flag, output and input. */}
        <div className="flex flex-col gap-3">
          <dl className={`m-0 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-[13.5px] ${MONO}`}>
            {machine.r.map((v, i) => (
              <div key={i} className="contents">
                <dt className="text-[var(--coach-ink-muted)]">R{i}</dt>
                <dd className="m-0 font-bold">{v}</dd>
              </div>
            ))}
            <dt className="text-[var(--coach-ink-muted)]">PC</dt>
            <dd className="m-0">{hex(machine.pc)}</dd>
            <dt className="text-[var(--coach-ink-muted)]">SP</dt>
            <dd className="m-0">{hex(machine.sp)}</dd>
            <dt className="text-[var(--coach-ink-muted)]">Z</dt>
            <dd className={`m-0 ${machine.z ? "font-bold" : "text-[var(--coach-ink-muted)]"}`}>{machine.z ? 1 : 0}</dd>
          </dl>
          <div className="rounded-xl bg-[var(--coach-code-bg)] px-3 py-2 text-[var(--coach-code-ink)]">
            <span className="block text-[11px] text-[var(--coach-hero-muted)]">output</span>
            <span className={`${machine.out.length ? "text-[17px] font-bold" : "text-[13px] text-[var(--coach-hero-muted)]"} ${MONO}`}>
              {machine.out.length ? machine.out.join("  ") : "nothing yet"}
            </span>
          </div>
          {(machine.input.length > 0 || inputJson) && (
            <p className={`m-0 text-[12.5px] text-[var(--coach-ink-secondary)] ${MONO}`}>
              input waiting: {machine.input.length ? machine.input.join(", ") : "none"}
            </p>
          )}
          <p className="m-0 text-[12px] text-[var(--coach-ink-muted)]">Steps: {machine.steps}</p>
        </div>
        {/* Memory: 16 rows of 16 bytes, shaded by region; the bytes at PC and a byte just written stand out. */}
        <div className="overflow-x-auto sm:col-span-2">
          <table aria-label="Memory" className={`w-full border-separate border-spacing-[2px] text-[11px] ${MONO}`}>
            <tbody>
              {Array.from({ length: 16 }, (_, row) => (
                <tr key={row}>
                  <th scope="row" className="pr-1 text-right font-normal text-[var(--coach-ink-muted)]">
                    {hex(row * 16)}
                  </th>
                  {Array.from({ length: 16 }, (_, col) => {
                    const addr = row * 16 + col;
                    const atPc = !machine.halted && (addr === machine.pc || addr === machine.pc + 1);
                    const isSp = addr === machine.sp && machine.sp < STACK_TOP;
                    const cls =
                      wrote === addr
                        ? "bg-[var(--coach-lime)] text-[var(--coach-lime-ink)] font-bold"
                        : atPc
                          ? "outline outline-2 outline-[var(--coach-ink)]"
                          : isSp
                            ? "font-bold"
                            : "";
                    return (
                      <td
                        key={col}
                        title={`${hex(addr)}: ${machine.mem[addr]}`}
                        className={`rounded px-[3px] py-[1px] text-center ${wrote === addr ? "" : REGION_BG[region(addr)]} ${machine.mem[addr] === 0 && wrote !== addr ? "text-[var(--coach-ink-muted)]" : ""} ${cls}`}
                      >
                        {hex(machine.mem[addr])}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="m-0 mt-1.5 flex flex-wrap gap-x-3 text-[11.5px] text-[var(--coach-ink-muted)]">
            <span>
              <span aria-hidden className={`mr-1 inline-block size-2.5 rounded-sm ${REGION_BG.code}`} />
              code 00 to 7F
            </span>
            <span>
              <span aria-hidden className="mr-1 inline-block size-2.5 rounded-sm border border-[var(--coach-border)]" />
              data 80 to BF
            </span>
            <span>
              <span aria-hidden className={`mr-1 inline-block size-2.5 rounded-sm ${REGION_BG.stack}`} />
              stack C0 to EF
            </span>
          </p>
        </div>

      </div>

      <p
        aria-live="polite"
        className={`m-0 border-t-2 border-[var(--coach-border)] px-4 py-3 text-[14px] leading-snug ${
          status?.tone === "stop" && !machine.halted ? "bg-[var(--coach-wrong-soft)]" : ""
        }`}
      >
        {line}
      </p>
    </figure>
  );
}
