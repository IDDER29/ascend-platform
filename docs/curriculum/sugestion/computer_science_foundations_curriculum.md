# Computer Science Foundations — Complete Curriculum Blueprint

**Version:** 1.0 · **Date:** October 31, 2026  
**Audience:** Absolute beginners; no programming, mathematics beyond basic arithmetic, or electronics experience assumed.  
**Format:** Eight connected courses, **106 short lessons**, cumulative interactive projects, retrieval-practice cards, and mastery checkpoints.  
**Destination paths:** C and systems programming; operating systems; Linux; networking; Python and AI; and, optionally, deeper computer architecture.  
**Status:** Proposed curriculum specification, not a published or accredited university syllabus.

> **North-star outcome:** A graduate can take a small program, explain how its bits encode information and instructions, trace those instructions through registers and memory in a simplified CPU, and identify the roles played by a compiler, loader, and operating system. The graduate knows which details the educational model leaves out.

---

## 1. Curriculum decisions

**Keep the eight-course structure.** The earlier 83-lesson estimate was a planning placeholder; expanding it to 106 lessons avoids combining unrelated concepts into single 5–10 minute lessons. No ninth prerequisite course is necessary: introductory computational thinking, mathematics as needed, and the software-to-system bridge fit within these eight courses. Advanced C, operating-system implementation, computer architecture, and networks remain separate follow-on paths.

### 1.1 Course map

| Course | Lessons | Count | Core learner outcome | Major cumulative artifact |
|---|---|---:|---|---|
| 1. Understanding Computers and Information | F001–F009 | 9 | Explain information, states, signals, instructions, and abstraction | **The Machine Atlas** |
| 2. Binary, Numbers, and Data Representation | F010–F022 | 13 | Interpret finite binary representations | **The Byte Laboratory** |
| 3. Boolean Logic and Digital Circuits | F023–F036 | 14 | Design and test combinational logic | **The 8-Bit ALU** |
| 4. State, Clocks, Registers, and Memory | F037–F048 | 12 | Construct clocked state and addressable storage | **The Memory Board** |
| 5. Computer Architecture: Building a CPU | F049–F063 | 15 | Connect a datapath and controller into a processor | **The FS-8 CPU** |
| 6. Machine Language and Assembly Programming | F064–F077 | 14 | Encode, assemble, and debug machine programs | **The Assembler and Monitor** |
| 7. From Source Code to Machine Execution | F078–F091 | 14 | Connect source-level ideas to machine code and program loading | **The Tiny-Language Translator** |
| 8. How a Complete Computer System Works | F092–F106 | 15 | Trace startup, I/O, OS services, memory, and execution | **The End-to-End Computer Explorer** |
| **Total** | **F001–F106** | **106** | | **8 linked major projects** |

Each course also has one smaller required project and one optional extension project, for **16 required projects plus 8 optional extensions**. The eight major projects are successive versions of one coherent learning environment rather than eight unrelated demos.

### 1.2 Teaching contract

- **A lesson is one testable concept, not one chapter in a textbook.** Target 5–10 minutes of explanation; interactive practice and projects are additional time.
- **Show the mechanism before naming everything around it.** Start with an observable problem, make the state/data flow visible, then introduce terminology.
- **Separate representations from interpretations.** Bits do not tell you by themselves whether they represent an integer, character, instruction, or pixel.
- **Separate the educational computer from a modern computer.** Educational choices are labeled *FS-8 model*; actual CPU, C-language, and OS behavior may differ.
- **Use lightweight prerequisite reminders.** For example, recall binary place values before overflow; recall registers and RAM before an instruction-cycle trace.
- **Every concept gets at least one recall item and one prediction or transfer item.** Spaced repetition reinforces a model; it does not replace building and debugging.
- **Never require a physical electronics kit, paid textbook, Linux installation, or local compiler to complete Foundations.** Provide browser-based simulators, with optional physical and local-tool alternatives.

### 1.3 Shared example machine: FS-8

The projects progressively reveal a deliberately simplified **Foundations System 8 (FS-8)**. It is a proposed educational architecture, not an existing industry standard.

- **Data:** eight-bit values; arithmetic is explicitly fixed-width where appropriate. Signedness belongs to an operation/interpretation, not to the bits themselves.
- **Memory:** 256 individually addressed bytes in one simplified memory space; code and data share that space in the teaching model.
- **Processor:** four eight-bit general-purpose registers (`R0`–`R3`), a program counter (`PC`), a zero flag (`Z`), and an ALU; a stack pointer (`SP`) is introduced later as an extension.
- **Instruction set:** defined and frozen in Course 5, then used unchanged by the assembler and tiny-language translator. Begin with load, store, immediate, add, subtract, compare, conditional/unconditional branch, output, and halt. Add calls and returns only when the corresponding stack conventions are taught.
- **Timing model:** begin with explicit state transitions and clocked register writes; add a simplified multistep fetch/decode/execute control sequence in Course 5. It is **not** presented as a modern pipelined CPU.
- **Display:** a tiny memory-mapped or port-based output device with an explicit access rule, chosen and documented during Course 5/6; do not treat writing to a display as magic.
- **Reference implementation:** the platform owns an executable specification and deterministic test vectors. Learner-built circuits and programs are compared against that reference.

