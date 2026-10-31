import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { allProgramIds, PROGRAM_ID, PROGRAMS_DIR, programHash, type ProgramRun } from "./hash";

function lessonFiles(dir = path.join(process.cwd(), "content", "curriculum")): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? lessonFiles(path.join(dir, e.name)) : e.name.endsWith(".mdx") ? [path.join(dir, e.name)] : [],
  );
}

test("every program's run.json matches its current source (re-run scripts/run-c-programs.ts if not)", () => {
  for (const id of allProgramIds()) {
    const p = path.join(PROGRAMS_DIR, id, "run.json");
    assert.ok(existsSync(p), `${id} has never been run`);
    const run = JSON.parse(readFileSync(p, "utf8")) as ProgramRun;
    assert.equal(run.sourceHash, programHash(id), `${id} changed since it was last run`);
  }
});

test("every CRun tag in a lesson names a program that exists", () => {
  const ids = new Set(allProgramIds());
  for (const file of lessonFiles()) {
    for (const m of readFileSync(file, "utf8").matchAll(/<CRun\b[^>]*\bprogram="([^"]+)"/g)) {
      assert.ok(ids.has(m[1]), `${path.basename(file)}: no program ${m[1]}`);
      assert.match(m[1], PROGRAM_ID, `${path.basename(file)}: ${m[1]} isn't a valid program id`);
    }
  }
});
