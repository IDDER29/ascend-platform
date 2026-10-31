import { Check, X } from "lucide-react";
import { climbSteps } from "@/lib/site/site-data";
import { SiteShell } from "./site-shell";
import { CARD, LEAD, PageIntro, Section, StartBand } from "./site-ui";

const FOR_YOU = [
  "You use computers every day and want to know what's actually happening inside.",
  "You write code but the machine underneath still feels like magic.",
  "You're heading toward C, operating systems, embedded or security work.",
  "You'd rather understand one idea properly than skim ten.",
];

const NOT_FOR_YOU = [
  "You want to ship a website this weekend. Ascend starts much lower down.",
  "You need a certificate. Ascend gives none, only what you can show you've built.",
  "You want video courses. Lessons here are written, with diagrams and code.",
];

const PROMISES = [
  {
    title: "No levels to grind",
    body: "There's no XP and nothing to level up. Topics have names, and you move on when you've learned them.",
  },
  {
    title: "Honest numbers",
    body: "Progress counts what you finished. When a number is an estimate, like how much you'd still recall, the page says so.",
  },
  {
    title: "Every lesson free",
    body: "Reading, Practice and projects cost nothing. An account only saves your progress across devices.",
  },
  {
    title: "Original work",
    body: "Lessons, diagrams, crests and badges are made for Ascend, and the sources a lesson leans on are linked from it.",
  },
];

export function AboutPage() {
  const steps = climbSteps();

  return (
    <SiteShell>
      <PageIntro
        title="Why Ascend exists."
        lead="Most courses teach you to use tools. Ascend teaches what's underneath them: how a bit becomes a decision, how the processor runs your code, how C reaches into memory and how the operating system keeps it all running."
      />

      <Section
        id="bottom-up"
        title="Bottom-up, on purpose."
        lead="Each idea rests on the one before it. So Ascend starts at the bottom and climbs, one topic at a time."
      >
        <ol className="m-0 flex list-none flex-col gap-3 p-0">
          {steps.map((s, i) => (
            <li key={s.levelId} className={`${CARD} flex items-baseline gap-4 p-5`}>
              <span className="w-6 shrink-0 font-display text-[20px] font-extrabold text-[var(--coach-ink-muted)]">
                {i + 1}
              </span>
              <span>
                <span className="block text-[18px] font-bold">{s.name}</span>
                <span className="block text-[14px] tabular-nums text-[var(--coach-ink-muted)]">
                  {s.lessons} lessons, {s.minutes} minutes
                </span>
              </span>
            </li>
          ))}
        </ol>
        <p className={`${LEAD} mt-5 text-[16px]`}>
          By the top you&apos;ve built a working Unix shell in C, and every line of it makes sense to you, down to the bits.
        </p>
      </Section>

      <Section id="who" title="Who it's for.">
        <div className="grid gap-4 md:grid-cols-2">
          <div className={`${CARD} p-5 sm:p-6`}>
            <h3 className="m-0 text-[18px] font-bold">Ascend is for you if</h3>
            <ul className="m-0 mt-4 flex list-none flex-col gap-3 p-0">
              {FOR_YOU.map((line) => (
                <li key={line} className="flex gap-3 text-[15.5px] leading-relaxed text-[var(--coach-ink-secondary)]">
                  <Check
                    size={18}
                    strokeWidth={2.6}
                    className="mt-1 shrink-0 text-[var(--coach-success)]"
                    aria-hidden
                  />
                  {line}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[20px] border-2 border-dashed border-[var(--coach-border-strong)] p-5 sm:p-6">
            <h3 className="m-0 text-[18px] font-bold">It&apos;s probably not, if</h3>
            <ul className="m-0 mt-4 flex list-none flex-col gap-3 p-0">
              {NOT_FOR_YOU.map((line) => (
                <li key={line} className="flex gap-3 text-[15.5px] leading-relaxed text-[var(--coach-ink-secondary)]">
                  <X size={18} strokeWidth={2.6} className="mt-1 shrink-0 text-[var(--coach-ink-muted)]" aria-hidden />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section id="promises" title="What we won't do.">
        <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2">
          {PROMISES.map((p) => (
            <li key={p.title} className={`${CARD} p-5`}>
              <h3 className="m-0 text-[17px] font-bold">{p.title}</h3>
              <p className="m-0 mt-1.5 text-[15px] leading-relaxed text-[var(--coach-ink-secondary)]">{p.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <StartBand />
    </SiteShell>
  );
}
