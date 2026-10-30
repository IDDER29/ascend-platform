import type { Metadata } from "next";
import Link from "next/link";
import { Chest } from "@/components/achievements-v6/chest";
import { HUB_CONTENT_CLASS } from "@/components/ui/page-header";
import { loadAchievementsModel } from "@/lib/achievements/server-page-data";
import { SIGNIN_HREF } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Achievements (v6) — Ascend",
  description: "Your decorations, worn on your chest, each with its citation.",
};

const MAIN =
  "practice-coach-v2 flex-1 overflow-x-clip bg-[var(--coach-bg)] px-5 py-8 font-sans text-[var(--coach-ink)] antialiased sm:px-10";

export default async function AchievementsChestPage() {
  const loaded = await loadAchievementsModel();
  if (!loaded) {
    return (
      <main className={MAIN}>
        <div className={`${HUB_CONTENT_CLASS} flex flex-col gap-4`}>
          <h1 className="m-0 font-display text-[28px] font-extrabold tracking-[-0.03em]">Achievements</h1>
          <p className="m-0 max-w-[520px] text-[15px] leading-relaxed text-[var(--coach-ink-secondary)]">
            Sign in to earn badges. Each one has its own rule, and you can see your progress against it.
          </p>
          <Link href={SIGNIN_HREF} className="w-fit text-[14px] font-semibold text-[var(--coach-ink)] underline underline-offset-2">
            Sign in
          </Link>
        </div>
      </main>
    );
  }

  const { model, sample, name } = loaded;

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
          <p className="m-0 max-w-[640px] text-[15.5px] leading-relaxed text-[var(--coach-ink-secondary)] [text-wrap:pretty]">
            {model.headline}
          </p>
        </header>

        <Chest model={model} name={name} />
      </div>
    </main>
  );
}