**Integration rule:** Early labs need not contain the entire machine. Modules are attached as soon as the prerequisite concepts are taught. Once the CPU/ISA specification is frozen, changing a component requires updating its tests, assembly examples, and later projects together.

---

# Course 1 — Understanding Computers and Information

**Course goal:** Make the idea of a programmable digital system concrete before expecting a learner to understand number systems or circuits.  
**Prerequisites:** None.  
**End-of-course ability:** Explain computation as state changes driven by instructions, name major computer subsystems, and distinguish a signal from the meaning assigned to it.

## Lessons

| ID | Lesson | Description |
|---|---|---|
| F001 | What Is a Computer? | Explore what makes a device a computer: it accepts information, performs operations, maintains state, and can follow a sequence of instructions. Compare calculators, phones, and general-purpose computers without requiring historical trivia. |
| F002 | Input, Processing, Output, and Storage | Follow an everyday task through input, internal computation, temporary storage, and output; introduce CPU, memory, storage, and peripherals by role rather than by brand or physical appearance. |
| F003 | Hardware, Software, and Firmware | Distinguish physical circuits, programmable instructions, and persistent low-level software; show why the same hardware can perform many tasks. |
| F004 | Analog and Digital: Continuous Versus Discrete | Contrast continuously varying physical quantities with discrete symbolic states; introduce the digital abstraction without claiming real voltages are ideal zeros and ones. |
| F005 | Signals, States, and the First Bit | Model two distinguishable states as a bit; explain that circuits need reliable conventions for sensing and changing states, not a universal voltage for every logical 1. |
| F006 | Codes, Symbols, and Meaning | Create a codebook that maps bit patterns to messages; establish the crucial distinction between stored pattern and chosen interpretation. |
| F007 | Instructions and Algorithms | Explain an algorithm as an unambiguous procedure and an instruction as a machine-recognizable operation; follow a short sequence with a clear beginning and end. |
| F008 | State, Time, and Step-by-Step Execution | Compare a system's state before and after an action; see why the same input can lead to different outcomes in a stateful system. |
| F009 | Abstraction: Understanding a Machine in Layers | Explain why we model systems as components with interfaces; preview the full learning ladder from bits to circuits, CPU, machine code, programs, and OS services. |

## Projects

**P1-A · Required mini-project — Make a Codebook.** Give learners a set of distinct two- or three-bit patterns and ask them to assign messages, encode a short phrase, decode one from another learner, and explain why both parties need the same mapping. **Accept:** all symbols decode under the declared mapping; learner identifies that meaning is not inherent in the bit pattern.

**P1-B · Required major project — The Machine Atlas (v1).** Start the platform's shared interactive model: four conceptual blocks (input, processing, memory, output) with arrows showing information moving between them. A manual “step” button reveals how a simple instruction changes stored state. **Accept:** the learner can narrate each step and identify what changed and what stayed unchanged.

**P1-X · Optional extension — Two-State Communication.** Simulate transmitting binary symbols through a noisy channel, then ask how two participants agree on signal thresholds and codes. This is a preview of communications, not an electronics course.

**Feeds into:** Course 2 uses the codebook's symbols as bits and bytes; the Machine Atlas remains the frame into which circuits and CPU components are inserted.

