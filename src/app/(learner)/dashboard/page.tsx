import Link from "next/link";
import { getAllLessons } from "@/lib/content/lessons";
import { LEVELS, levelIds, type LevelId } from "@/lib/content/schema";
import { getCurrentUser } from "@/lib/auth/auth";
import {
  getContinueLesson,
  countCompletedInLevel,
  getStreak,
  listCompletedLessons,
  type LessonCompletion,
} from "@/lib/progress/queries";
import { listRecentShellforgeSubmissions } from "@/lib/projects/queries";
import { getFollowingMap } from "@/lib/paths/selected-path";
import {
  daysOnSince,
  formatAccountTenure,
} from "@/lib/dashboard/tenure";
import {
  pathDaysOnPath,
  resolveContinuePathSlug,
} from "@/lib/dashboard/continue-target";
import {
  getPathBySlug,
  pathHref as catalogPathHref,
  pathProgressFraction,
  pathContinueHref,
} from "@/lib/paths/catalog";
import { pathItemRole } from "@/components/paths/path-outline-marks";
import { lessonHref } from "@/lib/paths/lesson-urls";
import { FIRST_LESSON_HREF, SIGNIN_HREF } from "@/lib/routes";
import { PageHeader, HUB_MAIN_CLASS, HUB_NARROW_CLASS } from "@/components/ui/page-header";
import {
  ContinueBand,
  DashboardPulse,
  DashboardWorkGrid,
  NeedsWorkBanner,
} from "@/components/dashboard/continue-home";
import {
  buildRecentProjects,
  formatHeaderDate,
  formatLastActiveLabel,
  greetingForHour,
  lessonBlurb,
  lessonStructureLabel,
  lessonsOnPath,
  nextProjectCta,
  resolvePathHandoff,
  streakHabitLine,
  type RecentProject,
} from "@/lib/dashboard/continue";

export const metadata = {
  title: "Continue — Ascend",
};

const FALLBACK_LEVEL: LevelId = "level-00-bits-logic";
const DEFAULT_PATH_SLUG = "foundations";

/**
 * Reading order (top → bottom):
 * 1. Orient  2. Act (Continue)  3. Pulse  4. Optional real urgency  5. Work
 * Continue path = last completed lesson/project; Your paths = following only.
 */
