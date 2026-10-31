import { z } from "zod";

export const levelIds = [
  "level-00-bits-logic",
  "level-01-machine-memory",
  "level-04-c-basics",
  "level-02-the-c-language",
  "level-05-c-contract",
  "level-06-c-tools",
  "level-07-data-structures",
  "level-03-systems-software",
  "level-08-vm-threads-files",
  "level-09-memory-allocator",
] as const;

export const LevelIdSchema = z.enum(levelIds);
export type LevelId = z.infer<typeof LevelIdSchema>;

export const KnowledgeCheckItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
  jumpToId: z.string(),
  jumpToLabel: z.string(),
  jumpToDetail: z.string().optional(),
  /** Hand-picked reading or viewing for this question; without it, the lesson's own resources are matched to it. */
  resources: z
    .array(
      z.object({
        title: z.string(),
        type: z.enum(["video", "doc", "pdf"]),
        meta: z.string().optional(),
        url: z.string().url(),
      }),
    )
    .optional(),
});
export type KnowledgeCheckItem = z.infer<typeof KnowledgeCheckItemSchema>;

export const PrimerItemSchema = z.object({
  title: z.string(),
  type: z.enum(["doc", "video"]),
  meta: z.string(),
  essential: z.boolean(),
  url: z.string().url().optional(),
});
export type PrimerItem = z.infer<typeof PrimerItemSchema>;

export const AssignmentSchema = z.object({
  instruction: z.string(),
  resourceName: z.string(),
  resourceType: z.enum(["video", "doc", "site", "pdf"]),
  resourceUrl: z.string().url().optional(),
});
export type Assignment = z.infer<typeof AssignmentSchema>;

export const AdditionalResourceSchema = z.object({
  title: z.string(),
  type: z.enum(["video", "doc", "pdf"]),
  meta: z.string(),
  duration: z.string().optional(),
  url: z.string().url().optional(),
});
export type AdditionalResource = z.infer<typeof AdditionalResourceSchema>;

export const LessonFrontmatterSchema = z.object({
  title: z.string(),
  level: LevelIdSchema,
  slug: z.string(),
  order: z.number().int().positive(),
  timeMin: z.number().int().positive(),
  learningOutcomes: z.array(z.string()).min(1),
  primer: z.array(PrimerItemSchema).default([]),
  knowledgeCheck: z.array(KnowledgeCheckItemSchema).min(1),
  assignment: AssignmentSchema,
  whyThisMatters: z.string(),
  additionalResources: z.array(AdditionalResourceSchema),
});
export type LessonFrontmatter = z.infer<typeof LessonFrontmatterSchema>;

export interface Lesson {
  meta: LessonFrontmatter;
  body: string;
}

export const LEVELS: Record<
  LevelId,
  { name: string; short: string; totalConcepts: number; timeLabel: string }
> = {
  "level-00-bits-logic": {
    name: "Bits & Logic",
    short: "The Groundwork",
    totalConcepts: 112,
    timeLabel: "~24 hr",
  },
  "level-01-machine-memory": {
    name: "Machine & Memory",
    short: "The Machine",
    totalConcepts: 8,
    timeLabel: "~67 min",
  },
  "level-04-c-basics": {
    name: "C Basics",
    short: "The First Programs",
    totalConcepts: 12,
    timeLabel: "~2.5 hr",
  },
  "level-02-the-c-language": {
    name: "The C Language",
    short: "The Craft",
    totalConcepts: 17,
    timeLabel: "~2.5 hr",
  },
  "level-05-c-contract": {
    name: "The C Contract",
    short: "The Fine Print",
    totalConcepts: 8,
    timeLabel: "~2 hr",
  },
  "level-06-c-tools": {
    name: "Tools",
    short: "The Workshop",
    totalConcepts: 11,
    timeLabel: "~2 hr",
  },
  "level-07-data-structures": {
    name: "Data Structures in C",
    short: "The Toolbox",
    totalConcepts: 9,
    timeLabel: "~2.5 hr",
  },
  "level-03-systems-software": {
    name: "Systems & Software",
    short: "The Architect",
    totalConcepts: 10,
    timeLabel: "~1 hr 45 min",
  },
  "level-08-vm-threads-files": {
    name: "Virtual Memory, Threads & Files",
    short: "The Engine Room",
    totalConcepts: 14,
    timeLabel: "~3 hr",
  },
  "level-09-memory-allocator": {
    name: "Your own malloc",
    short: "The Capstone",
    totalConcepts: 1,
    timeLabel: "~1 hr",
  },
};
