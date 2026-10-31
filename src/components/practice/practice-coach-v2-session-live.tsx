"use client";

import Link from "next/link";
import { SaveButton } from "@/components/bookmarks/save-button";
import { CardFigureView } from "@/components/practice/card-figure";
import { BitsCard, type Cell } from "@/components/practice/session/bits-card";
import { OrderCard } from "@/components/practice/session/order-card";
import { cardTarget } from "@/lib/bookmarks/model";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
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
  parseCoachV2CardIds,
  parseCoachV2Label,
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
import { PRACTICE_ROUTES } from "@/lib/practice/routes";
import { PRACTICE_BANK } from "@/lib/practice/bank";
import { freshVariant } from "@/lib/practice/generated";
import {
  KIND_LABELS,
  blankWidth,
  buildMissFigures,
  looksLikeCode,
  officialWording,
  moveItem,
  outputMatches,
  scrambledOrder,
  shuffledOrder,
  splitBlank,
  splitCodeBlank,
} from "@/lib/practice/session-view";

export type PracticeCoachV2SessionLiveProps = {
  userId: string | null;
  completedKeys: string[];
  reviewHrefs: Record<string, string>;
  initialCards: PracticeCard[];
  searchParams: Record<string, string | string[] | undefined>;
};

const BOTTOM_BAR =
  "sticky bottom-0 z-10 -mx-5 mt-auto flex justify-center border-t-2 px-5 sm:-mx-10 sm:px-10";

/** The diagram that explains each card's answer, shown under the card after a miss. */
const MISS_FIGURES = buildMissFigures(PRACTICE_BANK);

type Answered = { questionId: string; grade: PracticeGrade; ms?: number };
/**
 * `overridden`: a typed answer marked wrong that the learner said was right ("I was right").
 * `dunno`: the learner pressed "I don't know" — a miss, without a guess, and the answer is shown.
 */
type Feedback = { correct: boolean; grade: PracticeGrade; overridden?: boolean; dunno?: boolean };

function gradeIsHit(grade: PracticeGrade): boolean {
  return grade === "good" || grade === "easy";
}

function scopeSubtitle(scopeLabel: string, reviewLabel: string): string {
  return reviewLabel ? `${scopeLabel} · ${reviewLabel}` : scopeLabel;
}

/** Key hints are for keyboards: hidden on touch screens. */
const KBD_TOUCH = "[@media(pointer:coarse)]:hidden!";

/** An answer in the right face: mono for code, the body face for words. */
function AnswerText({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={`${looksLikeCode(text) ? "font-[family-name:var(--font-plex-mono)]" : ""} ${className}`}>
      {text}
    </span>
  );
}

function CodeBlock({ lines, children }: { lines?: string[]; children?: ReactNode }) {
  if (!lines?.length && !children) return null;
  return (
    <pre className="m-0 overflow-x-auto rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-code-bg)] p-5 font-[family-name:var(--font-plex-mono)] text-[13px] leading-7 text-[var(--coach-code-ink)]">
      <code>{children ?? lines?.join("\n")}</code>
    </pre>
  );
}

function KindScopeRow({ question, subtitle }: { question: PracticeItem; subtitle: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2">
        <span className="shrink-0 rounded-full bg-[var(--coach-tint-blue-bg)] px-2.5 py-1 text-xs font-semibold text-[var(--coach-tint-blue-ink)]">
          {KIND_LABELS[question.kind]}
        </span>
        <span className="min-w-0 truncate text-[13px] text-[var(--coach-ink-muted)]">{subtitle}</span>
      </div>
      <SaveButton target={cardTarget(question)} look="coach" className="shrink-0" />
    </div>
  );
}

function flashcardFrontSize(front: string): string {
  if (front.length <= 16) return "text-[40px] leading-[1.05]";
  if (front.length <= 40) return "text-[30px] leading-[1.12]";
  return "text-[24px] leading-[1.22]";
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
        className="flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-lg border-2 border-[var(--coach-border-strong)] bg-transparent px-2.5 text-[13px] font-semibold text-[var(--coach-ink-secondary)]"
      >
        <X size={14} strokeWidth={2.5} aria-hidden />
        <span className="hidden sm:inline">End session</span>
        <kbd
          className={`hidden h-5 items-center rounded-md border border-b-2 border-[var(--coach-border-strong)] bg-[var(--coach-bg)] px-1.5 font-[family-name:var(--font-plex-mono)] text-[11px] font-medium sm:inline-flex ${KBD_TOUCH}`}
        >
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
          <span key={i} className={`h-2 flex-1 rounded-full ${SEGMENT_CLASS[segment]}`} />
        ))}
      </div>
      <span className="shrink-0 font-[family-name:var(--font-plex-mono)] text-[13px] text-[var(--coach-ink-muted)]">
        {current} of {total}
      </span>
    </div>
  );
}

type ChoiceState = "idle" | "selected" | "right" | "wrong" | "faded";

const CHOICE_LOOK: Record<ChoiceState, { box: string; key: string }> = {
  idle: {
    box: "border-[var(--coach-border)] bg-[var(--coach-surface)] shadow-[0_4px_0_var(--coach-border)]",
    key: "border-2 border-[var(--coach-border-strong)] text-[var(--coach-ink-muted)]",
  },
  selected: {
    box: "border-[var(--coach-ink)] bg-[var(--coach-surface)] shadow-[0_4px_0_var(--coach-ink)]",
    key: "bg-[var(--coach-ink)] text-[var(--coach-bg)]",
  },
  right: {
    box: "border-[var(--coach-correct-border)] bg-[var(--coach-correct-bg)] text-[var(--coach-correct-ink)] shadow-[0_4px_0_var(--coach-correct-border)]",
    key: "bg-[var(--coach-correct-ink)] text-[var(--coach-correct-bg)]",
  },
  wrong: {
    box: "border-[var(--coach-wrong-border)] bg-[var(--coach-wrong-bg)] text-[var(--coach-wrong-ink)] shadow-[0_4px_0_var(--coach-wrong-border)]",
    key: "bg-[var(--coach-wrong-strong)] text-[var(--coach-on-wrong)]",
  },
  faded: {
    box: "border-[var(--coach-border)] bg-[var(--coach-surface)] opacity-55",
    key: "border-2 border-[var(--coach-border)] text-[var(--coach-ink-muted)]",
  },
};

