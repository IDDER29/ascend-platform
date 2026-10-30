"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { dueCards, readNewDayMeta, syncLocalCards } from "@/lib/practice/cards";
import { PRACTICE_BANK } from "@/lib/practice/bank";
import { buildCoachBankModel } from "@/lib/practice/coach-bank-model";
import { deckSessionHref, savedDeckItems } from "@/lib/practice/coach-custom-model";
import { shakyCards } from "@/lib/practice/shaky";
import type { SavedDeck } from "@/lib/practice/deck-recipe";
import { practicePathSlugForLevel } from "@/lib/practice/path-map";
import { buildReviewOptions } from "@/lib/dashboard/review-options";
import { useBookmarks } from "@/lib/bookmarks/use-bookmarks";
import { practiceCardView } from "@/lib/dashboard/practice-card-model";
import { buildCoachHomeModel, type CoachHomeModel } from "@/lib/practice/coach-home-model";
import { deckMemory } from "@/lib/practice/deck-memory";
import { resolveDailyGoal, type DailyGoal } from "@/lib/practice/daily-goal";
import { mergeSessionHistory, readLocalHistory, type PracticeSessionRecord } from "@/lib/practice/history";
import { PRACTICE_ROUTES, practiceSessionHref } from "@/lib/practice/routes";
import { unlockedQuestions } from "@/lib/practice/session";
import type { PracticeCard } from "@/lib/practice/sm2";
import { MemoryCurveChart } from "./memory-curve-chart";
import { ReviewOptionsCard } from "./review-options-card";
import { TodayCard } from "./today-card";

export type PracticeTodayProps = {
  userId: string | null;
  completedKeys: string[];
  /** When each lesson was finished: lessons count toward the streak. */
  completionDates: string[];
  initialCards: PracticeCard[];
  initialHistory: PracticeSessionRecord[];
  initialGoal: DailyGoal | null;
  initialDecks: SavedDeck[];
};

const QUESTION_BY_ID = new Map(PRACTICE_BANK.map((q) => [q.id, q]));

const CARD = "rounded-[20px] border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-5";

/** Today's Practice, worked out in the browser like the Practice page (guests keep their reviews here). */
function usePracticeToday({
  userId,
  completedKeys,
  completionDates,
  initialCards,
  initialHistory,
  initialGoal,
  initialDecks,
}: PracticeTodayProps): {
  model: CoachHomeModel | null;
  history: PracticeSessionRecord[] | null;
  cards: PracticeCard[];
  dueByPath: Record<string, number> | null;
  pathCards: Record<string, string[]>;
  misses: string[];
  decks: { id: string; name: string; due: number; total: number; href: string | null; cardIds: string[] }[];
} {
  const completed = useMemo(() => new Set(completedKeys), [completedKeys]);
  const unlockedIds = useMemo(() => unlockedQuestions(completed).map((q) => q.id), [completed]);
  const [state, setState] = useState<{
    model: CoachHomeModel;
    history: PracticeSessionRecord[];
    cards: PracticeCard[];
    dueByPath: Record<string, number>;
    pathCards: Record<string, string[]>;
    misses: string[];
    decks: { id: string; name: string; due: number; total: number; href: string | null; cardIds: string[] }[];
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    const history = mergeSessionHistory(readLocalHistory(userId), initialHistory);
    const cards = syncLocalCards(userId, initialCards, unlockedIds);
    const next = buildCoachHomeModel({
      cards,
      history,
      meta: readNewDayMeta(userId),
      completedKeys: completed,
      goal: resolveDailyGoal(userId, initialGoal),
      now: new Date(),
      lessonDates: completionDates,
    });
    const now = new Date();
    const dueByPath: Record<string, number> = {};
    for (const card of dueCards(cards, readNewDayMeta(userId), now)) {
      const q = QUESTION_BY_ID.get(card.questionId);
      const slug = q ? practicePathSlugForLevel(q.lessonLevel) : null;
      if (slug) dueByPath[slug] = (dueByPath[slug] ?? 0) + 1;
    }
    const rows = buildCoachBankModel({ cards, history, completedKeys: completed, now }).rows;
    // Each path's cards you've started, and your misses due again: for each set's own curve.
    const pathCards: Record<string, string[]> = {};
    for (const card of cards) {
      if (card.state === "new") continue;
      const q = QUESTION_BY_ID.get(card.questionId);
      const slug = q ? practicePathSlugForLevel(q.lessonLevel) : null;
      if (slug) (pathCards[slug] ??= []).push(card.questionId);
    }
    const misses = cards
      .filter((c) => c.state === "learning" && Date.parse(c.dueAt) <= now.getTime())
      .map((c) => c.questionId);
    const decks = savedDeckItems(rows, initialDecks).map(({ deck, summary, href }) => ({
      cardIds: summary.pickedIds,
      id: deck.id,
      name: deck.name,
      due: summary.counts.due,
      total: summary.total,
      href,
    }));
    queueMicrotask(() => {
      if (!cancelled) setState({ model: next, history, cards, dueByPath, pathCards, misses, decks });
    });
    return () => {
      cancelled = true;
    };
  }, [completed, completionDates, initialCards, initialDecks, initialGoal, initialHistory, unlockedIds, userId]);

  return {
    model: state?.model ?? null,
    history: state?.history ?? null,
    cards: state?.cards ?? [],
    dueByPath: state?.dueByPath ?? null,
    pathCards: state?.pathCards ?? {},
    misses: state?.misses ?? [],
    decks: state?.decks ?? [],
  };
}

