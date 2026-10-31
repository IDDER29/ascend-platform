# Concept registry: everything Ascend teaches, and where

The platform's map of concepts, built from research comparing nand2tetris, Petzold's *Code*, Crash Course CS, CS:APP, CS50, MIT 6.004/6.191, Ben Eater's 8-bit computer and ACM/IEEE/AAAI CS2023, plus a 30-module architecture registry (2026-10-31). It is a planning tool, not a syllabus: every new lesson should name the concept here it teaches, and every concept here should have a home.

**Where** is one of:
- **F: course**: Foundations, eight courses: Computers & Information, Binary & Data, Logic & Circuits, State & Memory, Build a CPU, Assembly Language, From Source to Machine, The Complete System. See `docs/superpowers/specs/2026-10-31-foundations-curriculum-design.md`; every blueprint lesson (F001–F106) is mapped in `src/lib/paths/foundations-outline.ts` (`covers`).
- **SP: course**: Systems Programmer. Live topics: Machine & Memory, The C Language, Systems & Software, ShellForge. Outlined: C Basics, The C Contract, Tools, Data Structures in C, Virtual Memory, Threads & Files, Your own malloc.
- **CA: course**: Computer Architect (soon, outlined): Performance, Pipelining, Advanced execution, Caches & memory systems, Multicore & GPUs, Verilog, Verification, RTL to silicon, Compilers & theory, A RISC-V core.
- **Security: course**: Security Engineer (soon, outlined): Security foundations, Memory-safety bugs & defences, Side channels & hardware trust, Reliability.
- **Network: course**: Network Engineer (soon, outlined): Network foundations, Core protocols, Operating networks.
- **Linux / Python / AI**: paths marked "soon" with course names and counts only (no lesson outline yet).
- **Out**: deliberately not taught.

Outlines live in `src/lib/paths/planned-outlines.ts` (courses with no lessons yet) and the `upcoming` items in `src/lib/paths/course-outlines.ts` (live topics). The track and its milestones: `docs/superpowers/specs/2026-11-01-foundations-track-design.md`.

Status: ✓ live · ○ planned in an outline · · not planned yet.

## 1. Information and representation
| Concept | Where | Status |
|---|---|---|
| Bit, two states, meaning by agreement | F: Computers & Information | ✓ |
| Binary, positional notation, hex | F: Binary & Data | ✓ |
| Two's complement, negation, subtraction | F: Binary & Data | ✓ |
| Finite width, overflow, wraparound | F: Binary & Data | ○ (own lesson) |
| Bitwise AND/OR/XOR/NOT, shifts, masks | F: Binary & Data | ✓ |
| Bytes, words, data widths, types | F: Binary & Data | ○ |
| ASCII, Unicode, UTF-8 | F: Binary & Data | ○ |
| Floating point (IEEE 754 basics) | F: Binary & Data | ○ |
| Endianness | SP: Machine & Memory | ✓ |
| Sign/zero extension, truncation, bit fields | SP: The C Language (integer promotions and conversions) | ○ |
| Kibibytes vs kilobytes | F: Binary & Data | ○ |
| Pixels, colour, sound, file formats | F: Binary & Data | ○ |
| Parity, checksums, error detection | Network: Network foundations | · |
| IEEE 754 details (NaN, subnormals, rounding) | CA | · |

## 2. Electricity and the digital abstraction
| Concept | Where | Status |
|---|---|---|
| Voltage ranges mean 0/1, noise margin | F: Computers & Information | ✓ |
| Switches, relays, transistors as switches | F: Logic & Circuits | ✓ |
| Propagation delay, why clocks have a limit | F: State & Memory | ✓ |
| Ohm's law, CMOS, power, fan-out, metastability | CA: Performance (power), RTL to silicon | ○ (power, timing) |

## 3. Logic and circuits
| Concept | Where | Status |
|---|---|---|
| Boolean logic, truth tables, gates, NAND universality | F: Logic & Circuits | ✓ |
| Half adder, full adder, ripple-carry adder | F: Logic & Circuits | ✓ |
| Multiplexers, decoders | F: Logic & Circuits | ○ |
| ALU, status flags | F: Logic & Circuits | ○ |
| De Morgan, canonical forms, Karnaugh maps | CA: Verilog | · |
| Comparators, shifters, carry-lookahead, multipliers | CA: Verilog | · |

