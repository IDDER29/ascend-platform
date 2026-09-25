import Link from "next/link";
import type { ReactNode } from "react";
import {
  Flame,
  CheckCircle2,
  ChevronRight,
  CircuitBoard,
  Route,
} from "lucide-react";
import type { Lesson } from "@/lib/content/schema";
import { Button } from "@/components/ui/button";
import {
  EnrolledPathsPanel,
  type EnrolledPathRow,
} from "@/components/dashboard/learner-standing";
import {
  githubHref,
  lessonBlurb,
  type NextProjectCta,
  type PathHandoff,
  type RecentProject,
} from "@/lib/dashboard/continue";
import { formatPathTenure } from "@/lib/dashboard/tenure";
import { pathItemRole } from "@/components/paths/path-outline-marks";
import { lessonHref } from "@/lib/paths/lesson-urls";
import { SIGNIN_HREF } from "@/lib/routes";
import { cn } from "@/lib/cn";

function BandArrow() {
  return (
    <svg
      width="17"
      height="17"
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

function GitHubMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M12 2C6.477 2 2 6.586 2 12.253c0 4.53 2.865 8.37 6.839 9.723.5.094.683-.222.683-.493 0-.243-.009-.888-.014-1.743-2.782.618-3.369-1.38-3.369-1.38-.455-1.184-1.11-1.5-1.11-1.5-.908-.637.069-.624.069-.624 1.004.072 1.533 1.057 1.533 1.057.892 1.568 2.341 1.115 2.91.853.091-.664.35-1.115.636-1.372-2.22-.259-4.555-1.141-4.555-5.078 0-1.121.39-2.039 1.029-2.758-.103-.26-.446-1.302.098-2.714 0 0 .84-.276 2.75 1.054A9.34 9.34 0 0 1 12 7.14c.85.004 1.705.117 2.504.344 1.909-1.33 2.747-1.054 2.747-1.054.546 1.412.203 2.454.1 2.714.64.72 1.028 1.637 1.028 2.758 0 3.947-2.339 4.816-4.566 5.07.359.317.679.943.679 1.901 0 1.372-.012 2.477-.012 2.813 0 .274.18.593.688.492C19.138 20.62 22 16.78 22 12.253 22 6.586 17.523 2 12 2Z" />
    </svg>
  );
}

/** Tiny background cue — sits behind copy, never a separate module. */
function HeroSubjectCue() {
  return (
    <div
      className="pointer-events-none absolute inset-y-0 right-0 hidden w-[42%] max-w-[380px] opacity-[0.14] lg:block"
      aria-hidden
    >
      <svg
        viewBox="0 0 240 140"
        className="h-full w-full text-white"
        preserveAspectRatio="xMaxYMid meet"
        fill="none"
      >
        <rect
          x="0"
          y="55"
          width="240"
          height="28"
          fill="currentColor"
          fillOpacity="0.12"
        />
        <line
          x1="0"
          y1="42"
          x2="240"
          y2="42"
          stroke="currentColor"
          strokeOpacity="0.45"
          strokeDasharray="4 4"
        />
        <line
          x1="0"
          y1="96"
          x2="240"
          y2="96"
          stroke="currentColor"
          strokeOpacity="0.45"
          strokeDasharray="4 4"
        />
        <path
          d="M8 108 L70 108 Q92 108 102 72 Q112 28 140 28 L228 28"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="176" cy="28" r="4" fill="currentColor" />
      </svg>
    </div>
  );
}

/**
 * Level mastery ring — Phosphor path-ring language on the Continue band:
 * brand green→teal→gold arc, quiet frosted disc, bold % center.
 * Path tenure sits under the label — never replaces the %.
 */
