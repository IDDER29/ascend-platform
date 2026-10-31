# Concept registry: everything Ascend teaches, and where

The platform's map of concepts, built from research comparing nand2tetris, Petzold's *Code*, Crash Course CS, CS:APP, CS50, MIT 6.004/6.191, Ben Eater's 8-bit computer and ACM/IEEE/AAAI CS2023, plus a 30-module architecture registry (2026-10-31). It is a planning tool, not a syllabus: every new lesson should name the concept here it teaches, and every concept here should have a home.

**Where** is one of:
- **F: course**: Foundations (live or coming soon), see `docs/superpowers/specs/2026-10-31-foundations-curriculum-design.md`.
- **SP: topic**: Systems Programmer (Machine & Memory, The C Language, Systems & Software, ShellForge).
- **Linux / Network / Python / AI**: the paths marked "soon" in `src/lib/paths/catalog.ts`.
- **Architect**: a future Computer Architect path (not in the catalog yet).
- **Tools**: a future developer-tools course (not in the catalog yet).
- **Out**: deliberately not taught.

Status: ✓ live · ○ planned in an outline · · not planned yet.

## 1. Information and representation
| Concept | Where | Status |
|---|---|---|
| Bit, two states, meaning by agreement | F: Bits & Data | ✓ |
| Binary, positional notation, hex | F: Bits & Data | ✓ |
| Two's complement, negation, subtraction | F: Bits & Data | ✓ |
| Finite width, overflow, wraparound | F: Bits & Data | ○ (own lesson) |
| Bitwise AND/OR/XOR/NOT, shifts, masks | F: Bits & Data | ✓ |
| Bytes, words, data widths, types | F: Bits & Data | ○ |
| ASCII, Unicode, UTF-8 | F: Bits & Data | ○ |
| Floating point (IEEE 754 basics) | F: Bits & Data | ○ |
| Endianness | SP: Machine & Memory | ✓ |
| Sign/zero extension, truncation, bit fields | SP: The C Language | · |
| Octal, kibibytes vs kilobytes, UTF-16 | F: Bits & Data (mention) | · |
| Parity, checksums, error detection | Network | · |
| IEEE 754 details (NaN, subnormals, rounding) | Architect | · |

## 2. Electricity and the digital abstraction
| Concept | Where | Status |
|---|---|---|
| Voltage ranges mean 0/1, noise margin | F: Bits & Data | ✓ |
| Switches, relays, transistors as switches | F: Logic & Circuits | ✓ |
| Propagation delay, why clocks have a limit | F: Memory & State | ✓ |
| Ohm's law, CMOS, power, fan-out, metastability | Architect | · |

## 3. Logic and circuits
| Concept | Where | Status |
|---|---|---|
| Boolean logic, truth tables, gates, NAND universality | F: Logic & Circuits | ✓ |
| Half adder, full adder, ripple-carry adder | F: Logic & Circuits | ✓ |
| Multiplexers, decoders | F: Logic & Circuits | ○ |
| ALU, status flags | F: Logic & Circuits | ○ |
| De Morgan, canonical forms, Karnaugh maps | Architect | · |
| Comparators, shifters, carry-lookahead, multipliers | Architect | · |

## 4. State and memory
| Concept | Where | Status |
|---|---|---|
| Feedback, SR latch, D flip-flop, edge triggering | F: Memory & State | ✓ |
| Clock, registers, load enable | F: Memory & State | ✓ |
| Addressed RAM, address/data/write, decoder | F: Memory & State | ✓ |
| State machines | F: Memory & State | ○ |
| RAM vs storage (volatile vs persistent) | F: Memory & State | ○ (in a lesson or card) |
| Counters, shift registers, setup/hold, Moore/Mealy | Architect | · |
| SRAM vs DRAM, ROM, multi-port memory | Architect | · |

## 5. The CPU and instructions
| Concept | Where | Status |
|---|---|---|
| Instruction set (ISA), opcode/operand, stored program | F: Build a CPU | ✓ |
| Fetch-decode-execute, PC, IR | F: Build a CPU | ✓ |
| Jumps, flags, conditional branches, loops | F: Build a CPU | ✓ |
| Datapath and control, buses | F: Build a CPU | ○ |
| Input/output, memory-mapped I/O, interrupts (idea) | F: Build a CPU | ○ |
| Real CPU registers, x86-64 assembly | SP: Machine & Memory | ✓ |
| Addressing modes, RISC/CISC, RISC-V encodings | Architect | · |
| Hardwired vs microprogrammed control, single vs multi-cycle | Architect | · |