## 4. State and memory
| Concept | Where | Status |
|---|---|---|
| Feedback, SR latch, D flip-flop, edge triggering | F: State & Memory | ✓ |
| Clock, registers, load enable | F: State & Memory | ✓ |
| Addressed RAM, address/data/write, decoder | F: State & Memory | ✓ |
| State machines, counters | F: State & Memory | ○ |
| RAM vs storage, the memory hierarchy (concept) | F: The Complete System; SP: Machine & Memory (on a real machine) | ○ |
| Counters, shift registers, setup/hold, Moore/Mealy | CA: Verilog, RTL to silicon | ○ |
| SRAM vs DRAM, ROM, multi-port memory | CA: Caches & memory systems | ○ (DRAM) |

## 5. The CPU and instructions
| Concept | Where | Status |
|---|---|---|
| Instruction set (ISA), opcode/operand, stored program | F: Build a CPU | ✓ |
| Fetch-decode-execute, PC, IR | F: Build a CPU | ✓ |
| Jumps, flags, conditional branches, loops | F: Build a CPU | ✓ |
| Datapath and control, buses | F: Build a CPU | ✓ |
| Input/output, memory-mapped I/O, interrupts (idea) | F: The Complete System | ✓ |
| Real CPU registers, x86-64 assembly | SP: Machine & Memory | ✓ |
| Addressing modes, RISC/CISC, RISC-V encodings | CA: A RISC-V core | ○ |
| Hardwired vs microprogrammed control, single vs multi-cycle | CA: Pipelining | · |

## 6. From code to a running program
| Concept | Where | Status |
|---|---|---|
| Assembly, labels, the two-pass assembler, the stack, calls | F: Assembly Language | ○ |
| Algorithms, languages, expressions, types | F: From Source to Machine | ○ |
| Compile, assemble, link, load; reading real compiler output | F: From Source to Machine | ○ |
| Variables, arrays, pointers and layout in memory | F: From Source to Machine | ○ |
| Functions and the call stack (concept) | F: From Source to Machine | ○ |
| Boot, OS services, system calls, processes, virtual addresses, files (concept) | F: The Complete System | ○ |
| Networks, concurrency, protection (concept) | F: The Complete System | ○ |
| Object files, ELF, symbols, relocation, dynamic linking, ABIs | SP: Tools (libraries, objdump/readelf/nm), The C Language (separate compilation) | ○ |
| Compiler internals (IR, SSA, register allocation) | CA: Compilers & theory | ○ |

## 7. C in depth
| Concept | Where | Status |
|---|---|---|
| Memory model, sizeof, stack vs heap | SP: The C Language | ✓ |
| Pointers, pointer arithmetic, double pointers | SP: The C Language | ✓ |
| Structs, unions, padding | SP: The C Language | ✓ |
| malloc/free, leaks, use-after-free | SP: The C Language | ✓ |
| Undefined behaviour | SP: The C Language | ✓ |
| C basics: types, operators, control flow, functions | SP: C Basics | ○ |
| Integer promotions, conversions, casts | SP: The C Language | ○ |
| Strings, arrays vs pointers, function pointers | SP: The C Language | ○ |
| Storage duration, linkage (static/extern) | SP: The C Language | ○ |
| Evaluation order, aliasing, lifetime, optimiser assumptions | SP: The C Contract | ○ |
| errno, stdio and file I/O, buffering | SP: Systems & Software (buffered I/O), C Basics (printf/scanf) | ○ |
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
| Virtual memory, page tables, TLB, page faults, mmap | SP: Virtual Memory, Threads & Files | ○ |
| Threads, races, locks, deadlock | SP: Virtual Memory, Threads & Files | ○ |
| Context switching, permissions, process isolation | SP: Systems & Software | ○ |
| File systems | SP: Virtual Memory, Threads & Files | ○ |
| Devices, drivers, boot, firmware | Linux | · |
| Containers, namespaces, cgroups, VMs | Linux | ○ (outline) |

