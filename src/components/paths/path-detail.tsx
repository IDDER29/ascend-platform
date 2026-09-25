import Link from "next/link";
import { ChevronRight, CircuitBoard, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PathMarkRing } from "@/components/paths/path-catalog";
import {
  BandArrow,
  PathKindIcon,
  PathStatusMark,
  pathItemRole,
  sectionMetaLabel,
} from "@/components/paths/path-outline-marks";
import { getAllLessons, getLesson } from "@/lib/content/lessons";
import type { Lesson } from "@/lib/content/schema";
import { SIGNIN_HREF } from "@/lib/routes";
import { startPathAction } from "@/lib/paths/actions";
import { lessonHref, resolveLessonPublicSlug } from "@/lib/paths/lesson-urls";
import {
  courseLessonCount,
  courseOpenHref,
  courseProjectCount,
  pathMark,
  pathProgressFraction,
  pathTypeMeta,
  type PathCourse,
  type PathDef,
} from "@/lib/paths/catalog";
import {
  courseOutlineForLevel,
  type CourseOutlineSection,
} from "@/lib/paths/course-outlines";
import { cn } from "@/lib/cn";

type Completed = ReadonlyArray<{ level: string; slug: string }>;

function pathLessons(path: PathDef) {
  const levelIds = path.courses
    .map((c) => c.levelId)
    .filter(Boolean) as string[];
  return getAllLessons()
    .filter((l) => levelIds.includes(l.meta.level))
    .sort((a, b) => {
      const ai = levelIds.indexOf(a.meta.level);
      const bi = levelIds.indexOf(b.meta.level);
      if (ai !== bi) return ai - bi;
      return a.meta.order - b.meta.order;
    });
}

function lessonFromHref(href: string | null) {
  if (!href) return null;
  if (href.startsWith("/lessons/")) {
    const publicSlug = href.slice("/lessons/".length);
    const ref = resolveLessonPublicSlug(publicSlug);
    if (!ref) return null;
    return getLesson(ref.level, ref.slug);
  }
  if (!href.startsWith("/curriculum/")) return null;
  const parts = href.split("/").filter(Boolean);
  if (parts.length < 3) return null;
  return getLesson(parts[1]!, parts[2]!);
}

function countRoles(lessons: Lesson[]) {
  let lessonCount = 0;
  let projectCount = 0;
  for (const l of lessons) {
    if (pathItemRole({ slug: l.meta.slug, title: l.meta.title }) === "project") {
      projectCount += 1;
    } else {
      lessonCount += 1;
    }
  }
  return { lessonCount, projectCount };
}

function LessonRows({
  lessons,
  done,
  continueSlug,
}: {
  lessons: Lesson[];
  done: Set<string>;
  continueSlug: string;
}) {
  return (
    <div className="flex flex-col gap-0.5 px-3 py-3.5 sm:px-4 sm:py-4">
      {lessons.map((lesson) => {
        const href = lessonHref(lesson.meta.level, lesson.meta.slug);
        const key = `${lesson.meta.level}/${lesson.meta.slug}`;
        const complete = done.has(key);
        const isContinue = continueSlug === lesson.meta.slug;
        const role = pathItemRole({
          slug: lesson.meta.slug,
          title: lesson.meta.title,
        });
        return (
          <Link
            key={lesson.meta.slug}
            href={href}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-2.5 py-2.5 no-underline transition-colors duration-150",
              isContinue
                ? "bg-xp-bg ring-1 ring-xp-border"
                : "hover:bg-paper dark:hover:bg-bg/50",
            )}
          >
            <PathKindIcon
              role={role}
              complete={complete}
              active={isContinue}
            />
            <span
              className={cn(
                "min-w-0 flex-1 truncate text-[13.5px] leading-snug",
                isContinue && "font-bold text-xp-text",
                complete &&
                  !isContinue &&
                  "font-medium text-ink-secondary group-hover:text-ink",
                !complete && !isContinue && "font-medium text-ink",
              )}
            >
              {lesson.meta.title}
            </span>
            <PathStatusMark complete={complete} active={isContinue} />
          </Link>
        );
      })}
    </div>
  );
}

