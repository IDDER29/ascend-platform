"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, ChevronRight, X } from "lucide-react";
import { PracticeDemoBar } from "@/components/practice/practice-demo-bar";
import {
  DESK_ROW_SHEEN,
  DESK_STAGE,
  DESK_STUDY_PUNCH,
  DESK_WASH_HOME,
  DESK_WASH_QUIET,
} from "@/components/practice/practice-desk";
import {
  practiceDemoCards,
  type PracticeDemoView,
} from "@/lib/practice/demo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { PRACTICE_BANK } from "@/lib/practice/bank";
import {
  applyGrades,
  dueCount,
  dueQueueIds,
  ensureUnlockedCards,
  gradeFromMcqCorrect,
  migrateMissQueueOnce,
  nextReviewAt,
  readCards,
  readNewDayMeta,
  writeCards,
  writeNewDayMeta,
} from "@/lib/practice/cards";
import {
  buildSession,
  coalesceAnsweredSnapshot,
  questionsForScope,
  unlockedLessonOptions,
  unlockedPathBuckets,
  unlockedQuestions,
  type PracticeScope,
} from "@/lib/practice/session";
import {
  PRACTICE_PATH_BLURBS,
  PRACTICE_PATH_MARKS,
  PRACTICE_PATH_TITLES,
} from "@/lib/practice/path-map";
import { practiceSectionForPath } from "@/lib/practice/tree";
import {
  formatSessionWhen,
  newSessionId,
  pathProgressFromHistory,
  prependLocalSession,
  readLocalHistory,
  type PracticeSessionRecord,
} from "@/lib/practice/history";
import {
  savePracticeSessionAction,
  upsertPracticeCardsAction,
} from "@/lib/practice/actions";
import {
  localDayKey,
  type PracticeCard,
  type PracticeGrade,
} from "@/lib/practice/sm2";
import { answersMatch, normalizeAnswer } from "@/lib/practice/normalize";
import type {
  ClozeItem,
  PracticeItem,
  TypedItem,
} from "@/lib/practice/types";
import {
  countDueQuestions,
  type PracticePathDrillIn,
  type PracticeSectionDrillIn,
} from "@/lib/practice/drill-in";
import { trainingMomentum } from "@/lib/practice/momentum";
import { PATHS_HREF } from "@/lib/routes";

type PracticeHomeProps = {
  userId: string | null;
  completedKeys: string[];
  reviewHrefs: Record<string, string>;
  initialHistory?: PracticeSessionRecord[];
  initialCards: PracticeCard[];
  demoView?: PracticeDemoView | null;
  drillIn?: PracticePathDrillIn | PracticeSectionDrillIn;
};

type Phase = "ready" | "session" | "results";
type Answered = { questionId: string; grade: PracticeGrade };

type ActiveScope = {
  scope: PracticeScope;
  scopeLabel: string;
  pathSlug: string | null;
};

const DEMO_USER = "demo-preview";

function gradeIsHit(grade: PracticeGrade): boolean {
  return grade === "good" || grade === "easy";
}

function labelForScope(scope: PracticeScope): ActiveScope {
  if (scope.type === "due") {
    return { scope, scopeLabel: "Due cards", pathSlug: null };
  }
  if (scope.type === "all") {
    return {
      scope,
      scopeLabel: "Everything unlocked",
      pathSlug: null,
    };
  }
  if (scope.type === "path") {
    return {
      scope,
      scopeLabel: PRACTICE_PATH_TITLES[scope.pathSlug] ?? scope.pathSlug,
      pathSlug: scope.pathSlug,
    };
  }
  if (scope.type === "section") {
    return {
      scope,
      scopeLabel:
        practiceSectionForPath(scope.pathSlug, scope.sectionId)?.title ??
        scope.sectionId,
      pathSlug: scope.pathSlug,
    };
  }
  return {
    scope,
    scopeLabel:
      scope.keys.length === 1
        ? "1 lesson"
        : `${scope.keys.length} lessons`,
    pathSlug: null,
  };
}
function sampleSession(): PracticeItem[] {
  const prefer = [
    "bits-01",
    "bits-fc-01",
    "bits-typed-01",
    "bits-cloze-01",
    "bits-02",
    "bool-01",
    "ptr-01",
    "bits-fc-02",
  ];
  const byId = new Map(PRACTICE_BANK.map((q) => [q.id, q]));
  const picked = prefer
    .map((id) => byId.get(id))
    .filter((item): item is PracticeItem => Boolean(item));
  const session =
    picked.length >= 3 ? picked.slice(0, 5) : PRACTICE_BANK.slice(0, 5);
  // Interleave formats so demo sessions don’t telegraph “MCQ then flashcard”.
  for (let i = session.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [session[i], session[j]] = [session[j]!, session[i]!];
  }
  // Demo session starts at index 1 with index 0 pre-answered — keep typed/cloze visible.
  const preAnsweredKind = (kind: PracticeItem["kind"]) =>
    kind === "typed" || kind === "cloze";
  const demoFirstKind = (kind: PracticeItem["kind"]) =>
    kind === "mcq" || kind === "flashcard";
  const first = session[0];
  if (first && preAnsweredKind(first.kind)) {
    const swapIdx = session.findIndex(
      (item, i) => i > 0 && demoFirstKind(item.kind),
    );
    if (swapIdx !== -1) {
      [session[0], session[swapIdx]] = [session[swapIdx]!, session[0]!];
    }
  }
  for (const id of ["bits-typed-01", "bits-cloze-01"] as const) {
    if (!session.some((item) => item.id === id)) {
      const fallback = byId.get(id);
      if (fallback) session[session.length - 1] = fallback;
    }
  }
  return session;
}

/** Demo-only history so the desk rail isn’t an empty hole in layout review. */
function sampleHistory(): PracticeSessionRecord[] {
  const now = Date.now();
  const day = 86_400_000;
  return [
    {
      id: "demo-s1",
      at: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
      scopeType: "due",
      scopeLabel: "Due cards",
      pathSlug: null,
      correct: 2,
      total: 2,
      missIds: [],
      questionIds: ["bits-01", "bits-02"],
    },
    {
      id: "demo-s2",
      at: new Date(now - day).toISOString(),
      scopeType: "path",
      scopeLabel: "Foundations",
      pathSlug: "foundations",
      correct: 3,
      total: 4,
      missIds: ["bool-01"],
      questionIds: ["bits-01", "bits-02", "bool-01", "gates-01"],
    },
    {
      id: "demo-s3",
      at: new Date(now - 3 * day).toISOString(),
      scopeType: "path",
      scopeLabel: "Systems Programmer",
      pathSlug: "systems-programmer",
      correct: 6,
      total: 8,
      missIds: ["ptr-01", "ptr-03"],
      questionIds: [
        "ptr-01",
        "ptr-02",
        "ptr-03",
        "ptr-04",
        "ptr-05",
        "ptr-06",
        "ptr-07",
        "ptr-08",
      ],
    },
  ];
}

