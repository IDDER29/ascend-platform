import { getAllLessons } from "@/lib/content/lessons";
import { LEVELS, type LevelId } from "@/lib/content/schema";

export type PathStatus = "live" | "soon";

export type PathKind = "foundation" | "role";

export type PathCourse = {
  id: string;
  title: string;
  body: string;
  /** Live curriculum level, if any */
  levelId?: LevelId;
  /** Capstone / special href when not a level */
  href?: string;
  plannedLessons?: number;
  plannedProjects?: number;
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
  courses: PathCourse[];
};

export const PATHS: PathDef[] = [
  {
    slug: "foundations",
    kind: "foundation",
    status: "live",
    eyebrow: "Foundations",
    title: "Foundations",
    pitch: "Bits, logic and how a machine makes decisions: the ground every other path stands on.",
    body: "A hands-on introduction to the ideas every real machine is built on: bits and binary, logic and gates, and the loop a processor runs. No background needed. You'll finish by building a half-adder, and every other path starts from here.",
    courses: [
      {
        id: "foundations-course",
        title: "Foundations",
        body: "Bits, binary, logic gates and the fetch-execute loop: how on and off become decisions.",
        levelId: "level-00-bits-logic",
      },
    ],
  },
  {
    slug: "python-foundations",
    kind: "foundation",
    status: "soon",
    eyebrow: "Foundations",
    title: "Python Foundations",
    pitch: "The Python you need for applied AI: the language, the tools and good project habits.",
    body: "This course is the Python on-ramp for applied AI. You'll learn language basics, tooling, and project habits in the order shown — everything you need before RAG, agents, and LLM apps, without wandering the whole Python universe first.",
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
    pitch: "How the machine runs, how C talks to it and how the OS keeps it alive, ending with a shell you write yourself.",
    body: "This path takes you through Ascend's systems curriculum. Take the courses in the order shown: how the machine runs, how C touches hardware, how the OS keeps it alive — then prove it with ShellForge. You'll learn everything you need to understand the machine end-to-end and write software that meets it.",
    requiresLabel: "Requires Foundations",
    requiresSlug: "foundations",
    courses: [
      {
        id: "machine-memory",
        title: LEVELS["level-01-machine-memory"].name,
        body: "How the machine actually runs — CPU, memory, and the address space.",
        levelId: "level-01-machine-memory",
      },
      {
        id: "the-c-language",
        title: LEVELS["level-02-the-c-language"].name,
        body: "How code touches that hardware — C as craft.",
        levelId: "level-02-the-c-language",
      },
      {
        id: "systems-software",
        title: LEVELS["level-03-systems-software"].name,
        body: "Processes, syscalls, and the OS boundary.",
        levelId: "level-03-systems-software",
      },
      {
        id: "shellforge",
        title: "ShellForge",
        body: "Capstone — prove the path with a working shell.",
        href: "/projects/shellforge",
        plannedProjects: 1,
      },
    ],
  },
  {
    slug: "linux-engineer",
    kind: "role",
    status: "soon",
    eyebrow: "Path",
    title: "Linux Engineer",
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
        body: "Build and operate a system from the ground up — projects that stick.",
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
    courses: [
      {
        id: "network-foundations",
        title: "Network foundations",
        body: "Layers, addressing, and what a packet actually is.",
        plannedLessons: 10,
        plannedProjects: 1,
      },
      {
        id: "protocols",
        title: "Core protocols",
        body: "TCP/IP, DNS, HTTP, and the tools you use to see them.",
        plannedLessons: 12,
        plannedProjects: 2,
      },
      {
        id: "network-ops",
        title: "Operating networks",
        body: "Routing intuition, debugging, and safe change.",
        plannedLessons: 8,
        plannedProjects: 2,
      },
    ],
  },
  {
    slug: "ai-engineer",
    kind: "role",
    status: "soon",
    eyebrow: "Path",
    title: "AI Engineer",
    pitch: "Build grounded AI apps that use tools: from a first API call to RAG, agents and outputs you can trust.",
    body: "This path takes you through applied LLM systems. Take the courses in order: LLM applications, RAG, agents, then contracts & decoding. You'll learn to build grounded, tool-using AI apps — from first API call to structured outputs you can trust.",
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
