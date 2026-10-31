import type { JourneyEvent, JourneyKind } from "@/lib/profile/profile-model";
import { CARD, CARD_TITLE } from "./styles";

const DOT: Record<JourneyKind, string> = {
  project: "bg-[var(--coach-lime)] ring-2 ring-[var(--coach-lime-shadow)]",
  level: "bg-[var(--coach-blue)]",
  lesson: "bg-[var(--coach-scale-2)]",
  practice: "bg-[var(--coach-scale-2)]",
  joined: "border-2 border-[var(--coach-border-strong)] bg-[var(--coach-surface)]",
};

export function JourneyCard({ journey }: { journey: JourneyEvent[] }) {
  return (
    <section aria-labelledby="journey-title" className={CARD}>
      <h2 id="journey-title" className={CARD_TITLE}>
        Journey
      </h2>
      <ol className="m-0 flex list-none flex-col p-0">
        {journey.map((event, i) => (
          <li key={`${event.at}-${event.text}`} className="relative flex gap-3 pb-4 last:pb-0">
            {i < journey.length - 1 ? (
              <span aria-hidden="true" className="absolute left-[5px] top-4 h-[calc(100%-12px)] w-0.5 bg-[var(--coach-divider)]" />
            ) : null}
            <span aria-hidden="true" className={`mt-1 size-3 shrink-0 rounded-full ${DOT[event.kind]}`} />
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className="font-mono text-xs text-[var(--coach-ink-muted)]">{event.dateLabel}</span>
              <span className="text-[14px] font-medium">{event.text}</span>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
