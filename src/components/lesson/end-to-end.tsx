"use client";

import { useId, useMemo, useState } from "react";
import { FastForward, RotateCcw, StepForward } from "lucide-react";
import { compileTiny } from "@/lib/translator/compile";
import { assemble, assembleListing, boot, CODE_END, MAX_STEPS, step, type Machine } from "@/lib/tiny-cpu/v2";

const MONO = "font-[family-name:var(--font-plex-mono)]";
const hex2 = (n: number) => n.toString(16).toUpperCase().padStart(2, "0");

const STAGES = ["Source", "Translate", "Assemble", "Load", "Run"] as const;
type Stage = (typeof STAGES)[number];
const STAGE_NOTE: Record<Stage, string> = {
  Source: "A program in the tiny language. Edit it: every later stage follows.",
  Translate: "Our translator turns each line into tiny CPU assembly. Each instruction says which source line it came from.",
  Assemble: "The assembler gives every instruction an address and two bytes, and every label its address.",
  Load: "Loading copies those bytes into memory from address 0x00. Variables live from 0x80; the stack is near the top.",
  Run: "The CPU fetches the instruction at PC, does it, and moves on. OUT sends a byte to the display.",
};

type Goal = { out?: number[] };
type Built = { ok: true; listing: ReturnType<typeof assembleListing>; mem: number[] } | { ok: false; error: string };

function parseJson<T>(text: string | undefined, fallback: T): T {
  if (!text) return fallback;
  try {
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

/**
 * The End-to-End Explorer: one tiny-language program followed through every stage, from source to
 * translation, assembly, loading and execution on the tiny CPU (version 2), with its output on a modelled
 * display. It is our toy pipeline only; real C on a real OS is shown separately (CompilerOutput).
 * JSON-string props: startJson (source lines), goalJson ('{"out":[10]}').
 */
export function EndToEnd({ caption, startJson, goalJson }: { caption?: string; startJson: string; goalJson?: string }) {
  const start = useMemo(() => parseJson<string[]>(startJson, []).join("\n"), [startJson]);
  const goal = useMemo(() => parseJson<Goal | null>(goalJson, null), [goalJson]);
  const [source, setSource] = useState(start);
  const [stage, setStage] = useState<Stage>("Source");

  const compiled = useMemo(() => compileTiny(source), [source]);
  const built = useMemo((): Built | null => {
    if (!compiled.ok) return null;
    try {
      return { ok: true, listing: assembleListing(compiled.asm), mem: assemble(compiled.asm) };
    } catch (e) {
      return { ok: false, error: e instanceof Error ? e.message : "can't assemble" };
    }
  }, [compiled]);

  return (
    <figure className="not-prose my-6 overflow-hidden rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] text-[var(--coach-ink)]">
      <figcaption className="border-b-2 border-[var(--coach-border)] px-4 py-3 text-[15px] font-bold">
        {caption ?? "From source to output"}
      </figcaption>

      <div role="tablist" aria-label="Stages" className="flex gap-1 overflow-x-auto border-b-2 border-[var(--coach-border)] px-3 py-2">
        {STAGES.map((s, i) => {
          const blocked = i > 0 && !built?.ok;
          return (
            <button
              key={s}
              type="button"
              role="tab"
              aria-selected={stage === s}
              disabled={blocked}
              onClick={() => setStage(s)}
              className={`h-9 shrink-0 rounded-full px-3 text-[13px] font-bold disabled:opacity-40 ${
                stage === s ? "bg-[var(--coach-ink)] text-[var(--coach-surface)]" : "text-[var(--coach-ink-secondary)]"
              }`}
            >
              {i + 1}. {s}
            </button>
          );
        })}
      </div>

      <div className="p-4" role="tabpanel" aria-label={stage}>
        <p className="m-0 mb-3 text-[13.5px] leading-snug text-[var(--coach-ink-secondary)]">{STAGE_NOTE[stage]}</p>
        {stage === "Source" && <SourceStage source={source} setSource={setSource} compiled={compiled} built={built} />}
        {stage === "Translate" && compiled.ok && (
          <pre className={`m-0 max-h-[360px] overflow-auto rounded-xl bg-[var(--coach-tint-neutral-bg)] p-3 text-[12.5px] leading-relaxed ${MONO}`}>
            {compiled.asm
              .map((l, k) => `${l.padEnd(24)}${compiled.origin[k] ? `; line ${compiled.origin[k]}: ${source.split("\n")[compiled.origin[k] - 1]?.trim() ?? ""}` : ""}`)
              .join("\n")}
          </pre>
        )}
        {stage === "Assemble" && built?.ok && <AssembleStage listing={built.listing} />}
        {stage === "Load" && built?.ok && compiled.ok && <MemoryGrid mem={built.mem} vars={compiled.vars} />}
        {stage === "Run" && built?.ok && compiled.ok && (
          <RunStage key={source} mem={built.mem} vars={compiled.vars} goal={goal} />
        )}
      </div>
    </figure>
  );
}

function SourceStage({
  source,
  setSource,
  compiled,
  built,
}: {
  source: string;
  setSource: (s: string) => void;
  compiled: ReturnType<typeof compileTiny>;
  built: Built | null;
}) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[12.5px] font-semibold text-[var(--coach-ink-secondary)]">
        Tiny-language source
      </label>
      <textarea
        id={id}
        value={source}
        onChange={(e) => setSource(e.target.value)}
        spellCheck={false}
        rows={Math.max(6, source.split("\n").length + 1)}
        className={`w-full resize-y rounded-xl border-2 border-[var(--coach-border)] bg-[var(--coach-code-bg)] p-3 text-[13.5px] leading-relaxed text-[var(--coach-code-ink)] outline-none focus-visible:border-[var(--coach-focus)] ${MONO}`}
      />
      <p className="m-0 text-[13px]">
        {!compiled.ok
          ? `Line ${compiled.error.line || "?"}: ${compiled.error.message}.`
          : built && !built.ok
            ? `The translation didn't assemble: ${built.error}.`
            : `Translates to ${compiled.instructions} instructions. Go on to Translate.`}
      </p>
    </div>
  );
}

