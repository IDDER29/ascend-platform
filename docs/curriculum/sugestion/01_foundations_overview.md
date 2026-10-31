# Computer Science Foundations — Complete Curriculum Blueprint

**Version:** 2.0 · **Revised:** October 31, 2026 · **Supersedes:** v1.0  
**Audience:** Absolute beginners; no programming, mathematics beyond basic arithmetic, or electronics experience assumed.  
**Format:** Eight connected courses, **106 short lessons**, **8 required cumulative milestones**, **8 guided practice labs** (non-gating), **8 optional extensions**, one **required real-C transfer task**, retrieval-practice cards, independent debugging, and unseen mastery assessments.  
**Destination paths:** C and systems programming; operating systems; Linux; networking; Python and AI; and, optionally, deeper computer architecture.  
**Status:** Proposed, implementation-oriented curriculum specification. Not an accredited syllabus, a proven optimal sequence, a production CPU design, or a complete C/OS course.

**v2 changes:** A frozen, testable FS-8 ISA and machine-state contract; required real-compiler evidence; ungated guided labs; independently graded debugging and transfer; clearer beginner support, course readiness gates, pilot-validation rules, and acceptance criteria. See Sections 3, 5, 8–11 and [Appendix A in Course 5](06_course_05_cpu_architecture.md).

> **North-star outcome:** A graduate can take a small program, explain how its bits encode information and instructions, trace those instructions through registers and memory in a simplified CPU, and identify the roles played by a compiler, loader, and operating system. The graduate knows which details the educational model leaves out.

---

## 1. Curriculum decisions

**Keep the eight-course structure.** The earlier 83-lesson estimate was a planning placeholder; 106 entries deliberately divide conceptually demanding transitions into short lessons. **Do not promise that 106 is ideal**: split/merge after novice pilots. A ninth compulsory course is not justified at this stage; advanced C, OS implementation, real microarchitecture, electronics, and networking remain separately navigable paths. **Learners may begin introductory programming before graduating**, and C can begin alongside the later hardware/assembly courses.

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

Each course has **one gated major milestone** (8 total), **one small guided lab** (8 total, nongating; equivalently demonstrated skills are accepted), **one optional stretch extension** (8 total), and an independent diagnostic challenge. **The Course 7 real-C evidence task is mandatory** but is incorporated into its course gate, not a ninth unrelated large project. The eight major milestones are successive versions of one learning environment; curated reference implementations are supplied so a stuck build does not block conceptual learning.

### 1.2 Teaching contract

- **A lesson is one testable concept, not one chapter in a textbook.** Target 5–10 minutes of explanation; interactive practice and projects are additional time.
- **Show the mechanism before naming everything around it.** Start with an observable problem, make the state/data flow visible, then introduce terminology.
- **Separate representations from interpretations.** Bits do not tell you by themselves whether they represent an integer, character, instruction, or pixel.
- **Separate the educational computer from a modern computer.** Educational choices are labeled *FS-8 model*; actual CPU, C-language, and OS behavior may differ.
- **Use lightweight prerequisite reminders.** For example, recall binary place values before overflow; recall registers and RAM before an instruction-cycle trace.
- **Every concept gets at least one recall item and one prediction or transfer item.** Spaced repetition reinforces a model; it does not replace building and debugging.
- **Never require a physical electronics kit, paid textbook, Linux installation, or local compiler to complete Foundations.** Use browser-based simulators, and provide genuine precompiled C artifacts with recorded provenance and a separate online/live-compilation option.
- **Each lesson has two checks:** a short retrieval question and an unfamiliar *predict/explain/debug* item that cannot be passed by memorizing the lesson's animation.
- **Assess claims at the right abstraction layer:** a toy CPU trace establishes FS-8 behavior; a real compiler inspection establishes target-specific C implementation behavior; neither alone establishes the entire C standard or modern OS behavior.
- **Mastery is revisitable, not permanently locked:** incorrect answers trigger one targeted explanation, then a fresh isomorphic problem—not the same item with memorized numbers.
- **Accessible alternatives:** every visual interactive has a keyboard-operated, screen-reader-friendly and text-table execution mode, with clear contrast and reduced-motion support.

### 1.3 Shared example machine: FS-8

