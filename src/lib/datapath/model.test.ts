import assert from "node:assert/strict";
import { test } from "node:test";
import { assemble, boot, run } from "@/lib/tiny-cpu/machine";
import { bootDatapath, parseMicrocode, REFERENCE_MICROCODE, runMicrocode, tickDatapath } from "./model";

const PROGRAMS: { program: string[]; data?: Record<number, number> }[] = [
  { program: ["LDA 14", "ADD 15", "OUT", "HLT"], data: { 14: 28, 15: 14 } },
  { program: ["LDI 3", "OUT", "SUB 15", "JZ 5", "JMP 1", "OUT", "HLT"], data: { 15: 1 } },
  { program: ["LDA 13", "ADD 14", "STA 13", "LDA 15", "SUB 12", "STA 15", "JZ 8", "JMP 0", "LDA 13", "OUT", "HLT"], data: { 12: 1, 13: 0, 14: 6, 15: 3 } },
  { program: ["OUT", "ADD 15", "JC 4", "JMP 0", "HLT"], data: { 15: 64 } },
  { program: ["LDI 7", "STA 12", "LDA 12", "OUT", "LDA 14", "SUB 15", "OUT", "HLT"], data: { 14: 3, 15: 5 } },
];

test("the reference control table, run on the datapath, matches the tiny CPU simulator exactly", () => {
  const micro = parseMicrocode(REFERENCE_MICROCODE);
  assert.ok(micro.ok);
  if (!micro.ok) return;
  for (const p of PROGRAMS) {
    const mem = assemble(p.program, p.data);
    const want = run(boot(mem)).machine;
    const got = runMicrocode(mem, micro.micro);
    assert.equal(got.error, null);
    assert.deepEqual(got.d.out, want.out, p.program.join("; "));
    assert.equal(got.d.a, want.a);
    assert.deepEqual(got.d.mem, want.mem);
    assert.equal(got.d.carry, want.carry);
    assert.equal(got.d.zero, want.zero);
    assert.equal(got.instructions, want.steps);
  }
});

test("a fixed five-step design gives the same results in more ticks", () => {
  const micro = parseMicrocode(REFERENCE_MICROCODE);
  if (!micro.ok) throw new Error("parse");
  const mem = assemble(PROGRAMS[0].program, PROGRAMS[0].data);
  const short = runMicrocode(mem, micro.micro);
  const fixed = runMicrocode(mem, micro.micro, { fixedSteps: 5 });
  assert.deepEqual(fixed.d.out, short.d.out);
  // LDA (4 ticks), ADD (5), OUT (3), HLT (3) = 15 vs 5 + 5 + 5 + 3 (HLT stops the clock at once)
  assert.equal(short.d.ticks, 15);
  assert.equal(fixed.d.ticks, 18);
});

test("one tick: the bus carries one value, every in-signal loads it, and clashes change nothing", () => {
  let d = bootDatapath(assemble(["LDA 14", "HLT"], { 14: 28 }));
  for (const signals of [["CO", "MI"], ["RO", "II", "CE"], ["IO", "MI"], ["RO", "AI"]] as const) {
    const r = tickDatapath(d, [...signals]);
    assert.ok(r.ok);
    if (r.ok) d = r.d;
  }
  assert.deepEqual([d.a, d.pc, d.mar, d.ticks], [28, 1, 14, 4]);
  const clash = tickDatapath(d, ["AO", "CO", "MI"]);
  assert.ok(!clash.ok && /both/.test(clash.error));
  const empty = tickDatapath(d, ["AI"]);
  assert.ok(!empty.ok && /nothing is on it/.test(empty.error));
});

test("a learner's mistakes show up: a missing CE, a wrong ADD, a missing line", () => {
  const mem = assemble(PROGRAMS[0].program, PROGRAMS[0].data);
  const noCe = parseMicrocode(["FETCH: CO MI | RO II", ...REFERENCE_MICROCODE.slice(1)]);
  if (!noCe.ok) throw new Error("parse");
  const r1 = runMicrocode(mem, noCe.micro, { maxTicks: 100 });
  assert.notDeepEqual(r1.d.out, [42]); // fetches LDA 14 forever
  const badAdd = parseMicrocode(REFERENCE_MICROCODE.map((l) => (l.startsWith("ADD") ? "ADD: IO MI | RO AI" : l)));
  if (!badAdd.ok) throw new Error("parse");
  assert.deepEqual(runMicrocode(mem, badAdd.micro).d.out, [14]);
  const noOut = parseMicrocode(REFERENCE_MICROCODE.filter((l) => !l.startsWith("OUT")));
  if (!noOut.ok) throw new Error("parse");
  assert.match(runMicrocode(mem, noOut.micro).error ?? "", /no control table line for OUT/);
});

test("control tables are read strictly", () => {
  assert.ok(!parseMicrocode(["LDA: IO MI"]).ok); // no FETCH
  assert.ok(!parseMicrocode(["FETCH: CO MI", "LDA: IO XX"]).ok);
  assert.ok(!parseMicrocode(["FETCH: CO MI", "MUL: IO MI"]).ok);
  assert.ok(!parseMicrocode(["FETCH: CO MI", "JZ: IO J if Q"]).ok);
  const ok = parseMicrocode(["FETCH: co mi | ro ii ce", "jz: IO J if Z"]);
  assert.ok(ok.ok && ok.micro.ops.JZ?.[0].when === "Z");
});
