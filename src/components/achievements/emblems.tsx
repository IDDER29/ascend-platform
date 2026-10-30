import type { CrestId } from "@/lib/achievements/catalog";

/** Original clan emblems, one per topic, drawn as line art on a 48×48 grid. */
function CrestArt({ crest }: { crest: CrestId }) {
  switch (crest) {
    // Bits & Logic: an AND gate taking two bits.
    case "gate":
      return (
        <>
          <path d="M15 13h9a11 11 0 0 1 0 22h-9z" />
          <path d="M8 19h7M8 29h7M35 24h6" />
        </>
      );
    // Machine & Memory: a chip with its pins and a memory cell inside.
    case "core":
      return (
        <>
          <rect x="14" y="14" width="20" height="20" rx="2.5" />
          <rect x="20" y="20" width="8" height="8" rx="1" />
          <path d="M19 9v5M24 9v5M29 9v5M19 34v5M24 34v5M29 34v5M9 19h5M9 24h5M9 29h5M34 19h5M34 24h5M34 29h5" />
        </>
      );
    // The C Language: a pointer (*) aiming into a box.
    case "pointer":
      return (
        <>
          <path d="M12 18v12M6.8 21l10.4 6M6.8 27l10.4-6" />
          <path d="M20 24h9M26 20.5l3.5 3.5-3.5 3.5" />
          <rect x="31" y="15" width="11" height="18" rx="2" />
        </>
      );
    // Systems & Software: a shell prompt and a pipe.
    case "shell":
      return (
        <>
          <path d="M10 17l7 7-7 7M20 32h9" />
          <path d="M36 12v24" />
        </>
      );
  }
}

/** A clan crest as an embroidered shoulder patch: stitched when joined, a faint outline before. */
export function CrestPatch({
  crest,
  earned,
  size = "md",
  onDark = true,
}: {
  crest: CrestId;
  earned: boolean;
  size?: "sm" | "md" | "lg";
  onDark?: boolean;
}) {
  const box = { sm: "size-9", md: "size-12 sm:size-14", lg: "size-28" }[size];
  const look = earned
    ? "bg-[var(--coach-hero-ink)] text-[var(--coach-hero-bg)] ring-2 ring-[var(--coach-lime)] ring-offset-2 ring-offset-[var(--coach-hero-bg)] shadow-[inset_0_0_0_3px_var(--coach-hero-ink),inset_0_0_0_4px_rgba(0,0,0,0.25)]"
    : onDark
      ? "border-2 border-dashed border-[var(--coach-hero-track)] text-[var(--coach-hero-track)]"
      : "border-2 border-dashed border-[var(--coach-border-strong)] text-[var(--coach-ink-muted)]";
  return (
    <span aria-hidden="true" className={`flex shrink-0 items-center justify-center rounded-full ${box} ${look}`}>
      <svg viewBox="0 0 48 48" className="size-[70%]" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <CrestArt crest={crest} />
      </svg>
    </span>
  );
}

/** The headband: a cloth band with a metal plate engraved with Ascend's chevrons. */
export function Headband({ earned, size = "md" }: { earned: boolean; size?: "xs" | "sm" | "md" | "lg" }) {
  const dims = {
    xs: { band: "h-1.5 w-9", plate: "h-4 w-5" },
    sm: { band: "h-3 w-[96px]", plate: "h-6 w-12" },
    md: { band: "h-5 w-[200px] sm:w-[240px]", plate: "h-9 w-[72px]" },
    lg: { band: "h-7 w-[240px]", plate: "h-14 w-[104px]" },
  }[size];
  return (
    <span aria-hidden="true" className="relative flex items-center justify-center">
      <span
        className={`block rounded-[3px] ${dims.band} ${
          earned
            ? "bg-[#22348f] shadow-[inset_0_2px_0_rgba(255,255,255,0.15),inset_0_-2px_0_rgba(0,0,0,0.3)]" // cloth: the same navy in both themes
            : "border-2 border-dashed border-[var(--coach-hero-track)]"
        }`}
      />
      <span
        className={`absolute flex items-center justify-center rounded-[4px] ${dims.plate} ${
          earned
            ? "bg-[linear-gradient(180deg,#f1efe8,#b8b5ab)] text-[#3a3d45] shadow-[0_2px_0_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.8)]"
            : "border-2 border-dashed border-[var(--coach-hero-track)] bg-[var(--coach-hero-bg)] text-[var(--coach-hero-track)]"
        }`}
      >
        {earned ? (
          <>
            <span className="absolute left-1 top-1 size-1 rounded-full bg-black/30" />
            <span className="absolute right-1 top-1 size-1 rounded-full bg-black/30" />
            <span className="absolute bottom-1 left-1 size-1 rounded-full bg-black/30" />
            <span className="absolute bottom-1 right-1 size-1 rounded-full bg-black/30" />
          </>
        ) : null}
        <svg viewBox="0 0 24 24" className="h-[70%]" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 15 6-6 6 6" />
          <path d="m6 9 6-6 6 6" opacity=".55" />
        </svg>
      </span>
    </span>
  );
}
