# Foundations curriculum: five courses (2026-10-31)

## Update: eight courses, from the curriculum blueprint (2026-10-31)
The blueprint in `docs/curriculum/sugestion/` (v2: 8 courses, 106 lessons F001–F106, a guided lab, a core milestone and an optional extension per course, plus a required real-C task) replaces the five-course plan below. Decisions:

- **All 106 lessons have a home.** Each outline item lists the blueprint ids it `covers`; a live lesson that already teaches several (Binary & number bases covers F010–F012 and F014) stands for all of them. `src/lib/paths/outline-descriptions.test.ts` checks every id and project has exactly one home.
- **Eight courses**: Computers & Information, Binary & Data, Logic & Circuits, State & Memory, Build a CPU, Assembly Language, From Source to Machine, The Complete System (`catalog.ts`). 17 live items, 95 coming soon.
- **Every outline item has a one-sentence description**, shown under its title on the path pages so a learner can read what a lesson teaches without opening it. This applies to every path, not just Foundations.
- **Moved lessons keep their links**: What is a bit? (now Computers & Information), Memory as numbered boxes (State & Memory, Memory and storage) and Input and output (The Complete System) redirect from their old URLs (`FOUNDATIONS_MOVED`).
- **Projects are things a learner builds**, not platform features: the Machine Atlas becomes "map a computer you use"; the 8-bit ALU replaces the 4-bit calculator; the memory board, the tiny CPU, an assembler, a tiny-language translator and inspecting real compiled C follow the blueprint. Optional extensions are titled "Optional project".
- **Two versions of one machine.** Build a CPU keeps the tiny CPU (version 1). From Assembly Language on, lessons use version 2, which is the blueprint's FS-8 v1.0 adopted exactly (`docs/superpowers/specs/2026-11-01-tiny-cpu-v2-design.md`).

## Goal
Foundations is the shared base of every path (Systems/C, OS, Linux, networking, Python/AI). It should leave a beginner with no background able to explain, from the bottom up, how a computer stores data, computes, remembers, runs instructions, and how code they write becomes a running program, so the C and OS material that follows is never magic.

## Research (two passes, compared)
- **nand2tetris** (Elements of Computing Systems): Boolean logic → Boolean arithmetic (adders, ALU) → Memory (registers, RAM) → Computer architecture → Machine language → Assembler, then VM, compiler, OS.
- **Petzold, Code**: binary → bytes and hex → ASCII to Unicode → adding with gates → subtraction → feedback and flip-flops → a clock → memory → the ALU → registers and buses → CPU control signals → loops, jumps and calls → peripherals → the OS → coding.
- **Crash Course Computer Science** #1–#16: gates → binary numbers and letters → ALU → registers and RAM → CPU → instructions and programs → early languages.
- **Teach Yourself CS**: computer architecture is the most neglected area; nand2tetris ch. 1–6 or CS:APP ch. 1–6.
- **Second pass** (an AI research summary, checked): adds bitwise operations, floating point, data widths, state machines, the ISA vs microarchitecture distinction, the compile → assemble → link → load pipeline, the call stack (Patt & Patel put "And, Finally… The Stack" right before C), memory-mapped I/O and the OS boundary. Marks performance (CPI, Amdahl, pipelining) as optional and transistor physics as optional.

All sources agree on the chain: representation → logic → combinational circuits → sequential state → registers/RAM/PC → ISA and machine language → fetch-decode-execute → assembly → compile/link/load → calls and the stack → I/O and the OS boundary. A common ordering mistake to avoid: teaching fetch-execute before registers, RAM and the PC.

## Decisions
Five courses, 35 items (a course is a group of outline sections in `src/lib/paths/foundations-outline.ts`, named in `catalog.ts`; lessons keep their level, slug and progress keys):

