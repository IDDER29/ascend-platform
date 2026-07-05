import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const chipVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full font-bold whitespace-nowrap transition-transform duration-150 ease-out hover:-translate-y-0.5",
  {
    variants: {
      variant: {
        default:
          "bg-[#F3F1FA] border border-[#E9E5F4] text-ink-secondary",
        streak: "bg-streak-bg border border-streak-border text-streak-text",
        xp: "bg-xp-bg border border-xp-border text-xp-text",
        outline: "border border-card-border text-ink-secondary bg-white",
      },
      size: {
        sm: "text-[11px] px-2.5 py-1",
        md: "text-[12.5px] px-3 py-1.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

interface ChipProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof chipVariants> {}

export function Chip({ className, variant, size, children, ...props }: ChipProps) {
  return (
    <span className={cn(chipVariants({ variant, size }), className)} {...props}>
      {children}
    </span>
  );
}
