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
      ],
      upcoming: [
        {
          id: "calls-and-returns",
          title: "Calls and returns in assembly",
          description:
            "How call and ret use the stack to jump into a function and come back, with arguments and results passed in registers.",
        },
        {
          id: "reading-compiler-output",
          title: "Reading what the compiler wrote",
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
    {
      id: "memory-hierarchy",
      title: "The memory hierarchy",
      blurb: "Registers, caches, RAM and storage: why there are so many kinds of memory.",
      items: [],
      upcoming: [
        {
          id: "the-memory-hierarchy",
          title: "Registers, caches, RAM and storage",
          description:
            "Why computers use registers, caches, RAM and storage together, trading size for speed at each step.",
        },
        {
          id: "ram-vs-storage",
          title: "Why RAM forgets and storage doesn't",
          description:
            "Why RAM loses its contents when the power goes off while SSDs and disks keep theirs, and what each is used for.",
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
      ],
      upcoming: [
        {
          id: "ownership",
          title: "Ownership: who frees what",
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
      items: [],
      upcoming: [
        {
          id: "integer-promotions",
          title: "Integer promotions and conversions",
          description:
            "How C quietly converts small and mixed integer types in expressions, and the surprising results that can cause.",
        },
        {
          id: "casts",
          title: "Casts and what they really do",
          description:
            "What a cast actually does: when it converts a value to a new type, and when it only changes how a pointer is used.",
        },
        {
          id: "arrays-are-not-pointers",
          title: "Arrays are not pointers",
          description:
            "Why an array usually turns into a pointer to its first element, and the places, like sizeof and &, where it does not.",
        },
        {
          id: "strings",
          title: "Strings and the terminating zero",
          description:
            "How C stores text as a char array ending in a zero byte, and what goes wrong when that zero is missing.",
        },
        {
          id: "function-pointers",
          title: "Function pointers",
          description:
            "How to store the address of a function in a variable and call through it, as qsort and callbacks do.",
        },
      ],
    },
    {
      id: "program-structure",
      title: "How a C program is organised",
      blurb: "Where variables live and how files see each other's names.",
      items: [],
      upcoming: [
        {
          id: "storage-duration",
          title: "Storage duration: automatic, static and allocated",
          description:
            "How long C objects live: automatic ones until their block ends, static ones for the whole run, allocated ones until freed.",
        },
        {
          id: "linkage",
          title: "Linkage: static and extern",
          description:
            "How static and extern decide whether a name is shared between source files or kept private to one.",
        },
        {
          id: "headers",
          title: "Header files and separate compilation",
          description:
            "How header files share declarations between .c files, and how separate compilation and linking build one program.",
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
      ],
      upcoming: [
        {
          id: "context-switching",
          title: "Context switching: how the OS takes turns",
          description:
            "How the kernel saves one process's registers and restores another's, so many programs can share one CPU.",
        },
        {
          id: "environment-and-exit",
          title: "Arguments, environment and exit codes",
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
      ],
      upcoming: [
        {
          id: "buffered-io",
          title: "Buffered I/O: stdio and write",
          description:
            "Why stdio collects output in a buffer before calling write(), and when that buffering surprises you.",
        },
      ],
    },
    {
      id: "isolation",
      title: "Users, permissions and isolation",
      blurb: "Who may do what, and why one process can't touch another's memory.",
      items: [],
      upcoming: [
        {
          id: "permissions",
          title: "Users, groups and permissions",
          description: "How Unix decides who can read, write or run a file, using users, groups and permission bits.",
        },
        {
          id: "process-isolation",
          title: "Why one process can't read another's memory",
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
