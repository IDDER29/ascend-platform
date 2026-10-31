# Course 7 — From Source Code to Machine Execution

**Foundations Curriculum v2.0 — Course 7 of 8**  
**Shared plan:** [Foundations overview](01_foundations_overview.md) · **Machine ISA:** [FS-8 v1.0 specification in Course 5](06_course_05_cpu_architecture.md)  
**Navigation:** [Overview](01_foundations_overview.md) · [Previous course](07_course_06_machine_language.md) · [Next course](09_course_08_complete_system.md)

**Note:** All course project acceptance criteria, debugging tasks, transfer assessments and primary source links are preserved below. FS-8 machine rules are defined normatively in the appendix to Course 5, not separately in each course.

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
| F091 | Inspecting Real Compiler Output | Examine genuine assembly produced by a named C compiler for a named architecture at `-O0` and `-O2`; explain how the same defined C result can have different register and memory activity. Record compiler, target, flags, and observations rather than memorizing one assembly listing. |

## Projects

**P7-A · Guided lab (non-gating) — Variable and Array Memory Visualizer.** Given a tiny source-level program, animate values, variable names and array elements through steps, then allow learners to inspect the corresponding abstract memory locations. **Accept:** predictions about assignment and indexed updates agree with the modeled runtime behavior.

**P7-B · Required core milestone — The Tiny-Language Translator (v7).** Define a **deliberately small C-like educational language** with **eight-bit unsigned integers**, literals, assignment, addition/subtraction, zero-tests, `if`, `while`, and optional simple functions; forbid unsupported operators or out-of-range constants with visible diagnostics. Implement a tiny parser/translator that emits FS-8 assembly for a documented subset, assembles it through Course 6's tool, and executes it on the CPU. **Accept:** a small suite of high-level programs matches reference outputs and traces; Course 7 graduation additionally requires P7-C using genuine C compiler evidence. **Important:** the toy translator is not a conforming C compiler and never compiles real C for FS-8.

**P7-C · Required real-world transfer checkpoint — Inspect Actual Compiled C.** Inspect compiler-generated assembly for the same small standard C function with optimization disabled and enabled, using **Compiler Explorer** or the included **verified, precompiled evidence package** (compiler/version, target ISA, flags, C source, assembly, observed output). Annotate the observed registers and control flow, identify which observations are ABI/target/compiler dependent, and describe at least two differences from the educational FS-8. **Accept:** correct causal account, real evidence, no fabricated fixed assembly output, and explicit identification of at least one assumption the compiler may optimize away. **This checkpoint is compulsory even if the learner uses the offline evidence alternative.**

**P7-X · Optional extension — Compiler Variation Study.** Compare two real targets or two compilers on the same defined C program, and report what changes and what remains a C-language guarantee. Alternatively, build an AST visualizer for the toy translator. This is optional depth, not required for the C path.

### Independent debugging and unseen transfer

**Independent debugging challenge (D7):** The toy translator writes two variables to the same data address. Diagnose the allocation bug from source, assembly, and execution trace. **Unseen transfer (required real C):** explain how a real compiler implements a new C expression in a provided `-O2` assembly listing, identifying when a named local may have no stack slot. **Evidence:** P7-C plus corrected FS-8 trace.

**Feeds into:** Course 8 will place the execution story within the larger environment of firmware, operating systems, memory layers and device interactions.

