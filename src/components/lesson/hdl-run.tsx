import { readFileSync } from "node:fs";
import path from "node:path";
import { HDL_DIR, HDL_ID, hdlFiles, type HdlRun as HdlRunRecord } from "@/lib/hdl/hash";
import { CopyButton } from "./c-run-output";
import { HdlRunOutput } from "./hdl-run-output";

const MONO = "font-[family-name:var(--font-plex-mono)]";

/**
 * A real hardware design, run by real tools on the build machine: simulated with Icarus Verilog (with a
 * waveform), synthesised with Yosys (gate statistics), or proved with Yosys's SAT solver. Shows the
 * Verilog, the exact commands and what the tool printed (content/hdl/<design>/run.json, written by
 * scripts/run-hdl.ts and checked against the source by a test). With `predict`, the result stays hidden
 * until the learner asks; `show="alu.v"` limits the files printed. <HdlRun design="verilog/alu" predict />
 */
export function HdlRun({ design, caption, predict = false, show }: { design: string; caption?: string; predict?: boolean; show?: string }) {
  if (!HDL_ID.test(design)) throw new Error(`Bad design id: ${design}`);
  const run = JSON.parse(readFileSync(path.join(HDL_DIR, design, "run.json"), "utf8")) as HdlRunRecord;
  const shown = show?.split(",").map((f) => f.trim());
  const files = hdlFiles(design).filter((f) => !shown || shown.includes(f.name));

  return (
    <figure className="not-prose my-6 overflow-hidden rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] text-[var(--coach-ink)]">
      {caption && <figcaption className="border-b-2 border-[var(--coach-border)] px-4 py-3 text-[15px] font-bold">{caption}</figcaption>}
      <div className="flex flex-col gap-3 p-4">
        {files.map((f) => (
          <div key={f.name} className="min-w-0">
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className={`text-[12.5px] font-semibold text-[var(--coach-ink-secondary)] ${MONO}`}>{f.name}</span>
              <CopyButton text={f.text} label={`Copy ${f.name}`} />
            </div>
            <pre className={`m-0 overflow-x-auto rounded-xl bg-[var(--coach-code-bg)] p-3 text-[13px] leading-relaxed text-[var(--coach-code-ink)] ${MONO}`}>
              {f.text.replace(/\n$/, "")}
            </pre>
          </div>
        ))}
        <HdlRunOutput run={run} predict={predict} />
        <p className="m-0 text-[11.5px] leading-snug text-[var(--coach-ink-muted)]">
          Real output from {run.versions}, generated {run.generated}. Other versions can word their messages differently.
        </p>
      </div>
    </figure>
  );
}
