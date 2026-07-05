import Link from "next/link";
import { notFound } from "next/navigation";
import { Trophy } from "lucide-react";
import { getAllLessons } from "@/lib/content/lessons";
import { LEVELS, levelIds, LevelIdSchema } from "@/lib/content/schema";

const LEVEL_ACCENT: Record<string, string> = {
  "level-00-bits-logic": "from-[#12B981] to-[#3BC6F0]",
  "level-01-machine-memory": "from-[#7B4DFF] to-[#C13AE0]",
  "level-02-the-c-language": "from-[#C13AE0] to-[#FF6B4A]",
  "level-03-systems-software": "from-[#8A8698] to-[#B7B3C4]",
};

export function generateStaticParams() {
  return levelIds.map((level) => ({ level }));
}

export default async function LevelCompletePage({
  params,
}: {
  params: Promise<{ level: string }>;
}) {
  const { level } = await params;
  const parsed = LevelIdSchema.safeParse(level);
  if (!parsed.success) notFound();

  const levelId = parsed.data;
  const levelInfo = LEVELS[levelId];
  const levelIndex = levelIds.indexOf(levelId);
  const nextLevelId = levelIds[levelIndex + 1] ?? null;
  const nextLevelInfo = nextLevelId ? LEVELS[nextLevelId] : null;

  const lessons = getAllLessons();
  const concepts = lessons.filter((l) => l.meta.level === levelId).length;
  const xpEarned = concepts * 50;

  const nextLevelFirstLesson = nextLevelId
    ? lessons
        .filter((l) => l.meta.level === nextLevelId)
        .sort((a, b) => a.meta.order - b.meta.order)[0]
    : null;

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-auto bg-[radial-gradient(120%_90%_at_50%_-10%,#2A2A4A_0%,#221C3A_44%,#141024_80%)] p-6 text-white">
      <div
        className={`animate-blob pointer-events-none absolute left-1/2 top-[30%] h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br ${LEVEL_ACCENT[levelId]} opacity-20 blur-[40px]`}
      />

      <div className="relative w-full max-w-[500px] rounded-[28px] border border-white/10 bg-gradient-to-b from-[rgba(38,32,60,0.9)] to-[rgba(26,22,42,0.94)] p-9 pb-8 text-center shadow-[0_40px_100px_rgba(0,0,0,0.6)] backdrop-blur-xl">
        <div className="mb-5 flex justify-center">
          <div
            className={`flex h-[104px] w-[104px] items-center justify-center rounded-full bg-gradient-to-br ${LEVEL_ACCENT[levelId]} shadow-[0_16px_40px_rgba(123,77,255,0.4)]`}
          >
            <Trophy size={44} className="text-white" strokeWidth={2} />
          </div>
        </div>

        <div className="mb-3.5 font-mono text-xs uppercase tracking-[0.24em] text-[#FFD86B]">
          Level complete
        </div>
        <h1 className="mb-3 font-display text-[30px] font-extrabold leading-tight tracking-[-0.03em]">
          {levelInfo.name}, mastered.
        </h1>
        <p className="mx-auto mb-7 max-w-[380px] text-[15.5px] leading-relaxed text-[#B8B2CC]">
          You worked through all {concepts} concepts in{" "}
          <b className="text-white">{levelInfo.short}</b>. That&apos;s a real chunk
          of how computers work, permanently in your head now.
        </p>

        <div className="mb-6 flex gap-3">
          {[
            { value: String(concepts), label: "concepts done", color: "text-[#7BE3B0]" },
            { value: `+${xpEarned}`, label: "XP earned", color: "text-[#C6A6FF]" },
            { value: levelInfo.timeLabel.replace("~", ""), label: "invested", color: "text-[#FFD86B]" },
          ].map((s) => (
            <div key={s.label} className="flex-1 rounded-2xl border border-white/10 bg-white/[0.05] p-3.5">
              <div className={`font-display text-[23px] font-extrabold leading-none ${s.color}`}>{s.value}</div>
              <div className="mt-1 text-[11.5px] text-[#9990B8]">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2.5">
          {nextLevelId && nextLevelInfo && nextLevelFirstLesson ? (
            <>
              <Link
                href={`/curriculum/${nextLevelFirstLesson.meta.level}/${nextLevelFirstLesson.meta.slug}`}
                className="flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#7B4DFF] via-[#C13AE0] to-[#FF6B4A] py-4 text-[16px] font-extrabold text-white shadow-[0_16px_36px_rgba(193,58,224,0.45)] transition-transform hover:-translate-y-0.5"
              >
                Start {nextLevelInfo.name}
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
              <div className="flex items-center justify-center gap-2 font-mono text-[12.5px] text-[#9990B8]">
                Next up: {nextLevelFirstLesson.meta.title} · {nextLevelFirstLesson.meta.timeMin} min
              </div>
            </>
          ) : (
            <>
              <Link
                href="/projects/shellforge"
                className="flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#7B4DFF] via-[#C13AE0] to-[#FF6B4A] py-4 text-[16px] font-extrabold text-white shadow-[0_16px_36px_rgba(193,58,224,0.45)] transition-transform hover:-translate-y-0.5"
              >
                Start the capstone: Shellforge
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>
              <div className="flex items-center justify-center gap-2 font-mono text-[12.5px] text-[#9990B8]">
                You&apos;ve cleared every taught level. One project left.
              </div>
            </>
          )}
          <Link href="/dashboard" className="py-3 text-sm font-semibold text-[#B8B2CC]">
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
