import type { CrestId } from "@/lib/achievements/catalog";

/** Original clan emblems, one per topic, drawn as line art on a 48×48 grid. */
export function CrestArt({ crest }: { crest: CrestId }) {
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
    // C Basics: a block in curly braces, the shape of every C program.
    case "brace":
      return (
        <>
          <path d="M18 11c-3.5 0-5 1.6-5 5v4.5c0 2.2-1.2 3.5-3.5 3.5c2.3 0 3.5 1.3 3.5 3.5V32c0 3.4 1.5 5 5 5" />
          <path d="M30 11c3.5 0 5 1.6 5 5v4.5c0 2.2 1.2 3.5 3.5 3.5c-2.3 0-3.5 1.3-3.5 3.5V32c0 3.4-1.5 5-5 5" />
          <path d="M21 24h6" />
        </>
      );
    // The C Contract: a contract page with a wax seal.
    case "seal":
      return (
        <>
          <rect x="11" y="8" width="21" height="27" rx="2" />
          <path d="M16 15h11M16 20h11M16 25h6" />
          <circle cx="32" cy="33" r="6" />
          <path d="M29 38.5l-2 5.5M35 38.5l2 5.5" />
        </>
      );
    // Data Structures in C: a small tree of nodes joined by pointers.
    case "tree":
      return (
        <>
          <circle cx="24" cy="11" r="4.5" />
          <circle cx="13" cy="34" r="4.5" />
          <circle cx="35" cy="34" r="4.5" />
          <path d="M21.8 15l-6.6 14.8M26.2 15l6.6 14.8" />
        </>
      );
    // Virtual Memory, Threads & Files: stacked memory pages, one mapped through to the next.
    case "page":
      return (
        <>
          <rect x="8" y="8" width="20" height="24" rx="2" />
          <rect x="20" y="16" width="20" height="24" rx="2" />
          <path d="M12 14h12M12 19h8M24 22h12M24 27h12M24 32h8" />
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
      <svg
        viewBox="0 0 48 48"
        className="size-[70%]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
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
        <svg
          viewBox="0 0 24 24"
          className="h-[70%]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 15 6-6 6 6" />
          <path d="m6 9 6-6 6 6" opacity=".55" />
        </svg>
      </span>
    </span>
  );
}

/** A scroll: parchment between two rollers, the topic's crest on it. Faded until a skill is learned. */
export function ScrollArt({ crest, learned, size = "md" }: { crest: CrestId; learned: boolean; size?: "md" | "lg" }) {
  const dims =
    size === "lg"
      ? { body: "h-16 w-28", roller: "h-20 w-3.5", art: "size-11" }
      : { body: "h-10 w-[68px]", roller: "h-12 w-2.5", art: "size-7" };
  return (
    <span aria-hidden="true" className={`flex items-center ${learned ? "" : "opacity-45"}`}>
      <span className={`${dims.roller} rounded-full bg-[#6b4a2b] shadow-[inset_0_-2px_0_rgba(0,0,0,0.3)]`} />
      <span
        className={`${dims.body} -mx-0.5 flex items-center justify-center bg-[linear-gradient(180deg,#f4ead2,#e2d3ae)] text-[#5a3f22] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.12)]`}
      >
        <svg
          viewBox="0 0 48 48"
          className={dims.art}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <CrestArt crest={crest} />
        </svg>
      </span>
      <span className={`${dims.roller} rounded-full bg-[#6b4a2b] shadow-[inset_0_-2px_0_rgba(0,0,0,0.3)]`} />
    </span>
  );
}

/** A forbidden scroll: dark parchment closed with a wax seal (封); once unsealed the seal reads 解. */
export function ForbiddenScrollArt({ unsealed, size = "md" }: { unsealed: boolean; size?: "md" | "lg" }) {
  const dims =
    size === "lg"
      ? { body: "h-16 w-28", roller: "h-20 w-3.5", seal: "size-11 text-[20px]" }
      : { body: "h-10 w-[68px]", roller: "h-12 w-2.5", seal: "size-7 text-[13px]" };
  return (
    <span aria-hidden="true" className="flex items-center">
      <span className={`${dims.roller} rounded-full bg-[#2a1d14]`} />
      <span
        className={`${dims.body} -mx-0.5 flex items-center justify-center ${
          unsealed
            ? "bg-[linear-gradient(180deg,#f4ead2,#e2d3ae)] shadow-[0_0_14px_var(--coach-lime)]"
            : "bg-[linear-gradient(180deg,#3b2a3f,#251a29)]"
        }`}
      >
        <span
          className={`flex ${dims.seal} items-center justify-center rounded-full font-bold ${
            unsealed
              ? "bg-[var(--coach-lime)] text-[var(--coach-lime-ink)]"
              : "bg-[#b4361f] text-[#ffe3d6] shadow-[inset_0_-2px_0_rgba(0,0,0,0.3)]"
          }`}
        >
          {unsealed ? "解" : "封"}
        </span>
      </span>
      <span className={`${dims.roller} rounded-full bg-[#2a1d14]`} />
    </span>
  );
}
