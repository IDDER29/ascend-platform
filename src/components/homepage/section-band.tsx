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
    paper: "bg-paper",
    tint: "bg-landing-tint",
    warm: "bg-landing-warm",
    ink: "bg-landing-ink text-white",
  } as const;

  return (
    <section
      id={id}
      className={cn(id && "scroll-mt-[88px]", "min-w-0", tones[tone], className)}
    >
      <div className="mx-auto w-full min-w-0 max-w-[1200px] px-4 py-12 sm:px-8 sm:py-[72px]">
        {children}
      </div>
    </section>
  );
}
