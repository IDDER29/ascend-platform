"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

export interface RailItem {
  id: string;
  label: string;
}

export function OnThisPageRail({ items }: { items: RailItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "-88px 0px -70% 0px", threshold: 0 },
    );

    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [items]);

  return (
    <div className="mb-7 flex flex-col gap-px border-l-2 border-divider">
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={cn(
            "-ml-0.5 border-l-2 px-3 py-1.5 text-[13px] leading-snug transition-colors duration-150",
            activeId === item.id
              ? "border-brand-violet font-bold text-[#5A32D6]"
              : "border-transparent font-medium text-ink-muted hover:text-ink-secondary",
          )}
        >
          {item.label}
        </a>
      ))}
    </div>
  );
}
