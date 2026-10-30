import type { Metadata } from "next";
import Link from "next/link";
import { AchievementsBoard } from "@/components/achievements-v2/board";
import { HowBadgesWork } from "@/components/achievements-v2/how-badges-work";
import { UpNext } from "@/components/achievements-v2/up-next";
import { HUB_CONTENT_CLASS } from "@/components/ui/page-header";
import { loadAchievementsModel } from "@/lib/achievements/server-page-data";
import { SIGNIN_HREF, SIGNUP_HREF } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Achievements (v2) — Ascend",
  description: "The badges you've earned on the climb, and what's worth going for next.",
};

const MAIN =
  "practice-coach-v2 flex-1 overflow-x-clip bg-[var(--coach-bg)] px-5 py-8 font-sans text-[var(--coach-ink)] antialiased sm:px-10";

const TWO_COLUMNS =
  "grid w-full min-w-0 grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(250px,280px)]";

export default async function AchievementsV2Page() {
  const loaded = await loadAchievementsModel();

  if (!loaded) {
    return (
      <main className={MAIN}>
        <div className={`${HUB_CONTENT_CLASS} flex flex-col gap-4`}>
          <h1 className="m-0 font-display text-[28px] font-extrabold tracking-[-0.03em]">Achievements</h1>
          <p className="m-0 max-w-[520px] text-[15px] leading-relaxed text-[var(--coach-ink-secondary)]">
            Sign in to earn badges for finishing levels, shipping projects and holding what you learned.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={SIGNIN_HREF}
              className="inline-flex h-11 items-center rounded-xl bg-[var(--coach-lime)] px-5 text-[14px] font-bold uppercase tracking-[0.02em] text-[var(--coach-lime-ink)] no-underline shadow-[0_4px_0_var(--coach-lime-shadow)]"
            >
              Sign in
            </Link>
            <Link href={SIGNUP_HREF} className="inline-flex h-11 items-center px-2 text-[14px] font-semibold text-[var(--coach-ink)]">
              Create account
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const { model, sample } = loaded;
  return (
    <main className={MAIN}>
      <div className={`${HUB_CONTENT_CLASS} flex flex-col gap-8`}>
        {sample ? (
          // DEVELOPMENT PREVIEW: guests see the sample learner. Turned off with the profile's switch.
          <p className="m-0 rounded-xl border-2 border-dashed border-[var(--coach-border-strong)] px-4 py-3 text-[13.5px] leading-relaxed text-[var(--coach-ink-secondary)]">
            <strong className="font-semibold text-[var(--coach-ink)]">Development preview.</strong> You&apos;re not
            signed in, so these are a sample learner&apos;s badges.{" "}
            <Link href={SIGNIN_HREF} className="font-semibold text-[var(--coach-ink)] underline underline-offset-2">
              Sign in
            </Link>{" "}
            to see yours.
          </p>
        ) : null}

        <header className="flex flex-col gap-1.5">
          <h1 className="m-0 font-display text-[30px] font-extrabold leading-tight tracking-[-0.035em] sm:text-[36px]">
            Achievements
          </h1>
          <p className="m-0 max-w-[620px] text-[15.5px] leading-relaxed text-[var(--coach-ink-secondary)] [text-wrap:pretty]">
            {model.headline}
          </p>
        </header>

        <div className={TWO_COLUMNS}>
          <UpNext parts={model.upNext} />
          <HowBadgesWork />
        </div>

        <AchievementsBoard model={model} />
      </div>
    </main>
  );
}
