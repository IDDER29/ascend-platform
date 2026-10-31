import Link from "next/link";
import { CrestArt } from "@/components/achievements/emblems";
import { BadgeMark } from "@/components/achievements/marks";
import { PathIcon, pathMeta } from "@/components/paths-v2/path-parts";
import type { BadgeView } from "@/lib/achievements/achievements-model";
import { durationLabel, type PathCourse, type PathView } from "@/lib/paths/paths-v2-model";
import { FIRST_LESSON_HREF, SIGNUP_HREF } from "@/lib/routes";
import { CATALOG_HREF } from "@/lib/site/site-nav";
import { SiteShell } from "./site-shell";
import { CARD, H2, LEAD, LIME_BTN, OUTLINE_ON_DARK_BTN, StartBand, WRAP } from "./site-ui";

function TopicBlock({ course, index }: { course: PathCourse; index: number }) {
  return (
    <li className={`${CARD} overflow-hidden`}>
      <div className="flex items-start gap-4 border-b-2 border-[var(--coach-divider)] p-5 sm:p-6">
        <span
          aria-hidden
          className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[var(--coach-hero-bg)] text-[var(--coach-lime)]"
        >
          {course.crest ? (
            <svg
              viewBox="0 0 48 48"
              className="size-8"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <CrestArt crest={course.crest} />
            </svg>
          ) : (
            <span className="font-display text-[18px] font-extrabold">{index + 1}</span>
          )}
        </span>
        <div className="min-w-0">
          <p className="m-0 text-[13px] font-semibold text-[var(--coach-ink-muted)]">
            Topic {index + 1} ·{" "}
            {course.total === 0 ? "coming soon" : `${course.total} lessons · ${durationLabel(course.minutes)}`}
          </p>
          <h3 className="m-0 mt-0.5 text-[21px] font-bold leading-tight">{course.title}</h3>
          <p className="m-0 mt-1.5 text-[15px] leading-relaxed text-[var(--coach-ink-secondary)]">{course.body}</p>
        </div>
      </div>
      <div className="flex flex-col gap-5 p-5 sm:p-6">
        {course.sections.map((section) => (
          <div key={section.id}>
            <h4 className="m-0 text-[15px] font-bold">{section.title}</h4>
            {section.blurb && <p className="m-0 mt-0.5 text-[14px] text-[var(--coach-ink-muted)]">{section.blurb}</p>}
            <ol className="m-0 mt-2 flex list-none flex-col p-0">
              {section.items.map((lesson) => (
                <li key={lesson.key}>
                  <Link
                    href={lesson.href}
                    className="-mx-2 flex min-h-11 items-center justify-between gap-3 rounded-lg px-2 text-[15px] text-[var(--coach-ink)] no-underline hover:bg-[var(--coach-tint-neutral-bg)]"
                  >
                    <span className="min-w-0">
                      {lesson.title.replace(/^Project: /, "")}
                      {lesson.project && (
                        <span className="ml-2 rounded-full bg-[var(--coach-tint-lime-bg)] px-2 py-0.5 text-[12px] font-semibold text-[var(--coach-tint-lime-ink)]">
                          Project
                        </span>
                      )}
                    </span>
                    <span className="shrink-0 text-[13px] tabular-nums text-[var(--coach-ink-muted)]">
                      {lesson.timeMin} min
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </li>
  );
}

function CapstoneBlock({ course }: { course: PathCourse }) {
  return (
    <li className="flex flex-col gap-4 rounded-[20px] bg-[var(--coach-hero-bg)] p-5 text-[var(--coach-hero-ink)] sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div>
        <p className="m-0 text-[13px] font-semibold text-[var(--coach-hero-muted)]">Capstone project</p>
        <h3 className="m-0 mt-0.5 text-[21px] font-bold">{course.title}</h3>
        <p className="m-0 mt-1.5 text-[15px] leading-relaxed text-[var(--coach-hero-muted)]">{course.body}</p>
      </div>
      {course.href && (
        <Link href={course.href} className={`${OUTLINE_ON_DARK_BTN} min-h-11 shrink-0 text-[14.5px]`}>
          Read the brief
        </Link>
      )}
    </li>
  );
}

function PlannedBlock({ course, index }: { course: PathCourse; index: number }) {
  return (
    <li className="flex items-start gap-4 rounded-[20px] border-2 border-dashed border-[var(--coach-border-strong)] p-5 sm:p-6">
      <span
        aria-hidden
        className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[var(--coach-tint-neutral-bg)] font-display text-[18px] font-extrabold text-[var(--coach-ink-muted)]"
      >
        {index + 1}
      </span>
      <div>
        <h3 className="m-0 text-[19px] font-bold leading-tight">{course.title}</h3>
        <p className="m-0 mt-1 text-[15px] leading-relaxed text-[var(--coach-ink-secondary)]">{course.body}</p>
        {course.planned && (
          <p className="m-0 mt-2 text-[13px] tabular-nums text-[var(--coach-ink-muted)]">
            About {course.planned.lessons} lessons
            {course.planned.projects > 0 &&
              ` and ${course.planned.projects} ${course.planned.projects === 1 ? "project" : "projects"}`}{" "}
            planned
          </p>
        )}
      </div>
    </li>
  );
}

export function PublicPathPage({ path, earns }: { path: PathView; earns: BadgeView[] }) {
  // The path's first lesson: where "Start this path" goes.
  const first = path.courses.flatMap((c) => c.sections.flatMap((s) => s.items))[0];
  let topicIndex = 0;

  return (
    <SiteShell>
      <section aria-labelledby="path-title" className={`${WRAP} pt-6 sm:pt-10`}>
        <nav aria-label="Breadcrumb" className="mb-4 text-[14px] text-[var(--coach-ink-muted)]">
          <Link
            href={CATALOG_HREF}
            className="text-[var(--coach-ink-muted)] no-underline hover:text-[var(--coach-ink)]"
          >
            All paths
          </Link>
          <span aria-hidden className="mx-2">
            /
          </span>
          <span aria-current="page" className="text-[var(--coach-ink)]">
            {path.title}
          </span>
        </nav>
        <div className="rounded-[28px] bg-[var(--coach-hero-bg)] px-5 py-9 text-[var(--coach-hero-ink)] sm:px-10 sm:py-12">
          <div className="flex items-center gap-3">
            <span className="rounded-xl ring-2 ring-[var(--coach-hero-track)]">
              <PathIcon slug={path.slug} size="lg" />
            </span>
            {path.soon && (
              <span className="rounded-full bg-[var(--coach-tint-orange-bg)] px-3 py-1 text-[13px] font-semibold text-[var(--coach-tint-orange-ink)]">
                Coming soon
              </span>
            )}
          </div>
          <h1
            id="path-title"
            className="m-0 mt-5 font-display text-[40px] font-extrabold leading-[1.02] tracking-[-0.04em] [text-wrap:balance] sm:text-[56px]"
          >
            {path.title}
          </h1>
          <p className="m-0 mt-4 max-w-[46rem] text-[17px] leading-relaxed text-[var(--coach-hero-muted)] [text-wrap:pretty] sm:text-[19px]">
            {path.pitch}
          </p>
          <p className="m-0 mt-4 text-[14px] tabular-nums text-[var(--coach-hero-muted)]">{pathMeta(path)}</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            {path.soon ? (
              <Link href={FIRST_LESSON_HREF} className={LIME_BTN}>
                Start with Foundations
              </Link>
            ) : (
              first && (
                <Link href={first.href} className={LIME_BTN}>
                  Start this path
                </Link>
              )
            )}
            {!path.soon && (
              <Link href={SIGNUP_HREF} className={OUTLINE_ON_DARK_BTN}>
                Create a free account
              </Link>
            )}
          </div>
          {path.requires && (
            <p className="m-0 mt-5 text-[14px] text-[var(--coach-hero-muted)]">
              Builds on{" "}
              <Link
                href={`${CATALOG_HREF}/${path.requires.slug}`}
                className="font-semibold text-[var(--coach-hero-ink)] underline underline-offset-2"
              >
                {path.requires.title}
              </Link>
              . Start there if you&apos;re new to how computers work.
            </p>
          )}
        </div>
      </section>

      <section
        aria-labelledby="about-title"
        className={`${WRAP} py-12 sm:py-16 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-12`}
      >
        <h2 id="about-title" className={`${H2} mb-4 lg:sticky lg:top-24 lg:mb-0 lg:self-start`}>
          {path.soon ? "What it will cover" : "What you'll learn"}
        </h2>
        <div className="min-w-0">
          <p className={LEAD}>{path.body}</p>
          <ol className="m-0 mt-8 flex list-none flex-col gap-4 p-0">
            {path.courses.map((c) => {
              if (c.kind === "capstone") return <CapstoneBlock key={c.id} course={c} />;
              const i = topicIndex++;
              return c.kind === "topic" ? (
                <TopicBlock key={c.id} course={c} index={i} />
              ) : (
                <PlannedBlock key={c.id} course={c} index={i} />
              );
            })}
          </ol>
        </div>
      </section>

      {earns.length > 0 && (
        <section
          aria-labelledby="earns-title"
          className={`${WRAP} pb-12 sm:pb-16 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-12`}
        >
          <div className="mb-6 lg:sticky lg:top-24 lg:mb-0 lg:self-start">
            <h2 id="earns-title" className={H2}>
              What finishing it earns
            </h2>
            <p className={`${LEAD} mt-3`}>Each one is given for something you did, and shows on your profile.</p>
          </div>
          <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2">
            {earns.map((b) => (
              <li key={b.id} className={`${CARD} flex items-center gap-3 p-4`}>
                <BadgeMark badge={{ ...b, earned: true }} />
                <span className="min-w-0">
                  <span className="block text-[15.5px] font-bold leading-tight">{b.label}</span>
                  <span className="block text-[13.5px] leading-snug text-[var(--coach-ink-secondary)]">{b.means}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <StartBand />
    </SiteShell>
  );
}
