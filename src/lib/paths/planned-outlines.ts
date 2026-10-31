/**
 * Outlines for courses that have no lessons yet: their sections and every lesson and project planned
 * in them. The path pages show these as "Coming soon". When a course gets its first real lesson it
 * becomes a topic (a level id in `src/lib/content/schema.ts`) and its outline moves to `course-outlines.ts`.
 * Where each concept lives, and why: `docs/curriculum/registry.md`.
 */

/** A planned lesson or project; the description is one sentence shown under its title on the path page. */
export type PlannedItem = { id: string; title: string; description: string; project?: boolean };
export type PlannedSection = { id: string; title: string; blurb?: string; items: PlannedItem[] };

const lesson = (id: string, title: string, description: string): PlannedItem => ({ id, title, description });
const project = (id: string, title: string, description: string): PlannedItem => ({
  id,
  title,
  description,
  project: true,
});

// Systems Programmer

export const C_BASICS: PlannedSection[] = [
  {
    id: "first-programs",
    title: "Your first C programs",
    blurb: "Write, compile and run C, and read what the compiler tells you.",
    items: [
      lesson(
        "hello-world",
        "Hello, world: compile and run",
        "How to write a first C program, compile it with gcc and run it, and what each line of hello world does.",
      ),
      lesson(
        "variables-and-types",
        "Variables and types",
        "How to declare variables of types like int, char and double, and why each type has a size and a range.",
      ),
      lesson(
        "operators-and-expressions",
        "Operators and expressions",
        "How C's arithmetic, comparison and logical operators work, including integer division and precedence.",
      ),
      lesson(
        "reading-compiler-errors",
        "Reading compiler errors",
        "How to read gcc's errors and warnings, find the line they point to, and fix the most common mistakes.",
      ),
    ],
  },
  {
    id: "control-and-functions",
    title: "Control flow and functions",
    blurb: "Decisions, loops and functions: how a C program is shaped.",
    items: [
      lesson(
        "if-else-switch",
        "if, else and switch",
        "How a C program makes decisions with if, else and switch, and how C decides what counts as true.",
      ),
      lesson(
        "loops",
        "Loops: while, for and do",
        "How while, for and do loops repeat work, and how to avoid loops that run one time too many or never stop.",
      ),
      lesson(
        "functions",
        "Functions, parameters and return values",
        "How to split a program into functions that take parameters and return values, and why C passes arguments by value.",
      ),
      lesson(
        "scope",
        "Scope: where a name lives",
        "Where each name in a C program can be seen, from one block to a whole file, and what happens when names shadow each other.",
      ),
    ],
  },
  {
    id: "io-and-arrays",
    title: "Input, output and arrays",
    blurb: "Talk to the user, and keep many values in a row.",
    items: [
      lesson(
        "printf-and-scanf",
        "printf and scanf",
        "How to print formatted output with printf, read input with scanf, and check that the input was actually read.",
      ),
      lesson(
        "arrays-and-loops",
        "Arrays and loops together",
        "How to store many values in an array and process them with a loop, without stepping past its last element.",
      ),
      lesson(
        "characters-and-strings",
        "Characters and simple strings",
        "How C stores characters as small numbers and text as arrays of chars ending in a zero byte.",
      ),
      project(
        "project-guessing-game",
        "Project: A number-guessing game",
        "Build a number-guessing game that reads input, loops and gives hints, proving you can write a whole C program.",
      ),
    ],
  },
];

