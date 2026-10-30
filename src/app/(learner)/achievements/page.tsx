import type { Metadata } from "next";
import { Chest } from "@/components/achievements/chest";
import { GuestPrompt } from "@/components/ui/guest-prompt";
import { HUB_CONTENT_CLASS } from "@/components/ui/page-header";
import { loadAchievementsModel } from "@/lib/achievements/server-page-data";

export const metadata: Metadata = {
  title: "Achievements — Ascend",
  description: "Your decorations, worn on your chest, each with its citation.",
};

const MAIN =
  "practice-coach-v2 flex-1 overflow-x-clip bg-[var(--coach-bg)] px-5 py-8 font-sans text-[var(--coach-ink)] antialiased sm:px-10";

export default async function AchievementsPage() {
  const loaded = await loadAchievementsModel();
  if (!loaded) {
    return (
      <main className={MAIN}>
        <div className={HUB_CONTENT_CLASS}>
          <GuestPrompt
            title="Achievements"
            body="Sign in to earn badges and clan crests. Each one has its own rule, and you can see how close you are to every one."
            next="/achievements"
          />
        </div>
      </main>
    );
  }

  const { model, scrolls, name } = loaded;

  return (
    <main className={MAIN}>
      <div className={`${HUB_CONTENT_CLASS} flex flex-col gap-8`}>
        <header className="flex flex-col gap-1.5">
          <h1 className="m-0 font-display text-[30px] font-extrabold leading-tight tracking-[-0.035em] sm:text-[36px]">
            Achievements
          </h1>
          <p className="m-0 max-w-[640px] text-[15.5px] leading-relaxed text-[var(--coach-ink-secondary)] [text-wrap:pretty]">
            {model.headline}
          </p>
        </header>

        <Chest model={model} scrolls={scrolls} name={name} />
      </div>
    </main>
  );
}
