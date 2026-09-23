/** Shared macOS window chrome for landing previews. */
export function TrafficLights({ size = "md" }: { size?: "sm" | "md" }) {
  const dot = size === "sm" ? "h-[9px] w-[9px]" : "h-[11px] w-[11px]";
  return (
    <div className="flex flex-none items-center gap-[7px]" aria-hidden>
      <span className={`${dot} rounded-full bg-[#FF5F57] shadow-[inset_0_-0.5px_0.5px_rgba(0,0,0,0.18)]`} />
      <span className={`${dot} rounded-full bg-[#FEBC2E] shadow-[inset_0_-0.5px_0.5px_rgba(0,0,0,0.18)]`} />
      <span className={`${dot} rounded-full bg-[#28C840] shadow-[inset_0_-0.5px_0.5px_rgba(0,0,0,0.18)]`} />
    </div>
  );
}
