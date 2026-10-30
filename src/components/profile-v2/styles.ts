/** Shared Coach class strings for the profile. */
export const TWO_COLUMNS =
  "grid w-full min-w-0 grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(250px,280px)]";

export const CARD =
  "flex min-w-0 flex-col gap-4 rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-5";

export const CARD_TITLE = "m-0 text-base font-semibold";

export const MUTED_LINE = "m-0 text-[14px] leading-relaxed text-[var(--coach-ink-secondary)]";

const SMALL_BUTTON_BASE =
  "inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border-2 px-3 text-[13px] font-semibold no-underline disabled:opacity-60";

export const SMALL_BUTTON = `${SMALL_BUTTON_BASE} border-[var(--coach-border)] bg-[var(--coach-surface)] text-[var(--coach-ink)] hover:border-[var(--coach-border-strong)]`;

export const SMALL_LIME_BUTTON = `${SMALL_BUTTON_BASE} border-transparent bg-[var(--coach-lime)] text-[var(--coach-lime-ink)] shadow-[0_3px_0_var(--coach-lime-shadow)]`;

export const FIELD =
  "h-10 w-full min-w-0 rounded-lg border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] px-3 text-[14px] text-[var(--coach-ink)] outline-none focus:border-[var(--coach-focus)]";