export default async function DashboardPage() {
  const user = await getCurrentUser();
  const lessons = getAllLessons();
  const totalLessons = lessons.length;
  const first = lessons[0];

  let continueHref = first
    ? lessonHref(first.meta.level, first.meta.slug)
    : FIRST_LESSON_HREF;
  let levelDone: Record<string, number> = Object.fromEntries(
    levelIds.map((id) => [id, 0]),
  );
  let streakCurrent = 0;
  let lastActiveDate: string | null = null;
  let totalCompleted = 0;
  let completed: LessonCompletion[] = [];
  let recentProjects: RecentProject[] = [];
  let shellforgePassedAt: Date | null = null;

  if (user) {
    try {
      const [cont, streak, completedRows, doneCounts, submissions] =
        await Promise.all([
          getContinueLesson(user.id),
          getStreak(user.id),
          listCompletedLessons(user.id),
          Promise.all(
            levelIds.map(
              async (id) =>
                [id, await countCompletedInLevel(user.id, id)] as const,
            ),
          ),
          listRecentShellforgeSubmissions(user.id, 5).catch(() => []),
        ]);
      continueHref = cont.href;
      streakCurrent = streak?.current ?? 0;
      lastActiveDate = streak?.lastActiveDate ?? null;
      completed = completedRows;
      totalCompleted = completedRows.length;
      levelDone = Object.fromEntries(doneCounts);
      recentProjects = buildRecentProjects(
        submissions,
        completedRows,
        new Date(),
      );
      const passedSf = submissions
        .filter((s) => s.outcome === "passed")
        .sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime())[0];
      shellforgePassedAt = passedSf?.submittedAt ?? null;
    } catch {
      // db unavailable — still render a usable guest-style continue surface
    }
  }

  const followingMap = await getFollowingMap();
  const continueSlug =
    resolveContinuePathSlug({
      completed,
      shellforgePassedAt,
    }) ?? DEFAULT_PATH_SLUG;
  const path =
    getPathBySlug(continueSlug) ?? getPathBySlug(DEFAULT_PATH_SLUG)!;
  const pathHref = catalogPathHref(path.slug);
  const projectCta = nextProjectCta(path, completed);

  const pathLessons = lessonsOnPath(path);
  const pathContHref = pathContinueHref(path, completed);
  if (pathContHref) {
    continueHref = pathContHref;
  }

  let currentLesson =
    pathLessons.find(
      (l) => lessonHref(l.meta.level, l.meta.slug) === continueHref,
    ) ?? null;
  if (!currentLesson && pathLessons.length > 0) {
    const done = new Set(completed.map((c) => `${c.level}/${c.slug}`));
    currentLesson =
      pathLessons.find((l) => !done.has(`${l.meta.level}/${l.meta.slug}`)) ??
      pathLessons[pathLessons.length - 1] ??
      null;
  }
  if (!currentLesson) {
    currentLesson = lessons[0] ?? null;
  }

  if (currentLesson && !pathContHref) {
    continueHref = lessonHref(currentLesson.meta.level, currentLesson.meta.slug);
  }

  const continueIndex = pathLessons.findIndex(
    (l) =>
      l.meta.level === currentLesson?.meta.level &&
      l.meta.slug === currentLesson?.meta.slug,
  );
  const safeIndex = continueIndex >= 0 ? continueIndex : 0;
  const upNextSource = pathLessons.length > 0 ? pathLessons : lessons;
  const lookFrom = (pathLessons.length > 0 ? safeIndex : 0) + 1;
  const upNext = upNextSource.slice(lookFrom, lookFrom + 4);

  const pathFraction = pathProgressFraction(path, completed);
  const pathPct =
    pathFraction != null
      ? Math.round(Math.min(1, Math.max(0, pathFraction)) * 100)
      : null;
  const projectsDone = completed.filter(
    (c) => pathItemRole({ slug: c.slug }) === "project",
  ).length;

  const firstName = user?.name?.trim().split(/\s+/)[0] ?? "";
  const now = new Date();
  const greeting = greetingForHour(now.getHours());
  const levelMeta = currentLesson
    ? LEVELS[currentLesson.meta.level]
    : LEVELS[FALLBACK_LEVEL];
  const upNextLevelName = upNext[0]
    ? LEVELS[upNext[0].meta.level as LevelId].name
    : levelMeta.name;
  const doneInCurrentLevel = currentLesson
    ? (levelDone[currentLesson.meta.level] ?? 0)
    : 0;
  const remainingInLevel = Math.max(
    levelMeta.totalConcepts - doneInCurrentLevel,
    0,
  );
  const lessonProgressPct = currentLesson
    ? Math.round((doneInCurrentLevel / levelMeta.totalConcepts) * 100)
    : 0;
  const engaged = Boolean(user && totalCompleted > 0);
  const lastActiveLabel = formatLastActiveLabel(lastActiveDate, now);
  const continueBlurb = currentLesson
    ? lessonBlurb(currentLesson.meta.whyThisMatters)
    : null;
  const stepInLevel = Math.min(
    doneInCurrentLevel + 1,
    levelMeta.totalConcepts,
  );
  const structureLabel = currentLesson
    ? lessonStructureLabel(currentLesson)
    : "";
  const habit = streakHabitLine({
    signedIn: Boolean(user),
    lastActiveDate,
    streakCurrent,
    continueTimeMin: currentLesson?.meta.timeMin ?? 5,
    now,
  });
  const handoff =
    upNext.length === 0
      ? resolvePathHandoff(
          path,
          completed,
          currentLesson?.meta.level ?? null,
        )
      : null;
  const needsWork = recentProjects.find((p) => p.statusTone === "fail") ?? null;

  const enrolledRows = Object.entries(followingMap)
    .map(([slug, selectedAt]) => {
      const p = getPathBySlug(slug);
      if (!p || p.status !== "live") return null;
      return {
        path: p,
        progress: pathProgressFraction(p, completed),
        active: p.slug === path.slug,
        daysOnPath: pathDaysOnPath(p, completed, now),
        selectedAt,
      };
    })
    .filter((row): row is NonNullable<typeof row> => row != null)
    .sort((a, b) => b.selectedAt.getTime() - a.selectedAt.getTime())
    .map(({ selectedAt: _s, ...row }) => row);

  const accountDays =
    user?.createdAt != null ? daysOnSince(user.createdAt, now) : null;
  const pathDaysOnActive = pathDaysOnPath(path, completed, now);

  return (
    <main className={HUB_MAIN_CLASS}>
      <div className={HUB_NARROW_CLASS}>
        <PageHeader
          className="mb-5"
          title={
            user && firstName ? `${greeting}, ${firstName}.` : `${greeting}.`
          }
          description={
            user ? (
              remainingInLevel > 0 ? (
                <>
                  One clear next step —{" "}
                  <b className="text-brand-violet">{remainingInLevel}</b>{" "}
                  {remainingInLevel === 1 ? "lesson" : "lessons"} left in{" "}
                  {levelMeta.name}.
                </>
              ) : (
                <>Level clear. Review anytime or open your path.</>
              )
            ) : (
              <>
                Start the path free —{" "}
                <Link
                  href={SIGNIN_HREF}
                  className="font-bold text-brand-violet hover:underline"
                >
                  sign in
                </Link>{" "}
                to save progress.
              </>
            )
          }
          actions={
            <div className="flex flex-col items-end gap-0.5 text-right">
              <span className="font-mono text-[13px] text-ink-fainter">
                {formatHeaderDate(now)}
              </span>
              {accountDays != null ? (
                <span className="font-mono text-[11px] font-bold tracking-[0.04em] text-ink-secondary">
                  {formatAccountTenure(accountDays)}
                </span>
              ) : null}
            </div>
          }
        />

        {currentLesson ? (
          <ContinueBand
            engaged={engaged}
            timeMin={currentLesson.meta.timeMin}
            lastActiveLabel={lastActiveLabel}
            stepInLevel={stepInLevel}
            levelTotal={levelMeta.totalConcepts}
            levelName={levelMeta.name}
            doneInLevel={doneInCurrentLevel}
            order={currentLesson.meta.order}
            title={currentLesson.meta.title}
            blurb={continueBlurb}
            structureLabel={structureLabel}
            progressPct={lessonProgressPct}
            daysOnPath={pathDaysOnActive}
            continueHref={continueHref}
            pathHref={pathHref}
          />
        ) : (
          <p className="mb-5 rounded-[16px] bg-elevated/70 px-5 py-6 text-[14px] leading-relaxed text-ink-secondary ring-1 ring-divider">
            No lessons are available yet. Check back soon, or{" "}
            <Link
              href="/paths"
              className="font-bold text-brand-violet hover:underline"
            >
              browse paths
            </Link>
            .
          </p>
        )}

        <DashboardPulse
          signedIn={Boolean(user)}
          streak={streakCurrent}
          lessonsLabel={`${totalCompleted}/${totalLessons}`}
          projectsLabel={String(projectsDone)}
          pathPctLabel={pathPct != null ? `${pathPct}%` : "—"}
          pathHref={pathHref}
          habit={habit}
          continueHref={continueHref}
        />

        {needsWork ? <NeedsWorkBanner project={needsWork} /> : null}

        <DashboardWorkGrid
          levelName={upNextLevelName}
          pathHref={pathHref}
          upNext={upNext}
          handoff={handoff}
          continueHref={continueHref}
          enrolledRows={enrolledRows}
          projectCta={projectCta}
          recentProjects={recentProjects}
          signedIn={Boolean(user)}
        />
      </div>
    </main>
  );
}