function AssembleStage({ listing }: { listing: ReturnType<typeof assembleListing> }) {
  const labels = Object.entries(listing.labels);
  return (
    <div className="overflow-x-auto">
      <table className={`w-full border-separate border-spacing-y-0.5 text-[12.5px] ${MONO}`}>
        <caption className="sr-only">Each instruction with its address and bytes</caption>
        <thead>
          <tr className="text-left text-[12px] text-[var(--coach-ink-muted)]">
            <th scope="col" className="pr-3 font-semibold">address</th>
            <th scope="col" className="pr-3 font-semibold">bytes</th>
            <th scope="col" className="font-semibold">instruction</th>
          </tr>
        </thead>
        <tbody>
          {listing.lines
            .filter((l) => l.address !== null)
            .map((l) => (
              <tr key={l.address!}>
                <td className="pr-3">0x{hex2(l.address!)}</td>
                <td className="pr-3 whitespace-nowrap">
                  {hex2(l.bytes![0])} {hex2(l.bytes![1])}
                </td>
                <td className="whitespace-nowrap">{l.source.replace(/;.*/, "").trim()}</td>
              </tr>
            ))}
        </tbody>
      </table>
      {labels.length > 0 && (
        <p className={`m-0 mt-2 text-[12.5px] ${MONO}`}>
          labels: {labels.map(([n, a]) => `${n} = 0x${hex2(a)}`).join(", ")}
        </p>
      )}
    </div>
  );
}