export const C_CONTRACT: PlannedSection[] = [
  {
    id: "the-rules",
    title: "What the standard promises",
    blurb: "The contract between your code and the compiler.",
    items: [
      lesson(
        "kinds-of-behaviour",
        "Defined, unspecified and implementation-defined behaviour",
        "How the C standard sorts behaviour into defined, unspecified, implementation-defined and undefined, and why it matters.",
      ),
      lesson(
        "undefined-behaviour-in-depth",
        "Undefined behaviour, in depth",
        "Why the standard leaves some operations undefined, and how compilers use that freedom to transform your code.",
      ),
      lesson(
        "sequencing",
        "Sequencing and order of evaluation",
        "Which parts of an expression C evaluates in a fixed order and which it does not, and why i = i++ is undefined.",
      ),
    ],
  },
  {
    id: "the-traps",
    title: "Where programs break",
    blurb: "The rules real programs break, and what the optimiser does when they do.",
    items: [
      lesson(
        "signed-overflow-and-shifts",
        "Signed overflow and shifts",
        "Why overflowing a signed int or shifting by too many bits is undefined, and how to write arithmetic that stays safe.",
      ),
      lesson(
        "strict-aliasing",
        "Aliasing and strict aliasing",
        "Why reading an object through a pointer to an incompatible type is undefined, and how memcpy or char access stays legal.",
      ),
      lesson(
        "lifetime",
        "Lifetime: dangling pointers and uninitialised reads",
        "When an object's lifetime ends, and why reading through a dangling pointer or an uninitialised variable is a real bug.",
      ),
      lesson(
        "what-the-optimiser-assumes",
        "What the optimiser assumes about your code",
        "How the optimiser assumes your code has no undefined behaviour, and how that can delete checks you thought were there.",
      ),
      project(
        "project-ub-hunt",
        "Project: Hunt the undefined behaviour",
        "Find and fix the undefined behaviour hidden in a small program, proving you can spot what the compiler may break.",
      ),
    ],
  },
];

export const C_TOOLS: PlannedSection[] = [
  {
    id: "build",
    title: "Build",
    blurb: "From source files to a program, and only rebuilding what changed.",
    items: [
      lesson(
        "gcc-flags-and-warnings",
        "What gcc really does: flags and warnings",
        "What gcc does from preprocessing to linking, and which flags and warnings catch bugs before the program runs.",
      ),
      lesson(
        "make",
        "make: building only what changed",
        "How a Makefile describes what depends on what, so make rebuilds only the files that changed.",
      ),
      lesson(
        "libraries",
        "Static and dynamic libraries",
        "How static libraries are copied into a program and shared ones are loaded at run time, and how to build both.",
      ),
    ],
  },
  {
    id: "inspect",
    title: "Look inside",
    blurb: "See what a program is and what it does while it runs.",
    items: [
      lesson(
        "gdb",
        "gdb: breakpoints, stepping and backtraces",
        "How to stop a program at a breakpoint, step through it line by line and read a backtrace when it crashes.",
      ),
      lesson(
        "objdump-readelf-nm",
        "objdump, readelf and nm",
        "How to look inside an executable: its sections, its symbols and the machine code the compiler produced.",
      ),
      lesson(
        "strace",
        "strace: watching system calls",
        "How to watch every system call a program makes, and use that to see why it fails or hangs.",
      ),
    ],
  },
  {
    id: "catch",
    title: "Catch bugs early",
    blurb: "Let tools find the bugs before your users do.",
    items: [
      lesson(
        "sanitizers",
        "Sanitizers: ASan and UBSan",
        "How AddressSanitizer and UndefinedBehaviorSanitizer catch memory errors and undefined behaviour as your program runs.",
      ),
      lesson(
        "valgrind",
        "valgrind and memory checking",
        "How valgrind finds memory leaks, invalid reads and uninitialised values in a program without recompiling it.",
      ),
      lesson(
        "git",
        "git for a C project",
        "How to track a C project with git: commits, branches, ignoring build output and finding the change that broke it.",
      ),
      lesson(
        "tests-in-c",
        "Writing small tests in C",
        "How to write small, fast tests for C functions with assert and a simple runner, and run them on every build.",
      ),
      project(
        "project-debug-a-program",
        "Project: Debug a broken program",
        "Use gdb, sanitizers and valgrind to find and fix the bugs in a broken program, proving you can debug with tools.",
      ),
    ],
  },
];

