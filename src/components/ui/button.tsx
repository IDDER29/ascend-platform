import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
  [
    "group inline-flex items-center justify-center gap-2 rounded-full font-semibold",
    "transition-all duration-200 ease-out",
    "disabled:opacity-40 disabled:pointer-events-none whitespace-nowrap",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
    "[&_svg]:transition-transform [&_svg]:duration-200 group-hover:[&_svg]:translate-x-0.5",
  ].join(" "),
  {
    variants: {
      variant: {
        primary:
          "bg-brand-gradient text-white shadow-[0_6px_16px_rgba(13,159,110,0.18)] hover:-translate-y-0.5 hover:shadow-[0_10px_22px_rgba(13,159,110,0.24)] active:translate-y-0 active:shadow-[0_4px_12px_rgba(13,159,110,0.16)] dark:shadow-[0_4px_14px_rgba(13,159,110,0.14)] dark:hover:shadow-[0_8px_18px_rgba(13,159,110,0.2)]",
        secondary:
          "bg-paper text-xp-text border border-xp-border hover:-translate-y-0.5 hover:bg-xp-bg hover:border-xp-border active:translate-y-0 dark:bg-elevated dark:shadow-none",
        ghost:
          "bg-transparent text-ink-secondary hover:bg-black/[0.03] hover:text-ink hover:-translate-y-0.5 active:translate-y-0 dark:hover:bg-white/[0.05]",
        invert:
          "bg-[#f2f7f4] text-xp-text shadow-[0_8px_20px_rgba(0,0,0,0.14)] hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_12px_24px_rgba(0,0,0,0.18)] active:translate-y-0",
        dark:
          "bg-ink text-bg shadow-[0_6px_16px_rgba(15,26,20,0.16)] hover:-translate-y-0.5 hover:shadow-[0_10px_22px_rgba(15,26,20,0.2)] active:translate-y-0",
      },
      size: {
        sm: "h-9 px-4 text-[13px]",
        md: "h-11 px-6 text-[14.5px]",
        lg: "h-12 px-7 text-[15px]",
        xl: "h-[52px] px-9 text-[16px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string;
}

export function Button({
  className,
  variant,
  size,
  href,
  children,
  onClick,
  ...props
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className);
  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        onClick={onClick as React.MouseEventHandler<HTMLAnchorElement> | undefined}
      >
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} onClick={onClick} {...props}>
      {children}
    </button>
  );
}
