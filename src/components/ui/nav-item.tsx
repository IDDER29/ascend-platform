import Link from "next/link";
import { cn } from "@/lib/cn";

interface NavItemProps {
  href?: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  disabled?: boolean;
  variant?: "icon" | "labeled";
}

export function NavItem({
  href,
  icon,
  label,
  active = false,
  disabled = false,
  variant = "labeled",
}: NavItemProps) {
  if (variant === "icon") {
    const className = cn(
      "relative flex h-11 w-11 items-center justify-center rounded-[13px] transition-colors duration-150",
      active
        ? "bg-xp-bg text-brand-violet"
        : disabled
          ? "cursor-default text-ink-fainter"
          : "text-ink-faint hover:bg-[#F3F1FB]",
    );
    const content = (
      <>
        {active && (
          <span className="absolute -left-[15px] h-[22px] w-[3px] rounded-full bg-brand-gradient" />
        )}
        {icon}
      </>
    );
    if (disabled || !href) {
      return (
        <span title={`${label} — coming soon`} className={className}>
          {content}
        </span>
      );
    }
    return (
      <Link href={href} title={label} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <Link
      href={href ?? "#"}
      className={cn(
        "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14.5px] font-semibold transition-colors duration-150",
        active
          ? "bg-xp-bg text-[#5A32D6]"
          : "text-ink-secondary hover:bg-[#F3F1FB]",
      )}
    >
      <span
        className={cn(
          "flex h-5 w-5 items-center justify-center",
          active ? "text-brand-violet" : "text-ink-faint",
        )}
      >
        {icon}
      </span>
      <span>{label}</span>
    </Link>
  );
}
