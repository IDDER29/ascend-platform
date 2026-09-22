import { cn } from "@/lib/cn";

/** Full-bleed band with consistent inner width — keeps sections visually bounded. */
export function SectionBand({
  id,
  tone = "wash",
  className,
  children,
}: {
  id?: string;
  tone?: "wash" | "paper" | "tint" | "warm" | "ink";
  className?: string;
  children: React.ReactNode;
}) {
  const tones = {
    wash: "bg-bg",
    paper: "bg-white",
    tint: "bg-[#F6F3FC]",
    warm: "bg-[#FFF8F4]",
    ink: "bg-[#181428] text-white",
  } as const;

  return (
    <section
      id={id}
      className={cn(id && "scroll-mt-[88px]", tones[tone], className)}
    >
      <div className="mx-auto w-full max-w-[1200px] px-6 py-16 sm:px-8 sm:py-[72px]">
        {children}
      </div>
    </section>
  );
}