function LevelMasteryRing({
  progressPct,
  daysOnPath,
  size = 128,
}: {
  progressPct: number;
  /** Days since path enter (1 = today). Shown as caption under the label. */
  daysOnPath?: number | null;
  size?: number;
}) {
  const pct = Math.min(100, Math.max(0, progressPct));
  const stroke = 11;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  // Tiny phosphor tip at 0% so the ring never looks dead.
  const visualPct = pct === 0 ? 0.02 : pct / 100;
  const offset = c * (1 - visualPct);
  const gradientId = "dash-continue-mastery-ring";
  const inset = stroke + 8;
  const tenure =
    daysOnPath != null && daysOnPath > 0
      ? formatPathTenure(daysOnPath)
      : null;

  return (
    <div
      className="flex flex-none flex-col items-center gap-2"
      role="group"
      aria-label={
        tenure
          ? `Level mastery ${pct} percent · ${tenure}`
          : `Level mastery ${pct} percent`
      }
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="absolute inset-0 -rotate-90"
          aria-hidden
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--brand-violet)" />
              <stop offset="55%" stopColor="var(--brand-magenta)" />
              <stop offset="100%" stopColor="var(--brand-orange)" />
            </linearGradient>
          </defs>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            className="text-white/28"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-500 ease-out"
            style={{
              filter: "drop-shadow(0 0 8px rgba(212, 160, 23, 0.28))",
            }}
          />
        </svg>

        <div
          className="absolute flex items-center justify-center rounded-full border border-white/25 bg-[#f2f7f4]/[0.16] shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_8px_20px_rgba(0,0,0,0.08)] backdrop-blur-[3px]"
          style={{ inset }}
        >
          <span className="font-display text-[32px] font-extrabold leading-none tracking-[-0.03em] text-white">
            {pct}
            <span className="ml-0.5 align-top text-[14px] font-bold text-white/70">
              %
            </span>
          </span>
        </div>
      </div>
      <div className="flex flex-col items-center gap-0.5 text-center">
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-white/70">
          Level mastery
        </span>
        {tenure ? (
          <span className="font-mono text-[11.5px] font-medium normal-case tracking-normal text-white/80">
            {tenure}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export function ContinueBand({
  engaged,
  timeMin,
  lastActiveLabel,
  stepInLevel,
  levelTotal,
  levelName,
  doneInLevel,
  order,
  title,
  blurb,
  structureLabel,
  progressPct,
  daysOnPath,
  continueHref,
  pathHref,
}: {
  engaged: boolean;
  timeMin: number;
  lastActiveLabel: string | null;
  stepInLevel: number;
  levelTotal: number;
  levelName: string;
  doneInLevel: number;
  order: number;
  title: string;
  blurb: string | null;
  structureLabel: string;
  progressPct: number;
  daysOnPath?: number | null;
  continueHref: string;
  pathHref: string;
}) {
  return (
    <section
      aria-labelledby="continue-heading"
      className="relative mb-5 overflow-hidden rounded-[20px] bg-brand-gradient p-5 text-white shadow-[0_12px_28px_rgba(13,159,110,0.18)] sm:p-6 lg:p-7"
    >
      <div className="pointer-events-none absolute -right-10 -top-14 h-[160px] w-[160px] rounded-full bg-white/[0.08]" />
      <HeroSubjectCue />

      <div className="relative z-[1] flex flex-col gap-4">
        {/* Top: status + lesson index */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 font-mono text-[10.5px] font-bold uppercase tracking-[0.08em] text-white/95">
            <span className="h-1.5 w-1.5 rounded-full bg-white" aria-hidden />
            {engaged ? "In progress" : "Start here"}
            <span className="text-white/55">·</span>
            {timeMin} min
          </span>
          <span className="font-mono text-[11.5px] text-white/75">
            <span className="font-bold text-white/90">
              {String(order).padStart(2, "0")}
            </span>
            <span className="mx-1.5 text-white/40">·</span>
            Lesson {stepInLevel} of {levelTotal}
            <span className="mx-1.5 text-white/40">·</span>
            {levelName}
            <span className="mx-1.5 text-white/40">·</span>
            {doneInLevel}/{levelTotal} done
          </span>
          {lastActiveLabel ? (
            <span className="font-mono text-[11px] text-white/60">
              {lastActiveLabel}
            </span>
          ) : null}
        </div>

        {/* Title left · mastery ring anchored + centered in the right zone */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <div className="min-w-0 w-full sm:max-w-[36rem]">
            <h2
              id="continue-heading"
              className="font-display text-[24px] font-extrabold leading-tight tracking-tight sm:text-[28px]"
            >
              {title}
            </h2>
            {blurb ? (
              <p className="mt-2 max-w-[52ch] text-[14.5px] leading-relaxed text-white/80">
                {blurb}
              </p>
            ) : null}
            <p className="mt-2 font-mono text-[11px] text-white/55">
              In this lesson · {structureLabel}
            </p>
          </div>

          <div className="flex w-full justify-start sm:w-[46%] sm:max-w-[300px] sm:flex-none sm:justify-center">
            <LevelMasteryRing
              progressPct={progressPct}
              daysOnPath={daysOnPath}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button href={continueHref} variant="invert" size="md">
            {engaged ? "Resume lesson" : "Start lesson"}
            <BandArrow />
          </Button>
          <Button
            href={pathHref}
            variant="ghost"
            size="md"
            className="border border-white/25 text-white hover:bg-white/12 hover:text-white"
          >
            Path outline
          </Button>
        </div>
      </div>
    </section>
  );
}

export function DashboardPulse({
  streak,
  lessonsLabel,
  projectsLabel,
  pathPctLabel,
  pathHref,
  signedIn,
  habit,
  continueHref,
}: {
  streak: number;
  lessonsLabel: string;
  projectsLabel: string;
  pathPctLabel: string;
  pathHref: string;
  signedIn: boolean;
  habit: { text: string; secured: boolean } | null;
  continueHref: string;
}) {
  return (
    <div className="mb-8 border-b border-divider pb-5" aria-label="Progress at a glance">
      <div className="flex flex-wrap gap-x-6 gap-y-3">
        <Pulse
          icon={<Flame size={15} className="fill-current text-streak-text" />}
          value={signedIn ? String(streak) : "—"}
          label="Streak"
        />
        <Pulse
          icon={<CheckCircle2 size={15} className="text-brand-violet" />}
          value={signedIn ? lessonsLabel : "—"}
          label="Lessons"
        />
        <Pulse
          icon={<CircuitBoard size={15} className="text-ink-secondary" />}
          value={signedIn ? projectsLabel : "—"}
          label="Projects"
        />
        <Pulse
          icon={<Route size={15} className="text-brand-violet" />}
          value={pathPctLabel}
          label="Path"
          href={pathHref}
        />
      </div>
      {habit ? (
        <p className="mt-3 text-[13px] leading-snug text-ink-secondary">
          {habit.secured ? (
            habit.text
          ) : (
            <>
              {habit.text}{" "}
              <Link
                href={continueHref}
                className="font-bold text-brand-violet hover:underline"
              >
                Resume
              </Link>
            </>
          )}
        </p>
      ) : null}
    </div>
  );
}

function Pulse({
  value,
  label,
  icon,
  href,
}: {
  value: string;
  label: string;
  icon?: ReactNode;
  href?: string;
}) {
  const inner = (
    <>
      {icon ? <span className="flex-none">{icon}</span> : null}
      <span className="font-display text-[17px] font-extrabold leading-none text-ink">
        {value}
      </span>
      <span className="text-[12px] text-ink-fainter">{label}</span>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="inline-flex items-center gap-2 transition-colors hover:text-brand-violet"
      >
        {inner}
      </Link>
    );
  }

  return <div className="inline-flex items-center gap-2">{inner}</div>;
}

/** Real urgency only — failed project submission, never fake deadlines. */
export function NeedsWorkBanner({ project }: { project: RecentProject }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-[16px] bg-ink px-4 py-3.5 text-bg dark:bg-elevated dark:text-ink dark:ring-1 dark:ring-divider sm:px-5">
      <div className="min-w-0">
        <p className="font-mono text-[10.5px] font-bold uppercase tracking-[0.1em] text-bg/60 dark:text-ink-fainter">
          Needs another pass
        </p>
        <p className="mt-0.5 truncate text-[14px] font-bold">{project.title}</p>
      </div>
      <Button
        href={project.href}
        variant="invert"
        size="sm"
        className="dark:bg-brand-gradient dark:text-white dark:shadow-none"
      >
        Open result
        <BandArrow />
      </Button>
    </div>
  );
}

export function PathHandoffCard({ handoff }: { handoff: PathHandoff }) {
  return (
    <div
      className={cn(
        "rounded-[16px] p-5 ring-1",
        handoff.kind === "path-complete"
          ? "bg-elevated/70 ring-divider"
          : "bg-ink text-bg ring-transparent dark:bg-elevated dark:text-ink dark:ring-divider",
      )}
    >
      <p
        className={cn(
          "font-mono text-[10.5px] font-bold uppercase tracking-[0.1em]",
          handoff.kind === "path-complete"
            ? "text-ink-fainter"
            : "text-bg/55 dark:text-ink-fainter",
        )}
      >
        {handoff.eyebrow}
      </p>
      <h3
        className={cn(
          "mt-1.5 font-display text-[17px] font-extrabold leading-snug",
          handoff.kind === "path-complete" ? "text-ink" : "text-bg dark:text-ink",
        )}
      >
        {handoff.title}
      </h3>
      <p
        className={cn(
          "mt-1.5 max-w-[44ch] text-[13.5px] leading-relaxed",
          handoff.kind === "path-complete"
            ? "text-ink-secondary"
            : "text-bg/75 dark:text-ink-secondary",
        )}
      >
        {handoff.body}
      </p>
      <div className="mt-4">
        <Button
          href={handoff.href}
          variant={handoff.kind === "path-complete" ? "secondary" : "invert"}
          size="sm"
          className={
            handoff.kind === "path-complete"
              ? undefined
              : "dark:bg-brand-gradient dark:text-white dark:shadow-none"
          }
        >
          {handoff.cta}
          <BandArrow />
        </Button>
      </div>
    </div>
  );
}

export function UpNextSection({
  levelName,
  pathHref,
  lessons,
  handoff,
  continueHref,
}: {
  levelName: string;
  pathHref: string;
  lessons: Lesson[];
  handoff: PathHandoff | null;
  continueHref: string;
}) {
  const queueMin = lessons.reduce((sum, l) => sum + l.meta.timeMin, 0);

  return (
    <section aria-labelledby="up-next-heading">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-fainter">
            Next
            {lessons.length > 0 ? (
              <>
                <span className="mx-1.5 text-divider">·</span>
                {queueMin} min queued
              </>
            ) : handoff ? (
              <>
                <span className="mx-1.5 text-divider">·</span>
                handoff
              </>
            ) : null}
          </p>
          <h2
            id="up-next-heading"
            className="mt-0.5 font-display text-[16px] font-extrabold text-ink sm:text-[17px]"
          >
            {lessons.length > 0
              ? `Up next in ${levelName}`
              : handoff
                ? "What's next"
                : `Up next in ${levelName}`}
          </h2>
        </div>
        <Link
          href={pathHref}
          className="flex items-center gap-1 text-[12.5px] font-bold text-brand-violet transition-colors hover:text-ink"
        >
          Full path
          <ChevronRight size={13} aria-hidden />
        </Link>
      </div>
      {lessons.length > 0 ? (
        <ul className="flex flex-col gap-1">
          {lessons.map((lesson, i) => {
            const href = lessonHref(lesson.meta.level, lesson.meta.slug);
            const isNext = i === 0;
            const role = pathItemRole({
              slug: lesson.meta.slug,
              title: lesson.meta.title,
            });
            return (
              <li key={`${lesson.meta.level}-${lesson.meta.slug}`}>
                <Link
                  href={href}
                  className={cn(
                    "group flex items-center gap-3.5 rounded-[14px] px-2.5 py-3 transition-colors duration-150",
                    isNext
                      ? "bg-elevated/70 ring-1 ring-divider hover:bg-elevated"
                      : "hover:bg-elevated/80",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-[38px] w-[38px] flex-none items-center justify-center rounded-[11px] font-mono text-[13px] font-extrabold",
                      isNext
                        ? "bg-xp-bg text-xp-text"
                        : "bg-elevated text-ink-fainter",
                    )}
                  >
                    {String(lesson.meta.order).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <div className="truncate text-[14.5px] font-bold text-ink">
                        {lesson.meta.title}
                      </div>
                      {isNext ? (
                        <span className="rounded-full bg-xp-bg px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.06em] text-xp-text">
                          Up next
                        </span>
                      ) : null}
                      {role === "project" ? (
                        <span className="rounded-full bg-elevated px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.06em] text-ink-fainter">
                          Project
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      <span className="font-mono text-xs text-ink-fainter">
                        {lesson.meta.timeMin} min
                      </span>
                      {isNext && lesson.meta.learningOutcomes[0] ? (
                        <span className="min-w-0 text-[12.5px] leading-snug text-ink-secondary">
                          {lessonBlurb(lesson.meta.learningOutcomes[0], 72)}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <ChevronRight
                    size={16}
                    className="flex-none text-ink-fainter transition-colors duration-150 group-hover:text-ink"
                    aria-hidden
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      ) : handoff ? (
        <PathHandoffCard handoff={handoff} />
      ) : (
        <div className="rounded-[14px] bg-elevated/50 px-4 py-5 ring-1 ring-divider">
          <p className="text-[13.5px] leading-relaxed text-ink-secondary">
            This is the last lesson in {levelName}. Finish it to unlock what
            comes next on your path.
          </p>
          <div className="mt-3">
            <Button href={continueHref} variant="secondary" size="sm">
              Resume lesson
              <BandArrow />
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}

export function ProofAside({
  projectCta,
  recentProjects,
  signedIn,
}: {
  projectCta: NextProjectCta;
  recentProjects: RecentProject[];
  signedIn: boolean;
}) {
  return (
    <section aria-labelledby="proof-heading">
      <div className="mb-3">
        <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-fainter">
          Proof
        </p>
        <h2
          id="proof-heading"
          className="mt-0.5 font-display text-[16px] font-extrabold text-ink"
        >
          Build &amp; prove
        </h2>
      </div>

      <div className="rounded-[16px] bg-elevated/70 p-4 ring-1 ring-divider">
        <span className="inline-flex items-center gap-1.5 font-mono text-[10.5px] font-bold uppercase tracking-[0.08em] text-brand-violet">
          <CircuitBoard size={13} strokeWidth={2} aria-hidden />
          {projectCta.kind === "shellforge"
            ? "Capstone"
            : projectCta.kind === "project"
              ? "Next project"
              : "Projects"}
        </span>
        <h3 className="mt-2 font-display text-[15px] font-extrabold leading-snug text-ink">
          {projectCta.title}
        </h3>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-secondary">
          {projectCta.blurb}
        </p>
        <div className="mt-3">
          <Button
            href={signedIn ? projectCta.href : SIGNIN_HREF}
            variant="secondary"
            size="sm"
          >
            {signedIn
              ? projectCta.kind === "explore"
                ? "Open path"
                : "Launch"
              : "Sign in"}
            <BandArrow />
          </Button>
        </div>
      </div>

      {signedIn && recentProjects.length > 0 ? (
        <ul className="mt-4 flex flex-col gap-1">
          <li className="px-0.5 pb-1 font-mono text-[10.5px] font-bold uppercase tracking-[0.1em] text-ink-fainter">
            Recent
          </li>
          {recentProjects.map((project) => (
            <li key={project.id}>
              <div className="flex items-center gap-3 rounded-[14px] px-2.5 py-2.5 transition-colors duration-150 hover:bg-elevated/80">
                <span
                  className={cn(
                    "flex h-9 w-9 flex-none items-center justify-center rounded-xl font-mono text-[10px] font-bold uppercase",
                    project.statusTone === "pass" && "bg-xp-bg text-xp-text",
                    project.statusTone === "fail" &&
                      "bg-elevated text-ink-secondary ring-1 ring-divider",
                    project.statusTone === "neutral" &&
                      "bg-elevated text-ink-fainter",
                  )}
                >
                  {project.statusTone === "pass"
                    ? "OK"
                    : project.statusTone === "fail"
                      ? "Fix"
                      : "—"}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13.5px] font-bold text-ink">
                    {project.title}
                  </div>
                  <div className="font-mono text-[11px] text-ink-fainter">
                    {project.statusLabel}
                    {project.meta ? (
                      <>
                        <span className="mx-1 text-divider">·</span>
                        {project.meta}
                      </>
                    ) : null}
                  </div>
                </div>
                <Link
                  href={project.href}
                  className="text-[12px] font-bold text-brand-violet"
                >
                  Open
                </Link>
                {project.repoUrl ? (
                  <a
                    href={githubHref(project.repoUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink-fainter hover:text-ink"
                    aria-label="GitHub repo"
                  >
                    <GitHubMark className="h-3.5 w-3.5" />
                  </a>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      ) : signedIn ? (
        <p className="mt-3 px-0.5 text-[12.5px] leading-relaxed text-ink-fainter">
          Submissions and completed projects will stack here as proof.
        </p>
      ) : null}
    </section>
  );
}

export function DashboardWorkGrid({
  levelName,
  pathHref,
  upNext,
  handoff,
  continueHref,
  enrolledRows,
  projectCta,
  recentProjects,
  signedIn,
}: {
  levelName: string;
  pathHref: string;
  upNext: Lesson[];
  handoff: PathHandoff | null;
  continueHref: string;
  enrolledRows: EnrolledPathRow[];
  projectCta: NextProjectCta;
  recentProjects: RecentProject[];
  signedIn: boolean;
}) {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-start">
      <UpNextSection
        levelName={levelName}
        pathHref={pathHref}
        lessons={upNext}
        handoff={handoff}
        continueHref={continueHref}
      />
      <aside className="flex flex-col gap-8 lg:border-l lg:border-divider lg:pl-8">
        <EnrolledPathsPanel rows={enrolledRows} />
        <ProofAside
          projectCta={projectCta}
          recentProjects={recentProjects}
          signedIn={signedIn}
        />
      </aside>
    </div>
  );
}
