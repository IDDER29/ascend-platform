import type { Metadata } from "next";
import Link from "next/link";
import { OnboardingForm, type StartOption } from "@/components/onboarding-v2/onboarding-form";
import { PathGlyph } from "@/components/paths-v2/path-parts";
import { BrandMark, WRAP } from "@/components/site/site-ui";
import { getCurrentUser } from "@/lib/auth/auth";
import { loadPublicPaths } from "@/lib/paths/paths-v2-data";
import { getPracticeDailyGoal } from "@/lib/practice/queries";

export const metadata: Metadata = {
  title: "Get started — Ascend",
  robots: { index: false, follow: false },
};

/** Who each open path is the right start for. */
const FOR_WHOM: Record<string, string> = {
  foundations: "New to how computers work? Start here: it begins with what a bit is.",
  "systems-programmer": "Already know binary and logic gates? Start with the CPU, memory and C.",
};

export default async function OnboardingPage() {
  const user = await getCurrentUser();
  const goal = user ? await getPracticeDailyGoal(user.id).catch(() => null) : null;
  const starts: StartOption[] = loadPublicPaths("/paths")
    .views.filter((v) => !v.soon)
    .map((v) => {
      const first = v.courses.flatMap((c) => c.sections.flatMap((s) => s.items))[0];
      return {
        slug: v.slug,
        title: v.title,
        icon: <PathGlyph slug={v.slug} size={20} />,
        forWhom: FOR_WHOM[v.slug] ?? v.pitch,
        firstLesson: first ? { title: first.title, timeMin: first.timeMin } : null,
      };
    });
  const firstName = user?.name.trim().split(/\s+/)[0];

  return (
    <div className="practice-coach-v2 flex min-h-dvh flex-col bg-[var(--coach-bg)] font-sans text-[var(--coach-ink)] antialiased">
      <header className={`${WRAP} flex h-16 items-center justify-between`}>
        <Link href="/" className="flex items-center gap-2.5 text-[var(--coach-ink)] no-underline">
          <BrandMark />
          <span className="font-display text-[20px] font-extrabold tracking-[-0.02em]">Ascend</span>
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex min-h-10 items-center text-[14.5px] font-semibold text-[var(--coach-ink-muted)] no-underline hover:text-[var(--coach-ink)]"
        >
          Skip for now
        </Link>
      </header>
      <main className={`${WRAP} max-w-[880px] flex-1 pb-20 pt-8 sm:pt-14`}>
        <h1 className="m-0 font-display text-[38px] font-extrabold leading-[1.04] tracking-[-0.04em] [text-wrap:balance] sm:text-[52px]">
          {firstName ? `Welcome, ${firstName}.` : "Welcome to Ascend."}
        </h1>
        <p className="m-0 mt-4 max-w-[56ch] text-[17px] leading-relaxed text-[var(--coach-ink-secondary)]">
          Two quick choices, then your first lesson.
        </p>
        <div className="mt-10">
          <OnboardingForm userId={user?.id ?? null} starts={starts} initialGoal={goal} />
        </div>
      </main>
    </div>
  );
}
