import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { allHdlIds, HDL_DIR, HDL_ID, hdlHash, type HdlRun } from "./hash";

function lessonFiles(dir = path.join(process.cwd(), "content", "curriculum")): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? lessonFiles(path.join(dir, e.name)) : e.name.endsWith(".mdx") ? [path.join(dir, e.name)] : [],
  );
}

test("every design's run.json matches its current source (re-run scripts/run-hdl.ts if not)", () => {
  for (const id of allHdlIds()) {
    const p = path.join(HDL_DIR, id, "run.json");
    assert.ok(existsSync(p), `${id} has never been run`);
    assert.equal((JSON.parse(readFileSync(p, "utf8")) as HdlRun).sourceHash, hdlHash(id), `${id} changed since it was last run`);
  }
});

test("every HdlRun tag in a lesson names a design that exists", () => {
  const ids = new Set(allHdlIds());
  for (const file of lessonFiles()) {
    for (const m of readFileSync(file, "utf8").matchAll(/<HdlRun\b[^>]*\bdesign="([^"]+)"/g)) {
      assert.match(m[1], HDL_ID, `${path.basename(file)}: ${m[1]} isn't a valid design id`);
      assert.ok(ids.has(m[1]), `${path.basename(file)}: no design ${m[1]}`);
    }
  }
});
