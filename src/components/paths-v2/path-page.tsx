import Link from "next/link";
import { Check, CircuitBoard, FileText } from "lucide-react";
import { CrestPatch } from "@/components/achievements/emblems";
import { BadgeMark } from "@/components/achievements/marks";
import type { BadgeView } from "@/lib/achievements/achievements-model";
import { leavePathV2Action } from "@/lib/paths/actions";
import { PRACTICE_PATH_TITLES } from "@/lib/practice/path-map";
import { practiceSessionHref } from "@/lib/practice/routes";
import { durationLabel, type PathCourse, type PathItem, type PathView } from "@/lib/paths/paths-v2-model";
import { LessonMemory } from "./lesson-memory";
import { CARD, JoinButton, PathGlyph, pathMeta, TopicBar } from "./path-parts";

/** Practice has a desk for this path (Foundations, Systems Programmer). */
const practicePathSlugForPath = (slug: string) => (slug in PRACTICE_PATH_TITLES ? slug : null);

const CAPSTONE: Record<NonNullable<PathCourse["capstone"]>, string> = {
  "not-started": "After the lessons before it",
  ready: "Ready to build",
  shipped: "Shipped",
};

function Hero({ path }: { path: PathView }) {
  return (
    <section
      aria-labelledby="path-title"
      className="flex flex-col gap-5 rounded-[20px] bg-[var(--coach-hero-bg)] p-6 text-[var(--coach-hero-ink)] sm:p-8"
    >
      <div className="flex items-start gap-4">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-[var(--coach-lime)] text-[var(--coach-lime-ink)]">
          <PathGlyph slug={path.slug} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1
              id="path-title"
              className="m-0 font-display text-[28px] font-extrabold leading-tight tracking-[-0.025em] sm:text-[34px]"
            >
              {path.title}
            </h1>
            {path.finished ? (
              <span className="rounded-full bg-[var(--coach-lime)] px-2.5 py-0.5 text-[12px] font-semibold text-[var(--coach-lime-ink)]">
                Finished
              </span>
            ) : path.active ? (
              <span className="rounded-full bg-[var(--coach-lime)] px-2.5 py-0.5 text-[12px] font-semibold text-[var(--coach-lime-ink)]">
                Active
              </span>
            ) : path.joined ? (
              <span className="rounded-full border-2 border-[var(--coach-hero-track)] px-2.5 py-0.5 text-[12px] font-semibold">
                Joined
              </span>
            ) : path.soon ? (
              <span className="rounded-full border-2 border-[var(--coach-hero-track)] px-2.5 py-0.5 text-[12px] font-semibold text-[var(--coach-hero-muted)]">
                Coming soon
              </span>
            ) : null}
          </div>
          <p className="m-0 mt-1 text-[13.5px] text-[var(--coach-hero-muted)]">{pathMeta(path)}</p>
        </div>
      </div>
      <p className="m-0 max-w-[68ch] text-[15px] leading-relaxed text-[var(--coach-hero-muted)] [text-wrap:pretty]">
        {path.body}
      </p>
      {!path.soon && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2.5">
            {path.joined && path.next ? (
              <Link
                href={path.next.href}
                className="inline-flex h-11 max-w-full items-center rounded-xl bg-[var(--coach-lime)] px-5 text-[14.5px] font-bold text-[var(--coach-lime-ink)] no-underline shadow-[0_4px_0_var(--coach-lime-shadow)]"
              >
                <span className="truncate">
                  {path.lessons.done === 0 ? "Start" : "Continue"}: {path.next.title}
                </span>
              </Link>
            ) : !path.joined ? (
              <JoinButton
                slug={path.slug}
                className="inline-flex h-11 items-center rounded-xl bg-[var(--coach-lime)] px-5 text-[14.5px] font-bold text-[var(--coach-lime-ink)] shadow-[0_4px_0_var(--coach-lime-shadow)]"
              />
            ) : null}
            {/* Once some of its lessons are done, its Practice cards are worth a review. */}
            {path.lessons.done > 0 && practicePathSlugForPath(path.slug) && (
              <Link
                href={practiceSessionHref({ scope: "path", path: path.slug })}
                className="inline-flex h-11 items-center rounded-xl border-2 border-[var(--coach-hero-track)] px-4 text-[14px] font-semibold text-[var(--coach-hero-ink)] no-underline"
              >
                Review its cards
              </Link>
            )}
          </div>
          {path.finished && (
            <span className="text-[13.5px] text-[var(--coach-hero-muted)]">
              Every lesson done{path.courses.some((c) => c.kind === "capstone") ? " and the capstone shipped" : ""}.
            </span>
          )}
        </div>
      )}
    </section>
  );
}

