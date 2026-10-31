
import { LEVELS, type LevelId } from "@/lib/content/schema";
import * as O from "./planned-outlines";
import type { PlannedSection } from "./planned-outlines";

export type PathStatus = "live" | "soon";

export type PathKind = "foundation" | "role";

export type PathCourse = {
  id: string;
  title: string;
  body: string;
  /** Live curriculum level, if any */
  levelId?: LevelId;
  /**
   * Only these outline sections of the level (by section id), when one level is split into several
   * courses (Foundations). Without it the course is the whole level.
   */
  sections?: string[];
  /** Capstone / special href when not a level */
  href?: string;
  /** The sections and lessons planned for a course with no lessons yet (shown as "Coming soon"). */
  outline?: PlannedSection[];
  /** Counts for a planned course that has no outline yet. With an outline, they come from it. */
  plannedLessons?: number;
  plannedProjects?: number;
  /** A milestone reached once this course is done ("Understand C deeply"). */
  milestone?: string;
  /** A path (slug) to take this course alongside, rather than before it. */
  alongside?: string;
};

export type PathDef = {
  slug: string;
  kind: PathKind;
  status: PathStatus;
  eyebrow: string;
  title: string;
  /** One sentence: what the path is and what you leave with. */
  pitch?: string;
  body: string;
  /** Shown on catalog meta line */
  requiresLabel?: string;
  requiresSlug?: string;
  /** Only the required path's courses up to this one (an id) are needed first; without it, the whole path. */
  requiresThrough?: string;
  /** Its place on the main track (Foundations → Systems Programmer → Computer Architect), if it's on it. */
  stage?: 1 | 2 | 3;
  /** What you can do once the whole path is done. */
  milestone?: string;
  /** A side path: the track stage it branches off (a path slug). */
  branchOf?: string;
  courses: PathCourse[];
};

