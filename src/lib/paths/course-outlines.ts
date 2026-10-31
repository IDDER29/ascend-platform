/**
 * Topic outlines for curriculum levels used on path course maps.
 * Groups flat “old curriculum” lessons into named sections (Foundations-style).
 */

import type { LevelId } from "@/lib/content/schema";
import type { PathItemRole } from "@/components/paths/path-outline-marks";

export type CourseOutlineItem = {
  slug: string;
  role?: PathItemRole;
};

export type CourseOutlineSection = {
  id: string;
  title: string;
  blurb?: string;
  items: CourseOutlineItem[];
  /** Lessons and projects planned for this section but not written yet, after its live lessons. */
  upcoming?: { id: string; title: string; project?: boolean }[];
};

/** Level → topic sections. Missing levels fall back to a flat lesson list. */
export const COURSE_OUTLINES: Partial<Record<LevelId, CourseOutlineSection[]>> = {
  "level-01-machine-memory": [
    {
      id: "cpu-instructions",
      title: "CPU & instructions",
      blurb: "What the processor does each cycle, and how assembly talks to it.",
      items: [
        { slug: "inside-the-cpu" },
        { slug: "assembly-a-first-look" },
      ],
      upcoming: [
        { id: "calls-and-returns", title: "Calls and returns in assembly" },
        { id: "reading-compiler-output", title: "Reading what the compiler wrote" },
      ],
    },
    {
      id: "memory-layout",
      title: "Memory layout",
      blurb: "How address space is carved up: stack, heap, and where values live.",
      items: [
        { slug: "the-address-space" },
        { slug: "the-stack-and-the-heap" },
      ],
    },
    {
      id: "speed-and-bytes",
      title: "Speed & byte order",
      blurb: "Why caches matter, and how machines order bytes in memory.",
      items: [
        { slug: "caches-and-locality" },
        { slug: "endianness" },
      ],
    },
    {
      id: "memory-hierarchy",
      title: "The memory hierarchy",
      blurb: "Registers, caches, RAM and storage: why there are so many kinds of memory.",
      items: [],
      upcoming: [
        { id: "the-memory-hierarchy", title: "Registers, caches, RAM and storage" },
        { id: "ram-vs-storage", title: "Why RAM forgets and storage doesn't" },
      ],
    },
  ],

  "level-02-the-c-language": [
    {
      id: "c-memory-model",
      title: "C & the memory model",
      blurb: "How C maps onto the machine’s stack and heap.",
      items: [
        { slug: "memory-and-the-machine" },
        { slug: "stack-vs-heap" },
      ],
    },
    {
      id: "pointers",
      title: "Pointers",
      blurb: "Addresses as values: arithmetic, indirection, and double pointers.",
      items: [
        { slug: "what-a-pointer-really-is" },
        { slug: "pointer-arithmetic" },
        { slug: "double-pointers" },
      ],
    },
    {
      id: "data-and-allocation",
      title: "Data & allocation",
      blurb: "Structs in memory, and owning heap blocks safely.",
      items: [
        { slug: "structs-and-unions" },
        { slug: "dynamic-memory" },
      ],
      upcoming: [{ id: "ownership", title: "Ownership: who frees what" }],
    },
    {
      id: "c-safety",
      title: "Safety in C",
      blurb: "What undefined behaviour really means for your programs.",
      items: [{ slug: "undefined-behaviour" }],
    },
    {
      id: "types-and-strings",
      title: "Types, arrays and strings",
      blurb: "How C converts between types, and what arrays and strings really are.",
      items: [],
      upcoming: [
        { id: "integer-promotions", title: "Integer promotions and conversions" },
        { id: "casts", title: "Casts and what they really do" },
        { id: "arrays-are-not-pointers", title: "Arrays are not pointers" },
        { id: "strings", title: "Strings and the terminating zero" },
        { id: "function-pointers", title: "Function pointers" },
      ],
    },
    {
      id: "program-structure",
      title: "How a C program is organised",
      blurb: "Where variables live and how files see each other's names.",
      items: [],
      upcoming: [
        { id: "storage-duration", title: "Storage duration: automatic, static and allocated" },
        { id: "linkage", title: "Linkage: static and extern" },
        { id: "headers", title: "Header files and separate compilation" },
      ],
    },
  ],

  "level-03-systems-software": [
    {
      id: "processes",
      title: "Processes & the kernel API",
      blurb: "How a program becomes a process, and how it asks the OS for work.",
      items: [
        { slug: "processes-and-the-process-table" },
        { slug: "system-calls" },
      ],
      upcoming: [
        { id: "context-switching", title: "Context switching: how the OS takes turns" },
        { id: "environment-and-exit", title: "Arguments, environment and exit codes" },
      ],
    },
    {
      id: "ipc-signals",
      title: "IPC & signals",
      blurb: "Talking between processes, and getting interrupted safely.",
      items: [
        { slug: "pipes-and-inter-process-communication" },
        { slug: "signals" },
      ],
    },
    {
      id: "files",
      title: "Files & descriptors",
      blurb: "File descriptors, redirection, and the Unix I/O model.",
      items: [{ slug: "file-descriptors-and-redirection" }],
      upcoming: [{ id: "buffered-io", title: "Buffered I/O: stdio and write" }],
    },
    {
      id: "isolation",
      title: "Users, permissions and isolation",
      blurb: "Who may do what, and why one process can't touch another's memory.",
      items: [],
      upcoming: [
        { id: "permissions", title: "Users, groups and permissions" },
        { id: "process-isolation", title: "Why one process can't read another's memory" },
      ],
    },
  ],
};

export function courseOutlineForLevel(
  levelId: LevelId,
): CourseOutlineSection[] | null {
  return COURSE_OUTLINES[levelId] ?? null;
}
