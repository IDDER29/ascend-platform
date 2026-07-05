import Link from "next/link";
import { getAllLessons } from "@/lib/content/lessons";
import { LEVELS, levelIds } from "@/lib/content/schema";
import { SiteHeader } from "@/components/homepage/header";
import { SiteFooter } from "@/components/homepage/footer";

export const metadata = {
  title: "Curriculum — Ascend",
  description: "The full 24-lesson, 4-level Ascend curriculum.",
};

const ACCENT_CLASS: Record<string, string> = {
  "level-00-bits-logic": "bg-level-00",
  "level-01-machine-memory": "bg-level-01",
  "level-02-the-c-language": "bg-level-02",
  "level-03-systems-software": "bg-level-03",
};

export default function CurriculumPage() {
  const lessons = getAllLessons();

  return (
    <div className="flex flex-1 flex-col bg-bg text-ink">
      <SiteHeader />
      <main className="mx-auto w-full max-w-[860px] px-6 py-14 sm:px-8 sm:py-20">
        <div className="mb-3 font-mono text-[12.5px] uppercase tracking-[0.14em] text-brand-violet">
          The full curriculum
        </div>
        <h1 className="mb-4 font-display text-[34px] font-extrabold leading-tight tracking-[-0.03em] sm:text-[42px]">
          24 lessons, 4 levels, bottom-up.
        </h1>
        <p className="mb-12 max-w-[560px] text-[17px] leading-relaxed text-ink-secondary">
          Every level unlocks the next. Click any lesson below to jump
          straight in — there's no account or progress gate in this preview.
        </p>

        <div className="flex flex-col gap-8">
          {levelIds.map((levelId) => {
            const level = LEVELS[levelId];
            const levelLessons = lessons.filter((l) => l.meta.level === levelId);
            return (
              <section key={levelId}>
                <div className="mb-4 flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 flex-none items-center justify-center rounded-[14px] ${ACCENT_CLASS[levelId]} font-display text-[19px] font-extrabold text-white shadow-[0_8px_18px_rgba(0,0,0,0.12)]`}
                  >
                    {levelId.slice(6, 8)}
                  </div>
                  <div>
                    <div className="font-mono text-[10.5px] tracking-[0.06em] text-ink-fainter">
                      LEVEL {levelId.slice(6, 8)} · {level.timeLabel}
                    </div>
                    <h2 className="font-display text-[20px] font-bold">
                      {level.name}{" "}
                      <span className="text-[14px] font-medium text-ink-muted">
                        · {level.short}
                      </span>
                    </h2>
                  </div>
                </div>
                <div className="overflow-hidden rounded-2xl border border-card-border bg-white shadow-card-rest">
                  {levelLessons.map((lesson, i) => (
                    <Link
                      key={lesson.meta.slug}
                      href={`/curriculum/${levelId}/${lesson.meta.slug}`}
                      className="flex items-center gap-3.5 px-5 py-4 transition-colors hover:bg-[#FAF9FE]"
                      style={
                        i > 0 ? { borderTop: "1px solid var(--color-divider)" } : undefined
                      }
                    >
                      <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-[#F1EFF6] font-mono text-[12px] font-bold text-ink-faint">
                        {lesson.meta.order}
                      </span>
                      <span className="flex-1 text-[14.5px] font-semibold text-[#2A2540]">
                        {lesson.meta.title}
                      </span>
                      <span className="font-mono text-[12px] text-ink-faint">
                        {lesson.meta.timeMin} min
                      </span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#C6C1D4"
                        strokeWidth="2.3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m9 6 6 6-6 6" />
                      </svg>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
