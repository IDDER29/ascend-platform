const LABELS: Record<string, string> = {
  diagram: "DIAGRAM",
  "memory-diagram": "MEMORY MAP",
  "truth-table": "TRUTH TABLE",
  code: "CODE TRACE",
};

function decodeEntities(s: string) {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

export function Visual({
  type,
  caption,
  description,
}: {
  type: string;
  caption: string;
  description: string;
}) {
  return (
    <div className="my-6 rounded-2xl border border-divider bg-[#FBFAFE] px-6 py-5 not-prose">
      <div className="mb-2.5 font-mono text-[10.5px] uppercase tracking-[0.08em] text-ink-faint">
        {LABELS[type] ?? "DIAGRAM"}
      </div>
      <div className="mb-2 font-display text-[15.5px] font-bold text-[#2A2540]">
        {decodeEntities(caption)}
      </div>
      <div className="text-[14.5px] leading-relaxed text-ink-secondary">
        {decodeEntities(description)}
      </div>
    </div>
  );
}