export const DATA_STRUCTURES: PlannedSection[] = [
  {
    id: "linear",
    title: "Lists and arrays",
    blurb: "Values in a row, and the trade-offs between keeping them packed or linked.",
    items: [
      lesson(
        "dynamic-arrays",
        "Dynamic arrays that grow",
        "How an array grows by reallocating with extra room, and why doubling its capacity keeps appends fast on average.",
      ),
      lesson(
        "linked-lists",
        "Linked lists",
        "How nodes linked by pointers form a list, and when cheap inserts and removals are worth the slow lookups.",
      ),
      lesson(
        "stacks-and-queues",
        "Stacks and queues",
        "How stacks give last-in first-out and queues first-in first-out order, built on arrays or linked lists.",
      ),
    ],
  },
  {
    id: "lookup",
    title: "Fast lookup",
    blurb: "Find a value without looking at every one.",
    items: [
      lesson(
        "hash-tables",
        "Hash tables",
        "How a hash function turns a key into a slot, how collisions are handled, and why lookups are fast on average.",
      ),
      lesson(
        "binary-search-trees",
        "Binary search trees",
        "How a binary search tree keeps keys in order for fast search, and why it slows down when it becomes unbalanced.",
      ),
      lesson(
        "heaps",
        "Heaps and priority queues",
        "How a heap stored in an array always gives you the smallest or largest item quickly, as a priority queue.",
      ),
    ],
  },
  {
    id: "cost",
    title: "Cost and layout",
    blurb: "How much work a structure does, and how it sits in memory.",
    items: [
      lesson(
        "big-o",
        "Big-O: counting the work",
        "How to describe how a program's work grows with its input using Big-O, and compare data structures by it.",
      ),
      lesson(
        "cache-friendly-layout",
        "Cache-friendly data layout",
        "Why data packed together in memory is faster than data scattered behind pointers, and how to lay it out well.",
      ),
      project(
        "project-hash-map",
        "Project: A hash map library",
        "Build a reusable hash map library in C that grows as it fills, proving you can design, test and measure a data structure.",
      ),
    ],
  },
];

export const VM_THREADS_FILES: PlannedSection[] = [
  {
    id: "virtual-memory",
    title: "Virtual memory",
    blurb: "How every process gets its own address space.",
    items: [
      lesson(
        "page-tables",
        "Virtual addresses and page tables",
        "How the CPU translates each virtual address into a physical one, using page tables kept by the kernel.",
      ),
      lesson(
        "the-tlb",
        "The TLB",
        "How the TLB caches recent address translations so most memory accesses skip the slow page-table walk.",
      ),
      lesson(
        "page-faults",
        "Page faults and demand paging",
        "What happens when a program touches a page that is not in memory, and how the kernel loads pages only when needed.",
      ),
      lesson(
        "mmap",
        "mmap: mapping files into memory",
        "How mmap maps a file or fresh memory into the address space, so reading that memory reads the file.",
      ),
    ],
  },
  {
    id: "threads",
    title: "Threads and concurrency",
    blurb: "Several things at once, and the bugs that come with sharing.",
    items: [
      lesson(
        "threads-vs-processes",
        "Threads vs processes",
        "How threads share one address space while processes each get their own, and what each choice costs.",
      ),
      lesson(
        "race-conditions",
        "Race conditions",
        "Why two threads updating shared data can lose work, and how to spot the read-modify-write that causes it.",
      ),
      lesson(
        "mutexes",
        "Mutexes and locks",
        "How a mutex lets only one thread into a critical section at a time, and how to use pthread locks correctly.",
      ),
      lesson(
        "condition-variables",
        "Condition variables",
        "How a thread can sleep until another signals that something changed, without wasting CPU in a busy loop.",
      ),
      lesson(
        "deadlock",
        "Deadlock",
        "How threads waiting on each other's locks can freeze forever, and how taking locks in a fixed order prevents it.",
      ),
      lesson(
        "atomics",
        "Atomics and memory ordering: a first look",
        "What atomic operations guarantee, and why CPUs and compilers can reorder memory accesses that threads share.",
      ),
      project(
        "project-thread-pool",
        "Project: A thread pool",
        "Build a thread pool that runs queued tasks on a fixed set of workers, proving you can share work safely with locks.",
      ),
    ],
  },
  {
    id: "file-systems",
    title: "File systems",
    blurb: "How bytes on a disk become files and folders that survive a crash.",
    items: [
      lesson(
        "inodes",
        "Files, directories and inodes",
        "How a file system stores a file's data and metadata in an inode, and how directories map names to inodes.",
      ),
      lesson(
        "finding-data",
        "How a file system finds your data",
        "How a file system turns a path and an offset into disk blocks, using directories, block pointers and extents.",
      ),
      lesson(
        "journaling",
        "Journaling and crash safety",
        "How a journal records changes before applying them, so a file system stays consistent after a crash.",
      ),
    ],
  },
];