**Primary curriculum anchors:** [CS:APP official site](https://csapp.cs.cmu.edu/), [CS50 course outline](https://cs50.harvard.edu/x/), [MIT compilers](https://computation-structures.github.io/course/lectures/L11_Compilers.html), [GNU C manual](https://www.gnu.org/software/c-intro-and-ref/manual/).

---


---

## Required real-C transfer lab

**Why required:** A learner may be able to program a toy 8-bit CPU yet still believe every source variable must occupy a physical memory cell, or that each C statement maps to one instruction. To graduate, learners must inspect **real generated assembly** and distinguish C semantics, compiler decisions, ABI details, and hardware behavior. The assignment does **not** require local installation or trust in a single compiler's exact text.

### 8.1 Minimal reproducible example

```c
#include <stdio.h>

int compute(int x) {
    int y = x + 4;
    return y * 2;
}

int main(void) {
    printf("%d\n", compute(3));
    return 0;
}
```

**Reproducible verified reference for curriculum authors (generated October 31, 2026):** The companion evidence package contains the exact source and unmodified assembly files built locally with **GCC 14.2.0**, target **`x86_64-linux-gnu`**, `-std=c17`, `-O0` versus `-O2`; the program executed successfully and produced `14`. Source SHA-256: `d4e48fd8e012711c566a861162548d799c24f82010bf38ce80603583b7ee45bf`. For example, the *actual* `compute` function output includes:

```asm
# GCC 14.2.0 x86-64, -O0 (selected lines)
movl %edi, -20(%rbp)
movl -20(%rbp), %eax
addl $4, %eax
movl %eax, -4(%rbp)
movl -4(%rbp), %eax
addl %eax, %eax

# The same function at -O2
leal 8(%rdi,%rdi), %eax
ret
```

These are **actual target- and compiler-specific assembly excerpts**, not universal C rules. The full assembly, source file, reproducibility notes and observed output are packaged as `foundations_real_c_evidence.zip` alongside the blueprint.

**Defined output for this input:** `14`. No signed overflow occurs for the values used. A particular compilation may inline `compute`, fold constants, allocate a local in a register, or omit observable memory writes. Do **not** teach a fixed stack-frame or fixed instruction count as a C guarantee.

**Browser route (recommended):** Open [Compiler Explorer](https://godbolt.org/), choose C and a named target/compiler (for instance, x86-64 GCC), compare `-O0` and `-O2`, and record the toolchain version, target, flags, result, and selected assembly. An execution panel may be used where supported, but compiler output plus the reference program is sufficient for this task. Online availability is not guaranteed.

**Optional local route:** On an appropriately configured system, learners can inspect assembly with:

```sh
gcc -std=c17 -Wall -Wextra -O0 -S demo.c -o demo_O0.s
gcc -std=c17 -Wall -Wextra -O2 -S demo.c -o demo_O2.s
gcc -std=c17 -Wall -Wextra -O0 demo.c -o demo
./demo
```

These commands are examples for GCC-compatible environments, **not** required platform dependencies. A live compiler is unnecessary if unavailable.

**Always-available offline route (mandatory content for the platform):** Ship two genuine, reproducible, instructor-verified compiler outputs for the exact program, each with `source SHA-256`, compiler name/version, target ISA/ABI, flags, output, selected assembly, and provenance. Do not invent assembly in lesson copy. Regenerate and recheck snapshots whenever updating the compiler version. Include a text-only annotated alternative for accessible use.

### 8.2 Grading rubric for P7-C

- **Correct result:** Explain why `compute(3)` returns `14`, without reasoning from the appearance of one assembly listing.
- **Actual evidence:** Identify compiler/version, target, optimization flags, and at least two real instruction or data-flow observations in the supplied output.
- **Implementation dependence:** Explain why `y` need not have a stack slot and why changing `-O0` to `-O2` may change the code without changing defined behavior.
- **Boundary awareness:** Distinguish a real compiler/ABI/ISA from FS-8's toy translator, and distinguish C source, assembly, object code, linking and loading.
- **Novel transfer:** Inspect a **different** short real C function provided only at assessment time and explain one instruction-level transformation correctly. Use a novel verified compiler snapshot if online compilers are unavailable.

**Failure policy:** If a learner gives a plausible but unsupported claim about a register or stack slot, return them to the actual assembly and ask for evidence. Do not force platform-specific trivia: different valid compilers are acceptable when observations are grounded.

---
