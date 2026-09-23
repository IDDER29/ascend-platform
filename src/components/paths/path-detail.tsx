import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  courseLessonCount,
  courseOpenHref,
  courseProjectCount,
  type PathCourse,
  type PathDef,
} from "@/lib/paths/catalog";
import { getAllLessons } from "@/lib/content/lessons";
import { cn } from "@/lib/cn";

function CourseCard({
  course,
  live,
}: {
  course: PathCourse;
  live: boolean;
}) {
  const openHref = live ? courseOpenHref(course) : null;
  const lessons = courseLessonCount(course);
  const projects = courseProjectCount(course);
  const meta: string[] = [];
  if (lessons != null) meta.push(`${lessons} lesson${lessons === 1 ? "" : "s"}`);
  if (projects != null) meta.push(`${projects} project${projects === 1 ? "" : "s"}`);

  const lessonRows =
    live && course.levelId
      ? getAllLessons()
          .filter((l) => l.meta.level === course.levelId)
          .sort((a, b) => a.meta.order - b.meta.order)
      : [];

  return (
    <article className="rounded-2xl border border-card-border bg-paper p-5 sm:p-6 dark:bg-elevated">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-xl font-extrabold tracking-tight text-ink">
            {course.title}
          </h3>
          {meta.length > 0 ? (
            <p className="mt-1 font-mono text-[11px] text-ink-fainter">{meta.join(" · ")}</p>
          ) : null}
          <p className="mt-2 max-w-[54ch] text-[14px] leading-relaxed text-ink-secondary">
            {course.body}
          </p>
        </div>
        {openHref ? (
          <Button href={openHref} variant="secondary" size="sm">
            Open course
          </Button>
        ) : (
          <span className="font-mono text-[11px] uppercase tracking-wide text-ink-fainter">
            Coming soon
          </span>
        )}
      </div>

      {lessonRows.length > 0 ? (
        <ul className="mt-4 flex flex-col gap-1 border-t border-divider pt-3">
          {lessonRows.map((lesson) => (
            <li key={lesson.meta.slug}>
              <Link
                href={`/curriculum/${lesson.meta.level}/${lesson.meta.slug}`}
                className="flex items-center gap-3 rounded-xl px-2 py-2 text-[13.5px] text-ink transition-colors hover:bg-xp-bg"
              >
                <span className="font-mono text-[11px] text-ink-fainter">
                  {String(lesson.meta.order).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1 truncate">{lesson.meta.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

export function PathDetail({
  path,
  selectHref,
}: {
  path: PathDef;
  selectHref: string | null;
}) {
  const live = path.status === "live";

  return (
    <div className="flex flex-col gap-8">
      <header className="max-w-[720px]">
        <Link
          href="/paths"
          className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-fainter hover:text-ink-secondary"
        >
          All paths
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-fainter">
            {path.eyebrow}
          </span>
          {!live ? (
            <span className="rounded-md bg-xp-bg px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-xp-text">
              Coming soon
            </span>
          ) : null}
        </div>
        <h1 className="mt-2 font-display text-[32px] font-extrabold tracking-[-0.032em] text-ink sm:text-[36px]">
          {path.title}
        </h1>
        <p className="mt-3 text-[16px] leading-relaxed text-ink-secondary">{path.body}</p>
        {path.requiresLabel && path.requiresSlug ? (
          <p className="mt-3 text-[13px] text-ink-fainter">
            {path.requiresLabel}.{" "}
            <Link
              href={`/paths/${path.requiresSlug}`}
              className="font-medium text-brand-violet hover:underline"
            >
              View prerequisite
            </Link>
          </p>
        ) : null}
        <div className="mt-6">
          {selectHref ? (
            <Button href={selectHref} variant="primary" size="md">
              Select path
            </Button>
          ) : (
            <Button variant="secondary" size="md" disabled>
              Coming soon
            </Button>
          )}
        </div>
      </header>

      <section className="flex flex-col gap-4">
        <h2
          className={cn(
            "font-mono text-[12px] uppercase tracking-[0.14em] text-ink-fainter",
          )}
        >
          Courses
        </h2>
        <div className="flex flex-col gap-4">
          {path.courses.map((course) => (
            <CourseCard key={course.id} course={course} live={live} />
          ))}
        </div>
      </section>
    </div>
  );
}
