"use client";

import { useId, useMemo, useState } from "react";
import { Check, RotateCcw, X } from "lucide-react";
import { parseMicrocode, runMicrocode } from "@/lib/datapath/model";
import { assemble, boot, run } from "@/lib/tiny-cpu/machine";

const MONO = "font-[family-name:var(--font-plex-mono)]";

type TestProgram = { name: string; program: string[]; data?: Record<string, number> };

function parseJson<T>(text: string | undefined, fallback: T): T {
  if (!text) return fallback;
  try {
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

/**
 * The Control Lab: write the tiny CPU's control table (the microcode for the fetch and every
 * instruction), and run real programs on it, checked against the reference simulator. JSON-string props:
 * startJson (the table's starting lines), programsJson ([{ name, program, data }]), compareFixedJson
 * (a number: also run every program with each instruction padded to that many steps, and compare ticks).
 */
export function ControlLab({
  caption,
  startJson,
  programsJson,
  compareFixedJson,
}: {
  caption?: string;
  startJson: string;
  programsJson: string;
  compareFixedJson?: string;
}) {
  const start = useMemo(() => parseJson<string[]>(startJson, ["FETCH: CO MI | RO II CE"]).join("\n"), [startJson]);
  const programs = useMemo(() => parseJson<TestProgram[]>(programsJson, []), [programsJson]);
  const fixed = useMemo(() => parseJson<number | undefined>(compareFixedJson, undefined), [compareFixedJson]);
  const editorId = useId();
  const [source, setSource] = useState(start);
  const [open, setOpen] = useState(0);

  const parsed = useMemo(() => parseMicrocode(source.split("\n")), [source]);
  const results = useMemo(() => {
    if (!parsed.ok) return [];
    return programs.map((p) => {
      const mem = assemble(p.program, p.data ?? {});
      const want = run(boot(mem)).machine;
      const mine = runMicrocode(mem, parsed.micro, { maxTicks: 2000 });
      const padded = fixed ? runMicrocode(mem, parsed.micro, { fixedSteps: fixed, maxTicks: 4000 }) : null;
      const ok =
        mine.error === null &&
        !mine.stoppedEarly &&
        JSON.stringify(mine.d.out) === JSON.stringify(want.out) &&
        JSON.stringify(mine.d.mem) === JSON.stringify(want.mem) &&
        mine.d.a === want.a;
      return { p, want, mine, padded, ok };
    });
  }, [parsed, programs, fixed]);

  const solved = parsed.ok && results.length > 0 && results.every((r) => r.ok);
  const shown = results[open];

  return (
    <figure className="not-prose my-6 overflow-hidden rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] text-[var(--coach-ink)]">
      <figcaption className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-[var(--coach-border)] px-4 py-3">
        <span className="text-[15px] font-bold">{caption ?? "The control unit"}</span>
        <button
          type="button"
          onClick={() => setSource(start)}
          aria-label="Reset the control table"
          className="inline-flex size-9 items-center justify-center rounded-full border-2 border-[var(--coach-border-strong)]"
        >
          <RotateCcw size={15} aria-hidden />
        </button>
      </figcaption>

      <div className="grid gap-4 p-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={editorId} className="text-[12.5px] font-semibold text-[var(--coach-ink-secondary)]">
            Your control table: NAME: signals | signals | ...
          </label>
          <textarea
            id={editorId}
            value={source}
            onChange={(e) => setSource(e.target.value)}
            spellCheck={false}
            rows={Math.max(6, source.split("\n").length + 1)}
            className={`w-full resize-y rounded-xl border-2 border-[var(--coach-border)] bg-[var(--coach-code-bg)] p-3 text-[13px] leading-relaxed text-[var(--coach-code-ink)] outline-none focus-visible:border-[var(--coach-focus)] ${MONO}`}
          />
          <p className="m-0 text-[12px] leading-snug text-[var(--coach-ink-muted)]">
            Signals: CO RO IO AO EO (onto the bus), MI RI II AI BI OI J (off it), CE SU FI HLT. End a step with
            &quot;if C&quot; or &quot;if Z&quot; to make it happen only when that flag is set.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="m-0 text-[13px] font-bold">Programs, run on your control unit</p>
          {!parsed.ok ? (
            <p className="m-0 text-[13px] text-[var(--coach-ink-muted)]">Fix the table to run them.</p>
          ) : (
            <ul className="m-0 flex list-none flex-col gap-1 p-0">
              {results.map((r, i) => (
                <li key={r.p.name}>
                  <button
                    type="button"
                    onClick={() => setOpen(i)}
                    aria-pressed={open === i}
                    className={`flex w-full items-start gap-2 rounded-lg px-2 py-1.5 text-left text-[13px] ${
                      open === i ? "bg-[var(--coach-tint-neutral-bg)]" : ""
                    }`}
                  >
                    {r.ok ? (
                      <Check size={15} strokeWidth={3} className="mt-0.5 shrink-0" aria-label="right" />
                    ) : (
                      <X size={15} strokeWidth={3} className="mt-0.5 shrink-0 text-[var(--coach-wrong-title)]" aria-label="wrong" />
                    )}
                    <span className="min-w-0">
                      <span className="font-semibold">{r.p.name}</span>
                      <span className={`block text-[12px] text-[var(--coach-ink-secondary)] ${MONO}`}>
                        yours: {r.mine.error ? "stopped" : r.mine.d.out.join(" ") || "nothing"}
                        {"  "}want: {r.want.out.join(" ") || "nothing"}
                        {"  "}
                        {r.mine.d.ticks} ticks{r.padded ? `, ${r.padded.d.ticks} fixed` : ""}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {parsed.ok && shown && (
        <div className="border-t-2 border-[var(--coach-border)] px-4 py-3">
          <p className="m-0 mb-1.5 text-[13px] font-bold">
            {shown.p.name}: every tick {shown.mine.trace.length >= 400 ? "(first 400)" : ""}
          </p>
          {shown.mine.error && <p className="m-0 mb-1.5 text-[13px] text-[var(--coach-wrong-title)]">Stopped: {shown.mine.error}.</p>}
          {shown.mine.stoppedEarly && !shown.mine.error && (
            <p className="m-0 mb-1.5 text-[13px] text-[var(--coach-wrong-title)]">It never halted: stopped after {shown.mine.d.ticks} ticks.</p>
          )}
          <ol className={`m-0 flex max-h-[180px] list-none flex-col gap-0.5 overflow-y-auto p-0 text-[12.5px] ${MONO}`}>
            {shown.mine.trace.map((t) => (
              <li key={t.tick}>
                {t.tick}. {t.instruction} step {t.step}: {t.signals.length ? t.signals.join(" ") : "(nothing)"}
                {t.bus !== null ? `, bus = ${t.bus}` : ""}
              </li>
            ))}
          </ol>
        </div>
      )}

      <p
        aria-live="polite"
        className={`m-0 border-t-2 border-[var(--coach-border)] px-4 py-3 text-[14px] leading-snug ${
          !parsed.ok ? "bg-[var(--coach-wrong-soft)]" : solved ? "bg-[var(--coach-tint-lime-bg)] font-semibold" : ""
        }`}
      >
        {!parsed.ok
          ? `Line ${parsed.line}: ${parsed.message}.`
          : solved
            ? "Solved: every program gives the same result as the reference CPU."
            : `${results.filter((r) => r.ok).length} of ${results.length} programs right.`}
      </p>
    </figure>
  );
}