function TopicSectionCard({
  courseLabel,
  section,
  lessons,
  done,
  continueSlug,
}: {
  courseLabel: string;
  section: CourseOutlineSection;
  lessons: Lesson[];
  done: Set<string>;
  continueSlug: string;
}) {
  const { lessonCount, projectCount } = countRoles(lessons);
  const meta = sectionMetaLabel(lessonCount, projectCount);

  return (
    <section className="overflow-hidden rounded-[18px] border border-card-border bg-white shadow-card-rest dark:bg-elevated">
      <div className="border-b border-divider px-5 py-4 sm:px-6">
        <p className="mb-1.5 font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-fainter">
          {courseLabel}
        </p>
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-display text-[16px] font-extrabold tracking-tight text-ink sm:text-[17px]">
            {section.title}
          </h2>
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-fainter">
            {meta}
          </p>
        </div>
        {section.blurb ? (
          <p className="mt-1.5 max-w-[36rem] text-[13px] leading-relaxed text-ink-secondary">
            {section.blurb}
          </p>
        ) : null}
      </div>
      <LessonRows
        lessons={lessons}
        done={done}
        continueSlug={continueSlug}
      />
    </section>
  );
}

function resolveOutlineLessons(
  levelId: string,
  outline: CourseOutlineSection[],
  allInLevel: Lesson[],
): { section: CourseOutlineSection; lessons: Lesson[] }[] {
  const bySlug = new Map(allInLevel.map((l) => [l.meta.slug, l]));
  const used = new Set<string>();
  const blocks: { section: CourseOutlineSection; lessons: Lesson[] }[] = [];

  for (const section of outline) {
    const lessons: Lesson[] = [];
    for (const item of section.items) {
      const lesson = bySlug.get(item.slug);
      if (lesson) {
        lessons.push(lesson);
        used.add(item.slug);
      }
    }
    if (lessons.length > 0) blocks.push({ section, lessons });
  }

  const leftover = allInLevel.filter((l) => !used.has(l.meta.slug));
  if (leftover.length > 0) {
    blocks.push({
      section: {
        id: "more",
        title: "More in this course",
        blurb: "Additional lessons in this course.",
        items: leftover.map((l) => ({ slug: l.meta.slug })),
      },
      lessons: leftover,
    });
  }

  return blocks;
}

/** One course → topic section cards (organized) or a single planned/capstone card. */
function CourseMapBlocks({
  course,
  pathLive,
  done,
  continueSlug,
}: {
  course: PathCourse;
  pathLive: boolean;
  done: Set<string>;
  continueSlug: string;
}) {
  const openHref = pathLive ? courseOpenHref(course) : null;
  const liveLevel = Boolean(pathLive && course.levelId);
  const allInLevel = liveLevel
    ? getAllLessons()
        .filter((l) => l.meta.level === course.levelId)
        .sort((a, b) => a.meta.order - b.meta.order)
    : [];

  const outline =
    liveLevel && course.levelId
      ? courseOutlineForLevel(course.levelId)
      : null;

  if (outline && allInLevel.length > 0) {
    const blocks = resolveOutlineLessons(course.levelId!, outline, allInLevel);
    return (
      <>
        {blocks.map(({ section, lessons }) => (
          <TopicSectionCard
            key={`${course.id}-${section.id}`}
            courseLabel={course.title}
            section={section}
            lessons={lessons}
            done={done}
            continueSlug={continueSlug}
          />
        ))}
      </>
    );
  }

  const plannedLessons = courseLessonCount(course) ?? 0;
  const plannedProjects = courseProjectCount(course) ?? 0;
  const { lessonCount, projectCount } =
    allInLevel.length > 0
      ? countRoles(allInLevel)
      : {
          lessonCount: course.href ? 0 : plannedLessons,
          projectCount: course.href ? plannedProjects || 1 : plannedProjects,
        };
  const meta = sectionMetaLabel(lessonCount, projectCount);
  const isCapstone = Boolean(course.href);

  return (
    <section className="overflow-hidden rounded-[18px] border border-card-border bg-white shadow-card-rest dark:bg-elevated">
      <div className="border-b border-divider px-5 py-4 sm:px-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-display text-[16px] font-extrabold tracking-tight text-ink sm:text-[17px]">
            {course.title}
          </h2>
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-fainter">
            {pathLive && (openHref || allInLevel.length > 0)
              ? meta
              : "Coming soon"}
          </p>
        </div>
        <p className="mt-1.5 max-w-[36rem] text-[13px] leading-relaxed text-ink-secondary">
          {course.body}
        </p>
      </div>

      {allInLevel.length > 0 ? (
        <LessonRows
          lessons={allInLevel}
          done={done}
          continueSlug={continueSlug}
        />
      ) : isCapstone && openHref ? (
        <div className="flex flex-col gap-0.5 px-3 py-3.5 sm:px-4 sm:py-4">
          <Link
            href={openHref}
            className="group flex items-center gap-3 rounded-xl px-2.5 py-2.5 no-underline transition-colors duration-150 hover:bg-paper dark:hover:bg-bg/50"
          >
            <PathKindIcon role="project" />
            <span className="min-w-0 flex-1 truncate text-[13.5px] font-medium leading-snug text-ink">
              {course.title}
            </span>
            <ChevronRight
              size={14}
              className="flex-none text-ink-fainter/60 opacity-0 transition-opacity group-hover:opacity-100"
            />
          </Link>
        </div>
      ) : (
        <div className="px-5 py-4 sm:px-6">
          <p className="font-mono text-[11px] text-ink-fainter">
            {plannedLessons > 0 || plannedProjects > 0
              ? `${meta} planned`
              : "Content coming soon"}
          </p>
        </div>
      )}
    </section>
  );
}