export const MEMORY_ALLOCATOR: PlannedSection[] = [
  {
    id: "allocator",
    title: "Capstone",
    blurb: "Everything about memory, in one program you write yourself.",
    items: [
      project(
        "project-malloc",
        "Project: Build your own malloc",
        "Write your own malloc and free on top of raw memory from the OS, proving you understand the heap from the inside.",
      ),
    ],
  },
];

// Computer Architect

export const PERFORMANCE: PlannedSection[] = [
  {
    id: "measuring",
    title: "Measuring performance",
    items: [
      lesson(
        "cpi-and-clock-rate",
        "Measuring performance: time, CPI and clock rate",
        "How run time depends on instruction count, cycles per instruction and clock rate, and how to measure each one.",
      ),
      lesson(
        "amdahls-law",
        "Amdahl's law",
        "Why speeding up one part of a program helps only as much as that part's share of the total time.",
      ),
      lesson(
        "benchmarks",
        "Benchmarks and what they hide",
        "How benchmarks measure performance, and how averages, warm-up and chosen workloads can mislead you.",
      ),
      lesson(
        "power-and-energy",
        "Power and energy",
        "Why power and heat limit how fast a chip can run, and how voltage and clock rate affect the energy it uses.",
      ),
    ],
  },
];

export const PIPELINING: PlannedSection[] = [
  {
    id: "pipeline",
    title: "The pipeline",
    items: [
      lesson(
        "five-stage-pipeline",
        "A five-stage pipeline",
        "How splitting each instruction into five stages lets a CPU work on several instructions at once.",
      ),
      lesson(
        "data-hazards",
        "Data hazards and forwarding",
        "Why an instruction can need a result that is not ready yet, and how forwarding passes it along early.",
      ),
      lesson(
        "control-hazards",
        "Control hazards and stalls",
        "Why branches leave a pipeline unsure what to fetch next, and how stalls keep it correct at a cost.",
      ),
      lesson(
        "branch-prediction",
        "Branch prediction",
        "How a CPU guesses which way a branch will go to keep the pipeline full, and what a wrong guess costs.",
      ),
      project(
        "project-pipeline-sim",
        "Project: Simulate a pipeline",
        "Build a simulator of a five-stage pipeline with hazards and forwarding, proving you can count its cycles exactly.",
      ),
    ],
  },
];

export const ADVANCED_EXECUTION: PlannedSection[] = [
  {
    id: "beyond-the-pipeline",
    title: "Beyond one instruction at a time",
    items: [
      lesson(
        "superscalar",
        "Superscalar: more than one at a time",
        "How a superscalar CPU issues and runs several instructions in the same clock cycle, and what limits it.",
      ),
      lesson(
        "out-of-order",
        "Out-of-order execution",
        "How a CPU runs instructions as soon as their inputs are ready, not in program order, while keeping results correct.",
      ),
      lesson(
        "register-renaming",
        "Register renaming",
        "How register renaming removes false dependencies between instructions that only reuse the same register name.",
      ),
      lesson(
        "speculation",
        "Speculation and the reorder buffer",
        "How a CPU runs instructions before it knows they are needed, and uses a reorder buffer to commit them in order.",
      ),
    ],
  },
];

export const CACHES_MEMORY: PlannedSection[] = [
  {
    id: "caches",
    title: "Caches and memory",
    items: [
      lesson(
        "cache-organisation",
        "Cache organisation: sets, ways and lines",
        "How a cache splits an address into tag, index and offset to find a line in a set, and what associativity means.",
      ),
      lesson(
        "replacement-and-writes",
        "Replacement and write policies",
        "How a full cache picks a line to evict, and how write-through and write-back keep memory up to date.",
      ),
      lesson(
        "cache-hierarchy",
        "Cache hierarchies: L1, L2 and L3",
        "Why CPUs stack L1, L2 and L3 caches of growing size and latency, and how a miss travels down them.",
      ),
      lesson(
        "dram",
        "DRAM and the memory controller",
        "How DRAM stores bits in capacitors that must be refreshed, and how the memory controller schedules access to it.",
      ),
      project(
        "project-cache-sim",
        "Project: A cache simulator",
        "Build a cache simulator that counts hits and misses for real address traces, proving you can predict cache behaviour.",
      ),
    ],
  },
];

