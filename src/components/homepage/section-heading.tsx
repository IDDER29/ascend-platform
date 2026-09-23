import { cn } from "@/lib/cn";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  className,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={cn("animate-rise mb-8 min-w-0 text-center sm:mb-11", className)}>
      <div className="mb-3 font-mono text-[11.5px] uppercase tracking-[0.14em] text-brand-violet sm:mb-3.5 sm:text-[12.5px]">
        {eyebrow}
      </div>
      <h2 className="mx-auto max-w-3xl font-display text-[clamp(1.6rem,4.5vw,2.625rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-balance">
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto mt-3 max-w-xl text-[15.5px] leading-relaxed text-ink-secondary text-pretty sm:mt-3.5 sm:text-[17px]">
          {subtitle}
        </p>
      )}
    </div>
  );
}
