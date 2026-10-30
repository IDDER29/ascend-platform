import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { durationLabel } from "@/lib/paths/paths-v2-model";
import { siteStats } from "@/lib/site/site-data";
import { CATALOG_HREF, OPEN_SOURCE_HREF } from "@/lib/site/site-nav";
import { SiteShell } from "./site-shell";
import { PageIntro, StartBand, WRAP } from "./site-ui";

const A = "font-semibold text-[var(--coach-ink)] underline underline-offset-2";

export function FaqPage() {
  const stats = siteStats();
  const faqs: { q: string; a: React.ReactNode }[] = [
    {
      q: "Is Ascend free?",
      a: "Yes. Every lesson, Practice and every project is free, and there's no paid plan.",
    },
    {
      q: "Do I need an account?",
      a: "No. You can read every lesson and use Practice without one; your progress is then kept in this browser. A free account saves it across devices and gives you a Today page, a streak and a profile.",
    },
    {
      q: "What do I need to know before starting?",
      a: "Nothing, if you start with Foundations: it begins with what a bit is. Systems Programmer builds on Foundations, so do that first unless bits and logic gates are already familiar.",
    },
    {
      q: "How long does it take?",
      a: `Lessons take four to twelve minutes. Today there are ${stats.lessons} of them, ${durationLabel(stats.minutes)} of reading in all, plus projects. At one lesson a day, that's about a month.`,
    },
    {
      q: "Do I need to install anything?",
      a: "Not to read or practise: a browser is enough, on a phone too. For the projects you'll write and run real code, so you'll want a computer with a terminal and a C compiler. Each project's brief says what it needs.",
    },
    {
      q: "Is there a certificate?",
      a: "No. Your profile shows what you finished and links to the projects you built, which says more than a certificate would.",
    },
    {
      q: "What does “coming soon” mean on a path?",
      a: (
        <>
          It&apos;s planned but not written yet. Its page shows what it will cover. Right now Foundations and Systems
          Programmer are open;{" "}
          <Link href={CATALOG_HREF} className={A}>
            see every path
          </Link>
          .
        </>
      ),
    },
    {
      q: "Why are there no levels or XP?",
      a: "Because they reward time spent, not things learned. Topics go by their names, your progress counts lessons you finished, and badges are each earned by something specific you did.",
    },
    {
      q: "What do you do with my data?",
      a: (
        <>
          An account stores your name, email, a hashed password and your progress. Nothing is sold or shared. Read the{" "}
          <Link href="/privacy" className={A}>
            privacy page
          </Link>
          .
        </>
      ),
    },
    {
      q: "I found a mistake in a lesson.",
      a: (
        <>
          Thank you. Use the Report an issue link at the bottom of the lesson, or fix it yourself:{" "}
          <Link href={OPEN_SOURCE_HREF} className={A}>
            here&apos;s how
          </Link>
          .
        </>
      ),
    },
  ];

  return (
    <SiteShell>
      <PageIntro
        title="Questions, answered."
        lead="The things people ask before they start. Anything missing? Ask on GitHub."
      />
      <section aria-label="Questions" className={`${WRAP} pb-12 sm:pb-16`}>
        <div className="max-w-[820px] divide-y-2 divide-[var(--coach-divider)] rounded-[24px] border-2 border-[var(--coach-border)] bg-[var(--coach-surface)]">
          {faqs.map((f) => (
            <details key={f.q} className="group">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[17px] font-bold sm:px-7 [&::-webkit-details-marker]:hidden">
                {f.q}
                <ChevronDown
                  size={20}
                  strokeWidth={2.4}
                  aria-hidden
                  className="shrink-0 text-[var(--coach-ink-muted)] transition-transform group-open:rotate-180 motion-reduce:transition-none"
                />
              </summary>
              <p className="m-0 max-w-[68ch] px-5 pb-5 text-[16px] leading-relaxed text-[var(--coach-ink-secondary)] sm:px-7">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </section>
      <StartBand />
    </SiteShell>
  );
}
