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
    },
    {
      id: "memory-layout",
      title: "Memory layout",
      blurb: "How address space is carved up — stack, heap, and where values live.",
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
      blurb: "Addresses as values — arithmetic, indirection, and double pointers.",
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
    },
    {
      id: "c-safety",
      title: "Safety in C",
      blurb: "What undefined behaviour really means for your programs.",
      items: [{ slug: "undefined-behaviour" }],
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
    },
  ],
};

export function courseOutlineForLevel(
  levelId: LevelId,
): CourseOutlineSection[] | null {
  return COURSE_OUTLINES[levelId] ?? null;
}
