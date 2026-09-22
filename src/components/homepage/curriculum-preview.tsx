import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "./section-heading";
import { SectionBand } from "./section-band";
import { CURRICULUM_HREF } from "@/lib/routes";

const LEVELS = [
  {
    id: "level-00-bits-logic",
    num: "00",
    bg: "bg-level-00",
    name: "Bits & Logic",
    tag: "The Groundwork",
    topics: ["Binary & number bases", "Logic gates", "The fetch–execute loop"],
  },
  {
    id: "level-01-machine-memory",
    num: "01",
    bg: "bg-level-01",
    name: "Machine & Memory",
    tag: "The Machine",
    topics: ["Registers & assembly", "The stack & heap", "Caches & locality"],
  },
  {
    id: "level-02-the-c-language",
    num: "02",
    bg: "bg-level-02",
    name: "The C Language",
    tag: "The Craft",
    topics: ["Pointers & memory", "Structs & unions", "malloc & free"],
  },
  {
    id: "level-03-systems-software",
    num: "03",
    bg: "bg-level-03",
    name: "Systems & Software",
    tag: "The Architect",
    topics: ["Processes & syscalls", "Pipes & IPC", "Signals"],
  },
];

export function CurriculumPreview() {
  return (
    <SectionBand id="path" tone="wash">
      <SectionHeading
        eyebrow="The path"
        title="From a single bit to a working shell."
        subtitle="A recommended order, not a locked one — start anywhere."
      />
      <p className="mb-8 text-center font-mono text-[13px] text-ink-muted">
        4 levels · 24 lessons · 1 capstone
      </p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {LEVELS.map((level, i) => (
          <Link
            href={`${CURRICULUM_HREF}#${level.id}`}
            key={level.num}
            className="animate-rise rounded-[20px] border border-card-border bg-white p-6 shadow-card-rest transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover"
            style={{ animationDelay: `${i * 0.06}s` }}
          >
            <div className="mb-4 flex items-center justify-between">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-[14px] ${level.bg} font-display text-[19px] font-extrabold text-white shadow-[0_8px_18px_rgba(0,0,0,0.12)]`}
              >
                {level.num}
              </div>
              <span className="font-mono text-[10.5px] tracking-[0.06em] text-ink-fainter">
                LEVEL {level.num}
              </span>
            </div>
            <h3 className="mb-0.5 font-display text-[19px] font-bold">{level.name}</h3>
            <div className="mb-4 text-[12.5px] text-ink-muted">{level.tag}</div>
            <div className="flex flex-col gap-2">
              {level.topics.map((topic) => (
                <div key={topic} className="flex items-center gap-2 text-[13px] text-[#55516A]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C13AE0" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="flex-none">
                    <path d="m9 6 6 6-6 6" />
                  </svg>
                  {topic}
                </div>
              ))}
            </div>
          </Link>
        ))}
      </div>
      <div className="animate-rise mt-8 text-center">
        <Button href={CURRICULUM_HREF} variant="secondary" size="lg">
          See the full curriculum
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6D46F2" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </Button>
      </div>
    </SectionBand>
  );
}
