import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TopicCompleteView } from "@/components/level-complete/topic-complete";
import { loadTopicComplete } from "@/lib/achievements/server-page-data";
import { LEVELS, LevelIdSchema } from "@/lib/content/schema";
import { SIGNIN_HREF } from "@/lib/routes";

export async function generateMetadata({ params }: { params: Promise<{ level: string }> }): Promise<Metadata> {
  const parsed = LevelIdSchema.safeParse((await params).level);
  return { title: parsed.success ? `${LEVELS[parsed.data].name} — Ascend` : "Topic — Ascend" };
}

export default async function TopicCompletePage({ params }: { params: Promise<{ level: string }> }) {
  const parsed = LevelIdSchema.safeParse((await params).level);
  if (!parsed.success) notFound();

  const loaded = await loadTopicComplete(parsed.data);
  if (!loaded) {
    return (
      <main className="practice-coach-v2 flex min-h-dvh flex-col items-center justify-center gap-3 bg-[var(--coach-bg)] px-5 text-center font-sans text-[var(--coach-ink)]">
        <h1 className="m-0 font-display text-[28px] font-extrabold tracking-[-0.03em]">{LEVELS[parsed.data].name}</h1>
        <p className="m-0 max-w-[420px] text-[15px] text-[var(--coach-ink-secondary)]">
          Sign in to see how far you are through this topic.
        </p>
        <Link href={SIGNIN_HREF} className="font-semibold underline underline-offset-2">
          Sign in
        </Link>
      </main>
    );
  }
  return <TopicCompleteView t={loaded.topic} sample={loaded.sample} />;
}