export const PATHS: PathDef[] = [
  {
    slug: "foundations",
    kind: "foundation",
    status: "live",
    eyebrow: "Foundations",
    title: "Foundations",
    stage: 1,
    milestone: "Ready for any path",
    pitch: "How a computer really works, from a single bit to a program running on an operating system.",
    body: "A hands-on introduction to the ideas every real machine is built on, in eight short courses: what information is, how data becomes bits, how circuits compute and remember, how a CPU is built, how to program it in assembly, how code you write becomes instructions, and how the whole system fits together. No background needed, and every other path starts from here.",
    courses: [
      {
        id: "foundations-computers",
        title: "Computers & Information",
        body: "What a computer is, how signals become information, and how a machine follows instructions one step at a time.",
        levelId: "level-00-bits-logic",
        sections: ["computers", "information", "instructions"],
      },
      {
        id: "foundations-bits-data",
        title: "Binary & Data",
        body: "How numbers, negative numbers, text, pictures and fractions become bits, and what happens when they don't fit.",
        levelId: "level-00-bits-logic",
        sections: ["bits", "data"],
      },
      {
        id: "foundations-logic-circuits",
        title: "Logic & Circuits",
        body: "Boolean logic in real gates, circuits that add, choose and compare, and an 8-bit ALU.",
        levelId: "level-00-bits-logic",
        sections: ["logic", "circuits"],
      },
      {
        id: "foundations-memory-state",
        title: "State & Memory",
        body: "How a circuit remembers: flip-flops, the clock, registers, counters, state machines and addressed memory.",
        levelId: "level-00-bits-logic",
        sections: ["memory", "storage"],
      },
      {
        id: "foundations-build-a-cpu",
        title: "Build a CPU",
        body: "An instruction set, the fetch-execute loop, jumps and loops, and a tiny CPU built from the parts before it.",
        levelId: "level-00-bits-logic",
        sections: ["isa", "machine-runs"],
      },
      {
        id: "foundations-assembly",
        title: "Assembly Language",
        body: "Program the tiny CPU in assembly, write the assembler that turns it into bytes, and use the stack for subroutines.",
        levelId: "level-00-bits-logic",
        sections: ["assembly", "assembler", "subroutines"],
        milestone: "Ready to start C",
      },
      {
        id: "foundations-source-to-machine",
        title: "From Source to Machine",
        body: "How variables, arrays, pointers and functions live in memory, and how a compiler, assembler, linker and loader turn code into a running program.",
        levelId: "level-00-bits-logic",
        sections: ["source", "data-layout", "toolchain"],
        alongside: "systems-programmer",
      },
      {
        id: "foundations-complete-system",
        title: "The Complete System",
        body: "Memory and storage, devices, startup, the operating system, networks and protection, ending with one program traced all the way through.",
        levelId: "level-00-bits-logic",
        sections: ["system", "os", "beyond", "conclusion"],
        alongside: "systems-programmer",
      },
    ],
  },
  {
    slug: "python-foundations",
    kind: "foundation",
    status: "soon",
    eyebrow: "Foundations",
    title: "Python Foundations",
    branchOf: "foundations",
    pitch: "The Python you need for applied AI: the language, the tools and good project habits.",
    body: "This course is the Python on-ramp for applied AI. You'll learn language basics, tooling, and project habits in the order shown: everything you need before RAG, agents, and LLM apps, without wandering the whole Python universe first.",
    courses: [
      {
        id: "python-language",
        title: "Python language basics",
        body: "Syntax, data, functions, and the habits you'll use every day in AI work.",
        plannedLessons: 12,
        plannedProjects: 2,
      },
      {
        id: "python-tooling",
        title: "Tooling & environments",
        body: "venv, packages, notebooks, and a clean project layout.",
        plannedLessons: 6,
        plannedProjects: 1,
      },
    ],
  },
  {
    slug: "systems-programmer",
    kind: "role",
    status: "live",
    eyebrow: "Path",
    title: "Systems Programmer",
    stage: 2,
    milestone: "Understand the OS",
    pitch: "How the machine runs, how C talks to it and how the OS keeps it alive, ending with a shell you write yourself.",
    body: "This path takes you through Ascend's systems curriculum. Start once you've finished Foundations up to Assembly Language; its last two courses go well alongside this path. Take the courses in the order shown: how the machine runs, C from the basics to its exact rules, the tools and data structures C programmers live with, then how the OS keeps it all alive. Prove it with ShellForge and your own malloc. Some courses are still being written; their lessons are listed so you can see where the path goes.",
    requiresLabel: "Best after Foundations, through Assembly Language",
    requiresSlug: "foundations",
    requiresThrough: "foundations-assembly",
    courses: [
      {
        id: "machine-memory",
        title: LEVELS["level-01-machine-memory"].name,
        body: "How the machine actually runs: CPU, memory, and the address space.",
        levelId: "level-01-machine-memory",
      },
      {
        id: "c-basics",
        title: LEVELS["level-04-c-basics"].name,
        body: "Types, operators, control flow, functions and the compile-run loop: the C you need before the deep parts.",
        levelId: "level-04-c-basics",
      },
      {
        id: "the-c-language",
        title: LEVELS["level-02-the-c-language"].name,
        body: "How code touches that hardware, with C as craft: memory, pointers, structs and the heap.",
        levelId: "level-02-the-c-language",
      },
      {
        id: "c-contract",
        title: LEVELS["level-05-c-contract"].name,
        body: "Exactly what C promises and what it doesn't: undefined behaviour, evaluation order, aliasing and lifetime.",
        levelId: "level-05-c-contract",
      },
      {
        id: "c-tools",
        title: "Tools",
        body: "Build, inspect and debug like a systems programmer: gcc, make, gdb, objdump, strace and sanitizers.",
        outline: O.C_TOOLS,
      },
      {
        id: "data-structures",
        title: "Data Structures in C",
        body: "Arrays, lists, hash tables and trees, built by hand, with what each costs and how it sits in memory.",
        outline: O.DATA_STRUCTURES,
        milestone: "Understand C deeply",
      },
      {
        id: "systems-software",
        title: LEVELS["level-03-systems-software"].name,
        body: "Processes, syscalls, and the OS boundary.",
        levelId: "level-03-systems-software",
      },
      {
        id: "vm-threads-files",
        title: "Virtual Memory, Threads & Files",
        body: "How the OS gives each process its own memory, runs many things at once, and keeps files safe.",
        outline: O.VM_THREADS_FILES,
      },
      {
        id: "shellforge",
        title: "ShellForge",
        body: "Capstone: prove the path with a working shell.",
        href: "/projects/shellforge",
        plannedProjects: 1,
      },
      {
        id: "memory-allocator",
        title: "Your own malloc",
        body: "Capstone: write the allocator every C program relies on, from free lists to mmap.",
        outline: O.MEMORY_ALLOCATOR,
      },
    ],
  },
  {
    slug: "linux-engineer",
    kind: "role",
    status: "soon",
    eyebrow: "Path",
    title: "Linux Engineer",
    branchOf: "foundations",
    pitch: "From living on a Linux distro to running virtual machines and containers like practitioners do.",
    body: "This path takes you from living on a distro to shipping real systems. Work through the courses in order: Linux fundamentals, virtual machines, containers & Docker, then bone-to-bone projects. You'll learn to run, isolate, and operate Linux systems the way practitioners actually do.",
    requiresLabel: "Requires Foundations",
    requiresSlug: "foundations",
    courses: [
      {
        id: "linux-distro",
        title: "Linux fundamentals",
        body: "Ubuntu, Debian, shell, packages, and living on the terminal.",
        plannedLessons: 14,
        plannedProjects: 2,
      },
      {
        id: "virtual-machines",
        title: "Virtual machines",
        body: "Hypervisors, guests, and when a VM is the right isolation story.",
        plannedLessons: 8,
        plannedProjects: 1,
      },
      {
        id: "containers-docker",
        title: "Containers & Docker",
        body: "Images, containers, and shipping the same runtime everywhere.",
        plannedLessons: 10,
        plannedProjects: 2,
      },
      {
        id: "bone-to-bone",
        title: "Bone to bone",
        body: "Build and operate a system from the ground up, with projects that stick.",
        plannedLessons: 6,
        plannedProjects: 3,
      },
    ],
  },
  {
    slug: "network-engineer",
    kind: "role",
    status: "soon",
    eyebrow: "Path",
    title: "Network Engineer",
    pitch: "How machines talk: what a packet is, the protocols that carry it and how to change a network safely.",
    body: "This path takes you through how machines talk. Follow the courses in order: network foundations, core protocols, then operating networks. You'll learn what packets are, how stacks and tools reveal them, and how to change networks without flying blind.",
    requiresLabel: "Requires Foundations",
    requiresSlug: "foundations",
    branchOf: "foundations",
    courses: [
      {
        id: "network-foundations",
        title: "Network foundations",
        body: "Layers, addressing, and what a packet actually is.",
        outline: O.NETWORK_FOUNDATIONS,
      },
      {
        id: "protocols",
        title: "Core protocols",
        body: "TCP/IP, DNS, HTTP and TLS, and the sockets your programs use to speak them.",
        outline: O.NETWORK_PROTOCOLS,
      },
      {
        id: "network-ops",
        title: "Operating networks",
        body: "The tools that show what's happening, and how to change a network safely.",
        outline: O.NETWORK_OPS,
      },
    ],
  },
  {
    slug: "security-engineer",
    kind: "role",
    status: "soon",
    eyebrow: "Path",
    title: "Security Engineer",
    branchOf: "systems-programmer",
    pitch: "How systems get broken and how to build them so they don't: memory safety, side channels and reliable code.",
    body: "This path builds on Systems Programmer. Take the courses in order: how attackers think, the memory-safety bugs behind most exploits and the defences against them, how hardware itself can leak, and how to build systems that fail safely.",
    requiresLabel: "Requires Systems Programmer",
    requiresSlug: "systems-programmer",
    courses: [
      {
        id: "security-foundations",
        title: "Security foundations",
        body: "Threat models, least privilege, secrets, and what cryptography can and can't do.",
        outline: O.SECURITY_FOUNDATIONS,
      },
      {
        id: "memory-safety",
        title: "Memory-safety bugs & defences",
        body: "Overflows, use-after-free and format strings, and the defences built into compilers and OSes.",
        outline: O.MEMORY_SAFETY,
      },
      {
        id: "hardware-trust",
        title: "Side channels & hardware trust",
        body: "When timing and speculation leak secrets, and how hardware tries to keep them.",
        outline: O.HARDWARE_TRUST,
      },
      {
        id: "reliability",
        title: "Reliability",
        body: "Faults, redundancy, fuzzing and code that fails safely.",
        outline: O.RELIABILITY,
      },
    ],
  },
  {
    slug: "computer-architect",
    kind: "role",
    status: "soon",
    eyebrow: "Path",
    title: "Computer Architect",
    stage: 3,
    milestone: "Ready to design processors",
    pitch: "Go from understanding a CPU to designing one: pipelines, caches, parallel hardware, Verilog, and a RISC-V core of your own.",
    body: "This path builds on Systems Programmer. Take the courses in order: measure performance, then see how real CPUs go fast (pipelines, out-of-order execution, caches, many cores and GPUs). Then describe hardware in Verilog, prove it works, and follow it to silicon. It ends with a small RISC-V processor you design and verify yourself.",
    requiresLabel: "Requires Systems Programmer",
    requiresSlug: "systems-programmer",
    courses: [
      {
        id: "performance",
        title: "Performance & trade-offs",
        body: "What makes a computer fast, how to measure it, and what it costs in power.",
        outline: O.PERFORMANCE,
      },
      {
        id: "pipelining",
        title: "Pipelining",
        body: "Overlapping instructions like an assembly line, and the hazards that come with it.",
        outline: O.PIPELINING,
      },
      {
        id: "advanced-execution",
        title: "Advanced execution",
        body: "Superscalar, out-of-order and speculative CPUs: how real cores run many instructions at once.",
        outline: O.ADVANCED_EXECUTION,
      },
      {
        id: "caches-memory",
        title: "Caches & memory systems",
        body: "How caches are built, and why memory, not the CPU, is usually the limit.",
        outline: O.CACHES_MEMORY,
      },
      {
        id: "multicore-gpus",
        title: "Multicore & GPUs",
        body: "Many cores sharing memory, vector units, GPUs and accelerators.",
        outline: O.MULTICORE_GPUS,
      },
      {
        id: "verilog",
        title: "Digital design with Verilog",
        body: "Describe circuits in code, simulate them, and run them on an FPGA.",
        outline: O.VERILOG,
      },
      {
        id: "verification",
        title: "Verification",
        body: "Testbenches, coverage and formal checks: how chip designers know a design works.",
        outline: O.VERIFICATION,
      },
      {
        id: "rtl-to-silicon",
        title: "From RTL to silicon",
        body: "Synthesis, timing and layout: how a design becomes a chip.",
        outline: O.RTL_TO_SILICON,
      },
      {
        id: "compilers-theory",
        title: "Compilers & theory",
        body: "How compilers turn code into instructions, and the limits of what any computer can compute.",
        outline: O.COMPILERS_THEORY,
      },
      {
        id: "riscv-core",
        title: "A RISC-V core",
        body: "Capstone: design a small RISC-V processor and prove it runs real programs.",
        outline: O.RISCV_CORE,
      },
    ],
  },
  {
    slug: "ai-engineer",
    kind: "role",
    status: "soon",
    eyebrow: "Path",
    title: "AI Engineer",
    branchOf: "foundations",
    pitch: "Build grounded AI apps that use tools: from a first API call to RAG, agents and outputs you can trust.",
    body: "This path takes you through applied LLM systems. Take the courses in order: LLM applications, RAG, agents, then contracts & decoding. You'll learn to build grounded, tool-using AI apps, from first API call to structured outputs you can trust.",
    requiresLabel: "Requires Python Foundations",
    requiresSlug: "python-foundations",
    courses: [
      {
        id: "llm-apps",
        title: "LLM applications",
        body: "APIs, prompts, and production-minded model use.",
        plannedLessons: 10,
        plannedProjects: 2,
      },
      {
        id: "rag",
        title: "RAG systems",
        body: "Retrieval, chunking, and grounding answers in your data.",
        plannedLessons: 8,
        plannedProjects: 2,
      },
      {
        id: "agents",
        title: "AI agents",
        body: "Tools, loops, and agents that do real work.",
        plannedLessons: 8,
        plannedProjects: 2,
      },
      {
        id: "contracts",
        title: "Contracts & decoding",
        body: "Structured outputs, schemas, and reliable decoding.",
        plannedLessons: 6,
        plannedProjects: 1,
      },
    ],
  },
];

export function getPathBySlug(slug: string): PathDef | undefined {
  return PATHS.find((p) => p.slug === slug);
}

export function pathHref(slug: string): string {
  return `/paths/${slug}`;
}
