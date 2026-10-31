# The tiny CPU, version 2 (2026-11-01)

## Why a second version
Version 1 (`src/lib/tiny-cpu/machine.ts`, Ben Eater's 8-bit instruction set) has 16 bytes of memory and one working register. That is right for Build a CPU: small enough that a learner sees every bit change. It can't carry Assembly Language, From Source to Machine or The Complete System, which need a stack, subroutine calls, input, room for a program worth assembling, and room for a translator's output.

## Decision
Version 2 is the curriculum blueprint's **FS-8 v1.0**, adopted exactly as specified (Appendix A of `docs/curriculum/sugestion/06_course_05_cpu_architecture.md`): it is already precise, with golden tests, so we don't invent our own.

- 256 bytes; R0–R3, PC, SP and a zero flag Z (no carry flag).
- Fixed two-byte instructions at even addresses 0x00–0x7E: `byte0 = opcode << 3 | Rd << 1`, byte1 by format (R: `Rs << 6`; I, A, J: the operand; U, N: 0). Reserved bits must be 0.
- 30 instructions: NOP, LDI, LDA, STA, MOV, ADD, SUB, AND, OR, XOR, SHL, SHR, CMP, JMP, JZ, JNZ, OUT, PUSH, POP, CALL, RET, HALT, INC, DEC, LDR, STR, ADDI, SUBI, CMPI, IN.
- Memory map by convention only (no protection): code 0x00–0x7F, data 0x80–0xBF, stack 0xC0–0xEF (SP starts at 0xF0, grows down, 48 bytes), scratch 0xF0–0xFF.
- Faults change nothing: BAD_PC, INVALID_OPCODE, INVALID_FIELD (a reserved bit, a register in an N/J instruction, a shift over 7), STACK_OVERFLOW, STACK_UNDERFLOW. IN with no input is BLOCKED (resumable), not a fault.

The blueprint names BAD_PC, INVALID_OPCODE and the stack faults; "reserved-field rejection" has no name there, so we call it INVALID_FIELD (our call).

## Where it lives
- `src/lib/tiny-cpu/v2.ts`: `encode`, `decode`, a two-pass `assemble` (labels resolve to byte addresses; `;` comments; `[0x80]` and `[R1]` memory operands), `disassemble`, `boot`, `step`, `run`.
- `src/lib/tiny-cpu/v2.test.ts`: the ten golden vectors T01–T10 and the boundary families (both JZ paths, nested calls, stack limits, shift 8 refused, reserved bits, LDR/STR, writing over code, running off 0x7E, which instructions write Z, round trip).
- `<TinyCpu2 caption programJson dataJson inputJson>` (`src/components/lesson/tiny-cpu-2.tsx`): the program with the next instruction marked, registers and Z, the 256 bytes shaded by region, output and input, Step/Run/Reset, and a plain-words line for every step, fault or wait.

## How lessons use it
Build a CPU stays on version 1. Assembly Language opens by introducing version 2 as "the same idea, grown up": more memory, more registers, and a stack. Lessons never redefine its behaviour; a change to the instruction set is version 3, with migration notes and new golden tests.
