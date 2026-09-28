"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  savePracticeSessionAction,
  upsertPracticeCardsAction,
} from "@/lib/practice/actions";
import {
  applyGrades,
  dueQueueIds,
  ensureUnlockedCards,
  gradeFromMcqCorrect,
  migrateMissQueueOnce,
  readCards,
  readNewDayMeta,
  writeCards,
} from "@/lib/practice/cards";
import {
  labelCoachV2Scope,
  parseCoachV2Scope,
  parseCoachV2Size,
  sessionProgress,
  type SessionSegment,
} from "@/lib/practice/coach-v2-flow";
import {
  newSessionId,
  prependLocalSession,
  type PracticeSessionRecord,
} from "@/lib/practice/history";
import { answersMatch } from "@/lib/practice/normalize";
import {
  buildSession,
  questionsForScope,
  unlockedQuestions,
} from "@/lib/practice/session";
import type {
  PracticeCard,
  PracticeGrade,
} from "@/lib/practice/sm2";
import type { PracticeItem } from "@/lib/practice/types";

export type PracticeCoachV2SessionLiveProps = {
  userId: string | null;
  completedKeys: string[];
  reviewHrefs: Record<string, string>;
  initialCards: PracticeCard[];
  searchParams: Record<string, string | string[] | undefined>;
};

const BOTTOM_BAR =
  "sticky bottom-0 z-10 -mx-5 mt-auto flex justify-center border-t-2 px-5 sm:-mx-10 sm:px-10";

type Answered = { questionId: string; grade: PracticeGrade };
type Feedback = { correct: boolean; grade: PracticeGrade };

function gradeIsHit(grade: PracticeGrade): boolean {
  return grade === "good" || grade === "easy";
}

function kindPillLabel(kind: PracticeItem["kind"]): string {
  switch (kind) {
    case "mcq":
      return "Choices";
    case "flashcard":
      return "Flashcard";
    case "typed":
      return "Short answer";
    case "cloze":
      return "Cloze";
  }
}

function scopeSubtitle(scopeLabel: string, reviewLabel: string): string {
  return reviewLabel ? `${scopeLabel} · ${reviewLabel}` : scopeLabel;
}

function CodeBlock({ lines }: { lines?: string[] }) {
  if (!lines?.length) return null;
  return (
    <pre className="mt-5 overflow-x-auto rounded-[20px] border-2 border-[var(--coach-border)] bg-[var(--coach-code-bg)] p-8 font-[family-name:var(--font-plex-mono)] text-sm leading-7 text-[var(--coach-code-ink)]">
      <code>{lines.join("\n")}</code>
    </pre>
  );
}

function KindScopeRow({
  kind,
  subtitle,
  trailing,
}: {
  kind: PracticeItem["kind"];
  subtitle: string;
  trailing?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <span className="rounded-full bg-[var(--coach-tint-blue-bg)] px-[11px] py-[5px] text-[13px] font-semibold text-[var(--coach-tint-blue-ink)]">
          {kindPillLabel(kind)}
        </span>
        <span className="text-sm text-[var(--coach-ink-muted)]">{subtitle}</span>
      </div>
      {trailing}
    </div>
  );
}

function flashcardFrontSize(front: string): string {
  if (front.length <= 16) return "text-5xl leading-none sm:text-7xl";
  if (front.length <= 40) return "text-4xl leading-[1.1] sm:text-5xl";
  return "text-[28px] leading-[1.2] sm:text-[32px]";
}

const SEGMENT_CLASS: Record<SessionSegment, string> = {
  correct: "bg-[var(--coach-blue)]",
  missed: "bg-[var(--coach-orange)]",
  skipped: "bg-[var(--coach-border-strong)]",
  current: "bg-transparent shadow-[inset_0_0_0_2px_var(--coach-ink)]",
  upcoming: "bg-[var(--coach-divider)]",
};