/** How much of your cards you'd recall, today and over the next weeks. Hidden until a card has been reviewed. */
function YourMemory({ history }: { history: PracticeSessionRecord[] | null }) {
  const memory = history ? deckMemory(history, new Date()) : null;
  if (!memory) return null;
  const now = Math.round(memory.now * 100);
  const nextDue = memory.nextDue
    ? new Date(memory.nextDue.at).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })
    : null;
  return (
    <div className="flex flex-col gap-3 border-t-2 border-[var(--coach-divider)] pt-4">
      <div className="flex flex-col gap-1">
        <p className="m-0 text-[15px] font-bold">{memory.reviewToday ? "Review today" : "No review needed today"}</p>
        <p className="m-0 text-[14px] leading-relaxed text-[var(--coach-ink-secondary)] [text-wrap:pretty]">
          You still remember about <span className="font-semibold text-[var(--coach-ink)]">{now}%</span> of your{" "}
          {memory.cards} {memory.cards === 1 ? "card" : "cards"}.{" "}
          {memory.reviewToday ? (
            <>
              {memory.dueNow} {memory.dueNow === 1 ? "has" : "have"} dropped below 90%; reviewing today brings you back
              to about{" "}
              <span className="font-semibold text-[var(--coach-ink)]">{Math.round(memory.afterReview * 100)}%</span>.
            </>
          ) : (
            <>Everything is above 90%{nextDue ? `; the next card comes due ${nextDue}` : ""}.</>
          )}
        </p>
      </div>
      <MemoryCurveChart memory={memory} />
      <p className="m-0 text-[12px] leading-snug text-[var(--coach-ink-muted)]">
        An estimate from your reviews, not a test.{" "}
        <Link href={PRACTICE_ROUTES.bank} className="underline underline-offset-2">
          See each card&apos;s own curve
        </Link>
      </p>
    </div>
  );
}

