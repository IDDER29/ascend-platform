# Course 1 — Understanding Computers and Information

**Foundations Curriculum v2.0 — Course 1 of 8**  
**Shared plan:** [Foundations overview](01_foundations_overview.md) · **Machine ISA:** [FS-8 v1.0 specification in Course 5](06_course_05_cpu_architecture.md)  
**Navigation:** [Overview](01_foundations_overview.md) · [Next course](03_course_02_binary_and_data.md)

**Note:** All course project acceptance criteria, debugging tasks, transfer assessments and primary source links are preserved below. FS-8 machine rules are defined normatively in the appendix to Course 5, not separately in each course.

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

**P1-A · Guided lab (non-gating) — Make a Codebook.** Give learners a set of distinct two- or three-bit patterns and ask them to assign messages, encode a short phrase, decode one from another learner, and explain why both parties need the same mapping. **Accept:** all symbols decode under the declared mapping; learner identifies that meaning is not inherent in the bit pattern.

**P1-B · Required core milestone — The Machine Atlas (v1).** Start the platform's shared interactive model: four conceptual blocks (input, processing, memory, output) with arrows showing information moving between them. A manual “step” button reveals how a simple instruction changes stored state. **Accept:** the learner can narrate each step and identify what changed and what stayed unchanged.

**P1-X · Optional extension — Two-State Communication.** Simulate transmitting binary symbols through a noisy channel, then ask how two participants agree on signal thresholds and codes. This is a preview of communications, not an electronics course.

### Independent debugging and unseen transfer

**Independent debugging challenge (D1):** The Machine Atlas mistakenly shows output changing before its input was processed. Reorder the state-change trace and justify the corrected sequence. **Unseen transfer:** model a traffic-light controller as input/state/output, explain what information would have to be stored. **Evidence:** an explanation of changed versus unchanged state, not only a rearranged picture.

**Feeds into:** Course 2 uses the codebook's symbols as bits and bytes; the Machine Atlas remains the frame into which circuits and CPU components are inserted.

**Primary curriculum anchors:** [CS50 Week 0](https://cs50.harvard.edu/x/weeks/0/), [Petzold's account of *Code* (2e)](https://www.charlespetzold.com/blog/2022/09/The-Changes-for-the-2nd-Edition-of-Code.html), [MIT 6.004 course introduction](https://computation-structures.github.io/course/).

---

