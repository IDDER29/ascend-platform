import { cn } from "@/lib/cn";

export function ProgressBar({
  percent,
  className,
  gradientClassName = "bg-brand-gradient-wash",
}: {
  percent: number;
  className?: string;
  gradientClassName?: string;
}) {
  return (
    <div
      className={cn(
        "h-1.5 w-full overflow-hidden rounded-full bg-card-border",
        className,
      )}
    >
      <div
        className={cn("animate-grow h-full rounded-full", gradientClassName)}
        style={{ width: `${Math.max(0, Math.min(100, percent))}%` }}
      />
    </div>
  );
}
