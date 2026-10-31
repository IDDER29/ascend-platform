# Course 3 — Boolean Logic and Digital Circuits

**Foundations Curriculum v2.0 — Course 3 of 8**  
**Shared plan:** [Foundations overview](01_foundations_overview.md) · **Machine ISA:** [FS-8 v1.0 specification in Course 5](06_course_05_cpu_architecture.md)  
**Navigation:** [Overview](01_foundations_overview.md) · [Previous course](03_course_02_binary_and_data.md) · [Next course](05_course_04_state_and_memory.md)

**Note:** All course project acceptance criteria, debugging tasks, transfer assessments and primary source links are preserved below. FS-8 machine rules are defined normatively in the appendix to Course 5, not separately in each course.

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

**P3-A · Guided lab (non-gating) — Logic Gate Workbench.** Use a browser circuit editor to build NAND, XOR, a mux, and a half-adder; auto-check each against a reference truth table. **Accept:** equivalent circuits produce the same outputs on all valid inputs, including multi-output circuits.

**P3-B · Required core milestone — The 8-Bit ALU (v3).** Implement arithmetic and Boolean operations, selectable by ALU control codes. The learning circuit may **display carry-out and other diagnostic wires**, but the later FS-8 CPU architecturally exposes **only the Z flag**; these must not be conflated. Show inputs and outputs as binary/hex/unsigned/signed through the existing Byte Laboratory. **Accept:** deterministic tests cover normal and overflow cases, and all operations match the declared eight-bit specification.

**P3-X · Optional extension — Make the Circuit Smaller.** Build the same functionality from NAND-only primitives and compare component counts and conceptual signal depth, without claiming a realistic silicon-area model.

### Independent debugging and unseen transfer

**Independent debugging challenge (D3):** An eight-bit adder gives the correct low byte but always loses its carry-out. Locate the faulty connection using a truth table and a failing vector. **Unseen transfer:** derive the outputs of a previously unseen two-output circuit. **Evidence:** explain the cause and show the corrected test case.

**Feeds into:** The ALU becomes an actual CPU component in Course 5; muxes and decoders are reused to build Course 4 memory.

**Primary curriculum anchors:** [Nand2Tetris Projects 1–2](https://www.nand2tetris.org/course), [MIT combinational logic](https://computation-structures.github.io/course/lectures/L04_Combinational_Logic.html), [Ben Eater's ALU](https://eater.net/8bit/alu).

---

