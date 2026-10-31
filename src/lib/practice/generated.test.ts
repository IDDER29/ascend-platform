import assert from "node:assert/strict";
import { test } from "node:test";
import { assemble, boot, run } from "@/lib/tiny-cpu/machine";
import { PRACTICE_BANK } from "./bank";
import { GENERATED_BANK, freshVariant, generatedCard } from "./generated";
import { hasLengthCue } from "./bank-quality";

const SEEDS = Array.from({ length: 40 }, (_, i) => i);

test("fresh-number cards are in the bank, under fixed ids, and each seed always gives the same card", () => {
  for (const card of GENERATED_BANK) {
    assert.ok(PRACTICE_BANK.some((q) => q.id === card.id), card.id);
    for (const seed of [0, 3, 17]) assert.deepEqual(generatedCard(card.id, seed), generatedCard(card.id, seed));
    assert.equal(generatedCard(card.id, 5)!.id, card.id);
  }
  // Ordinary cards pass through untouched.
  const plain = PRACTICE_BANK.find((q) => !q.id.startsWith("gen-"))!;
  assert.equal(freshVariant(plain, 4), plain);
});

test("consecutive reviews show different numbers", () => {
  for (const card of GENERATED_BANK) {
    for (const seed of SEEDS) {
      const a = JSON.stringify(generatedCard(card.id, seed));
      const b = JSON.stringify(generatedCard(card.id, seed + 1));
      assert.notEqual(a, b, `${card.id} seeds ${seed} and ${seed + 1}`);
    }
  }
});

test("every answer is right, checked independently", () => {
  for (const seed of SEEDS) {
    const b2d = generatedCard("gen-bin-to-dec", seed)!;
    if (b2d.kind !== "typed") throw new Error("kind");
    const bits = /byte ([01 ]+) in/.exec(b2d.prompt)![1].replace(/ /g, "");
    assert.equal(b2d.answers[0], String(parseInt(bits, 2)));

    const d2b = generatedCard("gen-dec-to-bin", seed)!;
    if (d2b.kind !== "bits") throw new Error("kind");
    assert.equal(parseInt(d2b.bits, 2), Number(/to (\d+)\./.exec(d2b.prompt)![1]));
    assert.match(d2b.bits, /^[01]{8}$/);

    const h2b = generatedCard("gen-hex-to-bin", seed)!;
    if (h2b.kind !== "typed") throw new Error("kind");
    assert.equal(parseInt(h2b.answers[0], 2), parseInt(/0x([0-9A-F]{2})/.exec(h2b.prompt)![1], 16));

    const twos = generatedCard("gen-twos", seed)!;
    if (twos.kind !== "typed") throw new Error("kind");
    const byte = parseInt(/byte ([01 ]+) as/.exec(twos.prompt)![1].replace(/ /g, ""), 2);
    assert.equal(Number(twos.answers[0]), new Int8Array([byte])[0]);

    const wrap = generatedCard("gen-wrap-add", seed)!;
    if (wrap.kind !== "typed") throw new Error("kind");
    const [, a, b] = /holds (\d+)\. You add (\d+)/.exec(wrap.prompt)!.map(Number);
    assert.equal(Number(wrap.answers[0]), new Uint8Array([a + b])[0]);

    const cpu = generatedCard("gen-cpu-trace", seed)!;
    if (cpu.kind !== "output") throw new Error("kind");
    const program = cpu.code.map((line) => line.replace(/^\d+: /, ""));
    const data: Record<number, number> = { 15: 1 };
    const m = /14 holds (\d+) and address 15 holds (\d+)/.exec(cpu.prompt);
    if (m) Object.assign(data, { 14: Number(m[1]), 15: Number(m[2]) });
    assert.equal(cpu.output, run(boot(assemble(program, data))).machine.out.join("\n"));
  }
});

test("generated cards follow the bank's quality rules", () => {
  for (const card of GENERATED_BANK) {
    for (const seed of SEEDS) {
      const q = generatedCard(card.id, seed)!;
      if (q.kind === "mcq") assert.equal(hasLengthCue(q), false);
      if (q.kind === "output") assert.ok(q.code.length > 0 && q.output.length > 0);
    }
  }
});