1. **Bits & Data**: numbers in binary (bit, binary/hex, two's complement, *bitwise ops and masks*); text, sizes and fractions (bytes/words/types, ASCII/UTF-8, *floating point*).
2. **Logic & Circuits**: logic & gates (Boolean, gates, half-adder project, full/4-bit adder); circuits that calculate (mux/decoder, *the ALU*, 4-bit calculator project).
3. **Memory & State**: latches/flip-flops, clock and registers, memory as numbered boxes, *state machines*.
4. **Build a CPU**: *an instruction set*; fetch-execute, *jumps and loops*, gates to a tiny CPU (datapath and control), *input and output*, tiny-CPU project.
5. **From Hardware to Software**: *assembly and the assembler*, compilers and interpreters, *compile/link/load*; *functions and the call stack*, *the OS: processes and system calls*.

Italic = added from the research.

**Left out on purpose** (taught later, in other paths): performance formulas and pipelining; caches beyond a mention; real x86/ARM assembly; stack/heap and the address space in depth (Systems: Machine & Memory); OS internals; compiler construction; algorithms and data structures; transistor/CMOS physics (the digital abstraction is enough).

**Overlap with Systems Programmer** is deliberate: Foundations teaches each idea on a tiny made-up CPU and at the concept level; Machine & Memory, C and Systems revisit assembly, the stack and system calls on a real machine.

## Graduation standard (added from a third research pass)
> Given a small program, the tiny CPU and a memory diagram, a learner can explain what every instruction does, where the data lives, how the machine's state changes, and why the program produces its result.

Every lesson and project serves this. It is tested by the final project, "Trace a program end to end".

## One machine all the way through
Research on notional machines (Sorva's review of runtime models in introductory programming) supports teaching one explicit, simplified machine rather than leaving beginners to invent one. Foundations uses **one tiny CPU** throughout Build a CPU and From Hardware to Software: the instruction set of Ben Eater's 8-bit breadboard computer (LDA 0001, ADD 0010, SUB 0011, STA 0100, LDI 0101, JMP 0110, JC 0111, JZ 1000, OUT 1110, HLT 1111; ADD/SUB set the zero and carry flags), one register A (plus B for operands), 16 one-byte memory boxes. It is simulated in `src/lib/tiny-cpu/` (tested) and shown by the `<TinyCpu>` lesson component and the projects: predict, then step, then compare.

## Projects: predict, then run
- Bits & Data: **The Byte Lab** (one byte as 255, -1, 0xFF, a letter; overflow experiments).
- Logic & Circuits: half-adder (live), **4-bit calculator**.
- Memory & State: **A tiny memory machine** (predict the next register/memory state before the clock tick).
- Build a CPU: **Run a program on a tiny CPU**.
- Wrap-up: **Trace a program end to end** (the graduation standard).

## Misconceptions to build cards around
From the computing-education research cited in the third pass. Mark [E] = reported in studies, [H] = a plausible hazard to watch in our own data. Citations still to be checked before quoting them to learners.
- [E] Place values stay the same when the base changes; hex digits carry decimal weights (number representation studies, Herman et al.).
- [E] Negative binary is a sign bit plus the magnitude; arithmetic keeps the true result whatever the width (overflow).
- [E] A combinational circuit has only one output (Trotskovsky and Sabag): introduce sum and carry early.
- [E] RAM and disk storage do the same job (Kyriakou et al.).
- [E] `x = x + 1` is a stored formula, not read, compute, write back (Kohn).
- [E] Tracing failures: not tracing, tracing wrongly, uninformative test inputs (SIGCSE 2023): teach prediction and tracing as separate skills.
- [H] A clocked register updates whenever its input changes; feedback means an uncontrolled loop; one character is always one byte.

Two lessons were added for this: "Overflow: when numbers run out of bits" and "Variables in memory: x = x + 1, step by step".

## Constraints for new lessons
- 5–10 minutes each, the same frontmatter as existing lessons (outcomes, Check yourself with headings that exist, assignment, resources with checked URLs).
- No em dashes in new text; topics by name, never "level".
- Each lesson gets at least 5 Practice cards (mix of types; a diagram flashcard where a picture helps).
- A live lesson can never move to another section (its URL contains the section id): new lessons go in new sections.
