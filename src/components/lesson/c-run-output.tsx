"use client";

import { useState } from "react";
import { Check, Copy, Play } from "lucide-react";
import type { ProgramRun } from "@/lib/programs/hash";

const MONO = "font-[family-name:var(--font-plex-mono)]";

const SIGNAL_NAME: Record<string, string> = {
  SIGSEGV: "a segmentation fault (SIGSEGV)",
  SIGABRT: "an abort (SIGABRT)",
  SIGFPE: "an arithmetic error (SIGFPE)",
  SIGKILL: "SIGKILL",
};

/** The commands and what happened, optionally hidden until the learner asks to run it. */
export function CRunOutput({ run, predict }: { run: ProgramRun; predict: boolean }) {
  const [shown, setShown] = useState(!predict);
  const term = `m-0 max-h-[360px] overflow-auto rounded-xl bg-[var(--coach-code-bg)] p-3 text-[13px] leading-relaxed text-[var(--coach-code-ink)] ${MONO}`;

  if (!shown) {
    return (
      <div className="flex flex-wrap items-center gap-3 rounded-xl bg-[var(--coach-tint-neutral-bg)] px-3 py-2.5">
        <p className="m-0 flex-1 text-[13.5px]">Predict what it prints, then run it.</p>
        <button
          type="button"
          onClick={() => setShown(true)}
          className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[var(--coach-lime)] px-3.5 text-[13.5px] font-bold text-[var(--coach-lime-ink)] shadow-[0_2px_0_var(--coach-lime-shadow)]"
        >
          <Play size={14} strokeWidth={2.6} aria-hidden /> Run it
        </button>
      </div>
    );
  }

  const status = !run.compile.ok
    ? "It didn't compile, so there's no program to run."
    : run.run?.timedOut
      ? "The program never finished: it was stopped after 3 seconds."
      : run.run?.signal
      ? `The program was stopped by ${SIGNAL_NAME[run.run.signal] ?? run.run.signal}.`
      : run.run && run.run.exitCode !== 0
        ? `The program exited with status ${run.run.exitCode}.`
        : null;

  return (
    <div aria-live="polite" className="flex min-w-0 flex-col gap-1.5">
      <pre className={term}>
        <span className="opacity-60">$ </span>
        {run.compileCommand}
        {run.compile.stderr ? `\n${run.compile.stderr.replace(/\n$/, "")}` : ""}
        {run.compile.ok && run.run && (
          <>
            {"\n"}
            <span className="opacity-60">$ </span>
            {run.runCommand}
            {run.run.stdout ? `\n${run.run.stdout.replace(/\n$/, "")}` : ""}
            {run.run.stderr ? `\n${run.run.stderr.replace(/\n$/, "")}` : ""}
          </>
        )}
      </pre>
      {status && <p className="m-0 text-[13px] font-semibold">{status}</p>}
    </div>
  );
}

export function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => {
        navigator.clipboard?.writeText(text).then(
          () => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          },
          () => {},
        );
      }}
      className="inline-flex h-8 items-center gap-1 rounded-full border-2 border-[var(--coach-border)] px-2.5 text-[12px] font-semibold text-[var(--coach-ink-secondary)]"
    >
      {copied ? <Check size={13} aria-hidden /> : <Copy size={13} aria-hidden />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
