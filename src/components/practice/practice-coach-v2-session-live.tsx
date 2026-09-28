"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { PRACTICE_COACH_V2_SESSION_CSS } from "@/components/practice/practice-coach-v2-session-markup";
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
    <pre className="mt-5 overflow-x-auto rounded-[20px] border-2 border-[#E2DED3] bg-[#16181D] p-8 font-[family-name:var(--font-plex-mono)] text-sm leading-7 text-[#F6F4EE]">
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
        <span className="rounded-full bg-[#E3E8FF] px-[11px] py-[5px] text-[13px] font-semibold text-[#1F3BB8]">
          {kindPillLabel(kind)}
        </span>
        <span className="text-sm text-[#5A5E66]">{subtitle}</span>
      </div>
      {trailing}
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
      className="flex h-[76px] items-center gap-4 rounded-2xl border-2 px-5 text-left font-[family-name:var(--font-plex-mono)] text-xl text-[#16181D] transition disabled:cursor-default"
      style={
        selected
          ? {
              borderColor: "#2E4BDB",
              boxShadow: "0 4px 0 #2E4BDB",
              background: "#F3F5FF",
            }
          : {
              borderColor: "#E2DED3",
              boxShadow: "0 4px 0 #E2DED3",
              background: "#FFFFFF",
            }
      }
      onClick={onSelect}
    >
      <kbd
        className="flex size-8 shrink-0 items-center justify-center rounded-lg font-[family-name:var(--font-plex-mono)] text-sm"
        style={
          selected
            ? { background: "#2E4BDB", color: "#FFFFFF" }
            : {
                boxSizing: "border-box",
                border: "2px solid #D5D0C3",
                color: "#5A5E66",
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
    <footer className="-mx-6 mt-8 flex justify-center border-t-2 border-[#E2DED3] bg-white px-6 py-6 sm:-mx-12 sm:px-12">
      <div className="flex w-full max-w-[760px] items-center justify-between gap-6">
        {children}
      </div>
    </footer>
  );
}

function SkipButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className="flex h-14 items-center gap-2.5 rounded-2xl border-2 border-[#D5D0C3] px-[22px] text-base font-semibold text-[#4A4E57]"
      onClick={onClick}
    >
      Skip
      <kbd className="inline-flex min-h-6 min-w-6 items-center justify-center rounded-md border border-[#D5D0C3] border-b-2 bg-[#F6F4EE] px-1.5 font-[family-name:var(--font-plex-mono)] text-xs">
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
      className="mb-[5px] flex h-14 w-60 items-center justify-center gap-3 rounded-2xl bg-[#D7F26B] text-[17px] font-bold uppercase tracking-wide text-[#16181D] shadow-[0_5px_0_#9DB43A] transition enabled:hover:brightness-[0.97] disabled:cursor-not-allowed disabled:opacity-40"
      onClick={onClick}
    >
      {label}
      <kbd className="inline-flex h-6 items-center rounded-md border border-[#9DB43A] border-b-2 bg-[#E8F7A6] px-[7px] font-[family-name:var(--font-plex-mono)] text-xs font-medium normal-case tracking-normal text-[#16181D]">
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
        className="-mx-6 mt-8 flex justify-center border-t-2 border-[#C5DD62] bg-[#EAF5BE] px-6 py-7 sm:-mx-12 sm:px-12"
      >
        <div className="flex w-full max-w-[760px] flex-wrap items-center justify-between gap-8">
          <div className="flex items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#16181D] text-[#D7F26B]">
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
                <p className="m-0 max-w-[460px] text-[15px] leading-normal text-[#2A330A]">
                  {question.hint}
                </p>
              ) : null}
            </div>
          </div>
          <button
            type="button"
            className="mb-[5px] flex h-14 w-[220px] shrink-0 items-center justify-center gap-3 rounded-2xl bg-[#16181D] text-[17px] font-bold uppercase tracking-wide text-[#F6F4EE] shadow-[0_5px_0_#000000]"
            onClick={onContinue}
          >
            Continue
            <kbd className="inline-flex h-6 items-center rounded-md border border-[#4A4E57] border-b-2 bg-[#2C2F36] px-[7px] font-[family-name:var(--font-plex-mono)] text-xs font-medium normal-case tracking-normal text-[#F6F4EE]">
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
      className="-mx-6 mt-8 flex justify-center border-t-2 border-[#F4B596] bg-[#FDE7DA] px-6 py-7 sm:-mx-12 sm:px-12"
    >
      <div className="flex w-full max-w-[760px] flex-col gap-5">
        <div className="flex flex-wrap items-start gap-8">
          <div className="flex min-w-0 flex-1 items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#9A3412] text-white">
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
              <h2 className="m-0 font-[family-name:var(--font-bricolage)] text-[26px] font-extrabold text-[#7C2D12]">
                Not quite
                {expectedAnswer ? (
                  <>
                    {" "}
                    — the answer is{" "}
                    <span className="font-[family-name:var(--font-plex-mono)] font-medium text-[#16181D]">
                      {expectedAnswer}
                    </span>
                  </>
                ) : null}
              </h2>
              {question.hint ? (
                <p className="m-0 text-[15px] leading-normal text-[#4A1D0A]">
                  {question.hint}
                </p>
              ) : null}
              {reviewHref ? (
                <Link
                  href={reviewHref}
                  className="text-sm font-semibold text-[#7C2D12] underline underline-offset-4"
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
            className="mb-[5px] flex h-14 w-[220px] items-center justify-center gap-3 rounded-2xl bg-[#9A3412] text-[17px] font-bold uppercase tracking-wide text-white shadow-[0_5px_0_#6B230B]"
            onClick={onContinue}
          >
            Continue
            <kbd className="inline-flex h-6 items-center rounded-md border border-[#C2410C] border-b-2 bg-[#7C2D12] px-[7px] font-[family-name:var(--font-plex-mono)] text-xs font-medium normal-case tracking-normal text-white">
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

  function finishSession(nextAnswered: Answered[]) {
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
    router.push(`/practicev2/complete?session=${record.id}`);
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

  const question = questions[index];

  if (!question) {
    return (
      <>
        <style id="practice-coach-v2-session-css">{PRACTICE_COACH_V2_SESSION_CSS}</style>
        <div className="practice-coach-v2-session">
          <div className="coach-main flex flex-col gap-8">
            <p className="text-center text-[#16181D]">Preparing your review…</p>
          </div>
        </div>
      </>
    );
  }

  const subtitle = scopeSubtitle(
    activeScope.scopeLabel,
    question.reviewLabel,
  );
  const reviewHref =
    feedback && !feedback.correct ? reviewHrefs[question.id] : undefined;
  const inFeedback = phase === "feedback" && feedback;

  return (
    <>
      <style id="practice-coach-v2-session-css">{PRACTICE_COACH_V2_SESSION_CSS}</style>
      <div className="practice-coach-v2-session">
        <div className="coach-main flex flex-col gap-8">
          <div className="mx-auto flex w-full max-w-[760px] flex-col gap-7">
            {question.kind === "flashcard" ? (
              <KindScopeRow
                kind={question.kind}
                subtitle={subtitle}
                trailing={
                  phase === "prompt" && !revealed ? (
                    <span className="text-sm text-[#4A4E57]">
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
                <h1 className="m-0 font-[family-name:var(--font-bricolage)] text-[40px] font-bold leading-[1.2] tracking-[-0.01em] text-pretty">
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
                  className="absolute inset-x-5 top-4 -bottom-4 rounded-[26px] bg-[#E2DED3]"
                />
                <div className="relative grid min-h-[280px] grid-cols-1 overflow-hidden rounded-[26px] border-2 border-[#E2DED3] bg-white sm:grid-cols-2">
                  <div className="flex flex-col gap-3 border-[#E2DED3] p-10 sm:border-r-2 sm:border-dashed">
                    <span className="font-[family-name:var(--font-plex-mono)] text-xs uppercase tracking-[0.08em] text-[#5A5E66]">
                      Front
                    </span>
                    <h1 className="m-0 font-[family-name:var(--font-bricolage)] text-5xl font-extrabold leading-none tracking-[-0.02em] sm:text-7xl">
                      {question.front}
                    </h1>
                    {!revealed ? <CodeBlock lines={question.frontCode} /> : null}
                  </div>
                  <div
                    className={`flex flex-col gap-3 bg-[#F9F8F4] p-10 sm:rounded-r-[24px] ${revealed ? "" : "opacity-60"}`}
                  >
                    <span className="font-[family-name:var(--font-plex-mono)] text-xs uppercase tracking-[0.08em] text-[#1F3BB8]">
                      Back
                    </span>
                    {revealed ? (
                      <p className="m-0 text-2xl leading-normal">{question.back}</p>
                    ) : (
                      <p className="m-0 text-sm text-[#5A5E66]">
                        Reveal when you are ready to check yourself.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : null}

            {question.kind === "typed" || question.kind === "cloze" ? (
              <>
                <h1 className="m-0 font-[family-name:var(--font-bricolage)] text-[40px] font-bold leading-[1.2] tracking-[-0.01em]">
                  {question.kind === "typed"
                    ? question.prompt
                    : (question.template?.replace("{{blank}}", "_____") ??
                      "Fill in the blank")}
                </h1>
                <div className="flex flex-col gap-[22px] rounded-[20px] border-2 border-[#E2DED3] bg-white p-8">
                  <CodeBlock
                    lines={
                      question.kind === "typed"
                        ? question.code
                        : question.templateCode?.map((line) =>
                            line.replace("{{blank}}", "_____"),
                          )
                    }
                  />
                  <label className="flex flex-col gap-2 text-sm text-[#4A4E57]">
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
                      className="box-border h-14 rounded-xl border-2 px-[18px] text-xl font-semibold outline-none focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[#5A74E6] focus-visible:outline-offset-[3px]"
                      style={
                        inFeedback && feedback
                          ? feedback.correct
                            ? {
                                borderColor: "#2E4BDB",
                                background: "#F3F5FF",
                              }
                            : {
                                borderColor: "#C2410C",
                                background: "#FFF4EE",
                                textDecoration: "line-through",
                                fontFamily: "var(--font-plex-mono)",
                              }
                          : {
                              borderColor: "#E2DED3",
                              background: "#FFFFFF",
                            }
                      }
                      autoComplete="off"
                      autoFocus
                    />
                  </label>
                  {inFeedback &&
                  !feedback.correct &&
                  question.answers[0] ? (
                    <p className="m-0 text-sm text-[#4A4E57]">
                      Expected:{" "}
                      <span className="font-[family-name:var(--font-plex-mono)] font-semibold text-[#16181D]">
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
              <span className="hidden text-[13px] text-[#5A5E66] sm:inline">
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
                    className="ml-auto flex flex-wrap gap-4"
                  >
                    <button
                      type="button"
                      className="mb-[5px] flex h-14 w-[220px] items-center justify-center gap-2.5 rounded-2xl border-2 border-[#F4B596] bg-white text-base font-bold text-[#9A3412] shadow-[0_5px_0_#F4B596]"
                      onClick={() => recordGrade("again", false)}
                    >
                      Missed it
                      <kbd className="inline-flex size-6 items-center justify-center rounded-md border border-[#F4B596] border-b-2 bg-[#FFF4EE] font-[family-name:var(--font-plex-mono)] text-xs font-medium">
                        1
                      </kbd>
                    </button>
                    <button
                      type="button"
                      className="mb-[5px] flex h-14 w-[220px] items-center justify-center gap-2.5 rounded-2xl bg-[#D7F26B] text-base font-bold text-[#16181D] shadow-[0_5px_0_#9DB43A]"
                      onClick={() => recordGrade("good", true)}
                    >
                      Got it
                      <kbd className="inline-flex size-6 items-center justify-center rounded-md border border-[#9DB43A] border-b-2 bg-[#E8F7A6] font-[family-name:var(--font-plex-mono)] text-xs font-medium">
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
      </div>
    </>
  );
}