export const MULTICORE_GPUS: PlannedSection[] = [
  {
    id: "parallel-hardware",
    title: "Parallel hardware",
    items: [
      lesson(
        "cache-coherence",
        "Cache coherence",
        "How cores with their own caches agree on the value of shared data, using protocols like MESI.",
      ),
      lesson(
        "memory-consistency",
        "Memory consistency models",
        "In what order one core's writes may appear to other cores, and why fences are needed to enforce an order.",
      ),
      lesson(
        "simd",
        "SIMD and vector instructions",
        "How SIMD instructions apply one operation to many values at once, and how loops are written to use them.",
      ),
      lesson(
        "gpus",
        "How a GPU runs thousands of threads",
        "How a GPU runs thousands of threads in groups that share one instruction stream, and what work suits it.",
      ),
      lesson(
        "accelerators",
        "Accelerators built for one job",
        "Why chips built for one job, such as machine learning or video, beat general CPUs at it, and what they give up.",
      ),
    ],
  },
];

export const VERILOG: PlannedSection[] = [
  {
    id: "hdl",
    title: "Describing hardware",
    items: [
      lesson(
        "verilog-basics",
        "Describing hardware in Verilog",
        "How Verilog describes hardware as modules, wires and registers that all work at once, not as steps run in order.",
      ),
      lesson(
        "combinational-verilog",
        "Combinational logic in Verilog",
        "How to describe gates, multiplexers and adders in Verilog, whose outputs depend only on their current inputs.",
      ),
      lesson(
        "sequential-verilog",
        "Sequential logic and state machines",
        "How to describe registers and state machines in Verilog that change only on a clock edge.",
      ),
      lesson(
        "fpga",
        "From Verilog to an FPGA",
        "How a Verilog design is synthesised and loaded onto an FPGA, so your description becomes working hardware.",
      ),
      project(
        "project-verilog-alu",
        "Project: An ALU in Verilog",
        "Build an ALU in Verilog and test it in simulation, proving you can turn a logic design into working hardware code.",
      ),
    ],
  },
];

export const VERIFICATION: PlannedSection[] = [
  {
    id: "checking",
    title: "Proving a design works",
    items: [
      lesson(
        "testbenches",
        "Testbenches",
        "How a testbench drives inputs into a hardware design and checks its outputs automatically in simulation.",
      ),
      lesson(
        "coverage",
        "Coverage: how much have you tested?",
        "How coverage measures which lines, states and cases your tests have exercised, and what it still misses.",
      ),
      lesson(
        "assertions-and-formal",
        "Assertions and formal checking",
        "How assertions state rules a design must always follow, and how formal tools prove them for every input.",
      ),
    ],
  },
];

export const RTL_TO_SILICON: PlannedSection[] = [
  {
    id: "physical",
    title: "Making the chip",
    items: [
      lesson(
        "synthesis",
        "Synthesis: from code to gates",
        "How a synthesis tool turns Verilog into a netlist of gates and flip-flops from a cell library.",
      ),
      lesson(
        "timing",
        "Timing: setup, hold and the critical path",
        "Why signals must arrive before the clock edge and stay steady after it, and how the slowest path sets the clock rate.",
      ),
      lesson(
        "place-and-route",
        "Place, route and the finished chip",
        "How gates are placed on the chip and wired together, and the checks a design passes before it is manufactured.",
      ),
    ],
  },
];

export const COMPILERS_THEORY: PlannedSection[] = [
  {
    id: "compilers",
    title: "Compilers and computation",
    items: [
      lesson(
        "compiler-structure",
        "How a compiler is built",
        "How a compiler turns source code into machine code in stages: parsing, checking, optimising and generating code.",
      ),
      lesson(
        "ssa",
        "Intermediate code and SSA",
        "How compilers rewrite code into an intermediate form where each variable is assigned once, which makes optimising easier.",
      ),
      lesson(
        "register-allocation",
        "Register allocation",
        "How a compiler decides which values live in the few registers and which spill to memory.",
      ),
      lesson(
        "computability",
        "What can be computed",
        "Which problems a computer can solve at all, and why no program can decide whether every program halts.",
      ),
    ],
  },
];