export function PracticeHome({
  ...props
}: PracticeHomeProps) {
  return <PracticeSessionHost {...props} />;
}

export function PracticeSessionHost({
  userId,
  completedKeys,
  reviewHrefs,
  initialHistory = [],
  initialCards,
  demoView = null,
  drillIn,
}: PracticeHomeProps) {
  const demo = Boolean(demoView);
  const effectiveUserId = demo ? DEMO_USER : userId;

  const completed = useMemo(() => {
    if (demo && demoView !== "empty") {
      return new Set(
        PRACTICE_BANK.map((q) => `${q.lessonLevel}/${q.lessonSlug}`),
      );
    }
    return new Set(completedKeys);
  }, [completedKeys, demo, demoView]);

  const unlocked = useMemo(
    () => unlockedQuestions(completed),
    [completed],
  );
  const unlockedIds = useMemo(
    () => new Set(unlocked.map((q) => q.id)),
    [unlocked],
  );

  const [history, setHistory] = useState<PracticeSessionRecord[]>(() =>
    demo && demoView === "ready" ? sampleHistory() : initialHistory,
  );
  const [historyReady, setHistoryReady] = useState(false);
  const [activeScope, setActiveScope] = useState<ActiveScope>(() =>
    labelForScope({ type: "all" }),
  );

  const [phase, setPhase] = useState<Phase>(() => {
    if (demoView === "session") return "session";
    if (demoView === "results") return "results";
    return "ready";
  });
  const [questions, setQuestions] = useState<PracticeItem[]>(() =>
    demoView === "session" || demoView === "results" ? sampleSession() : [],
  );
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [answered, setAnswered] = useState<Answered[]>(() => {
    if (demoView !== "results") return [];
    return sampleSession().map((q, i) => ({
      questionId: q.id,
      grade: i < 3 ? "good" : "again",
    }));
  });
  const [dueNow, setDueNow] = useState(0);
  const [dueQuestionIds, setDueQuestionIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [nextReview, setNextReview] = useState<string | null>(null);

  const refreshDueState = useCallback(() => {
    const cards = readCards(effectiveUserId);
    const meta = readNewDayMeta(effectiveUserId);
    const now = new Date();
    setDueNow(dueCount(cards, meta, now));
    setDueQuestionIds(
      new Set(dueQueueIds(cards, meta, now, cards.length)),
    );
    setNextReview(nextReviewAt(cards, now));
  }, [effectiveUserId]);

  useEffect(() => {
    if (demo && demoView !== "empty") {
      const now = new Date();
      writeCards(effectiveUserId, practiceDemoCards(now));
      writeNewDayMeta(effectiveUserId, { date: localDayKey(now), count: 0 });
      queueMicrotask(refreshDueState);
      return;
    }
    if (initialCards.length > 0) {
      writeCards(effectiveUserId, initialCards);
    }
    migrateMissQueueOnce(effectiveUserId);
    ensureUnlockedCards(effectiveUserId, [...unlockedIds]);
    queueMicrotask(refreshDueState);
  }, [
    demo,
    demoView,
    effectiveUserId,
    initialCards,
    refreshDueState,
    unlockedIds,
  ]);

  useEffect(() => {
    let cancelled = false;
    const commitHistory = (local: PracticeSessionRecord[]) => {
      if (cancelled) return;
      setHistory((server) => {
        const byId = new Map<string, PracticeSessionRecord>();
        for (const session of [...local, ...server]) {
          byId.set(session.id, session);
        }
        return [...byId.values()]
          .sort((a, b) => b.at.localeCompare(a.at))
          .slice(0, 40);
      });
      setHistoryReady(true);
    };

    if (demo) {
      queueMicrotask(() => {
        if (cancelled) return;
        if (demoView === "ready") setHistory(sampleHistory());
        setHistoryReady(true);
      });
    } else {
      const local = readLocalHistory(effectiveUserId);
      queueMicrotask(() => commitHistory(local));
    }

    return () => {
      cancelled = true;
    };
  }, [demo, demoView, effectiveUserId]);

  useEffect(() => {
    if (!demoView) return;
    if (demoView === "empty") return;
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      if (demoView === "ready") {
        setPhase("ready");
        setQuestions([]);
        setIndex(0);
        setSelected(null);
        setChecked(false);
        setRevealed(false);
        setShowHint(false);
        setAnswered([]);
        return;
      }
      const sample = sampleSession();
      setQuestions(sample);
      if (demoView === "session") {
        setPhase("session");
        setIndex(1);
        setSelected(null);
        setChecked(false);
        setRevealed(false);
        setShowHint(false);
        setAnswered([{ questionId: sample[0]!.id, grade: "good" }]);
      } else {
        setPhase("results");
        setAnswered(
          sample.map((q, i) => ({
            questionId: q.id,
            grade: i < 3 ? "good" : "again",
          })),
        );
      }
    });
    return () => {
      cancelled = true;
    };
  }, [demoView]);

  function startSession(scope: PracticeScope = { type: "all" }) {
    const labeled = labelForScope(scope);
    const cards = readCards(effectiveUserId);
    const meta = readNewDayMeta(effectiveUserId);
    const now = new Date();
    let priorityIds: string[];
    if (scope.type === "due") {
      priorityIds = dueQueueIds(cards, meta, now, 8);
    } else {
      const idsInScope = new Set(
        questionsForScope(completed, scope).map((question) => question.id),
      );
      const scopeCards = cards.filter((card) =>
        idsInScope.has(card.questionId),
      );
      priorityIds = dueQueueIds(scopeCards, meta, now, 8);
    }
    const next = buildSession({
      completedKeys: completed,
      priorityIds,
      size: 8,
      scope,
    });
    if (next.length === 0) return;
    setActiveScope(labeled);
    setQuestions(next);
    setIndex(0);
    setSelected(null);
    setChecked(false);
    setRevealed(false);
    setShowHint(false);
    setAnswered([]);
    setPhase("session");
  }

  function checkAnswer() {
    const q = questions[index];
    if (!q || q.kind !== "mcq" || selected === null || checked) return;
    const isCorrect = selected === q.correct;
    setChecked(true);
    setAnswered((prev) => [
      ...prev,
      { questionId: q.id, grade: gradeFromMcqCorrect(isCorrect) },
    ]);
  }

  function finishSession(nextAnswered: Answered[]) {
    const missIds = nextAnswered
      .filter((a) => !gradeIsHit(a.grade))
      .map((a) => a.questionId);
    const correctIds = nextAnswered
      .filter((a) => gradeIsHit(a.grade))
      .map((a) => a.questionId);
    const questionIds = nextAnswered.map((a) => a.questionId);
    const answeredIds = new Set(questionIds);
    const updated = applyGrades(effectiveUserId, nextAnswered);
    refreshDueState();

    if (userId && !demo) {
      void upsertPracticeCardsAction(
        updated.filter((card) => answeredIds.has(card.questionId)),
      );
    }

    if (!demo) {
      const record: PracticeSessionRecord = {
        id: newSessionId(),
        at: new Date().toISOString(),
        scopeType: activeScope.scope.type,
        scopeLabel: activeScope.scopeLabel,
        pathSlug: activeScope.pathSlug,
        correct: correctIds.length,
        total: nextAnswered.length,
        missIds,
        questionIds,
      };
      setHistory(prependLocalSession(effectiveUserId, record));
      if (userId) {
        void savePracticeSessionAction({
          id: record.id,
          scopeType: record.scopeType,
          scopeLabel: record.scopeLabel,
          pathSlug: record.pathSlug,
          correct: record.correct,
          total: record.total,
          missIds: record.missIds,
          questionIds: record.questionIds,
          at: record.at,
        });
      }
    }

    setPhase("results");
  }

  function next(nextAnswered?: unknown) {
    const snapshot = coalesceAnsweredSnapshot(nextAnswered, answered);
    if (index + 1 >= questions.length) {
      finishSession(snapshot);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setChecked(false);
    setRevealed(false);
    setShowHint(false);
  }

  function gradeFlashcard(grade: PracticeGrade) {
    const q = questions[index];
    if (!q || q.kind !== "flashcard" || !revealed) return;
    const nextAnswered = [...answered, { questionId: q.id, grade }];
    setAnswered(nextAnswered);
    next(nextAnswered);
  }

  function gradeProduce(grade: "again" | "hard" | "good") {
    const q = questions[index];
    if (!q || (q.kind !== "typed" && q.kind !== "cloze")) return;
    const nextAnswered = [...answered, { questionId: q.id, grade }];
    setAnswered(nextAnswered);
    next(nextAnswered);
  }

  const showEmpty =
    demoView === "empty" || (!demo && unlocked.length === 0);

  return (
    <>
      {demo && demoView ? <PracticeDemoBar view={demoView} /> : null}

      {showEmpty ? (
        <EmptyPanel />
      ) : phase === "ready" ? (
        drillIn ? (
          <DrillInHub
            data={drillIn}
            dueQuestionIds={dueQuestionIds}
            onStart={startSession}
          />
        ) : (
          <PracticeHub
            completed={completed}
            dueNow={dueNow}
            nextReviewAt={nextReview}
            history={historyReady ? history : initialHistory}
            signedIn={Boolean(userId)}
            onStart={startSession}
          />
        )
      ) : phase === "results" ? (
        <ResultsView
          questions={questions}
          answered={answered}
          reviewHrefs={reviewHrefs}
          onAgain={() => startSession(activeScope.scope)}
          onHub={() => setPhase("ready")}
          backLabel={drillIn ? "Back to scope" : "Back to Practice"}
        />
      ) : (
        <SessionView
          questions={questions}
          index={index}
          selected={selected}
          checked={checked}
          revealed={revealed}
          showHint={showHint}
          answered={answered}
          onSelect={setSelected}
          onCheck={checkAnswer}
          onNext={() => next()}
          onReveal={() => setRevealed(true)}
          onFlashGrade={gradeFlashcard}
          onProduceGrade={gradeProduce}
          onToggleHint={() => setShowHint((v) => !v)}
          onExit={() => setPhase("ready")}
        />
      )}
    </>
  );
}

