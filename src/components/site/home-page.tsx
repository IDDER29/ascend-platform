import { Suspense } from "react";
import Link from "next/link";
import { BookOpen, Hammer, ListChecks, RotateCcw } from "lucide-react";
import { durationLabel } from "@/lib/paths/paths-v2-model";
import { FIRST_LESSON_HREF } from "@/lib/routes";
import { climbSteps, publicPaths, sampleCard, siteStats } from "@/lib/site/site-data";
import { CATALOG_HREF, HOW_IT_WORKS_HREF, OPEN_SOURCE_HREF, ABOUT_HREF } from "@/lib/site/site-nav";
import { Climb } from "./climb";
import { DeletedNotice } from "./deleted-notice";
import { PathTile } from "./path-tile";
import { SiteShell } from "./site-shell";
import { H2, LEAD, LIME_BTN, OUTLINE_ON_DARK_BTN, OUTLINE_BTN, Section, StartBand, WRAP } from "./site-ui";
import { TryCard } from "./try-card";

const LOOP = [
  {
    icon: BookOpen,
    title: "Read a short lesson",
    body: "Four to twelve minutes, with diagrams and code you can run in your head.",
  },
  {
    icon: ListChecks,
    title: "Check yourself",
    body: "A few questions at the end show what stuck and point back to what didn't.",
  },
  {
    icon: RotateCcw,
    title: "Practice brings it back",
    body: "Each idea becomes a card that returns just before you'd forget it.",
  },
  {
    icon: Hammer,
    title: "Build something real",
    body: "Projects along the way, and a working shell of your own at the end.",
  },
];

export function HomePage() {
  const stats = siteStats();
  const steps = climbSteps();
  const { views } = publicPaths();
  const live = views.filter((v) => !v.soon);
  const soon = views.length - live.length;
  const card = sampleCard("memmachine-01");

  return (
    <SiteShell>
      <Suspense>
        <DeletedNotice />
      </Suspense>
      <section aria-labelledby="hero-title" className={`${WRAP} pt-4 sm:pt-8`}>
        <div className="grid gap-10 overflow-hidden rounded-[28px] bg-[var(--coach-hero-bg)] px-5 py-10 text-[var(--coach-hero-ink)] sm:px-10 sm:py-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-center lg:gap-14 lg:px-14 lg:py-16">
          <div>
            <h1
              id="hero-title"
              className="animate-rise m-0 font-display text-[44px] font-extrabold leading-[0.98] tracking-[-0.045em] [text-wrap:balance] sm:text-[64px] lg:text-[72px]"
            >
              Learn how computers really work.
            </h1>
            <p className="m-0 mt-5 max-w-[34rem] text-[17px] leading-relaxed text-[var(--coach-hero-muted)] [text-wrap:pretty] sm:text-[19px]">
              Start from a single bit. Climb through logic, memory, C and the operating system, one short lesson at a
              time, until you can write your own shell.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href={FIRST_LESSON_HREF} className={LIME_BTN}>
                Start the first lesson
              </Link>
              <Link href={CATALOG_HREF} className={OUTLINE_ON_DARK_BTN}>
                See all paths
              </Link>
            </div>
            <p className="m-0 mt-5 text-[14px] text-[var(--coach-hero-muted)]">
              Free. No account needed to start. {stats.lessons} lessons, {durationLabel(stats.minutes)} of reading.
            </p>
          </div>
          <Climb steps={steps} />
        </div>
      </section>

      {card && (
        <Section
          id="try"
          title="Answer one now."
          lead="This is a real card from Practice. Get it wrong and it tells you why, then points you to the lesson that explains it."
        >
          <TryCard card={card} />
          <p className="m-0 mt-4 text-[15px] text-[var(--coach-ink-secondary)]">
            Every lesson adds cards like this one, {stats.cards} so far.{" "}
            <Link
              href={HOW_IT_WORKS_HREF}
              className="font-semibold text-[var(--coach-ink)] underline underline-offset-2"
            >
              How Practice decides when to show them
            </Link>
          </p>
        </Section>
      )}

      <section aria-labelledby="loop-title" className={`${WRAP} py-12 sm:py-16`}>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h2 id="loop-title" className={H2}>
            Every lesson works the same way.
          </h2>
          <Link href={HOW_IT_WORKS_HREF} className={`${OUTLINE_BTN} min-h-11 self-start text-[14.5px] sm:self-auto`}>
            How it works
          </Link>
        </div>
        <ol className="m-0 mt-8 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {LOOP.map((step, i) => (
            <li key={step.title} className="flex flex-col gap-3 border-t-2 border-[var(--coach-ink)] pt-4">
              <span className="flex items-center gap-2 text-[13px] font-semibold text-[var(--coach-ink-muted)]">
                <step.icon size={16} strokeWidth={2.4} aria-hidden />
                Step {i + 1}
              </span>
              <h3 className="m-0 text-[18px] font-bold leading-tight">{step.title}</h3>
              <p className="m-0 text-[15px] leading-relaxed text-[var(--coach-ink-secondary)]">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <Section
        id="paths"
        title="Start at the bottom, or pick a path."
        lead={`Foundations is where everyone begins. ${live.length > 1 ? "Systems Programmer builds on it, all the way to ShellForge." : ""}`}
      >
        <div className="grid gap-4 md:grid-cols-2">
          {live.map((p) => (
            <PathTile key={p.slug} path={p} />
          ))}
        </div>
        <p className="m-0 mt-4 text-[15px] text-[var(--coach-ink-secondary)]">
          {soon > 0 && <>{soon} more paths are on the way, from Linux to AI. </>}
          <Link href={CATALOG_HREF} className="font-semibold text-[var(--coach-ink)] underline underline-offset-2">
            See every path
          </Link>
        </p>
      </Section>

      <section aria-labelledby="open-title" className={`${WRAP} py-12 sm:py-16`}>
        <div className="grid gap-6 border-t-2 border-[var(--coach-border)] pt-10 lg:grid-cols-2 lg:gap-12">
          <h2 id="open-title" className={H2}>
            Built in the open, for people who want to know why.
          </h2>
          <div className="flex flex-col gap-4">
            <p className={LEAD}>
              Every lesson is a plain file on GitHub. Spot a mistake and you can fix it, or tell us in one click from
              the lesson itself. No levels to grind, no fake numbers: just what you&apos;ve learned and what you&apos;ll keep.
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-[15px] font-semibold">
              <Link href={ABOUT_HREF} className="text-[var(--coach-ink)] underline underline-offset-2">
                Why Ascend exists
              </Link>
              <Link href={OPEN_SOURCE_HREF} className="text-[var(--coach-ink)] underline underline-offset-2">
                Help improve a lesson
              </Link>
            </div>
          </div>
        </div>
      </section>

      <StartBand />
    </SiteShell>
  );
}
