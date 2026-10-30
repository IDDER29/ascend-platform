"use client";

import { createContext, isValidElement, useContext, type ComponentProps, type ReactNode } from "react";
import { snippetTarget, type BookmarkLesson, type BookmarkTarget } from "@/lib/bookmarks/model";
import { SaveButton } from "./save-button";

const LessonContext = createContext<BookmarkLesson | null>(null);

/** Tells save buttons inside a lesson which lesson they belong to. */
export function LessonBookmarksProvider({ lesson, children }: { lesson: BookmarkLesson; children: ReactNode }) {
  return <LessonContext.Provider value={lesson}>{children}</LessonContext.Provider>;
}

function lessonTarget(lesson: BookmarkLesson): Omit<BookmarkTarget, "ref" | "kind" | "title" | "where" | "href"> {
  return { topic: lesson.topic, lessonKey: lesson.key };
}

function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textOf).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children);
  return "";
}

export function SaveLessonButton() {
  const lesson = useContext(LessonContext);
  if (!lesson) return null;
  return (
    <SaveButton
      look="square"
      target={{
        ...lessonTarget(lesson),
        ref: `lesson:${lesson.key}`,
        kind: "lesson",
        title: lesson.title,
        where: "Whole lesson",
        href: lesson.href,
      }}
    />
  );
}

/** A lesson's h2, with a save button for that section. */
export function SectionHeading({ children, id, className, ...props }: ComponentProps<"h2">) {
  const lesson = useContext(LessonContext);
  const title = textOf(children).trim();
  return (
    <h2 id={id} className={className} {...props}>
      {children}
      {lesson && id && title && (
        <SaveButton
          className="ml-1.5 align-middle opacity-60 transition-opacity hover:opacity-100 focus-within:opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover/section:opacity-100"
          target={{
            ...lessonTarget(lesson),
            ref: `section:${lesson.key}#${id}`,
            kind: "section",
            title,
            where: lesson.title,
            href: `${lesson.href}#${id}`,
          }}
        />
      )}
    </h2>
  );
}

/** What a code block's save button saves; null outside a lesson. */
export function useSnippetTarget(lines: string[], lang: string): BookmarkTarget | null {
  const lesson = useContext(LessonContext);
  return lesson ? snippetTarget(lesson, lines, lang) : null;
}

/** Save button for an outside resource listed beside a lesson. */
export function SaveResourceButton({ title, url, meta }: { title: string; url: string; meta: string }) {
  const lesson = useContext(LessonContext);
  return (
    <SaveButton
      className="absolute right-1.5 top-1.5 z-10"
      look="quiet"
      target={{
        ref: `resource:${url}`,
        kind: "resource",
        title,
        where: lesson ? `From ${lesson.title}` : meta,
        href: url,
        topic: null,
        lessonKey: lesson?.key ?? null,
      }}
    />
  );
}