The projects gradually reveal **Foundations System 8 (FS-8)**, a **fictional educational machine** with an explicitly frozen **v1.0 machine specification** in **[Appendix A of Course 5](06_course_05_cpu_architecture.md)**. The version of the curriculum (v2.0) is deliberately distinct from the machine-ISA version (FS-8 v1.0).

- Eight-bit data; **256 byte-addressed RAM locations**; four eight-bit registers (`R0`–`R3`); eight-bit `PC` and `SP`; one `Z` flag.
- **Fixed two-byte instructions** (an opcode/register byte and an operand byte); an explicitly encoded instruction vocabulary including loads, stores, arithmetic, jumps, `CALL`, `RET`, `PUSH`, `POP`, input, output, and `HALT`.
- A **documented memory map by convention** (code, variables, stack, scratch), with **no built-in memory protection or virtual memory**. The OS path will teach the difference.
- Defined reset state, bounded stack, zero-flag rules, integer wraparound, port-based I/O, invalid-instruction/PC faults, and instruction-state changes.
- A single reference ISA interpreter and golden tests used by the CPU builder, assembler, translator, debugger, and end-to-end explorer.

**Integration rule:** Before Course 5 is developed, implement and test **Appendix A** as the source of truth. Do not invent instruction formats, port rules, stack behavior, or address conventions inside an individual lesson. Later projects may *reveal* a machine feature when it is taught, but may not silently redefine its semantics. A future extension must have a new explicit ISA version and migration tests.

---

> **Split-document edition:** This curriculum is organized into nine downloadable Markdown files. Save the files together in the same folder to use the internal links. The overview contains all shared requirements, graduation rules, references, and a link to the **normative FS-8 v1.0 machine specification in Course 5**. Course 7 includes the required real-C compilation lab. No lesson or project has been omitted.

## Course files

1. [Course 1 — Understanding Computers and Information](02_course_01_computers_and_information.md)
2. [Course 2 — Binary, Numbers, and Data Representation](03_course_02_binary_and_data.md)
3. [Course 3 — Boolean Logic and Digital Circuits](04_course_03_logic_and_circuits.md)
4. [Course 4 — State, Clocks, Registers, and Memory](05_course_04_state_and_memory.md)
5. [Course 5 — Computer Architecture: Building a CPU](06_course_05_cpu_architecture.md)
6. [Course 6 — Machine Language and Assembly Programming](07_course_06_machine_language.md)
7. [Course 7 — From Source Code to Machine Execution](08_course_07_source_to_execution.md)
8. [Course 8 — How a Complete Computer System Works](09_course_08_complete_system.md)

---

## 2. Connected project progression and dependencies

The eight **required core milestones** form a single application and increasingly accurate model. The eight smaller labs are guided practice, not additional completion gates. Each stage imports the previous stage's data, components, or machine specification rather than restarting from a blank screen.

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

## 3. Mastery, independent debugging, and spaced repetition

**Mastery contract:** Every lesson has one named learning objective, explicit prerequisites, one mechanism/prediction item, one misconception distractor, one delayed retrieval item, and one *unseen* transfer item. A course gate has (a) an independent trace/prediction, (b) a **diagnosis of a deliberately seeded bug** (D1–D8), and (c) its **required core milestone**. The eight guided labs are practice support, not eight additional gates. Course 7 additionally requires the **real-C evidence checkpoint P7-C**.

| Evidence | Typical task | Success signal | Failure treatment |
|---|---|---|---|
| Recall | Define `PC` or convert a binary value | Correct explanation without cues | Spaced retrieval and a compact refresher |
| Mechanistic prediction | Predict register/RAM before and after a step | Correct state transition **and reason** | Compare to a visible trace, then try new data |
| Independent debugging | Identify a bad decoder or off-by-two branch target | Find first divergence, explain cause, test a fix | Offer progressively smaller hints; retry an **alternate bug** |
| Transfer | Use an unfamiliar CPU state, encoding, or C compiler listing | Apply underlying concept in a new surface form | Bridge from old to new representation without giving the answer |
| Building | Pass deterministic tests against reference machine | Correct artifact and explanation of design choices | Keep reference tools available; don't trap students in UI plumbing |
| Boundary awareness | Identify toy vs. real machine claims | Accurately name assumptions, implementation dependence | Show paired contrasting examples |

