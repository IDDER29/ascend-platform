import { WRAP } from "./site-ui";

/** A plain, readable page of policy text: title, date, then sections. */
export function LegalArticle({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <article className={`${WRAP} pb-20 pt-12 sm:pt-20`}>
      <h1 className="m-0 font-display text-[40px] font-extrabold leading-[1.02] tracking-[-0.04em] sm:text-[56px]">
        {title}
      </h1>
      <p className="m-0 mt-3 text-[14px] text-[var(--coach-ink-muted)]">Last updated {updated}</p>
      <div className="mt-10 flex max-w-[68ch] flex-col gap-8 text-[16.5px] leading-relaxed text-[var(--coach-ink-secondary)] [&_a]:font-semibold [&_a]:text-[var(--coach-ink)] [&_a]:underline [&_a]:underline-offset-2 [&_h2]:m-0 [&_h2]:mb-2 [&_h2]:font-display [&_h2]:text-[22px] [&_h2]:font-extrabold [&_h2]:tracking-[-0.02em] [&_h2]:text-[var(--coach-ink)] [&_li]:mt-1.5 [&_p]:m-0 [&_strong]:text-[var(--coach-ink)] [&_ul]:m-0 [&_ul]:list-disc [&_ul]:pl-5">
        {children}
      </div>
    </article>
  );
}
