export function KeyIdea({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 rounded-r-xl border-l-4 border-brand-violet bg-[#F7F5FE] px-5 py-4">
      <div className="mb-1 text-sm font-extrabold text-[#5A32D6]">Key idea</div>
      <div className="text-[15.5px] leading-relaxed text-[#41395E]">{children}</div>
    </div>
  );
}