/** Is there a review to do, how long it takes, what's waiting, and what's coming this week. */
function PracticeDueCard({
  model,
  history,
}: {
  model: CoachHomeModel | null;
  history: PracticeSessionRecord[] | null;
}) {
  if (!model) return <div className={`${CARD} min-h-[148px]`} aria-busy="true" />;
  const v = practiceCardView(model, model.sessions.rows.length > 0);
  return (
    <section aria-labelledby="practice-title" className={`${CARD} flex flex-col gap-4`}>
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="practice-title" className="m-0 text-[16px] font-bold">
          Practice
        </h2>
        <Link
          href={PRACTICE_ROUTES.home}
          className="text-[13px] text-[var(--coach-ink-muted)] underline-offset-2 hover:underline"
        >
          Open Practice
        </Link>
      </div>

      <div className="flex flex-col gap-1">
        <p className="m-0 font-display text-[24px] font-extrabold leading-tight tracking-[-0.02em]">{v.headline}</p>
        {v.size && <p className="m-0 text-[15px] font-semibold text-[var(--coach-ink)]">{v.size}</p>}
        {v.detail && <p className="m-0 text-[14px] leading-relaxed text-[var(--coach-ink-secondary)]">{v.detail}</p>}
      </div>

      {v.primary && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Link
            href={v.primary.href}
            className={`inline-flex h-11 items-center rounded-xl px-5 text-[14.5px] font-bold no-underline ${
              v.state === "due"
                ? "bg-[var(--coach-solid-btn-bg)] text-[var(--coach-solid-btn-ink)] shadow-[0_4px_0_var(--coach-solid-btn-shadow)]"
                : "border-2 border-[var(--coach-border)] text-[var(--coach-ink)] hover:border-[var(--coach-border-strong)]"
            }`}
          >
            {v.primary.label}
          </Link>
          {v.last && <span className="text-[13px] text-[var(--coach-ink-muted)]">{v.last}</span>}
        </div>
      )}

      {v.state !== "locked" && <YourMemory history={history} />}
    </section>
  );
}

/** What you flagged in Bookmarks ("Didn't get it"), in this browser, and the Practice cards among them. */
function useFlagged(): { count: number; cardIds: string[] } {
  const flagged = (useBookmarks() ?? []).filter((b) => b.reason === "revisit");
  return { count: flagged.length, cardIds: flagged.flatMap((b) => (b.questionId ? [b.questionId] : [])) };
}

/** The top of the dashboard: the next lesson beside today's checklist, then Practice and the ways to review. */
export function TodayGrid({
  next,
  practice,
  lessonsDone,
  nextLessons,
  activePath,
  otherPaths,
}: {
  next: ReactNode;
  practice: PracticeTodayProps;
  lessonsDone: { title: string; at: string }[];
  nextLessons: { title: string; href: string }[];
  /** The path you're on and your other joined paths (from Your paths). */
  activePath: { slug: string; title: string } | null;
  otherPaths: { slug: string; title: string }[];
}) {
  const { model, history, dueByPath, pathCards, misses, decks } = usePracticeToday(practice);
  const flagged = useFlagged();
  const shaky = history ? shakyCards(history) : [];
  const options =
    model && dueByPath
      ? buildReviewOptions({
          misses,
          missesHref: `${PRACTICE_ROUTES.session}?scope=due`,
          shaky: {
            ids: shaky.map((c) => c.id),
            slow: shaky.filter((c) => c.reason === "slow").length,
            href:
              shaky.length > 0
                ? deckSessionHref(
                    shaky.slice(0, 30).map((c) => c.id),
                    "Right, but shaky",
                  )
                : null,
          },
          dueByPath,
          pathCards,
          activePath,
          otherPaths,
          pathHref: (slug, n) =>
            n > 0 ? practiceSessionHref({ scope: "path", path: slug }) : `${PRACTICE_ROUTES.paths}/${slug}`,
          decks,
          flagged,
        })
      : null;
  return (
    <>
      <div className="grid w-full min-w-0 grid-cols-1 items-stretch gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(260px,310px)]">
        {next}
        <TodayCard model={model} lessonsDone={lessonsDone} nextLessons={nextLessons} />
      </div>
      <div className="grid w-full min-w-0 grid-cols-1 items-start gap-5 md:grid-cols-2">
        <PracticeDueCard model={model} history={history} />
        <ReviewOptionsCard options={options} history={history} />
      </div>
    </>
  );
}
