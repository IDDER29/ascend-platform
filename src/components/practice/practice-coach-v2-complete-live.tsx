"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  PRACTICE_COACH_V2_COMPLETE_CSS,
  PRACTICE_COACH_V2_COMPLETE_HTML,
} from "@/components/practice/practice-coach-v2-complete-markup";
import { PRACTICE_BANK } from "@/lib/practice/bank";
import { findCoachV2SessionRecord } from "@/lib/practice/coach-v2-flow";
import {
  readLocalHistory,
  type PracticeSessionRecord,
} from "@/lib/practice/history";

const questionsById = new Map(
  PRACTICE_BANK.map((question) => [question.id, question] as const),
);

export type PracticeCoachV2CompleteLiveProps = {
  userId: string | null;
  reviewHrefs: Record<string, string>;
  initialHistory: PracticeSessionRecord[];
  sessionId: string | null;
};

function mergeHistory(
  local: PracticeSessionRecord[],
  server: PracticeSessionRecord[],
): PracticeSessionRecord[] {
  const byId = new Map<string, PracticeSessionRecord>();
  for (const session of [...local, ...server]) {
    byId.set(session.id, session);
  }
  return [...byId.values()]
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 40);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function scoreSubcopy(record: PracticeSessionRecord): string {
  const missCount = record.missIds.length;
  if (missCount > 0) {
    return `The ${missCount} you ${missCount === 1 ? "missed is" : "missed are"} already scheduled to come back.`;
  }
  return "You're caught up for now.";
}

function buildTickGridHtml(record: PracticeSessionRecord): string {
  const missSet = new Set(record.missIds);
  const missCount = record.missIds.length;
  const spans = record.questionIds
    .map((questionId, index) => {
      const missed = missSet.has(questionId);
      const bg = missed ? "#D9622B" : "#2E4BDB";
      const status = missed ? "missed" : "correct";
      return `<span title="Card ${index + 1} · ${status}" style="height: 14px; border-radius: 999px; background: ${bg}"></span>`;
    })
    .join("\n");
  return `<div aria-label="Results by card: ${record.correct} correct, ${missCount} missed" style="display: grid; grid-template-columns: repeat(8, minmax(0, 1fr)); gap: 6px">
${spans}
</div>`;
}

function buildMissRowHtml(
  id: string,
  label: string,
  href: string | undefined,
): string {
  const safeLabel = escapeHtml(label);
  const titleInner = href
    ? `<a href="${escapeHtml(href)}" style="color: inherit; text-decoration: none">${safeLabel}</a>`
    : safeLabel;
  return `<div style="display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 14px 0; border-top: 1px solid #ECE9E0">
<div style="display: flex; flex-direction: column; gap: 4px"><span style="font-family: var(--font-plex-mono), monospace; font-size: 16px">${titleInner}</span></div>
<span style="padding: 3px 9px; border-radius: 999px; background: #FDE7DA; color: #9A3412; font-size: 12px; font-weight: 600">Missed</span>
</div>`;
}

function buildComingBackSectionHtml(
  record: PracticeSessionRecord,
  reviewHrefs: Record<string, string>,
): string {
  const missCount = record.missIds.length;
  const cardLabel =
    missCount === 1 ? "1 card" : `${missCount} cards`;
  const rows = record.missIds
    .map((id) => {
      const question = questionsById.get(id);
      const label = question?.reviewLabel ?? id;
      const href = reviewHrefs[id];
      return buildMissRowHtml(id, label, href);
    })
    .join("\n");

  return `<div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px">
<h2 id="missed-title" style="margin: 0; font-size: 18px; font-weight: 600">Coming back</h2>
<span style="font-size: 13px; color: #5A5E66">${cardLabel}</span>
</div>
${rows}`;
}

function buildPrimaryCtaHtml(record: PracticeSessionRecord): string {
  const missCount = record.missIds.length;
  if (missCount > 0) {
    const noun = missCount === 1 ? "miss" : "misses";
    return `<a href="/practicev2/session?scope=due" style="display: flex; align-items: center; justify-content: center; gap: 12px; height: 60px; border-radius: 16px; background: #D7F26B; box-shadow: 0 5px 0 #9DB43A; color: #16181D; font-weight: 700; font-size: 17px; letter-spacing: 0.02em; text-transform: uppercase; text-decoration: none; margin-bottom: 5px">Fix ${missCount} ${noun} now
<kbd style="height: 24px; box-sizing: border-box; padding: 0 7px; display: inline-flex; align-items: center; border: 1px solid #9DB43A; border-bottom-width: 2px; border-radius: 6px; background: #E8F7A6; font-family: var(--font-plex-mono), monospace; font-size: 12px; font-weight: 500; letter-spacing: 0; text-transform: none">Enter</kbd></a>`;
  }
  return `<a href="/practicev2" style="display: flex; align-items: center; justify-content: center; gap: 12px; height: 60px; border-radius: 16px; background: #D7F26B; box-shadow: 0 5px 0 #9DB43A; color: #16181D; font-weight: 700; font-size: 17px; letter-spacing: 0.02em; text-transform: uppercase; text-decoration: none; margin-bottom: 5px">Continue practice
<kbd style="height: 24px; box-sizing: border-box; padding: 0 7px; display: inline-flex; align-items: center; border: 1px solid #9DB43A; border-bottom-width: 2px; border-radius: 6px; background: #E8F7A6; font-family: var(--font-plex-mono), monospace; font-size: 12px; font-weight: 500; letter-spacing: 0; text-transform: none">Enter</kbd></a>`;
}

