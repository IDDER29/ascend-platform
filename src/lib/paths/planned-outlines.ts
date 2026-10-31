/**
 * Outlines for courses that have no lessons yet: their sections and every lesson and project planned
 * in them. The path pages show these as "Coming soon". When a course gets its first real lesson it
 * becomes a topic (a level id in `src/lib/content/schema.ts`) and its outline moves to `course-outlines.ts`.
 * Where each concept lives, and why: `docs/curriculum/registry.md`.
 */

export type PlannedItem = { id: string; title: string; project?: boolean };
export type PlannedSection = { id: string; title: string; blurb?: string; items: PlannedItem[] };

const lesson = (id: string, title: string): PlannedItem => ({ id, title });
const project = (id: string, title: string): PlannedItem => ({ id, title, project: true });

// Systems Programmer

export const C_BASICS: PlannedSection[] = [
  {
    id: "first-programs",
    title: "Your first C programs",
    blurb: "Write, compile and run C, and read what the compiler tells you.",
    items: [
      lesson("hello-world", "Hello, world: compile and run"),
      lesson("variables-and-types", "Variables and types"),
      lesson("operators-and-expressions", "Operators and expressions"),
      lesson("reading-compiler-errors", "Reading compiler errors"),
    ],
  },
  {
    id: "control-and-functions",
    title: "Control flow and functions",
    blurb: "Decisions, loops and functions: how a C program is shaped.",
    items: [
      lesson("if-else-switch", "if, else and switch"),
      lesson("loops", "Loops: while, for and do"),
      lesson("functions", "Functions, parameters and return values"),
      lesson("scope", "Scope: where a name lives"),
    ],
  },
  {
    id: "io-and-arrays",
    title: "Input, output and arrays",
    blurb: "Talk to the user, and keep many values in a row.",
    items: [
      lesson("printf-and-scanf", "printf and scanf"),
      lesson("arrays-and-loops", "Arrays and loops together"),
      lesson("characters-and-strings", "Characters and simple strings"),
      project("project-guessing-game", "Project: A number-guessing game"),
    ],
  },
];

export const C_CONTRACT: PlannedSection[] = [
  {
    id: "the-rules",
    title: "What the standard promises",
    blurb: "The contract between your code and the compiler.",
    items: [
      lesson("kinds-of-behaviour", "Defined, unspecified and implementation-defined behaviour"),
      lesson("undefined-behaviour-in-depth", "Undefined behaviour, in depth"),
      lesson("sequencing", "Sequencing and order of evaluation"),
    ],
  },
  {
    id: "the-traps",
    title: "Where programs break",
    blurb: "The rules real programs break, and what the optimiser does when they do.",
    items: [
      lesson("signed-overflow-and-shifts", "Signed overflow and shifts"),
      lesson("strict-aliasing", "Aliasing and strict aliasing"),
      lesson("lifetime", "Lifetime: dangling pointers and uninitialised reads"),
      lesson("what-the-optimiser-assumes", "What the optimiser assumes about your code"),
      project("project-ub-hunt", "Project: Hunt the undefined behaviour"),
    ],
  },
];

export const C_TOOLS: PlannedSection[] = [
  {
    id: "build",
    title: "Build",
    blurb: "From source files to a program, and only rebuilding what changed.",
    items: [
      lesson("gcc-flags-and-warnings", "What gcc really does: flags and warnings"),
      lesson("make", "make: building only what changed"),
      lesson("libraries", "Static and dynamic libraries"),
    ],
  },
  {
    id: "inspect",
    title: "Look inside",
    blurb: "See what a program is and what it does while it runs.",
    items: [
      lesson("gdb", "gdb: breakpoints, stepping and backtraces"),
      lesson("objdump-readelf-nm", "objdump, readelf and nm"),
      lesson("strace", "strace: watching system calls"),
    ],
  },
  {
    id: "catch",
    title: "Catch bugs early",
    blurb: "Let tools find the bugs before your users do.",
    items: [
      lesson("sanitizers", "Sanitizers: ASan and UBSan"),
      lesson("valgrind", "valgrind and memory checking"),
      lesson("git", "git for a C project"),
      lesson("tests-in-c", "Writing small tests in C"),
      project("project-debug-a-program", "Project: Debug a broken program"),
    ],
  },
];

export const DATA_STRUCTURES: PlannedSection[] = [
  {
    id: "linear",
    title: "Lists and arrays",
    blurb: "Values in a row, and the trade-offs between keeping them packed or linked.",
    items: [
      lesson("dynamic-arrays", "Dynamic arrays that grow"),
      lesson("linked-lists", "Linked lists"),
      lesson("stacks-and-queues", "Stacks and queues"),
    ],
  },
  {
    id: "lookup",
    title: "Fast lookup",
    blurb: "Find a value without looking at every one.",
    items: [
      lesson("hash-tables", "Hash tables"),
      lesson("binary-search-trees", "Binary search trees"),
      lesson("heaps", "Heaps and priority queues"),
    ],
  },
  {
    id: "cost",
    title: "Cost and layout",
    blurb: "How much work a structure does, and how it sits in memory.",
    items: [
      lesson("big-o", "Big-O: counting the work"),
      lesson("cache-friendly-layout", "Cache-friendly data layout"),
      project("project-hash-map", "Project: A hash map library"),
    ],
  },
];