**Primary curriculum anchors:** [CS50 Week 0](https://cs50.harvard.edu/x/weeks/0/), [Petzold's account of *Code* (2e)](https://www.charlespetzold.com/blog/2022/09/The-Changes-for-the-2nd-Edition-of-Code.html), [MIT 6.004 course introduction](https://computation-structures.github.io/course/).

---

# Course 2 — Binary, Numbers, and Data Representation

**Course goal:** Read and construct bit patterns for numbers and other basic kinds of data; understand the limitations of fixed-size representations.  
**Prerequisites:** Course 1.  
**End-of-course ability:** Explain why the same byte can have multiple interpretations; predict common eight-bit arithmetic results; describe how text and media are encoded.

## Lessons

| ID | Lesson | Description |
|---|---|---|
| F010 | Place Value and Number Bases | Revisit decimal place value and generalize it to a base, preparing for binary without assuming the decimal notation is physically special. |
| F011 | Counting in Binary | Count using only `0` and `1`, read powers-of-two place values, and explain why each new bit doubles the possible patterns. |
| F012 | Converting Binary and Decimal | Convert small whole numbers in both directions and verify by reconstructing their weighted sum. |
| F013 | Bits, Nibbles, Bytes, and Words | Relate fixed widths to representable patterns; distinguish a byte from a CPU word and decimal from binary capacity prefixes. |
| F014 | Hexadecimal: A Human-Friendly View of Bits | Group four bits per hex digit and move between binary and hexadecimal as a compact notation useful for inspecting memory and machine code. |
| F015 | Unsigned Binary Addition and Carry | Perform addition in a fixed number of bits; distinguish result bits, carry-out, and the mathematical sum. |
| F016 | Negative Numbers and Two's Complement | Encode and decode signed two's-complement integers and explain why a bit pattern does not declare its own signedness. |
| F017 | Binary Subtraction with an Adder | Use complement-and-add to subtract; connect this rule to the arithmetic circuits that will be built in Course 3. |
| F018 | Overflow, Truncation, and Fixed-Width Arithmetic | Predict what happens when a result cannot fit the selected representation; distinguish unsigned carry from signed overflow. |
| F019 | Bitwise Operations and Shifts | Apply AND, OR, XOR, NOT, left/right shifts and simple masks to patterns; distinguish bitwise operations from ordinary logical claims. |
| F020 | Characters: ASCII, Unicode, and UTF-8 | Encode a few characters, distinguish a character from its code point and byte encoding, and see why a text character need not occupy one byte. |
| F021 | Pixels, Color, Audio, and File Encodings | Introduce pixels and color channels, sampled sound, and file-format conventions as different interpretations of bytes—not as a full multimedia-processing course. |
| F022 | Binary Fractions and Floating-Point Approximation | Show why some decimal fractions are not exactly representable in finite binary and why floating-point results may be approximate; postpone full IEEE 754 mechanics. |

## Projects

**P2-A · Required mini-project — Number-System Workbench.** Convert values among decimal, binary, and hexadecimal; display eight-bit signed and unsigned interpretations; test overflow with predictions before the tool reveals results. **Accept:** correct conversions and ability to distinguish signed overflow from an unsigned carry.

**P2-B · Required major project — The Byte Laboratory (v2).** Upgrade the Machine Atlas with an editable byte grid, interpretation modes (unsigned, two's complement, ASCII/UTF-8 when valid, RGB components), and bitwise-operation previews. Export/import byte arrays that future circuit and memory projects can use. **Accept:** a data pattern survives round-tripping through at least two display formats without silently changing bits.

**P2-X · Optional extension — Design a Tiny File Format.** Define a header and payload for a small black-and-white image; document encoding, dimensions, byte order (if multi-byte fields are used), and a decoder. Do not assume arbitrary bytes form valid UTF-8.

**Feeds into:** All later projects reuse the byte grid and fixed-width arithmetic; Course 3 implements operations on these patterns with logic gates.

**Primary curriculum anchors:** [MIT: Basics of Information](https://computation-structures.github.io/course/lectures/L01_Basics_of_Information.html), [CS50 Week 0](https://cs50.harvard.edu/x/weeks/0/), [CS2023 AR representation topics](https://csed.acm.org/wp-content/uploads/2025/11/CS2023-Report.htm).

---

# Course 3 — Boolean Logic and Digital Circuits

**Course goal:** Understand how fixed logical functions can be implemented as circuits and combine those functions into arithmetic hardware.  
**Prerequisites:** Courses 1–2 (especially bits, unsigned addition, signed representation).  
**End-of-course ability:** Design, test, and compose logic circuits that implement an eight-bit arithmetic logic unit.

## Lessons

| ID | Lesson | Description |
|---|---|---|
| F023 | Boolean Values and Logical Statements | Translate true/false statements into Boolean variables and distinguish logic from ordinary numerical arithmetic. |
| F024 | AND, OR, NOT, and XOR Truth Tables | Enumerate each input combination and compute the corresponding gate output; explain XOR as inequality for single-bit inputs. |
| F025 | Gates as Reusable Components | Treat a gate as an interface with inputs and outputs; connect truth tables to circuit diagrams and allow learners to interactively change signals. |
| F026 | Switches, Relays, and Transistors | See how physical switching can implement logical behavior; clearly separate this conceptual introduction from detailed transistor-level electronics. |
| F027 | NAND, NOR, and Universal Gates | Build NOT, AND, and OR from NAND or NOR; explain why one universal primitive can be composed into many functions. |
| F028 | Combinational Logic Versus Stored State | Define combinational behavior as a function of current input values; foreshadow why this cannot by itself remember an earlier event. |
| F029 | Boolean Expressions, Identities, and Simplification | Rewrite equivalent expressions, use De Morgan's laws, and compare circuit implementations that produce identical outputs. |
| F030 | Multiplexers: Choosing Data | Build a 2-to-1 multiplexer and expand to wider signals; understand selection signals and controlled data paths. |
| F031 | Decoders, Demultiplexers, and Encoders | Translate coded selections into one-of-many outputs and route data to selected destinations; prepare for memory addressing. |
| F032 | Half-Adders: Sum and Carry | Build a two-input adder with separate sum and carry outputs and exhaustively test all four inputs. |
| F033 | Full-Adders and Multi-Bit Addition | Chain full-adders into a ripple-carry adder; trace why carries propagate between bit positions. |
| F034 | Subtractors, Comparators, and Status Flags | Reuse arithmetic to subtract, compare values and produce zero/carry or other explicitly defined status outputs. |
| F035 | The Arithmetic Logic Unit | Integrate arithmetic, bitwise logic, comparison and a selector into an eight-bit ALU with documented operation codes. |
| F036 | Circuit Testing, Delay, and Trade-Offs | Test complete truth tables on small components and inspect critical paths; introduce the fact that real gates have nonzero delay. |

## Projects

**P3-A · Required mini-project — Logic Gate Workbench.** Use a browser circuit editor to build NAND, XOR, a mux, and a half-adder; auto-check each against a reference truth table. **Accept:** equivalent circuits produce the same outputs on all valid inputs, including multi-output circuits.

**P3-B · Required major project — The 8-Bit ALU (v3).** Implement arithmetic and Boolean operations, selectable by ALU control codes. Show inputs and outputs as binary/hex/unsigned/signed through the existing Byte Laboratory. **Accept:** deterministic tests cover normal and overflow cases, and all operations match the declared eight-bit specification.

**P3-X · Optional extension — Make the Circuit Smaller.** Build the same functionality from NAND-only primitives and compare component counts and conceptual signal depth, without claiming a realistic silicon-area model.

**Feeds into:** The ALU becomes an actual CPU component in Course 5; muxes and decoders are reused to build Course 4 memory.

**Primary curriculum anchors:** [Nand2Tetris Projects 1–2](https://www.nand2tetris.org/course), [MIT combinational logic](https://computation-structures.github.io/course/lectures/L04_Combinational_Logic.html), [Ben Eater's ALU](https://eater.net/8bit/alu).

---

# Course 4 — State, Clocks, Registers, and Memory

**Course goal:** Progress from circuits that merely compute outputs to circuits that retain, update, and address information.  
**Prerequisites:** Course 3, especially combinational logic, muxes, and decoders.  
**End-of-course ability:** Explain a state transition on a clock event, build registers, and read/write an addressable RAM array.

## Lessons

| ID | Lesson | Description |
|---|---|---|
| F037 | Why a Computer Needs State | Contrast combinational output with remembered state; introduce the concept of a machine's current state and next-state function. |
| F038 | Feedback and the Simple Latch | Explore how feedback can retain a bit and how set/reset control changes it; distinguish intended storage from uncontrolled feedback. |
| F039 | D Latches and D Flip-Flops | Explain data-input storage and the difference between level-sensitive and edge-triggered capture. |
| F040 | Clocks and Synchronous Circuits | Use a visible clock edge to coordinate changes; distinguish signal propagation during a cycle from state updates at the active edge. |
| F041 | Registers and Load Enables | Group individual bit-storage elements into a register; control when its contents remain constant or take on a new value. |
| F042 | Counters and Incrementing State | Build a register that increments under control; show how a counter is a sequential circuit, not a static arithmetic result. |
| F043 | Finite-State Machines | Use state diagrams, transition tables and outputs to design a small sequence controller for a familiar task. |
| F044 | Addresses, Locations, and Address Width | Interpret addresses as selectors for storage locations and distinguish an address from the data held there. |
| F045 | Building RAM from Storage and Decoders | Assemble a small addressable memory from registers, selection circuits, and write-enable logic. |
| F046 | Reading, Writing, and Holding Memory | Trace read/write operations and predict what changes when address, data, or enable signals change. |
| F047 | Registers, RAM, ROM, and Persistent Storage | Compare temporary registers, working RAM, read-only memory, and nonvolatile storage at the level of purpose and behavior. |
| F048 | Memory Timing and a Small Memory System | Coordinate writes with clocking, display read latency assumptions, and assemble a tested memory module ready for a CPU. |

## Projects

**P4-A · Required mini-project — Register and Counter Lab.** Build an eight-bit register and counter, with reset, load, increment and hold controls. **Accept:** state changes only at the modeled events and test cases include consecutive updates and hold cycles.

**P4-B · Required major project — The Memory Board (v4).** Add 256 addressable bytes to the shared machine model, with an address selector, data in/out, read and write controls, and a timeline of mutations. Compare against the Byte Laboratory's exported datasets. **Accept:** isolated writes leave other locations unchanged; reads reproduce previously written data; reset/initialization rules are explicit.

**P4-X · Optional extension — Tiny Sequencer.** Create a clocked finite-state controller that runs a read–modify–write sequence over memory and visually exposes its states.

**Feeds into:** The CPU will read instructions and operands from the same modeled memory; its registers will use the register components built here.

**Primary curriculum anchors:** [Nand2Tetris Project 3](https://www.nand2tetris.org/project03), [MIT sequential logic](https://computation-structures.github.io/course/lectures/L05_Sequential_Logic.html), [Ben Eater registers](https://eater.net/8bit/registers), [Ben Eater RAM](https://eater.net/8bit/ram).

---

# Course 5 — Computer Architecture: Building a CPU

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

**P5-A · Required mini-project — Build the Datapath.** Connect Course 3's ALU and Course 4's registers/memory using selected inputs and explicit write-enables. **Accept:** independently test arithmetic and memory transfer instructions.

**P5-B · Required major project — The FS-8 CPU (v5).** Implement instruction fetch, decode, state changes and PC updates for the frozen toy ISA. Give learners register and memory views alongside the active control signals. **Accept:** a machine-state test suite passes for all core opcodes, both taken and untaken branches, halt, and reset.

**P5-X · Optional extension — Two Implementations, One ISA.** Compare a simple single-cycle reference with a conceptual multistep controller implementing the same observable instruction effects; avoid advanced pipeline design.

**Feeds into:** Course 6 adds a programmer-facing notation and an assembler for precisely the same instruction set; later high-level programs target this CPU or a clearly labeled real CPU example.

**Primary curriculum anchors:** [Nand2Tetris Projects 4–5](https://www.nand2tetris.org/course), [MIT: Designing an Instruction Set](https://computation-structures.github.io/course/lectures/L09_Designing_an_Instruction_Set.html), [Ben Eater control logic](https://eater.net/8bit/control).

---

# Course 6 — Machine Language and Assembly Programming

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
| F074 | Calls, Return Addresses, and Subroutines | Add or use call/return conventions in the educational ISA and explain saving a return location; keep advanced real-world ABI details for C/systems. |
| F075 | Input, Output, and a Simple Device | Execute an instruction that communicates with the modeled output device and explain the CPU–device boundary. |
| F076 | Debugging at Machine Level | Use stepping, breakpoints, register dumps and memory changes to locate a faulty instruction or unexpected branch. |
| F077 | Assemble and Run a Complete Program | Combine loops, data transfer, arithmetic, device output and optionally subroutines into a documented, testable program. |

## Projects

**P6-A · Required mini-project — Assembly Puzzle Set.** Complete short instruction sequences that perform addition, memory copy, countdown, and conditional selection. **Accept:** programs produce the intended register/memory states, not merely the right final printed number.

**P6-B · Required major project — The Assembler and Monitor (v6).** Implement or interactively construct a two-pass assembler for FS-8, a program loader, disassembler and stepper. Run programs on the Course 5 CPU and display their symbolic and binary forms side by side. **Accept:** assembler output round-trips through disassembly on the defined subset; label addresses are correct; branch and stack edge cases pass tests.

**P6-X · Optional extension — Subroutine Library.** Add a few reusable assembly routines, then test call nesting and correct returns. If CALL/RET is an ISA extension, publish its backward-compatible change and tests explicitly.

**Feeds into:** The instruction encoder, assembler and executable machine supply the backend for the tiny-language translator in Course 7.

**Primary curriculum anchors:** [Nand2Tetris Project 6](https://www.nand2tetris.org/project06), [MIT assembly language](https://computation-structures.github.io/course/lectures/L10a_Assembly_Language.html), [Ben Eater 8-bit computer](https://eater.net/8bit).

---

# Course 7 — From Source Code to Machine Execution

**Course goal:** Connect the machine to familiar programming ideas and the stages of a real toolchain, while keeping C-language mastery in its own later path.  
**Prerequisites:** Courses 2 and 5–6.  
**End-of-course ability:** Trace a tiny high-level program through its representation and execution, and explain the roles of compiler, assembler, linker, loader, memory and runtime state.

## Lessons

| ID | Lesson | Description |
|---|---|---|
| F078 | Algorithms, Programs, and Programming Languages | Distinguish an algorithm from one of its source-language expressions and from the machine instructions that eventually implement it. |
| F079 | Expressions and Evaluation | Trace arithmetic expressions, including the order in which a deliberately defined educational language evaluates its subexpressions. |
| F080 | Variables and Assignment | Model the relationship between variable names, values and storage; explain why `x = x + 1` is an update, not an equation asserting equality. |
| F081 | Conditions, Loops, and Functions | Express branching, repetition and named procedures in a tiny language, then connect them to assembly-level control flow. |
| F082 | Types and Widths | Explain that types constrain permitted operations and values; connect integer and character types to different bit-pattern interpretations. |
| F083 | Arrays and Contiguous Storage | Model an array as a sequence of elements in a declared address/layout scheme, including basic indexed reads and writes. |
| F084 | What a Pointer Conceptually Means | Explain a pointer as a value referring to an object or location in the selected model; explicitly avoid equating every C pointer with a raw physical address. |
| F085 | Bytes, Alignment, and Data Layout | Explain multi-byte object layout and why alignment and byte order matter; introduce implementation dependence without requiring full C object-model rules. |
| F086 | Function Calls and Runtime State | Show arguments, return values, return addresses and stack frames under one declared calling convention, contrasting with an abstract function definition. |
| F087 | Source Files, Headers, and Preprocessing | Identify source files, declarations, headers and preprocessing as distinct parts of a typical C build, without requiring macro-system proficiency. |
| F088 | Compilation and Assembly | Distinguish compiler-generated intermediate/assembly representations from the assembler's object-code output; note that toolchains can combine stages. |
| F089 | Object Files, Sections, and Symbols | Introduce code/data sections, symbols and unresolved references as reasons separate compiled units can be combined. |
| F090 | Linking, Loading, and Program Startup | Explain how linked executable information becomes a running program; distinguish linking from an OS loader placing or mapping code and data. |
| F091 | Observing a Real Compiled Program | Use a guided trace or browser-provided build output to compare a small real C program with its compiled code; recognize that optimization and ISA choices change instructions. |

## Projects

**P7-A · Required mini-project — Variable and Array Memory Visualizer.** Given a tiny source-level program, animate values, variable names and array elements through steps, then allow learners to inspect the corresponding abstract memory locations. **Accept:** predictions about assignment and indexed updates agree with the modeled runtime behavior.

**P7-B · Required major project — The Tiny-Language Translator (v7).** Define a **deliberately small C-like educational language** with integer literals, assignment, arithmetic, `if`, `while`, and optional simple functions. Implement a tiny parser/translator that emits FS-8 assembly for a documented subset, assembles it through Course 6's tool, and executes it on the CPU. **Accept:** a small suite of high-level programs matches reference outputs and traces. **Important:** this is not presented as a conforming C compiler.

**P7-X · Optional extension — Inspect a Real C Binary.** In an optional guided local environment, compile a short C program using a real compiler and view the assembly, object symbols, and executable sections. Label all machine- and compiler-specific observations; do not claim the real program is compiled for FS-8.

**Feeds into:** Course 8 will place the execution story within the larger environment of firmware, operating systems, memory layers and device interactions.

**Primary curriculum anchors:** [CS:APP official site](https://csapp.cs.cmu.edu/), [CS50 course outline](https://cs50.harvard.edu/x/), [MIT compilers](https://computation-structures.github.io/course/lectures/L11_Compilers.html), [GNU C manual](https://www.gnu.org/software/c-intro-and-ref/manual/).

---

# Course 8 — How a Complete Computer System Works

**Course goal:** Integrate the educational CPU with a truthful overview of the environments surrounding actual programs, without turning this into an advanced OS, Linux, networking or security course.  
**Prerequisites:** Courses 1–7.  
**End-of-course ability:** Explain the life of a program from power-on/startup and loading to execution, data access, input/output and termination; distinguish toy-machine abstractions from modern system services.

## Lessons

| ID | Lesson | Description |
|---|---|---|
| F092 | From CPU to Computer System | Reassemble CPU, RAM, persistent storage, firmware, devices and software into one model with clear interfaces and responsibilities. |
| F093 | Temporary Memory Versus Persistent Storage | Distinguish registers/RAM from SSD or disk storage; explain why turning power off has different consequences for different technologies. |
| F094 | Memory Hierarchy and Locality | Explain the purpose of registers, caches, RAM and storage using the trade-offs among capacity, access time and cost; defer cache mapping calculations. |
| F095 | Devices and Input/Output Interfaces | Introduce device controllers, ports and memory-mapped I/O as mechanisms by which CPU programs interact with peripherals. |
| F096 | Polling, Interrupts, and Events | Compare checking a device repeatedly with receiving an interrupt; explain why interrupts redirect control and require a defined handler. |
| F097 | Firmware, Bootloaders, and Startup | Explain the high-level boot chain from reset and firmware to loading a program or operating system, without claiming one universal boot procedure. |
| F098 | What an Operating System Provides | Explain the roles of OS services in process execution, device access, files, memory and resource sharing; distinguish an app from the kernel. |
| F099 | Privilege Levels, Traps, and System Calls | Explain how a user program requests protected OS services and why executing arbitrary privileged hardware operations is restricted. |
| F100 | Programs, Processes, and Address Spaces | Distinguish an executable file from a running process and its state, memory and execution context. |
| F101 | Virtual Versus Physical Addresses | Introduce the reason for address translation and protected per-process address spaces; reserve page-table mechanics for the OS course. |
| F102 | Files, Filesystems, and Persistent Data | Show how named files and directories abstract underlying persistent devices; distinguish saving a file from changing RAM. |
| F103 | How Computers Communicate | Follow a tiny message across a conceptual network stack; introduce packetization and protocols without requiring TCP/IP internals. |
| F104 | Concurrency and Sharing One Machine | Explain why multiple programs appear to run together and why CPU time and other resources must be shared or coordinated. |
| F105 | Protection, Failures, and Trust Boundaries | Explain why programs cannot be assumed correct or trusted, how bounds/errors matter, and why isolation, access checks and recovery are system concerns. |
| F106 | The Complete Journey of a Program | Trace a small source-level task through representation, translation, loading, CPU execution, memory, OS/device interaction and displayed output, naming what is simplified. |

## Projects

**P8-A · Required mini-project — Memory, I/O, and OS Boundary Explorer.** Add conceptual panels to the Machine Atlas for persistent storage, cache, device controller, and an OS service. Step through a file-write or display-output request. **Accept:** learner distinguishes an application's request, OS behavior and hardware action, and identifies which elements are simulated rather than implemented in the toy CPU.

**P8-B · Required major project — The End-to-End Computer Explorer (v8).** Integrate all preceding artifacts into one guided journey: edit source in the tiny language → translate to assembly → assemble → load machine bytes → execute instruction by instruction → inspect registers and memory → send output to a modeled device. Overlay a **conceptual**, separately labeled real-world OS/loader/memory hierarchy story. **Accept:** tests pass end to end; the learner can give a causal account of a program's output and list at least three simplifications of FS-8.

**P8-X · Optional extension — First System-Call Model.** Simulate a user-program request to an educational OS service, switching between user-mode and OS-mode *conceptually* with an auditable trace. This is a teaching visualization, not a protected kernel running on the original unprivileged FS-8 CPU.

**Feeds into:** Learners enter C, OS, Linux, networking, or Python/AI paths with a common vocabulary, mental model and tested project portfolio. Learners interested in processor design proceed to advanced architecture, HDL and performance topics.

**Primary curriculum anchors:** [CS2023 Systems Fundamentals / Architecture](https://csed.acm.org/wp-content/uploads/2025/11/CS2023-Report.htm), [OSTEP open chapters](https://pages.cs.wisc.edu/~remzi/OSTEP/), [MIT 6.191 schedule](https://6191.mit.edu/fall26/schedule).

---

## 2. Connected project progression and dependencies

The eight major projects form a single application and increasingly accurate model. Each stage imports the previous stage's data, components, or machine specification rather than restarting from a blank screen.

```text
P1-B  Machine Atlas (conceptual blocks and state)
  └─ P2-B  Byte Laboratory (representations and byte arrays)
       └─ P3-B  8-Bit ALU (gate-level operations on byte values)
            └─ P4-B  Memory Board (registers and addressed RAM)
                 └─ P5-B  FS-8 CPU (datapath + control + fixed ISA)
                      └─ P6-B  Assembler & Monitor (machine programs)
                           └─ P7-B  Tiny-Language Translator (source → FS-8)
                                └─ P8-B  End-to-End Explorer (system story)
```

### Shared project rules

1. **One machine specification:** every subsequent tool reads the same machine-state schema and ISA version; avoid hidden per-lesson rules.
2. **Reference tests:** maintain golden byte patterns, ALU operations, clock transitions, RAM state, instruction traces and end-to-end outputs.
3. **Inspection over spectacle:** learners can pause, step backward through a recorded trace, and inspect what changed.
4. **Two implementations where appropriate:** a correct reference engine makes lessons possible before learners finish the hardware construction; the learner-built version is tested against it.
5. **Explicit assumptions:** register count, memory size, byte width, clock model, instruction encoding, overflow behavior and device access rules are visible in a machine-spec page.
6. **Accessible delivery:** mouse, keyboard and text alternatives for drag/drop circuits; full offline-capable learning materials where licenses allow.
7. **Honest terminology:** a toy loader, toy compiler, or toy OS overlay is called exactly that; it is not mislabeled as Linux, a C compiler, or a modern processor.

## 3. Mastery and spaced-repetition specification

Every lesson should generate a small practice set with at least the following dimensions:

| Practice type | Example | What it tests |
|---|---|---|
| Definition/recognition | “What does `PC` stand for in this processor model?” | Retrieval of vocabulary |
| Mechanism/prediction | “After this clock edge, what value is in `R0`?” | State-transition reasoning |
| Representation transfer | “Show `-3` as an eight-bit two's-complement pattern.” | Applying a representation rule |
| Error diagnosis | “Why does this incorrect branch trace go wrong?” | Detecting a mental-model error |
| New context | “Would a new bit pattern mean the same thing under a different encoding?” | Transfer beyond the rehearsed example |

**Scheduling principle:** use a configurable spaced-repetition system based on performance, not a rigid universal interval. Failed mechanism questions should direct students to the relevant simulation or explanation; successful definition cards do not substitute for project completion.

**Suggested course gate:** complete core lesson checks, pass the major project tests, and answer an unseen transfer/tracing problem. Exact mastery thresholds should be calibrated using pilot data rather than asserted without evidence.

## 4. Boundaries: what belongs in later paths

| Later path | Teach there, not as a Foundations requirement | Foundations provides |
|---|---|---|
| **C and systems programming** | Full C syntax, pointer arithmetic/provenance, object lifetimes, `malloc`/`free`, undefined behavior, extensive ABIs and debugging | Binary data, addresses, arrays, basic pointers, machine instructions, source-to-executable pipeline |
| **Operating systems** | Kernel implementation, CPU scheduling algorithms, paging/page tables/TLBs, synchronization, filesystems internals | OS role, processes, protected services, virtual-address concept, I/O events |
| **Linux** | Shell workflows, processes/signals in practice, permissions, ELF details, packages, services, administration | Hardware/software model, process and file concepts |
| **Networking** | TCP/IP detail, routing, DNS, sockets, congestion control, protocol reliability | Encoding, state machines, interfaces, packets as an introduction |
| **Python and AI** | Python runtime internals, data structures, numerical computing, machine learning and GPUs | Algorithms, representations, finite precision, program execution |
| **Advanced computer architecture** | Pipelining, branch prediction, out-of-order execution, cache design, coherence, RISC-V details, Verilog/HDL, FPGA implementation | Logic, registers, RAM, ISA, CPU datapath/control, timing concepts |
| **Compilers** | Parsing theory, type checking, intermediate representations, optimization, register allocation, linking depth | A small translator and the conceptual stages of a program build |
| **Electronics and VLSI** | Transistor circuit sizing, chip fabrication, physical timing closure, power distribution | Digital abstraction and the purpose of switching circuits |

The platform should avoid using graduation as a barrier to starting all code: after Courses 1–2, a learner may explore a beginner programming track; after Course 6, they have the hardware model needed to begin a systems-oriented C path. Completing all eight supplies the shared systems foundation.

## 5. Completion criteria for the whole Foundations area

At graduation, a learner should be able to:

- [ ] Explain how bit patterns can mean different things under different encodings.
- [ ] Correctly interpret binary, hexadecimal, eight-bit signed integers and simple overflow.
- [ ] Predict the outputs of truth tables, adders and selected ALU operations.
- [ ] Distinguish combinational logic from clocked state and explain a register write.
- [ ] Read and write an addressable memory model without confusing addresses and values.
- [ ] Trace at least one complete CPU instruction using registers, PC, memory and control signals.
- [ ] Explain branches and loops as state changes at machine level.
- [ ] Assemble, execute and debug a tiny program with a deterministic trace.
- [ ] Connect variables, arrays and introductory pointer concepts to a declared memory model.
- [ ] Distinguish source code, assembly, object files, executables, linking and loading.
- [ ] Explain RAM vs storage, hardware vs OS service, and application vs process.
- [ ] Identify at least three simplifications in the educational processor and how real systems can differ.
- [ ] Complete the end-to-end capstone and explain its result without treating any intermediate step as magic.

---

## 6. Source notes and research basis

This **syllabus is an original synthesis**; the sources support coverage and sequencing, not the exact count of 106 lessons or the FS-8 specification.

1. **Nisan and Schocken, Nand2Tetris:** official [course and projects](https://www.nand2tetris.org/course), especially [Boolean Logic](https://www.nand2tetris.org/project01), [Arithmetic](https://www.nand2tetris.org/project02), [Memory](https://www.nand2tetris.org/project03), architecture, machine language, assembler, and the final OS library project. Provides the principal cumulative-building pattern.
2. **Charles Petzold, *Code*, second edition (2022):** [author's chapter changes and rationale](https://www.charlespetzold.com/blog/2022/09/The-Changes-for-the-2nd-Edition-of-Code.html). Particularly valuable for connecting codes, logic, feedback, memory, and processor construction.
3. **MIT 6.004 Computation Structures:** [official open course collection](https://computation-structures.github.io/course/). Develops digital abstraction → combinational and sequential logic → state machines → processors.
4. **MIT 6.191 (2026):** [official schedule](https://6191.mit.edu/fall26/schedule). Confirms the progression from combinational/sequential design to assembly and processor implementation; later memory and pipeline units inform the follow-on architecture path.
5. **Harvard CS50:** [Week 0](https://cs50.harvard.edu/x/weeks/0/) for representation, abstraction, algorithms and first programming concepts; [course syllabus](https://cs50.harvard.edu/x/) for its beginner-first approach.
6. **Ben Eater:** [8-bit computer modules](https://eater.net/8bit) and [schematics](https://eater.net/8bit/schematics). Inspires observable clock, ALU, registers, RAM, program counter and control.
7. **Bryant and O'Hallaron, CS:APP:** [official book site](https://csapp.cs.cmu.edu/). Chapters 1–3 inform the source/compilation/machine-program bridge; more advanced content belongs in systems pathways.
8. **ACM/IEEE-CS/AAAI CS2023:** [official curricular report](https://csed.acm.org/wp-content/uploads/2025/11/CS2023-Report.htm), especially Architecture and Organization (AR) and Systems Fundamentals (SF). Provides a topic-coverage audit; its CS Core and KA Core are not a prescribed lesson order.
9. **Arpaci-Dusseau and Arpaci-Dusseau, OSTEP:** [free chapters](https://pages.cs.wisc.edu/~remzi/OSTEP/), which organize further OS learning around virtualization, concurrency and persistence.
10. **GNU C Introduction and Reference Manual:** [free manual](https://www.gnu.org/software/c-intro-and-ref/manual/). A follow-on reference for actual C language rules; conceptual introductory pointers in this document must not be mistaken for the complete C object model.

**Evidence limitations:** These primary sources justify the topic families and many prerequisite choices; they do not experimentally prove that this exact sequence or lesson count is optimal. A pilot with novice learners should determine whether any 5–10 minute lesson needs splitting, merging, or additional prerequisite practice. Linked resources are source material or follow-up references; verify reuse rights before embedding third-party content in an open platform.

---

## 7. Implementation checklist for the curriculum team

1. Freeze lesson IDs and concepts; allow descriptions and pacing to evolve without breaking project references.
2. Create the FS-8 reference specification and executable test engine before publishing Course 5.
3. Build the shared machine-state viewer once, then add Course 2–8 panels incrementally.
4. Author one prediction task, one explanation task and at least one diagnostic wrong answer per lesson.
5. Record project artifacts, version compatibility and test results as the learner progresses.
6. Add course-specific guided tours so no learner must master the full app UI on day one.
7. Run moderated novice tests at three milestones: after F022, F048 and F077; measure misconceptions and confusion, not just lesson completion.
8. Publish a transparent version history and an open process for correcting inaccuracies and updating links.

**Final design decision:** Eight courses remain the right structure. Expand lesson granularity from the initial 83 to **106**, add **16 required connected projects** (eight mini-projects and eight major milestones) and **eight optional extensions**, and preserve a clean handoff to deeper C, OS, Linux, networking, Python/AI, and computer architecture paths.