function McqChoice({
  position,
  label,
  state,
  onSelect,
}: {
  position: number;
  label: string;
  state: ChoiceState;
  onSelect: () => void;
}) {
  const locked = state === "right" || state === "wrong" || state === "faded";
  const look = CHOICE_LOOK[state];
  return (
    <button
      type="button"
      aria-pressed={state === "selected"}
      disabled={locked}
      data-coach-choice
      className={`flex min-h-14 items-center gap-3 rounded-xl border-2 px-4 py-3 text-left text-base text-[var(--coach-ink)] transition disabled:cursor-default ${look.box}`}
      onClick={onSelect}
    >
      <kbd
        className={`flex size-7 shrink-0 items-center justify-center rounded-md font-[family-name:var(--font-plex-mono)] text-xs ${look.key}`}
      >
        {state === "right" ? <Check size={15} strokeWidth={3} aria-hidden /> : state === "wrong" ? <X size={15} strokeWidth={3} aria-hidden /> : position}
      </kbd>
      <AnswerText text={label} className="min-w-0 [overflow-wrap:anywhere]" />
      {state === "right" && <span className="sr-only">(correct answer)</span>}
      {state === "wrong" && <span className="sr-only">(your answer, not right)</span>}
    </button>
  );
}

type FieldState = "idle" | "right" | "wrong" | "shown";

/** The typing field, for short answers and for blanks (inline, inside the sentence or the code line). */
function AnswerInput({
  value,
  onChange,
  state,
  label,
  inline,
  code,
  widthCh,
  onDark,
}: {
  value: string;
  onChange: (value: string) => void;
  state: FieldState;
  label: string;
  inline?: boolean;
  code?: boolean;
  widthCh?: number;
  onDark?: boolean;
}) {
  const look =
    state === "right"
      ? "border-[var(--coach-correct-border)] bg-[var(--coach-correct-bg)] text-[var(--coach-correct-ink)]"
      : state === "wrong"
        ? "border-[var(--coach-wrong-border)] bg-[var(--coach-wrong-soft)] text-[var(--coach-wrong-ink)] line-through"
        : state === "shown"
          ? "border-dashed border-[var(--coach-ink-muted)] bg-[var(--coach-well)] text-[var(--coach-ink)]"
        : onDark
          ? "border-[var(--coach-lime)] bg-[var(--coach-surface)] text-[var(--coach-ink)]"
          : "border-[var(--coach-border-strong)] bg-[var(--coach-surface)] text-[var(--coach-ink)]";
  return (
    <input
      id="practice-answer"
      aria-label={label}
      value={value}
      readOnly={state !== "idle"}
      aria-invalid={state === "wrong" || undefined}
      onChange={(event) => onChange(event.target.value)}
      autoComplete="off"
      autoCapitalize="off"
      autoCorrect="off"
      spellCheck={false}
      placeholder={inline ? undefined : "Type your answer"}
      autoFocus
      style={widthCh ? { width: `${widthCh}ch` } : undefined}
      className={`box-border border-2 outline-none focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[var(--coach-focus)] ${look} ${
        code ? "font-[family-name:var(--font-plex-mono)]" : ""
      } ${
        inline
          ? onDark
            ? "mx-0.5 inline-block h-7 rounded-md px-1.5 align-middle text-[13px] font-semibold"
            : "mx-1 inline-block h-[1.45em] max-w-full rounded-lg px-2 align-baseline text-[0.85em] font-semibold"
          : "h-12 w-full rounded-xl px-4 text-base font-semibold"
      }`}
    />
  );
}

function PromptFooter({ children }: { children: ReactNode }) {
  return (
    <footer className={`${BOTTOM_BAR} border-[var(--coach-border)] bg-[var(--coach-surface)] py-3 sm:py-4`}>
      <div className="flex w-full max-w-[680px] flex-wrap items-center justify-between gap-3 sm:gap-5">{children}</div>
    </footer>
  );
}

function QuietButton({ onClick, label, keyHint }: { onClick: () => void; label: string; keyHint?: string }) {
  return (
    <button
      type="button"
      className="flex h-11 items-center gap-2 rounded-xl border-2 border-[var(--coach-border-strong)] px-3.5 text-sm font-semibold whitespace-nowrap text-[var(--coach-ink-secondary)] sm:px-4"
      onClick={onClick}
    >
      {label}
      {keyHint ? (
        <kbd
          className={`hidden min-h-5 min-w-5 items-center justify-center rounded-md border border-b-2 border-[var(--coach-border-strong)] bg-[var(--coach-bg)] px-1 font-[family-name:var(--font-plex-mono)] text-[11px] sm:inline-flex ${KBD_TOUCH}`}
        >
          {keyHint}
        </kbd>
      ) : null}
    </button>
  );
}

