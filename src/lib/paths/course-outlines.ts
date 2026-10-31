/**
 * Topic outlines for curriculum levels used on path course maps.
 * Groups flat “old curriculum” lessons into named sections (Foundations-style).
 */

import type { LevelId } from "@/lib/content/schema";
import type { PathItemRole } from "@/components/paths/path-outline-marks";

export type CourseOutlineItem = {
  slug: string;
  /** One sentence shown under the title on the path page: what the lesson teaches. */
  description: string;
  role?: PathItemRole;
};

export type CourseOutlineSection = {
  id: string;
  title: string;
  blurb?: string;
  items: CourseOutlineItem[];
  /** Lessons and projects planned for this section but not written yet, after its live lessons. */
  upcoming?: { id: string; title: string; description: string; project?: boolean }[];
};

/** Level → topic sections. Missing levels fall back to a flat lesson list. */
export const COURSE_OUTLINES: Partial<Record<LevelId, CourseOutlineSection[]>> = {
  "level-01-machine-memory": [
    {
      id: "cpu-instructions",
      title: "CPU & instructions",
      blurb: "What the processor does each cycle, and how assembly talks to it.",
      items: [
        {
          slug: "inside-the-cpu",
          description:
            "What registers, the ALU and the control unit each do, and why registers are so fast and so few.",
        },
        {
          slug: "assembly-a-first-look",
          description:
            "How assembly maps onto machine code, and how to read a short function line by line, compare-and-jump included.",
        },
        {
          slug: "calls-and-returns",
          description:
            "How call and ret use the stack to jump into a function and come back, with arguments and results passed in registers.",
        },
        {
          slug: "reading-compiler-output",
          description: "How to read the assembly a C compiler produces and match each line back to the code you wrote.",
        },
      ],
    },
    {
      id: "memory-layout",
      title: "Memory layout",
      blurb: "How address space is carved up: stack, heap, and where values live.",
      items: [
        {
          slug: "the-address-space",
          description:
            "How a process's memory is laid out, from code and data up to the heap and stack, and why those two grow toward each other.",
        },
        {
          slug: "the-stack-and-the-heap",
          description:
            "How stack frames come and go with function calls, how heap memory is requested and released, and when to use each.",
        },
      ],
    },
    {
      id: "speed-and-bytes",
      title: "Speed & byte order",
      blurb: "Why caches matter, and how machines order bytes in memory.",
      items: [
        {
          slug: "caches-and-locality",
          description:
            "Why caches exist, how temporal and spatial locality make them work, and how to tell fast access patterns from slow ones.",
        },
        {
          slug: "endianness",
          description:
            "How a multi-byte value is stored as bytes, little-endian or big-endian, and why reversed bytes show up in dumps and packets.",
        },
      ],
    },
  ],

  "level-04-c-basics": [
    {
      id: "first-programs",
      title: "Your first C programs",
      blurb: "Write, compile and run C, and read what the compiler tells you.",
      items: [
        {
          slug: "hello-world",
          description: "How to write a first C program, compile it with gcc and run it, and what each line of hello world does.",
        },
        {
          slug: "variables-and-types",
          description: "How to declare variables of types like int, char and double, and why each type has a size and a range.",
        },
        {
          slug: "operators-and-expressions",
          description: "How C's arithmetic, comparison and logical operators work, including integer division and precedence.",
        },
        {
          slug: "reading-compiler-errors",
          description: "How to read gcc's errors and warnings, find the line they point to, and fix the most common mistakes.",
        },
      ],
    },
    {
      id: "control-and-functions",
      title: "Control flow and functions",
      blurb: "Decisions, loops and functions: how a C program is shaped.",
      items: [
        {
          slug: "if-else-switch",
          description: "How a C program makes decisions with if, else and switch, and how C decides what counts as true.",
        },
        {
          slug: "loops",
          description: "How while, for and do loops repeat work, and how to avoid loops that run one time too many or never stop.",
        },
        {
          slug: "functions",
          description: "How to split a program into functions that take parameters and return values, and why C passes arguments by value.",
        },
        {
          slug: "scope",
          description: "Where each name in a C program can be seen, from one block to a whole file, and what happens when names shadow each other.",
        },
      ],
    },
    {
      id: "io-and-arrays",
      title: "Input, output and arrays",
      blurb: "Talk to the user, and keep many values in a row.",
      items: [
        {
          slug: "printf-and-scanf",
          description: "How to print formatted output with printf, read input with scanf, and check that the input was actually read.",
        },
        {
          slug: "arrays-and-loops",
          description: "How to store many values in an array and process them with a loop, without stepping past its last element.",
        },
        {
          slug: "characters-and-strings",
          description: "How C stores characters as small numbers and text as arrays of chars ending in a zero byte.",
        },
        {
          slug: "project-guessing-game",
          description: "Build a number-guessing game that reads input, loops and gives hints, proving you can write a whole C program.",
          role: "project",
        },
      ],
    },
  ],
  "level-02-the-c-language": [
    {
      id: "c-memory-model",
      title: "C & the memory model",
      blurb: "How C maps onto the machine’s stack and heap.",
      items: [
        {
          slug: "memory-and-the-machine",
          description:
            "How C variables become bytes in memory regions, and how to check their sizes with sizeof instead of guessing.",
        },
        {
          slug: "stack-vs-heap",
          description:
            "Why local variables vanish when a function returns, how malloc and free manage heap memory, and how to pick between them.",
        },
      ],
    },
    {
      id: "pointers",
      title: "Pointers",
      blurb: "Addresses as values: arithmetic, indirection, and double pointers.",
      items: [
        {
          slug: "what-a-pointer-really-is",
          description:
            "What a pointer stores, how & takes an address and * reads or writes through it, and why C relies on pointers.",
        },
        {
          slug: "pointer-arithmetic",
          description:
            "Why p + 1 moves by the size of the pointed-to type, how arr[i] means *(arr + i), and where the arithmetic stops being safe.",
        },
        {
          slug: "double-pointers",
          description:
            "How an int** reaches a value through two hops, and how a function can change the caller's pointer itself.",
        },
      ],
    },
    {
      id: "data-and-allocation",
      title: "Data & allocation",
      blurb: "Structs in memory, and owning heap blocks safely.",
      items: [
        {
          slug: "structs-and-unions",
          description:
            "How structs group fields with padding between them, how unions share one block of memory, and how to predict their sizes.",
        },
        {
          slug: "dynamic-memory",
          description:
            "How to ask for heap memory with malloc and sizeof, check that it worked, and free it before it becomes a leak.",
        },
        {
          slug: "ownership",
          description:
            "How to decide which part of a program frees each block of memory, so nothing leaks and nothing is freed twice.",
        },
      ],
    },
    {
      id: "c-safety",
      title: "Safety in C",
      blurb: "What undefined behaviour really means for your programs.",
      items: [
        {
          slug: "undefined-behaviour",
          description:
            "What undefined behaviour really means, why use-after-free and buffer overruns are dangerous, and why buggy code can pass tests.",
        },
      ],
    },
    {
      id: "types-and-strings",
      title: "Types, arrays and strings",
      blurb: "How C converts between types, and what arrays and strings really are.",
      items: [
        {
          slug: "integer-promotions",
          description:
            "How C quietly converts small and mixed integer types in expressions, and the surprising results that can cause.",
        },
        {
          slug: "casts",
          description:
            "What a cast actually does: when it converts a value to a new type, and when it only changes how a pointer is used.",
        },
        {
          slug: "arrays-are-not-pointers",
          description:
            "Why an array usually turns into a pointer to its first element, and the places, like sizeof and &, where it does not.",
        },
        {
          slug: "strings",
          description:
            "How C stores text as a char array ending in a zero byte, and what goes wrong when that zero is missing.",
        },
        {
          slug: "function-pointers",
          description:
            "How to store the address of a function in a variable and call through it, as qsort and callbacks do.",
        },
      ],
    },
    {
      id: "program-structure",
      title: "How a C program is organised",
      blurb: "Where variables live and how files see each other's names.",
      items: [
        {
          slug: "storage-duration",
          description:
            "How long C objects live: automatic ones until their block ends, static ones for the whole run, allocated ones until freed.",
        },
        {
          slug: "linkage",
          description:
            "How static and extern decide whether a name is shared between source files or kept private to one.",
        },
        {
          slug: "headers",
          description:
            "How header files share declarations between .c files, and how separate compilation and linking build one program.",
        },
      ],
    },
  ],

  "level-05-c-contract": [
    {
      id: "the-rules",
      title: "What the standard promises",
      blurb: "The contract between your code and the compiler.",
      items: [
        {
          slug: "kinds-of-behaviour",
          description: "How the C standard sorts behaviour into defined, unspecified, implementation-defined and undefined, and why it matters.",
        },
        {
          slug: "undefined-behaviour-in-depth",
          description: "Why the standard leaves some operations undefined, and how compilers use that freedom to transform your code.",
        },
        {
          slug: "sequencing",
          description: "Which parts of an expression C evaluates in a fixed order and which it does not, and why i = i++ is undefined.",
        },
      ],
    },
    {
      id: "the-traps",
      title: "Where programs break",
      blurb: "The rules real programs break, and what the optimiser does when they do.",
      items: [
        {
          slug: "signed-overflow-and-shifts",
          description: "Why overflowing a signed int or shifting by too many bits is undefined, and how to write arithmetic that stays safe.",
        },
        {
          slug: "strict-aliasing",
          description: "Why reading an object through a pointer to an incompatible type is undefined, and how memcpy or char access stays legal.",
        },
        {
          slug: "lifetime",
          description: "When an object's lifetime ends, and why reading through a dangling pointer or an uninitialised variable is a real bug.",
        },
        {
          slug: "what-the-optimiser-assumes",
          description: "How the optimiser assumes your code has no undefined behaviour, and how that can delete checks you thought were there.",
        },
        {
          slug: "project-ub-hunt",
          description: "Find and fix the undefined behaviour hidden in a small program, proving you can spot what the compiler may break.",
          role: "project",
        },
      ],
    },
  ],
  "level-07-data-structures": [
    {
      id: "linear",
      title: "Lists and arrays",
      blurb: "Values in a row, and the trade-offs between keeping them packed or linked.",
      items: [
        {
          slug: "dynamic-arrays",
          description: "How an array grows by reallocating with extra room, and why doubling its capacity keeps appends fast on average.",
        },
        {
          slug: "linked-lists",
          description: "How nodes linked by pointers form a list, and when cheap inserts and removals are worth the slow lookups.",
        },
        {
          slug: "stacks-and-queues",
          description: "How stacks give last-in first-out and queues first-in first-out order, built on arrays or linked lists.",
        },
      ],
    },
    {
      id: "lookup",
      title: "Fast lookup",
      blurb: "Find a value without looking at every one.",
      items: [
        {
          slug: "hash-tables",
          description: "How a hash function turns a key into a slot, how collisions are handled, and why lookups are fast on average.",
        },
        {
          slug: "binary-search-trees",
          description: "How a binary search tree keeps keys in order for fast search, and why it slows down when it becomes unbalanced.",
        },
        {
          slug: "heaps",
          description: "How a heap stored in an array always gives you the smallest or largest item quickly, as a priority queue.",
        },
      ],
    },
    {
      id: "cost",
      title: "Cost and layout",
      blurb: "How much work a structure does, and how it sits in memory.",
      items: [
        {
          slug: "big-o",
          description: "How to describe how a program's work grows with its input using Big-O, and compare data structures by it.",
        },
        {
          slug: "cache-friendly-layout",
          description: "Why data packed together in memory is faster than data scattered behind pointers, and how to lay it out well.",
        },
        {
          slug: "project-hash-map",
          description: "Build a reusable hash map library in C that grows as it fills, proving you can design, test and measure a data structure.",
          role: "project",
        },
      ],
    },
  ],
  "level-03-systems-software": [
    {
      id: "processes",
      title: "Processes & the kernel API",
      blurb: "How a program becomes a process, and how it asks the OS for work.",
      items: [
        {
          slug: "processes-and-the-process-table",
          description:
            "What the kernel records about each process, how fork() creates a child, and how wait() reaps it so it is not left a zombie.",
        },
        {
          slug: "system-calls",
          description:
            "Why programs must trap into the kernel to do I/O, how printf ends in write(), and how to read errors with errno and strace.",
        },
        {
          slug: "context-switching",
          description:
            "How the kernel saves one process's registers and restores another's, so many programs can share one CPU.",
        },
        {
          slug: "environment-and-exit",
          description:
            "How a program receives its arguments and environment variables, and how its exit code tells the caller whether it worked.",
        },
      ],
    },
    {
      id: "ipc-signals",
      title: "IPC & signals",
      blurb: "Talking between processes, and getting interrupted safely.",
      items: [
        {
          slug: "pipes-and-inter-process-communication",
          description:
            "How pipe() and fork() let one process send data to another, and why each side must close the end it does not use.",
        },
        {
          slug: "signals",
          description:
            "What signals are, how to handle them safely with sigaction(), which ones can't be caught, and why a shell catches Ctrl-C.",
        },
      ],
    },
    {
      id: "files",
      title: "Files & descriptors",
      blurb: "File descriptors, redirection, and the Unix I/O model.",
      items: [
        {
          slug: "file-descriptors-and-redirection",
          description:
            "What file descriptors are, how dup2() redirects them, and how a shell uses that to implement >, < and |.",
        },
        {
          slug: "buffered-io",
          description:
            "Why stdio collects output in a buffer before calling write(), and when that buffering surprises you.",
        },
      ],
    },
    {
      id: "isolation",
      title: "Users, permissions and isolation",
      blurb: "Who may do what, and why one process can't touch another's memory.",
      items: [
        {
          slug: "permissions",
          description:
            "How Unix decides who can read, write or run a file, using users, groups and permission bits.",
        },
        {
          slug: "process-isolation",
          description:
            "How virtual memory gives each process its own address space, so one program cannot read another's memory.",
        },
      ],
    },
  ],
};

export function courseOutlineForLevel(
  levelId: LevelId,
): CourseOutlineSection[] | null {
  return COURSE_OUTLINES[levelId] ?? null;
}