## 9. Developer tools and investigation
| Concept | Where | Status |
|---|---|---|
| Shell, files, permissions, redirection | Linux | ○ |
| Compiler warnings, flags, make | SP: Tools | ○ |
| gdb, breakpoints, backtraces | SP: Tools | ○ |
| objdump, readelf, nm, strace | SP: Tools | ○ |
| Sanitizers, valgrind | SP: Tools | ○ |
| Git, tests, profiling | SP: Tools (git, tests); CA: Performance (profiling) | ○ |

## 10. Algorithms and data structures
| Concept | Where | Status |
|---|---|---|
| Arrays, linked lists, stacks, queues, hash tables, trees | SP: Data Structures in C | ○ |
| Complexity, searching, sorting | SP: Data Structures in C (complexity) | ○ (sorting not yet) |
| Memory layout and cache behaviour of data structures | SP: Data Structures in C | ○ |
| A memory allocator (capstone) | SP: Your own malloc | ○ |

## 11. Computer architecture (design)
| Concept | Where | Status |
|---|---|---|
| Performance: CPI, Amdahl, benchmarks, power | CA: Performance & trade-offs | ○ |
| Pipelining, hazards, forwarding, branch prediction | CA: Pipelining | ○ |
| Superscalar, out-of-order, renaming, speculation | CA: Advanced execution | ○ |
| Cache organisation, policies, hierarchies, DRAM | CA: Caches & memory systems | ○ |
| Coherence, consistency, SIMD, GPUs, accelerators | CA: Multicore & GPUs | ○ |
| Verilog, FPGA flow | CA: Digital design with Verilog | ○ |
| Testbenches, coverage, formal checking | CA: Verification | ○ |
| Synthesis, timing, place and route | CA: From RTL to silicon | ○ |
| A RISC-V core (capstone) | CA: A RISC-V core | ○ |
| Computer arithmetic (Booth, Wallace, division, FP units), virtualization hardware, hardware/software co-design | CA | · |

## 11b. Security and reliability
| Concept | Where | Status |
|---|---|---|
| Threat models, least privilege, secrets, cryptography's role | Security: Security foundations | ○ |
| Buffer overflows, use-after-free, format strings, mitigations, CFI | Security: Memory-safety bugs & defences | ○ |
| Side channels, Spectre/Meltdown, TEEs, secure boot | Security: Side channels & hardware trust | ○ |
| Faults, redundancy, fuzzing, failing safely | Security: Reliability | ○ |

## 11c. Networking
| Concept | Where | Status |
|---|---|---|
| Layers, Ethernet, IP, subnets, routing | Network: Network foundations | ○ |
| UDP, TCP, congestion control, DNS, HTTP, TLS, sockets | Network: Core protocols | ○ |
| Diagnostic tools, packet capture, firewalls and NAT, safe change | Network: Operating networks | ○ |

## 12. Out of scope for now
Databases, distributed systems, ethics and history of computing (worth a short piece in Foundations' wrap-up later), formal mathematics beyond what lessons need when they need it.

## The track and its milestones
1. **Foundations**: Ready to start C.
2. **Systems Programmer**: Understand C deeply (after Data Structures in C), then Understand the OS.
3. **Computer Architect**: Ready to design processors.

Side paths: Python, Linux, Network and AI branch off Foundations; Security branches off Systems Programmer.

## What to write next, in order
1. **Foundations' coming-soon items** (95 lessons and projects across eight courses), course by course: Computers & Information first, since it opens the path.
2. **C Basics**, so The C Language no longer assumes them.
3. **Tools** (gcc, make, gdb, sanitizers), which every later C lesson leans on.
4. **The C Contract** and the coming-soon lessons in The C Language.
5. **Data Structures in C**.
6. **Virtual Memory, Threads & Files**, and the Systems & Software additions; then the malloc capstone.
7. Then Security, Network and Computer Architect. Linux, Python and AI still need lesson outlines.
