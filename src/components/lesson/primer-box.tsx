import { Play, FileText } from "lucide-react";
import type { PrimerItem } from "@/lib/content/schema";

const ICONS: Record<PrimerItem["type"], typeof Play> = {
  doc: FileText,
  video: Play,
};

export function PrimerBox({ items }: { items: PrimerItem[] }) {
  if (items.length === 0) return null;

  return (
    <div
      id="study-these-first"
      className="mb-[30px] mt-2 scroll-mt-[88px] rounded-[18px] border border-[#EAE2FA] bg-gradient-to-br from-[#F7F5FE] to-[#FBF3FE] px-[26px] py-6"
    >
      <div className="mb-2 flex items-center gap-2.5">
        <span className="flex h-[26px] w-[26px] flex-none items-center justify-center rounded-lg bg-brand-violet text-white">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2 2 7l10 5 10-5-10-5Z" />
            <path d="m2 17 10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </span>
        <h2 className="font-display text-lg font-extrabold tracking-tight">Study these first</h2>
      </div>
      <p className="mb-[18px] max-w-[560px] text-[14.5px] leading-relaxed text-ink-secondary">
        Skim these before the lesson — the ideas below will land faster, and
        the Knowledge Check at the end assumes them.
      </p>
      <div className="flex flex-col gap-2.5">
        {items.map((item, i) => {
          const Icon = ICONS[item.type];
          const inner = (
            <>
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-[11px] bg-[#FBEBFA] text-[#C13AE0]">
                <Icon size={19} strokeWidth={2.1} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[14.5px] font-bold text-[#2A2540]">{item.title}</div>
                <div className="mt-px text-[12.5px] leading-relaxed text-ink-faint">
                  {item.meta}{" "}
                  <b className={item.essential ? "text-brand-violet" : "text-ink-faint"}>
                    {item.essential ? "Essential" : "Optional but great"}
                  </b>
                </div>
              </div>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" className="flex-none text-[#C6C1D4]">
                <path d="M7 17 17 7M7 7h10v10" />
              </svg>
            </>
          );
          return item.url ? (
            <a
              key={i}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3.5 rounded-[14px] border border-[#EDE7F7] bg-white px-4 py-3.5 transition-transform hover:-translate-y-0.5"
            >
              {inner}
            </a>
          ) : (
            <div
              key={i}
              className="flex items-center gap-3.5 rounded-[14px] border border-dashed border-[#EDE7F7] bg-white/60 px-4 py-3.5 opacity-70"
              title="Referenced in this lesson — no external link"
            >
              {inner}
            </div>
          );
        })}
      </div>
    </div>
  );
}
