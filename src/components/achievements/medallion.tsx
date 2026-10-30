/** A badge as a medallion: solid lime when earned, a quiet dashed outline when not. */
export function Medallion({
  glyph,
  earned,
  size = "md",
  onDark = false,
}: {
  glyph: string;
  earned: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  onDark?: boolean;
}) {
  const box = {
    lg: "size-14 text-[24px]",
    md: "size-12 text-[20px]",
    sm: "size-8 text-[14px]",
    xs: "size-6 text-[11px]",
  }[size];
  const look = earned
    ? "bg-[var(--coach-lime)] text-[var(--coach-lime-ink)] shadow-[0_3px_0_var(--coach-lime-shadow)]"
    : onDark
      ? "border-2 border-dashed border-[var(--coach-hero-track)] text-[var(--coach-hero-muted)]"
      : "border-2 border-dashed border-[var(--coach-border-strong)] text-[var(--coach-ink-muted)]";
  return (
    <span aria-hidden="true" className={`flex shrink-0 items-center justify-center rounded-full leading-none ${box} ${look}`}>
      {glyph}
    </span>
  );
}