## 6. From code to a running program
| Concept | Where | Status |
|---|---|---|
| Assembly and the assembler | F: Hardware to Software | ○ |
| Compilers vs interpreters | F: Hardware to Software | ○ |
| Compile, assemble, link, load (concept) | F: Hardware to Software | ○ |
| Variables in memory, read/compute/write | F: Hardware to Software | ○ |
| Functions and the call stack (concept) | F: Hardware to Software | ○ |
| Processes, system calls, user vs kernel (concept) | F: Hardware to Software | ○ |
| Object files, ELF, symbols, relocation, dynamic linking, ABIs | SP: The C Language / Tools | · |
| Compiler internals (IR, SSA, register allocation) | Architect | · |

## 7. C in depth
| Concept | Where | Status |
|---|---|---|
| Memory model, sizeof, stack vs heap | SP: The C Language | ✓ |
| Pointers, pointer arithmetic, double pointers | SP: The C Language | ✓ |
| Structs, unions, padding | SP: The C Language | ✓ |
| malloc/free, leaks, use-after-free | SP: The C Language | ✓ |
| Undefined behaviour | SP: The C Language | ✓ |
| C basics: types, operators, control flow, functions | SP: The C Language | · (assumed; needs a primer) |
| Integer promotions, conversions, casts | SP: The C Language | · |
| Strings, arrays vs pointers, function pointers | SP: The C Language | · |
| Storage duration, linkage (static/extern) | SP: The C Language | · |
| errno, stdio and file I/O, buffering | SP: Systems & Software | · |
| restrict, _Static_assert, _Generic, setjmp/longjmp | Out (reference only) | · |

## 8. Operating systems
| Concept | Where | Status |
|---|---|---|
| Processes, fork/exec/wait | SP: Systems & Software | ✓ |
| System calls, user vs kernel mode | SP: Systems & Software | ✓ |
| Pipes, signals, file descriptors | SP: Systems & Software | ✓ |
| A shell (capstone) | SP: ShellForge | ✓ |
| Address space, stack and heap at run time | SP: Machine & Memory | ✓ |
| Caches and locality | SP: Machine & Memory | ✓ |
| Virtual memory, page tables, TLB, page faults, mmap | SP (new topic) or Linux | · |
| Threads, races, locks, deadlock | SP (new topic) | · |
| File systems | Linux | · |
| Devices, drivers, boot, firmware | Linux | · |
| Containers, namespaces, cgroups, VMs | Linux | ○ (outline) |

## 9. Developer tools and investigation
| Concept | Where | Status |
|---|---|---|
| Shell, files, permissions, redirection | Linux | ○ |
| Compiler warnings, flags, make | Tools | · |
| gdb, breakpoints, backtraces | Tools | · |
| objdump, readelf, nm, strace | Tools / SP | · (strace mentioned in SP) |
| Sanitizers, valgrind | Tools | · (used in SP cards) |
| Git, tests, profiling | Tools | · |

## 10. Algorithms and data structures
| Concept | Where | Status |
|---|---|---|
| Arrays, linked lists, stacks, queues, hash tables, trees | Python / a future algorithms course | · |
| Complexity, searching, sorting | Python / a future algorithms course | · |
| Memory layout and cache behaviour of data structures | SP | · |

## 11. Computer architecture (design)
Everything here belongs to a future **Computer Architect** path. None of it is planned yet: HDLs (Verilog/SystemVerilog) and FPGA flow; verification (testbenches, coverage, formal checking); pipelining and hazards; branch prediction; superscalar and out-of-order; SIMD/GPU; caches, coherence and memory consistency; computer arithmetic (Booth, Wallace, division, FP units); performance analysis (CPI, roofline, gem5); power, thermal, reliability; security architecture (side channels, TEEs); virtualization hardware; domain-specific accelerators; hardware/software co-design.

## 12. Out of scope for now
Networking internals beyond the Network path's outline, databases, distributed systems, ethics and history of computing (worth a short piece in Foundations' wrap-up later), formal mathematics beyond what lessons need when they need it.

## The biggest gaps, by value
1. **Foundations' coming-soon lessons** (21 items), led by From Hardware to Software.
2. **A C basics primer** before The C Language: today it assumes types, operators and control flow.
3. **Virtual memory and concurrency** topics in Systems Programmer.
4. **A developer-tools course** (gdb, make, sanitizers, git).
5. **The Computer Architect path**, for learners who want to design CPUs, not only understand them.
