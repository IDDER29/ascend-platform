import Link from "next/link";
import { CARD, LIME_BUTTON } from "./styles";

export function ContinueCard({ next }: { next: { title: string; href: string } }) {
  return (
    <section aria-labelledby="continue-title" className={CARD}>
      <h2 id="continue-title" className="m-0 font-mono text-xs font-normal uppercase tracking-[0.08em] text-[var(--coach-ink-muted)]">
        Continue
      </h2>
      <p className="m-0 text-[14.5px] font-semibold leading-snug">{next.title}</p>
      <Link href={next.href} className={`${LIME_BUTTON} w-full`}>
        Open lesson
      </Link>
    </section>
  );
}
