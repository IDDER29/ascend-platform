# Course 4 — State, Clocks, Registers, and Memory

**Foundations Curriculum v2.0 — Course 4 of 8**  
**Shared plan:** [Foundations overview](01_foundations_overview.md) · **Machine ISA:** [FS-8 v1.0 specification in Course 5](06_course_05_cpu_architecture.md)  
**Navigation:** [Overview](01_foundations_overview.md) · [Previous course](04_course_03_logic_and_circuits.md) · [Next course](06_course_05_cpu_architecture.md)

**Note:** All course project acceptance criteria, debugging tasks, transfer assessments and primary source links are preserved below. FS-8 machine rules are defined normatively in the appendix to Course 5, not separately in each course.

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

**P4-A · Guided lab (non-gating) — Register and Counter Lab.** Build an eight-bit register and counter, with reset, load, increment and hold controls. **Accept:** state changes only at the modeled events and test cases include consecutive updates and hold cycles.

**P4-B · Required core milestone — The Memory Board (v4).** Add the eventual FS-8 memory array of **256 byte-addressable locations**, with an address selector, data in/out, read and write controls, and a timeline of mutations. At this stage, all addresses are ordinary RAM; the later code/data/stack regions are **software conventions**, not separate memory chips. Compare against the Byte Laboratory's exported datasets. **Accept:** isolated writes leave other locations unchanged; reads reproduce previously written data; reset/initialization rules are explicit.

**P4-X · Optional extension — Tiny Sequencer.** Create a clocked finite-state controller that runs a read–modify–write sequence over memory and visually exposes its states.

### Independent debugging and unseen transfer

**Independent debugging challenge (D4):** RAM writes to address `0x22` unexpectedly modify `0x23`. Diagnose the decoder/write-enable fault without editing any other cell. **Unseen transfer:** trace two clock edges with changing input and load enables. **Evidence:** final memory, selected address, and clocked-state argument.

**Feeds into:** The CPU will read instructions and operands from the same modeled memory; its registers will use the register components built here.

**Primary curriculum anchors:** [Nand2Tetris Project 3](https://www.nand2tetris.org/project03), [MIT sequential logic](https://computation-structures.github.io/course/lectures/L05_Sequential_Logic.html), [Ben Eater registers](https://eater.net/8bit/registers), [Ben Eater RAM](https://eater.net/8bit/ram).

---

