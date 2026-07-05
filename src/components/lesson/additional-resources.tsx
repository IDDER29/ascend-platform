import { Play, FileText, File } from "lucide-react";
import type { AdditionalResource } from "@/lib/content/schema";

const ICONS: Record<AdditionalResource["type"], typeof Play> = {
  video: Play,
  doc: FileText,
  pdf: File,
};

const COLORS: Record<AdditionalResource["type"], string> = {
  video: "bg-[#FFF1EC] text-[#FF6B4A]",
  doc: "bg-[#FBEBFA] text-[#C13AE0]",
  pdf: "bg-[#FFF1EC] text-[#FF6B4A]",
};

export function AdditionalResources({
  resources,
}: {
  resources: AdditionalResource[];
}) {
  return (
    <div className="flex flex-col gap-2.5">
      {resources.map((r, i) => {
        const Icon = ICONS[r.type];
        const inner = (
          <>
            <span
              className={`flex h-8 w-8 flex-none items-center justify-center rounded-lg ${COLORS[r.type]}`}
            >
              <Icon size={15} strokeWidth={2.2} />
            </span>
            <div className="min-w-0">
              <div className="text-[13px] font-bold text-[#2A2540]">{r.title}</div>
              <div className="text-[11px] text-ink-faint">{r.meta}</div>
            </div>
          </>
        );
        return r.url ? (
          <a
            key={i}
            href={r.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-xl border border-card-border bg-white px-3.5 py-3 transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-card-hover"
          >
            {inner}
          </a>
        ) : (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl border border-dashed border-card-border bg-white/60 px-3.5 py-3 opacity-70"
            title="Referenced in this lesson's diagram above — no external link"
          >
            {inner}
          </div>
        );
      })}
    </div>
  );
}