function DrillInHub({
  data,
  dueQuestionIds,
  onStart,
}: {
  data: PracticePathDrillIn | PracticeSectionDrillIn;
  dueQuestionIds: ReadonlySet<string>;
  onStart: (scope: PracticeScope) => void;
}) {
  if ("sections" in data) {
    const questionCount = data.sections.reduce(
      (total, section) => total + section.questionCount,
      0,
    );
    const dueCount = data.sections.reduce(
      (total, section) =>
        total + countDueQuestions(section.questionIds, dueQuestionIds),
      0,
    );

    return (
      <div className="flex min-w-0 flex-col gap-6">
        <section className={cn(DESK_STUDY_PUNCH, DESK_WASH_QUIET)}>
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <h2 className="font-display text-[18px] font-extrabold text-ink">
                  Study the whole path
                </h2>
                {dueCount > 0 ? (
                  <span className="font-mono text-[11px] tabular-nums text-ink-fainter">
                    {dueCount} due
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-[13.5px] text-ink-secondary">
                Due cards in this path come first, then unlocked cards are
                shuffled.
              </p>
            </div>
            <Button
              size="md"
              className="w-full flex-none sm:w-auto"
              onClick={() =>
                onStart({ type: "path", pathSlug: data.pathSlug })
              }
              disabled={questionCount === 0}
            >
              {questionCount > 0
                ? `Study path · ${questionCount}`
                : "No cards unlocked"}
            </Button>
          </div>
        </section>

        <section>
          <h2 className="font-display text-[16px] font-extrabold text-ink">
            Sections
          </h2>
          <p className="mt-0.5 text-[12.5px] text-ink-fainter">
            Open a branch for lesson-level practice.
          </p>
          <ul className="mt-3 overflow-hidden rounded-[14px] border border-divider bg-paper">
            {data.sections.map((section, index) => {
              const sectionDueCount = countDueQuestions(
                section.questionIds,
                dueQuestionIds,
              );
              return (
                <li
                  key={section.id}
                  className={cn(index > 0 && "border-t border-divider")}
                >
                  <Link
                    href={`/practice/${data.pathSlug}/${section.id}`}
                    className={cn(
                      "group flex items-center gap-3 px-3.5 py-3 sm:px-4",
                      DESK_ROW_SHEEN,
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-violet/35",
                    )}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="font-display text-[15px] font-extrabold text-ink">
                        {section.title}
                      </span>
                      {section.blurb ? (
                        <span className="mt-0.5 block text-[13px] leading-snug text-ink-secondary">
                          {section.blurb}
                        </span>
                      ) : null}
                      <span className="mt-1 block font-mono text-[11px] tabular-nums text-ink-fainter">
                        {section.lessonCount} lesson
                        {section.lessonCount === 1 ? "" : "s"} ·{" "}
                        {section.questionCount} unlocked
                        {sectionDueCount > 0
                          ? ` · ${sectionDueCount} due`
                          : ""}
                      </span>
                    </span>
                    <span className="flex flex-none items-center gap-1 text-[13px] font-bold text-ink-fainter transition-colors group-hover:text-ink">
                      Continue
                      <ChevronRight
                        size={14}
                        aria-hidden
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    );
  }

  const sectionDueCount = data.lessons.reduce(
    (total, lesson) =>
      total + countDueQuestions(lesson.questionIds, dueQuestionIds),
    0,
  );

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <section className={cn(DESK_STUDY_PUNCH, DESK_WASH_QUIET)}>
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <h2 className="font-display text-[18px] font-extrabold text-ink">
                Study this branch
              </h2>
              {sectionDueCount > 0 ? (
                <span className="font-mono text-[11px] tabular-nums text-ink-fainter">
                  {sectionDueCount} due
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-[13.5px] text-ink-secondary">
              Practice unlocked cards from every lesson in this section.
            </p>
          </div>
          <Button
            size="md"
            className="w-full flex-none sm:w-auto"
            onClick={() =>
              onStart({
                type: "section",
                pathSlug: data.pathSlug,
                sectionId: data.sectionId,
              })
            }
            disabled={data.questionCount === 0}
          >
            {data.questionCount > 0
              ? `Study branch · ${data.questionCount}`
              : "No cards unlocked"}
          </Button>
        </div>
      </section>

      <section>
        <h2 className="font-display text-[16px] font-extrabold text-ink">
          Lessons
        </h2>
        <p className="mt-0.5 text-[12.5px] text-ink-fainter">
          Focus a session on one lesson.
        </p>
        <ul className="mt-3 overflow-hidden rounded-[14px] border border-divider bg-paper">
          {data.lessons.map((lesson, index) => {
            const lessonDueCount = countDueQuestions(
              lesson.questionIds,
              dueQuestionIds,
            );
            return (
              <li
                key={lesson.key}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-3 sm:px-4",
                  index > 0 && "border-t border-divider",
                )}
              >
                <span className="min-w-0 flex-1">
                  <span className="font-display text-[15px] font-extrabold text-ink">
                    {lesson.title}
                  </span>
                  <span className="mt-1 block font-mono text-[11px] tabular-nums text-ink-fainter">
                    {lesson.questionCount} unlocked card
                    {lesson.questionCount === 1 ? "" : "s"}
                    {lessonDueCount > 0 ? ` · ${lessonDueCount} due` : ""}
                  </span>
                </span>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    onStart({ type: "lessons", keys: [lesson.key] })
                  }
                  disabled={lesson.questionCount === 0}
                >
                  Study
                  <ChevronRight size={13} aria-hidden />
                </Button>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

function EmptyPanel() {
  return (
    <Card hover={false} className="mx-auto max-w-[640px] p-6 sm:p-8">
      <h2 className="font-display text-[20px] font-extrabold text-ink">
        Nothing in the bank yet
      </h2>
      <p className="mt-2 text-[15px] leading-relaxed text-ink-secondary">
        Practice questions haven&apos;t been added for this path.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button href="/dashboard">Continue</Button>
        <Button href={PATHS_HREF} variant="secondary">
          Paths
        </Button>
      </div>
    </Card>
  );
}

function PracticeHub({
  completed,
  dueNow,
  nextReviewAt,
  history,
  signedIn,
  onStart,
}: {
  completed: Set<string>;
  dueNow: number;
  nextReviewAt: string | null;
  history: PracticeSessionRecord[];
  signedIn: boolean;
  onStart: (scope: PracticeScope) => void;
}) {
  const paths = useMemo(() => unlockedPathBuckets(completed), [completed]);
  const lessons = useMemo(() => unlockedLessonOptions(completed), [completed]);
  const totalQuestions = useMemo(
    () => unlockedQuestions(completed).length,
    [completed],
  );
  const pathProgress = useMemo(
    () => pathProgressFromHistory(history),
    [history],
  );
  const momentum = useMemo(() => trainingMomentum(history), [history]);
  const recent = history.slice(0, 6);
  const last = history[0] ?? null;
  const nextReviewLabel = useMemo(() => {
    if (!nextReviewAt) return null;
    const date = new Date(nextReviewAt);
    if (!Number.isFinite(date.getTime())) return null;
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  }, [nextReviewAt]);

  const [picking, setPicking] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  function toggleLesson(key: string) {
    setSelectedKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  }

  const lessonsByPath = useMemo(() => {
    const map = new Map<string, typeof lessons>();
    for (const lesson of lessons) {
      const list = map.get(lesson.pathSlug) ?? [];
      list.push(lesson);
      map.set(lesson.pathSlug, list);
    }
    return map;
  }, [lessons]);

  return (
    <div className="grid w-full grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(240px,280px)] lg:items-start lg:gap-0">
      {/* Main — Due + decks */}
      <div className="flex min-w-0 flex-col gap-8 lg:pr-9">
        <section className={cn(DESK_STAGE, DESK_WASH_HOME, "animate-rise")}>
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-stretch sm:justify-between sm:gap-10">
            <div className="flex min-w-0 flex-1 flex-col">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-xp-text/85">
                {dueNow > 0 ? "Due now" : "Caught up"}
              </p>
              <h2 className="mt-1.5 max-w-[18ch] font-display text-[26px] font-extrabold tracking-[-0.03em] text-ink sm:text-[30px]">
                {dueNow > 0 ? "Ready to review" : "Nothing due"}
              </h2>
              <p className="mt-1.5 max-w-[38ch] text-[14px] leading-relaxed text-ink-secondary">
                {dueNow > 0
                  ? `${dueNow} card${dueNow === 1 ? " is" : "s are"} ready for review.${
                      nextReviewLabel
                        ? ` Next review ${nextReviewLabel}.`
                        : ""
                    }`
                  : nextReviewLabel
                    ? `Next review ${nextReviewLabel}.`
                    : "Study unlocked cards anytime, or pick a path below."}
              </p>
              {last ? (
                <p className="mt-2.5 font-mono text-[11px] text-ink-fainter">
                  Last · {last.correct}/{last.total} · {last.scopeLabel} ·{" "}
                  {formatSessionWhen(last.at)}
                </p>
              ) : null}
              <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-5">
                {dueNow > 0 ? (
                  <Button onClick={() => onStart({ type: "due" })} size="md">
                    Study due cards
                  </Button>
                ) : (
                  <Button onClick={() => onStart({ type: "all" })} size="md">
                    Study unlocked
                  </Button>
                )}
                {dueNow > 0 ? (
                  <button
                    type="button"
                    onClick={() => onStart({ type: "all" })}
                    className="text-[13px] font-semibold text-ink-fainter underline-offset-2 hover:text-ink hover:underline"
                  >
                    Study unlocked instead
                  </button>
                ) : null}
              </div>
            </div>

            <div className="flex flex-none flex-row items-end gap-5 border-t border-xp-border/40 pt-4 sm:w-[112px] sm:flex-col sm:items-end sm:border-l sm:border-t-0 sm:border-xp-border/40 sm:pl-6 sm:pt-0">
              {dueNow > 0 ? (
                <>
                  <div className="text-left sm:w-full sm:text-right">
                    <p className="font-display text-[48px] font-extrabold leading-none tracking-[-0.045em] tabular-nums text-ink sm:text-[56px]">
                      {dueNow}
                    </p>
                    <p className="mt-1 font-mono text-[10.5px] font-bold uppercase tracking-[0.12em] text-xp-text">
                      due
                    </p>
                  </div>
                  <div className="text-left sm:w-full sm:text-right">
                    <p className="font-mono text-[13px] font-bold tabular-nums text-ink-secondary">
                      {totalQuestions}
                    </p>
                    <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-fainter">
                      in bank
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-left sm:w-full sm:text-right">
                    <p className="font-display text-[48px] font-extrabold leading-none tracking-[-0.045em] tabular-nums text-ink sm:text-[56px]">
                      {totalQuestions}
                    </p>
                    <p className="mt-1 font-mono text-[10.5px] font-bold uppercase tracking-[0.12em] text-xp-text">
                      in bank
                    </p>
                  </div>
                  <div className="text-left sm:w-full sm:text-right">
                    <p className="font-mono text-[13px] font-bold tabular-nums text-ink-secondary">
                      0
                    </p>
                    <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-fainter">
                      due
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        <section>
          <div className="mb-3">
            <h3 className="font-display text-[16px] font-extrabold text-ink">
              Paths
            </h3>
            <p className="mt-0.5 text-[12.5px] text-ink-fainter">
              Open a path to choose a branch or lesson
            </p>
          </div>

          <ul className="overflow-hidden rounded-[14px] border border-divider bg-paper">
            {paths.map((path, i) => {
              const mark =
                PRACTICE_PATH_MARKS[path.pathSlug] ??
                path.title.slice(0, 2).toUpperCase();
              const blurb =
                PRACTICE_PATH_BLURBS[path.pathSlug] ??
                `${path.questionCount} questions unlocked.`;
              const isFoundations = path.pathSlug === "foundations";

              return (
                <li
                  key={path.pathSlug}
                  className={cn(i > 0 && "border-t border-divider")}
                >
                  <Link
                    href={`/practice/${path.pathSlug}`}
                    className={cn(
                      "group flex w-full items-start gap-3 px-3.5 py-3 text-left sm:px-4",
                      DESK_ROW_SHEEN,
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-violet/35",
                    )}
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex h-9 w-9 flex-none items-center justify-center rounded-[10px] font-display text-[12.5px] font-extrabold",
                        isFoundations
                          ? "bg-brand-gradient text-white"
                          : "border border-divider bg-elevated text-ink",
                      )}
                    >
                      {mark}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                        <span className="font-display text-[15px] font-extrabold text-ink">
                          {path.title}
                        </span>
                        {isFoundations ? (
                          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-xp-text">
                            Always open
                          </span>
                        ) : null}
                      </span>
                      <span className="mt-0.5 block text-[13px] leading-snug text-ink-secondary">
                        {blurb}
                      </span>
                      <span className="mt-1 block font-mono text-[11px] tabular-nums text-ink-fainter">
                        {path.questionCount} card
                        {path.questionCount === 1 ? "" : "s"} ·{" "}
                        {path.lessonCount} lesson
                        {path.lessonCount === 1 ? "" : "s"}
                      </span>
                    </span>
                    <span className="mt-1 flex flex-none items-center gap-0.5 text-[13px] font-bold text-ink-fainter transition-colors group-hover:text-ink">
                      Open path
                      <ChevronRight
                        size={14}
                        aria-hidden
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 rounded-[12px] border border-dashed border-divider px-3.5 py-3">
            <p className="text-[13px] text-ink-secondary">
              Custom deck from lessons
            </p>
            <button
              type="button"
              onClick={() => setPicking((v) => !v)}
              className="flex-none text-[13px] font-bold text-brand-violet hover:text-ink"
            >
              {picking ? "Close" : "Choose lessons"}
            </button>

            {picking ? (
              <div className="mt-3 w-full border-t border-divider pt-3">
                <div className="flex flex-col gap-4">
                  {[...lessonsByPath.entries()].map(
                    ([pathSlug, pathLessons]) => (
                      <div key={pathSlug}>
                        <p className="mb-1.5 font-mono text-[10.5px] font-bold uppercase tracking-[0.1em] text-ink-fainter">
                          {pathLessons[0]?.pathTitle ?? pathSlug}
                        </p>
                        <ul className="flex flex-col gap-0.5">
                          {pathLessons.map((lesson) => {
                            const on = selectedKeys.includes(lesson.key);
                            return (
                              <li key={lesson.key}>
                                <button
                                  type="button"
                                  onClick={() => toggleLesson(lesson.key)}
                                  className={cn(
                                    "flex w-full items-center gap-3 rounded-[10px] px-2 py-2 text-left transition-colors hover:bg-elevated/70",
                                    on && "bg-xp-bg",
                                  )}
                                >
                                  <span
                                    className={cn(
                                      "flex h-5 w-5 flex-none items-center justify-center rounded-md border transition-colors",
                                      on
                                        ? "border-brand-violet bg-brand-violet text-white"
                                        : "border-divider bg-paper",
                                    )}
                                  >
                                    {on ? (
                                      <Check size={12} strokeWidth={3} />
                                    ) : null}
                                  </span>
                                  <span className="min-w-0 flex-1 text-[13.5px] font-medium capitalize text-ink">
                                    {lesson.label}
                                  </span>
                                  <span className="font-mono text-[11px] tabular-nums text-ink-fainter">
                                    {lesson.questionCount}q
                                  </span>
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ),
                  )}
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-divider pt-3">
                  <Button
                    onClick={() =>
                      onStart({ type: "lessons", keys: selectedKeys })
                    }
                    disabled={selectedKeys.length === 0}
                    size="sm"
                  >
                    {selectedKeys.length === 0
                      ? "Select a lesson"
                      : `Study · ${selectedKeys.length}`}
                  </Button>
                  {selectedKeys.length > 0 ? (
                    <button
                      type="button"
                      onClick={() => setSelectedKeys([])}
                      className="text-[13px] font-semibold text-ink-fainter hover:text-ink"
                    >
                      Clear
                    </button>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </div>

      <aside className="flex min-w-0 flex-col gap-7 lg:sticky lg:top-8 lg:border-l lg:border-divider lg:pl-8">
        <section>
          <div className="mb-2.5">
            <h3 className="font-display text-[14px] font-extrabold text-ink">
              Training
            </h3>
            <p className="mt-0.5 text-[12px] leading-snug text-ink-fainter">
              Correct ÷ seen — not a schedule
            </p>
          </div>
          {history.length === 0 ? (
            <p className="text-[13px] leading-relaxed text-ink-secondary">
              Study once and training stats land here.
            </p>
          ) : (
            <>
              <p className="mb-4 font-mono text-[10.5px] leading-relaxed tabular-nums text-ink-fainter">
                Cleared today · {momentum.cardsClearedToday}
                <span aria-hidden> · </span>
                Sessions · {momentum.sessionsThisWeek} this week
                {nextReviewLabel ? (
                  <>
                    <span aria-hidden> · </span>
                    Next review · {nextReviewLabel}
                  </>
                ) : null}
              </p>

              <ul className="flex flex-col gap-3">
                {pathProgress.map((row) => (
                  <li key={row.pathSlug}>
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="min-w-0 truncate text-[13px] font-semibold text-ink">
                        {row.title}
                      </p>
                      <span className="flex-none font-mono text-[12px] font-bold tabular-nums text-xp-text">
                        {row.accuracy}%
                      </span>
                    </div>
                    <p className="mt-0.5 font-mono text-[10.5px] text-ink-fainter">
                      {row.correct}/{row.total} seen
                      {row.sessions > 1 ? ` · ${row.sessions} sessions` : ""}
                    </p>
                    <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-elevated">
                      <div
                        className="h-full rounded-full bg-brand-gradient"
                        style={{ width: `${row.accuracy}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mb-2.5 mt-6 border-t border-divider pt-5">
                <h4 className="font-display text-[13px] font-extrabold text-ink">
                  Recent
                </h4>
                <p className="mt-0.5 text-[12px] leading-snug text-ink-fainter">
                  {signedIn
                    ? "Device cache · syncs when DB is ready"
                    : "Saved on this device"}
                </p>
              </div>
              <ul className="flex flex-col">
                {recent.map((session, i) => (
                  <li
                    key={session.id}
                    className={cn(
                      "-mx-2 flex items-center gap-2 rounded-[10px] px-2 py-2 transition-colors hover:bg-elevated/70",
                      i > 0 && "border-t border-divider",
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold text-ink">
                        {session.scopeLabel}
                      </p>
                      <p className="mt-0.5 font-mono text-[10.5px] text-ink-fainter">
                        {formatSessionWhen(session.at)}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "flex-none font-mono text-[12px] font-bold tabular-nums",
                        session.correct === session.total
                          ? "text-xp-text"
                          : "text-ink-secondary",
                      )}
                    >
                      {session.correct}/{session.total}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </aside>
    </div>
  );
}

function SessionView({
  questions,
  index,
  selected,
  checked,
  revealed,
  showHint,
  answered,
  onSelect,
  onCheck,
  onNext,
  onReveal,
  onFlashGrade,
  onProduceGrade,
  onToggleHint,
  onExit,
}: {
  questions: PracticeItem[];
  index: number;
  selected: number | null;
  checked: boolean;
  revealed: boolean;
  showHint: boolean;
  answered: Answered[];
  onSelect: (i: number) => void;
  onCheck: () => void;
  onNext: () => void;
  onReveal: () => void;
  onFlashGrade: (grade: PracticeGrade) => void;
  onProduceGrade: (grade: "again" | "hard" | "good") => void;
  onToggleHint: () => void;
  onExit: () => void;
}) {
  const q = questions[index];
  if (!q) return null;

  return (
    <div className="mx-auto w-full max-w-[640px]">
      <div className="mb-5 flex items-center gap-3">
        <button
          type="button"
          onClick={onExit}
          className="rounded-lg px-2 py-1.5 text-[13px] font-semibold text-ink-fainter transition-colors hover:text-ink"
        >
          Exit
        </button>
        <div className="flex flex-1 items-center justify-center gap-1.5">
          {questions.map((question, i) => {
            const prior = answered[i];
            const state = prior
              ? gradeIsHit(prior.grade)
                ? "correct"
                : "wrong"
              : i === index
                ? "current"
                : "pending";
            return (
              <span
                key={question.id}
                className={cn(
                  "flex h-[20px] w-[20px] flex-none items-center justify-center rounded-full",
                  state === "correct" && "bg-xp-text",
                  state === "wrong" && "bg-[#F87171]",
                  state === "current" &&
                    "border-2 border-brand-violet bg-paper",
                  state === "pending" && "border border-divider bg-elevated",
                )}
              >
                {state === "correct" ? (
                  <Check size={9} className="text-white" strokeWidth={3.5} />
                ) : null}
                {state === "wrong" ? (
                  <X size={9} className="text-white" strokeWidth={3.5} />
                ) : null}
                {state === "current" ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-violet" />
                ) : null}
              </span>
            );
          })}
        </div>
        <span className="w-10 text-right font-mono text-[12px] text-ink-fainter">
          {index + 1}/{questions.length}
        </span>
      </div>

      <Card hover={false}>
        <div className="p-6 sm:p-7">
          {q.kind === "flashcard" ? (
            <>
              <p className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-ink-fainter">
                Recall first
              </p>
              <h2 className="font-display text-[22px] font-extrabold leading-snug tracking-tight text-ink sm:text-[24px]">
                {q.front}
              </h2>

              {q.frontCode ? (
                <PracticeCodeBlock lines={q.frontCode} className="mt-5" />
              ) : null}

              {showHint && !revealed ? (
                <div className="mt-5 rounded-xl border border-divider bg-elevated px-4 py-3.5 text-sm leading-relaxed text-ink-secondary">
                  <span className="font-semibold text-ink">Hint — </span>
                  {q.hint}
                </div>
              ) : null}

              {!revealed ? (
                <div className="mt-8 flex items-center justify-between border-t border-divider pt-5">
                  {q.hint ? (
                    <button
                      type="button"
                      onClick={onToggleHint}
                      className="text-[13.5px] font-semibold text-ink-fainter hover:text-ink"
                    >
                      {showHint ? "Hide hint" : "Hint"}
                    </button>
                  ) : (
                    <span />
                  )}
                  <Button onClick={onReveal}>Reveal answer</Button>
                </div>
              ) : (
                <section
                  aria-live="polite"
                  className="mt-8 border-t border-divider pt-6"
                >
                  <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-xp-text">
                    Answer
                  </p>
                  <p className="mt-2 max-w-[60ch] text-[17px] font-medium leading-relaxed text-ink">
                    {q.back}
                  </p>
                  <div className="mt-7 border-t border-divider pt-5">
                    <p className="mb-3 text-[13px] text-ink-fainter">
                      How well did you recall it?
                    </p>
                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                      {(
                        [
                          ["again", "Again"],
                          ["hard", "Hard"],
                          ["good", "Good"],
                          ["easy", "Easy"],
                        ] as const
                      ).map(([grade, label]) => (
                        <Button
                          key={grade}
                          variant={grade === "good" ? "primary" : "secondary"}
                          size="sm"
                          className={cn(
                            "w-full",
                            grade === "good" && "font-extrabold",
                          )}
                          onClick={() => onFlashGrade(grade)}
                        >
                          {label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </section>
              )}
            </>
          ) : q.kind === "mcq" ? (
            <>
              <h2 className="mb-5 font-display text-[22px] font-extrabold leading-snug tracking-tight text-ink sm:text-[24px]">
                {q.prompt}
              </h2>

              {q.code ? <PracticeCodeBlock lines={q.code} /> : null}

              <div className="flex flex-col gap-2.5">
                {q.options.map((opt, i) => {
                  const isSelected = selected === i;
                  const isCorrectOpt = i === q.correct;

                  let stateClass =
                    "border-divider bg-paper hover:border-divider hover:bg-elevated/70";
                  let badgeClass = "bg-elevated text-ink-secondary";
                  let indicator = (
                    <span className="h-[22px] w-[22px] flex-none rounded-full border-2 border-divider bg-paper" />
                  );

                  if (checked) {
                    if (isCorrectOpt) {
                      stateClass = "border-xp-border bg-xp-bg";
                      badgeClass = "bg-xp-text text-white";
                      indicator = (
                        <span className="flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full bg-xp-text">
                          <Check
                            size={12}
                            className="text-white"
                            strokeWidth={3}
                          />
                        </span>
                      );
                    } else if (isSelected) {
                      stateClass = "border-[#F0562F] bg-[#FEF4F1]";
                      badgeClass = "bg-[#F0562F] text-white";
                      indicator = (
                        <span className="flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full bg-[#F0562F]">
                          <X
                            size={12}
                            className="text-white"
                            strokeWidth={3}
                          />
                        </span>
                      );
                    }
                  } else if (isSelected) {
                    stateClass = "border-xp-border bg-xp-bg";
                    badgeClass = "bg-brand-gradient text-white";
                    indicator = (
                      <span className="flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full bg-brand-violet">
                        <Check
                          size={12}
                          className="text-white"
                          strokeWidth={3}
                        />
                      </span>
                    );
                  }

                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        if (!checked) onSelect(i);
                      }}
                      disabled={checked}
                      className={cn(
                        "flex items-center gap-3.5 rounded-[14px] border-[1.5px] px-4 py-4 text-left transition-colors",
                        stateClass,
                        checked ? "cursor-default" : "cursor-pointer",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-[30px] w-[30px] flex-none items-center justify-center rounded-[9px] font-mono text-[13px] font-extrabold",
                          badgeClass,
                        )}
                      >
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="flex-1 text-[15px] font-medium text-ink">
                        {opt}
                      </span>
                      {indicator}
                    </button>
                  );
                })}
              </div>

              {showHint ? (
                <div className="mt-4 rounded-xl border border-divider bg-elevated px-4 py-3.5 text-sm leading-relaxed text-ink-secondary">
                  <span className="font-semibold text-ink">Hint — </span>
                  {q.hint}
                </div>
              ) : null}

              <div className="mt-6 flex items-center justify-between border-t border-divider pt-5">
                <button
                  type="button"
                  onClick={onToggleHint}
                  className="text-[13.5px] font-semibold text-ink-fainter hover:text-ink"
                >
                  Hint
                </button>
                {checked ? (
                  <Button onClick={onNext}>
                    {index + 1 >= questions.length ? "See results" : "Next"}
                  </Button>
                ) : (
                  <Button onClick={onCheck} disabled={selected === null}>
                    Check answer
                  </Button>
                )}
              </div>
            </>
          ) : q.kind === "typed" || q.kind === "cloze" ? (
            <PracticeProducePanel
              key={q.id}
              item={q}
              onGrade={onProduceGrade}
            />
          ) : (
            assertNever(q)
          )}
        </div>
      </Card>
    </div>
  );
}

function PracticeProducePanel({
  item,
  onGrade,
}: {
  item: TypedItem | ClozeItem;
  onGrade: (grade: "again" | "hard" | "good") => void;
}) {
  const [input, setInput] = useState("");
  const [missed, setMissed] = useState(false);
  const empty = normalizeAnswer(input) === "";
  const [primaryAnswer, ...otherAnswers] = item.answers;
  const alternateAnswers = otherAnswers.filter(
    (answer) => normalizeAnswer(answer) !== normalizeAnswer(primaryAnswer ?? ""),
  );

  function submitAnswer(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (missed || empty) return;
    if (answersMatch(input, item.answers)) {
      onGrade("good");
      return;
    }
    setMissed(true);
  }

  const inputClass = cn(
    "rounded-[10px] border bg-paper px-3 py-2 font-mono text-[15px] font-semibold text-ink outline-none transition-colors",
    "placeholder:text-ink-fainter focus:border-brand-violet focus:ring-2 focus:ring-brand-violet/20",
    item.kind === "typed" ? "w-full" : "w-[12rem] max-w-full",
    missed ? "border-[#F0562F]" : "border-divider",
  );

  const answerInput = (
    <input
      id="practice-produce-answer"
      value={input}
      onChange={(event) => setInput(event.target.value)}
      disabled={missed}
      autoFocus
      autoComplete="off"
      autoCapitalize="none"
      autoCorrect="off"
      spellCheck={false}
      aria-label={item.kind === "cloze" ? "Fill in the blank" : "Your answer"}
      className={inputClass}
    />
  );

  return (
    <form onSubmit={submitAnswer}>
      <p className="mb-3 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-ink-fainter">
        Type your answer
      </p>

      {item.kind === "typed" ? (
        <>
          <h2 className="font-display text-[22px] font-extrabold leading-snug tracking-tight text-ink sm:text-[24px]">
            {item.prompt}
          </h2>
          {item.code ? (
            <PracticeCodeBlock lines={item.code} className="mt-5" />
          ) : null}
          <label
            htmlFor="practice-produce-answer"
            className="mt-6 block text-[13px] font-semibold text-ink-secondary"
          >
            Your answer
          </label>
          <div className="mt-2">{answerInput}</div>
        </>
      ) : item.template ? (
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-3 text-[18px] font-medium leading-relaxed text-ink">
          <span>{item.template.split("{{blank}}", 2)[0]}</span>
          {answerInput}
          <span>{item.template.split("{{blank}}", 2)[1]}</span>
        </div>
      ) : item.templateCode ? (
        <ClozeCodeBlock lines={item.templateCode} input={answerInput} />
      ) : (
        <div className="rounded-xl border border-divider bg-elevated p-4 text-[14px] text-ink-secondary">
          This cloze card has no template.
        </div>
      )}

      {missed ? (
        <section
          aria-live="polite"
          className="mt-7 border-t border-divider pt-6"
        >
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-ink-fainter">
            Answer
          </p>
          <p className="mt-2 font-mono text-[17px] font-bold text-ink">
            {primaryAnswer}
          </p>
          {alternateAnswers.length > 0 ? (
            <p className="mt-1.5 text-[13px] text-ink-fainter">
              Also accepted: {alternateAnswers.join(", ")}
            </p>
          ) : null}
          <div className="mt-6 grid grid-cols-2 gap-2.5">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={() => onGrade("again")}
            >
              Again
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={() => onGrade("hard")}
            >
              Hard
            </Button>
          </div>
        </section>
      ) : (
        <div className="mt-7 flex justify-end border-t border-divider pt-5">
          <Button type="submit" disabled={empty}>
            Check
          </Button>
        </div>
      )}
    </form>
  );
}

function ClozeCodeBlock({
  lines,
  input,
}: {
  lines: string[];
  input: React.ReactNode;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-[#121816] px-5 py-4.5 font-mono text-[13.5px] leading-[1.95] text-[#D4E0D9]">
      {lines.map((line, i) => {
        const [before, after] = line.split("{{blank}}", 2);
        return (
          <div key={i} className="flex min-w-max items-baseline gap-3.5">
            <span className="w-[18px] flex-none select-none text-right text-[#55635c]">
              {i + 1}
            </span>
            <span>
              {before}
              {after === undefined ? null : (
                <>
                  <span className="mx-1 inline-block align-middle">{input}</span>
                  {after}
                </>
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function assertNever(value: never): never {
  throw new Error(`Unsupported practice item: ${JSON.stringify(value)}`);
}

function PracticeCodeBlock({
  lines,
  className,
}: {
  lines: string[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-6 overflow-x-auto rounded-2xl bg-[#121816] px-5 py-4.5 font-mono text-[13.5px] leading-[1.95] text-[#D4E0D9]",
        className,
      )}
    >
      {lines.map((line, i) => (
        <div key={i} className="flex gap-3.5">
          <span className="w-[18px] flex-none select-none text-right text-[#55635c]">
            {i + 1}
          </span>
          <span>{line}</span>
        </div>
      ))}
    </div>
  );
}

function ResultsView({
  questions,
  answered,
  reviewHrefs,
  onAgain,
  onHub,
  backLabel,
}: {
  questions: PracticeItem[];
  answered: Answered[];
  reviewHrefs: Record<string, string>;
  onAgain: () => void;
  onHub: () => void;
  backLabel: string;
}) {
  const correctCount = answered.filter((a) => gradeIsHit(a.grade)).length;

  return (
    <div className="mx-auto w-full max-w-[640px]">
      <h2 className="font-mono text-[14px] font-bold tabular-nums text-ink-secondary">
        {correctCount} correct / {questions.length}
      </h2>
      <p className="mt-1.5 text-[14.5px] text-ink-secondary">
        Review misses below — then drill again when you’re ready.
      </p>

      <Card hover={false} className="mt-6">
        <div className="p-5 sm:p-6">
          <div className="mb-3 font-display text-[15px] font-extrabold text-ink">
            Question review
          </div>
          <div className="flex flex-col gap-0.5">
            {answered.map((a, i) => {
              const question = questions[i];
              if (!question) return null;
              const hit = gradeIsHit(a.grade);
              const row = (
                <>
                  <span
                    className={cn(
                      "flex h-6 w-6 flex-none items-center justify-center rounded-full",
                      hit
                        ? "bg-xp-bg text-xp-text"
                        : "bg-[#FEECEC] text-[#F0562F]",
                    )}
                  >
                    {hit ? (
                      <Check size={12} strokeWidth={3} />
                    ) : (
                      <X size={12} strokeWidth={3} />
                    )}
                  </span>
                  <span className="min-w-0 flex-1 text-[13.5px] text-ink">
                    Q{i + 1} · {question.reviewLabel}
                  </span>
                  {!hit ? (
                    <span className="text-xs font-bold text-brand-violet">
                      Review →
                    </span>
                  ) : null}
                </>
              );

              if (hit) {
                return (
                  <div
                    key={question.id}
                    className="-mx-1 flex items-center gap-3 rounded-[11px] px-2 py-2.5"
                  >
                    {row}
                  </div>
                );
              }

              return (
                <Link
                  key={question.id}
                  href={reviewHrefs[question.id] ?? PATHS_HREF}
                  className="-mx-1 flex items-center gap-3 rounded-[11px] px-2 py-2.5 transition-colors hover:bg-elevated/70"
                >
                  {row}
                </Link>
              );
            })}
          </div>
        </div>
      </Card>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button onClick={onAgain}>Practice again</Button>
        <Button onClick={onHub} variant="secondary">
          {backLabel}
        </Button>
      </div>
    </div>
  );
}
