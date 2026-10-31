import Link from "next/link";
import { CONTENT_REPO_URL } from "@/lib/brand/repo";
import { FIRST_LESSON_HREF } from "@/lib/routes";
import { SiteShell } from "./site-shell";
import { CARD, LEAD, OUTLINE_BTN, PageIntro, SOLID_BTN, Section, StartBand } from "./site-ui";

const REPO = CONTENT_REPO_URL.replace(/\/$/, "");

const FIX_STEPS = [
  {
    title: "Open the lesson",
    body: "At the bottom of every lesson there's an Edit on GitHub link that opens its file.",
  },
  {
    title: "Make the change",
    body: "Lessons are Markdown with a few components for diagrams and code. Fix the typo, the unclear sentence or the wrong number.",
  },
  {
    title: "Propose it",
    body: "GitHub turns your edit into a pull request. Once it's reviewed and merged, everyone reads the fixed lesson.",
  },
];

const RUN = ["git clone " + REPO + ".git", "cd ascend-platform", "npm install", "npm run dev"];

export function OpenSourcePage() {
  return (
    <SiteShell>
      <PageIntro
        title="Open source."
        lead="Ascend's code and every one of its lessons live in one public GitHub repository. Read how it's built, fix a mistake you found, or run your own copy."
      >
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <a href={REPO} target="_blank" rel="noopener noreferrer" className={SOLID_BTN}>
            Open the repository
          </a>
          <a href={`${REPO}/issues/new`} target="_blank" rel="noopener noreferrer" className={OUTLINE_BTN}>
            Report a problem
          </a>
        </div>
      </PageIntro>

      <Section
        id="fix"
        title="Fix a lesson."
        lead="Found something wrong or confusing? It takes a few minutes and a free GitHub account."
      >
        <ol className="m-0 flex list-none flex-col gap-3 p-0">
          {FIX_STEPS.map((step, i) => (
            <li key={step.title} className={`${CARD} flex gap-4 p-5`}>
              <span
                aria-hidden
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--coach-hero-bg)] font-display text-[16px] font-extrabold text-[var(--coach-lime)]"
              >
                {i + 1}
              </span>
              <div>
                <h3 className="m-0 text-[17px] font-bold">{step.title}</h3>
                <p className="m-0 mt-1 text-[15px] leading-relaxed text-[var(--coach-ink-secondary)]">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="m-0 mt-4 text-[15px] text-[var(--coach-ink-secondary)]">
          Not up for editing? Every lesson also has a <span className="font-semibold">Report an issue</span> link that
          fills in which lesson you mean.
        </p>
      </Section>

      <Section
        id="run"
        title="Run it yourself."
        lead="You need Node.js. With no database set up, Ascend creates a local SQLite file on first run, so there's nothing else to install."
      >
        <pre className="m-0 overflow-x-auto rounded-[20px] bg-[var(--coach-code-bg)] p-5 font-mono text-[14px] leading-relaxed text-[var(--coach-code-ink)]">
          <code>
            {RUN.map((line) => (
              <span key={line} className="block">
                <span aria-hidden className="select-none text-[var(--coach-lime)]">
                  ${" "}
                </span>
                {line}
              </span>
            ))}
          </code>
        </pre>
        <p className={`${LEAD} mt-4 text-[16px]`}>
          Then open <span className="font-mono text-[15px]">localhost:3000</span>. Lessons are in{" "}
          <span className="font-mono text-[15px]">content/curriculum</span>, one file each.
        </p>
      </Section>

      <Section id="help" title="Other ways to help.">
        <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-3">
          {[
            ["Star the repository", "It helps other people find Ascend."],
            ["Send it to one person", "Someone who's always asked how computers actually work."],
            ["Tell us what confused you", "A report about one unclear paragraph is worth a lot."],
          ].map(([title, body]) => (
            <li key={title} className={`${CARD} p-5`}>
              <h3 className="m-0 text-[17px] font-bold">{title}</h3>
              <p className="m-0 mt-1 text-[15px] leading-relaxed text-[var(--coach-ink-secondary)]">{body}</p>
            </li>
          ))}
        </ul>
        <p className="m-0 mt-5 text-[15px] text-[var(--coach-ink-secondary)]">
          Or just learn something:{" "}
          <Link href={FIRST_LESSON_HREF} className="font-semibold text-[var(--coach-ink)] underline underline-offset-2">
            the first lesson
          </Link>{" "}
          is where every fix starts, too.
        </p>
      </Section>

      <StartBand />
    </SiteShell>
  );
}