function MemoryGrid({ mem, vars, pc, changed }: { mem: number[]; vars: Record<string, number>; pc?: number; changed?: Set<number> }) {
  const varAt = new Map(Object.entries(vars).map(([n, a]) => [a, n]));
  return (
    <div className="overflow-x-auto">
      <table aria-label="Memory, 256 bytes" className={`border-separate border-spacing-[2px] text-[11px] ${MONO}`}>
        <tbody>
          {Array.from({ length: 16 }, (_, r) => (
            <tr key={r}>
              <th scope="row" className="pr-1 text-right font-normal text-[var(--coach-ink-muted)]">
                {hex2(r * 16)}
              </th>
              {Array.from({ length: 16 }, (_, c) => {
                const a = r * 16 + c;
                const isPc = pc !== undefined && (a === pc || a === pc + 1);
                const name = varAt.get(a);
                return (
                  <td
                    key={c}
                    title={`0x${hex2(a)}: ${mem[a]}${name ? ` (${name})` : ""}`}
                    className={`min-w-[22px] rounded px-[2px] py-[1px] text-center ${
                      changed?.has(a)
                        ? "bg-[var(--coach-lime)] font-bold text-[var(--coach-lime-ink)]"
                        : a <= CODE_END + 1
                          ? "bg-[var(--coach-tint-blue-bg)]"
                          : name
                            ? "bg-[var(--coach-tint-orange-bg)]"
                            : "bg-[var(--coach-tint-neutral-bg)]"
                    } ${isPc ? "outline outline-2 outline-[var(--coach-ink)]" : ""} ${mem[a] === 0 && !name && !changed?.has(a) ? "text-[var(--coach-ink-muted)]" : ""}`}
                  >
                    {hex2(mem[a])}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="m-0 mt-2 text-[12px] text-[var(--coach-ink-muted)]">
        Blue: code. Orange: variables
        {Object.keys(vars).length ? ` (${Object.entries(vars).map(([n, a]) => `${n} at 0x${hex2(a)}`).join(", ")})` : ""}.
        {pc !== undefined ? " Outlined: the instruction at PC. Lime: changed by the last step." : ""}
      </p>
    </div>
  );
}

function RunStage({ mem, vars, goal }: { mem: number[]; vars: Record<string, number>; goal: Goal | null }) {
  const [m, setM] = useState<Machine>(() => boot(mem));
  const [last, setLast] = useState<{ text: string; changed: Set<number> } | null>(null);
  const [fault, setFault] = useState<string | null>(null);

  function once(from: Machine) {
    const r = step(from);
    if (r.kind === "fault") return { m: from, text: r.text, fault: `${r.fault}: ${r.text}` };
    if (r.kind === "blocked" || r.kind === "halted") return { m: r.machine, text: r.kind === "halted" ? "Halted." : r.text, fault: null };
    return { m: r.machine, text: r.text, fault: null };
  }
  function doStep() {
    const r = once(m);
    setLast({ text: r.text, changed: diff(m.mem, r.m.mem) });
    setFault(r.fault);
    setM(r.m);
  }
  function toEnd() {
    let cur = m;
    let text = "";
    let f: string | null = null;
    while (!cur.halted && cur.steps < MAX_STEPS) {
      const r = once(cur);
      text = r.text;
      if (r.fault) {
        f = r.fault;
        break;
      }
      if (r.m === cur) break;
      cur = r.m;
    }
    setLast({ text, changed: diff(m.mem, cur.mem) });
    setFault(f);
    setM(cur);
  }

  const met = goal?.out ? JSON.stringify(m.out) === JSON.stringify(goal.out) && m.halted : false;
  const stopped = m.halted || fault !== null || m.steps >= MAX_STEPS;
  const btn = "inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[13.5px] font-bold disabled:opacity-40";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={doStep} disabled={stopped} className={`${btn} bg-[var(--coach-lime)] text-[var(--coach-lime-ink)] shadow-[0_2px_0_var(--coach-lime-shadow)]`}>
          <StepForward size={15} strokeWidth={2.4} aria-hidden /> Step
        </button>
        <button type="button" onClick={toEnd} disabled={stopped} className={`${btn} border-2 border-[var(--coach-border-strong)]`}>
          <FastForward size={15} strokeWidth={2.4} aria-hidden /> Run to the end
        </button>
        <button
          type="button"
          onClick={() => {
            setM(boot(mem));
            setLast(null);
            setFault(null);
          }}
          aria-label="Load the program again"
          className="inline-flex size-9 items-center justify-center rounded-full border-2 border-[var(--coach-border-strong)]"
        >
          <RotateCcw size={15} aria-hidden />
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-[minmax(0,220px)_minmax(0,1fr)]">
        <dl className={`m-0 flex flex-col gap-1 text-[13px] ${MONO}`}>
          {(["R0", "R1", "R2", "R3"] as const).map((r, i) => (
            <div key={r} className="flex gap-2">
              <dt className="w-8 text-[var(--coach-ink-muted)]">{r}</dt>
              <dd className="m-0 font-bold">{m.r[i]}</dd>
            </div>
          ))}
          <div className="flex gap-2">
            <dt className="w-8 text-[var(--coach-ink-muted)]">PC</dt>
            <dd className="m-0 font-bold">0x{hex2(m.pc)}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-8 text-[var(--coach-ink-muted)]">SP</dt>
            <dd className="m-0 font-bold">0x{hex2(m.sp)}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="w-8 text-[var(--coach-ink-muted)]">Z</dt>
            <dd className="m-0 font-bold">{m.z ? 1 : 0}</dd>
          </div>
          {Object.entries(vars).map(([n, a]) => (
            <div key={n} className="flex gap-2">
              <dt className="w-8 truncate text-[var(--coach-ink-muted)]" title={n}>
                {n}
              </dt>
              <dd className="m-0 font-bold">{m.mem[a]}</dd>
            </div>
          ))}
          <div className="mt-1 rounded-xl bg-[var(--coach-code-bg)] px-3 py-2 text-[var(--coach-code-ink)]">
            <span className="block text-[11px] text-[var(--coach-hero-muted)]">display</span>
            <span className="text-[17px] font-bold">{m.out.length ? m.out.join("  ") : "nothing yet"}</span>
          </div>
        </dl>
        <MemoryGrid mem={m.mem} vars={vars} pc={m.halted ? undefined : m.pc} changed={last?.changed} />
      </div>

      <p
        aria-live="polite"
        className={`m-0 rounded-xl px-3 py-2 text-[14px] leading-snug ${
          fault ? "bg-[var(--coach-wrong-soft)]" : met ? "bg-[var(--coach-tint-lime-bg)] font-semibold" : "bg-[var(--coach-tint-neutral-bg)]"
        }`}
      >
        {fault
          ? `The CPU stopped: ${fault}.`
          : m.steps >= MAX_STEPS && !m.halted
            ? `Still running after ${MAX_STEPS} steps: is there a loop that never ends?`
            : met
              ? `The goal is met: the display shows ${m.out.join(", ")}, after ${m.steps} steps.`
              : m.halted
                ? `Halted after ${m.steps} steps.${goal?.out ? ` The goal is ${goal.out.join(", ")} on the display.` : ""}`
                : last
                  ? `Step ${m.steps}: ${last.text}`
                  : "Loaded. PC is 0x00: press Step to run the first instruction."}
      </p>
    </div>
  );
}

function diff(a: number[], b: number[]): Set<number> {
  const s = new Set<number>();
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) s.add(i);
  return s;
}
