import type { KnowledgeCheckItem } from "@/lib/content/schema";

export function KnowledgeCheck({ items }: { items: KnowledgeCheckItem[] }) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((item, i) => (
        <details
          key={i}
          className="group rounded-2xl border-[1.5px] border-[#E9E5F4] bg-white transition-[border-color,box-shadow] duration-150 open:border-[#C9B8F5] open:shadow-[0_10px_26px_rgba(123,77,255,0.1)]"
        >
          <summary className="flex cursor-pointer list-none items-center gap-3.5 rounded-t-2xl px-5 py-4 transition-colors hover:bg-[#FBFAFE] [&::-webkit-details-marker]:hidden">
            <span className="flex h-[30px] w-[30px] flex-none items-center justify-center rounded-[9px] bg-xp-bg font-mono text-[13px] font-bold text-brand-violet">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="min-w-0 flex-1 text-[15.5px] font-bold leading-snug text-[#2A2540]">
              {item.question}
            </span>
            <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-xs font-semibold text-ink-muted">
              Where to learn this
              <svg
                className="h-4 w-4 shrink-0 text-[#B0A6D0] transition-transform duration-200 group-open:rotate-90"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 6 6 6-6 6" />
              </svg>
            </span>
          </summary>
          <div className="px-5 pb-[18px] pl-16">
            <div className="rounded-xl border border-[#EEECF6] bg-[#FBFAFE] px-4 py-3.5 text-sm leading-relaxed text-ink-secondary">
              <div className="mb-3">{item.answer}</div>
              <a
                href={`#${item.jumpToId}`}
                className="inline-flex items-center gap-2 text-[13px] font-bold text-brand-violet hover:text-[#5A32D6]"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
                Re-read &ldquo;{item.jumpToLabel}&rdquo;
                {item.jumpToDetail && (
                  <span className="font-medium text-ink-fainter"> · {item.jumpToDetail}</span>
                )}
              </a>
            </div>
          </div>
        </details>
      ))}
    </div>
  );
}
