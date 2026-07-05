import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-150 ease-out disabled:opacity-40 disabled:pointer-events-none whitespace-nowrap",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-gradient text-white shadow-[0_10px_24px_rgba(123,77,255,0.32)] hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(123,77,255,0.4)] active:translate-y-0",
        secondary:
          "bg-white text-ink border border-card-border hover:-translate-y-0.5 hover:shadow-card-hover active:translate-y-0",
        ghost:
          "bg-transparent text-ink-secondary hover:bg-black/[0.03] hover:-translate-y-0.5 active:translate-y-0",
        invert:
          "bg-white text-[#6A3EF0] shadow-[0_18px_38px_rgba(0,0,0,0.24)] hover:-translate-y-0.5 active:translate-y-0",
        dark:
          "bg-ink text-white shadow-[0_10px_24px_rgba(24,21,40,0.22)] hover:-translate-y-0.5 active:translate-y-0",
      },
      size: {
        sm: "h-9 px-4 text-[13px]",
        md: "h-11 px-6 text-[14.5px]",
        lg: "h-13 px-8 text-[16px]",
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
  ...props
}: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className);
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