export const VM_THREADS_FILES: PlannedSection[] = [
  {
    id: "virtual-memory",
    title: "Virtual memory",
    blurb: "How every process gets its own address space.",
    items: [
      lesson("page-tables", "Virtual addresses and page tables"),
      lesson("the-tlb", "The TLB"),
      lesson("page-faults", "Page faults and demand paging"),
      lesson("mmap", "mmap: mapping files into memory"),
    ],
  },
  {
    id: "threads",
    title: "Threads and concurrency",
    blurb: "Several things at once, and the bugs that come with sharing.",
    items: [
      lesson("threads-vs-processes", "Threads vs processes"),
      lesson("race-conditions", "Race conditions"),
      lesson("mutexes", "Mutexes and locks"),
      lesson("condition-variables", "Condition variables"),
      lesson("deadlock", "Deadlock"),
      lesson("atomics", "Atomics and memory ordering: a first look"),
    ],
  },
  {
    id: "file-systems",
    title: "File systems",
    blurb: "How bytes on a disk become files and folders that survive a crash.",
    items: [
      lesson("inodes", "Files, directories and inodes"),
      lesson("finding-data", "How a file system finds your data"),
      lesson("journaling", "Journaling and crash safety"),
      project("project-thread-pool", "Project: A thread pool"),
    ],
  },
];

export const MEMORY_ALLOCATOR: PlannedSection[] = [
  {
    id: "allocator",
    title: "Capstone",
    blurb: "Everything about memory, in one program you write yourself.",
    items: [project("project-malloc", "Project: Build your own malloc")],
  },
];

// Computer Architect

export const PERFORMANCE: PlannedSection[] = [
  {
    id: "measuring",
    title: "Measuring performance",
    items: [
      lesson("cpi-and-clock-rate", "Measuring performance: time, CPI and clock rate"),
      lesson("amdahls-law", "Amdahl's law"),
      lesson("benchmarks", "Benchmarks and what they hide"),
      lesson("power-and-energy", "Power and energy"),
    ],
  },
];

export const PIPELINING: PlannedSection[] = [
  {
    id: "pipeline",
    title: "The pipeline",
    items: [
      lesson("five-stage-pipeline", "A five-stage pipeline"),
      lesson("data-hazards", "Data hazards and forwarding"),
      lesson("control-hazards", "Control hazards and stalls"),
      lesson("branch-prediction", "Branch prediction"),
      project("project-pipeline-sim", "Project: Simulate a pipeline"),
    ],
  },
];

export const ADVANCED_EXECUTION: PlannedSection[] = [
  {
    id: "beyond-the-pipeline",
    title: "Beyond one instruction at a time",
    items: [
      lesson("superscalar", "Superscalar: more than one at a time"),
      lesson("out-of-order", "Out-of-order execution"),
      lesson("register-renaming", "Register renaming"),
      lesson("speculation", "Speculation and the reorder buffer"),
    ],
  },
];

export const CACHES_MEMORY: PlannedSection[] = [
  {
    id: "caches",
    title: "Caches and memory",
    items: [
      lesson("cache-organisation", "Cache organisation: sets, ways and lines"),
      lesson("replacement-and-writes", "Replacement and write policies"),
      lesson("cache-hierarchy", "Cache hierarchies: L1, L2 and L3"),
      lesson("dram", "DRAM and the memory controller"),
      project("project-cache-sim", "Project: A cache simulator"),
    ],
  },
];

export const MULTICORE_GPUS: PlannedSection[] = [
  {
    id: "parallel-hardware",
    title: "Parallel hardware",
    items: [
      lesson("cache-coherence", "Cache coherence"),
      lesson("memory-consistency", "Memory consistency models"),
      lesson("simd", "SIMD and vector instructions"),
      lesson("gpus", "How a GPU runs thousands of threads"),
      lesson("accelerators", "Accelerators built for one job"),
    ],
  },
];

export const VERILOG: PlannedSection[] = [
  {
    id: "hdl",
    title: "Describing hardware",
    items: [
      lesson("verilog-basics", "Describing hardware in Verilog"),
      lesson("combinational-verilog", "Combinational logic in Verilog"),
      lesson("sequential-verilog", "Sequential logic and state machines"),
      lesson("fpga", "From Verilog to an FPGA"),
      project("project-verilog-alu", "Project: An ALU in Verilog"),
    ],
  },
];

export const VERIFICATION: PlannedSection[] = [
  {
    id: "checking",
    title: "Proving a design works",
    items: [
      lesson("testbenches", "Testbenches"),
      lesson("coverage", "Coverage: how much have you tested?"),
      lesson("assertions-and-formal", "Assertions and formal checking"),
    ],
  },
];

