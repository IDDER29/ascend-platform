import { Play, FileText, File } from "lucide-react";
import type { AdditionalResource } from "@/lib/content/schema";
import { SaveResourceButton } from "@/components/bookmarks/lesson-bookmarks";

const ICONS: Record<AdditionalResource["type"], typeof Play> = {
  video: Play,
  doc: FileText,
  pdf: File,
};

const COLORS: Record<AdditionalResource["type"], string> = {
  video: "bg-brand-gradient text-white",
  doc: "bg-xp-bg text-xp-text",
  pdf: "bg-xp-bg text-xp-text",
};

function VideoCard({ r }: { r: AdditionalResource }) {
  const inner = (
    <>
      <div className="relative flex h-[100px] items-center justify-center bg-xp-bg/40">
        <span className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-brand-gradient text-white shadow-[var(--brand-glow)]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="8 5 19 12 8 19 8 5" />
          </svg>
        </span>
        {r.duration && (
          <span className="absolute bottom-2 right-[9px] rounded-[5px] bg-black/50 px-1.5 py-0.5 font-mono text-[10.5px] text-white">
            {r.duration}
          </span>
        )}
      </div>
      <div className="px-3.5 py-3">
        <div className="text-[13.5px] font-bold leading-tight text-ink">
          {r.title}
        </div>
        <div className="mt-0.5 text-[11.5px] text-ink-faint">{r.meta}</div>
      </div>
    </>
  );
  const className =
    "mb-3 block overflow-hidden rounded-[14px] border border-card-border bg-paper shadow-[var(--shadow-card-rest)] transition-transform duration-150 hover:-translate-y-0.5 dark:bg-elevated";
  return r.url ? (
    <a href={r.url} target="_blank" rel="noreferrer" className={className}>
      {inner}
    </a>
  ) : (
    <div
      className={className}
      title="Referenced in this lesson's diagram above — no external link"
    >
      {inner}
    </div>
  );
}

export function AdditionalResources({
  resources,
}: {
  resources: AdditionalResource[];
}) {
  return (
    <div className="flex flex-col gap-2.5">
      {resources.map((r, i) => {
        const save = r.url ? (
          <SaveResourceButton title={r.title} url={r.url} meta={r.meta} />
        ) : null;
        if (r.type === "video")
          return (
            <div key={i} className="relative">
              <VideoCard r={r} />
              {save}
            </div>
          );

        const Icon = ICONS[r.type];
        const inner = (
          <>
            <span
              className={`flex h-8 w-8 flex-none items-center justify-center rounded-lg ${COLORS[r.type]}`}
            >
              <Icon size={15} strokeWidth={2.2} />
            </span>
            <div className="min-w-0">
              <div className="pr-6 text-[13px] font-bold text-ink">
                {r.title}
              </div>
              <div className="text-[11px] text-ink-faint">{r.meta}</div>
            </div>
          </>
        );
        return r.url ? (
          <div key={i} className="relative">
            <a
              href={r.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-xl border border-card-border bg-paper px-3.5 py-3 transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-card-hover dark:bg-elevated"
            >
              {inner}
            </a>
            {save}
          </div>
        ) : (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl border border-dashed border-card-border bg-paper/60 px-3.5 py-3 opacity-70 dark:bg-elevated/60"
            title="Referenced in this lesson's diagram above — no external link"
          >
            {inner}
          </div>
        );
      })}
    </div>
  );
}
