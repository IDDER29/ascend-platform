# Course 5 — Computer Architecture: Building a CPU

**Foundations Curriculum v2.0 — Course 5 of 8**  
**Shared plan:** [Foundations overview](01_foundations_overview.md) · **FS-8 ISA:** Appendix A in this file  
**Navigation:** [Overview](01_foundations_overview.md) · [Previous course](05_course_04_state_and_memory.md) · [Next course](07_course_06_machine_language.md)

**Note:** All course project acceptance criteria, debugging tasks, transfer assessments and primary source links are preserved below. This course contains the normative FS-8 v1.0 machine specification in Appendix A. All other courses refer to this same specification.

**Course goal:** Turn an ALU and storage components into a programmable processor with a defined instruction set and traceable control flow.  
**Prerequisites:** Courses 3–4 and binary encodings from Course 2.  
**End-of-course ability:** Explain and implement the state transition performed by a complete CPU instruction.

## Lessons

| ID | Lesson | Description |
|---|---|---|
| F049 | CPU, Memory, and the Stored-Program Idea | Explain why instructions can be represented as data stored in memory and how a CPU differs from a calculator's single operation. |
| F050 | CPU Registers and the Datapath | Identify general-purpose registers and their connections to the ALU, memory and control signals. |
| F051 | Buses and Data Movement | Route values through internal connections and distinguish selecting a data source from changing stored state. |
| F052 | The Control Path | Explain control signals for selecting operands, selecting an ALU operation, writing registers, and accessing memory. |
| F053 | Instructions as Encoded Commands | Describe an instruction's opcode and operands, and connect each encoded command to a specific state change. |
| F054 | Designing a Tiny Instruction Set | Choose the minimal operations needed to move data, compute, branch and halt; distinguish the ISA contract from its circuit implementation. |
| F055 | Instruction Formats and Operand Fields | Specify how the FS-8 machine encodes opcodes, register identifiers and immediate/address fields; freeze format rules before the assembler is built. |
| F056 | The Program Counter | Use the PC to identify the next instruction address and explain normal advancement versus a branch target. |
| F057 | Fetching Instructions from Memory | Trace how the PC's address identifies instruction bytes and how those bytes reach the instruction decoder. |
| F058 | Decoding Instructions | Convert opcode and operand fields into control decisions, using defined examples rather than magical instruction names. |
| F059 | Executing ALU Instructions | Move operands to the ALU, compute a result, and write it to the declared destination while preserving unrelated state. |
| F060 | Executing Loads and Stores | Trace transfers between registers and addressed memory, explicitly separating the address from the transferred value. |
| F061 | Branching and Conditional Control | Explain how comparisons or flags affect the next PC value and make a loop possible at machine level. |
| F062 | A Multi-Step Control State Machine | Coordinate fetch, decode, execute and writeback as modeled control states; clarify that real processors use varied microarchitectures. |
| F063 | Complete CPU Trace and Verification | Step through a short program, inspect all registers, flags and changed memory locations, and compare actual transitions with a reference model. |

## Projects

**P5-A · Guided lab (non-gating) — Build the Datapath.** Connect Course 3's ALU and Course 4's registers/memory using selected inputs and explicit write-enables. **Accept:** independently test arithmetic and memory transfer instructions.

**P5-B · Required core milestone — The FS-8 CPU (v5).** Implement instruction fetch, decode, state changes and PC updates for the frozen **FS-8 v1.0 two-byte ISA (Appendix A)**. Give learners register and memory views alongside the active control signals. **Accept:** a machine-state test suite passes for all core opcodes, both taken and untaken branches, halt, and reset.

**P5-X · Optional extension — Two Implementations, One ISA.** Compare a simple single-cycle reference with a conceptual multistep controller implementing the same observable instruction effects; avoid advanced pipeline design.

### Independent debugging and unseen transfer

**Independent debugging challenge (D5):** A `JNZ` loop executes one iteration too many because the zero flag is not updated after `DEC`. Trace the first divergence, repair the control/state transition, and test taken and untaken branches. **Unseen transfer:** explain an instruction trace in a different initial CPU state. **Evidence:** full state deltas, not just final output.