export const RISCV_CORE: PlannedSection[] = [
  {
    id: "core",
    title: "Capstone",
    blurb: "Design a real processor, then prove it runs real programs.",
    items: [
      lesson(
        "riscv-isa",
        "The RISC-V instruction set",
        "How the RISC-V instruction set is organised: its registers, its instruction formats, and its loads and stores.",
      ),
      project(
        "project-riscv-core",
        "Capstone: Build and verify a small RISC-V core",
        "Design a small RISC-V processor in Verilog and verify it runs real programs, proving you can build a CPU end to end.",
      ),
    ],
  },
];

// Security Engineer

export const SECURITY_FOUNDATIONS: PlannedSection[] = [
  {
    id: "thinking-like-an-attacker",
    title: "Thinking like an attacker",
    items: [
      lesson(
        "threat-models",
        "Threat models",
        "How to decide what you are protecting, from whom and against what, before choosing any defence.",
      ),
      lesson(
        "least-privilege",
        "Least privilege and isolation",
        "Why each program and user should get only the access it needs, and how isolation limits the damage of a breach.",
      ),
      lesson(
        "authentication-and-secrets",
        "Authentication and secrets",
        "How systems check who you are, store passwords as slow salted hashes, and keep keys and tokens out of reach.",
      ),
      lesson(
        "cryptography",
        "Cryptography: what it does and doesn't do",
        "What encryption, hashing and signatures each guarantee, and the common mistakes that break them in practice.",
      ),
    ],
  },
];

export const MEMORY_SAFETY: PlannedSection[] = [
  {
    id: "bugs-and-defences",
    title: "Bugs and defences",
    items: [
      lesson(
        "buffer-overflows",
        "Buffer overflows",
        "How writing past the end of a buffer can overwrite a return address, and how attackers use that to take control.",
      ),
      lesson(
        "use-after-free",
        "Use-after-free and double free",
        "How using memory after it is freed, or freeing it twice, can let an attacker control what the program reads.",
      ),
      lesson(
        "format-strings",
        "Format string bugs",
        "How passing user input as a printf format string lets an attacker read or write memory.",
      ),
      lesson(
        "mitigations",
        "Stack canaries, ASLR and NX",
        "How stack canaries, ASLR and non-executable memory each make memory bugs harder to exploit, and their limits.",
      ),
      lesson(
        "control-flow-integrity",
        "Control-flow integrity",
        "How control-flow integrity checks that indirect jumps, calls and returns only go to targets the program allows.",
      ),
      project(
        "project-exploit-and-fix",
        "Project: Break and fix a toy program",
        "Exploit a memory bug in a small vulnerable program, then fix it, proving you understand both the attack and the defence.",
      ),
    ],
  },
];

export const HARDWARE_TRUST: PlannedSection[] = [
  {
    id: "side-channels",
    title: "When hardware leaks",
    items: [
      lesson(
        "timing-side-channels",
        "Timing side channels",
        "How the time an operation takes can leak secrets like keys, and why constant-time code avoids it.",
      ),
      lesson(
        "spectre-meltdown",
        "Spectre and Meltdown",
        "How speculative execution leaves traces in the cache that leak data, and how Spectre and Meltdown exploit them.",
      ),
      lesson(
        "trusted-execution",
        "Trusted execution and secure boot",
        "How secure boot checks each piece of software before it runs, and how trusted enclaves protect code from the OS.",
      ),
    ],
  },
];

export const RELIABILITY: PlannedSection[] = [
  {
    id: "failing-well",
    title: "Failing well",
    items: [
      lesson(
        "faults-errors-failures",
        "Faults, errors and failures",
        "How a fault becomes an error and then a failure the user sees, and where each one can be caught.",
      ),
      lesson(
        "redundancy",
        "Redundancy and recovery",
        "How spare copies of hardware, data and services let a system keep working or recover after something breaks.",
      ),
      lesson(
        "fuzzing",
        "Fuzzing",
        "How fuzzing feeds a program huge numbers of random and mutated inputs to find crashes and security bugs.",
      ),
      lesson(
        "fail-safely",
        "Writing code that fails safely",
        "How to write code that checks every error, cleans up after itself and stops in a safe state instead of a broken one.",
      ),
    ],
  },
];

