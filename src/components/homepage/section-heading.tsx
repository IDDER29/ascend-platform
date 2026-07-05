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
    <div className={cn("animate-rise mb-11 text-center", className)}>
      <div className="mb-3.5 font-mono text-[12.5px] uppercase tracking-[0.14em] text-brand-violet">
        {eyebrow}
      </div>
      <h2 className="mx-auto max-w-[640px] font-display text-[32px] font-extrabold leading-[1.06] tracking-[-0.03em] sm:text-[42px]">
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto mt-3.5 max-w-[520px] text-[17px] leading-relaxed text-ink-secondary">
          {subtitle}
        </p>
      )}
    </div>
  );
}
