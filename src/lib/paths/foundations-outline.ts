/**
 * Foundations course outline data.
 * Live items are lessons/projects with a file; "soon" items show on the path page as "Coming soon".
 */

export type FoundationsItemRole = "lesson" | "project";

export type FoundationsOutlineItem =
  | {
      kind: "live";
      slug: string;
      title: string;
      /** One sentence shown under the title on the path page: what the lesson teaches. */
      description: string;
      timeMin: number;
      /** Default lesson; projects get a distinct outline icon. */
      role?: FoundationsItemRole;
      /** Blueprint ids this item teaches (see FOUNDATIONS_OUTLINE). */
      covers?: string[];
    }
  | {
      kind: "soon";
      id: string;
      title: string;
      description: string;
      timeMin?: number;
      role?: FoundationsItemRole;
      covers?: string[];
    }
  | {
      kind: "link";
      id: string;
      title: string;
      href: string;
      hint?: string;
    };

export type FoundationsOutlineSection = {
  id: string;
  title: string;
  /** Short overview of what this block teaches. */
  blurb?: string;
  items: FoundationsOutlineItem[];
};

export const FOUNDATIONS_LEVEL = "level-00-bits-logic" as const;

const live = (
  slug: string,
  title: string,
  timeMin: number,
  description: string,
  covers: string[],
  role?: FoundationsItemRole,
): FoundationsOutlineItem => ({ kind: "live", slug, title, timeMin, description, covers, role });
const soon = (
  id: string,
  title: string,
  timeMin: number,
  description: string,
  covers: string[],
  role?: FoundationsItemRole,
): FoundationsOutlineItem => ({ kind: "soon", id, title, timeMin, description, covers, role });
const project = (id: string, title: string, timeMin: number, description: string, covers: string[]) =>
  soon(id, title, timeMin, description, covers, "project");

/**
 * Foundations: eight courses (grouped in `catalog.ts` by section id). `covers` names the lessons (F001–F106)
 * and projects (P1-A…P8-X) of the curriculum blueprint in `docs/curriculum/sugestion/` that each item
 * teaches; a test checks every one has exactly one home. A live lesson's URL contains its section id, so
 * when one moves section, `FOUNDATIONS_MOVED` keeps its old URL working.
 */
