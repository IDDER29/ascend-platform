import { cn } from "@/lib/cn";

interface MemoryBoxProps {
  label: string;
  value: string;
  meta: string;
  tone: "value" | "pointer";
}

function MemoryBox({ label, value, meta, tone }: MemoryBoxProps) {
  return (
    <div
      className={cn(
        "flex-1 rounded-xl border-[1.5px] px-4 py-3.5",
        tone === "value"
          ? "border-[#A6E6CC] bg-[#E9F9F2]"
          : "border-[#C9B8F5] bg-xp-bg",
      )}
    >
      <div
        className={cn(
          "font-mono text-xs font-bold",
          tone === "value" ? "text-[#0E9E6E]" : "text-brand-violet",
        )}
      >
        {label}
      </div>
      <div
        className={cn(
          "mt-0.5",
          tone === "value"
            ? "font-display text-2xl font-extrabold text-[#0E9E6E]"
            : "font-mono text-[15px] font-bold text-[#5A32D6]",
        )}
      >
        {value}
      </div>
      <div
        className={cn(
          "mt-1 font-mono text-[10.5px]",
          tone === "value" ? "text-[#7FB79E]" : "text-[#A08BD6]",
        )}
      >
        {meta}
      </div>
    </div>
  );
}

export function MemoryDiagram() {
  return (
    <div className="my-6 rounded-2xl border border-divider bg-[#FBFAFE] px-6 py-5">
      <div className="mb-4 font-mono text-[10.5px] uppercase tracking-[0.08em] text-ink-faint">
        A peek at memory
      </div>
      <div className="flex items-stretch gap-4">
        <MemoryBox label="int x" value="42" meta="@ 0x7ffe…a4c" tone="value" />
        <div className="flex flex-col items-center justify-center text-brand-violet">
          <span className="mb-0.5 font-mono text-[11px]">points to</span>
          <svg width="26" height="16" viewBox="0 0 26 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M25 8H3m0 0 5-5M3 8l5 5" />
          </svg>
        </div>
        <MemoryBox
          label="int *p"
          value="0x7ffe…a4c"
          meta="the address of x"
          tone="pointer"
        />
      </div>
    </div>
  );
}