function ItemRow({ item }: { item: PathItem }) {
  const Icon = item.project ? CircuitBoard : FileText;
  return (
    <li>
      <Link
        href={item.href}
        className={`-mx-2 flex items-center gap-3 rounded-xl px-2 py-2 no-underline hover:bg-[var(--coach-tint-neutral-bg)] ${
          item.current ? "bg-[var(--coach-tint-lime-bg)] hover:bg-[var(--coach-tint-lime-bg)]" : ""
        }`}
      >
        <span
          aria-hidden
          className={`flex size-7 shrink-0 items-center justify-center rounded-lg ${
            item.done
              ? "bg-[var(--coach-ink)] text-[var(--coach-surface)]"
              : "border-2 border-[var(--coach-border)] text-[var(--coach-ink-muted)]"
          }`}
        >
          {item.done ? <Check size={14} strokeWidth={3} /> : <Icon size={14} strokeWidth={2.2} />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[14.5px] font-semibold leading-snug text-[var(--coach-ink)]">
            {item.title}
            {item.current && (
              <span className="ml-2 text-[12.5px] font-medium text-[var(--coach-ink-secondary)]">Up next</span>
            )}
          </span>
          <span className="block text-[12.5px] text-[var(--coach-ink-muted)]">
            {item.project ? "Project" : "Lesson"} · {item.timeMin} min{item.done ? " · done" : ""}
          </span>
        </span>
        <LessonMemory lessonKey={item.key} />
      </Link>
    </li>
  );
}

function CourseCard({ course, index }: { course: PathCourse; index: number }) {
  if (course.kind === "capstone") {
    return (
      <section className={`${CARD} flex flex-col gap-2 p-5`} aria-labelledby={`course-${course.id}`}>
        <div className="flex items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[var(--coach-hero-bg)] text-[var(--coach-lime)]">
            <CircuitBoard size={20} strokeWidth={2.2} aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <h2 id={`course-${course.id}`} className="m-0 text-[17px] font-bold">
              {course.title}
            </h2>
            <p className="m-0 text-[13px] text-[var(--coach-ink-muted)]">Capstone · {CAPSTONE[course.capstone!]}</p>
          </div>
          {course.href && (
            <Link
              href={course.href}
              className="text-[13.5px] font-semibold text-[var(--coach-ink)] underline underline-offset-2"
            >
              Open {course.title}
            </Link>
          )}
        </div>
        <p className="m-0 text-[14px] leading-relaxed text-[var(--coach-ink-secondary)]">{course.body}</p>
      </section>
    );
  }
  if (course.kind === "planned") {
    return (
      <section
        className="flex flex-col gap-1 rounded-[20px] border-2 border-dashed border-[var(--coach-border)] p-5"
        aria-labelledby={`course-${course.id}`}
      >
        <h2 id={`course-${course.id}`} className="m-0 text-[16px] font-bold text-[var(--coach-ink-secondary)]">
          {index + 1}. {course.title}
        </h2>
        <p className="m-0 text-[14px] leading-relaxed text-[var(--coach-ink-muted)]">{course.body}</p>
        {course.planned && (course.planned.lessons > 0 || course.planned.projects > 0) && (
          <p className="m-0 text-[12.5px] text-[var(--coach-ink-muted)]">
            Planned:{" "}
            {[
              course.planned.lessons > 0 ? `${course.planned.lessons} lessons` : null,
              course.planned.projects > 0
                ? `${course.planned.projects} ${course.planned.projects === 1 ? "project" : "projects"}`
                : null,
            ]
              .filter(Boolean)
              .join(", ")}
          </p>
        )}
      </section>
    );
  }
  return (
    <section
      aria-labelledby={`course-${course.id}`}
      className={`${CARD} flex flex-col gap-4 p-5 sm:p-6 ${course.current ? "border-[var(--coach-ink)]" : ""}`}
    >
      <div className="flex items-start gap-3.5">
        {course.crest && <CrestPatch crest={course.crest} earned={course.finished} size="sm" onDark={false} />}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 id={`course-${course.id}`} className="m-0 text-[19px] font-bold leading-tight">
              {course.title}
            </h2>
            {course.current && (
              <span className="rounded-full bg-[var(--coach-lime)] px-2 py-0.5 text-[11.5px] font-semibold text-[var(--coach-lime-ink)]">
                You&apos;re here
              </span>
            )}
          </div>
          <p className="m-0 mt-0.5 text-[13px] tabular-nums text-[var(--coach-ink-muted)]">
            {course.finished ? "Finished · " : ""}
            {course.done} of {course.total} done · {durationLabel(course.minutes)}
          </p>
        </div>
      </div>
      <p className="m-0 text-[14px] leading-relaxed text-[var(--coach-ink-secondary)]">{course.body}</p>
      <div className="flex flex-col gap-4">
        {course.sections.map((s) => (
          <div key={s.id} className="flex flex-col gap-1">
            <h3 className="m-0 flex items-baseline justify-between gap-3 text-[14.5px] font-bold">
              {s.title}
              <span className="text-[12px] font-medium tabular-nums text-[var(--coach-ink-muted)]">
                {s.done}/{s.items.length}
              </span>
            </h3>
            {s.blurb && <p className="m-0 text-[13px] leading-snug text-[var(--coach-ink-muted)]">{s.blurb}</p>}
            <ul className="m-0 mt-1 flex list-none flex-col gap-0.5 p-0">
              {s.items.map((item) => (
                <ItemRow key={item.key} item={item} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function Earns({ badges }: { badges: BadgeView[] }) {
  if (badges.length === 0) return null;
  return (
    <section aria-labelledby="earns-title" className={`${CARD} flex flex-col gap-3 p-5`}>
      <h2 id="earns-title" className="m-0 text-[16px] font-bold">
        What it earns you
      </h2>
      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {badges.map((b) => (
          <li key={b.id} className="flex items-center gap-3">
            <BadgeMark badge={b} />
            <span className="min-w-0 flex-1">
              <span className="block text-[14.5px] font-semibold leading-tight">
                {b.label}
                {b.earned && (
                  <span className="ml-1.5 text-[12px] font-medium text-[var(--coach-ink-muted)]">earned</span>
                )}
              </span>
              <span className="block text-[12.5px] leading-snug text-[var(--coach-ink-muted)]">{b.means}</span>
            </span>
          </li>
        ))}
      </ul>
      <Link
        href="/achievements"
        className="text-[13px] text-[var(--coach-ink-muted)] underline-offset-2 hover:underline"
      >
        All achievements
      </Link>
    </section>
  );
}

/** One path: what it is, its topics and every lesson in them, and what it earns. */
export function PathPage({ path, earns, other }: { path: PathView; earns: BadgeView[]; other: PathView | null }) {
  return (
    <div className="flex flex-col gap-6">
      <Hero path={path} />
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex min-w-0 flex-col gap-5">
          {path.joined && !path.soon && (
            <div className={`${CARD} p-5`}>
              <TopicBar path={path} />
            </div>
          )}
          {path.courses.map((c, i) => (
            <CourseCard key={c.id} course={c} index={i} />
          ))}
        </div>
        <aside className="flex flex-col gap-4 lg:sticky lg:top-6">
          {path.requires && (
            <section className={`${CARD} flex flex-col gap-1.5 p-5`}>
              <h2 className="m-0 text-[16px] font-bold">Builds on {path.requires.title}</h2>
              <p className="m-0 text-[13.5px] leading-relaxed text-[var(--coach-ink-secondary)]">
                {path.soon
                  ? `When it opens, it will start where ${path.requires.title} ends.`
                  : path.requires.done
                    ? `You've finished ${path.requires.title}, so you're ready.`
                    : `Every lesson is open, but it makes most sense after ${path.requires.title}.`}
              </p>
              {other && !path.requires.done && (
                <Link
                  href={other.href}
                  className="text-[13.5px] font-semibold text-[var(--coach-ink)] underline underline-offset-2"
                >
                  See {other.title}
                </Link>
              )}
            </section>
          )}
          <Earns badges={earns} />
          {path.joined && (
            <form action={leavePathV2Action} className="px-1">
              <input type="hidden" name="slug" value={path.slug} />
              <button
                type="submit"
                className="cursor-pointer text-[13px] text-[var(--coach-ink-muted)] underline underline-offset-2 hover:text-[var(--coach-ink)]"
              >
                Leave this path
              </button>
              <span className="text-[12.5px] text-[var(--coach-ink-muted)]"> Your progress stays.</span>
            </form>
          )}
        </aside>
      </div>
    </div>
  );
}