export const FOUNDATIONS_OUTLINE: FoundationsOutlineSection[] = [
  // Course 1: Computers & Information
  {
    id: "computers",
    title: "What a computer is",
    blurb: "What makes something a computer, its main parts, and how hardware and software differ.",
    items: [
      live("what-is-a-computer", "What is a computer?", 6, "What makes a device a computer: it takes in information, works on it, remembers, and follows instructions.", ["F001"]),
      live("input-processing-output", "Input, processing, output and storage", 7, "Follow one everyday task through the four jobs every computer does, and meet the CPU, memory and storage by their roles.", ["F002"]),
      live("hardware-software-firmware", "Hardware, software and firmware", 6, "The circuits, the programs that run on them and the software built into the chips, and why one machine can do many jobs.", ["F003"]),
    ],
  },
  {
    id: "information",
    title: "Signals and information",
    blurb: "How the physical world becomes symbols a machine can store, and why meaning is something we agree on.",
    items: [
      live("analog-and-digital", "Analog and digital", 6, "Smoothly varying quantities versus a few clear states, and why a computer reads a whole range of voltages as just 0 or 1.", ["F004"]),
      live("what-is-a-bit", "What is a bit?", 4, "The smallest piece of information: one of two states, why computers use two, and how bits combine to say more.", ["F005"]),
      live("codes-and-meaning", "Codes, symbols and meaning", 7, "Map bit patterns to messages, and see that a pattern means nothing until both sides agree on the code.", ["F006"]),
      live("project-codebook", "Project: Make a codebook", 15, "Design a code for a small set of messages, encode a phrase, and decode someone else's using only the shared code.", ["P1-A"], "project"),
    ],
  },
  {
    id: "instructions",
    title: "Instructions, state and layers",
    blurb: "How a machine follows steps, what changes when it does, and how we understand it one layer at a time.",
    items: [
      live("instructions-and-algorithms", "Instructions and algorithms", 7, "An algorithm is an exact procedure; an instruction is one step a machine can recognise and carry out.", ["F007"]),
      live("state-and-steps", "State, time and step-by-step execution", 7, "Compare a machine before and after each step, and see why the same input can give different results in a different state.", ["F008"]),
      live("abstraction-and-layers", "Abstraction: a machine in layers", 7, "Why we study a computer as parts with clear interfaces, and the ladder this path climbs from bits to programs.", ["F009"]),
      live("project-machine-atlas", "Project: The Machine Atlas", 25, "Map a computer you use into input, processing, memory, storage and output, then trace one action through it step by step.", ["P1-B"], "project"),
      project("project-noisy-channel", "Optional project: Bits through a noisy channel", 20, "Send bits over a line that sometimes flips them, and work out how sender and receiver can still agree.", ["P1-X"]),
    ],
  },

  // Course 2: Binary & Data
  {
    id: "bits",
    title: "Numbers in binary",
    blurb: "Place value, fixed widths, adding, negative numbers and working on bits directly.",
    items: [
      live("binary-and-number-bases", "Binary & number bases", 7, "Place value in any base, counting and converting in binary, and hexadecimal as a short way to write bits.", ["F010", "F011", "F012", "F014"]),
      live("bytes-words-meaning", "Bits, nibbles, bytes and words", 7, "How many patterns a fixed number of bits can hold, what bytes and words are, and kilobytes versus kibibytes.", ["F013"]),
      live("binary-addition", "Adding in binary: carries and fixed width", 7, "Add binary numbers column by column, and tell the bits you keep apart from the carry out of the top.", ["F015"]),
      live("negative-numbers", "Negative numbers: two's complement", 8, "How a fixed number of bits holds negative numbers, why the top bit is worth minus, and how adding can subtract.", ["F016", "F017"]),
      live("overflow", "Overflow: when numbers run out of bits", 7, "Predict what happens when a result doesn't fit, and tell an unsigned carry apart from a signed overflow.", ["F018"]),
      live("bitwise-operations", "Bitwise operations: AND, OR, XOR, shifts and masks", 9, "Apply logic to every bit of a byte at once, pick bits out with masks, and move them with shifts.", ["F019"]),
    ],
  },
  {
    id: "data",
    title: "Text, media and fractions",
    blurb: "The same bytes read as letters, pictures, sound and numbers with a point.",
    items: [
      live("text-ascii-utf8", "Text: ASCII, Unicode and UTF-8", 8, "How characters become numbers and then bytes, and why one character can take more than one byte.", ["F020"]),
      live("media-and-files", "Pixels, colour, sound and files", 8, "Images, colour, sound and file formats are bytes too; what differs is the agreed way to read them.", ["F021"]),
      live("floating-point", "Fractions: floating point and why 0.1 + 0.2 isn't 0.3", 9, "Why many decimal fractions can't be stored exactly in binary, and why floating-point answers are often approximate.", ["F022"]),
      live("project-number-workbench", "Project: Number workbench", 20, "Convert between decimal, binary and hex, read a byte as signed and unsigned, and predict overflow before checking.", ["P2-A"], "project"),
      live("project-byte-lab", "Project: The Byte Lab", 30, "Use the Byte Lab to read the same bytes as numbers, text and colours, and work out what a mystery message means.", ["P2-B"], "project"),
      project("project-file-format", "Optional project: Design a tiny file format", 30, "Invent a header and data layout for a small black-and-white image, then write down exactly how to decode it.", ["P2-X"]),
    ],
  },

  // Course 3: Logic & Circuits
  {
    id: "logic",
    title: "Logic & gates",
    blurb: "Boolean logic, gates in hardware, and circuits that add.",
    items: [
      live("boolean-logic-and-truth-tables", "Boolean logic & truth tables", 7, "True and false as two states, and how AND, OR, NOT and XOR combine them, shown in truth tables.", ["F023", "F024"]),
      live("logic-gates-from-switches-to-circuits", "Logic gates, from switches to circuits", 8, "How switches and transistors become gates, and why NAND alone can build every other gate.", ["F025", "F026", "F027"]),
      live("combinational-vs-state", "Circuits that compute and circuits that remember", 6, "A combinational circuit's output depends only on its inputs right now, which is why it can't remember anything.", ["F028"]),
      live("boolean-algebra", "Simplifying logic: identities and De Morgan's laws", 8, "Rewrite logic expressions into equal but simpler ones, and see two different circuits give the same truth table.", ["F029"]),
      live("project-half-adder", "Project: Half-adder", 25, "Build a circuit that adds two bits from an XOR and an AND gate, and test it on every input.", ["F032"], "project"),
      live("full-adder-and-4-bit-adder", "Full adder and the 4-bit adder", 9, "Add a carry-in to make a full adder, chain four into a ripple-carry adder, and use it to subtract.", ["F033"]),
    ],
  },
  {
    id: "circuits",
    title: "Circuits that calculate",
    blurb: "Choosing between signals, comparing, and the arithmetic unit at the heart of a CPU.",
    items: [
      live("mux-decoder", "Multiplexers: choosing between signals", 8, "A multiplexer lets a select signal choose which input passes through; it is how a CPU routes data.", ["F030"]),
      live("decoders", "Decoders, demultiplexers and encoders", 8, "Turn a binary number into one active wire out of many, the trick memory uses to pick a single box.", ["F031"]),
      live("comparators-and-flags", "Subtracting, comparing and status flags", 8, "Reuse the adder to subtract and compare, and produce flags such as zero and carry that describe the result.", ["F034"]),
      live("the-alu", "The ALU: one circuit, many operations", 9, "Put arithmetic and logic behind an operation code to make the arithmetic logic unit at the heart of a CPU.", ["F035"]),
      live("testing-and-delay", "Testing circuits, delay and trade-offs", 7, "Test a circuit against its whole truth table, and see why real gates take time and the longest path sets the speed.", ["F036"]),
      live("project-gate-workbench", "Project: Logic gate workbench", 20, "Build NOT, AND, OR and XOR from NAND alone, then a multiplexer, and check each against its truth table.", ["P3-A"], "project"),
      live("project-alu", "Project: Build an 8-bit ALU", 40, "Build a one-bit ALU slice that adds, subtracts, ANDs and ORs, then chain eight of them and test it on whole bytes.", ["P3-B"], "project"),
      project("project-smaller-circuit", "Optional project: Make the circuit smaller", 25, "Rebuild part of your ALU from fewer gates, then compare gate counts and the longest path through each version.", ["P3-X"]),
    ],
  },

  // Course 4: State & Memory
  {
    id: "memory",
    title: "State and registers",
    blurb: "How a circuit remembers: latches, the clock, registers, counters and state machines.",
    items: [
      live("why-state", "Why a computer needs state", 6, "Circuits that only compute forget everything; a computer must keep a current state and work out the next one.", ["F037"]),
      live("latches-and-flip-flops", "Remembering a bit: latches and flip-flops", 9, "Feedback makes a circuit hold a bit; the SR latch and the D flip-flop control exactly when it changes.", ["F038", "F039"]),
      live("clocks-and-registers", "The clock and registers", 8, "A clock tells every part when to update, and a row of flip-flops with a load input becomes a register.", ["F040", "F041"]),
      live("counters", "Counters: registers that count", 7, "Feed a register through an adder and back into itself to make a counter, the circuit behind the program counter.", ["F042"]),
      live("state-machines", "State machines: circuits that follow steps", 9, "Describe a controller as states and transitions, then build it from a register and some logic.", ["F043"]),
    ],
  },
  {
    id: "storage",
    title: "Memory and storage",
    blurb: "Addressed memory built from registers, and the different places data can live.",
    items: [
      live("memory-and-addresses", "Memory as numbered boxes", 8, "Memory is a row of numbered bytes: an address picks a box, a decoder finds it, and you read or write it.", ["F044", "F045", "F046"]),
      live("ram-rom-storage", "Registers, RAM, ROM and storage", 7, "Compare where data can live, from tiny fast registers to storage that survives the power going off.", ["F047"]),
      live("memory-timing", "Memory timing: a small memory system", 8, "Time writes to the clock and reads to the address, and put registers and RAM together ready for a CPU.", ["F048"]),
      live("project-register-lab", "Project: Register and counter lab", 20, "Build an 8-bit register and a counter with load, reset and hold, and check they change only on the clock tick.", ["P4-A"], "project"),
      live("project-memory-board", "Project: The memory board", 30, "Build a 256-byte memory with address, data and write controls, and prove a write to one box leaves the rest alone.", ["P4-B"], "project"),
      live("project-sequencer", "Optional project: A tiny sequencer", 25, "Build a state machine that reads a byte from memory, changes it and writes it back, one clock tick per step.", ["P4-X"], "project"),
    ],
  },

  // Course 5: Build a CPU
  {
    id: "isa",
    title: "Instructions",
    blurb: "The CPU's vocabulary, and programs stored as bits in memory.",
    items: [
      live("instruction-set", "An instruction set: the CPU's vocabulary", 9, "What a CPU can be told to do, how one instruction fits in a byte, and why programs and data share memory.", ["F049", "F053", "F054"]),
      live("instruction-formats", "Instruction formats and operand fields", 8, "How an instruction's bits split into an opcode and operands, and why the format is fixed before any tools are built.", ["F055"]),
    ],
  },
  {
    id: "machine-runs",
    title: "How a machine runs",
    blurb: "The fetch-execute loop, each kind of instruction, branching, and a tiny CPU built from everything before it.",
    items: [
      live("the-fetch-execute-loop", "The fetch-execute loop", 9, "The program counter points at the next instruction; the CPU fetches it, decodes it and runs it, over and over.", ["F056", "F057", "F058"]),
      live("alu-instructions", "Running arithmetic instructions", 7, "Follow an ADD from the instruction to the ALU and back into a register, and see what stays unchanged.", ["F059"]),
      live("loads-and-stores", "Loads and stores: moving data to and from memory", 7, "Trace values between registers and memory, keeping an address apart from the value stored there.", ["F060"]),
      live("jumps-and-loops", "Jumps and loops: how a CPU decides", 8, "A jump rewrites the program counter, flags record the last result, and together they make ifs and loops.", ["F061"]),
      live("from-gates-to-cpu", "From gates to a tiny CPU: datapath and control", 12, "The registers, ALU and memory share one bus, and a control unit decides which part talks on each clock tick.", ["F050", "F051", "F052", "F062"]),
      live("project-build-datapath", "Project: Build the datapath", 25, "Connect the ALU, registers and memory with a bus and load signals, and move values by hand before adding control.", ["P5-A"], "project"),
      live("project-tiny-cpu", "Project: Run a program on a tiny CPU", 25, "Predict, step through and debug three programs on the tiny CPU: a multiply loop, an overflow and a broken jump.", ["F063"], "project"),
      live("project-build-the-cpu", "Project: Build the tiny CPU", 45, "Add the control unit to your datapath and run real programs on a CPU you wired yourself, checked against the simulator.", ["P5-B"], "project"),
      live("project-two-designs", "Optional project: Two designs, one instruction set", 30, "Run the same programs on two different control designs and show the results match although the inner steps differ.", ["P5-X"], "project"),
    ],
  },

  // Course 6: Assembly Language
  {
    id: "assembly",
    title: "Writing assembly",
    blurb: "Program the tiny CPU in assembly: moving data, arithmetic, decisions and loops.",
    items: [
      soon("assembly-vs-machine-code", "Machine code and assembly language", 7, "Assembly gives each instruction a readable name, but it is still one CPU's own language, not a universal one.", ["F064"]),
      soon("operands", "Operands: values, registers and addresses", 7, "Tell a number written in an instruction apart from a register, an address, and the value stored at that address.", ["F065"]),
      soon("loading-and-storing", "Loading and storing in assembly", 7, "Write programs that move values between registers and memory, and say exactly what each line changes.", ["F066"]),
      soon("arithmetic-in-assembly", "Arithmetic, logic and flags in assembly", 8, "Write short arithmetic and logic sequences, and read the flags each one leaves behind.", ["F067"]),
      soon("compare-and-branch", "Comparisons and conditional branches", 8, "Compare two values, then branch on the result to choose which code runs next.", ["F068"]),
      soon("loops-in-assembly", "Loops as repeated jumps", 8, "Turn a counting loop into labels, updates and branches, and make sure it stops exactly when it should.", ["F069"]),
      project("project-assembly-puzzles", "Project: Assembly puzzles", 25, "Solve short puzzles in assembly: add, copy memory, count down and pick the larger value, checked by machine state.", ["P6-A"]),
    ],
  },
  {
    id: "assembler",
    title: "The assembler",
    blurb: "The program that turns assembly into bytes, written in two passes.",
    items: [
      soon("labels", "Labels and addresses", 7, "Programmers name jump targets with labels, and the assembler has to turn every label into a real address.", ["F070"]),
      soon("assembler-pass-one", "The assembler, pass one: finding labels", 8, "Walk through the program once to work out each instruction's address and build a table of labels.", ["F071"]),
      soon("assembler-pass-two", "The assembler, pass two: writing the bytes", 8, "Walk through again, turning each line and its labels into the exact bytes the CPU will run.", ["F072"]),
      project("project-assembler", "Project: Write an assembler", 45, "Write a two-pass assembler, loader and disassembler for the tiny CPU, and check that programs round-trip exactly.", ["P6-B"]),
    ],
  },
  {
    id: "subroutines",
    title: "Subroutines, devices and debugging",
    blurb: "The stack, calls and returns, talking to a device, and finding bugs one instruction at a time.",
    items: [
      soon("the-stack", "The stack: last in, first out", 8, "A stack pointer and a region of memory give you push and pop: a convention, not a special kind of RAM.", ["F073"]),
      soon("calls-and-returns", "Calls, return addresses and subroutines", 9, "A call saves where to come back to on the stack, so one subroutine can be used from many places.", ["F074"]),
      soon("io-in-assembly", "Input and output instructions", 7, "Send a byte to a device and read one back, and see where the CPU ends and the device begins.", ["F075"]),
      soon("debugging-machine-code", "Debugging at the machine level", 8, "Use stepping, breakpoints and register and memory views to find the first instruction that went wrong.", ["F076"]),
      soon("complete-program", "Assemble and run a complete program", 10, "Combine loops, memory, arithmetic, output and a subroutine into one documented program with tests.", ["F077"]),
      project("project-subroutine-library", "Optional project: A subroutine library", 30, "Write reusable routines such as multiply and print-a-number, and test that nested calls return correctly.", ["P6-X"]),
    ],
  },

  // Course 7: From Source to Machine
  {
    id: "source",
    title: "Programs and languages",
    blurb: "From an algorithm to source code: expressions, variables, control flow and types.",
    items: [
      soon("algorithms-and-languages", "Algorithms, programs and languages", 7, "One algorithm, many programs: how source code differs from the machine instructions that finally run.", ["F078"]),
      soon("expressions", "Expressions and evaluation order", 7, "Work out an expression step by step, and see why a language has to define what is evaluated first.", ["F079"]),
      soon("variables-in-memory", "Variables in memory: x = x + 1, step by step", 8, "A variable names a place in memory, and x = x + 1 means read it, add one, then write it back.", ["F080"]),
      soon("control-and-functions", "Conditions, loops and functions", 8, "Write ifs, loops and functions in a small language, then see the compares and jumps they turn into.", ["F081"]),
      soon("types-and-widths", "Types and widths", 7, "A type says how many bits a value has and how to read them, which is why a char and an int differ.", ["F082"]),
    ],
  },
  {
    id: "data-layout",
    title: "Data in memory",
    blurb: "Arrays, pointers, layout and the stack frames that functions run in.",
    items: [
      soon("arrays", "Arrays: values side by side", 7, "An array keeps its elements next to each other, so element i sits at the start address plus i times the size.", ["F083"]),
      soon("pointers", "What a pointer means", 8, "A pointer is a value that refers to a place in memory; following it reads or writes what is stored there.", ["F084"]),
      soon("layout-and-alignment", "Bytes, alignment and data layout", 8, "How values bigger than a byte are laid out, and why byte order and alignment change what memory looks like.", ["F085"]),
      soon("functions-and-the-stack", "Functions and the call stack", 9, "Arguments, return values and return addresses live in stack frames, one for each call that hasn't finished.", ["F086"]),
      project("project-memory-visualizer", "Project: Watch variables and arrays in memory", 20, "Step through a small program and predict every change to its variables and array elements before you look.", ["P7-A"]),
    ],
  },
  {
    id: "toolchain",
    title: "The toolchain",
    blurb: "How source files become a running program: compiling, assembling, linking and loading.",
    items: [
      soon("source-files-and-headers", "Source files, headers and the preprocessor", 7, "A C program is several files: declarations in headers, code in source files, and a preprocessor that joins them.", ["F087"]),
      soon("compile-and-assemble", "Compiling and assembling", 8, "The compiler turns source into assembly and the assembler turns that into object code, often in one command.", ["F088"]),
      soon("object-files", "Object files, sections and symbols", 8, "Compiled code and data sit in sections, with symbols naming them and gaps left for names defined elsewhere.", ["F089"]),
      soon("compile-link-load", "Linking, loading and starting a program", 9, "The linker joins object files into one program; the loader puts it in memory and starts it running.", ["F090"]),
      soon("real-compiler-output", "Reading real compiler output", 10, "Read the assembly a real C compiler writes with optimisation off and on, and see why the two differ.", ["F091"]),
      project("project-translator", "Project: A tiny-language translator", 45, "Write a translator from a small language with variables, if and while into tiny CPU assembly, then run the result.", ["P7-B"]),
      project("project-real-c", "Project: Inspect real compiled C", 30, "Compile one C function with optimisation off and on, annotate the assembly, and name two differences from the tiny CPU.", ["P7-C"]),
      project("project-compiler-variation", "Optional project: Compare two compilers", 30, "Compile the same C program with two compilers or for two CPUs, and separate what changes from what C guarantees.", ["P7-X"]),
    ],
  },

  // Course 8: The Complete System
  {
    id: "system",
    title: "The whole machine",
    blurb: "The CPU among memory, storage, devices and firmware, from power-on to a running program.",
    items: [
      soon("from-cpu-to-system", "From CPU to computer system", 7, "Put the CPU together with memory, storage, firmware, devices and software, each with its own clear job.", ["F092"]),
      soon("ram-vs-storage", "Memory versus storage", 7, "Why RAM forgets when the power goes off and storage doesn't, and what that means for a running program.", ["F093"]),
      soon("memory-hierarchy", "The memory hierarchy and locality", 8, "Registers, caches, RAM and storage trade size for speed, and programs run fast by reusing nearby data.", ["F094"]),
      live("input-and-output", "Input and output: talking to the outside world", 8, "How bytes reach a display and arrive from devices, through ports or memory addresses, by polling or interrupts.", ["F095", "F096"]),
      soon("boot", "Firmware, bootloaders and startup", 8, "What happens between pressing power and a running program: reset, firmware, a bootloader, then the OS.", ["F097"]),
    ],
  },
  {
    id: "os",
    title: "The operating system",
    blurb: "What the OS does for every program: processes, protected services, memory and files.",
    items: [
      soon("the-operating-system", "What an operating system provides", 8, "The OS runs programs, shares the hardware between them, and gives them files and devices through one interface.", ["F098"]),
      soon("system-calls", "Privilege, traps and system calls", 8, "Programs can't touch the hardware directly, so they ask the OS with a system call that switches into kernel mode.", ["F099"]),
      soon("processes", "Programs, processes and address spaces", 8, "A program is a file; a process is that program running, with its own memory, registers and open files.", ["F100"]),
      soon("virtual-memory", "Virtual and physical addresses", 8, "Each process sees its own addresses, which the hardware translates into real memory and keeps apart from others.", ["F101"]),
      soon("files", "Files and file systems", 7, "Named files and folders are built by the OS on top of storage blocks, and saving a file is not the same as changing RAM.", ["F102"]),
    ],
  },
  {
    id: "beyond",
    title: "Sharing, networks and trust",
    blurb: "Talking to other computers, running many programs at once, and staying safe when things go wrong.",
    items: [
      soon("networks", "How computers communicate", 8, "Follow a short message across a network as packets, passed down and back up through layers of protocols.", ["F103"]),
      soon("concurrency", "Sharing one machine", 8, "Many programs seem to run at once because the OS switches between them, and anything shared needs coordinating.", ["F104"]),
      soon("protection", "Protection, failures and trust", 8, "Programs can be wrong or hostile, so systems check bounds, keep programs apart and plan how to recover.", ["F105"]),
    ],
  },
  {
    id: "conclusion",
    title: "Wrap-up",
    blurb: "Follow one program all the way through the machine, then pick where to go next.",
    items: [
      soon("program-journey", "The complete journey of a program", 10, "Trace a small program from source code to bits, instructions, memory, the OS and the screen, naming each simplification.", ["F106"]),
      project("project-os-boundary", "Project: Follow a request across the OS boundary", 25, "Trace a file save or screen output from an app through the OS to the hardware, and say who does each part.", ["P8-A"]),
      project("project-trace-a-program", "Final project: Trace a program end to end", 45, "Take a program through your translator, assembler and tiny CPU, then compare it with real compiled C on a real OS.", ["P8-B"]),
      project("project-system-call-model", "Optional project: Model a system call", 30, "Simulate a program asking an OS for a service, showing the switch into kernel mode and back, step by step.", ["P8-X"]),
      {
        kind: "link",
        id: "choose-path",
        title: "Choose your path forward",
        href: "/paths",
        hint: "Pick a role path after Foundations",
      },
    ],
  },
];

