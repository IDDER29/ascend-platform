/**
 * Landing / marketing shared classes.
 * Visual formulas live in globals.css tokens + utilities.
 * Prefer these over re-stating the same Tailwind stacks.
 *
 * See: docs/design/PHOSPHOR-THEME.md
 */

/** Marketing card on default wash */
export const landingCardClass =
  "animate-rise group flex min-w-0 flex-col rounded-[18px] border border-card-border bg-bg p-4 shadow-card-rest transition-all duration-200 hover:-translate-y-0.5 hover:border-xp-border/70 hover:bg-paper hover:shadow-card-hover dark:bg-elevated dark:hover:bg-elevated dark:hover:border-card-border sm:rounded-[20px] sm:p-6";

/** Lighter card on tint bands */
export const landingCardOnTintClass =
  "animate-rise group flex min-w-0 flex-col rounded-[18px] border border-card-border bg-paper p-4 shadow-card-rest transition-all duration-200 hover:-translate-y-0.5 hover:border-xp-border/70 hover:shadow-card-hover dark:bg-elevated dark:hover:border-card-border sm:rounded-[20px] sm:p-6";

export const landingCardTitleClass =
  "font-display text-[18px] font-bold text-ink transition-colors group-hover:text-brand-violet";

/** Section eyebrow — uses .landing-eyebrow from globals */
export const landingEyebrowClass = "landing-eyebrow";

/** Section H2 — uses .landing-h2 from globals */
export const landingH2Class = "landing-h2";

/** Centered section H2 */
export const landingH2CenterClass = "landing-h2 landing-h2--center";

/** Supporting lead under a section title */
export const landingLeadClass = "landing-lead";

/** Standard green→gold icon tile */
export const landingIconTileClass = "icon-tile bg-brand-gradient";

/** Break / special icon — same gradient + crystal glaze */
export const landingIconCrystalClass = "icon-tile icon-crystal";

/** Frosted glass panel */
export const glassSurfaceClass = "glass-surface";

/** Soft wash blobs behind glass */
export const glassWashClass = "glass-wash";

/** Nav Ascend mark */
export const brandMarkClass = "brand-mark";

/** Footer Ascend mark */
export const brandMarkSmClass = "brand-mark brand-mark--sm";

/** Final CTA gradient panel */
export const ctaPanelClass = "cta-panel animate-rise";