export function PathDetail({
  path,
  continueHref,
  engaged = false,
  completed = [],
  signedIn = false,
}: {
  path: PathDef;
  continueHref: string | null;
  engaged?: boolean;
  completed?: Completed;
  signedIn?: boolean;
}) {
  const live = path.status === "live";
  const meta = pathTypeMeta(path);
  const lessons = pathLessons(path);
  const total = lessons.length;
  const done = new Set(completed.map((c) => `${c.level}/${c.slug}`));
  const doneCount = lessons.filter((l) =>
    done.has(`${l.meta.level}/${l.meta.slug}`),
  ).length;
  const pathPct = total ? Math.round((doneCount / total) * 100) : 0;
  const fraction = pathProgressFraction(path, completed) ?? 0;

  const current =
    lessonFromHref(continueHref) ?? lessons[0] ?? null;
  const continueSlug = continueHref?.split("/").pop() ?? "";
  const currentRole = current
    ? pathItemRole({ slug: current.meta.slug, title: current.meta.title })
    : "lesson";

  const remainingMin = lessons
    .filter((l) => !done.has(`${l.meta.level}/${l.meta.slug}`))
    .reduce((sum, l) => sum + (l.meta.timeMin ?? 0), 0);

  const upNext = (() => {
    if (!current) return lessons.slice(0, 3);
    const idx = lessons.findIndex(
      (l) =>
        l.meta.level === current.meta.level &&
        l.meta.slug === current.meta.slug,
    );
    const start = idx >= 0 ? idx : 0;
    return lessons.slice(start, start + 3);
  })();

  const startHref = continueHref;
  const asideCardClass =
    "w-full rounded-[16px] border border-card-border/80 bg-elevated/50 p-5 shadow-none dark:bg-elevated/40";

  return (
    <>
      <header className="mb-10 w-full sm:mb-12">
        <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-fainter">
          <Link
            href="/paths"
            className="transition-colors hover:text-ink-secondary"
          >
            Paths
          </Link>
          <span className="mx-1.5 text-divider">/</span>
          <span className="text-brand-violet">{path.title}</span>
        </p>

        <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-stretch sm:gap-8 lg:gap-10">
          <div className="flex min-w-0 w-full flex-1 flex-col gap-4">
            <div className="flex items-start gap-4 sm:gap-5">
              <PathMarkRing
                mark={pathMark(path)}
                slug={path.slug}
                progress={live && total > 0 ? fraction : 0}
                gradientId={`path-ring-${path.slug}`}
                size="lg"
              />
              <div className="min-w-0 flex-1 pt-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-display text-[28px] font-extrabold leading-tight tracking-[-0.032em] text-ink sm:text-[32px]">
                    {path.title}
                  </h1>
                  {!live ? (
                    <span className="rounded-md bg-xp-bg px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-xp-text">
                      Soon
                    </span>
                  ) : null}
                </div>
                <p className="mt-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-fainter">
                  {meta.typeLabel}
                  <span className="mx-2 text-divider">·</span>
                  {meta.sizeLabel}
                </p>
              </div>
            </div>
            <p className="max-w-[36rem] text-[15px] leading-relaxed text-ink-secondary">
              {path.body}
            </p>
            {path.requiresLabel && path.requiresSlug ? (
              <p className="max-w-[36rem] text-[13px] text-ink-fainter">
                {path.requiresLabel}.{" "}
                <Link
                  href={`/paths/${path.requiresSlug}`}
                  className="font-semibold text-brand-violet hover:underline"
                >
                  View prerequisite
                </Link>
              </p>
            ) : null}
          </div>

          {live && current && startHref ? (
            <aside className="relative flex w-full min-w-0 flex-1 flex-col overflow-hidden rounded-[20px] bg-brand-gradient p-5 text-white shadow-[0_12px_28px_rgba(13,159,110,0.18)] sm:min-w-[240px] sm:max-w-md sm:p-6">
              <div className="pointer-events-none absolute -right-12 -top-16 h-[160px] w-[160px] rounded-full bg-white/[0.1]" />
              <div className="relative flex h-full min-h-[168px] flex-col justify-between gap-5">
                <div className="flex flex-col gap-3.5">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl border border-white/20 bg-white/12 font-mono text-sm font-bold">
                      {String(current.meta.order).padStart(2, "0")}
                    </span>
                    <div className="min-w-0 font-mono text-[11px] uppercase tracking-[0.1em] text-white/75">
                      {engaged ? "Continue" : "Start here"}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="font-display text-[18px] font-extrabold leading-snug tracking-tight sm:text-[20px]">
                      {current.meta.title}
                    </div>
                    <div className="mt-1 text-[13px] text-white/80">
                      {currentRole === "project" ? "Project" : "Lesson"}{" "}
                      {current.meta.order}
                      {total > 0 ? ` of ${total}` : null}
                      {signedIn && doneCount > 0 ? ` · ${pathPct}%` : null}
                    </div>
                  </div>
                </div>
                {engaged ? (
                  <Button href={startHref} variant="invert" size="md" className="w-full">
                    Continue
                    <BandArrow />
                  </Button>
                ) : (
                  <form action={startPathAction} className="w-full">
                    <input type="hidden" name="slug" value={path.slug} />
                    <Button type="submit" variant="invert" size="md" className="w-full">
                      Start
                      <BandArrow />
                    </Button>
                  </form>
                )}
              </div>
            </aside>
          ) : !live ? (
            <aside className="flex w-full min-w-0 flex-1 flex-col justify-between rounded-[20px] border border-card-border/80 bg-elevated/50 p-5 sm:min-w-[240px] sm:max-w-md sm:p-6">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-fainter">
                  Coming soon
                </p>
                <p className="mt-2 font-display text-[18px] font-extrabold tracking-tight text-ink">
                  Not open yet
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-secondary">
                  This path is on the roadmap. Browse the course map below, or
                  start with a live path.
                </p>
              </div>
              <Button href="/paths" variant="secondary" size="md" className="mt-5 w-full">
                All paths
              </Button>
            </aside>
          ) : null}
        </div>
      </header>

      <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-8 lg:gap-12">
        <div className="min-w-0 w-full flex-1">
          <div className="mb-5 max-w-[640px]">
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-fainter">
              Course map
              {live && total > 0 ? ` · ${total} in order` : null}
              {!live ? ` · ${path.courses.length} courses planned` : null}
            </p>
          </div>

          <div className="flex max-w-[640px] flex-col gap-7">
            {path.courses.map((course) => (
              <CourseMapBlocks
                key={course.id}
                course={course}
                pathLive={live}
                done={done}
                continueSlug={continueSlug}
              />
            ))}
          </div>
        </div>

        <div className="flex w-full min-w-0 flex-1 flex-col gap-3.5 sm:min-w-[240px] sm:max-w-md">
          <div className={asideCardClass}>
            <div className="mb-3 font-display text-[15px] font-extrabold tracking-tight text-ink">
              Your progress
            </div>
            {live && total > 0 ? (
              signedIn ? (
                <>
                  <div className="mb-1 flex items-baseline justify-between gap-2">
                    <span className="font-display text-[22px] font-extrabold tracking-tight text-brand-violet">
                      {doneCount}
                      <span className="text-[14px] font-semibold text-ink-fainter">
                        /{total}
                      </span>
                    </span>
                    <span className="font-mono text-[11px] text-ink-fainter">
                      {pathPct}%
                    </span>
                  </div>
                  <div className="mb-2.5 h-1 overflow-hidden rounded-full bg-paper dark:bg-bg">
                    <div
                      className="h-full rounded-full bg-brand-gradient"
                      style={{ width: `${pathPct}%` }}
                    />
                  </div>
                  {remainingMin > 0 ? (
                    <p className="font-mono text-[11px] text-ink-fainter">
                      ~{remainingMin} min left
                    </p>
                  ) : null}
                </>
              ) : (
                <p className="text-[13px] leading-relaxed text-ink-secondary">
                  Path stays open.{" "}
                  <Link
                    href={SIGNIN_HREF}
                    className="font-semibold text-brand-violet hover:underline"
                  >
                    Sign in
                  </Link>{" "}
                  to save progress.
                </p>
              )
            ) : (
              <p className="text-[13px] leading-relaxed text-ink-secondary">
                {live
                  ? "Progress unlocks when courses go live."
                  : "Progress will track here when this path opens."}
              </p>
            )}
          </div>

          {live && upNext.length > 0 ? (
            <div className={asideCardClass}>
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="font-display text-[15px] font-extrabold tracking-tight text-ink">
                  Up next
                </div>
                <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-fainter">
                  {path.title}
                </span>
              </div>
              <div className="flex flex-col">
                {upNext.map((lesson, i) => {
                  const role = pathItemRole({
                    slug: lesson.meta.slug,
                    title: lesson.meta.title,
                  });
                  const KindIcon = role === "project" ? CircuitBoard : FileText;
                  return (
                    <Link
                      key={`${lesson.meta.level}/${lesson.meta.slug}`}
                      href={lessonHref(lesson.meta.level, lesson.meta.slug)}
                      className={cn(
                        "-mx-1.5 flex items-center gap-3 rounded-lg px-2 py-2 transition-colors duration-150",
                        i === 0
                          ? "bg-xp-bg/50"
                          : "hover:bg-paper/80 dark:hover:bg-bg/40",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-7 w-7 flex-none items-center justify-center rounded-lg",
                          i === 0
                            ? "bg-brand-violet text-white"
                            : "bg-paper text-ink-fainter dark:bg-bg",
                        )}
                      >
                        <KindIcon size={14} strokeWidth={1.75} aria-hidden />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[13.5px] font-medium text-ink">
                          {lesson.meta.title}
                        </div>
                        <div className="font-mono text-[10.5px] text-ink-fainter">
                          {role === "project" ? "Project" : "Lesson"}
                          {" · "}
                          {lesson.meta.timeMin} min
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ) : null}

          <div className={asideCardClass}>
            <div className="mb-1.5 font-display text-[15px] font-extrabold tracking-tight text-ink">
              {path.requiresSlug ? "Before you start" : "All paths"}
            </div>
            <p className="mb-3 text-[13px] leading-relaxed text-ink-secondary">
              {path.requiresLabel
                ? `${path.requiresLabel} — finish that first, then come back here.`
                : "Browse every path on Ascend when you’re ready to choose."}
            </p>
            <Link
              href={path.requiresSlug ? `/paths/${path.requiresSlug}` : "/paths"}
              className="inline-flex items-center gap-1 text-[13px] font-semibold text-brand-violet hover:underline"
            >
              {path.requiresSlug ? "View prerequisite" : "All paths"}{" "}
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
