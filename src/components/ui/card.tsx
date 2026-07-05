import { cn } from "@/lib/cn";

export function Card({
  className,
  children,
  hover = true,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { hover?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-[18px] border border-card-border bg-white shadow-card-rest",
        hover &&
          "transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-card-hover",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
