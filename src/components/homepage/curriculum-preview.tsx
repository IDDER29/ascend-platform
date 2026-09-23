import { Button } from "@/components/ui/button";
import { SectionHeading } from "./section-heading";
import { SectionBand } from "./section-band";
import { CURRICULUM_HREF } from "@/lib/routes";
import { landingCardClass, landingCardTitleClass } from "./landing-styles";
import { cn } from "@/lib/cn";

const LEVELS = [
  {
    num: "00",
    bg: "bg-level-00",
    name: "Bits & Logic",
    tag: "The Groundwork",
    lessons: 6,
    topics: ["Binary & number bases", "Logic gates", "The fetch–execute loop"],
  },
  {
    num: "01",
    bg: "bg-level-01",
    name: "Machine & Memory",
    tag: "The Machine",
    lessons: 6,
    topics: ["Registers & assembly", "The stack & heap", "Caches & locality"],
  },
  {
    num: "02",
    bg: "bg-level-02",
    name: "The C Language",
    tag: "The Craft",
    lessons: 6,
    topics: ["Pointers & memory", "Structs & unions", "malloc & free"],
  },
  {
    num: "03",
    bg: "bg-level-03",
    name: "Systems & Software",
    tag: "The Architect",
    lessons: 6,
    topics: ["Processes & syscalls", "Pipes & IPC", "Signals"],
  },
];

function CurriculumArrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

/** Syllabus detail — cards display-only; primary CTA opens the map. */
export function CurriculumPreview() {
  return (
    <SectionBand id="path" tone="paper">
      <SectionHeading
        eyebrow="Inside the levels"
        title="What you'll actually study."
        subtitle="Each level is a short sequence of lessons. Order is recommended — every lesson stays open."
      />
      <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {LEVELS.map((level, i) => (
          <article
            key={level.num}
            className={landingCardClass}
            style={{ animationDelay: `${i * 0.06}s` }}
          >
            <div className="mb-4 flex min-w-0 items-center justify-between gap-2">
              <div
                className={cn(
                  "icon-tile font-display text-[16px] font-extrabold sm:text-[17px]",
                  level.bg,
                )}
              >
                {level.num}
              </div>
              <span className="shrink-0 font-mono text-[10.5px] text-ink-muted sm:text-[11px]">
                {level.lessons} lessons
              </span>
            </div>
            <h3 className={`mb-0.5 min-w-0 ${landingCardTitleClass}`}>{level.name}</h3>
            <div className="mb-4 text-[12.5px] text-ink-muted">{level.tag}</div>
            <ul className="mt-auto flex min-w-0 flex-col gap-2">
              {level.topics.map((topic) => (
                <li
                  key={topic}
                  className="flex min-w-0 items-start gap-2 text-[13px] leading-snug text-ink-secondary"
                >
                  <span
                    className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-brand-violet"
                    aria-hidden
                  />
                  <span className="min-w-0">{topic}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <div className="animate-rise mt-8 flex justify-center px-1 sm:mt-9">
        <Button href={CURRICULUM_HREF} size="lg" variant="secondary" className="w-full max-w-xs sm:w-auto sm:max-w-none">
          View full curriculum
          <CurriculumArrow />
        </Button>
      </div>
    </SectionBand>
  );
}
