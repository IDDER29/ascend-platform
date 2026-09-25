"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { Check, X } from "lucide-react";
import { PracticeDemoBar } from "@/components/practice/practice-demo-bar";
import type { PracticeDemoView } from "@/lib/practice/demo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";
import { PRACTICE_BANK } from "@/lib/practice/bank";
import {
  clearMissesResolved,
  enqueueMisses,
  readMissIds,
  writeMissIds,
} from "@/lib/practice/miss-queue";
import {
  buildSession,
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
import {
  formatSessionWhen,
  newSessionId,
  pathProgressFromHistory,
  prependLocalSession,
  readLocalHistory,
  type PracticeSessionRecord,
} from "@/lib/practice/history";
import { savePracticeSessionAction } from "@/lib/practice/actions";
import type { PracticeQuestion } from "@/lib/practice/types";
import { PATHS_HREF } from "@/lib/routes";

type PracticeHomeProps = {
  userId: string | null;
  completedKeys: string[];
  reviewHrefs: Record<string, string>;
  initialHistory?: PracticeSessionRecord[];
  demoView?: PracticeDemoView | null;
};

type Phase = "ready" | "session" | "results";
type Answered = { questionId: string; correct: boolean };

type ActiveScope = {
  scope: PracticeScope;
  scopeLabel: string;
  pathSlug: string | null;
};

const DEMO_USER = "demo-preview";
const subscribeToNothing = () => () => {};

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
  return {
    scope,
    scopeLabel:
      scope.keys.length === 1
        ? "1 lesson"
        : `${scope.keys.length} lessons`,
    pathSlug: null,
  };
}
function sampleSession(): PracticeQuestion[] {
  const prefer = ["bits-01", "bits-02", "bool-01", "ptr-01", "ptr-03"];
  const byId = new Map(PRACTICE_BANK.map((q) => [q.id, q]));
  const picked = prefer
    .map((id) => byId.get(id))
    .filter((q): q is PracticeQuestion => Boolean(q));
  return picked.length >= 3 ? picked.slice(0, 5) : PRACTICE_BANK.slice(0, 5);
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
  userId,
  completedKeys,
  reviewHrefs,
  initialHistory = [],
  demoView = null,
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
  const [questions, setQuestions] = useState<PracticeQuestion[]>(() =>
    demoView === "session" || demoView === "results" ? sampleSession() : [],
  );
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [answered, setAnswered] = useState<Answered[]>(() => {
    if (demoView !== "results") return [];
    return sampleSession().map((q, i) => ({
      questionId: q.id,
      correct: i < 3,
    }));
  });

  useEffect(() => {
    if (demo) {
      if (demoView === "ready") setHistory(sampleHistory());
      setHistoryReady(true);
      return;
    }
    const local = readLocalHistory(effectiveUserId);
    if (local.length > 0) {
      // Prefer richer of server seed vs local device history
      setHistory((server) => {
        const byId = new Map<string, PracticeSessionRecord>();
        for (const s of [...local, ...server]) byId.set(s.id, s);
        return [...byId.values()]
          .sort((a, b) => b.at.localeCompare(a.at))
          .slice(0, 40);
      });
    }
    setHistoryReady(true);
  }, [demo, demoView, effectiveUserId]);

  useEffect(() => {
    if (!demo || demoView !== "ready") return;
    writeMissIds(
      DEMO_USER,
      sampleSession()
        .slice(0, 2)
        .map((q) => q.id),
    );
  }, [demo, demoView]);

  useEffect(() => {
    if (!demoView) return;
    if (demoView === "empty") return;
    if (demoView === "ready") {
      setPhase("ready");
      setQuestions([]);
      setIndex(0);
      setSelected(null);
      setChecked(false);
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
      setShowHint(false);
      setAnswered([{ questionId: sample[0]!.id, correct: true }]);
    } else {
      setPhase("results");
      setAnswered(
        sample.map((q, i) => ({ questionId: q.id, correct: i < 3 })),
      );
    }
  }, [demoView]);

  const waitingMisses = useSyncExternalStore(
    subscribeToNothing,
    () =>
      readMissIds(effectiveUserId).filter((id) => unlockedIds.has(id)).length,
    () => (demo && demoView === "ready" ? 2 : 0),
  );

  function startSession(scope: PracticeScope = { type: "all" }) {
    const labeled = labelForScope(scope);
    const next = buildSession({
      completedKeys: completed,
      priorityIds: readMissIds(effectiveUserId),
      size: 8,
      scope,
    });
    if (next.length === 0) return;
    setActiveScope(labeled);
    setQuestions(next);
    setIndex(0);
    setSelected(null);
    setChecked(false);
    setShowHint(false);
    setAnswered([]);
    setPhase("session");
  }

  function checkAnswer() {
    const q = questions[index];
    if (!q || selected === null || checked) return;
    const isCorrect = selected === q.correct;
    setChecked(true);
    setAnswered((prev) => [
      ...prev,
      { questionId: q.id, correct: isCorrect },
    ]);
  }

  function finishSession(nextAnswered: Answered[]) {
    const missIds = nextAnswered
      .filter((a) => !a.correct)
      .map((a) => a.questionId);
    const correctIds = nextAnswered
      .filter((a) => a.correct)
      .map((a) => a.questionId);
    const questionIds = nextAnswered.map((a) => a.questionId);

    if (!demo) {
      enqueueMisses(effectiveUserId, missIds);
      clearMissesResolved(effectiveUserId, correctIds);

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

  function next() {
    if (index + 1 >= questions.length) {
      finishSession(answered);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
    setChecked(false);
    setShowHint(false);
  }

  const showEmpty =
    demoView === "empty" || (!demo && unlocked.length === 0);

  return (
    <>
      {demo && demoView ? <PracticeDemoBar view={demoView} /> : null}

      {showEmpty ? (
        <EmptyPanel />
      ) : phase === "ready" ? (
        <PracticeHub
          completed={completed}
          waitingMisses={waitingMisses}
          history={historyReady ? history : initialHistory}
          signedIn={Boolean(userId)}
          onStart={startSession}
        />
      ) : phase === "results" ? (
        <ResultsView
          questions={questions}
          answered={answered}
          reviewHrefs={reviewHrefs}
          onAgain={() => startSession(activeScope.scope)}
          onHub={() => setPhase("ready")}
        />
      ) : (
        <SessionView
          questions={questions}
          index={index}
          selected={selected}
          checked={checked}
          showHint={showHint}
          answered={answered}
          onSelect={setSelected}
          onCheck={checkAnswer}
          onNext={next}
          onToggleHint={() => setShowHint((v) => !v)}
          onExit={() => setPhase("ready")}
        />
      )}
    </>
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
  waitingMisses,
  history,
  signedIn,
  onStart,
}: {
  completed: Set<string>;
  waitingMisses: number;
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
  const recent = history.slice(0, 6);
  const last = history[0] ?? null;

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
        <section className="relative overflow-hidden rounded-[18px] border border-xp-border/60 bg-xp-bg px-5 py-5 sm:px-6 sm:py-6">
          <div
            className="pointer-events-none absolute -right-10 -top-14 h-40 w-40 rounded-full bg-brand-violet/[0.05] blur-2xl"
            aria-hidden
          />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-stretch sm:justify-between sm:gap-10">
            <div className="flex min-w-0 flex-1 flex-col">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-xp-text/85">
                {waitingMisses > 0 ? "Due queue" : "Caught up"}
              </p>
              <h2 className="mt-1.5 max-w-[18ch] font-display text-[22px] font-extrabold tracking-[-0.03em] text-ink sm:text-[24px]">
                {waitingMisses > 0
                  ? "Redo what you missed"
                  : "Nothing due right now"}
              </h2>
              <p className="mt-1.5 max-w-[38ch] text-[14px] leading-relaxed text-ink-secondary">
                {waitingMisses > 0
                  ? "Misses stay due until you answer them correctly."
                  : "Study unlocked cards anytime, or pick a path below."}
              </p>
              {last ? (
                <p className="mt-2.5 font-mono text-[11px] text-ink-fainter">
                  Last · {last.correct}/{last.total} · {last.scopeLabel} ·{" "}
                  {formatSessionWhen(last.at)}
                </p>
              ) : null}
              <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-5">
                {waitingMisses > 0 ? (
                  <Button onClick={() => onStart({ type: "due" })} size="md">
                    Study due
                  </Button>
                ) : (
                  <Button onClick={() => onStart({ type: "all" })} size="md">
                    Study unlocked
                  </Button>
                )}
                {waitingMisses > 0 ? (
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
              {waitingMisses > 0 ? (
                <>
                  <div className="text-left sm:w-full sm:text-right">
                    <p className="font-display text-[48px] font-extrabold leading-none tracking-[-0.045em] tabular-nums text-ink sm:text-[56px]">
                      {waitingMisses}
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
              Decks
            </h3>
            <p className="mt-0.5 text-[12.5px] text-ink-fainter">
              One path at a time · misses in that path come first
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
                  <button
                    type="button"
                    onClick={() =>
                      onStart({ type: "path", pathSlug: path.pathSlug })
                    }
                    className={cn(
                      "group flex w-full items-start gap-3.5 px-3.5 py-3.5 text-left transition-colors sm:px-4",
                      "hover:bg-elevated/70",
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
                    <span className="mt-1 flex flex-none items-center gap-0.5 text-[13px] font-bold text-brand-violet">
                      Study
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                        className="transition-transform group-hover:translate-x-0.5"
                      >
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </span>
                  </button>
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
                                    "flex w-full items-center gap-3 rounded-[10px] px-2 py-2 text-left transition-colors",
                                    on ? "bg-xp-bg" : "hover:bg-elevated",
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
              Hit rate
            </h3>
            <p className="mt-0.5 text-[12px] leading-snug text-ink-fainter">
              Correct ÷ seen — not a schedule
            </p>
          </div>
          {pathProgress.length === 0 ? (
            <p className="text-[13px] leading-relaxed text-ink-secondary">
              Study once and rates land here.
            </p>
          ) : (
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
          )}
        </section>

        <section>
          <div className="mb-2.5">
            <h3 className="font-display text-[14px] font-extrabold text-ink">
              Recent
            </h3>
            <p className="mt-0.5 text-[12px] leading-snug text-ink-fainter">
              {signedIn
                ? "Device cache · syncs when DB is ready"
                : "Saved on this device"}
            </p>
          </div>
          {recent.length === 0 ? (
            <p className="text-[13px] leading-relaxed text-ink-secondary">
              No sessions yet.
            </p>
          ) : (
            <ul className="flex flex-col">
              {recent.map((session, i) => (
                <li
                  key={session.id}
                  className={cn(
                    "flex items-center gap-2 py-2",
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
  showHint,
  answered,
  onSelect,
  onCheck,
  onNext,
  onToggleHint,
  onExit,
}: {
  questions: PracticeQuestion[];
  index: number;
  selected: number | null;
  checked: boolean;
  showHint: boolean;
  answered: Answered[];
  onSelect: (i: number) => void;
  onCheck: () => void;
  onNext: () => void;
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
              ? prior.correct
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
                  state === "correct" && "bg-[#12B981]",
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
          <h2 className="mb-5 font-display text-[22px] font-extrabold leading-snug tracking-tight text-ink sm:text-[24px]">
            {q.prompt}
          </h2>

          {q.code ? (
            <div className="mb-6 overflow-x-auto rounded-2xl bg-[#121816] px-5 py-4.5 font-mono text-[13.5px] leading-[1.95] text-[#D4E0D9]">
              {q.code.map((line, i) => (
                <div key={i} className="flex gap-3.5">
                  <span className="w-[18px] flex-none select-none text-right text-[#55635c]">
                    {i + 1}
                  </span>
                  <span>{line}</span>
                </div>
              ))}
            </div>
          ) : null}

          <div className="flex flex-col gap-2.5">
            {q.options.map((opt, i) => {
              const isSelected = selected === i;
              const isCorrectOpt = i === q.correct;

              let stateClass =
                "border-divider bg-paper hover:border-xp-border hover:bg-xp-bg/40";
              let badgeClass = "bg-elevated text-ink-secondary";
              let indicator = (
                <span className="h-[22px] w-[22px] flex-none rounded-full border-2 border-divider bg-paper" />
              );

              if (checked) {
                if (isCorrectOpt) {
                  stateClass = "border-[#12B981] bg-[#F3FBF7]";
                  badgeClass = "bg-[#12B981] text-white";
                  indicator = (
                    <span className="flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full bg-[#12B981]">
                      <Check size={12} className="text-white" strokeWidth={3} />
                    </span>
                  );
                } else if (isSelected) {
                  stateClass = "border-[#F0562F] bg-[#FEF4F1]";
                  badgeClass = "bg-[#F0562F] text-white";
                  indicator = (
                    <span className="flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full bg-[#F0562F]">
                      <X size={12} className="text-white" strokeWidth={3} />
                    </span>
                  );
                }
              } else if (isSelected) {
                stateClass = "border-xp-border bg-xp-bg";
                badgeClass = "bg-brand-gradient text-white";
                indicator = (
                  <span className="flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full bg-brand-violet">
                    <Check size={12} className="text-white" strokeWidth={3} />
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
              className="text-[13.5px] font-semibold text-ink-fainter hover:text-ink-secondary"
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
        </div>
      </Card>
    </div>
  );
}

function ResultsView({
  questions,
  answered,
  reviewHrefs,
  onAgain,
  onHub,
}: {
  questions: PracticeQuestion[];
  answered: Answered[];
  reviewHrefs: Record<string, string>;
  onAgain: () => void;
  onHub: () => void;
}) {
  const correctCount = answered.filter((a) => a.correct).length;

  return (
    <div className="mx-auto w-full max-w-[640px]">
      <h2 className="font-display text-[24px] font-extrabold tracking-tight text-ink">
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
              const row = (
                <>
                  <span
                    className={cn(
                      "flex h-6 w-6 flex-none items-center justify-center rounded-full",
                      a.correct
                        ? "bg-[#E7F8F0] text-[#12A472]"
                        : "bg-[#FEECEC] text-[#F0562F]",
                    )}
                  >
                    {a.correct ? (
                      <Check size={12} strokeWidth={3} />
                    ) : (
                      <X size={12} strokeWidth={3} />
                    )}
                  </span>
                  <span className="min-w-0 flex-1 text-[13.5px] text-ink">
                    Q{i + 1} · {question.reviewLabel}
                  </span>
                  {!a.correct ? (
                    <span className="text-xs font-bold text-brand-violet">
                      Review →
                    </span>
                  ) : null}
                </>
              );

              if (a.correct) {
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
                  className="-mx-1 flex items-center gap-3 rounded-[11px] px-2 py-2.5 transition-colors hover:bg-elevated"
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
          Back to Practice
        </Button>
      </div>
    </div>
  );
}
