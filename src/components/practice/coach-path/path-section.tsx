import Link from "next/link";
import type {
  CoachPathLesson,
  CoachPathLessonStatus,
  CoachPathSection,
} from "@/lib/practice/coach-path-model";
import { StrengthBar } from "./strength-bar";

const BADGES: Partial<Record<CoachPathLessonStatus, { label: string; className: string }>> = {
  "needs-work": {
    label: "Needs work",
    className: "bg-[var(--coach-tint-orange-bg)] text-[var(--coach-tint-orange-ink)]",
  },
  "not-started": {
    label: "Not started",
    className: "bg-[var(--coach-tint-neutral-bg)] text-[var(--coach-ink-secondary)]",
  },
  locked: {
    label: "Locked",
    className: "bg-[var(--coach-tint-neutral-bg)] text-[var(--coach-ink-secondary)]",
  },
};

function cards(n: number): string {
  return `${n} ${n === 1 ? "card" : "cards"}`;
}

function lessonMeta(lesson: CoachPathLesson): string {
  if (lesson.cardCount === 0) return "No cards yet";
  if (lesson.status === "locked") return `${cards(lesson.cardCount)} · finish the lesson to unlock`;
  if (lesson.status === "not-started") return `${cards(lesson.cardCount)} · none seen yet`;
  return `${cards(lesson.cardCount)} · ${lesson.dueToday > 0 ? `${lesson.dueToday} due today` : "nothing due today"}`;
}

function LessonRow({ lesson }: { lesson: CoachPathLesson }) {
  const open = lesson.status !== "locked" && lesson.status !== "not-started";
  const badge = BADGES[lesson.status];
  return (
    <li
      className={`flex flex-wrap items-center gap-3 rounded-2xl border-2 bg-[var(--coach-surface)] px-5 py-[18px] @2xl:flex-nowrap @2xl:gap-5 ${
        open ? "border-[var(--coach-border)]" : "border-dashed border-[var(--coach-border-strong)]"
      }`}
    >
      <span
        className={`flex size-11 shrink-0 items-center justify-center rounded-full font-bold ${
          open
            ? "bg-[var(--coach-mark-bg)] text-[var(--coach-mark-ink)]"
            : "border-2 border-[var(--coach-border-strong)] text-[var(--coach-ink-secondary)]"
        }`}
      >
        {lesson.number}
      </span>
      <div className="flex min-w-0 flex-[1_1_calc(100%-68px)] flex-col gap-1 @2xl:flex-1">
        <span className="flex flex-wrap items-center gap-2.5">
          <span className="text-[17px] font-semibold">{lesson.title}</span>
          {badge ? (
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${badge.className}`}>
              {badge.label}
            </span>
          ) : null}
        </span>
        <span className="text-[13px] text-[var(--coach-ink-secondary)]">{lessonMeta(lesson)}</span>
      </div>
      {open ? (
        <StrengthBar strength={lesson.strength} className="order-3 h-2.5 w-full @2xl:order-none @2xl:w-[180px] @2xl:shrink-0" />
      ) : null}
      <div className="order-4 flex w-full gap-3 @2xl:order-none @2xl:w-auto @2xl:shrink-0">
        {lesson.status === "locked" ? (
          lesson.lessonHref ? (
            <Link
              href={lesson.lessonHref}
              className="flex h-11 flex-1 items-center justify-center rounded-xl bg-[var(--coach-hero-bg)] px-[18px] text-sm font-semibold text-[var(--coach-hero-ink)] no-underline @2xl:flex-none"
            >
              Start lesson
            </Link>
          ) : null
        ) : (
          <>
            {lesson.practiceHref ? (
              <Link
                href={lesson.practiceHref}
                className={`flex h-11 flex-1 items-center justify-center rounded-xl px-4 text-sm font-semibold no-underline @2xl:flex-none ${
                  open
                    ? "border-2 border-[var(--coach-border-strong)] text-[var(--coach-ink)]"
                    : "bg-[var(--coach-hero-bg)] text-[var(--coach-hero-ink)]"
                }`}
              >
                {open ? "Practice" : "Start practicing"}
              </Link>
            ) : null}
            {lesson.lessonHref ? (
              <Link
                href={lesson.lessonHref}
                className="flex h-11 items-center justify-center px-1 text-sm font-semibold text-[var(--coach-ink)] no-underline"
              >
                Open lesson
              </Link>
            ) : null}
          </>
        )}
      </div>
    </li>
  );
}

export function PathSection({ section }: { section: CoachPathSection }) {
  const headingId = `branch-${section.id}`;
  const lessons = section.lessons.length;
  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-3">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
        <h2 id={headingId} className="m-0 font-display text-2xl font-bold">
          {section.title}{" "}
          <span className="font-sans text-sm font-normal text-[var(--coach-ink-muted)]">
            · {lessons} {lessons === 1 ? "lesson" : "lessons"} · {cards(section.cardCount)}
          </span>
        </h2>
        {section.practiceHref ? (
          <Link
            href={section.practiceHref}
            className="flex h-11 items-center text-sm font-semibold text-[var(--coach-blue)] no-underline"
          >
            Practice this branch
          </Link>
        ) : null}
      </div>
      <ol className="@container m-0 flex list-none flex-col gap-3 p-0">
        {section.lessons.map((lesson) => (
          <LessonRow key={lesson.key} lesson={lesson} />
        ))}
      </ol>
    </section>
  );
}
