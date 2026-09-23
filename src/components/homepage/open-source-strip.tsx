import { landingEyebrowClass } from "./landing-styles";

const POINTS = [
  "Every lesson readable without an account",
  "Free forever — sign in only to save progress",
  "No investors, no unlock walls, no growth theater",
];

/**
 * Quiet honesty bridge before the final CTA.
 * Stays in the light Phosphor page — not a dark chapter of its own.
 */
export function OpenSourceStrip() {
  return (
    <section id="open" className="scroll-mt-[88px] overflow-x-clip bg-landing-tint py-14 sm:py-16">
      <div className="animate-rise mx-auto w-full min-w-0 max-w-3xl px-5 text-center sm:px-8">
        <div className={landingEyebrowClass}>Open by design</div>
        <h2 className="mb-3.5 font-display text-[clamp(1.6rem,4vw,2rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-ink text-balance">
          No gatekeeping.
        </h2>
        <p className="mx-auto mb-8 max-w-md text-[15.5px] leading-relaxed text-ink-secondary text-pretty sm:text-[17px]">
          The material comes first. Accounts only save progress — they never unlock it.
        </p>

        <ul className="grid min-w-0 grid-cols-1 divide-y divide-card-border border-y border-card-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {POINTS.map((line) => (
            <li
              key={line}
              className="flex min-w-0 items-center justify-center px-4 py-4 text-[13px] leading-snug text-ink-secondary text-pretty sm:px-5 sm:text-[13.5px]"
            >
              {line}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
