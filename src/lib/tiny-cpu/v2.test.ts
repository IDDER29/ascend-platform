import assert from "node:assert/strict";
import { test } from "node:test";
import { assemble, boot, decode, disassemble, encode, run, step, STACK_BOTTOM, STACK_TOP } from "./v2";

const go = (src: string[], data = {}, input: number[] = []) => run(boot(assemble(src, data), input));
const hexBytes = (mem: number[], n: number) =>
  mem.slice(0, n).map((b) => b.toString(16).toUpperCase().padStart(2, "0")).join(" ");

// The blueprint's golden vectors (Appendix A.5), T01–T10.
test("T01_WRAP: 255 + 1 wraps to 0 and sets Z", () => {
  const { machine, stop } = go(["LDI R0, 255", "ADDI R0, 1", "HALT"]);
  assert.equal(stop, "halted");
  assert.deepEqual([machine.r[0], machine.z, machine.pc, machine.halted], [0, true, 0x04, true]);
});

test("T02_MEM: store then load", () => {
  const { machine } = go(["LDI R0, 3", "STA R0, [0x80]", "LDA R1, [0x80]", "HALT"]);
  assert.deepEqual([machine.mem[0x80], machine.r[1], machine.pc, machine.z], [3, 3, 0x06, false]);
});

test("T03_LOOP: DEC and JNZ count down to 0", () => {
  const { machine } = go(["LDI R0, 2", "loop: DEC R0", "JNZ loop", "OUT R0", "HALT"]);
  assert.deepEqual([machine.r[0], machine.z, machine.out, machine.pc, machine.halted], [0, true, [0], 0x08, true]);
});

test("T04_CALL: call, return, and the return byte on the stack", () => {
  const { machine } = go(["CALL 0x06", "OUT R0", "HALT", "LDI R0, 7", "RET"]);
  assert.deepEqual([machine.r[0], machine.out, machine.sp, machine.pc, machine.halted], [7, [7], 0xf0, 0x04, true]);
  assert.equal(machine.mem[0xef], 0x02);
});

test("T05_ENCODE and T06_REG: the exact bytes", () => {
  assert.equal(hexBytes(assemble(["LDI R0, 255", "ADDI R0, 1", "HALT"]), 6), "08 FF D0 01 A8 00");
  const t06 = assemble(["LDI R1, 9", "MOV R0, R1", "HALT"]);
  assert.equal(hexBytes(t06.slice(2), 2), "20 40");
  const { machine } = run(boot(t06));
  assert.deepEqual([machine.r[0], machine.r[1]], [9, 9]);
});

test("T07_BAD_PC: a jump to an odd address faults before changing anything", () => {
  const mem = new Array(256).fill(0);
  [mem[0], mem[1]] = [13 << 3, 0x03]; // JMP 0x03, which the assembler refuses to write
  const m = boot(mem);
  const r = step(m);
  assert.equal(r.kind, "fault");
  if (r.kind === "fault") assert.equal(r.fault, "BAD_PC");
  assert.equal(r.machine, m);
  assert.equal(m.pc, 0);
  assert.throws(() => assemble(["JMP 0x03"]));
});

test("T08_BAD_OP: opcode 31 is invalid", () => {
  const mem = new Array(256).fill(0);
  [mem[0], mem[1]] = [0xf8, 0x00];
  const r = step(boot(mem));
  assert.equal(r.kind === "fault" && r.fault, "INVALID_OPCODE");
});

test("T09_EMPTY_INPUT: IN with nothing waiting blocks without changing state, then resumes", () => {
  const m = boot(assemble(["IN R0", "OUT R0", "HALT"]));
  const blocked = step(m);
  assert.equal(blocked.kind, "blocked");
  assert.equal(blocked.machine, m);
  const { machine } = run({ ...m, input: [42] });
  assert.deepEqual(machine.out, [42]);
});

test("T10_STACK_UNDER: RET from reset underflows", () => {
  const r = step(boot(assemble(["RET"])));
  assert.equal(r.kind === "fault" && r.fault, "STACK_UNDERFLOW");
  assert.equal(r.machine.sp, STACK_TOP);
  assert.equal(r.machine.pc, 0);
});

// Boundary families.
test("both JZ paths", () => {
  assert.deepEqual(go(["LDI R0, 1", "CMPI R0, 1", "JZ yes", "OUT R0", "yes: HALT"]).machine.out, []);
  assert.deepEqual(go(["LDI R0, 2", "CMPI R0, 1", "JZ yes", "OUT R0", "yes: HALT"]).machine.out, [2]);
});

