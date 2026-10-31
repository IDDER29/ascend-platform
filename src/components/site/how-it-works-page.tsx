import Link from "next/link";
import { GOAL_PLANS, type DailyGoal } from "@/lib/practice/daily-goal";
import { FIRST_LESSON_HREF } from "@/lib/routes";
import { siteStats } from "@/lib/site/site-data";
import { ForgettingChart } from "./forgetting-chart";
import { SiteShell } from "./site-shell";
import { CARD, LEAD, PageIntro, Section, StartBand } from "./site-ui";

const STEPS = [
  {
    title: "Read a short lesson",
    body: "Each lesson explains one idea in four to twelve minutes: why it matters, how it works, with diagrams and small programs you can trace by hand. Lessons say what to read first, so you never meet an idea before the ones it rests on.",
  },
  {
    title: "Check yourself",
    body: "A few questions close every lesson. They show you what stuck, and when something didn't, they point you to the part of the lesson that explains it and to more reading if you want it.",
  },
  {
    title: "Practice brings it back",
    body: "Every idea you've read becomes a card in Practice. A card comes back when you're about to forget it: soon at first, then days, then weeks apart. Miss one and it comes back sooner.",
  },
  {
    title: "Build something real",
    body: "Projects sit inside the topics, like a half-adder built from logic gates. The Systems Programmer path ends with ShellForge: a working Unix shell, written by you in C.",
  },
];

const RESEARCH = [
  {
    finding: "Forgetting is fast at first, then slows.",
    source: "Ebbinghaus (1885); replicated by Murre & Dros (2015)",
  },
  {
    finding: "Spreading reviews over days beats cramming the same time into one sitting.",
    source: "Cepeda et al. (2006), a review of 317 experiments",
  },
  {
    finding: "Trying to recall something strengthens it more than reading it again.",
    source: "Karpicke & Roediger (2008), Science",
  },
];

export function HowItWorksPage() {
  const stats = siteStats();
  const goals = Object.entries(GOAL_PLANS) as [string, (typeof GOAL_PLANS)[DailyGoal]][];

  return (
    <SiteShell>
      <PageIntro
        title="How Ascend works."
        lead="Read a short lesson, check what stuck, let Practice bring it back before you forget, and build things that prove it. That's the whole method, and every topic follows it."
      />

      <section aria-labelledby="steps-title" className="mx-auto w-full max-w-[1160px] px-4 pb-12 sm:px-8 sm:pb-16">
        <h2 id="steps-title" className="sr-only">
          The four steps
        </h2>
        <ol className="m-0 grid list-none gap-4 p-0 md:grid-cols-2">
          {STEPS.map((step, i) => (
            <li key={step.title} className={`${CARD} flex gap-4 p-5 sm:p-7`}>
              <span
                aria-hidden
                className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--coach-hero-bg)] font-display text-[18px] font-extrabold text-[var(--coach-lime)]"
              >
                {i + 1}
              </span>
              <div>
                <h3 className="m-0 text-[20px] font-bold leading-tight">{step.title}</h3>
                <p className="m-0 mt-2 text-[15.5px] leading-relaxed text-[var(--coach-ink-secondary)]">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <Section
        id="memory"
        title="Why cards come back when they do."
        lead={`Reading a lesson once feels like knowing it. A month later, most of it is gone. Practice shows each of its ${stats.cards} cards again just as your recall would drop to about 90%, which is when a review does the most good for the least time.`}
      >
        <ForgettingChart />
        <ul className="m-0 mt-6 flex list-none flex-col gap-3 p-0">
          {RESEARCH.map((r) => (
            <li key={r.finding} className="border-l-4 border-[var(--coach-chart-kept)] pl-4">
              <p className="m-0 text-[16px] font-semibold leading-snug">{r.finding}</p>
              <p className="m-0 mt-0.5 text-[13.5px] text-[var(--coach-ink-muted)]">{r.source}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="goal"
        title="One goal a day, one streak."
        lead="Pick how much you want to do each day; your Today page turns it into a short checklist. Your streak counts the days you finish a lesson, nothing else."
      >
        <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-3">
          {goals.map(([goal, plan]) => (
            <li key={goal} className={`${CARD} p-5`}>
              <p className="m-0 text-[18px] font-bold">{plan.label}</p>
              <p className="m-0 mt-1 text-[15px] text-[var(--coach-ink-secondary)]">{plan.plan}</p>
              <p className="m-0 mt-3 text-[13px] text-[var(--coach-ink-muted)]">
                {plan.review ? `Reviews ${plan.cards}` : "Reviews when you want"}
              </p>
            </li>
          ))}
        </ul>
        <p className={`${LEAD} mt-5 text-[16px]`}>
          Change it whenever you like in Settings. Missing a day ends a streak, and the next lesson starts a new one.
        </p>
      </Section>

      <Section
        id="earn"
        title="What you earn, and how."
        lead="Nothing is handed out for showing up. Every mark on your profile is earned by something you did."
      >
        <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2">
          {[
            ["A badge for each topic", "Finish every lesson in a topic, and its badge is yours."],
            ["A clan crest", "Each topic has its own original crest, worn by everyone who finished it."],
            ["Project badges", "Build the half-adder or ship ShellForge and it shows, with a link to your code."],
            [
              "Titles",
              "Every lesson, review and project is a task ranked D to S. Do enough of them and your title rises, from Genin up.",
            ],
          ].map(([title, body]) => (
            <li key={title} className={`${CARD} p-5`}>
              <p className="m-0 text-[17px] font-bold">{title}</p>
              <p className="m-0 mt-1 text-[15px] leading-relaxed text-[var(--coach-ink-secondary)]">{body}</p>
            </li>
          ))}
        </ul>
        <p className="m-0 mt-5 text-[15px] text-[var(--coach-ink-secondary)]">
          Want to feel it first?{" "}
          <Link href={FIRST_LESSON_HREF} className="font-semibold text-[var(--coach-ink)] underline underline-offset-2">
            Read the first lesson
          </Link>{" "}
          and answer its questions. It takes four minutes.
        </p>
      </Section>

      <StartBand />
    </SiteShell>
  );
}