**Feeds into:** Course 6 adds a programmer-facing notation and an assembler for precisely the same instruction set; later high-level programs target this CPU or a clearly labeled real CPU example.

**Primary curriculum anchors:** [Nand2Tetris Projects 4–5](https://www.nand2tetris.org/course), [MIT: Designing an Instruction Set](https://computation-structures.github.io/course/lectures/L09_Designing_an_Instruction_Set.html), [Ben Eater control logic](https://eater.net/8bit/control).

---

---

# Appendix A — FS-8 v1.0 Machine Specification (normative)

> **Scope:** This appendix defines the educational machine used by the CPU, assembler, translator, debugger, tests and project progression. **FS-8 is invented for teaching**, and its instruction set is *not* the RISC-V ISA, x86-64 ISA, a full C target, or a protected operating-system platform. A later change requires explicit versioning rather than silent edits.

## A.1 State, widths and initialization

- **Bits/bytes:** one byte is exactly eight bits; every general-purpose register and RAM cell contains an integer in `0..255`.
- **Registers:** `R0`, `R1`, `R2`, `R3` (eight bits each), `PC` (eight-bit byte address), `SP` (eight-bit stack pointer), and `Z` (one Boolean zero flag). `SP` is special-purpose and not encoded as an ordinary `R` register.
- **Memory:** one array `mem[0x00..0xFF]`, **256 bytes total**, unified instruction/data storage. RAM is modeled as deterministic, instantly readable/writable at the instruction-state level. Circuit lessons may illustrate internal multi-cycle signals without changing externally visible instruction semantics.
- **I/O:** one **port-based** byte output event (`OUT`) and one modeled input FIFO (`IN`); no memory-mapped registers in v1.0. Output append log and input queue are part of *simulator state*, not RAM.
- **Initial state after a reset/load:** `R0..R3=0`, `PC=0x00`, `SP=0xF0`, `Z=0`, output log empty, input queue as explicitly supplied by the test, `halted=false`, and all 256 RAM bytes zero before loading program and initialized data.
- **Instruction step:** the primary learner-facing **Step** executes **one complete instruction**, producing a before/after state delta. A secondary **Microstep** display is illustrative control sequencing, not an independent second ISA.
- **8-bit arithmetic:** arithmetic results are taken modulo 256 (`value & 0xFF`); signed two's complement is an interpretation, not a property of RAM or register cells. There is no carry/negative/overflow flag in v1.0.

## A.2 Memory-map conventions and boundaries

| Byte range | Default software convention | Enforcement |
|---|---|---|
| `0x00–0x7F` | Program instructions (up to 64 two-byte instructions) | **Fetch requires PC to be even and inside this region**. Memory writes are **not** hardware-blocked, so self-modifying code is possible, but it is not taught as a basic technique. |
| `0x80–0xBF` | Variables, arrays and initialized data (64 bytes) | Placement convention in the assembler/translator; direct loads/stores can technically access any RAM byte. |
| `0xC0–0xEF` | Bounded downward-growing stack (48 bytes) | `PUSH`/`CALL`/`POP`/`RET` enforce the stack bounds; ordinary load/store does not implement protection. |
| `0xF0–0xFF` | Scratch memory, optional instructor tests | Ordinary RAM; no I/O is mapped here. `SP=0xF0` initially points **above** the top occupied stack byte. |

**Do not misteach:** The above are **software conventions, not virtual address spaces or memory protection**. Modern machines may have physical/virtual addressing, MMUs, caches, privilege levels and more. `FS-8` does not.

## A.3 Universal two-byte instruction encoding

Each instruction is **exactly two bytes**, stored at `PC` and `PC+1`. Valid instruction addresses are the even byte addresses `0x00, 0x02, …, 0x7E`.

```text
First byte (byte0):  [ opcode:5 bits ][ Rd:2 bits ][ reserved:1 bit = 0 ]
                     bits 7.....3      bits 2..1      bit 0
Second byte (byte1): interpretation depends on instruction format:
  R (register) : [ Rs:2 bits ][ reserved:6 bits = 0 ]
  I (immediate): [ immediate unsigned 8-bit value ]
  A (absolute) : [ unsigned 8-bit byte address ]
  J (jump)     : [ code target byte address, even, 0x00..0x7E ]
  U (unary)    : [ all zero ]
  N (no args)  : [ all zero ] and Rd=0
```

`Rd` selects the destination register for operations that write a register; for `STA`, `STR`, `OUT`, `PUSH`, `CMP`, `CMPI` it identifies the source or tested register. In an `R` instruction, `Rs` is encoded in the **top two bits** of byte1. All reserved bits **must** be zero, otherwise the instruction is invalid. `J`/`N` instructions require `Rd=0`. `CALL` and `RET` are part of **FS-8 v1.0** from the start, though learners encounter them in Course 6.

To encode: `byte0 = (opcode << 3) | (Rd << 1)` where missing Rd is zero. For register format, `byte1 = Rs << 6`. For `I`, `A` or `J`, byte1 is the eight-bit operand. There are no variable-length instructions, implicit prefixes, or hidden addressing modes.

## A.4 Frozen FS-8 instruction vocabulary

| Opcode (decimal / hex) | Mnemonic | Format | Observable effect |
|---|---|---|---|
| `0 / 00` | `NOP` | N | No register/memory change; advance PC by 2. |
| `1 / 01` | `LDI Rd, imm` | I | `Rd ← imm`; Z unchanged. |
| `2 / 02` | `LDA Rd, [addr]` | A | `Rd ← mem[addr]`; Z unchanged. |
| `3 / 03` | `STA Rd, [addr]` | A | `mem[addr] ← Rd`; Z unchanged. |
| `4 / 04` | `MOV Rd, Rs` | R | `Rd ← Rs`; Z unchanged. |
| `5 / 05` | `ADD Rd, Rs` | R | `Rd ← (Rd+Rs) mod 256`; update Z from result. |
| `6 / 06` | `SUB Rd, Rs` | R | `Rd ← (Rd−Rs) mod 256`; update Z. |
| `7 / 07` | `AND Rd, Rs` | R | `Rd ← Rd & Rs`; update Z. |
| `8 / 08` | `OR Rd, Rs` | R | `Rd ← Rd \| Rs`; update Z. |
| `9 / 09` | `XOR Rd, Rs` | R | `Rd ← Rd ^ Rs`; update Z. |
| `10 / 0A` | `SHL Rd, imm` | I | Logical left shift by `imm` (must be `0..7`); mask to 8 bits, update Z. |
| `11 / 0B` | `SHR Rd, imm` | I | Logical **unsigned** right shift by `imm` (`0..7`); update Z. |
| `12 / 0C` | `CMP Rd, Rs` | R | Set `Z = 1` iff `Rd == Rs`; registers unchanged. |
| `13 / 0D` | `JMP addr` | J | Set PC to a valid target. |
| `14 / 0E` | `JZ addr` | J | If `Z=1`, set PC to target; else advance by 2. |
| `15 / 0F` | `JNZ addr` | J | If `Z=0`, set PC to target; else advance by 2. |
| `16 / 10` | `OUT Rd` | U | Append `Rd` byte to virtual display/output event log; Z unchanged. |
| `17 / 11` | `PUSH Rd` | U | `SP ← SP−1`, then `mem[SP] ← Rd`; check stack bounds; Z unchanged. |
| `18 / 12` | `POP Rd` | U | `Rd ← mem[SP]`, then `SP ← SP+1`; check stack bounds; Z unchanged. |
| `19 / 13` | `CALL addr` | J | Push return byte address `old PC+2`, then jump to valid target. |
| `20 / 14` | `RET` | N | Pop PC from stack; validate it as an even in-range code address. |
| `21 / 15` | `HALT` | N | Set `halted=true`; **PC remains pointing at HALT**. |
| `22 / 16` | `INC Rd` | U | `Rd ← (Rd+1) mod 256`; update Z. |
| `23 / 17` | `DEC Rd` | U | `Rd ← (Rd−1) mod 256`; update Z. |
| `24 / 18` | `LDR Rd, [Rs]` | R | `Rd ← mem[Rs]`; indirect address is value held in Rs; Z unchanged. |
| `25 / 19` | `STR Rd, [Rs]` | R | `mem[Rs] ← Rd`; Z unchanged. |
| `26 / 1A` | `ADDI Rd, imm` | I | `Rd ← (Rd+imm) mod 256`; update Z. |
| `27 / 1B` | `SUBI Rd, imm` | I | `Rd ← (Rd−imm) mod 256`; update Z. |
| `28 / 1C` | `CMPI Rd, imm` | I | `Z=1` iff `Rd==imm`; register unchanged. |
| `29 / 1D` | `IN Rd` | U | Remove next byte from virtual input FIFO into Rd; Z unchanged; pause with `BLOCKED_INPUT` if empty, **without changing machine state**. |
| `30–31 / 1E–1F` | Reserved | — | Fault if decoded; never silently executed as NOP. |

**Flag rule:** Only `ADD`, `SUB`, `AND`, `OR`, `XOR`, `SHL`, `SHR`, `CMP`, `INC`, `DEC`, `ADDI`, `SUBI`, `CMPI` write `Z`. Every other instruction preserves its previous value. A `CMP`/`CMPI` tests equality only; there is no greater-than/less-than branch in this base ISA.

**Execution rule:** Validate the entire instruction encoding before changing state. For ordinary instructions, `PC` becomes `old PC+2` (an eight-bit value) unless a branch/call/return overrides it. The next fetch will raise `BAD_PC` if that value is outside the valid code region or odd. `HALT` is not a PC advance. **All J-format target addresses are checked during decode, even when a conditional branch is not taken.** `CALL` also validates its return address. All faults are **atomic**: machine state remains as it was before the invalid instruction.

**Stack rule:** `SP` begins at `0xF0`, and valid occupied stack addresses are `0xC0..0xEF`. `PUSH`/`CALL` decrement before writing. `POP`/`RET` read before incrementing. `SP==0xC0` cannot be pushed again; `SP==0xF0` cannot be popped. An invalid stack operation raises `STACK_OVERFLOW` or `STACK_UNDERFLOW` without partial effects. The stack stores one byte per pushed value, including return addresses (which are eight-bit byte addresses in this toy machine). Do not claim this is a real C ABI.

**Device rule:** `OUT Rd` is a privileged-free virtual **port operation**, with output appended as a byte event to a simulator log. It is **not** a Linux syscall, C `printf`, or a memory-mapped hardware register. `IN` consumes a queued byte, and with no data **pauses** without touching registers, flags or PC. The course may visualize output as numbers or characters using a chosen encoding; that display choice does not change the emitted byte.

## A.5 Required golden test vectors

Use these same scenarios to check **the CPU interpreter**, **assembler**, **disassembler**, **lesson stepper**, **translator-generated programs**, and **fault-injection harness** as relevant. Test IDs and expected states are mandatory, not optional narrative examples.

| Test ID | Assembly at byte addresses | Expected after halt or pause |
|---|---|---|
| `T01_WRAP` | `00: LDI R0,255` · `02: ADDI R0,1` · `04: HALT` | `R0=0`, `Z=1`, `PC=0x04`, `halted=true`. |
| `T02_MEM` | `00: LDI R0,3` · `02: STA R0,[0x80]` · `04: LDA R1,[0x80]` · `06: HALT` | `mem[0x80]=3`, `R1=3`, `PC=0x06`, `Z=0`. |
| `T03_LOOP` | `00: LDI R0,2` · `02: DEC R0` · `04: JNZ 0x02` · `06: OUT R0` · `08: HALT` | `R0=0`, `Z=1`, output log `[0]`, `PC=0x08`, halted. |
| `T04_CALL` | `00: CALL 0x06` · `02: OUT R0` · `04: HALT` · `06: LDI R0,7` · `08: RET` | `R0=7`, output `[7]`, `SP=0xF0`, `PC=0x04`, halted; call wrote return byte `0x02` to `mem[0xEF]`. |
| `T05_ENCODE` | `LDI R0,255` then `ADDI R0,1` then `HALT` | Encoded bytes: `08 FF D0 01 A8 00` (hex), at addresses `00..05`. |
| `T06_REG` | `00: LDI R1,9` · `02: MOV R0,R1` · `04: HALT` | `R0=9`, `R1=9`; `MOV` encoding `20 40` (hex). |
| `T07_BAD_PC` | `00: JMP 0x03` | `BAD_PC` before state change; `PC=0x00` and other state unchanged. |
| `T08_BAD_OP` | Raw `F8 00` at address 0 (`opcode=31`) | `INVALID_OPCODE`; no state change. |
| `T09_EMPTY_INPUT` | `00: IN R0` with empty input FIFO | `BLOCKED_INPUT`; registers, flag, PC and RAM unchanged; resume once input arrives. |
| `T10_STACK_UNDER` | `00: RET` from reset state | `STACK_UNDERFLOW`; `SP=0xF0`, PC unchanged. |

**Boundary-test families:** Include both `JZ` paths, nested calls/returns, stack full/empty limits, `SHL`/`SHR` shift count `8` rejection, reserved-field rejection, indirect `LDR`/`STR`, store into instruction RAM (show *lack of protection*), and execution falling off `0x7E` into invalid `0x80` after a non-HALT instruction. Implementers must add tests for every opcode and every documented fault.

## A.6 Translator contract (Course 7)

The tiny language uses **unsigned 8-bit integers** and deliberately narrow syntax: `var name = integer;`, `name = expression;`, `if (name == 0) { ... }`, `while (name != 0) { ... }`, and `output(name);`. Expressions contain literals, variable names, `+` and `-`, with explicitly specified evaluation order; operations wrap modulo 256. A language may have syntactic sugar, but the graded subset must be frozen and documented. It **is not conforming C** (no pointers, C integer promotions, arbitrary-width ints, undefined-behavior contract, or full function model).

- Variables are statically assigned distinct locations in `0x80..0xBF`; out-of-space programs receive a readable compile-time error.
- The translator may use `0xF0..0xFF` scratch RAM and `R0..R3` according to a documented register/temporary convention; it may not overwrite stack memory or silently use unallocated variable bytes.
- Generated code is limited to `0x00..0x7F` (at most **64** fixed two-byte instructions). Oversized code receives a compile-time error, not truncation.
- `if` and `while` use comparison and explicit branch instructions; arrays and user-defined functions can be later **optional extensions**, never claimed implemented when absent.
- Use deterministic tests for arithmetic wrap, repeated assignment, nested `if`/`while` within supported grammar, branch relocation, out-of-memory and out-of-code errors, and matching high-level versus FS-8 observable output.
- The loader initializes RAM and CPU according to A.1; the translator does not secretly introduce memory protection, system calls, a file format, or floating-point behavior.

**Real C separation:** P7-C uses actual C compiled for a real target; its binaries and assembly must **never** be represented as being executed on FS-8 or generated by the toy translator. Course 8 presents them as **two explicit pipelines** with contrasting guarantees and environments.

## A.7 Implementation invariants and change control

- **One source of truth:** ISA encoding, opcode semantics, `Z`, stack, memory-map convention and I/O are a machine-readable spec shared by tests and teaching tools. This Markdown appendix is the human-readable normative contract.
- **Golden reference:** implement a small deterministic state-transition interpreter; test it first, independently of learner-built gate simulations.
- **Round-trip properties:** assembler → bytes → disassembler → equivalent assembly; interpreter traces match golden test vectors; changes in circuit implementation do not change architectural results.
- **Deterministic faults:** invalid opcode/field/target/stack operation produces a named fault with **no partial state mutation**. `BLOCKED_INPUT` is a resumable wait, not a hardware exception.
- **Versioning:** freeze this as `FS-8-ISA v1.0`. Any change to instruction formats or semantics requires `v2.0`, migration notes, and regenerated tests; additive visual explanations alone require no ISA change.
- **Transparency:** show learners the current ISA spec, state schema, example machine-code bytes, and the difference between illustrative control timing and architectural machine state.

---