const SCORE_LINE_RE =
  /<p style="margin: 0; font-size: 18px; color: #4A4E57">[\s\S]*?<\/p>/;
const TICK_GRID_RE =
  /<div aria-label="Results by card:[\s\S]*?<\/div>\s*(?=<div style="display: flex; gap: 16px; font-size: 13px; color: #4A4E57">)/;
const COMING_BACK_INNER_RE =
  /(<section aria-labelledby="missed-title"[\s\S]*?>)([\s\S]*?)(<\/section>\s*\n\s*<div style="display: flex; flex-direction: column; gap: 12px">)/;
const PRIMARY_CTA_RE =
  /<a href="\/practicev2" style="display: flex; align-items: center; justify-content: center; gap: 12px; height: 60px;[\s\S]*?<\/a>/;
const SECONDARY_CTA_RE =
  /<a href="\/practicev2\/caught-up" style="display: flex; align-items: center; justify-content: center; height: 52px;[\s\S]*?>Back to practice<\/a>/;

function patchCompleteHtml(
  record: PracticeSessionRecord,
  reviewHrefs: Record<string, string>,
): string {
  let html = PRACTICE_COACH_V2_COMPLETE_HTML;

  const scoreLine = `<p style="margin: 0; font-size: 18px; color: #4A4E57">${record.correct} of ${record.total} right. ${scoreSubcopy(record)}</p>`;
  html = html.replace(SCORE_LINE_RE, scoreLine);

  html = html.replace(TICK_GRID_RE, `${buildTickGridHtml(record)}\n`);

  html = html.replace(
    COMING_BACK_INNER_RE,
    `$1${buildComingBackSectionHtml(record, reviewHrefs)}$3`,
  );

  html = html.replace(PRIMARY_CTA_RE, buildPrimaryCtaHtml(record));

  html = html.replace(
    SECONDARY_CTA_RE,
    `<a href="/practicev2" style="display: flex; align-items: center; justify-content: center; height: 52px; border-radius: 14px; border: 2px solid #D5D0C3; color: #16181D; font-weight: 600; font-size: 15px; text-decoration: none">Back to practice</a>`,
  );

  return html;
}

function CoachCompleteShell({ html }: { html: string }) {
  return (
    <>
      <style id="practice-coach-v2-complete-css">
        {PRACTICE_COACH_V2_COMPLETE_CSS}
      </style>
      <div
        className="practice-coach-v2-complete"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
}

export function PracticeCoachV2CompleteLive({
  userId,
  reviewHrefs,
  initialHistory,
  sessionId,
}: PracticeCoachV2CompleteLiveProps) {
  const [history, setHistory] = useState(initialHistory);
  const [historyReady, setHistoryReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const local = readLocalHistory(userId);
    queueMicrotask(() => {
      if (cancelled) return;
      setHistory((server) => mergeHistory(local, server));
      setHistoryReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const record = useMemo(
    () => findCoachV2SessionRecord(history, sessionId),
    [history, sessionId],
  );

  const patchedHtml = useMemo(
    () => (record ? patchCompleteHtml(record, reviewHrefs) : null),
    [record, reviewHrefs],
  );

  if (!historyReady) {
    return (
      <div
        className="min-h-[360px] rounded-[18px] border-2 border-[#E2DED3] bg-[#FFFFFF]"
        aria-label="Loading session results"
      />
    );
  }

  if (!record || !patchedHtml) {
    return (
      <section
        className="mx-auto max-w-xl rounded-[20px] border-2 border-[#E2DED3] bg-[#FFFFFF] p-8 text-center sm:p-12"
        style={{ fontFamily: "var(--font-hanken), system-ui, sans-serif" }}
      >
        <h1
          className="text-3xl font-extrabold tracking-tight text-[#16181D]"
          style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
        >
          No session yet
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-[#4A4E57]">
          Finish a review to see your results here.
        </p>
        <Link
          href="/practicev2"
          className="mt-7 inline-flex h-[52px] items-center justify-center rounded-[14px] border-2 border-[#D5D0C3] px-6 text-[15px] font-semibold text-[#16181D] no-underline hover:brightness-[0.97]"
        >
          Back to practice
        </Link>
      </section>
    );
  }

  return <CoachCompleteShell html={patchedHtml} />;
}
