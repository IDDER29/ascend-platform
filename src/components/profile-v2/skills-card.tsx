import { Check } from "lucide-react";
import type { ProfileSkill } from "@/lib/profile/profile-model";
import { CARD } from "./styles";

const STATE_LABEL: Record<ProfileSkill["state"], string> = { done: "Done", current: "In progress", next: "Next" };

export function SkillsCard({ skills, owner }: { skills: ProfileSkill[]; owner: boolean }) {
  return (
    <section aria-labelledby="skills-title" className={`${CARD} sm:p-6`}>
      <div className="flex flex-col gap-1">
        <h2 id="skills-title" className="m-0 text-lg font-semibold">
          What {owner ? "I" : "they"} can do
        </h2>
        <p className="m-0 text-[13.5px] text-[var(--coach-ink-secondary)]">Each finished level, said as a skill.</p>
      </div>
      <ol className="m-0 flex list-none flex-col gap-0 p-0">
        {skills.map((skill) => (
          <li
            key={skill.levelNumber}
            className={`flex items-start gap-3 border-t border-[var(--coach-divider)] py-3 first:border-t-0 first:pt-0 last:pb-0 ${
              skill.state === "next" ? "opacity-55" : ""
            }`}
          >
            <span
              aria-hidden="true"
              className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg font-mono text-[12px] font-semibold ${
                skill.state === "done"
                  ? "bg-[var(--coach-hero-bg)] text-[var(--coach-lime)]"
                  : skill.state === "current"
                    ? "bg-[var(--coach-tint-blue-bg)] text-[var(--coach-tint-blue-ink)]"
                    : "border-2 border-dashed border-[var(--coach-border-strong)] text-[var(--coach-ink-muted)]"
              }`}
            >
              {skill.state === "done" ? <Check size={15} strokeWidth={3} /> : skill.levelNumber}
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="text-[14.5px] font-medium leading-snug">{skill.statement}</span>
              <span className="font-mono text-[12px] text-[var(--coach-ink-muted)]">
                L{skill.levelNumber} · {skill.levelName} · {STATE_LABEL[skill.state]}
                {skill.state === "current" ? ` · ${skill.done}/${skill.total}` : ""}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