// Network Engineer

export const NETWORK_FOUNDATIONS: PlannedSection[] = [
  {
    id: "how-networks-work",
    title: "How networks work",
    items: [
      lesson(
        "what-is-a-network",
        "What a network is",
        "What a network is, how computers send data as packets over shared links, and what switches and routers do.",
      ),
      lesson(
        "layers",
        "Layers: from wires to apps",
        "How networking is split into layers, from signals on a wire up to applications, and what each layer adds.",
      ),
      lesson(
        "ethernet",
        "Ethernet and MAC addresses",
        "How Ethernet sends frames between machines on one local network, and how switches use MAC addresses to deliver them.",
      ),
      lesson(
        "ip-addresses",
        "IP addresses and subnets",
        "How IP addresses identify machines across networks, and how a subnet mask splits an address into network and host.",
      ),
      lesson(
        "routing",
        "Routing: how a packet finds its way",
        "How routers forward a packet hop by hop using routing tables until it reaches the right network.",
      ),
      project(
        "project-trace-a-packet",
        "Project: Trace a packet",
        "Follow one packet from your machine to a server and back, proving you can explain what every layer does to it.",
      ),
    ],
  },
];

export const NETWORK_PROTOCOLS: PlannedSection[] = [
  {
    id: "transport-and-apps",
    title: "Transport and applications",
    items: [
      lesson(
        "udp",
        "UDP",
        "How UDP sends independent datagrams with ports and a checksum, and why fast apps accept that some may be lost.",
      ),
      lesson(
        "tcp",
        "TCP: reliable streams",
        "How TCP builds a reliable, ordered byte stream with a handshake, sequence numbers, acknowledgements and resends.",
      ),
      lesson(
        "congestion-control",
        "TCP congestion control",
        "How TCP senses a crowded network from lost packets and slows down, so many connections can share one link.",
      ),
      lesson(
        "dns",
        "DNS",
        "How DNS turns a name like example.com into an IP address, asking a chain of servers and caching the answer.",
      ),
      lesson(
        "http",
        "HTTP",
        "How a browser and a server talk with HTTP requests and responses, using methods, headers and status codes.",
      ),
      lesson(
        "tls",
        "TLS: encryption in transit",
        "How TLS encrypts a connection and uses certificates to prove the server is who it claims to be.",
      ),
      lesson(
        "sockets",
        "Sockets in C",
        "How a C program opens a socket, connects or listens, and sends and receives bytes over the network.",
      ),
      project(
        "project-http-server",
        "Project: A tiny HTTP server",
        "Build a tiny HTTP server in C with sockets that serves files to a browser, proving you can speak a real protocol.",
      ),
    ],
  },
];

export const NETWORK_OPS: PlannedSection[] = [
  {
    id: "running-networks",
    title: "Running networks",
    items: [
      lesson(
        "ping-traceroute-dig",
        "ping, traceroute and dig",
        "How to test whether a host is reachable, see the path packets take and check DNS answers from the command line.",
      ),
      lesson(
        "packet-capture",
        "Reading packets with Wireshark and tcpdump",
        "How to capture the packets on a network with tcpdump and read them in Wireshark, layer by layer.",
      ),
      lesson(
        "firewalls-and-nat",
        "Firewalls and NAT",
        "How firewalls decide which packets to allow, and how NAT lets many machines share one public IP address.",
      ),
      lesson(
        "slow-connections",
        "Debugging a slow connection",
        "How to find why a connection is slow, from DNS delays and packet loss to high latency and small TCP windows.",
      ),
      lesson(
        "safe-change",
        "Changing a network safely",
        "How to change a network's configuration without cutting yourself off: plan it, test it and keep a way to roll back.",
      ),
      project(
        "project-diagnose-a-network",
        "Project: Diagnose a broken network",
        "Find and fix the faults in a broken network with ping, traceroute, dig and packet captures, proving you can debug it.",
      ),
    ],
  },
];

/** Lesson and project counts for an outline. */
export function plannedCounts(outline: PlannedSection[]): { lessons: number; projects: number } {
  const items = outline.flatMap((s) => s.items);
  const projects = items.filter((i) => i.project).length;
  return { lessons: items.length - projects, projects };
}
