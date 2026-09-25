"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Check, X } from "lucide-react";
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

function CodeBlock({ lines }: { lines?: string[] }) {
  if (!lines?.length) return null;
  return (
    <pre className="mt-5 overflow-x-auto rounded-xl border border-[#E2DED3] bg-[#16181D] p-4 font-mono text-sm leading-7 text-[#F6F4EE]">
      <code>{lines.join("\n")}</code>
    </pre>
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
    if (next.length === 0) {
      router.replace("/practicev2");
      return;
    }
    queueMicrotask(() => setQuestions(next));
  }, [completed, initialCards, router, scope, unlocked, userId]);

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

  function gradeTyped(grade: "again" | "hard" | "good") {
    const question = questions[index];
    if (
      !question ||
      (question.kind !== "typed" && question.kind !== "cloze") ||
      typedAnswer.trim().length === 0
    ) {
      return;
    }
    recordGrade(grade, answersMatch(typedAnswer, question.answers));
  }

  const question = questions[index];
  if (!question) {
    return (
      <section className="rounded-2xl border border-[#E2DED3] bg-[#F6F4EE] p-8 text-center text-[#16181D]">
        Preparing your review…
      </section>
    );
  }

  const progress = `${index + 1} / ${questions.length}`;
  const wrongReviewHref =
    feedback && !feedback.correct ? reviewHrefs[question.id] : undefined;

  return (
    <section className="text-[#16181D]">
      <header className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-[#D9622B]">
            {activeScope.scopeLabel}
          </p>
          <p className="mt-1 text-sm font-semibold">{progress}</p>
        </div>
        {phase === "prompt" ? (
          <button
            type="button"
            className="rounded-lg border border-[#E2DED3] px-4 py-2 text-sm font-bold transition hover:bg-white"
            onClick={() => advance()}
          >
            Skip
          </button>
        ) : null}
      </header>

      <div className="h-2 overflow-hidden rounded-full bg-[#E2DED3]">
        <div
          className="h-full rounded-full bg-[#D7F26B] transition-[width]"
          style={{ width: `${((index + 1) / questions.length) * 100}%` }}
        />
      </div>

      <div className="mt-6 rounded-2xl border border-[#E2DED3] bg-white p-6 shadow-[0_10px_30px_rgba(22,24,29,0.06)] sm:p-9">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.14em] text-[#D9622B]">
          {question.reviewLabel}
        </p>

        {phase === "feedback" && feedback ? (
          <div>
            <div className="mt-5 flex items-center gap-3">
              <span
                className={`flex size-10 items-center justify-center rounded-full ${
                  feedback.correct ? "bg-[#D7F26B]" : "bg-[#D9622B] text-white"
                }`}
              >
                {feedback.correct ? <Check size={22} /> : <X size={22} />}
              </span>
              <h1 className="text-2xl font-black">
                {feedback.correct ? "Nice work." : "Not quite yet."}
              </h1>
            </div>
            {!feedback.correct && question.hint ? (
              <div className="mt-6 rounded-xl border border-[#E2DED3] bg-[#F6F4EE] p-4">
                <p className="text-xs font-black uppercase tracking-wide">Hint</p>
                <p className="mt-2 text-sm leading-6">{question.hint}</p>
              </div>
            ) : null}
            {!feedback.correct && wrongReviewHref ? (
              <Link
                href={wrongReviewHref}
                className="mt-5 inline-block text-sm font-black text-[#D9622B] underline underline-offset-4"
              >
                Review the lesson
              </Link>
            ) : null}
            <button
              type="button"
              className="mt-8 w-full rounded-xl bg-[#16181D] px-5 py-3 font-black text-white transition hover:opacity-90"
              onClick={() => advance(answered)}
            >
              Continue
            </button>
          </div>
        ) : (
          <div>
            {question.kind === "mcq" ? (
              <>
                <h1 className="mt-4 text-2xl font-black leading-tight sm:text-3xl">
                  {question.prompt}
                </h1>
                <CodeBlock lines={question.code} />
                <div className="mt-6 grid gap-3">
                  {question.options.map((option, optionIndex) => (
                    <button
                      key={option}
                      type="button"
                      className={`rounded-xl border p-4 text-left text-sm font-semibold transition ${
                        selected === optionIndex
                          ? "border-[#16181D] bg-[#D7F26B]"
                          : "border-[#E2DED3] hover:border-[#16181D]"
                      }`}
                      onClick={() => setSelected(optionIndex)}
                    >
                      <span className="mr-3 font-mono font-black">
                        {String.fromCharCode(65 + optionIndex)}.
                      </span>
                      {option}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  disabled={selected === null}
                  className="mt-6 w-full rounded-xl bg-[#16181D] px-5 py-3 font-black text-white transition enabled:hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                  onClick={checkMcq}
                >
                  Check
                </button>
              </>
            ) : null}

            {question.kind === "flashcard" ? (
              <>
                <h1 className="mt-4 text-2xl font-black leading-tight sm:text-3xl">
                  {revealed ? question.back : question.front}
                </h1>
                {!revealed ? <CodeBlock lines={question.frontCode} /> : null}
                {!revealed ? (
                  <button
                    type="button"
                    className="mt-8 w-full rounded-xl bg-[#16181D] px-5 py-3 font-black text-white transition hover:opacity-90"
                    onClick={() => setRevealed(true)}
                  >
                    Reveal
                  </button>
                ) : (
                  <div className="mt-8 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      className="rounded-xl border border-[#D9622B] px-5 py-3 font-black text-[#D9622B]"
                      onClick={() => recordGrade("again", false)}
                    >
                      Missed it
                    </button>
                    <button
                      type="button"
                      className="rounded-xl bg-[#D7F26B] px-5 py-3 font-black"
                      onClick={() => recordGrade("good", true)}
                    >
                      Got it
                    </button>
                  </div>
                )}
              </>
            ) : null}

            {question.kind === "typed" || question.kind === "cloze" ? (
              <>
                <h1 className="mt-4 text-2xl font-black leading-tight sm:text-3xl">
                  {question.kind === "typed"
                    ? question.prompt
                    : question.template?.replace("{{blank}}", "_____") ??
                      "Fill in the missing code."}
                </h1>
                <CodeBlock
                  lines={
                    question.kind === "typed"
                      ? question.code
                      : question.templateCode?.map((line) =>
                          line.replace("{{blank}}", "_____"),
                        )
                  }
                />
                <label className="mt-6 block text-sm font-black" htmlFor="practice-answer">
                  Your answer
                </label>
                <input
                  id="practice-answer"
                  value={typedAnswer}
                  onChange={(event) => setTypedAnswer(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") gradeTyped("good");
                  }}
                  className="mt-2 w-full rounded-xl border border-[#E2DED3] bg-[#F6F4EE] px-4 py-3 font-mono outline-none focus:border-[#16181D]"
                  autoComplete="off"
                  autoFocus
                />
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {(["again", "hard", "good"] as const).map((grade) => (
                    <button
                      key={grade}
                      type="button"
                      disabled={typedAnswer.trim().length === 0}
                      className={`rounded-xl px-3 py-3 text-sm font-black capitalize disabled:cursor-not-allowed disabled:opacity-40 ${
                        grade === "good"
                          ? "bg-[#D7F26B]"
                          : "border border-[#E2DED3]"
                      }`}
                      onClick={() => gradeTyped(grade)}
                    >
                      {grade}
                    </button>
                  ))}
                </div>
              </>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}