export const RTL_TO_SILICON: PlannedSection[] = [
  {
    id: "physical",
    title: "Making the chip",
    items: [
      lesson("synthesis", "Synthesis: from code to gates"),
      lesson("timing", "Timing: setup, hold and the critical path"),
      lesson("place-and-route", "Place, route and the finished chip"),
    ],
  },
];

export const COMPILERS_THEORY: PlannedSection[] = [
  {
    id: "compilers",
    title: "Compilers and computation",
    items: [
      lesson("compiler-structure", "How a compiler is built"),
      lesson("ssa", "Intermediate code and SSA"),
      lesson("register-allocation", "Register allocation"),
      lesson("computability", "What can be computed"),
    ],
  },
];

export const RISCV_CORE: PlannedSection[] = [
  {
    id: "core",
    title: "Capstone",
    blurb: "Design a real processor, then prove it runs real programs.",
    items: [
      lesson("riscv-isa", "The RISC-V instruction set"),
      project("project-riscv-core", "Capstone: Build and verify a small RISC-V core"),
    ],
  },
];

// Security Engineer

export const SECURITY_FOUNDATIONS: PlannedSection[] = [
  {
    id: "thinking-like-an-attacker",
    title: "Thinking like an attacker",
    items: [
      lesson("threat-models", "Threat models"),
      lesson("least-privilege", "Least privilege and isolation"),
      lesson("authentication-and-secrets", "Authentication and secrets"),
      lesson("cryptography", "Cryptography: what it does and doesn't do"),
    ],
  },
];

export const MEMORY_SAFETY: PlannedSection[] = [
  {
    id: "bugs-and-defences",
    title: "Bugs and defences",
    items: [
      lesson("buffer-overflows", "Buffer overflows"),
      lesson("use-after-free", "Use-after-free and double free"),
      lesson("format-strings", "Format string bugs"),
      lesson("mitigations", "Stack canaries, ASLR and NX"),
      lesson("control-flow-integrity", "Control-flow integrity"),
      project("project-exploit-and-fix", "Project: Break and fix a toy program"),
    ],
  },
];

export const HARDWARE_TRUST: PlannedSection[] = [
  {
    id: "side-channels",
    title: "When hardware leaks",
    items: [
      lesson("timing-side-channels", "Timing side channels"),
      lesson("spectre-meltdown", "Spectre and Meltdown"),
      lesson("trusted-execution", "Trusted execution and secure boot"),
    ],
  },
];

export const RELIABILITY: PlannedSection[] = [
  {
    id: "failing-well",
    title: "Failing well",
    items: [
      lesson("faults-errors-failures", "Faults, errors and failures"),
      lesson("redundancy", "Redundancy and recovery"),
      lesson("fuzzing", "Fuzzing"),
      lesson("fail-safely", "Writing code that fails safely"),
    ],
  },
];

// Network Engineer

export const NETWORK_FOUNDATIONS: PlannedSection[] = [
  {
    id: "how-networks-work",
    title: "How networks work",
    items: [
      lesson("what-is-a-network", "What a network is"),
      lesson("layers", "Layers: from wires to apps"),
      lesson("ethernet", "Ethernet and MAC addresses"),
      lesson("ip-addresses", "IP addresses and subnets"),
      lesson("routing", "Routing: how a packet finds its way"),
      project("project-trace-a-packet", "Project: Trace a packet"),
    ],
  },
];

export const NETWORK_PROTOCOLS: PlannedSection[] = [
  {
    id: "transport-and-apps",
    title: "Transport and applications",
    items: [
      lesson("udp", "UDP"),
      lesson("tcp", "TCP: reliable streams"),
      lesson("congestion-control", "TCP congestion control"),
      lesson("dns", "DNS"),
      lesson("http", "HTTP"),
      lesson("tls", "TLS: encryption in transit"),
      lesson("sockets", "Sockets in C"),
      project("project-http-server", "Project: A tiny HTTP server"),
    ],
  },
];

export const NETWORK_OPS: PlannedSection[] = [
  {
    id: "running-networks",
    title: "Running networks",
    items: [
      lesson("ping-traceroute-dig", "ping, traceroute and dig"),
      lesson("packet-capture", "Reading packets with Wireshark and tcpdump"),
      lesson("firewalls-and-nat", "Firewalls and NAT"),
      lesson("slow-connections", "Debugging a slow connection"),
      lesson("safe-change", "Changing a network safely"),
      project("project-diagnose-a-network", "Project: Diagnose a broken network"),
    ],
  },
];

/** Lesson and project counts for an outline. */
export function plannedCounts(outline: PlannedSection[]): { lessons: number; projects: number } {
  const items = outline.flatMap((s) => s.items);
  const projects = items.filter((i) => i.project).length;
  return { lessons: items.length - projects, projects };
}
