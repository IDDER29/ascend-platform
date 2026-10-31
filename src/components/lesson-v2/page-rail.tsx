"use client";

import { useEffect, useState } from "react";

export type RailItem = { id: string; label: string };

/** "On this page": the section you're reading is the last one whose heading has scrolled past the top. */
export function PageRail({ items }: { items: RailItem[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let current: string | null = null;
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= 140) current = item.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [items]);

  return (
    <nav aria-label="On this page" className="flex flex-col border-l-2 border-[var(--coach-divider)]">
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          aria-current={active === item.id ? "location" : undefined}
          className={`-ml-0.5 border-l-2 px-3 py-1.5 text-[13px] leading-snug no-underline transition-colors ${
            active === item.id
              ? "border-[var(--coach-ink)] font-semibold text-[var(--coach-ink)]"
              : "border-transparent text-[var(--coach-ink-muted)] hover:text-[var(--coach-ink)]"
          }`}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
