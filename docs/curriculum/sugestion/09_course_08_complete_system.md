# Course 8 — How a Complete Computer System Works

**Foundations Curriculum v2.0 — Course 8 of 8**  
**Shared plan:** [Foundations overview](01_foundations_overview.md) · **Machine ISA:** [FS-8 v1.0 specification in Course 5](06_course_05_cpu_architecture.md)  
**Navigation:** [Overview](01_foundations_overview.md) · [Previous course](08_course_07_source_to_execution.md)

**Note:** All course project acceptance criteria, debugging tasks, transfer assessments and primary source links are preserved below. FS-8 machine rules are defined normatively in the appendix to Course 5, not separately in each course.

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

**P8-A · Guided lab (non-gating) — Memory, I/O, and OS Boundary Explorer.** Add conceptual panels to the Machine Atlas for persistent storage, cache, device controller, and an OS service. Step through a file-write or display-output request. **Accept:** learner distinguishes an application's request, OS behavior and hardware action, and identifies which elements are simulated rather than implemented in the toy CPU.

**P8-B · Required core milestone — The End-to-End Computer Explorer (v8).** Integrate all preceding artifacts into one guided journey: edit a **toy-language** source → translate to FS-8 assembly → assemble → load bytes → single-step the educational CPU → inspect registers and RAM → send output to its virtual device. In a **visibly separate real-world panel**, trace a verified compiled C example through toolchain and OS abstractions, using the P7-C evidence package; do **not** claim FS-8 runs compiled C or implements Linux. **Accept:** end-to-end toy tests pass; learner independently explains the two distinct pipelines, explains the program output, and names three honest FS-8 simplifications.

**P8-X · Optional extension — First System-Call Model.** Simulate a user-program request to an educational OS service, switching between user-mode and OS-mode *conceptually* with an auditable trace. This is a teaching visualization, not a protected kernel running on the original unprivileged FS-8 CPU.

### Independent debugging and unseen transfer

**Independent debugging challenge (D8):** A walkthrough incorrectly claims that FS-8's `OUT` instruction is a Linux system call and that its `PC` is a **virtual process address translated by an MMU**. Identify both category errors and write a corrected causal explanation. **Unseen transfer:** trace a different program's journey across translation, loading, execution, and output while distinguishing the toy and real cases. **Evidence:** explicit model boundaries.

**Feeds into:** Learners enter C, OS, Linux, networking, or Python/AI paths with a common vocabulary, mental model and tested project portfolio. Learners interested in processor design proceed to advanced architecture, HDL and performance topics.

**Primary curriculum anchors:** [CS2023 Systems Fundamentals / Architecture](https://csed.acm.org/wp-content/uploads/2025/11/CS2023-Report.htm), [OSTEP open chapters](https://pages.cs.wisc.edu/~remzi/OSTEP/), [MIT 6.191 schedule](https://6191.mit.edu/fall26/schedule).

---

