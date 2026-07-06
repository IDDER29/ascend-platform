import Link from "next/link";
import { LEVELS, type LevelId } from "@/lib/content/schema";

interface LessonRow {
  slug: string;
  title: string;
  order: number;
}

export function LessonListPanel({
  level,
  currentOrder,
  lessons,
  nextLevelName,
}: {
  level: LevelId;
  currentOrder: number;
  lessons: LessonRow[];
  nextLevelName: string | null;
}) {
  const info = LEVELS[level];
  const percent = Math.round(((currentOrder - 1) / info.totalConcepts) * 100);

  return (
    <aside className="sticky top-[70px] hidden max-h-[calc(100vh-70px)] w-[272px] flex-none self-start overflow-auto border-r border-divider px-5 py-[26px] lg:block">
      <div className="mb-[5px] font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink-fainter">
        Level {level.slice(6, 8)}
      </div>
      <div className="mb-3.5 font-display text-[17px] font-extrabold">{info.name}</div>
      <div className="mb-4 flex items-center gap-2.5">
        <div className="h-[5px] flex-1 overflow-hidden rounded-full bg-[#F0EEF7]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#C13AE0] to-[#FF6B4A]"
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="font-mono text-[10.5px] text-ink-fainter">
          {currentOrder - 1}/{info.totalConcepts}
        </span>
      </div>

      {lessons.map((l) => {
        const state = l.order < currentOrder ? "done" : l.order === currentOrder ? "current" : "locked";
        return (
          <Link
            key={l.slug}
            href={`/curriculum/${level}/${l.slug}`}
            className={
              "-mx-1.5 mb-px flex items-center gap-2.5 rounded-[11px] px-2.5 py-2.5 no-underline transition-colors" +
              (state === "current" ? "" : " hover:bg-[#F6F4FB]")
            }
            style={state === "current" ? { background: "#FBF3FE" } : undefined}
          >
            {state === "done" && (
              <span className="flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full bg-[#12B981]">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
            )}
            {state === "current" && (
              <span className="flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full border-2 border-[#C13AE0] bg-white shadow-[0_0_0_3px_rgba(193,58,224,0.16)]">
                <span className="h-[7px] w-[7px] animate-[pulse_1.5s_infinite] rounded-full bg-[#C13AE0]" />
              </span>
            )}
            {state === "locked" && (
              <span className="h-[22px] w-[22px] flex-none rounded-full border-2 border-[#D8D3E6]" />
            )}
            <span
              className={
                "truncate text-[13px] " +
                (state === "current"
                  ? "font-bold text-[#5A32D6]"
                  : state === "done"
                    ? "font-semibold text-[#413D50]"
                    : "font-medium text-ink-fainter")
              }
            >
              {l.order}. {l.title}
            </span>
          </Link>
        );
      })}

      {nextLevelName && (
        <div className="mt-4 border-t border-divider pt-4 text-xs leading-relaxed text-ink-faint">
          Finish all {info.totalConcepts} to unlock{" "}
          <b className="text-brand-violet">{nextLevelName}</b>.
        </div>
      )}
    </aside>
  );
}
