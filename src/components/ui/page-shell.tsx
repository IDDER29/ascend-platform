import type { ReactNode } from "react";

/** The frame of an app page. The Practice session and the topic-complete screen fill the window, so they have their own. */
const FRAME =
  "practice-coach-v2 flex-1 overflow-x-clip bg-[var(--coach-bg)] px-5 py-8 font-sans text-[var(--coach-ink)] antialiased sm:px-10";

/** The sizes themselves are set once, as --container-* in globals.css. */
const WIDTHS = { wide: "max-w-wide", reading: "max-w-reading" } as const;

type Props = {
  /** "wide" for most pages, "reading" for a single card or article, "full" when the page lays itself out. */
  width?: keyof typeof WIDTHS | "full";
  /** Layout of the content column, such as its gap. */
  className?: string;
  children: ReactNode;
};

export function PageShell({ width = "wide", className = "", children }: Props) {
  return (
    <main className={FRAME}>
      {width === "full" ? children : <div className={`mx-auto w-full ${WIDTHS[width]} ${className}`}>{children}</div>}
    </main>
  );
}