function SessionTopBar({
  segments,
  done,
  current,
  total,
  onExit,
}: {
  segments: SessionSegment[];
  done: number;
  current: number;
  total: number;
  onExit: () => void;
}) {
  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={onExit}
        aria-label="End session"
        className="flex h-11 shrink-0 cursor-pointer items-center gap-2 rounded-xl border-2 border-[var(--coach-border-strong)] bg-transparent px-3 text-sm font-semibold text-[var(--coach-ink-secondary)]"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          aria-hidden
        >
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
        <span className="hidden sm:inline">End session</span>
        <kbd className="hidden h-6 items-center rounded-md border border-b-2 border-[var(--coach-border-strong)] bg-[var(--coach-bg)] px-1.5 font-[family-name:var(--font-plex-mono)] text-xs font-medium sm:inline-flex">
          Esc
        </kbd>
      </button>
      <div
        role="progressbar"
        aria-label="Session progress"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={done}
        aria-valuetext={`${done} of ${total} cards done`}
        className="flex min-w-0 flex-1 gap-1.5"
      >
        {segments.map((segment, i) => (
          <span key={i} className={`h-2.5 flex-1 rounded-full ${SEGMENT_CLASS[segment]}`} />
        ))}
      </div>
      <span className="shrink-0 font-[family-name:var(--font-plex-mono)] text-sm text-[var(--coach-ink-muted)]">
        {current} of {total}
      </span>
    </div>
  );
}

function McqChoice({
  index,
  label,
  selected,
  onSelect,
  disabled,
}: {
  index: number;
  label: string;
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
}) {
  const n = index + 1;
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      data-coach-choice
      className="flex h-[76px] items-center gap-4 rounded-2xl border-2 px-5 text-left font-[family-name:var(--font-plex-mono)] text-xl text-[var(--coach-ink)] transition disabled:cursor-default"
      style={
        selected
          ? {
              borderColor: "var(--coach-blue)",
              boxShadow: "0 4px 0 var(--coach-blue)",
              background: "var(--coach-selected-bg)",
            }
          : {
              borderColor: "var(--coach-border)",
              boxShadow: "0 4px 0 var(--coach-border)",
              background: "var(--coach-surface)",
            }
      }
      onClick={onSelect}
    >
      <kbd
        className="flex size-8 shrink-0 items-center justify-center rounded-lg font-[family-name:var(--font-plex-mono)] text-sm"
        style={
          selected
            ? { background: "var(--coach-blue)", color: "var(--coach-on-blue)" }
            : {
                boxSizing: "border-box",
                border: "2px solid var(--coach-border-strong)",
                color: "var(--coach-ink-muted)",
              }
        }
      >
        {n}
      </kbd>
      {label}
    </button>
  );
}

function PromptFooter({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <footer className={`${BOTTOM_BAR} border-[var(--coach-border)] bg-[var(--coach-surface)] py-4 sm:py-6`}>
      <div className="flex w-full max-w-[760px] flex-wrap items-center justify-between gap-3 sm:gap-6">
        {children}
      </div>
    </footer>
  );
}

function SkipButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className="flex h-14 items-center gap-2.5 rounded-2xl border-2 border-[var(--coach-border-strong)] px-[22px] text-base font-semibold text-[var(--coach-ink-secondary)]"
      onClick={onClick}
    >
      Skip
      <kbd className="inline-flex min-h-6 min-w-6 items-center justify-center rounded-md border border-[var(--coach-border-strong)] border-b-2 bg-[var(--coach-bg)] px-1.5 font-[family-name:var(--font-plex-mono)] text-xs">
        S
      </kbd>
    </button>
  );
}

