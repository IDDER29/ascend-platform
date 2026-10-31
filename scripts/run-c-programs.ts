/**
 * Compile and run every lesson program in content/programs/ with the local gcc, and record exactly what
 * happened in each program's run.json (see src/lib/programs/hash.ts). Run after adding or changing a
 * program:  npx tsx scripts/run-c-programs.ts [id ...]   (no ids: only programs whose run.json is stale)
 * Use --all to re-run everything.
 */
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import {
  allProgramIds,
  DEFAULT_FLAGS,
  PROGRAMS_DIR,
  programFiles,
  programHash,
  programMeta,
  programStdin,
  type ProgramRun,
} from "../src/lib/programs/hash";

const compiler = execFileSync("gcc", ["--version"], { encoding: "utf8" }).split("\n")[0];
const machine = execFileSync("gcc", ["-dumpmachine"], { encoding: "utf8" }).trim();
const target = machine.startsWith("x86_64") && machine.includes("linux") ? "x86-64 Linux" : machine;
const today = new Date().toISOString().slice(0, 10);
/** Longer output is cut, so a runaway loop can't fill a lesson (or the repo). */
const MAX_OUTPUT = 4000;
const cap = (text: string) =>
  text.length <= MAX_OUTPUT ? text : `${text.slice(0, MAX_OUTPUT)}\n... (output cut here)\n`;

/** Quote an argument the way a learner would have to type it in a shell. */
const shellQuote = (arg: string) => (/^[A-Za-z0-9_./=:,+-]+$/.test(arg) ? arg : `'${arg.replaceAll("'", `'\\''`)}'`);

const argv = process.argv.slice(2);
const all = argv.includes("--all");
const named = argv.filter((a) => !a.startsWith("--"));

function stale(id: string): boolean {
  const p = path.join(PROGRAMS_DIR, id, "run.json");
  if (!existsSync(p)) return true;
  return (JSON.parse(readFileSync(p, "utf8")) as ProgramRun).sourceHash !== programHash(id);
}

const ids = named.length ? named : allProgramIds().filter((id) => all || stale(id));
for (const id of ids) {
  const dir = path.join(PROGRAMS_DIR, id);
  const meta = programMeta(id);
  const allFlags = (meta.flags ?? DEFAULT_FLAGS).split(/\s+/).filter(Boolean);
  // Libraries (-lm, -lpthread) must come after the sources that use them, or the link fails.
  const libs = allFlags.filter((f) => f.startsWith("-l"));
  const flags = allFlags.filter((f) => !f.startsWith("-l"));
  const sources = programFiles(id).filter((f) => f.name.endsWith(".c")).map((f) => f.name);
  const out = mkdtempSync(path.join(tmpdir(), "ascend-c-"));
  const exe = path.join(out, "prog");

  // Compile inside the program's folder, so messages name files the way a learner would see them.
  // Messages must not leak this machine's paths: the program folder becomes ".", the build folder "/tmp/build".
  const clean = (text: string) => text.replaceAll(out, "/tmp/build").replaceAll(dir + "/", "./").replaceAll(dir, ".");
  const cc = spawnSync("gcc", [...flags, ...sources, ...libs, "-o", exe], { cwd: dir, encoding: "utf8" });
  const compile = { ok: cc.status === 0, stderr: clean(cc.stderr) };
  let run: ProgramRun["run"] = null;
  if (compile.ok) {
    const started = Date.now();
    const r = spawnSync(exe, meta.args ?? [], {
      argv0: "./prog", // what argv[0] is when a learner types ./prog
      cwd: dir,
      input: programStdin(id) ?? "",
      encoding: "utf8",
      timeout: 3000,
      maxBuffer: 16 * 1024 * 1024,
    });
    // spawnSync stops a program that runs too long (or floods its output) with SIGTERM.
    const timedOut = r.signal === "SIGTERM" && (Date.now() - started >= 2900 || r.stdout.length > MAX_OUTPUT);
    run = { stdout: cap(clean(r.stdout ?? "")), stderr: cap(clean(r.stderr ?? "")), exitCode: r.status, signal: r.signal, timedOut };
  }
  rmSync(out, { recursive: true, force: true });

  const result: ProgramRun = {
    id,
    sourceHash: programHash(id),
    compiler,
    target,
    compileCommand: ["gcc", ...flags, ...sources, ...libs, "-o", "prog"].join(" "),
    runCommand: ["./prog", ...(meta.args ?? []).map(shellQuote)].join(" ") + (programStdin(id) !== null ? " < input.txt" : ""),
    compile,
    run,
    generated: today,
  };
  writeFileSync(path.join(dir, "run.json"), JSON.stringify(result, null, 2) + "\n");
  const what = !compile.ok
    ? "compile error"
    : run?.timedOut
      ? "still running after 3 s, stopped"
      : run?.signal
        ? `killed by ${run.signal}`
        : `exit ${run?.exitCode}`;
  console.log(`${id}: ${what}`);
}
if (ids.length === 0) console.log("Every program's run.json is up to date.");
