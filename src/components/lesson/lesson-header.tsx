import type { LessonFrontmatter } from "@/lib/content/schema";
import { LEVELS } from "@/lib/content/schema";

export function LessonHeader({ meta }: { meta: LessonFrontmatter }) {
  const level = LEVELS[meta.level];
  return (
    <div className="animate-rise mb-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FBEBFA] px-3 py-1.5 font-mono text-[11px] text-[#C13AE0]">
          CONCEPT {String(meta.order).padStart(2, "0")}
        </span>
        <span className="font-mono text-[12.5px] text-ink-faint">
          {meta.timeMin} min read · +50 XP
        </span>
      </div>
      <span className="hidden text-xs font-semibold text-ink-faint sm:inline">
        {level.name}
      </span>
    </div>
  );
}
