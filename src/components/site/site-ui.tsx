import Link from "next/link";
import { FIRST_LESSON_HREF } from "@/lib/routes";
import { CATALOG_HREF } from "@/lib/site/site-nav";

/** Page width and side gutters, shared by every public section. */
export const WRAP = "mx-auto w-full max-w-[1160px] px-4 sm:px-8";

export const CARD = "rounded-[20px] border-2 border-[var(--coach-border)] bg-[var(--coach-surface)]";

const BTN =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-bold no-underline";
export const LIME_BTN = `${BTN} bg-[var(--coach-lime)] text-[var(--coach-lime-ink)] shadow-[0_3px_0_var(--coach-lime-shadow)]`;
export const SOLID_BTN = `${BTN} bg-[var(--coach-solid-btn-bg)] text-[var(--coach-solid-btn-ink)]`;
export const OUTLINE_BTN = `${BTN} border-2 border-[var(--coach-border)] font-semibold text-[var(--coach-ink)] hover:border-[var(--coach-border-strong)]`;
export const OUTLINE_ON_DARK_BTN = `${BTN} border-2 border-[var(--coach-hero-track)] font-semibold text-[var(--coach-hero-ink)] hover:border-[var(--coach-hero-muted)]`;

export const H2 =
  "m-0 font-display text-[28px] font-extrabold leading-[1.1] tracking-[-0.03em] [text-wrap:balance] sm:text-[36px]";
export const LEAD = "m-0 text-[17px] leading-relaxed text-[var(--coach-ink-secondary)] [text-wrap:pretty]";

/** A page's opening: its title and what it's for, left-aligned like the rest of the platform. */
export function PageIntro({ title, lead, children }: { title: string; lead: string; children?: React.ReactNode }) {
  return (
    <header className={`${WRAP} pb-10 pt-12 sm:pb-14 sm:pt-20`}>
      <h1 className="m-0 max-w-[16ch] font-display text-[40px] font-extrabold leading-[1.02] tracking-[-0.04em] [text-wrap:balance] sm:text-[60px]">
        {title}
      </h1>
      <p className={`${LEAD} mt-5 max-w-[60ch] sm:text-[19px]`}>{lead}</p>
      {children}
    </header>
  );
}

/** A section with its heading on the left and the content beside it on wide screens. */
export function Section({
  id,
  title,
  lead,
  children,
  aside = true,
}: {
  id?: string;
  title: string;
  lead?: string;
  children: React.ReactNode;
  /** Heading beside the content (wide screens); false puts it above. */
  aside?: boolean;
}) {
  const headingId = id ? `${id}-title` : undefined;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`${WRAP} scroll-mt-24 py-12 sm:py-16 ${aside ? "lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-12" : ""}`}
    >
      <div className={aside ? "mb-8 lg:sticky lg:top-24 lg:mb-0 lg:self-start" : "mb-8 max-w-[680px]"}>
        <h2 id={headingId} className={H2}>
          {title}
        </h2>
        {lead && <p className={`${LEAD} mt-3`}>{lead}</p>}
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

/** The closing invitation on every public page. */
export function StartBand({
  title = "Start with one bit.",
  lead = "The first lesson takes four minutes. No account needed: sign up later if you want your progress saved.",
}: {
  title?: string;
  lead?: string;
}) {
  return (
    <section aria-labelledby="start-title" className={`${WRAP} pb-16 pt-6 sm:pb-24`}>
      <div className="flex flex-col gap-6 rounded-[28px] bg-[var(--coach-hero-bg)] px-6 py-10 text-[var(--coach-hero-ink)] sm:px-12 sm:py-14 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-[560px]">
          <h2
            id="start-title"
            className="m-0 font-display text-[30px] font-extrabold leading-[1.08] tracking-[-0.03em] [text-wrap:balance] sm:text-[40px]"
          >
            {title}
          </h2>
          <p className="m-0 mt-3 text-[16.5px] leading-relaxed text-[var(--coach-hero-muted)] [text-wrap:pretty]">
            {lead}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
          <Link href={FIRST_LESSON_HREF} className={LIME_BTN}>
            Start the first lesson
          </Link>
          <Link href={CATALOG_HREF} className={OUTLINE_ON_DARK_BTN}>
            See all paths
          </Link>
        </div>
      </div>
    </section>
  );
}

/** Ascend's mark: two chevrons climbing. */
export function BrandMark({ size = 32 }: { size?: number }) {
  return (
    <span
      aria-hidden
      className="flex shrink-0 items-center justify-center rounded-[10px] bg-[var(--coach-mark-bg)] text-[var(--coach-mark-ink)]"
      style={{ width: size, height: size }}
    >
      <svg
        width={size * 0.55}
        height={size * 0.55}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m6 15 6-6 6 6" />
        <path d="m6 9 6-6 6 6" opacity=".55" />
      </svg>
    </span>
  );
}
