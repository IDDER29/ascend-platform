"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  PRACTICE_COACH_V2_CSS,
  PRACTICE_COACH_V2_HTML,
} from "@/components/practice/practice-coach-v2-markup";
import {
  dueCount,
  ensureUnlockedCards,
  migrateMissQueueOnce,
  readCards,
  readNewDayMeta,
  writeCards,
} from "@/lib/practice/cards";
import type { PracticeSessionRecord } from "@/lib/practice/history";
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

const DUE_COPY_SUFFIX =
  "choices, flashcards, cloze and short answers, shuffled";

function dueCopyLine(dueNow: number): string {
  const cardWord = dueNow === 1 ? "card" : "cards";
  return `${dueNow} ${cardWord} · ${DUE_COPY_SUFFIX}`;
}

function sessionHrefForLink(anchor: HTMLAnchorElement): string {
  const text = anchor.textContent ?? "";
  if (text.includes("Retry") || text.includes("Fix your misses")) {
    return "/practicev2/session?scope=due";
  }
  return "/practicev2/session?scope=all";
}

export function patchCoachHomeDom(
  root: HTMLElement,
  dueNow: number,
  action: CoachHomeAction,
): void {
  const dueSection = root.querySelector(".coach-due");
  const dueParagraph = dueSection?.querySelector("#up-next + p");
  if (dueParagraph) {
    dueParagraph.textContent = dueCopyLine(dueNow);
  }

  const primaryCta = root.querySelector(
    ".coach-due-cta a",
  ) as HTMLAnchorElement | null;
  if (primaryCta) {
    primaryCta.setAttribute("href", action.href);
    const kbd = primaryCta.querySelector("kbd");
    primaryCta.textContent = "";
    primaryCta.append(document.createTextNode(action.label));
    if (kbd) {
      primaryCta.append(document.createTextNode("\n"));
      primaryCta.append(kbd);
    }
  }

  root.querySelectorAll('a[href="/practicev2/session"]').forEach((node) => {
    const anchor = node as HTMLAnchorElement;
    if (anchor.closest(".coach-due-cta")) return;
    anchor.setAttribute("href", sessionHrefForLink(anchor));
  });
}

export function PracticeCoachV2HomeLive({
  userId,
  completedKeys,
  initialCards,
  initialHistory,
}: PracticeCoachV2HomeLiveProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const completed = useMemo(() => new Set(completedKeys), [completedKeys]);
  const unlocked = useMemo(() => unlockedQuestions(completed), [completed]);
  const unlockedIds = useMemo(
    () => unlocked.map((question) => question.id),
    [unlocked],
  );
  const [dueNow, setDueNow] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (initialCards.length > 0) {
      writeCards(userId, initialCards);
    }
    migrateMissQueueOnce(userId);
    ensureUnlockedCards(userId, unlockedIds);

    const cards = readCards(userId);
    const meta = readNewDayMeta(userId);
    const nextDue = dueCount(cards, meta, new Date());

    queueMicrotask(() => {
      if (cancelled) return;
      setDueNow(nextDue);
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [initialCards, initialHistory, unlockedIds, userId]);

  const action = useMemo(
    () => selectCoachHomeAction(dueNow, unlocked.length),
    [dueNow, unlocked.length],
  );

  useEffect(() => {
    if (!ready || !rootRef.current) return;
    patchCoachHomeDom(rootRef.current, dueNow, action);
  }, [ready, dueNow, action]);

  return (
    <>
      <style id="practice-coach-v2-css">{PRACTICE_COACH_V2_CSS}</style>
      <div
        ref={rootRef}
        className="practice-coach-v2"
        dangerouslySetInnerHTML={{ __html: PRACTICE_COACH_V2_HTML }}
      />
    </>
  );
}
