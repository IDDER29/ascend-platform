import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CardMemoryLive } from "@/components/practice/card-memory/card-memory-live";
import { CoachBreadcrumb } from "@/components/practice/coach-breadcrumb";
import { getLesson } from "@/lib/content/lessons";
import { lessonHref } from "@/lib/paths/lesson-urls";
import { PRACTICE_BANK } from "@/lib/practice/bank";
import { loadPracticePageData } from "@/lib/practice/server-page-data";
import { unlockedQuestions } from "@/lib/practice/session";
import type { PracticeItem } from "@/lib/practice/types";
import { answerText } from "@/lib/practice/session-view";

const KIND: Record<PracticeItem["kind"], string> = {
  mcq: "Choices",
  flashcard: "Flashcard",
  typed: "Short answer",
  cloze: "Fill in the blank",
  output: "Predict the output",
  bug: "Spot the bug",
  order: "Put in order",
  bits: "Flip the bits",
};

function prompt(q: PracticeItem): string {
  if (q.kind === "flashcard") return q.front;
  if (q.kind === "cloze")
    return (q.template ?? q.templateCode?.join("\n") ?? q.reviewLabel).replace(/\{\{blank\}\}/g, "___");
  return q.prompt;
}

function answer(q: PracticeItem): string {
  return answerText(q);
}

export const metadata: Metadata = { title: "Card — Practice" };

export default async function PracticeCardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const question = PRACTICE_BANK.find((q) => q.id === decodeURIComponent(id));
  if (!question) notFound();

  const data = await loadPracticePageData();
  const lesson = getLesson(question.lessonLevel, question.lessonSlug);

  return (
    <main className="practice-coach-v2 flex-1 overflow-x-clip bg-[var(--coach-bg)] px-5 py-8 font-sans text-[var(--coach-ink)] antialiased sm:px-10">
      <div className="mx-auto flex w-full max-w-[760px] flex-col gap-5">
        <CoachBreadcrumb current="Card" />
        <CardMemoryLive
          question={question}
          prompt={prompt(question)}
          answer={answer(question)}
          kindLabel={KIND[question.kind]}
          lesson={{
            title: lesson?.meta.title ?? question.reviewLabel,
            href: lessonHref(question.lessonLevel, question.lessonSlug),
          }}
          unlocked={unlockedQuestions(new Set(data.completedKeys)).some((q) => q.id === question.id)}
          userId={data.userId}
          initialHistory={data.initialHistory}
        />
      </div>
    </main>
  );
}
