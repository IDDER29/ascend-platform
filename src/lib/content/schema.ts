import { z } from "zod";

export const levelIds = [
  "level-00-bits-logic",
  "level-01-machine-memory",
  "level-02-the-c-language",
  "level-03-systems-software",
] as const;

export const LevelIdSchema = z.enum(levelIds);
export type LevelId = z.infer<typeof LevelIdSchema>;

export const KnowledgeCheckItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
  jumpToId: z.string(),
  jumpToLabel: z.string(),
  jumpToDetail: z.string().optional(),
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
  { name: string; short: string; totalConcepts: number; timeLabel: string; locked?: boolean }
> = {
  "level-00-bits-logic": {
    name: "Bits & Logic",
    short: "The Groundwork",
    totalConcepts: 5,
    timeLabel: "~35 min",
  },
  "level-01-machine-memory": {
    name: "Machine & Memory",
    short: "The Machine",
    totalConcepts: 6,
    timeLabel: "~47 min",
  },
  "level-02-the-c-language": {
    name: "The C Language",
    short: "The Craft",
    totalConcepts: 8,
    timeLabel: "~62 min",
  },
  "level-03-systems-software": {
    name: "Systems & Software",
    short: "The Architect",
    totalConcepts: 6,
    timeLabel: "~7 hrs",
    locked: true,
  },
};
