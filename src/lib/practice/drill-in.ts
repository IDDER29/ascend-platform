import {
  completionKey,
  questionsForScope,
} from "@/lib/practice/session";
import {
  practiceSectionForPath,
  practiceTreeForPath,
} from "@/lib/practice/tree";

export type PracticePathDrillIn = {
  pathSlug: string;
  title: string;
  sections: {
    id: string;
    title: string;
    blurb?: string;
    lessonCount: number;
    questionCount: number;
  }[];
};

export type PracticeSectionDrillIn = {
  pathSlug: string;
  pathTitle: string;
  sectionId: string;
  title: string;
  blurb?: string;
  questionCount: number;
  lessons: {
    key: string;
    level: string;
    slug: string;
    title: string;
    questionCount: number;
  }[];
};

export function practicePathDrillIn(
  completedKeys: Set<string>,
  pathSlug: string,
): PracticePathDrillIn | null {
  const path = practiceTreeForPath(pathSlug);
  if (!path) return null;

  return {
    pathSlug,
    title: path.title,
    sections: path.sections.map((section) => ({
      id: section.id,
      title: section.title,
      blurb: section.blurb,
      lessonCount: section.lessons.length,
      questionCount: questionsForScope(completedKeys, {
        type: "section",
        pathSlug,
        sectionId: section.id,
      }).length,
    })),
  };
}

export function practiceSectionDrillIn(
  completedKeys: Set<string>,
  pathSlug: string,
  sectionId: string,
): PracticeSectionDrillIn | null {
  const path = practiceTreeForPath(pathSlug);
  const section = practiceSectionForPath(pathSlug, sectionId);
  if (!path || !section) return null;

  const questions = questionsForScope(completedKeys, {
    type: "section",
    pathSlug,
    sectionId,
  });

  return {
    pathSlug,
    pathTitle: path.title,
    sectionId,
    title: section.title,
    blurb: section.blurb,
    questionCount: questions.length,
    lessons: section.lessons.map((lesson) => ({
      ...lesson,
      questionCount: questions.filter(
        (question) =>
          completionKey(question.lessonLevel, question.lessonSlug) ===
          lesson.key,
      ).length,
    })),
  };
}
