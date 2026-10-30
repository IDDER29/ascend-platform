"use client";

import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { AchievementsModel, BadgeView } from "@/lib/achievements/achievements-model";
import { byPrecedence, rackRows } from "@/lib/achievements/ribbons";
import { CriterionRow } from "./criterion-row";
import { Medal } from "./medal";
import { useSeenDecorations } from "./use-seen-decorations";
import { Ribbon } from "./ribbon";

const PIN_STEP_MS = 90;

function lowerFirst(text: string): string {
  return text.charAt(0).toLowerCase() + text.slice(1);
}

function joinAnd(parts: string[]): string {
  return parts.length <= 1 ? (parts[0] ?? "") : `${parts.slice(0, -1).join(", ")} and ${parts.at(-1)}`;
}

/** Rule texts start with one of these verbs; the citation reads them as reasons. */
const GERUND: Record<string, string> = {
  Finish: "finishing",
  Link: "linking",
  Hold: "holding",
  Get: "getting",
  Practice: "practicing",
  Come: "coming",
  Earn: "earning",
};

/** "Awarded to … on … for …": the badge's own rule, read back as the reason. */
function citation(badge: BadgeView, name: string): string {
  const reasons = badge.criteria.map((c) => {
    // A citation names what happened, not where to click: drop "on your profile", say "the" for "your".
    const [verb, ...rest] = c.text.replace(/ on your profile$/, "").replace(/\byour\b/g, "the").split(" ");
    return GERUND[verb] ? `${GERUND[verb]} ${rest.join(" ")}` : lowerFirst(c.text);
  });
  return `Awarded to ${name} on ${badge.earnedLabel} for ${joinAnd(reasons)}.`;
}

function Citation({
  badge,
  name,
  isNew,
  glyphOf,
  onSelect,
}: {
  badge: BadgeView;
  name: string;
  isNew: boolean;
  glyphOf: (id: string) => string;
  onSelect: (id: string) => void;
}) {
  return (
    <section
      aria-live="polite"
      aria-labelledby="citation-title"
      className="flex min-w-0 flex-col items-center gap-4 rounded-[24px] border-2 border-[var(--coach-border)] bg-[var(--coach-surface)] p-6 text-center sm:p-7"
    >
      <Medal id={badge.id} group={badge.group} glyph={badge.glyph} earned={badge.earned} />
      <div className="flex flex-col gap-1">
        <h2 id="citation-title" className="m-0 font-display text-[26px] font-extrabold leading-tight tracking-[-0.03em]">
          {badge.label}
        </h2>
        <span className={`text-[13.5px] font-semibold ${badge.earned ? "text-[var(--coach-tint-lime-ink)]" : "text-[var(--coach-ink-muted)]"}`}>
          {badge.earned ? `Awarded ${badge.earnedLabel}` : "Not yet awarded"}
          {isNew ? (
            <span className="ml-2 rounded-full bg-[var(--coach-lime)] px-2 py-0.5 text-[11.5px] font-bold text-[var(--coach-lime-ink)]">
              Newly awarded
            </span>
          ) : null}
        </span>
      </div>

      {badge.earned ? (
        <div className="flex w-full flex-col gap-2 border-t border-[var(--coach-divider)] pt-4 text-left">
          <h3 className="m-0 text-[12.5px] font-semibold text-[var(--coach-ink-muted)]">Citation</h3>
          <p className="m-0 text-[14.5px] leading-relaxed [text-wrap:pretty]">{citation(badge, name)}</p>
          {badge.repoUrl ? (
            <a
              href={badge.repoUrl}
              target="_blank"
              rel="noopener noreferrer nofollow ugc"
              className="flex min-w-0 items-center gap-1.5 text-[13px] text-[var(--coach-blue)] no-underline hover:underline"
            >
              <ExternalLink size={13} aria-hidden="true" className="shrink-0" />
              <span className="truncate font-mono">{badge.repoLabel}</span>
            </a>
          ) : null}
          <h3 className="m-0 mt-3 text-[12.5px] font-semibold text-[var(--coach-ink-muted)]">How it was earned</h3>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {badge.criteria.map((c) => (
              <CriterionRow key={c.text} c={c} partGlyph={c.badgeId ? glyphOf(c.badgeId) : null} onSelectPart={onSelect} />
            ))}
          </ul>
        </div>
      ) : (
        <div className="flex w-full flex-col gap-3 border-t border-[var(--coach-divider)] pt-4 text-left">
          <h3 className="m-0 text-[12.5px] font-semibold text-[var(--coach-ink-muted)]">
            {badge.criteria.length > 1 ? "How to earn it: meet all of these" : "How to earn it"}
          </h3>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {badge.criteria.map((c) => (
              <CriterionRow key={c.text} c={c} partGlyph={c.badgeId ? glyphOf(c.badgeId) : null} onSelectPart={onSelect} />
            ))}
          </ul>
          {badge.action ? (
            <Link
              href={badge.action.href}
              className="mt-1 inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--coach-lime)] px-5 text-[14px] font-bold text-[var(--coach-lime-ink)] no-underline shadow-[0_3px_0_var(--coach-lime-shadow)]"
            >
              {badge.action.label}
            </Link>
          ) : null}
        </div>
      )}
    </section>
  );
}