function SkipButton({ onClick }: { onClick: () => void }) {
  return <QuietButton onClick={onClick} label="Skip" keyHint="S" />;
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
      className="mb-1 flex h-11 min-w-0 flex-1 items-center justify-center gap-2.5 rounded-xl bg-[var(--coach-lime)] text-[14.5px] font-bold text-[var(--coach-lime-ink)] shadow-[0_4px_0_var(--coach-lime-shadow)] transition enabled:hover:brightness-[0.97] disabled:cursor-not-allowed disabled:opacity-40 sm:w-52 sm:flex-none"
      onClick={onClick}
    >
      {label}
      <kbd
        className={`hidden h-[22px] items-center rounded-md border border-b-2 border-[var(--coach-lime-shadow)] bg-[var(--coach-lime-soft)] px-1.5 font-[family-name:var(--font-plex-mono)] text-[11px] font-medium text-[var(--coach-lime-ink)] sm:inline-flex ${KBD_TOUCH}`}
      >
        Enter
      </kbd>
    </button>
  );
}

/**
 * The answer to spell out in the feedback bar. Choices already light up the right option on the card,
 * and flashcards never get here (the back is the answer), so only typed answers need it.
 */
function expectedAnswer(question: PracticeItem): string | null {
  if (question.kind === "typed" || question.kind === "cloze") return question.answers[0] ?? null;
  if (question.kind === "output") return question.output;
  return null;
}

