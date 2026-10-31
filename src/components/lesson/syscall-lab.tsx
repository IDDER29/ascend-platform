"use client";

import { useId, useMemo, useState } from "react";
import { FastForward, RotateCcw, StepForward } from "lucide-react";
import { runSyscalls, syscallGoalMisses, type Layer, type SyscallGoal } from "@/lib/syscall/model";

const MONO = "font-[family-name:var(--font-plex-mono)]";

const LAYER_NAME: Record<Layer, string> = { app: "App", hardware: "CPU", kernel: "Kernel", device: "Device" };
const LAYER_TINT: Record<Layer, string> = {
  app: "bg-[var(--coach-tint-blue-bg)] text-[var(--coach-tint-blue-ink)]",
  hardware: "bg-[var(--coach-tint-neutral-bg)] text-[var(--coach-ink-secondary)]",
  kernel: "bg-[var(--coach-tint-orange-bg)] text-[var(--coach-tint-orange-strong)]",
  device: "bg-[var(--coach-tint-lime-bg)] text-[var(--coach-tint-lime-ink)]",
};

function parseJson<T>(text: string | undefined, fallback: T): T {
  if (!text) return fallback;
  try {
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

/**
 * The System-Call Lab: a program asks a teaching OS for services, and each call is traced step by step
 * across the app, the CPU's mode switch, the kernel and the devices (model: src/lib/syscall/model.ts).
 * JSON-string props: startJson (program lines), diskJson ('{"log.txt":"a"}', files already on disk),
 * goalJson ('{"screen":"hi","disk":{"a.txt":"ok"},"exit":0,"notKilled":true}'). With `editable`, the
 * learner changes the program.
 */
export function SyscallLab({
  caption,
  startJson,
  diskJson,
  goalJson,
  editable = false,
}: {
  caption?: string;
  startJson: string;
  diskJson?: string;
  goalJson?: string;
  editable?: boolean;
}) {
  const start = useMemo(() => parseJson<string[]>(startJson, []).join("\n"), [startJson]);
  const disk = useMemo(() => parseJson<Record<string, string>>(diskJson, {}), [diskJson]);
  const goal = useMemo(() => parseJson<SyscallGoal | null>(goalJson, null), [goalJson]);
  const editorId = useId();
  const [source, setSource] = useState(start);
  const [shown, setShown] = useState(0);

  const result = useMemo(() => runSyscalls(source, { disk }), [source, disk]);
  const trace = result.ok ? result.trace : [];
  const count = Math.min(shown, trace.length);
  const done = result.ok && count === trace.length;
  const misses = goal && result.ok && done ? syscallGoalMisses(result.state, goal) : [];
  const mode = count === 0 ? "user" : trace[count - 1].mode;
  const currentLine = count === 0 || done ? null : trace[count - 1].line;
  const now = count === 0 ? { screen: "", cache: {}, disk } : trace[count - 1].after;

  const lines = source.split("\n");
  const btn =
    "inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[13.5px] font-bold disabled:opacity-40";

  return (
    <figure className="not-prose my-6 overflow-hidden rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] text-[var(--coach-ink)]">
      <figcaption className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[var(--coach-border)] px-4 py-3">
        <span className="text-[15px] font-bold">{caption ?? "A program and its operating system"}</span>
        <span className="flex gap-2">
          <button
            type="button"
            disabled={!result.ok || done}
            onClick={() => setShown(count + 1)}
            className={`${btn} bg-[var(--coach-lime)] text-[var(--coach-lime-ink)] shadow-[0_2px_0_var(--coach-lime-shadow)]`}
          >
            <StepForward size={15} strokeWidth={2.4} aria-hidden /> Step
          </button>
          <button
            type="button"
            disabled={!result.ok || done}
            onClick={() => setShown(trace.length)}
            className={`${btn} border-2 border-[var(--coach-border-strong)]`}
          >
            <FastForward size={15} strokeWidth={2.4} aria-hidden /> To the end
          </button>
          <button
            type="button"
            onClick={() => {
              setShown(0);
              if (editable) setSource(start);
            }}
            aria-label={editable ? "Reset the program and the trace" : "Start the trace again"}
            className="inline-flex size-9 items-center justify-center rounded-full border-2 border-[var(--coach-border-strong)]"
          >
            <RotateCcw size={15} aria-hidden />
          </button>
        </span>
      </figcaption>

      <div className="grid gap-4 p-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <div className="flex min-w-0 flex-col gap-2">
          {editable ? (
            <>
              <label htmlFor={editorId} className="text-[12.5px] font-semibold text-[var(--coach-ink-secondary)]">
                The program, one call per line
              </label>
              <textarea
                id={editorId}
                value={source}
                onChange={(e) => {
                  setSource(e.target.value);
                  setShown(0);
                }}
                spellCheck={false}
                rows={Math.max(5, lines.length + 1)}
                className={`w-full resize-y rounded-xl border-2 border-[var(--coach-border)] bg-[var(--coach-code-bg)] p-3 text-[13px] leading-relaxed text-[var(--coach-code-ink)] outline-none focus-visible:border-[var(--coach-focus)] ${MONO}`}
              />
              <p className="m-0 text-[12px] leading-snug text-[var(--coach-ink-muted)]">
                <span className={MONO}>open &quot;a.txt&quot;</span>, <span className={MONO}>write 1 &quot;hi&quot;</span>,{" "}
                <span className={MONO}>write 3 &quot;ok&quot;</span>, <span className={MONO}>read 3</span>,{" "}
                <span className={MONO}>close 3</span>, <span className={MONO}>sync</span>, <span className={MONO}>exit 0</span>,{" "}
                <span className={MONO}>compute ...</span>. File descriptor 1 is the screen; files get 3, 4 and on.
              </p>
            </>
          ) : (
            <ol className={`m-0 flex list-none flex-col gap-0.5 rounded-xl bg-[var(--coach-code-bg)] p-3 text-[13px] text-[var(--coach-code-ink)] ${MONO}`}>
              {lines.map((l, i) => (
                <li
                  key={i}
                  className={`rounded px-1.5 ${currentLine === i + 1 ? "bg-[var(--coach-lime)] text-[var(--coach-lime-ink)]" : ""}`}
                >
                  <span className="mr-2 inline-block w-4 text-right opacity-60">{i + 1}</span>
                  {l || " "}
                </li>
              ))}
            </ol>
          )}

          <div
            className={`flex items-center justify-between rounded-xl px-3 py-2 text-[13.5px] font-bold ${
              mode === "kernel" ? LAYER_TINT.kernel : LAYER_TINT.app
            }`}
          >
            <span>CPU mode</span>
            <span className={MONO}>{mode === "kernel" ? "kernel mode" : "user mode"}</span>
          </div>

          {result.ok && (
            <dl className={`m-0 flex flex-col gap-1.5 text-[13px] ${MONO}`}>
              <div className="rounded-xl bg-[var(--coach-code-bg)] px-3 py-2 text-[var(--coach-code-ink)]">
                <dt className="text-[11px] text-[var(--coach-hero-muted)]">screen</dt>
                <dd className="m-0 min-h-[1.4em] text-[16px] font-bold">{now.screen}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-[86px] shrink-0 text-[var(--coach-ink-muted)]">RAM cache</dt>
                <dd className="m-0">{fileList(now.cache)}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-[86px] shrink-0 text-[var(--coach-ink-muted)]">on the disk</dt>
                <dd className="m-0">{fileList(now.disk)}</dd>
              </div>
            </dl>
          )}
        </div>

        <div className="min-w-0">
          <p className="m-0 mb-1.5 text-[13px] font-bold">
            Trace {result.ok ? `(${count} of ${trace.length} steps)` : ""}
          </p>
          {!result.ok ? (
            <p className="m-0 text-[13px] text-[var(--coach-ink-muted)]">Fix the program to trace it.</p>
          ) : count === 0 ? (
            <p className="m-0 text-[13px] text-[var(--coach-ink-muted)]">Press Step to follow the program one step at a time.</p>
          ) : (
            <ol className="m-0 flex max-h-[360px] list-none flex-col gap-1 overflow-y-auto p-0">
              {trace.slice(0, count).map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-[13.5px] leading-snug">
                  <span className={`mt-[1px] w-[58px] shrink-0 rounded-md px-1.5 py-0.5 text-center text-[11.5px] font-bold ${LAYER_TINT[t.layer]}`}>
                    {LAYER_NAME[t.layer]}
                  </span>
                  <span>
                    <span className={`mr-1.5 text-[11.5px] text-[var(--coach-ink-muted)] ${MONO}`}>line {t.line}</span>
                    {t.text}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>

      <p
        aria-live="polite"
        className={`m-0 border-t-2 border-[var(--coach-border)] px-4 py-3 text-[14px] leading-snug ${
          !result.ok
            ? "bg-[var(--coach-wrong-soft)]"
            : done && goal && misses.length === 0
              ? "bg-[var(--coach-tint-lime-bg)] font-semibold"
              : done && (misses.length > 0 || result.state.killed)
                ? "bg-[var(--coach-wrong-soft)]"
                : ""
        }`}
      >
        {!result.ok
          ? `Line ${result.error.line}: ${result.error.message}.`
          : !done
            ? "Step through to the end to see what the program did."
            : goal
              ? misses.length === 0
                ? "The goal is met."
                : `Not yet: ${misses.join("; ")}.`
              : result.state.killed
                ? `The kernel stopped the program (${result.state.killed}).`
                : result.state.exitCode !== null
                  ? `The program exited with code ${result.state.exitCode}.`
                  : "The program ran to its last line."}
      </p>
    </figure>
  );
}

function fileList(files: Record<string, string>): string {
  const names = Object.keys(files);
  return names.length === 0 ? "nothing" : names.map((n) => `${n}: "${files[n]}"`).join(", ");
}
