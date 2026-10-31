/**
 * The dashboard's Practice card: is there a review to do, how long it takes,
 * and how much is waiting. Words only; the numbers come from the Practice home
 * model. (The memory curve under it is `memory-curve.ts`.)
 */
import type { CoachHomeModel } from "@/lib/practice/coach-home-model";

/** A card takes about half a minute in a review. */
const SECONDS_PER_CARD = 30;

export type PracticeCardView = {
  state: "due" | "caught-up" | "locked";
  headline: string;
  /** "8 cards · about 4 min". */
  size: string | null;
  /** "35 due in all, 3 of them ones you missed." */
  detail: string | null;
  primary: { label: string; href: string } | null;
  last: string | null;
};

export function practiceCardView(model: CoachHomeModel, reviewedToday: boolean): PracticeCardView {
  const { hero, modes } = model;
  const last = hero.lastScore ? `Last review: ${hero.lastScore.correct} of ${hero.lastScore.total} right` : null;

  if (hero.action.mode === "continue") {
    return {
      state: "locked",
      headline: "No cards yet",
      size: null,
      detail: "Finish a lesson and its cards show up here for review.",
      primary: null,
      last: null,
    };
  }

  if (hero.action.mode === "due") {
    const minutes = Math.max(1, Math.round((hero.sessionSize * SECONDS_PER_CARD) / 60));
    const parts = [
      hero.dueNow > hero.sessionSize ? `${hero.dueNow} due in all` : null,
      modes.missesDue > 0 ? `${modes.missesDue} of them ${modes.missesDue === 1 ? "one" : "ones"} you missed` : null,
    ].filter(Boolean);
    return {
      state: "due",
      headline: reviewedToday ? "Another review ready" : "Review ready",
      size: `${hero.sessionSize} ${hero.sessionSize === 1 ? "card" : "cards"} · about ${minutes} min`,
      detail: parts.length > 0 ? `${parts.join(", ")}.` : null,
      primary: { label: "Start review", href: hero.action.href },
      last,
    };
  }

  return {
    state: "caught-up",
    headline: "All caught up",
    size: null,
    detail: hero.nextReviewLabel ? `Next card comes due ${hero.nextReviewLabel}.` : "Nothing due right now.",
    primary: { label: "Free study", href: hero.action.href },
    last,
  };
}
