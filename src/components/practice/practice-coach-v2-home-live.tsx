"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Boxes,
  Layers3,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  dueCount,
  ensureUnlockedCards,
  migrateMissQueueOnce,
  readCards,
  readNewDayMeta,
  writeCards,
} from "@/lib/practice/cards";
import {
  readLocalHistory,
  type PracticeSessionRecord,
} from "@/lib/practice/history";
import { unlockedQuestions } from "@/lib/practice/session";
import type { PracticeCard } from "@/lib/practice/sm2";
import { CURRICULUM_HREF } from "@/lib/routes";

export type PracticeCoachV2HomeLiveProps = {
  userId: string | null;
  completedKeys: string[];
  initialCards: PracticeCard[];
  initialHistory: PracticeSessionRecord[];
};

export type CoachHomeAction = {
  href: string;
  label: string;
  mode: "due" | "all" | "continue";
};

export function selectCoachHomeAction(
  dueNow: number,
  unlockedCount: number,
): CoachHomeAction {
  if (dueNow > 0) {
    return {
      href: "/practicev2/session?scope=due",
      label: `Start ${dueNow} due`,
      mode: "due",
    };
  }
  if (unlockedCount > 0) {
    return {
      href: "/practicev2/session?scope=all",
      label: "Free study",
      mode: "all",
    };
  }
  return {
    href: CURRICULUM_HREF,
    label: "Continue learning",
    mode: "continue",
  };
}

