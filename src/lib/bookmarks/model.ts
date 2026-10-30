/**
 * Bookmarks: things a learner chose to keep — a lesson, a section of one, a
 * code snippet, an outside resource or a Practice card — each with why it
 * was saved and an optional note. Pure and client-safe.
 */
import { LEVELS, levelIds, type LevelId } from "@/lib/content/schema";
import { PRACTICE_BANK } from "@/lib/practice/bank";
import { completionKey } from "@/lib/practice/session";
import { deckSessionHref } from "@/lib/practice/coach-custom-model";
import type { PracticeItem } from "@/lib/practice/types";

export type BookmarkKind = "lesson" | "section" | "snippet" | "resource" | "card";

/** Why it was saved: come back later, keep as reference, or "I didn't get this". */
export type BookmarkReason = "later" | "reference" | "revisit";

export const REASONS: { id: BookmarkReason; label: string; hint: string }[] = [
  { id: "later", label: "Later", hint: "Come back to it" },
  { id: "reference", label: "Reference", hint: "Keep it to look up" },
  { id: "revisit", label: "Didn't get it", hint: "Revisit until it clicks" },
];

export const KINDS: { id: BookmarkKind; label: string }[] = [
  { id: "lesson", label: "Lessons" },
  { id: "section", label: "Sections" },
  { id: "snippet", label: "Snippets" },
  { id: "resource", label: "Resources" },
  { id: "card", label: "Cards" },
];

/** What a save button knows about the thing it saves. */
export type BookmarkTarget = {
  /** Unique per thing: "lesson:…", "section:…#id", "snippet:…#hash", "resource:url", "card:id". */
  ref: string;
  kind: BookmarkKind;
  title: string;
  /** Where it lives, in words: "What is a bit? › Why two states". */
  where: string;
  href: string | null;
  /** The topic (level id) it belongs to; null for outside resources. */
  topic: string | null;
  lessonKey: string | null;
  questionId?: string;
  /** The first lines of a saved snippet, or a card's question. */
  preview?: string;
};

export type Bookmark = BookmarkTarget & { reason: BookmarkReason; note: string; savedAt: string };

export type BookmarkGroup = { id: string; title: string; items: Bookmark[] };

export type BookmarksView = {
  total: number;
  counts: { reason: Record<BookmarkReason, number>; kind: Record<BookmarkKind, number> };
  /** "Didn't get it" items, newest first — shown first, apart from the shelf. */
  revisit: Bookmark[];
  /** "Later" lessons and sections to pick up again, newest first. */
  later: Bookmark[];
  /** The shelf: everything else that matches, grouped by topic, then outside resources. */
  groups: BookmarkGroup[];
  /** Practice cards the bookmarks cover: saved cards plus the cards of saved lessons, sections and snippets. */
  practiceIds: string[];
};

export type BookmarkFilters = { query: string; reason: BookmarkReason | null; kind: BookmarkKind | null };

const byNewest = (a: Bookmark, b: Bookmark) => Date.parse(b.savedAt) - Date.parse(a.savedAt);

function matches(b: Bookmark, { query, kind }: BookmarkFilters): boolean {
  if (kind && b.kind !== kind) return false;
  const q = query.trim().toLowerCase();
  return !q || [b.title, b.where, b.note].some((text) => text.toLowerCase().includes(q));
}

export function buildBookmarksView(all: Bookmark[], filters: BookmarkFilters): BookmarksView {
  const reason = Object.fromEntries(REASONS.map((r) => [r.id, all.filter((b) => b.reason === r.id).length])) as Record<
    BookmarkReason,
    number
  >;
  const kind = Object.fromEntries(KINDS.map((k) => [k.id, all.filter((b) => b.kind === k.id).length])) as Record<
    BookmarkKind,
    number
  >;
  const shown = all.filter((b) => matches(b, filters)).sort(byNewest);
  const showRevisit = filters.reason === null || filters.reason === "revisit";
  const revisit = showRevisit ? shown.filter((b) => b.reason === "revisit") : [];
  // The shelf never repeats what the revisit card already shows.
  const shelf = shown.filter((b) => b.reason !== "revisit" && (filters.reason === null || b.reason === filters.reason));

  const groups: BookmarkGroup[] = [
    ...levelIds.map((id) => ({ id, title: LEVELS[id as LevelId].name, items: shelf.filter((b) => b.topic === id) })),
    { id: "resources", title: "Outside resources", items: shelf.filter((b) => b.kind === "resource" && !b.topic) },
    {
      id: "other",
      title: "Other",
      items: shelf.filter((b) => !(b.kind === "resource" && !b.topic) && !levelIds.includes(b.topic as LevelId)),
    },
  ].filter((g) => g.items.length > 0);

  const lessonKeys = new Set(
    all.filter((b) => b.kind !== "card" && b.kind !== "resource" && b.lessonKey).map((b) => b.lessonKey!),
  );
  const practiceIds = [
    ...new Set([
      ...all.filter((b) => b.kind === "card" && b.questionId).map((b) => b.questionId!),
      ...PRACTICE_BANK.filter((q) => lessonKeys.has(completionKey(q.lessonLevel, q.lessonSlug))).map((q) => q.id),
    ]),
  ];

  return {
    total: all.length,
    counts: { reason, kind },
    revisit,
    later: all.filter((b) => b.reason === "later" && (b.kind === "lesson" || b.kind === "section")).sort(byNewest),
    groups,
    practiceIds,
  };
}

/** What a Practice card's save button saves: the question, opening as a one-card review. */
export function cardTarget(q: PracticeItem): BookmarkTarget {
  const text =
    q.kind === "flashcard" ? q.front : q.kind === "cloze" ? (q.template ?? q.templateCode?.join("\n") ?? "") : q.prompt;
  const title = text
    .replace(/\{\{blank\}\}/g, "___")
    .split("\n")[0]
    .trim();
  return {
    ref: `card:${q.id}`,
    kind: "card",
    title: title.length > 90 ? `${title.slice(0, 88)}…` : title,
    where: q.reviewLabel,
    href: deckSessionHref([q.id], "Saved card"),
    topic: q.lessonLevel,
    lessonKey: completionKey(q.lessonLevel, q.lessonSlug),
    questionId: q.id,
  };
}

export type BookmarkLesson = { key: string; title: string; href: string; topic: string };

/** A code snippet in a lesson; `lines` already decoded. Anchored at `#snippet-<hash>` on the lesson page. */
export function snippetTarget(lesson: BookmarkLesson, lines: string[], lang: string): BookmarkTarget {
  const hash = textHash(lines.join("\n"));
  const first = lines.map((l) => l.trim()).find((l) => l && !/^(\/\/|#|\/\*|\*)/.test(l)) ?? lang;
  return {
    ref: `snippet:${lesson.key}#${hash}`,
    kind: "snippet",
    title: first.length > 52 ? `${first.slice(0, 50)}…` : first,
    where: lesson.title,
    href: `${lesson.href}#snippet-${hash}`,
    topic: lesson.topic,
    lessonKey: lesson.key,
    preview: lines.slice(0, 6).join("\n"),
  };
}

/** Short, stable id for a piece of text (code snippets). */
export function textHash(text: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36);
}
