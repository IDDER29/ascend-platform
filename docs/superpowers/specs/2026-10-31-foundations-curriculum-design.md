# Foundations curriculum: five courses (2026-10-31)

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
Five courses (a course is a group of outline sections in `src/lib/paths/foundations-outline.ts`, named in `catalog.ts`; lessons keep their level, slug and progress keys):

1. **Bits & Data**: numbers in binary (bit, binary/hex, two's complement, *bitwise ops and masks*); text, sizes and fractions (bytes/words/types, ASCII/UTF-8, *floating point*).
2. **Logic & Circuits**: logic & gates (Boolean, gates, half-adder project, full/4-bit adder); circuits that calculate (mux/decoder, *the ALU*, 4-bit calculator project).
3. **Memory & State**: latches/flip-flops, clock and registers, memory as numbered boxes, *state machines*.
4. **Build a CPU**: *an instruction set*; fetch-execute, *jumps and loops*, gates to a tiny CPU (datapath and control), *input and output*, tiny-CPU project.
5. **From Hardware to Software**: *assembly and the assembler*, compilers and interpreters, *compile/link/load*; *functions and the call stack*, *the OS: processes and system calls*.

Italic = added from the research.

**Left out on purpose** (taught later, in other paths): performance formulas and pipelining; caches beyond a mention; real x86/ARM assembly; stack/heap and the address space in depth (Systems: Machine & Memory); OS internals; compiler construction; algorithms and data structures; transistor/CMOS physics (the digital abstraction is enough).

**Overlap with Systems Programmer** is deliberate: Foundations teaches each idea on a tiny made-up CPU and at the concept level; Machine & Memory, C and Systems revisit assembly, the stack and system calls on a real machine.

## Constraints for new lessons
- 5–10 minutes each, the same frontmatter as existing lessons (outcomes, Check yourself with headings that exist, assignment, resources with checked URLs).
- No em dashes in new text; topics by name, never "level".
- Each lesson gets at least 5 Practice cards (mix of types; a diagram flashcard where a picture helps).
- A live lesson can never move to another section (its URL contains the section id): new lessons go in new sections.