/**
 * Live lessons that moved to another section when Foundations became eight courses: their old public
 * slug (with the old section id) still resolves, and redirects to the new one.
 */
export const FOUNDATIONS_MOVED: Record<string, string> = {
  "what-is-a-bit": "bits",
  "memory-and-addresses": "memory",
  "input-and-output": "machine-runs",
};

/** The outline items not written yet, per section, in order (shown on the path page as "Coming soon"). */
export function foundationsUpcoming(): Record<
  string,
  { id: string; title: string; project: boolean; description: string; timeMin?: number }[]
> {
  return Object.fromEntries(
    FOUNDATIONS_OUTLINE.map((section) => [
      section.id,
      section.items.flatMap((item) =>
        item.kind === "soon"
          ? [
              {
                id: item.id,
                title: item.title,
                project: item.role === "project",
                description: item.description,
                timeMin: item.timeMin,
              },
            ]
          : [],
      ),
    ]),
  );
}

export type FoundationsLiveSection = {
  id: string;
  title: string;
  blurb?: string;
  items: Extract<FoundationsOutlineItem, { kind: "live" }>[];
};

/** Topic cards with live lessons/projects only (skips empty / soon-only sections). */
export function foundationsLiveSections(): FoundationsLiveSection[] {
  return FOUNDATIONS_OUTLINE.map((section) => ({
    id: section.id,
    title: section.title,
    blurb: section.blurb,
    items: section.items.filter(
      (item): item is Extract<FoundationsOutlineItem, { kind: "live" }> =>
        item.kind === "live",
    ),
  })).filter((section) => section.items.length > 0);
}
