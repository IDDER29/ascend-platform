"use client";

import { useId, useMemo, useState } from "react";
import { compileTiny } from "@/lib/translator/compile";
import { assemble, boot, MAX_STEPS, run } from "@/lib/tiny-cpu/v2";

const MONO = "font-[family-name:var(--font-plex-mono)]";
const hex = (n: number) => `0x${n.toString(16).toUpperCase()}`;

type Goal = { out?: number[]; vars?: Record<string, number> };

function parseJson<T>(text: string | undefined, fallback: T): T {
  if (!text) return fallback;
  try {
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

/** Run assembly on the tiny CPU (version 2): its output, memory and how it stopped. */
function runAsm(lines: string[]) {
  try {
    const r = run(boot(assemble(lines)), MAX_STEPS);
    return { ok: true as const, out: r.machine.out, mem: r.machine.mem, stop: r.stop, steps: r.machine.steps };
  } catch (e) {
    return { ok: false as const, error: e instanceof Error ? e.message : "can't assemble" };
  }
}

/**
 * The Translator Lab: write a program in the tiny language, see the tiny CPU assembly the translator
 * produces, and run it. With `handwritten`, the learner also translates by hand and compares. JSON-string
 * props: startJson (source lines), goalJson ('{"out":[3,2,1]}' or '{"vars":{"p":42}}'), handJson.
 */
export function TranslatorLab({
  caption,
  startJson,
  goalJson,
  handJson,
  handwritten = false,
}: {
  caption?: string;
  startJson: string;
  goalJson?: string;
  handJson?: string;
  handwritten?: boolean;
}) {
  const start = useMemo(() => parseJson<string[]>(startJson, []).join("\n"), [startJson]);
  const handStart = useMemo(() => parseJson<string[]>(handJson, ["HALT"]).join("\n"), [handJson]);
  const goal = useMemo(() => parseJson<Goal | null>(goalJson, null), [goalJson]);
  const sourceId = useId();
  const handId = useId();
  const [source, setSource] = useState(start);
  const [hand, setHand] = useState(handStart);

  const compiled = useMemo(() => compileTiny(source), [source]);
  const result = useMemo(() => (compiled.ok ? runAsm(compiled.asm) : null), [compiled]);
  const handResult = useMemo(() => (handwritten ? runAsm(hand.split("\n")) : null), [handwritten, hand]);

  const misses: string[] = [];
  if (goal && compiled.ok && result?.ok) {
    if (goal.out && JSON.stringify(result.out) !== JSON.stringify(goal.out)) {
      misses.push(`the output should be ${goal.out.join(", ") || "nothing"}`);
    }
    for (const [name, want] of Object.entries(goal.vars ?? {})) {
      const addr = compiled.vars[name];
      if (addr === undefined) misses.push(`there's no variable ${name}`);
      else if (result.mem[addr] !== want) misses.push(`${name} should end as ${want}`);
    }
  }
  const sameAsHand =
    handwritten && result?.ok && handResult?.ok && JSON.stringify(result.out) === JSON.stringify(handResult.out);

  const area =
    "w-full resize-y rounded-xl border-2 border-[var(--coach-border)] bg-[var(--coach-code-bg)] p-3 text-[13.5px] leading-relaxed text-[var(--coach-code-ink)] outline-none focus-visible:border-[var(--coach-focus)]";

  const status = !compiled.ok
    ? { tone: "bad", text: `Line ${compiled.error.line || "?"}: ${compiled.error.message}.` }
    : !result?.ok
      ? { tone: "bad", text: `The translated program didn't assemble: ${result?.error}.` }
      : result.stop !== "halted"
        ? { tone: "bad", text: `It didn't finish: stopped after ${result.steps} steps (${result.stop}).` }
        : goal
          ? misses.length === 0
            ? { tone: "good", text: "The goal is met." }
            : { tone: "bad", text: `Not yet: ${misses.join("; ")}.` }
          : { tone: "info", text: `Ran in ${result.steps} steps.` };

  return (
    <figure className="not-prose my-6 overflow-hidden rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] text-[var(--coach-ink)]">
      <figcaption className="border-b-2 border-[var(--coach-border)] px-4 py-3 text-[15px] font-bold">
        {caption ?? "The translator"}
      </figcaption>
      <div className="grid gap-4 p-4 md:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={sourceId} className="text-[12.5px] font-semibold text-[var(--coach-ink-secondary)]">
            Tiny-language source
          </label>
          <textarea
            id={sourceId}
            value={source}
            onChange={(e) => setSource(e.target.value)}
            spellCheck={false}
            rows={Math.max(6, source.split("\n").length + 1)}
            className={`${area} ${MONO}`}
          />
          <p className="m-0 text-[12px] leading-snug text-[var(--coach-ink-muted)]">
            <span className={MONO}>var x = 3;</span> <span className={MONO}>x = x + 1;</span>{" "}
            <span className={MONO}>if (x == 0) {"{ }"} else {"{ }"}</span> <span className={MONO}>while (x != 0) {"{ }"}</span>{" "}
            <span className={MONO}>output(x);</span> Values are bytes and wrap at 256.
          </p>
          {result?.ok && compiled.ok && (
            <dl className={`m-0 mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[13px] ${MONO}`}>
              <div className="flex gap-1.5">
                <dt className="text-[var(--coach-ink-muted)]">output</dt>
                <dd className="m-0 font-bold">{result.out.length ? result.out.join(" ") : "nothing"}</dd>
              </div>
              {Object.entries(compiled.vars).map(([name, addr]) => (
                <div key={name} className="flex gap-1.5">
                  <dt className="text-[var(--coach-ink-muted)]">
                    {name} <span className="text-[11px]">({hex(addr)})</span>
                  </dt>
                  <dd className="m-0 font-bold">{result.mem[addr]}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>
        <div className="flex min-w-0 flex-col gap-1.5">
          <p className="m-0 text-[12.5px] font-semibold text-[var(--coach-ink-secondary)]">
            What the translator produced{compiled.ok ? ` (${compiled.instructions} instructions)` : ""}
          </p>
          <pre className={`m-0 max-h-[320px] overflow-auto rounded-xl bg-[var(--coach-tint-neutral-bg)] p-3 text-[12.5px] leading-relaxed ${MONO}`}>
            {compiled.ok
              ? compiled.asm.map((l, k) => `${l.padEnd(26)}${compiled.origin[k] ? `; line ${compiled.origin[k]}` : ""}`).join("\n")
              : "(fix the source to see it)"}
          </pre>
        </div>
      </div>

      {handwritten && (
        <div className="flex flex-col gap-1.5 border-t-2 border-[var(--coach-border)] p-4">
          <label htmlFor={handId} className="text-[12.5px] font-semibold text-[var(--coach-ink-secondary)]">
            Your own translation, in tiny CPU assembly
          </label>
          <textarea
            id={handId}
            value={hand}
            onChange={(e) => setHand(e.target.value)}
            spellCheck={false}
            rows={Math.max(6, hand.split("\n").length + 1)}
            className={`${area} ${MONO}`}
          />
          <p className={`m-0 text-[13px] ${MONO}`}>
            yours:{" "}
            {handResult?.ok
              ? handResult.stop === "halted"
                ? handResult.out.join(" ") || "nothing"
                : `didn't finish (${handResult.stop})`
              : `can't assemble: ${handResult?.error}`}
            {sameAsHand ? "  (same output as the translator's)" : ""}
          </p>
        </div>
      )}

      <p
        aria-live="polite"
        className={`m-0 border-t-2 border-[var(--coach-border)] px-4 py-3 text-[14px] leading-snug ${
          status.tone === "good" ? "bg-[var(--coach-tint-lime-bg)] font-semibold" : status.tone === "bad" ? "bg-[var(--coach-wrong-soft)]" : ""
        }`}
      >
        {status.text}
      </p>
    </figure>
  );
}
