import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { CurriculumLevelsPanel } from "@/components/curriculum/curriculum-levels-panel";
import { getAllLessons } from "@/lib/content/lessons";
import { LEVELS } from "@/lib/content/schema";
import { FIRST_LESSON_HREF, SIGNIN_HREF } from "@/lib/routes";
import { getRolePaths, pathHref, type PathDef } from "@/lib/paths/catalog";

const FOUNDATIONS_LEVEL = "level-00-bits-logic" as const;

/**
 * Foundations path page — curriculum lesson UX, differentiated chrome:
 * Phosphor continue band, no filter chips, slim side rail (progress + paths).
 */
export function FoundationsDetail({
  path,
  currentOrder,
  doneCount,
  signedIn,
}: {
  path: PathDef;
  currentOrder: number;
  doneCount: number;
  streakCurrent?: number;
  signedIn: boolean;
}) {
  const lessons = getAllLessons()
    .filter((l) => l.meta.level === FOUNDATIONS_LEVEL)
    .sort((a, b) => a.meta.order - b.meta.order);

  const levelMeta = LEVELS[FOUNDATIONS_LEVEL];
  const total = lessons.length || levelMeta.totalConcepts;
  const pathPct = total ? Math.round((doneCount / total) * 100) : 0;

  const safeOrder = lessons.some((l) => l.meta.order === currentOrder)
    ? currentOrder
    : (lessons[0]?.meta.order ?? 1);
  const current =
    lessons.find((l) => l.meta.order === safeOrder) ?? lessons[0] ?? null;

  const continueHref = current
    ? `/curriculum/${current.meta.level}/${current.meta.slug}`
    : FIRST_LESSON_HREF;

  const levelPanelData = [
    {
      id: FOUNDATIONS_LEVEL,
      name: "Foundations",
      short: levelMeta.short,
      timeLabel: levelMeta.timeLabel,
      totalConcepts: total,
      done: doneCount,
      accent: "bg-level-00",
    },
  ];

  const lessonsByLevel = {
    [FOUNDATIONS_LEVEL]: lessons.map((l) => ({
      level: l.meta.level,
      slug: l.meta.slug,
      title: l.meta.title,
      order: l.meta.order,
      timeMin: l.meta.timeMin,
    })),
  };

  const nextRoles = getRolePaths().filter((p) => p.requiresSlug === "foundations");

  return (
    <>
      <PageHeader
        eyebrow="Paths / Foundations"
        title={path.title}
        description={path.body}
      />

      {current ? (
        <div className="relative mb-6 overflow-hidden rounded-[22px] bg-brand-gradient p-7 text-white shadow-[0_18px_40px_rgba(13,159,110,0.22)]">
          <div className="pointer-events-none absolute -right-8 -top-[70px] h-[280px] w-[280px] rounded-full bg-white/[0.12] blur-[9px]" />
          <div className="relative flex flex-wrap items-center gap-6">
            <span className="flex h-[54px] w-[54px] flex-none items-center justify-center rounded-2xl border border-white/25 bg-white/15 font-mono text-lg font-bold">
              {String(current.meta.order).padStart(2, "0")}
            </span>
            <div className="min-w-[200px] flex-1">
              <div className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-white/85">
                {signedIn && doneCount > 0
                  ? "Pick up where you left off"
                  : "Start Foundations"}
              </div>
              <div className="mb-1 font-display text-[22px] font-extrabold tracking-tight">
                {current.meta.title}
              </div>
              <div className="text-[13px] text-white/90">
                Foundations · lesson {current.meta.order} of {total}
              </div>
            </div>
            <Button href={continueHref} variant="invert">
              {signedIn && doneCount > 0 ? "Continue" : "Start"}
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
            </Button>
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap items-start gap-6">
        <div className="min-w-0 flex-[100_1_520px]">
          <CurriculumLevelsPanel
            levels={levelPanelData}
            lessonsByLevel={lessonsByLevel}
            currentLevel={FOUNDATIONS_LEVEL}
            currentOrder={safeOrder}
            totalLessons={lessons.length}
            hideFilters
          />
        </div>

        <div className="flex w-full min-w-[290px] max-w-[372px] flex-1 flex-col gap-5">
          <Card hover={false} className="p-6 dark:bg-elevated">
            <div className="mb-3 font-display text-base font-extrabold text-ink">
              Your progress
            </div>
            {signedIn ? (
              <>
                <div className="mb-1 flex items-baseline justify-between gap-2">
                  <span className="font-display text-[28px] font-extrabold tracking-tight text-brand-violet">
                    {doneCount}
                    <span className="text-base font-bold text-ink-fainter">/{total}</span>
                  </span>
                  <span className="font-mono text-[12px] text-ink-fainter">{pathPct}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-elevated dark:bg-bg">
                  <div
                    className="h-full rounded-full bg-level-00"
                    style={{ width: `${pathPct}%` }}
                  />
                </div>
              </>
            ) : (
              <p className="text-[13.5px] leading-relaxed text-ink-secondary">
                Foundations stays open.{" "}
                <Link href={SIGNIN_HREF} className="font-bold text-brand-violet hover:underline">
                  Sign in
                </Link>{" "}
                to save progress.
              </p>
            )}
          </Card>

          <Card hover={false} className="p-6 dark:bg-elevated">
            <div className="mb-2 font-display text-[17px] font-extrabold text-ink">
              Choose your path forward
            </div>
            <p className="mb-4 text-[13px] leading-relaxed text-ink-secondary">
              After Foundations, train toward a role.
            </p>
            <ul className="flex flex-col gap-0.5">
              {nextRoles.map((role) => (
                <li key={role.slug}>
                  <Link
                    href={pathHref(role.slug)}
                    className="-mx-1.5 flex items-center gap-2 rounded-xl px-2.5 py-2.5 transition-colors hover:bg-xp-bg"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13.5px] font-bold text-ink">
                        {role.title}
                      </div>
                      <div className="font-mono text-[11px] text-ink-fainter">
                        {role.status === "live" ? "Open" : "Coming soon"}
                      </div>
                    </div>
                    <ChevronRight size={14} className="flex-none text-ink-fainter" />
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}
