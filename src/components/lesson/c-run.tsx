import { readFileSync } from "node:fs";
import path from "node:path";
import { PROGRAM_ID, PROGRAMS_DIR, programFiles, programStdin, type ProgramRun } from "@/lib/programs/hash";
import { CRunOutput, CopyButton } from "./c-run-output";

const MONO = "font-[family-name:var(--font-plex-mono)]";

/**
 * A real C program, compiled and run by gcc on the build machine: its source, the exact commands, any
 * compiler messages, and what it printed (content/programs/<program>/run.json, written by
 * scripts/run-c-programs.ts and checked against the source by a test, so it can't drift). With `predict`,
 * the output stays hidden until the learner has predicted it. <CRun program="c-basics/hello" predict />
 */
export function CRun({ program, caption, predict = false }: { program: string; caption?: string; predict?: boolean }) {
  if (!PROGRAM_ID.test(program)) throw new Error(`Bad program id: ${program}`);
  const run = JSON.parse(readFileSync(path.join(PROGRAMS_DIR, program, "run.json"), "utf8")) as ProgramRun;
  const files = programFiles(program);
  const stdin = programStdin(program);

  return (
    <figure className="not-prose my-6 overflow-hidden rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] text-[var(--coach-ink)]">
      {caption && (
        <figcaption className="border-b-2 border-[var(--coach-border)] px-4 py-3 text-[15px] font-bold">{caption}</figcaption>
      )}
      <div className="flex flex-col gap-3 p-4">
        {files.map((f) => (
          <div key={f.name} className="min-w-0">
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className={`text-[12.5px] font-semibold text-[var(--coach-ink-secondary)] ${MONO}`}>{f.name}</span>
              <CopyButton text={f.text} label={`Copy ${f.name}`} />
            </div>
            <pre
              className={`m-0 overflow-x-auto rounded-xl bg-[var(--coach-code-bg)] p-3 text-[13px] leading-relaxed text-[var(--coach-code-ink)] ${MONO}`}
            >
              {f.text.replace(/\n$/, "")}
            </pre>
          </div>
        ))}
        {stdin !== null && (
          <div className="min-w-0">
            <p className={`m-0 mb-1 text-[12.5px] font-semibold text-[var(--coach-ink-secondary)] ${MONO}`}>input.txt (typed in)</p>
            <pre className={`m-0 overflow-x-auto rounded-xl bg-[var(--coach-tint-neutral-bg)] p-3 text-[13px] ${MONO}`}>
              {stdin.replace(/\n$/, "")}
            </pre>
          </div>
        )}
        <CRunOutput run={run} predict={predict} />
        <p className="m-0 text-[11.5px] leading-snug text-[var(--coach-ink-muted)]">
          Real output from {run.compiler}, {run.target}, generated {run.generated}. Other compilers and systems can print different
          warnings{run.run?.signal || (run.run && run.run.exitCode !== 0) ? " and results" : ""}.
        </p>
      </div>
    </figure>
  );
}