**Spaced-practice policy:** Schedule recall through a configurable algorithm that adapts to performance; do not hardcode a single supposedly optimal interval. Cards should include definitions, predicted state deltas, representation transformations, error diagnoses, and model-boundary distinctions. A correct term-definition card **cannot** compensate for failure to trace a program or debug a circuit. Avoid using the exact same answer-bearing numerical examples repeatedly.

**Course-gate decision rule (provisional):** Require passing the core milestone's functional tests, correctly justifying **one fresh unseen state/transfer task**, and solving **one new seeded debugging case** unaided or after documented remediation. The platform may tentatively choose `≥80%` accuracy for low-stakes recall checks, but **this is a product assumption requiring pilot calibration**, not a research-backed universal mastery threshold. Offer a fresh equivalent attempt instead of permanent failure. Prompt learners to review weak prerequisites rather than making them rewatch entire courses.

**Grading integrity:** Separate practice item banks from summative item banks; randomize inputs and fault location under tested constraints; record the reference output, explanation rubric, and machine-spec version for each item. Do not grade solely on a final displayed answer: inspect the state trace or the learner's reasoned explanation when the learning objective demands it.

**Beginner support:** Before each unfamiliar interface, present a worked example, then a partially guided task, then an unguided variant. Separate problems caused by interaction mechanics from problems caused by misunderstanding. Hints may be used in practice, but the independent course check gets a fresh problem afterward.

### 3.1 Course readiness gates

| After | An independent learner can… | Required evidence |
|---|---|---|
| Course 1 | Explain a state change and encode/decode a simple bit code | Machine Atlas + D1 + novel state model |
| Course 2 | Interpret unfamiliar bytes as signed/unsigned/text; predict overflow | Byte Laboratory + D2 + new byte/overflow case |
| Course 3 | Construct and verify multi-output logic and ALU behavior | ALU + D3 + unfamiliar truth table |
| Course 4 | Explain exact register and RAM writes at specified events | Memory Board + D4 + novel clocked memory trace |
| Course 5 | Trace instructions with PC, flags, registers and RAM | FS-8 CPU + D5 + novel machine-state trace |
| Course 6 | Assemble, execute and debug a real FS-8 program | Assembler + D6 + new labels/branch test |
| Course 7 | Trace toy code **and** analyze actual compiled C with provenance | Translator + D7 + **required P7-C** |
| Course 8 | Explain a complete execution journey and model limitations | Explorer + D8 + new toy/real comparison |

### 3.2 Readiness and parallel pathways