test("nested calls return in order", () => {
  const { machine } = go([
    "CALL a",
    "HALT",
    "a: LDI R0, 1",
    "OUT R0",
    "CALL b",
    "OUT R0",
    "RET",
    "b: LDI R0, 2",
    "OUT R0",
    "RET",
  ]);
  assert.deepEqual(machine.out, [1, 2, 2]);
  assert.equal(machine.sp, STACK_TOP);
});

test("the stack holds 48 bytes: the 49th push overflows, and nothing changes", () => {
  const src = ["loop: PUSH R0", "JMP loop"];
  const { machine, stop, fault } = go(src);
  assert.equal(stop, "fault");
  assert.equal(fault, "STACK_OVERFLOW");
  assert.equal(machine.sp, STACK_BOTTOM);
  assert.equal(STACK_TOP - STACK_BOTTOM, 48);
  assert.equal(step(boot(assemble(["POP R0"]))).kind, "fault");
});

test("shift counts are 0 to 7; 8 is refused", () => {
  assert.deepEqual(go(["LDI R0, 3", "SHL R0, 2", "OUT R0", "SHR R0, 3", "OUT R0", "HALT"]).machine.out, [12, 1]);
  assert.deepEqual(go(["LDI R0, 255", "SHL R0, 7", "OUT R0", "HALT"]).machine.out, [128]);
  assert.throws(() => assemble(["SHL R0, 8"]));
  assert.equal(decode(10 << 3, 8).ok, false);
});

test("reserved bits must be 0", () => {
  assert.equal(decode((1 << 3) | 1, 5).ok, false); // bit 0 of byte0
  assert.equal(decode(5 << 3, 0b0100_0001).ok, false); // ADD with low bits of byte1 set
  assert.equal(decode((21 << 3) | (1 << 1), 0).ok, false); // HALT with a register
  assert.equal(decode(16 << 3, 1).ok, false); // OUT with a non-zero byte1
});

test("LDR and STR use the address held in a register", () => {
  const { machine } = go(["LDI R1, 0x90", "LDI R0, 7", "STR R0, [R1]", "LDR R2, [R1]", "OUT R2", "HALT"]);
  assert.equal(machine.mem[0x90], 7);
  assert.deepEqual(machine.out, [7]);
});

test("nothing protects the code: a store can overwrite an instruction", () => {
  const { machine } = go(["LDI R0, 0xA8", "STA R0, [0x06]", "LDI R1, 0", "NOP", "LDI R0, 9", "OUT R0", "HALT"]);
  // 0x06 was NOP's opcode byte; it's now HALT's, so the program stops before OUT.
  assert.deepEqual(machine.out, []);
  assert.equal(machine.pc, 0x06);
});

test("running off the end of the code area faults", () => {
  const src = Array.from({ length: 64 }, () => "NOP");
  const { stop, fault, machine } = go(src);
  assert.deepEqual([stop, fault, machine.pc], ["fault", "BAD_PC", 0x80]);
  assert.throws(() => assemble([...src, "HALT"]));
});

test("only the listed instructions write Z", () => {
  const { machine } = go(["LDI R0, 0", "ADDI R0, 0", "LDI R1, 5", "MOV R2, R1", "HALT"]);
  assert.equal(machine.z, true); // ADDI set it; LDI and MOV left it alone
});

test("assemble and disassemble round-trip", () => {
  const src = ["LDI R0, 5", "LDA R1, [0x80]", "STA R2, [0x81]", "ADD R0, R1", "LDR R3, [R2]", "JNZ 0x00", "OUT R0", "PUSH R1", "CALL 0x10", "HALT"];
  const mem = assemble(src);
  const back = disassemble(mem, (src.length - 1) * 2).map((l) => l.replace(/^0x[0-9A-F]+: /, ""));
  assert.deepEqual(assemble(back), mem);
  assert.deepEqual(encode("MOV", 0, 1), [0x20, 0x40]);
});

test("assembler errors are readable", () => {
  assert.throws(() => assemble(["FOO R0"]), /no instruction called/);
  assert.throws(() => assemble(["LDI R4, 1"]), /register/);
  assert.throws(() => assemble(["LDA R0, 0x80"]), /brackets/);
  assert.throws(() => assemble(["a: NOP", "a: NOP"]), /twice/);
  assert.throws(() => assemble(["HALT"], { 0: 1 }), /overwrite/);
});