/** The learner's decorations worn on a uniform, with a citation for each, and the ones still to earn. */
export function Chest({ model, name }: { model: AchievementsModel; name: string }) {
  const worn = byPrecedence(model.parts.filter((p) => p.earned));
  const toEarn = [...model.parts.filter((p) => !p.earned)].sort(
    (a, b) => b.ratio - a.ratio || model.parts.indexOf(a) - model.parts.indexOf(b),
  );
  const seen = useSeenDecorations(worn.map((b) => b.id));
  const firstNew = worn.find((b) => seen.isNew(b.id));
  const [chosenId, setChosenId] = useState<string | null>(null);
  // A newly awarded decoration opens first until the learner picks something else.
  const selectedId = chosenId ?? firstNew?.id ?? worn[0]?.id ?? toEarn[0]?.id ?? model.parts[0].id;
  const selected = model.parts.find((p) => p.id === selectedId) ?? model.parts[0];
  const glyphOf = (id: string) => model.parts.find((p) => p.id === id)?.glyph ?? "•";
  const select = (id: string) => {
    setChosenId(id);
    seen.markSeen(id);
    if (window.matchMedia("(max-width: 1023px)").matches) {
      document.getElementById("citation-title")?.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  };
  let pin = 0;

  return (
    <div className="flex min-w-0 flex-col gap-8">
      <div className="grid w-full min-w-0 grid-cols-1 items-stretch gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]">
        <section
          aria-labelledby="chest-title"
          className="relative flex min-h-[300px] min-w-0 flex-col items-center justify-center gap-7 overflow-hidden rounded-[24px] bg-[var(--coach-hero-bg)] px-5 py-9 text-[var(--coach-hero-ink)] sm:px-10"
        >
          {/* The uniform: lapels meeting at the top and a placket seam. */}
          <span aria-hidden="true" className="pointer-events-none absolute -left-16 -top-24 hidden h-56 w-56 rotate-[35deg] border-r border-white/[0.07] sm:block" />
          <span aria-hidden="true" className="pointer-events-none absolute -right-16 -top-24 hidden h-56 w-56 -rotate-[35deg] border-l border-white/[0.07] sm:block" />

          <h2 id="chest-title" className="sr-only">
            Decorations worn
          </h2>

          {worn.length > 0 ? (
            <ol aria-label="Decorations, highest first" className="relative m-0 flex list-none flex-col items-center gap-1.5 p-0">
              {rackRows(worn).map((row, r) => (
                <li key={r}>
                  <ol className="m-0 flex list-none justify-center gap-1.5 p-0">
                    {row.map((badge) => (
                      <li
                        key={badge.id}
                        className="achv-pin"
                        style={{ ["--pin-delay" as string]: `${pin++ * PIN_STEP_MS}ms` }}
                      >
                        <button
                          type="button"
                          aria-pressed={selectedId === badge.id}
                          aria-label={`${badge.label}, awarded ${badge.earnedLabel}${seen.isNew(badge.id) ? ", new" : ""}`}
                          title={`${badge.label}: ${badge.criteria.map((c) => c.text).join("; ")}`}
                          onClick={() => select(badge.id)}
                          className={`relative block rounded-[4px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--coach-lime)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--coach-hero-bg)] ${
                            selectedId === badge.id
                              ? "ring-2 ring-white ring-offset-2 ring-offset-[var(--coach-hero-bg)]"
                              : seen.isNew(badge.id)
                                ? "shadow-[0_0_0_2px_var(--coach-lime),0_0_14px_var(--coach-lime)]"
                                : ""
                          }`}
                        >
                          <Ribbon id={badge.id} group={badge.group} glyph={badge.glyph} />
                        </button>
                      </li>
                    ))}
                  </ol>
                </li>
              ))}
            </ol>
          ) : (
            <p className="relative m-0 max-w-[300px] rounded-xl border-2 border-dashed border-[var(--coach-hero-track)] px-5 py-4 text-center text-[14px] text-[var(--coach-hero-muted)]">
              No decorations yet. Your first is {toEarn[0]?.label ?? "waiting"}: {lowerFirst(toEarn[0]?.criteria[0]?.text ?? "")}.
            </p>
          )}

          {/* Nameplate. */}
          <div className="relative rounded-[5px] bg-[linear-gradient(180deg,#f3f1ea,#cfccc2)] px-5 py-1.5 shadow-[0_2px_0_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.7)]">
            <span className="font-mono text-[13px] font-semibold uppercase tracking-[0.18em] text-[#1b1d22]">{name}</span>
          </div>

          <p className="relative m-0 text-center text-[13px] text-[var(--coach-hero-muted)]">
            {worn.length === 0
              ? `${model.total} decorations to earn`
              : `${worn.length} of ${model.total} decorations, worn highest first. Select a ribbon to read its citation.`}
          </p>
        </section>

        <Citation badge={selected} name={name} isNew={seen.isNew(selected.id)} glyphOf={glyphOf} onSelect={select} />
      </div>

      {toEarn.length > 0 ? (
        <section aria-labelledby="to-earn-title" className="flex min-w-0 flex-col gap-3">
          <h2 id="to-earn-title" className="m-0 font-display text-[22px] font-extrabold tracking-[-0.02em]">
            Still to earn
          </h2>
          <p className="m-0 max-w-[640px] text-[14px] leading-relaxed text-[var(--coach-ink-secondary)]">
            Every decoration has its own rule. Here is exactly what each one asks for, closest first.
          </p>
          <ul className="m-0 grid list-none grid-cols-1 gap-3 p-0 md:grid-cols-2">
            {toEarn.map((badge) => {
              const met = badge.criteria.filter((c) => c.done).length;
              return (
                <li
                  key={badge.id}
                  className={`flex h-full min-w-0 flex-col gap-3 rounded-2xl border-2 bg-[var(--coach-surface)] p-4 ${
                    selectedId === badge.id ? "border-[var(--coach-blue)]" : "border-[var(--coach-border)]"
                  }`}
                >
                  <button
                    type="button"
                    aria-pressed={selectedId === badge.id}
                    onClick={() => select(badge.id)}
                    className="flex min-w-0 items-center gap-3 rounded-lg text-left hover:underline"
                  >
                    <Ribbon id={badge.id} group={badge.group} glyph={badge.glyph} size="small" muted />
                    <span className="min-w-0 flex-1 text-[15px] font-semibold">{badge.label}</span>
                    {badge.criteria.length > 1 ? (
                      <span className="shrink-0 text-[12px] text-[var(--coach-ink-muted)]">
                        {met} of {badge.criteria.length} met
                      </span>
                    ) : null}
                  </button>
                  <div className="flex flex-col gap-2">
                    <h3 className="m-0 text-[12px] font-semibold text-[var(--coach-ink-muted)]">
                      {badge.criteria.length > 1 ? "How to earn it: meet all of these" : "How to earn it"}
                    </h3>
                    <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                      {badge.criteria.map((c) => (
                        <CriterionRow key={c.text} c={c} partGlyph={c.badgeId ? glyphOf(c.badgeId) : null} onSelectPart={select} />
                      ))}
                    </ul>
                  </div>
                  {badge.action ? (
                    <Link
                      href={badge.action.href}
                      className="mt-auto inline-flex h-9 w-fit items-center rounded-lg bg-[var(--coach-solid-btn-bg)] px-3.5 text-[13px] font-bold text-[var(--coach-solid-btn-ink)] no-underline shadow-[0_2px_0_var(--coach-solid-btn-shadow)]"
                    >
                      {badge.action.label}
                    </Link>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
