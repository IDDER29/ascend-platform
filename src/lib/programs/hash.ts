import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

/**
 * Real C programs used by lessons live in content/programs/<id>/: main.c (and any other .c or .h files),
 * an optional stdin.txt, and an optional meta.json ({ "flags": "...", "args": [...] }). run.json holds
 * what gcc and the program actually printed, written by `npx tsx scripts/run-c-programs.ts`. The hash
 * covers everything that run.json depends on, so a test can tell when a program changed but wasn't re-run.
 */
export const PROGRAMS_DIR = path.join(process.cwd(), "content", "programs");
export const DEFAULT_FLAGS = "-std=c17 -Wall -Wextra -O0";
/** A program id: folders under content/programs, such as c-contract/overflow-check-O2. */
export const PROGRAM_ID = /^[A-Za-z0-9-]+(\/[A-Za-z0-9-]+)*$/;

export type ProgramMeta = { flags?: string; args?: string[]; note?: string };

export type ProgramRun = {
  id: string;
  sourceHash: string;
  compiler: string;
  target: string;
  /** The exact commands, as a learner would type them. */
  compileCommand: string;
  runCommand: string;
  compile: { ok: boolean; stderr: string };
  run: {
    stdout: string;
    stderr: string;
    exitCode: number | null;
    signal: string | null;
    /** It was still running after the time limit and was stopped. */
    timedOut?: boolean;
  } | null;
  generated: string;
};

export function programFiles(id: string): { name: string; text: string }[] {
  const dir = path.join(PROGRAMS_DIR, id);
  return readdirSync(dir)
    .filter((f) => /\.(c|h)$/.test(f))
    .sort((a, b) => (a === "main.c" ? -1 : b === "main.c" ? 1 : a.localeCompare(b)))
    .map((name) => ({ name, text: readFileSync(path.join(dir, name), "utf8") }));
}

export function programStdin(id: string): string | null {
  const p = path.join(PROGRAMS_DIR, id, "stdin.txt");
  return existsSync(p) ? readFileSync(p, "utf8") : null;
}

export function programMeta(id: string): ProgramMeta {
  const p = path.join(PROGRAMS_DIR, id, "meta.json");
  return existsSync(p) ? (JSON.parse(readFileSync(p, "utf8")) as ProgramMeta) : {};
}

export function programHash(id: string): string {
  const payload = JSON.stringify({ files: programFiles(id), stdin: programStdin(id), meta: programMeta(id) });
  return createHash("sha256").update(payload).digest("hex").slice(0, 16);
}

/** Every program id: each folder under content/programs that holds a main.c. */
export function allProgramIds(dir = PROGRAMS_DIR, prefix = ""): string[] {
  if (!existsSync(dir)) return [];
  const ids: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const id = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (existsSync(path.join(dir, entry.name, "main.c"))) ids.push(id);
    ids.push(...allProgramIds(path.join(dir, entry.name), id));
  }
  return ids.sort();
}