function FeedbackBar({
  feedback,
  question,
  typed,
  reviewHref,
  onContinue,
  onOverride,
}: {
  feedback: Feedback;
  question: PracticeItem;
  typed: string;
  reviewHref?: string;
  onContinue: () => void;
  onOverride?: () => void;
}) {
  const right = feedback.correct;
  const accepted = question.kind === "typed" || question.kind === "cloze" ? question.answers : null;
  // After a right typed answer, show the official wording only when it differs from what was typed.
  // After "I don't know" the card itself shows the answer (the right choice lit, the field filled in).
  const shownAnswer = right
    ? accepted && !feedback.overridden
      ? officialWording(typed, accepted)
      : null
    : feedback.dunno
      ? null
      : expectedAnswer(question);

  return (
    <section
      aria-live="polite"
      className={`${BOTTOM_BAR} py-4 sm:py-5 ${
        right
          ? "border-[var(--coach-correct-border)] bg-[var(--coach-correct-bg)]"
          : "border-[var(--coach-wrong-border)] bg-[var(--coach-wrong-bg)]"
      }`}
    >
      <div className="flex w-full max-w-[680px] flex-wrap items-end justify-between gap-4 sm:gap-6">
        <div className="flex min-w-[240px] flex-1 basis-0 items-start gap-3">
          <span
            className={`flex size-10 shrink-0 items-center justify-center rounded-full ${
              right
                ? "bg-[var(--coach-mark-bg)] text-[var(--coach-mark-ink)]"
                : "bg-[var(--coach-wrong-strong)] text-[var(--coach-on-wrong)]"
            }`}
          >
            {right ? <Check size={18} strokeWidth={3} aria-hidden /> : <X size={16} strokeWidth={3} aria-hidden />}
          </span>
          <div className="flex min-w-0 flex-col gap-1">
            <h2
              className={`m-0 font-[family-name:var(--font-bricolage)] text-xl font-extrabold ${
                right ? "" : "text-[var(--coach-wrong-title)]"
              }`}
            >
              {right
                ? feedback.overridden
                  ? "Counted as right"
                  : "Correct"
                : feedback.dunno
                  ? "Here's the answer"
                  : "Not quite"}
            </h2>
            {shownAnswer && question.kind === "output" ? (
              <div className="flex flex-col gap-1">
                <span className={`text-[15px] ${right ? "text-[var(--coach-correct-ink)]" : "text-[var(--coach-wrong-ink)]"}`}>
                  It prints:
                </span>
                <pre className="m-0 max-h-40 overflow-auto rounded-lg bg-[var(--coach-code-bg)] px-3 py-2 font-[family-name:var(--font-plex-mono)] text-[13px] leading-6 text-[var(--coach-code-ink)]">
                  {shownAnswer}
                </pre>
              </div>
            ) : shownAnswer ? (
              <p
                className={`m-0 text-[15px] leading-snug ${right ? "text-[var(--coach-correct-ink)]" : "text-[var(--coach-wrong-ink)]"}`}
              >
                {right ? "Exact wording: " : "Answer: "}
                <AnswerText text={shownAnswer} className="font-semibold text-[var(--coach-ink)]" />
              </p>
            ) : null}
            {question.kind === "bug" ? (
              <p
                className={`m-0 text-[15px] leading-snug ${right ? "text-[var(--coach-correct-ink)]" : "text-[var(--coach-wrong-ink)]"}`}
              >
                <span className="font-semibold text-[var(--coach-ink)]">Line {question.bugLine + 1}:</span> {question.fix}
              </p>
            ) : question.hint ? (
              <p
                className={`m-0 text-sm leading-normal ${right ? "text-[var(--coach-correct-ink)]" : "text-[var(--coach-wrong-ink)]"}`}
              >
                {question.hint}
              </p>
            ) : null}
            {!right && reviewHref ? (
              <Link
                href={reviewHref}
                className="text-sm font-semibold text-[var(--coach-wrong-title)] underline underline-offset-4"
              >
                Review the lesson
              </Link>
            ) : null}
          </div>
        </div>
        <div className="flex w-full gap-3 sm:w-auto">
          {!right && !feedback.dunno && onOverride ? (
            <button
              type="button"
              onClick={onOverride}
              className="mb-1 flex h-11 flex-1 items-center justify-center rounded-xl border-2 border-[var(--coach-wrong-border)] bg-[var(--coach-surface)] px-4 text-sm font-semibold text-[var(--coach-wrong-title)] shadow-[0_4px_0_var(--coach-wrong-border)] sm:flex-none"
            >
              I was right
            </button>
          ) : null}
          <button
            type="button"
            className={`mb-1 flex h-11 flex-1 shrink-0 items-center justify-center gap-2.5 rounded-xl text-[14.5px] font-bold sm:w-44 sm:flex-none ${
              right
                ? "bg-[var(--coach-solid-btn-bg)] text-[var(--coach-solid-btn-ink)] shadow-[0_4px_0_var(--coach-solid-btn-shadow)]"
                : "bg-[var(--coach-wrong-strong)] text-[var(--coach-on-wrong)] shadow-[0_4px_0_var(--coach-wrong-shadow)]"
            }`}
            onClick={onContinue}
          >
            Continue
            <kbd
              className={`hidden h-[22px] items-center rounded-md border border-b-2 px-1.5 font-[family-name:var(--font-plex-mono)] text-[11px] font-medium sm:inline-flex ${KBD_TOUCH} ${
                right
                  ? "border-[var(--coach-solid-btn-kbd-border)] bg-[var(--coach-solid-btn-kbd-bg)] text-[var(--coach-solid-btn-ink)]"
                  : "border-[var(--coach-wrong-kbd-border)] bg-[var(--coach-wrong-kbd-bg)] text-[var(--coach-on-wrong)]"
              }`}
            >
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
  const pickedIds = useMemo(
    () => parseCoachV2CardIds(searchParams),
    [searchParams],
  );
  const pickedLabel = useMemo(
    () => parseCoachV2Label(searchParams),
    [searchParams],
  );
  const activeScope = useMemo(() => {
    const labeled = labelCoachV2Scope(scope);
    return pickedIds.length > 0
      ? { ...labeled, scopeLabel: pickedLabel ?? "Selected cards" }
      : labeled;
  }, [pickedIds, pickedLabel, scope]);
  const unlocked = useMemo(
    () => unlockedQuestions(completed),
    [completed],
  );

  const [questions, setQuestions] = useState<PracticeItem[]>([]);
  // A fresh option order per multiple-choice card, so answers aren't remembered by position.
  const [orders, setOrders] = useState<Record<string, number[]>>({});
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"prompt" | "feedback">("prompt");
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  // When the current card was shown, and (flashcards) when its answer was
  // revealed: the answer time.
  const shownAt = useRef<number | null>(null);
  const revealedAt = useRef<number | null>(null);
  useEffect(() => {
    shownAt.current = Date.now();
    revealedAt.current = null;
  }, [index, questions]);
  useEffect(() => {
    if (revealed && revealedAt.current === null) revealedAt.current = Date.now();
  }, [revealed]);
  const [typedAnswer, setTypedAnswer] = useState("");
  // Spot the bug: the line the learner picked (0-based).
  const [pickedLine, setPickedLine] = useState<number | null>(null);
  // Put in order: each card's current arrangement (step indices by position) and the picked position.
  const [arrangements, setArrangements] = useState<Record<string, number[]>>({});
  const [pickedPos, setPickedPos] = useState<number | null>(null);
  // Flip the bits: each card's cells (null = not set yet, for truth tables).
  const [cellsById, setCellsById] = useState<Record<string, Cell[]>>({});
  const [answered, setAnswered] = useState<Answered[]>([]);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  // After a miss, the explaining diagram is scrolled into view (above the sticky feedback bar).
  const missFigureRef = useRef<HTMLElement>(null);
  const missFigureShown = Boolean(
    phase === "feedback" && feedback && !feedback.correct && questions[index] && MISS_FIGURES.has(questions[index].id),
  );
  useEffect(() => {
    if (!missFigureShown) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    missFigureRef.current?.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" });
  }, [missFigureShown, index]);
  // A graded flashcard on its way off screen (right: knew it, left: not yet).
  const [leaving, setLeaving] = useState<"left" | "right" | null>(null);

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
    let sessionSize = size;
    if (pickedIds.length > 0) {
      const unlockedIds = new Set(unlocked.map((question) => question.id));
      priorityIds = pickedIds.filter((id) => unlockedIds.has(id));
      sessionSize = priorityIds.length;
    } else if (scope.type === "due") {
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
    const next =
      sessionSize > 0
        ? buildSession({
            completedKeys: completed,
            priorityIds,
            size: sessionSize,
            scope,
          })
        : [];
    if (next.length === 0) {
      router.replace(PRACTICE_ROUTES.home);
      return;
    }
    // Fresh-number cards get new numbers each time they come back (seeded by how often they've been answered).
    const answered = new Map(cards.map((card) => [card.questionId, card.reps + card.lapses]));
    const fresh = next.map((q) => freshVariant(q, answered.get(q.id) ?? 0));
    const nextOrders = Object.fromEntries(
      fresh.flatMap((q) =>
        q.kind === "mcq"
          ? [[q.id, shuffledOrder(q.options.length)] as const]
          : q.kind === "order"
            ? [[q.id, scrambledOrder(q.steps.length)] as const]
            : [],
      ),
    );
    queueMicrotask(() => {
      setOrders(nextOrders);
      setQuestions(fresh);
    });
  }, [completed, initialCards, pickedIds, router, scope, size, unlocked, userId]);

  function resetPrompt() {
    setSelected(null);
    setPickedLine(null);
    setPickedPos(null);
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
    const timesMs = Object.fromEntries(
      nextAnswered
        .filter((answer) => answer.ms !== undefined)
        .map((answer) => [answer.questionId, answer.ms!]),
    );
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
      timesMs,
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
    router.push(`${PRACTICE_ROUTES.complete}?session=${record.id}`);
  }

  function exitSession() {
    if (answered.length > 0) saveSession(answered);
    router.push(PRACTICE_ROUTES.home);
  }

  function advance(nextAnswered = answered) {
    if (index + 1 >= questions.length) {
      finishSession(nextAnswered);
      return;
    }
    setIndex((current) => current + 1);
    resetPrompt();
  }

  function recordGrade(grade: PracticeGrade, correct: boolean): Answered[] | null {
    const question = questions[index];
    if (!question || phase === "feedback") return null;
    const endAt =
      question.kind === "flashcard"
        ? (revealedAt.current ?? Date.now())
        : Date.now();
    const ms =
      shownAt.current === null
        ? undefined
        : Math.max(0, endAt - shownAt.current);
    const nextAnswered = [
      ...answered,
      { questionId: question.id, grade, ms },
    ];
    setAnswered(nextAnswered);
    setFeedback({ correct, grade });
    setPhase("feedback");
    return nextAnswered;
  }

  /** Flashcards are graded by the learner, who has just seen the back: no feedback bar, straight on. */
  function gradeFlashcard(knewIt: boolean) {
    if (leaving) return;
    const commit = () => {
      setLeaving(null);
      const next = recordGrade(knewIt ? "good" : "again", knewIt);
      if (next) advance(next);
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return commit();
    setLeaving(knewIt ? "right" : "left");
    window.setTimeout(commit, 260);
  }

  /** "I don't know": show the answer and count a miss, instead of a guess that might luck into "right". */
  function dontKnow() {
    const question = questions[index];
    if (!question || question.kind === "flashcard") return;
    if (question.kind === "mcq") setSelected(null);
    else if (question.kind === "bug") setPickedLine(null);
    else if (question.kind === "order")
      setArrangements((prev) => ({ ...prev, [question.id]: question.steps.map((_, i) => i) }));
    else if (question.kind === "output") setTypedAnswer(question.output);
    // Bits cards show the answer themselves in the feedback phase.
    else if (question.kind !== "bits") setTypedAnswer(question.answers[0] ?? "");
    if (recordGrade("again", false)) setFeedback({ correct: false, grade: "again", dunno: true });
  }

  /** "I was right": a typed answer the matcher refused (a typo, another wording) counts as a hit. */
  function overrideLast() {
    const question = questions[index];
    if (!question || !feedback || feedback.correct) return;
    setAnswered((prev) =>
      prev.map((a, i) => (i === prev.length - 1 && a.questionId === question.id ? { ...a, grade: "good" } : a)),
    );
    setFeedback({ correct: true, grade: "good", overridden: true });
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
      (question.kind !== "typed" && question.kind !== "cloze" && question.kind !== "output") ||
      typedAnswer.trim().length === 0
    ) {
      return;
    }
    const correct =
      question.kind === "output" ? outputMatches(typedAnswer, question.output) : answersMatch(typedAnswer, question.answers);
    recordGrade(correct ? "good" : "again", correct);
  }

  const arrangementOf = (q: PracticeItem) =>
    q.kind === "order" ? (arrangements[q.id] ?? orders[q.id] ?? q.steps.map((_, i) => i)) : [];
  const cellsOf = (q: PracticeItem): Cell[] =>
    q.kind === "bits" ? (cellsById[q.id] ?? Array.from(q.bits, () => (q.gate ? null : 0))) : [];

  function moveStep(position: number, step: -1 | 1) {
    const question = questions[index];
    if (!question || question.kind !== "order" || phase !== "prompt") return;
    setArrangements((prev) => ({ ...prev, [question.id]: moveItem(arrangementOf(question), position, step) }));
    setPickedPos(Math.min(question.steps.length - 1, Math.max(0, position + step)));
  }

  function toggleCell(i: number) {
    const question = questions[index];
    if (!question || question.kind !== "bits" || phase !== "prompt") return;
    const cells = [...cellsOf(question)];
    if (i < 0 || i >= cells.length) return;
    cells[i] = cells[i] === 1 ? 0 : 1;
    setCellsById((prev) => ({ ...prev, [question.id]: cells }));
  }

  function checkOrder() {
    const question = questions[index];
    if (!question || question.kind !== "order") return;
    const correct = arrangementOf(question).every((step, position) => step === position);
    recordGrade(correct ? "good" : "again", correct);
  }

  function checkBits() {
    const question = questions[index];
    if (!question || question.kind !== "bits") return;
    const cells = cellsOf(question);
    if (cells.some((c) => c === null)) return;
    const correct = cells.join("") === question.bits;
    recordGrade(correct ? "good" : "again", correct);
  }

  function checkBug() {
    const question = questions[index];
    if (!question || question.kind !== "bug" || pickedLine === null) return;
    const correct = pickedLine === question.bugLine;
    recordGrade(correct ? "good" : "again", correct);
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey || leaving) return;
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
        // In the output box, Shift+Enter starts a new line; Enter alone checks.
        if (target?.tagName === "TEXTAREA" && event.shiftKey && phase === "prompt") return;
        event.preventDefault();
        if (phase === "feedback") advance(answered);
        else if (current.kind === "mcq") checkMcq();
        else if (current.kind === "bug") checkBug();
        else if (current.kind === "order") checkOrder();
        else if (current.kind === "bits") checkBits();
        else if (current.kind === "flashcard") {
          if (!revealed) setRevealed(true);
        } else gradeTyped();
        return;
      }

      if (typing || phase === "feedback") return;

      if ((event.key === "d" || event.key === "D") && current.kind !== "flashcard") {
        event.preventDefault();
        dontKnow();
        return;
      }

      if (event.key === "s" || event.key === "S") {
        event.preventDefault();
        advance();
        return;
      }

      if (current.kind === "order" && pickedPos !== null && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
        event.preventDefault();
        moveStep(pickedPos, event.key === "ArrowDown" ? 1 : -1);
        return;
      }

      if (current.kind === "bug" && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
        event.preventDefault();
        const step = event.key === "ArrowDown" ? 1 : -1;
        const last = current.code.length - 1;
        setPickedLine((line) => (line === null ? 0 : Math.min(last, Math.max(0, line + step))));
        return;
      }

      const digit = Number(event.key);
      if (!Number.isInteger(digit) || digit < 1) return;
      if (current.kind === "bug" && digit <= current.code.length) {
        event.preventDefault();
        setPickedLine(digit - 1);
        return;
      }
      if (current.kind === "order" && digit <= current.steps.length) {
        event.preventDefault();
        setPickedPos(digit - 1);
        return;
      }
      if (current.kind === "bits" && digit <= current.bits.length) {
        event.preventDefault();
        toggleCell(digit - 1);
        return;
      }
      if (current.kind === "mcq" && digit <= current.options.length) {
        event.preventDefault();
        const order = orders[current.id] ?? current.options.map((_, i) => i);
        setSelected(order[digit - 1]);
      } else if (current.kind === "flashcard" && revealed && digit <= 2) {
        event.preventDefault();
        gradeFlashcard(digit === 2);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  const question = questions[index];

  if (!question) {
    return <p className="text-center text-[var(--coach-ink)]">Preparing your review…</p>;
  }

  const subtitle = scopeSubtitle(activeScope.scopeLabel, question.reviewLabel);
  const reviewHref = feedback && !feedback.correct ? reviewHrefs[question.id] : undefined;
  const inFeedback = phase === "feedback" && feedback;
  const fieldState: FieldState = inFeedback
    ? feedback.correct
      ? "right"
      : feedback.dunno
        ? "shown"
        : "wrong"
    : "idle";

  const progress = sessionProgress(
    questions.map((q) => q.id),
    answered,
    index,
  );

  const choiceState = (original: number): ChoiceState => {
    if (question.kind !== "mcq") return "idle";
    if (!inFeedback) return selected === original ? "selected" : "idle";
    if (original === question.correct) return "right";
    if (original === selected) return "wrong";
    return "faded";
  };

  const answerField = (inline: boolean, onDark = false) =>
    question.kind === "typed" || question.kind === "cloze" ? (
      <AnswerInput
        key={question.id}
        value={typedAnswer}
        onChange={setTypedAnswer}
        state={fieldState}
        label={question.kind === "cloze" ? "The missing part" : "Your answer"}
        inline={inline}
        onDark={onDark}
        code={question.answers.some(looksLikeCode)}
        widthCh={inline ? blankWidth(question.answers) : undefined}
      />
    ) : null;

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-6">
      <div className="mx-auto flex w-full max-w-[680px] flex-col gap-4">
        <SessionTopBar
          segments={progress.segments}
          done={progress.done}
          current={index + 1}
          total={progress.total}
          onExit={exitSession}
        />
        <KindScopeRow question={question} subtitle={subtitle} />

        <div key={question.id} className={`flex flex-col gap-5 ${leaving ? `card-leave-${leaving}` : "card-deal-in"}`}>
        {question.kind === "mcq" ? (
          <>
            <h1 className="m-0 font-[family-name:var(--font-bricolage)] text-2xl font-bold leading-[1.25] tracking-[-0.01em] text-pretty sm:text-[28px]">
              {question.prompt}
            </h1>
            <CodeBlock lines={question.code} />
            <div role="group" aria-label="Answer choices" className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {(orders[question.id] ?? question.options.map((_, i) => i)).map((original, position) => (
                <McqChoice
                  key={original}
                  position={position + 1}
                  label={question.options[original]}
                  state={choiceState(original)}
                  onSelect={() => setSelected(original)}
                />
              ))}
            </div>
          </>
        ) : null}

        {question.kind === "flashcard" ? (
          // One card that flips over on Reveal (or a click); instant when the device asks for less motion.
          // Portrait, like a real card: 5:7, as wide as fits both the column and the screen height.
          <div
            key={question.id}
            className="relative mx-auto w-[min(380px,100%,calc((100dvh-250px)*5/7))] [perspective:1100px]"
          >
            <div aria-hidden className="absolute inset-x-4 top-3 -bottom-3 rounded-[22px] bg-[var(--coach-border)]" />
            <div
              onClick={() => !revealed && setRevealed(true)}
              className={`relative grid [transform-style:preserve-3d] ${revealed ? "flashcard-flipped" : "cursor-pointer"}`}
            >
              <div
                inert={revealed}
                className="flashcard-face flex aspect-[5/7] min-w-0 flex-col gap-3 rounded-[22px] border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-6 [backface-visibility:hidden] [grid-area:1/1] sm:p-8"
              >
                <span className="font-[family-name:var(--font-plex-mono)] text-[11px] uppercase tracking-[0.08em] text-[var(--coach-ink-muted)]">
                  Front
                </span>
                <h1
                  className={`m-0 my-auto font-[family-name:var(--font-bricolage)] font-extrabold tracking-[-0.02em] text-pretty break-words ${flashcardFrontSize(question.front)}`}
                >
                  {question.front}
                </h1>
                <CodeBlock lines={question.frontCode} />
                <p className="m-0 text-[14px] leading-relaxed text-[var(--coach-ink-secondary)]">
                  Answer in your head first, then turn the card over and be honest with yourself.
                </p>
              </div>
              <div
                inert={!revealed}
                aria-live="polite"
                className="flashcard-face flex aspect-[5/7] min-w-0 flex-col gap-3 rounded-[22px] border-2 border-[var(--coach-border)] bg-[var(--coach-flash-back)] p-6 [backface-visibility:hidden] [grid-area:1/1] [transform:rotateY(180deg)] sm:p-8"
              >
                <span className="font-[family-name:var(--font-plex-mono)] text-[11px] uppercase tracking-[0.08em] text-[var(--coach-tint-blue-ink)]">
                  Back
                </span>
                <p className="m-0 text-[14px] font-semibold text-[var(--coach-ink-muted)]">{question.front}</p>
                {revealed ? (
                  <>
                    <p className="m-0 text-[19px] leading-snug">{question.back}</p>
                    {question.figure ? <CardFigureView figure={question.figure} /> : null}
                  </>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        {question.kind === "output" ? (
          <>
            <h1 className="m-0 font-[family-name:var(--font-bricolage)] text-2xl font-bold leading-[1.25] tracking-[-0.01em] text-pretty sm:text-[28px]">
              {question.prompt}
            </h1>
            <CodeBlock lines={question.code} />
            <div
              className={`rounded-2xl border-2 bg-[var(--coach-code-bg)] p-4 text-[var(--coach-code-ink)] ${
                fieldState === "right"
                  ? "border-[var(--coach-correct-border)]"
                  : fieldState === "wrong"
                    ? "border-[var(--coach-wrong-border)]"
                    : fieldState === "shown"
                      ? "border-dashed border-[var(--coach-ink-muted)]"
                      : "border-[var(--coach-border)] focus-within:border-[var(--coach-lime)]"
              }`}
            >
              <div className="mb-2 flex items-center justify-between gap-3 font-[family-name:var(--font-plex-mono)] text-[12px] text-[var(--coach-hero-muted)]">
                <span>$ ./a.out</span>
                <span className={`hidden sm:inline ${KBD_TOUCH}`}>Shift+Enter for a new line</span>
              </div>
              <textarea
                key={question.id}
                id="practice-answer"
                aria-label="What it prints"
                value={typedAnswer}
                readOnly={fieldState !== "idle"}
                onChange={(event) => setTypedAnswer(event.target.value)}
                rows={3}
                placeholder="Type exactly what it prints"
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                autoFocus
                className={`block w-full resize-none bg-transparent font-[family-name:var(--font-plex-mono)] text-[14px] leading-6 text-[var(--coach-code-ink)] caret-[var(--coach-lime)] outline-none placeholder:text-[var(--coach-hero-muted)] ${
                  fieldState === "wrong" ? "line-through opacity-80" : ""
                }`}
              />
            </div>
          </>
        ) : null}

        {question.kind === "bug" ? (
          <>
            <h1 className="m-0 font-[family-name:var(--font-bricolage)] text-2xl font-bold leading-[1.25] tracking-[-0.01em] text-pretty sm:text-[28px]">
              {question.prompt}
            </h1>
            <div
              role="radiogroup"
              aria-label="Lines of code: pick the one with the bug"
              className="overflow-x-auto rounded-2xl border-2 border-[var(--coach-border)] bg-[var(--coach-code-bg)] py-3 font-[family-name:var(--font-plex-mono)] text-[13.5px] leading-7 text-[var(--coach-code-ink)]"
            >
              {question.code.map((line, i) => {
                const blank = line.trim() === "";
                const look = inFeedback
                  ? i === question.bugLine && !feedback.dunno
                    ? "bg-[var(--coach-correct-bg)] text-[var(--coach-correct-ink)] font-semibold"
                    : i === question.bugLine
                      ? "bg-[var(--coach-lime-soft)] text-[var(--coach-lime-ink)] font-semibold"
                      : i === pickedLine
                        ? "bg-[var(--coach-wrong-bg)] text-[var(--coach-wrong-ink)] line-through"
                        : "opacity-70"
                  : i === pickedLine
                    ? "bg-[color-mix(in_srgb,var(--coach-lime)_22%,transparent)] shadow-[inset_4px_0_0_var(--coach-lime)]"
                    : blank
                      ? ""
                      : "hover:bg-[color-mix(in_srgb,var(--coach-code-ink)_8%,transparent)]";
                return (
                  <button
                    key={i}
                    type="button"
                    role="radio"
                    aria-checked={pickedLine === i}
                    aria-label={`Line ${i + 1}: ${line.trim() || "blank"}`}
                    data-coach-choice
                    disabled={blank || Boolean(inFeedback)}
                    onClick={() => setPickedLine(i)}
                    className={`flex w-full min-w-max gap-4 px-4 text-left transition-colors disabled:cursor-default ${look}`}
                  >
                    <span aria-hidden className="w-5 shrink-0 text-right text-[var(--coach-hero-muted)]">
                      {i + 1}
                    </span>
                    <span className="whitespace-pre">{line || " "}</span>
                  </button>
                );
              })}
            </div>
          </>
        ) : null}

        {question.kind === "order" ? (
          <>
            <h1 className="m-0 font-[family-name:var(--font-bricolage)] text-2xl font-bold leading-[1.25] tracking-[-0.01em] text-pretty sm:text-[28px]">
              {question.prompt}
            </h1>
            <OrderCard
              steps={question.steps}
              arrangement={arrangementOf(question)}
              picked={pickedPos}
              locked={Boolean(inFeedback)}
              onPick={setPickedPos}
              onMove={moveStep}
            />
          </>
        ) : null}

        {question.kind === "bits" ? (
          <>
            <h1 className="m-0 font-[family-name:var(--font-bricolage)] text-2xl font-bold leading-[1.25] tracking-[-0.01em] text-pretty sm:text-[28px]">
              {question.prompt}
            </h1>
            <BitsCard
              answer={question.bits}
              cells={cellsOf(question)}
              places={question.places}
              gate={question.gate}
              phase={inFeedback ? (feedback.dunno ? "shown" : "checked") : "prompt"}
              onToggle={toggleCell}
            />
          </>
        ) : null}

        {question.kind === "typed" ? (
          <>
            <h1 className="m-0 font-[family-name:var(--font-bricolage)] text-2xl font-bold leading-[1.25] tracking-[-0.01em] text-pretty sm:text-[28px]">
              {question.prompt}
            </h1>
            <CodeBlock lines={question.code} />
            {answerField(false)}
          </>
        ) : null}

        {question.kind === "cloze"
          ? (() => {
              const prose = splitBlank(question.template);
              const code = splitCodeBlank(question.templateCode);
              const heading = "m-0 font-[family-name:var(--font-bricolage)] text-2xl font-bold leading-[1.5] tracking-[-0.01em] text-pretty sm:text-[28px]";
              if (prose) {
                return (
                  <>
                    <h1 className={heading}>
                      {prose.before}
                      {answerField(true)}
                      {prose.after}
                    </h1>
                    <CodeBlock lines={question.templateCode} />
                  </>
                );
              }
              if (code && question.templateCode) {
                return (
                  <>
                    <h1 className={heading}>{question.template ?? "Complete the code."}</h1>
                    <CodeBlock>
                      {question.templateCode.map((line, i) => (
                        <span key={i} className="block">
                          {i === code.line ? (
                            <>
                              {code.before}
                              {answerField(true, true)}
                              {code.after}
                            </>
                          ) : (
                            line || " "
                          )}
                        </span>
                      ))}
                    </CodeBlock>
                  </>
                );
              }
              // No blank marker: fall back to a plain answer field.
              return (
                <>
                  <h1 className={heading}>{question.template ?? "Fill in the blank."}</h1>
                  {answerField(false)}
                </>
              );
            })()
          : null}

        {missFigureShown ? (
          // After a miss (or "I don't know"), the picture that explains the answer, under the card.
          <section ref={missFigureRef} aria-label="Picture it" className="card-deal-in flex scroll-mb-56 flex-col gap-2">
            <h2 className="m-0 text-[15px] font-bold">Picture it</h2>
            <CardFigureView figure={MISS_FIGURES.get(question.id)!} />
          </section>
        ) : null}
        </div>
      </div>

      {inFeedback && feedback ? (
        <FeedbackBar
          feedback={feedback}
          question={question}
          typed={typedAnswer}
          reviewHref={reviewHref}
          onContinue={() => advance(answered)}
          onOverride={
            question.kind === "typed" || question.kind === "cloze" || question.kind === "output" ? overrideLast : undefined
          }
        />
      ) : question.kind === "mcq" ? (
        <PromptFooter>
          <div className="flex gap-2">
            <SkipButton onClick={() => advance()} />
            <QuietButton onClick={dontKnow} label="I don't know" keyHint="D" />
          </div>
          <LimeCheckButton disabled={selected === null} onClick={checkMcq} />
        </PromptFooter>
      ) : question.kind === "flashcard" ? (
        <PromptFooter>
          {!revealed ? (
            <>
              <SkipButton onClick={() => advance()} />
              <LimeCheckButton label="Reveal" onClick={() => setRevealed(true)} />
            </>
          ) : (
            <>
              <span id="grade-label" className="text-[15px] font-semibold">
                Did you know it?
              </span>
              <div role="group" aria-labelledby="grade-label" className="flex w-full gap-3 sm:ml-auto sm:w-auto">
                <button
                  type="button"
                  className="mb-1 flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border-2 border-[var(--coach-wrong-border)] bg-[var(--coach-surface)] text-sm font-bold text-[var(--coach-tint-orange-strong)] shadow-[0_4px_0_var(--coach-wrong-border)] sm:w-44 sm:flex-none"
                  onClick={() => gradeFlashcard(false)}
                >
                  Not yet
                  <kbd
                    className={`hidden size-5 items-center justify-center rounded-md border border-b-2 border-[var(--coach-wrong-border)] bg-[var(--coach-wrong-soft)] font-[family-name:var(--font-plex-mono)] text-[11px] font-medium sm:inline-flex ${KBD_TOUCH}`}
                  >
                    1
                  </kbd>
                </button>
                <button
                  type="button"
                  className="mb-1 flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--coach-lime)] text-sm font-bold text-[var(--coach-lime-ink)] shadow-[0_4px_0_var(--coach-lime-shadow)] sm:w-44 sm:flex-none"
                  onClick={() => gradeFlashcard(true)}
                >
                  Knew it
                  <kbd
                    className={`hidden size-5 items-center justify-center rounded-md border border-b-2 border-[var(--coach-lime-shadow)] bg-[var(--coach-lime-soft)] font-[family-name:var(--font-plex-mono)] text-[11px] font-medium sm:inline-flex ${KBD_TOUCH}`}
                  >
                    2
                  </kbd>
                </button>
              </div>
            </>
          )}
        </PromptFooter>
      ) : (
        <PromptFooter>
          <div className="flex gap-2">
            <SkipButton onClick={() => advance()} />
            <QuietButton onClick={dontKnow} label="I don't know" />
          </div>
          {question.kind === "bug" ? (
            <LimeCheckButton disabled={pickedLine === null} onClick={checkBug} />
          ) : question.kind === "order" ? (
            <LimeCheckButton onClick={checkOrder} />
          ) : question.kind === "bits" ? (
            <LimeCheckButton disabled={cellsOf(question).some((c) => c === null)} onClick={checkBits} />
          ) : (
            <LimeCheckButton disabled={typedAnswer.trim().length === 0} onClick={gradeTyped} />
          )}
        </PromptFooter>
      )}
    </div>
  );
}
