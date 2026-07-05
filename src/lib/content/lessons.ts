import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  type Lesson,
  type LevelId,
  LessonFrontmatterSchema,
  levelIds,
} from "./schema";

const CONTENT_DIR = path.join(process.cwd(), "content", "curriculum");

interface LessonRef {
  level: LevelId;
  slug: string;
  filePath: string;
}

function listLessonRefs(): LessonRef[] {
  const refs: LessonRef[] = [];
  for (const level of levelIds) {
    const dir = path.join(CONTENT_DIR, level);
    if (!fs.existsSync(dir)) continue;
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith(".mdx")) continue;
      refs.push({
        level,
        slug: file.replace(/\.mdx$/, ""),
        filePath: path.join(dir, file),
      });
    }
  }
  return refs;
}

function readLesson(filePath: string): Lesson {
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const meta = LessonFrontmatterSchema.parse(data);
  return { meta, body: content };
}

export function getAllLessons(): Lesson[] {
  return listLessonRefs()
    .map((ref) => readLesson(ref.filePath))
    .sort((a, b) => {
      if (a.meta.level !== b.meta.level) {
        return levelIds.indexOf(a.meta.level) - levelIds.indexOf(b.meta.level);
      }
      return a.meta.order - b.meta.order;
    });
}

export function getLesson(level: string, slug: string): Lesson | null {
  const ref = listLessonRefs().find(
    (r) => r.level === level && r.slug === slug,
  );
  if (!ref) return null;
  return readLesson(ref.filePath);
}

interface LessonNavItem {
  href: string;
  title: string;
}

/**
 * Prev/next across the whole curriculum, not just within one level: the last
 * lesson of a level points to the first lesson of the next level, and vice
 * versa. Returns null at the very start/end of the curriculum (there's no
 * lesson before Level 00 #1, and this pilot doesn't yet have a lesson after
 * Level 03's last one -- that slot is the Shellforge project, out of scope).
 */
export function getLessonNavigation(
  level: LevelId,
  order: number,
): { prev: LessonNavItem | null; next: LessonNavItem | null } {
  const all = getAllLessons();
  const index = all.findIndex((l) => l.meta.level === level && l.meta.order === order);
  if (index === -1) return { prev: null, next: null };

  const toNavItem = (lesson: Lesson | undefined): LessonNavItem | null =>
    lesson ? { href: `/curriculum/${lesson.meta.level}/${lesson.meta.slug}`, title: lesson.meta.title } : null;

  return {
    prev: toNavItem(all[index - 1]),
    next: toNavItem(all[index + 1]),
  };
}

export function getAllLessonParams(): { level: string; slug: string }[] {
  return listLessonRefs().map((r) => ({ level: r.level, slug: r.slug }));
}