function LimeCheckButton({
  disabled,
  onClick,
  label = "Check",
}: {
  disabled?: boolean;
  onClick: () => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      className="mb-[5px] flex h-14 min-w-0 flex-1 items-center sm:w-60 sm:flex-none justify-center gap-3 rounded-2xl bg-[var(--coach-lime)] text-[17px] font-bold uppercase tracking-wide text-[var(--coach-lime-ink)] shadow-[0_5px_0_var(--coach-lime-shadow)] transition enabled:hover:brightness-[0.97] disabled:cursor-not-allowed disabled:opacity-40"
      onClick={onClick}
    >
      {label}
      <kbd className="inline-flex h-6 items-center rounded-md border border-[var(--coach-lime-shadow)] border-b-2 bg-[var(--coach-lime-soft)] px-[7px] font-[family-name:var(--font-plex-mono)] text-xs font-medium normal-case tracking-normal text-[var(--coach-lime-ink)]">
        Enter
      </kbd>
    </button>
  );
}

function FeedbackBar({
  feedback,
  question,
  reviewHref,
  onContinue,
}: {
  feedback: Feedback;
  question: PracticeItem;
  reviewHref?: string;
  onContinue: () => void;
}) {
  if (feedback.correct) {
    return (
      <section
        aria-live="polite"
        className={`${BOTTOM_BAR} border-[var(--coach-correct-border)] bg-[var(--coach-correct-bg)] py-5 sm:py-7`}
      >
        <div className="flex w-full max-w-[760px] flex-wrap items-center justify-between gap-8">
          <div className="flex items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[var(--coach-mark-bg)] text-[var(--coach-mark-ink)]">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M5 12l5 5 9-10" />
              </svg>
            </span>
            <div className="flex flex-col gap-1.5">
              <h2 className="m-0 font-[family-name:var(--font-bricolage)] text-[26px] font-extrabold">
                Correct
              </h2>
              {question.hint ? (
                <p className="m-0 max-w-[460px] text-[15px] leading-normal text-[var(--coach-correct-ink)]">
                  {question.hint}
                </p>
              ) : null}
            </div>
          </div>
          <button
            type="button"
            className="mb-[5px] flex h-14 w-full shrink-0 items-center sm:w-[220px] justify-center gap-3 rounded-2xl bg-[var(--coach-solid-btn-bg)] text-[17px] font-bold uppercase tracking-wide text-[var(--coach-solid-btn-ink)] shadow-[0_5px_0_var(--coach-solid-btn-shadow)]"
            onClick={onContinue}
          >
            Continue
            <kbd className="inline-flex h-6 items-center rounded-md border border-[var(--coach-solid-btn-kbd-border)] border-b-2 bg-[var(--coach-solid-btn-kbd-bg)] px-[7px] font-[family-name:var(--font-plex-mono)] text-xs font-medium normal-case tracking-normal text-[var(--coach-solid-btn-ink)]">
              Enter
            </kbd>
          </button>
        </div>
      </section>
    );
  }

  const expectedAnswer =
    question.kind === "mcq"
      ? question.options[question.correct]
      : question.kind === "flashcard"
        ? question.back
        : question.answers[0];

  return (
    <section
      aria-live="polite"
      className={`${BOTTOM_BAR} border-[var(--coach-wrong-border)] bg-[var(--coach-wrong-bg)] py-5 sm:py-7`}
    >
      <div className="flex w-full max-w-[760px] flex-col gap-5">
        <div className="flex flex-wrap items-start gap-8">
          <div className="flex min-w-0 flex-1 items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[var(--coach-wrong-strong)] text-[var(--coach-on-wrong)]">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                aria-hidden
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </span>
            <div className="flex flex-col gap-2">
              <h2 className="m-0 font-[family-name:var(--font-bricolage)] text-[26px] font-extrabold text-[var(--coach-wrong-title)]">
                Not quite
                {expectedAnswer ? (
                  <>
                    {" "}
                    — the answer is{" "}
                    <span className="font-[family-name:var(--font-plex-mono)] font-medium text-[var(--coach-ink)]">
                      {expectedAnswer}
                    </span>
                  </>
                ) : null}
              </h2>
              {question.hint ? (
                <p className="m-0 text-[15px] leading-normal text-[var(--coach-wrong-ink)]">
                  {question.hint}
                </p>
              ) : null}
              {reviewHref ? (
                <Link
                  href={reviewHref}
                  className="text-sm font-semibold text-[var(--coach-wrong-title)] underline underline-offset-4"
                >
                  Review the lesson
                </Link>
              ) : null}
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            className="mb-[5px] flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[var(--coach-wrong-strong)] sm:w-[220px] text-[17px] font-bold uppercase tracking-wide text-[var(--coach-on-wrong)] shadow-[0_5px_0_var(--coach-wrong-shadow)]"
            onClick={onContinue}
          >
            Continue
            <kbd className="inline-flex h-6 items-center rounded-md border border-[var(--coach-wrong-kbd-border)] border-b-2 bg-[var(--coach-wrong-kbd-bg)] px-[7px] font-[family-name:var(--font-plex-mono)] text-xs font-medium normal-case tracking-normal text-[var(--coach-on-wrong)]">
              Enter
            </kbd>
          </button>
        </div>
      </div>
    </section>
  );
}