export function PracticeCoachV2HomeLive({
  userId,
  completedKeys,
  initialCards,
  initialHistory,
}: PracticeCoachV2HomeLiveProps) {
  const completed = useMemo(() => new Set(completedKeys), [completedKeys]);
  const unlocked = useMemo(() => unlockedQuestions(completed), [completed]);
  const unlockedIds = useMemo(
    () => unlocked.map((question) => question.id),
    [unlocked],
  );
  const [dueNow, setDueNow] = useState(0);
  const [ready, setReady] = useState(false);
  const [history, setHistory] = useState(initialHistory);

  useEffect(() => {
    let cancelled = false;

    if (initialCards.length > 0) {
      writeCards(userId, initialCards);
    }
    migrateMissQueueOnce(userId);
    ensureUnlockedCards(userId, unlockedIds);

    const cards = readCards(userId);
    const meta = readNewDayMeta(userId);
    const localHistory = readLocalHistory(userId);
    const byId = new Map<string, PracticeSessionRecord>();
    for (const session of [...localHistory, ...initialHistory]) {
      byId.set(session.id, session);
    }
    const mergedHistory = [...byId.values()]
      .sort((a, b) => b.at.localeCompare(a.at))
      .slice(0, 40);
    const nextDue = dueCount(cards, meta, new Date());

    queueMicrotask(() => {
      if (cancelled) return;
      setDueNow(nextDue);
      setHistory(mergedHistory);
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [initialCards, initialHistory, unlockedIds, userId]);

  const action = selectCoachHomeAction(dueNow, unlocked.length);
  const latestSession = history[0];
  const latestMisses = latestSession?.missIds.length ?? 0;

  return (
    <div className="min-w-0 text-ink">
      <header>
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-ink-fainter">
          Practice coach
        </p>
        <h1 className="mt-2 font-display text-4xl font-extrabold tracking-[-0.035em] sm:text-5xl">
          Practice
        </h1>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-ink-secondary">
          Mixed recall from what you have unlocked. Due cards follow the shared
          SM-2 schedule; free study is always optional.
        </p>
      </header>

      <div className="mt-8 grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section
          className="min-w-0 rounded-3xl bg-ink p-7 text-bg shadow-lg sm:p-10"
          aria-labelledby="up-next-title"
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-brand-lime px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-ink">
              Up next
            </span>
            <span className="font-mono text-xs text-bg/65">
              {ready ? `${unlocked.length} unlocked` : "Checking your cards…"}
            </span>
          </div>
          <h2
            id="up-next-title"
            className="mt-6 font-display text-3xl font-extrabold tracking-tight sm:text-4xl"
          >
            {!ready
              ? "Preparing your review"
              : dueNow > 0
                ? `${dueNow} ${dueNow === 1 ? "card is" : "cards are"} due`
                : unlocked.length > 0
                  ? "You’re caught up"
                  : "Unlock your first cards"}
          </h2>
          <p className="mt-3 max-w-xl leading-relaxed text-bg/70">
            {!ready
              ? "Syncing this device with your latest practice state."
              : dueNow > 0
                ? "Review only the cards scheduled for now. No random filler."
                : unlocked.length > 0
                  ? "Nothing is scheduled right now. Study unlocked cards if you want another pass."
                  : "Complete a lesson to build a real practice queue."}
          </p>
          <div className="mt-8">
            {ready ? (
              <Button href={action.href} size="xl">
                {action.label}
              </Button>
            ) : (
              <span className="inline-flex h-14 items-center rounded-xl border border-bg/20 px-6 font-semibold text-bg/60">
                Preparing…
              </span>
            )}
          </div>
        </section>

        <aside className="rounded-3xl border border-card-border bg-elevated p-6 shadow-sm">
          <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-ink-fainter">
            Your review
          </h2>
          <dl className="mt-6 space-y-5">
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-sm text-ink-secondary">Due now</dt>
              <dd className="font-display text-3xl font-extrabold">
                {ready ? dueNow : "—"}
              </dd>
            </div>
            <div className="h-px bg-card-border" />
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-sm text-ink-secondary">Unlocked</dt>
              <dd className="font-display text-3xl font-extrabold">
                {unlocked.length}
              </dd>
            </div>
          </dl>
          <p className="mt-6 text-sm leading-relaxed text-ink-fainter">
            Counts come from your saved cards and today’s new-card allowance.
          </p>
        </aside>
      </div>

      <section className="mt-10" aria-labelledby="modes-title">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2
            id="modes-title"
            className="font-display text-2xl font-extrabold"
          >
            Choose a mode
          </h2>
          <span className="text-sm text-ink-fainter">
            Due review follows the schedule. Free study does not.
          </span>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {unlocked.length > 0 ? (
            <Link
              href="/practicev2/session?scope=all"
              className="group rounded-2xl border border-card-border bg-elevated p-5 shadow-sm outline-none transition hover:-translate-y-0.5 hover:border-brand-violet focus-visible:ring-2 focus-visible:ring-brand-violet/40"
            >
              <Layers3
                aria-hidden="true"
                className="size-6 text-brand-violet"
              />
              <span className="mt-5 block text-lg font-bold">Free study</span>
              <span className="mt-1 block text-sm leading-relaxed text-ink-secondary">
                Shuffle all {unlocked.length} unlocked{" "}
                {unlocked.length === 1 ? "card" : "cards"}.
              </span>
            </Link>
          ) : (
            <Link
              href={CURRICULUM_HREF}
              className="group rounded-2xl border border-card-border bg-elevated p-5 shadow-sm outline-none transition hover:-translate-y-0.5 hover:border-brand-violet focus-visible:ring-2 focus-visible:ring-brand-violet/40"
            >
              <BookOpen
                aria-hidden="true"
                className="size-6 text-brand-violet"
              />
              <span className="mt-5 block text-lg font-bold">
                Continue learning
              </span>
              <span className="mt-1 block text-sm leading-relaxed text-ink-secondary">
                Finish a lesson to unlock practice cards.
              </span>
            </Link>
          )}
          <Link
            href="/practicev2/bank"
            className="group rounded-2xl border border-card-border bg-elevated p-5 shadow-sm outline-none transition hover:-translate-y-0.5 hover:border-brand-violet focus-visible:ring-2 focus-visible:ring-brand-violet/40"
          >
            <Boxes aria-hidden="true" className="size-6 text-brand-violet" />
            <span className="mt-5 block text-lg font-bold">Browse bank</span>
            <span className="mt-1 block text-sm leading-relaxed text-ink-secondary">
              See the Coach card-bank layout.
            </span>
          </Link>
          <Link
            href="/practicev2/custom"
            className="group rounded-2xl border border-card-border bg-elevated p-5 shadow-sm outline-none transition hover:-translate-y-0.5 hover:border-brand-violet focus-visible:ring-2 focus-visible:ring-brand-violet/40"
          >
            <SlidersHorizontal
              aria-hidden="true"
              className="size-6 text-brand-violet"
            />
            <span className="mt-5 block text-lg font-bold">Custom deck</span>
            <span className="mt-1 block text-sm leading-relaxed text-ink-secondary">
              Choose lessons in the visual deck builder.
            </span>
          </Link>
        </div>
      </section>

      <div className="mt-10 grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="rounded-3xl border border-card-border bg-elevated p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.12em] text-brand-violet">
                Always open
              </p>
              <h2 className="mt-2 font-display text-2xl font-extrabold">
                Foundations
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-secondary">
                Bits, logic, and first principles in a focused Coach path.
              </p>
            </div>
            <Button
              href="/practicev2/foundations"
              variant="secondary"
              size="lg"
            >
              Open Foundations
            </Button>
          </div>
        </section>

        <section className="rounded-3xl border border-card-border bg-elevated p-6">
          <h2 className="font-display text-xl font-extrabold">
            Latest session
          </h2>
          {latestSession ? (
            <>
              <p className="mt-3 text-sm text-ink-secondary">
                {latestSession.scopeLabel}
              </p>
              <p className="mt-1 font-mono text-sm text-ink">
                {latestSession.correct}/{latestSession.total} correct
              </p>
              {latestMisses > 0 ? (
                <Link
                  href="/practicev2/session?scope=due"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-brand-violet outline-none hover:underline focus-visible:ring-2 focus-visible:ring-brand-violet/40"
                >
                  <RotateCcw aria-hidden="true" className="size-4" />
                  Retry {latestMisses}{" "}
                  {latestMisses === 1 ? "miss" : "misses"}
                </Link>
              ) : (
                <p className="mt-4 text-sm font-semibold text-xp-text">
                  No misses in that session.
                </p>
              )}
            </>
          ) : (
            <p className="mt-3 text-sm leading-relaxed text-ink-secondary">
              Complete a review and its real result will appear here.
            </p>
          )}
          <Link
            href="/practicev2/bank"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-ink-secondary outline-none hover:text-ink focus-visible:ring-2 focus-visible:ring-brand-violet/40"
          >
            Browse cards
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}
