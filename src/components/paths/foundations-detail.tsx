import Link from "next/link";
import { Check, ChevronRight, CircuitBoard, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PathMarkRing } from "@/components/paths/path-catalog";
import { getAllLessons } from "@/lib/content/lessons";
import { FIRST_LESSON_HREF, SIGNIN_HREF } from "@/lib/routes";
import { pathMark, pathTypeMeta, type PathDef } from "@/lib/paths/catalog";
import { startPathAction } from "@/lib/paths/actions";
import {
  FOUNDATIONS_LEVEL,
  foundationsItemRole,
  foundationsLessonHref,
  foundationsLiveItems,
  foundationsLiveSections,
  foundationsLiveSlugs,
  foundationsSectionMeta,
  type FoundationsItemRole,
} from "@/lib/paths/foundations-outline";
import { cn } from "@/lib/cn";

/**
 * Foundations course page — editorial calm + soft depth.
 * Topic cards (Bits, Logic & gates, …) hold live lessons + projects.
 */
export function FoundationsDetail({
  path,
  currentOrder,
  doneCount,
  completed,
  continueHref: continueHrefProp,
  engaged,
  signedIn,
}: {
  path: PathDef;
  currentOrder: number;
  doneCount: number;
  completed: ReadonlyArray<{ level: string; slug: string }>;
  continueHref?: string;
  engaged: boolean;
  signedIn: boolean;
}) {
  const lessons = getAllLessons()
    .filter((l) => l.meta.level === FOUNDATIONS_LEVEL)
    .sort((a, b) => a.meta.order - b.meta.order);

  const liveTotal = foundationsLiveSlugs().length;
  const total = liveTotal || lessons.length;
  const pathPct = total ? Math.round((doneCount / total) * 100) : 0;

  const safeOrder = lessons.some((l) => l.meta.order === currentOrder)
    ? currentOrder
    : (lessons[0]?.meta.order ?? 1);
  const current =
    lessons.find((l) => l.meta.order === safeOrder) ?? lessons[0] ?? null;

  const continueHref =
    continueHrefProp ??
    (current
      ? foundationsLessonHref(current.meta.slug)
      : FIRST_LESSON_HREF);

  const done = new Set(
    completed
      .filter((c) => c.level === FOUNDATIONS_LEVEL)
      .map((c) => c.slug),
  );

  const liveItems = foundationsLiveItems();
  const liveSections = foundationsLiveSections();
  const roleBySlug = new Map(
    liveItems.map((item) => [item.slug, foundationsItemRole(item)] as const),
  );
  const continueSlug = continueHref.split("/").pop() ?? "";
  const currentRole = current
    ? (roleBySlug.get(current.meta.slug) ?? "lesson")
    : "lesson";
  const meta = pathTypeMeta(path);
  const remainingMin = lessons
    .filter((l) => !done.has(l.meta.slug))
    .reduce((sum, l) => sum + (l.meta.timeMin ?? 0), 0);
  const upNextLessons = (() => {
    if (!current) return [];
    const idx = lessons.findIndex((l) => l.meta.slug === current.meta.slug);
    const start = idx >= 0 ? idx : 0;
    return lessons.slice(start, start + 3);
  })();

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
          <span className="text-brand-violet">Foundations</span>
        </p>

        <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-stretch sm:gap-8 lg:gap-10">
          <div className="flex min-w-0 w-full flex-1 flex-col gap-4">
            <div className="flex items-start gap-4 sm:gap-5">
              <PathMarkRing
                mark={pathMark(path)}
                slug={path.slug}
                progress={total > 0 ? doneCount / total : 0}
                gradientId="path-ring-foundations-detail"
                size="lg"
              />
              <div className="min-w-0 flex-1 pt-0.5">
                <h1 className="font-display text-[28px] font-extrabold leading-tight tracking-[-0.032em] text-ink sm:text-[32px]">
                  {path.title}
                </h1>
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
          </div>

          {current ? (
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
                      {current.meta.order} of {total}
                      {signedIn && doneCount > 0 ? ` · ${pathPct}%` : null}
                    </div>
                  </div>
                </div>
                {engaged ? (
                  <Button href={continueHref} variant="invert" size="md" className="w-full">
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
          ) : null}
        </div>
      </header>

      <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-8 lg:gap-12">
        <div className="min-w-0 w-full flex-1">
          <div className="mb-5 max-w-[640px]">
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-fainter">
              Course map · {total} in order
            </p>
          </div>

          <div className="flex max-w-[640px] flex-col gap-7">
            {liveSections.map((section) => (
              <section
                key={section.id}
                className="overflow-hidden rounded-[18px] border border-card-border bg-white shadow-card-rest dark:bg-elevated"
              >
                <div className="border-b border-divider px-5 py-4 sm:px-6">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h2 className="font-display text-[16px] font-extrabold tracking-tight text-ink sm:text-[17px]">
                      {section.title}
                    </h2>
                    <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-fainter">
                      {foundationsSectionMeta(section.items)}
                    </p>
                  </div>
                  {section.blurb ? (
                    <p className="mt-1.5 max-w-[36rem] text-[13px] leading-relaxed text-ink-secondary">
                      {section.blurb}
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-col gap-0.5 px-3 py-3.5 sm:px-4 sm:py-4">
                  {section.items.map((item) => {
                    const href = foundationsLessonHref(item.slug);
                    const complete = done.has(item.slug);
                    const isContinue = continueSlug === item.slug;
                    const role = foundationsItemRole(item);
                    return (
                      <Link
                        key={item.slug}
                        href={href}
                        className={cn(
                          "group flex items-center gap-3 rounded-xl px-2.5 py-2.5 no-underline transition-colors duration-150",
                          isContinue
                            ? "bg-xp-bg ring-1 ring-xp-border"
                            : "hover:bg-paper dark:hover:bg-bg/50",
                        )}
                      >
                        <LessonKindIcon
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
                            !complete &&
                              !isContinue &&
                              "font-medium text-ink",
                          )}
                        >
                          {item.title}
                        </span>
                        <LessonStatusMark
                          complete={complete}
                          active={isContinue}
                        />
                      </Link>
                    );
                  })}
                </div>
              </section>
            ))}
            <p className="px-1 font-mono text-[11px] text-ink-fainter">
              More topics coming
            </p>
          </div>
        </div>

        <div className="flex w-full min-w-0 flex-1 flex-col gap-3.5 sm:min-w-[240px] sm:max-w-md">
          <div className={asideCardClass}>
            <div className="mb-3 font-display text-[15px] font-extrabold tracking-tight text-ink">
              Your progress
            </div>
            {signedIn ? (
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
                Foundations stays open.{" "}
                <Link
                  href={SIGNIN_HREF}
                  className="font-semibold text-brand-violet hover:underline"
                >
                  Sign in
                </Link>{" "}
                to save progress.
              </p>
            )}
          </div>

          {upNextLessons.length > 0 ? (
            <div className={asideCardClass}>
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="font-display text-[15px] font-extrabold tracking-tight text-ink">
                  Up next
                </div>
                <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-fainter">
                  Foundations
                </span>
              </div>
              <div className="flex flex-col">
                {upNextLessons.map((lesson, i) => {
                  const role = roleBySlug.get(lesson.meta.slug) ?? "lesson";
                  const KindIcon = role === "project" ? CircuitBoard : FileText;
                  return (
                    <Link
                      key={lesson.meta.slug}
                      href={foundationsLessonHref(lesson.meta.slug)}
                      className={cn(
                        "-mx-1.5 flex items-center gap-3 rounded-lg px-2 py-2 transition-colors duration-150",
                        i === 0 ? "bg-xp-bg/50" : "hover:bg-paper/80 dark:hover:bg-bg/40",
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
              After Foundations
            </div>
            <p className="mb-3 text-[13px] leading-relaxed text-ink-secondary">
              Finish this course, then choose a role path on Ascend.
            </p>
            <Link
              href="/paths"
              className="inline-flex items-center gap-1 text-[13px] font-semibold text-brand-violet hover:underline"
            >
              All paths <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

function LessonKindIcon({
  role,
  complete,
  active,
}: {
  role: FoundationsItemRole;
  complete: boolean;
  active: boolean;
}) {
  const Icon = role === "project" ? CircuitBoard : FileText;
  return (
    <span
      className={cn(
        "flex h-8 w-8 flex-none items-center justify-center rounded-xl transition-colors",
        complete &&
          "border border-card-border bg-elevated text-ink-fainter dark:bg-bg",
        active &&
          !complete &&
          "border-2 border-brand-violet bg-paper text-brand-violet shadow-[0_0_0_3px_rgba(13,159,110,0.14)] dark:bg-elevated",
        !complete &&
          !active &&
          "border border-card-border bg-elevated text-ink-fainter group-hover:border-xp-border group-hover:bg-xp-bg/50 group-hover:text-ink-secondary dark:bg-bg",
      )}
      title={role === "project" ? "Project" : "Lesson"}
      aria-hidden
    >
      <Icon size={16} strokeWidth={1.75} />
    </span>
  );
}

function LessonStatusMark({
  complete,
  active,
}: {
  complete: boolean;
  active: boolean;
}) {
  if (complete) {
    return (
      <span
        className="flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full bg-brand-gradient"
        aria-label="Completed"
      >
        <Check size={12} strokeWidth={2.8} className="text-white" aria-hidden />
      </span>
    );
  }
  if (active) {
    return (
      <span
        className="flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full border-2 border-brand-violet bg-paper shadow-[0_0_0_3px_rgba(13,159,110,0.14)] dark:bg-elevated"
        aria-label="Up next"
      >
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-brand-violet" />
      </span>
    );
  }
  return (
    <span
      className="flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full border border-card-border bg-elevated dark:bg-bg"
      aria-label="Not completed"
    />
  );
}

function BandArrow() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
