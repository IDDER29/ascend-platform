import type { Metadata } from "next";
import Link from "next/link";
import { ReleaseCard } from "@/components/achievements-v3/release-card";
import { RoadmapCard } from "@/components/achievements-v3/roadmap-card";
import { UnreleasedCard } from "@/components/achievements-v3/unreleased-card";
import { VersionHero } from "@/components/achievements-v3/version-hero";
import { HUB_CONTENT_CLASS } from "@/components/ui/page-header";
import { buildChangelogModel } from "@/lib/achievements/changelog-model";
import { loadAchievementsModel } from "@/lib/achievements/server-page-data";
import { SIGNIN_HREF } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Achievements (v3) — Ascend",
  description: "Your learning as a changelog: every level a release, every badge an entry.",
};

const MAIN =
  "practice-coach-v2 flex-1 overflow-x-clip bg-[var(--coach-bg)] px-5 py-8 font-sans text-[var(--coach-ink)] antialiased sm:px-10";

const TWO_COLUMNS =
  "grid w-full min-w-0 grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(250px,300px)]";

export default async function AchievementsV3Page() {
  const loaded = await loadAchievementsModel();
  if (!loaded) {
    return (
      <main className={MAIN}>
        <div className={`${HUB_CONTENT_CLASS} flex flex-col gap-4`}>
          <h1 className="m-0 font-display text-[28px] font-extrabold tracking-[-0.03em]">Achievements</h1>
          <p className="m-0 max-w-[520px] text-[15px] leading-relaxed text-[var(--coach-ink-secondary)]">
            Sign in to start your changelog: every level you finish is a release.
          </p>
          <Link href={SIGNIN_HREF} className="w-fit text-[14px] font-semibold text-[var(--coach-ink)] underline underline-offset-2">
            Sign in
          </Link>
        </div>
      </main>
    );
  }

  const log = buildChangelogModel(loaded.model);
  return (
    <main className={MAIN}>
      <div className={`${HUB_CONTENT_CLASS} flex flex-col gap-8`}>
        {loaded.sample ? (
          // DEVELOPMENT PREVIEW: guests see the sample learner. Turned off with the profile's switch.
          <p className="m-0 rounded-xl border-2 border-dashed border-[var(--coach-border-strong)] px-4 py-3 text-[13.5px] leading-relaxed text-[var(--coach-ink-secondary)]">
            <strong className="font-semibold text-[var(--coach-ink)]">Development preview.</strong> You&apos;re not
            signed in, so this is a sample learner&apos;s changelog.{" "}
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
          <p className="m-0 max-w-[620px] text-[15.5px] leading-relaxed text-[var(--coach-ink-secondary)]">
            Your learning as a changelog. Every level you finish is a release; every other badge is an entry in the
            release you earned it in.
          </p>
        </header>

        <VersionHero log={log} />

        <div className={TWO_COLUMNS}>
          <div className="flex min-w-0 flex-col gap-5">
            <UnreleasedCard log={log} />
            {log.releases.map((release, i) => (
              <ReleaseCard key={release.version} release={release} latest={i === 0} />
            ))}
            {log.releases.length === 0 ? (
              <p className="m-0 rounded-2xl border-2 border-dashed border-[var(--coach-border-strong)] p-5 text-[14px] text-[var(--coach-ink-secondary)]">
                No releases yet. v0.1 ships when you finish Level 00, and it shows up here with its date.
              </p>
            ) : null}
          </div>
          <aside className="flex min-w-0 flex-col gap-5 lg:sticky lg:top-6">
            <RoadmapCard log={log} />
          </aside>
        </div>
      </div>
    </main>
  );
}
