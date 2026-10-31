import assert from "node:assert/strict";
import { test } from "node:test";
import { assemble, boot, run } from "@/lib/tiny-cpu/v2";
import { compileTiny } from "./compile";

/** Compile, assemble and run; the output bytes, and each variable's final value. */
function runTiny(src: string) {
  const c = compileTiny(src);
  if (!c.ok) throw new Error(`line ${c.error.line}: ${c.error.message}`);
  const r = run(boot(assemble(c.asm)));
  assert.equal(r.stop, "halted");
  return { out: r.machine.out, vars: Object.fromEntries(Object.entries(c.vars).map(([k, a]) => [k, r.machine.mem[a]])), c };
}

test("assignment, arithmetic and output; values wrap at 8 bits", () => {
  assert.deepEqual(runTiny("var a = 28;\nvar b = 14;\noutput(a + b);").out, [42]);
  assert.deepEqual(runTiny("var x = 250;\nx = x + 10;\noutput(x);").out, [4]);
  assert.deepEqual(runTiny("var x = 3;\nx = x - 5;\noutput(x);").out, [254]);
  assert.deepEqual(runTiny("var x = 10;\noutput(x - 3 + 1);").out, [8]); // left to right
  assert.deepEqual(runTiny("var x = 1;\nx = x + 1;\nx = x + 1;").vars, { x: 3 });
});

test("while loops and if/else compile to compares and jumps", () => {
  assert.deepEqual(runTiny("var n = 3;\nwhile (n != 0) {\n  output(n);\n  n = n - 1;\n}").out, [3, 2, 1]);
  assert.deepEqual(runTiny("var x = 0;\nif (x == 0) { output(1); } else { output(2); }").out, [1]);
  assert.deepEqual(runTiny("var x = 5;\nif (x == 0) { output(1); } else { output(2); }").out, [2]);
  assert.deepEqual(runTiny("var x = 5;\nif (x != 5) { output(1); }\noutput(9);").out, [9]);
  // Nested: count down, and say 0 when n is even... using a second counter.
  const nested = "var n = 4;\nvar t = 0;\nwhile (n != 0) {\n  if (t == 0) { output(n); t = 1; } else { t = 0; }\n  n = n - 1;\n}";
  assert.deepEqual(runTiny(nested).out, [4, 2]);
});

test("multiplying by repeated adding: the blueprint's kind of program", () => {
  const src = "var a = 6;\nvar b = 7;\nvar p = 0;\nwhile (b != 0) {\n  p = p + a;\n  b = b - 1;\n}\noutput(p);";
  const r = runTiny(src);
  assert.deepEqual(r.out, [42]);
  assert.deepEqual(r.c.vars, { a: 0x80, b: 0x81, p: 0x82 });
});

test("compile errors say which line and why, instead of producing a broken program", () => {
  const err = (src: string) => {
    const c = compileTiny(src);
    assert.ok(!c.ok, src);
    return c.ok ? null : c.error;
  };
  assert.deepEqual(err("output(y);"), { line: 1, message: "y is used before it's declared with var" });
  assert.equal(err("var x = 1;\nvar x = 2;")?.line, 2);
  assert.match(err("var x = 300;")?.message ?? "", /doesn't fit in a byte/);
  assert.match(err("var x = 1\noutput(x);")?.message ?? "", /expected ";"/);
  assert.match(err("var x = 1;\nif (x < 3) { output(x); }")?.message ?? "", /== or !=/);
  assert.match(err("var x = 1;\nx = x * 2;")?.message ?? "", /only has \+ and -/);
  // Too big for the 64-instruction code area: an error, not a truncated program.
  assert.match(err(Array.from({ length: 40 }, (_, i) => `var v${i} = ${i};`).join("\n"))?.message ?? "", /code area holds 64/);
});

test("compiled code stays in the code area and variables in the data area", () => {
  const r = compileTiny("var a = 1;\nwhile (a != 0) { a = a - 1; }\noutput(a);");
  assert.ok(r.ok);
  if (!r.ok) return;
  for (const a of Object.values(r.vars)) assert.ok(a >= 0x80 && a <= 0xbf);
  assert.ok(r.instructions <= 64);
});
