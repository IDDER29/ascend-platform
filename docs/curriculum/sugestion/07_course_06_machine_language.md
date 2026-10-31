# Course 6 — Machine Language and Assembly Programming

**Foundations Curriculum v2.0 — Course 6 of 8**  
**Shared plan:** [Foundations overview](01_foundations_overview.md) · **Machine ISA:** [FS-8 v1.0 specification in Course 5](06_course_05_cpu_architecture.md)  
**Navigation:** [Overview](01_foundations_overview.md) · [Previous course](06_course_05_cpu_architecture.md) · [Next course](08_course_07_source_to_execution.md)

**Note:** All course project acceptance criteria, debugging tasks, transfer assessments and primary source links are preserved below. FS-8 machine rules are defined normatively in the appendix to Course 5, not separately in each course.

**Course goal:** Program the CPU, understand binary instructions through assembly, and construct the first translation tool.  
**Prerequisites:** Course 5.  
**End-of-course ability:** Write, assemble, execute, and debug a small program with a branch and memory operations.

## Lessons

| ID | Lesson | Description |
|---|---|---|
| F064 | Machine Code Versus Assembly Language | Explain why assembly mnemonics are human-readable notation for architecture-specific instructions, not a universal language. |
| F065 | Operands, Registers, Immediate Values, and Addresses | Distinguish a literal value, a register identifier, a memory location and the data found at that location. |
| F066 | Loading and Storing Values | Program transfers between registers and memory, then explain the exact state changes. |
| F067 | Arithmetic, Logic, and Flags in Assembly | Write machine-level arithmetic/logic sequences and inspect their results and condition flags. |
| F068 | Comparisons and Conditional Branches | Use a test or comparison followed by a conditional branch to select execution paths. |
| F069 | Loops as Repeated Jumps | Transform a counter loop into labels, state updates and branches; trace termination correctly. |
| F070 | Symbolic Labels and Address Resolution | Explain why programmers name branch targets and why the assembler must resolve labels to numerical addresses. |
| F071 | Assembler Pass One: Discovering Symbols | Walk through source lines to calculate instruction locations and build a symbol table. |
| F072 | Assembler Pass Two: Encoding Instructions | Turn parsed assembly statements and resolved labels into machine-code bytes matching the frozen FS-8 ISA. |
| F073 | The Stack as a Memory Convention | Model push/pop using an explicitly documented stack pointer and memory region; distinguish a stack convention from a special type of RAM. |
| F074 | Calls, Return Addresses, and Subroutines | Use FS-8 v1.0 `CALL`/`RET` and the defined downward-growing stack to save and restore return addresses; keep advanced real-world ABIs for the C/systems path. |
| F075 | Input, Output, and a Simple Device | Execute an instruction that communicates with the modeled output device and explain the CPU–device boundary. |
| F076 | Debugging at Machine Level | Use stepping, breakpoints, register dumps and memory changes to locate a faulty instruction or unexpected branch. |
| F077 | Assemble and Run a Complete Program | Combine loops, data transfer, arithmetic, device output and optionally subroutines into a documented, testable program. |

## Projects

**P6-A · Guided lab (non-gating) — Assembly Puzzle Set.** Complete short instruction sequences that perform addition, memory copy, countdown, and conditional selection. **Accept:** programs produce the intended register/memory states, not merely the right final printed number.

**P6-B · Required core milestone — The Assembler and Monitor (v6).** Implement or interactively construct a two-pass assembler for **FS-8 v1.0**, a program loader, disassembler and stepper. It must use **byte addresses** for labels and advance the location counter by **two bytes per instruction**. Run programs on the Course 5 CPU and display their symbolic and binary forms side by side. **Accept:** assembler output round-trips through disassembly on the defined subset; label addresses are correct; branch and stack edge cases pass tests.

**P6-X · Optional extension — Subroutine Library.** Add a few reusable assembly routines, then test call nesting and correct returns. The optional library uses the **existing** v1.0 `CALL`/`RET` semantics; no hidden ISA extension is permitted.

### Independent debugging and unseen transfer

**Independent debugging challenge (D6):** A two-pass assembler calculates a label as an *instruction index* instead of the required *byte address*. Find the wrong branch target and repair symbol resolution. **Unseen transfer:** hand-encode a new 3-instruction program, including one jump. **Evidence:** correct bytes and machine execution.

**Feeds into:** The instruction encoder, assembler and executable machine supply the backend for the tiny-language translator in Course 7.

**Primary curriculum anchors:** [Nand2Tetris Project 6](https://www.nand2tetris.org/project06), [MIT assembly language](https://computation-structures.github.io/course/lectures/L10a_Assembly_Language.html), [Ben Eater 8-bit computer](https://eater.net/8bit).

---

