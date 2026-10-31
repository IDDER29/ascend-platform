import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuestPrompt } from "@/components/ui/guest-prompt";
import { TopicCompleteView } from "@/components/level-complete/topic-complete";
import { loadTopicComplete } from "@/lib/achievements/server-page-data";
import { LEVELS, LevelIdSchema } from "@/lib/content/schema";

export async function generateMetadata({ params }: { params: Promise<{ level: string }> }): Promise<Metadata> {
  const parsed = LevelIdSchema.safeParse((await params).level);
  return { title: parsed.success ? LEVELS[parsed.data].name : "Topic" };
}

export default async function TopicCompletePage({ params }: { params: Promise<{ level: string }> }) {
  const parsed = LevelIdSchema.safeParse((await params).level);
  if (!parsed.success) notFound();

  const loaded = await loadTopicComplete(parsed.data);
  if (!loaded) {
    return (
      <main className="practice-coach-v2 flex min-h-dvh flex-col justify-center bg-[var(--coach-bg)] px-5 py-10 font-sans text-[var(--coach-ink)]">
        <div className="mx-auto w-full max-w-[560px]">
          <GuestPrompt
            title={LEVELS[parsed.data].name}
            body="Sign in to see how far you are through this topic, and what finishing it earns."
            next={`/level-complete/${parsed.data}`}
          />
        </div>
      </main>
    );
  }
  return <TopicCompleteView t={loaded} />;
}