- **After Course 2:** Learners can try optional beginner programming labs without abandoning the hardware path.
- **After Course 6:** Learners can start the **C path** in parallel with Courses 7–8. Do not imply C needs 106 lessons first.
- **After Course 7:** Learners can discuss code-to-machine relationships but must continue studying real C semantics, object lifetime, and tooling in the C track.
- **After Course 8:** Learners have the shared conceptual foundation—not expertise in kernel design, Linux administration, networking protocols, compiler engineering, or computer architecture research.

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
- [ ] Analyze **actual compiler-generated C assembly** for a declared compiler, target and optimization level; articulate at least two differences from FS-8.
- [ ] Debug an **unseen** broken program/circuit by identifying the first state divergence and validating a fix.
- [ ] Transfer at least one learned mechanism to an unfamiliar case without replaying the original guided example.
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
11. **Compiler Explorer:** [official hosted tool](https://godbolt.org/) and [open-source project](https://github.com/compiler-explorer/compiler-explorer). Provides genuine compiler-generated assembly and supports different compilers/flags; online service is best-effort, so the curriculum ships **reproducible precompiled evidence** as an offline fallback.
12. **Computing-education evidence:** Sorva's [notional-machines review](https://eric.ed.gov/?id=EJ1042409), Herman et al. on [number representations](https://doi.org/10.1080/08993408.2011.611712), and Kohn on [assignment conceptions](https://doi.org/10.1145/3017680.3017724) inform the diagnostic emphasis. They do **not** experimentally validate this exact 106-lesson order or mastery cutoff.

**Evidence limitations:** These primary sources justify the topic families and many prerequisite choices; they do not experimentally prove that this exact sequence or lesson count is optimal. A pilot with novice learners should determine whether any 5–10 minute lesson needs splitting, merging, or additional prerequisite practice. Linked resources are source material or follow-up references; verify reuse rights before embedding third-party content in an open platform.

---

## 7. Implementation checklist for the curriculum team

1. Freeze lesson IDs and concepts; allow descriptions and pacing to evolve without breaking project references.
2. Implement the **frozen FS-8 v1.0 reference specification and golden tests in Appendix A** before publishing Course 5.
3. Build the shared machine-state viewer once, then add Course 2–8 panels incrementally.
4. Author one prediction task, one explanation task, one evidence-labeled misconception and one *unseen transfer* variant per lesson.
5. Record core milestone artifacts, machine-spec version, independent debugging evidence, transfer results and optional guided-lab progress separately.
6. Add course-specific guided tours so no learner must master the full app UI on day one.
7. Run moderated, consent-based novice tests after F022, F048, F077, F091 and F106; measure misconceptions, transfer and debugging—not merely completion.
8. Bundle and verify genuine compiled C artifacts and source/target/compiler metadata; publish a transparent errata/version history and open process for correcting broken links.

**Final design decision (v2):** Keep **eight courses and 106 planned lessons**, but require **eight integrated major milestones**, provide **eight nongating guided labs** and **eight optional extensions**, and assess **one real compiled-C transfer task** plus independent debugging and unseen transfer. Treat lesson granularity, the FS-8 experience, and mastery thresholds as hypotheses to validate with genuine novices. Do not claim the curriculum is "perfect" until pilot data and implementation tests support it.


---

## 8. Required real-C transfer lab

The complete required lab, including the verified C example, assembly comparison and grading rubric, has been moved into **[Course 7 — From Source Code to Machine Execution](08_course_07_source_to_execution.md#required-real-c-transfer-lab)** so the actual course specification and lab remain together.

---

## 9. Independent debugging and assessment design

The earlier D1–D8 examples describe the *kind* of course bug. They are not the secret summative questions themselves. The assessment engine should maintain multiple validated seeded-fault variants for each course and reserve unseen variants for independent attempts.

**Standard debugging sequence:** (1) State expected behavior. (2) Predict the first relevant state. (3) Run the faulted version. (4) Identify **the first divergence**, not simply the last wrong output. (5) Form a causal hypothesis. (6) Repair or select a repair. (7) Re-run old and new tests. (8) Explain why the repair works.

| Course | Seedable faults (examples, not exam answers) | What is actually measured |
|---|---|---|
| 1 | Wrong state update order; mislabeled block interface | Can distinguish state, input, output and action |
| 2 | Incorrect two's complement decoding; wrong byte truncation | Numerical representation and reasoning |
| 3 | Lost carry output; wrong mux select; inverted gate input | Multiple outputs, Boolean functions, compositionality |
| 4 | Miswired decoder; ungated write; wrong clock edge | State, address isolation, timing assumptions |
| 5 | PC increment by 1 not 2; stale zero flag; wrong register write | Precise instruction transition under FS-8 v1.0 |
| 6 | Label interpreted as instruction index; wrong second-byte register field | Encoding, addressing and symbolic assembly |
| 7 | Overlapping variable addresses; incorrect branch lowering; mistaken register/stack claim | Source-to-machine tracing and real-code evidence |
| 8 | Conflating RAM and disk; conflating toy OUT with a system call | System boundaries and accurate causal explanations |

**Assessment implementation requirements:**

1. For every faulted task, store its **clean reference**, mutant implementation, input scenario, machine-spec version, expected first divergence, and one acceptable remediation.
2. Generate summative tasks with **different numbers/addresses/starting states** and, when feasible, different fault locations from the guided task. Replaying screenshots must not pass.
3. Record whether the student had hints; offer hints in practice, followed by an unseen equivalent assessment. Never demand endless retries of an unchanged question.
4. Allow explanatory answers as text, structured state selections, or accessible step-table entries; evaluate the *mechanism*, not typing speed or a drag-and-drop interface.
5. Report separately: vocabulary retrieval, mechanical prediction, debugging, transfer and project correctness. Overall completion cannot hide a failed essential skill.
6. Run automated golden tests against every mutation so the proposed bug is real and has a deterministically checkable failure signature.

**Misconception registry:** Label each candidate with `evidence=research-backed` or `evidence=instructional-hypothesis`, source link when available, observation item, and remedial explanation. Do not report “most common misconception” without prevalence data for the audience being taught.

---

## 10. Release validation with genuine beginners

**Pilot cohort:** Recruit volunteers who have **no prior programming or electronics background**. Include varied language backgrounds and accessibility needs. Do not infer skill level solely from age, school, or self-confidence. Collect consent for any analytics and avoid unnecessary personal data.

**Three checkpoints:** After F022 (representation), F048 (memory and timing), and F077 (assembly/CPU), plus the F091 real-C checkpoint and final F106 capstone. Observe each learner trying to predict state before seeing the animation. Ask them to explain the outcome using their own words.

**Collect evidence:** prerequisite failure patterns, incorrect explanations, time-on-task including practice, simulator interaction failures, help usage, first-divergence debugging success, delayed recall, unseen-transfer performance, dropout points, and observed gaps between model and reality.

**Revise by rule:**

- Split a lesson when novices repeatedly fail for **two conceptually distinct reasons**, not merely because its title sounds advanced.
- Merge lessons when they teach effectively the same prerequisite and the split adds navigation without improving understanding.
- Move a prerequisite earlier when a majority of observed failures point to it rather than to the current concept; do not infer causation from completion analytics alone.
- Reword or redraw a simulator when learners understand the concept orally but cannot operate the UI.
- Raise or lower assessment cutoffs only after inspecting item difficulty and false passes; do not maximize pass rates at the expense of transfer.
- Revalidate all downstream golden tests after changes to the ISA, source-language subset, assembler, or machine-state schema.

**What would count as strong evidence of success?** Learners who have not seen a particular assessment can correctly reason about unfamiliar bit patterns, circuits, clocked memory, machine instructions, and compiler output; they can locate and explain novel faults; they can identify simplifications of the educational model. Do not claim this from watch time, streak length, or card accuracy alone.

**Versioning and governance:** Keep stable lesson IDs; issue separate machine-spec versions; log source-link checks, errata, accessibility defects, and evidence-driven changes. A release candidate is blocked by failing golden tests, invalid transfer questions, inaccessible required controls, or an unverified compiled-C evidence package.

---

## 11. Curriculum acceptance checklist (release gate)

- [ ] Exactly eight course outlines and 106 unique lesson IDs (`F001`–`F106`), each with a title and a teachable description.
- [ ] Eight required core milestones, eight **nongating** guided labs, eight optional extensions, and one mandatory **real C** evidence checkpoint.
- [ ] Every course names prerequisite understanding, an outcome, one independently seeded fault, one unseen transfer and its core project's functional checks.
- [ ] The FS-8 CPU, assembler, translator and stepper all consume the *same* pinned FS-8 v1.0 specification and golden tests from Appendix A.
- [ ] A novice can use a supplied reference implementation rather than being blocked by incomplete construction tools.
- [ ] A real compiled C example and its verified compiler metadata are available **without any third-party service**.
- [ ] Toy program execution and real C execution are shown in separate, accurately labeled pipelines.
- [ ] All key questions support keyboard and screen-reader alternatives and do not rely solely on color, audio, drag-and-drop or animation.
- [ ] Novel debugging/transfer questions are tested for ambiguous answers; wrong answers have diagnosed causes, not just a red X.
- [ ] No learner is forced to finish all eight courses to start an introductory programming or C track.
- [ ] Pilot findings and known limitations are published, and scope boundaries remain explicit.

---

## Appendix A — FS-8 v1.0 Machine Specification

The complete **normative machine specification, instruction set, reset/memory rules, golden test vectors, and translator contract** are located in **[Course 5 — Computer Architecture, Appendix A](06_course_05_cpu_architecture.md)**. This keeps the technical reference alongside the CPU course, while the overview retains the shared curriculum policies.

---

## Document change log

| Version | Change |
|---|---|
| 1.0 | Eight courses, 106 lessons, 16 required projects and eight optional extensions; conceptual FS-8 model. |
| **2.0** | Kept eight courses and 106 lessons; reduced required project **gates to eight**; made mini labs nongating; made real compiled-C transfer mandatory; added per-course fault diagnosis and unseen transfer; froze executable FS-8 ISA, stack, flags, memory/I/O rules and golden vectors; strengthened accessibility and novice-pilot validation. |
