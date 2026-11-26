import type { Metadata } from "next";
import { Chest } from "@/components/achievements/chest";
import { GuestPrompt } from "@/components/ui/guest-prompt";
import { PageHeader } from "@/components/ui/page-header";
import { loadAchievementsModel } from "@/lib/achievements/server-page-data";
import { PageShell } from "@/components/ui/page-shell";

export const metadata: Metadata = {
  title: "Achievements",
  description: "Your decorations, worn on your chest, each with its citation.",
};

export default async function AchievementsPage() {
  const loaded = await loadAchievementsModel();
  if (!loaded) {
    return (
      <PageShell>
        <GuestPrompt
          title="Achievements"
          body="Sign in to earn badges and clan crests. Each one has its own rule, and you can see how close you are to every one."
          next="/achievements"
        />
      </PageShell>
    );
  }

  const { model, scrolls, name } = loaded;

  return (
    <PageShell className="flex flex-col gap-8">
      <PageHeader title="Achievements" lead={model.headline} />

      <Chest model={model} scrolls={scrolls} name={name} />
    </PageShell>
  );
}