export function PracticeCoachV2SessionLive({
  userId,
  completedKeys,
  reviewHrefs,
  initialCards,
  searchParams,
}: PracticeCoachV2SessionLiveProps) {
  const router = useRouter();
  const started = useRef(false);
  const completed = useMemo(
    () => new Set(completedKeys),
    [completedKeys],
  );
  const scope = useMemo(
    () => parseCoachV2Scope(searchParams),
    [searchParams],
  );
  const size = useMemo(() => parseCoachV2Size(searchParams), [searchParams]);
  const activeScope = useMemo(() => labelCoachV2Scope(scope), [scope]);
  const unlocked = useMemo(
    () => unlockedQuestions(completed),
    [completed],
  );

  const [questions, setQuestions] = useState<PracticeItem[]>([]);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"prompt" | "feedback">("prompt");
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [answered, setAnswered] = useState<Answered[]>([]);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    if (initialCards.length > 0) {
      writeCards(userId, initialCards);
    }
    migrateMissQueueOnce(userId);
    ensureUnlockedCards(
      userId,
      unlocked.map((question) => question.id),
    );

    const cards = readCards(userId);
    const meta = readNewDayMeta(userId);
    const now = new Date();
    let priorityIds: string[];
    if (scope.type === "due") {
      priorityIds = dueQueueIds(cards, meta, now, size);
    } else {
      const idsInScope = new Set(
        questionsForScope(completed, scope).map((question) => question.id),
      );
      const scopeCards = cards.filter((card) =>
        idsInScope.has(card.questionId),
      );
      priorityIds = dueQueueIds(scopeCards, meta, now, size);
    }
    const next = buildSession({
      completedKeys: completed,
      priorityIds,
      size,
      scope,
    });
    if (next.length === 0) {
      router.replace("/practicev2");
      return;
    }
    queueMicrotask(() => setQuestions(next));
  }, [completed, initialCards, router, scope, size, unlocked, userId]);

  function resetPrompt() {
    setSelected(null);
    setRevealed(false);
    setTypedAnswer("");
    setFeedback(null);
    setPhase("prompt");
  }

  function saveSession(nextAnswered: Answered[]): PracticeSessionRecord {
    const missIds = nextAnswered
      .filter((answer) => !gradeIsHit(answer.grade))
      .map((answer) => answer.questionId);
    const correctIds = nextAnswered
      .filter((answer) => gradeIsHit(answer.grade))
      .map((answer) => answer.questionId);
    const questionIds = nextAnswered.map((answer) => answer.questionId);
    const answeredIds = new Set(questionIds);
    const updated = applyGrades(userId, nextAnswered);

    if (userId) {
      void upsertPracticeCardsAction(
        updated.filter((card) => answeredIds.has(card.questionId)),
      );
    }

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
    prependLocalSession(userId, record);
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
    return record;
  }

  function finishSession(nextAnswered: Answered[]) {
    const record = saveSession(nextAnswered);
    router.push(`/practicev2/complete?session=${record.id}`);
  }

  function exitSession() {
    if (answered.length > 0) saveSession(answered);
    router.push("/practicev2");
  }

  function advance(nextAnswered = answered) {
    if (index + 1 >= questions.length) {
      finishSession(nextAnswered);
      return;
    }
    setIndex((current) => current + 1);
    resetPrompt();
  }

  function recordGrade(grade: PracticeGrade, correct: boolean) {
    const question = questions[index];
    if (!question || phase === "feedback") return;
    const nextAnswered = [
      ...answered,
      { questionId: question.id, grade },
    ];
    setAnswered(nextAnswered);
    setFeedback({ correct, grade });
    setPhase("feedback");
  }

  function checkMcq() {
    const question = questions[index];
    if (!question || question.kind !== "mcq" || selected === null) return;
    const correct = selected === question.correct;
    recordGrade(gradeFromMcqCorrect(correct), correct);
  }

  function gradeTyped() {
    const question = questions[index];
    if (
      !question ||
      (question.kind !== "typed" && question.kind !== "cloze") ||
      typedAnswer.trim().length === 0
    ) {
      return;
    }
    const correct = answersMatch(typedAnswer, question.answers);
    recordGrade(correct ? "good" : "again", correct);
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const current = questions[index];
      if (!current) return;
      const target = event.target instanceof HTMLElement ? event.target : null;
      const typing =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        Boolean(target?.isContentEditable);

      if (event.key === "Escape") {
        event.preventDefault();
        exitSession();
        return;
      }
      if (event.repeat) return;

      if (event.key === "Enter") {
        if (target?.tagName === "A") return;
        if (target?.tagName === "BUTTON" && !target.hasAttribute("data-coach-choice")) {
          return;
        }
        event.preventDefault();
        if (phase === "feedback") advance(answered);
        else if (current.kind === "mcq") checkMcq();
        else if (current.kind === "flashcard") {
          if (!revealed) setRevealed(true);
        } else gradeTyped();
        return;
      }

      if (typing || phase === "feedback") return;

      if (event.key === "s" || event.key === "S") {
        event.preventDefault();
        advance();
        return;
      }

      const digit = Number(event.key);
      if (!Number.isInteger(digit) || digit < 1) return;
      if (current.kind === "mcq" && digit <= current.options.length) {
        event.preventDefault();
        setSelected(digit - 1);
      } else if (current.kind === "flashcard" && revealed && digit <= 2) {
        event.preventDefault();
        if (digit === 1) recordGrade("again", false);
        else recordGrade("good", true);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const question = questions[index];

  if (!question) {
    return (
      <p className="text-center text-[var(--coach-ink)]">Preparing your review…</p>
    );
  }

  const subtitle = scopeSubtitle(
    activeScope.scopeLabel,
    question.reviewLabel,
  );
  const reviewHref =
    feedback && !feedback.correct ? reviewHrefs[question.id] : undefined;
  const inFeedback = phase === "feedback" && feedback;

  const progress = sessionProgress(
    questions.map((q) => q.id),
    answered,
    index,
  );

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-8">
      <div className="mx-auto flex w-full max-w-[760px] flex-col gap-7">
        <SessionTopBar
          segments={progress.segments}
              done={progress.done}
              current={index + 1}
              total={progress.total}
          onExit={exitSession}
        />
        {question.kind === "flashcard" ? (
          <KindScopeRow
            kind={question.kind}
            subtitle={subtitle}
            trailing={
              phase === "prompt" && !revealed ? (
                <span className="text-sm text-[var(--coach-ink-secondary)]">
                  Answer in your head first, then be honest with yourself.
                </span>
              ) : null
            }
          />
        ) : (
          <KindScopeRow kind={question.kind} subtitle={subtitle} />
        )}

        {question.kind === "mcq" ? (
          <>
            <h1 className="m-0 font-[family-name:var(--font-bricolage)] text-[32px] font-bold leading-[1.2] tracking-[-0.01em] text-pretty sm:text-[40px]">
              {question.prompt}
            </h1>
            <CodeBlock lines={question.code} />
            <div
              role="group"
              aria-label="Answer choices"
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              {question.options.map((option, optionIndex) => (
                <McqChoice
                  key={option}
                  index={optionIndex}
                  label={option}
                  selected={selected === optionIndex}
                  disabled={Boolean(inFeedback)}
                  onSelect={() => setSelected(optionIndex)}
                />
              ))}
            </div>
          </>
        ) : null}

        {question.kind === "flashcard" ? (
          <div className="relative flex-grow">
            <div
              aria-hidden
              className="absolute inset-x-5 top-4 -bottom-4 rounded-[26px] bg-[var(--coach-border)]"
            />
            <div className="relative grid min-h-[280px] grid-cols-1 overflow-hidden rounded-[26px] border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] sm:grid-cols-2">
                <div className="flex min-w-0 flex-col gap-3 border-[var(--coach-border)] p-8 sm:border-r-2 sm:border-dashed sm:p-10">
                  <span className="font-[family-name:var(--font-plex-mono)] text-xs uppercase tracking-[0.08em] text-[var(--coach-ink-muted)]">
                    Front
                  </span>
                  <h1
                    className={`m-0 font-[family-name:var(--font-bricolage)] font-extrabold tracking-[-0.02em] text-pretty break-words ${flashcardFrontSize(question.front)}`}
                  >
                  {question.front}
                </h1>
                {!revealed ? <CodeBlock lines={question.frontCode} /> : null}
              </div>
              <div
                className={`flex min-w-0 flex-col gap-3 bg-[var(--coach-flash-back)] p-8 sm:rounded-r-[24px] sm:p-10 ${revealed ? "" : "opacity-60"}`}
              >
                <span className="font-[family-name:var(--font-plex-mono)] text-xs uppercase tracking-[0.08em] text-[var(--coach-tint-blue-ink)]">
                  Back
                </span>
                {revealed ? (
                  <p className="m-0 text-2xl leading-normal">{question.back}</p>
                ) : (
                  <p className="m-0 text-sm text-[var(--coach-ink-muted)]">
                    Reveal when you are ready to check yourself.
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : null}

        {question.kind === "typed" || question.kind === "cloze" ? (
          <>
            <h1 className="m-0 font-[family-name:var(--font-bricolage)] text-[32px] font-bold leading-[1.2] tracking-[-0.01em] sm:text-[40px]">
              {question.kind === "typed"
                ? question.prompt
                : (question.template?.replace("{{blank}}", "_____") ??
                  "Fill in the blank")}
            </h1>
            <div className="flex flex-col gap-[22px] rounded-[20px] border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-8">
              <CodeBlock
                lines={
                  question.kind === "typed"
                    ? question.code
                    : question.templateCode?.map((line) =>
                        line.replace("{{blank}}", "_____"),
                      )
                }
              />
              <label className="flex flex-col gap-2 text-sm text-[var(--coach-ink-secondary)]">
                Your answer
                <input
                  id="practice-answer"
                  value={typedAnswer}
                  readOnly={Boolean(inFeedback)}
                  onChange={(event) => setTypedAnswer(event.target.value)}
                  aria-invalid={
                    inFeedback && feedback && !feedback.correct
                      ? true
                      : undefined
                  }
                  className="box-border h-14 rounded-xl border-2 px-[18px] text-xl font-semibold outline-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[var(--coach-focus)] focus-visible:outline-offset-[3px]"
                  style={
                    inFeedback && feedback
                      ? feedback.correct
                        ? {
                            borderColor: "var(--coach-blue)",
                            background: "var(--coach-selected-bg)",
                          }
                        : {
                            borderColor: "var(--coach-tint-orange-ink)",
                            background: "var(--coach-wrong-soft)",
                            textDecoration: "line-through",
                            fontFamily: "var(--font-plex-mono)",
                          }
                      : {
                          borderColor: "var(--coach-border)",
                          background: "var(--coach-surface)",
                        }
                  }
                  autoComplete="off"
                  autoFocus
                />
              </label>
              {inFeedback &&
              !feedback.correct &&
              question.answers[0] ? (
                <p className="m-0 text-sm text-[var(--coach-ink-secondary)]">
                  Expected:{" "}
                  <span className="font-[family-name:var(--font-plex-mono)] font-semibold text-[var(--coach-ink)]">
                    {question.answers[0]}
                  </span>
                </p>
              ) : null}
            </div>
          </>
        ) : null}
      </div>

      {inFeedback && feedback ? (
        <FeedbackBar
          feedback={feedback}
          question={question}
          reviewHref={reviewHref}
          onContinue={() => advance(answered)}
        />
      ) : question.kind === "mcq" ? (
        <PromptFooter>
          <SkipButton onClick={() => advance()} />
          <span className="hidden text-[13px] text-[var(--coach-ink-muted)] sm:inline">
            Press 1–4 to choose
          </span>
          <LimeCheckButton
            disabled={selected === null}
            onClick={checkMcq}
          />
        </PromptFooter>
      ) : question.kind === "flashcard" ? (
        <PromptFooter>
          {!revealed ? (
            <>
              <SkipButton onClick={() => advance()} />
              <LimeCheckButton
                label="Reveal"
                onClick={() => setRevealed(true)}
              />
            </>
          ) : (
            <>
              <span
                id="grade-label"
                className="text-base font-semibold"
              >
                Did you know it?
              </span>
              <div
                role="group"
                aria-labelledby="grade-label"
                className="flex w-full gap-3 sm:ml-auto sm:w-auto sm:gap-4"
              >
                <button
                  type="button"
                  className="mb-[5px] flex h-14 flex-1 items-center justify-center gap-2.5 rounded-2xl border-2 sm:w-[220px] sm:flex-none border-[var(--coach-wrong-border)] bg-[var(--coach-surface)] text-base font-bold text-[var(--coach-tint-orange-strong)] shadow-[0_5px_0_var(--coach-wrong-border)]"
                  onClick={() => recordGrade("again", false)}
                >
                  Missed it
                  <kbd className="inline-flex size-6 items-center justify-center rounded-md border border-[var(--coach-wrong-border)] border-b-2 bg-[var(--coach-wrong-soft)] font-[family-name:var(--font-plex-mono)] text-xs font-medium">
                    1
                  </kbd>
                </button>
                <button
                  type="button"
                  className="mb-[5px] flex h-14 flex-1 items-center justify-center gap-2.5 rounded-2xl bg-[var(--coach-lime)] sm:w-[220px] sm:flex-none text-base font-bold text-[var(--coach-lime-ink)] shadow-[0_5px_0_var(--coach-lime-shadow)]"
                  onClick={() => recordGrade("good", true)}
                >
                  Got it
                  <kbd className="inline-flex size-6 items-center justify-center rounded-md border border-[var(--coach-lime-shadow)] border-b-2 bg-[var(--coach-lime-soft)] font-[family-name:var(--font-plex-mono)] text-xs font-medium">
                    2
                  </kbd>
                </button>
              </div>
            </>
          )}
        </PromptFooter>
      ) : question.kind === "typed" || question.kind === "cloze" ? (
        <PromptFooter>
          <SkipButton onClick={() => advance()} />
          <LimeCheckButton
            disabled={typedAnswer.trim().length === 0}
            onClick={gradeTyped}
          />
        </PromptFooter>
      ) : null}
    </div>
  );
}
