"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { REQUIREMENTS } from "@/lib/projects/shellforge-brief-data";

const KEY = "ascend:shellforge-checklist";

/** Your own checklist of the shell's requirements, kept in this browser. Ticking checks nothing — it's for you. */
export function RequirementsChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      try {
        setChecked(JSON.parse(window.localStorage.getItem(KEY) ?? "{}") as Record<string, boolean>);
      } catch {
        // Nothing saved, or storage blocked.
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  function toggle(id: string) {
    const next = { ...checked, [id]: !checked[id] };
    setChecked(next);
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // Storage blocked: it just won't be remembered.
    }
  }

  const required = REQUIREMENTS.filter((r) => !r.bonus);
  const done = required.filter((r) => checked[r.id]).length;

  return (
    <div className="flex flex-col gap-3">
      <p className="m-0 text-[13px] text-[var(--coach-ink-muted)]">
        {done} of {required.length} required ticked · kept in this browser, for your own tracking
      </p>
      <ul className="m-0 flex list-none flex-col gap-1 p-0">
        {REQUIREMENTS.map((r) => (
          <li key={r.id}>
            <label className="-mx-2 flex cursor-pointer items-start gap-3 rounded-xl px-2 py-2 hover:bg-[var(--coach-tint-neutral-bg)]">
              <input
                type="checkbox"
                checked={Boolean(checked[r.id])}
                onChange={() => toggle(r.id)}
                className="peer sr-only"
              />
              <span
                aria-hidden
                className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border-2 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--coach-focus)] ${
                  checked[r.id]
                    ? "border-[var(--coach-ink)] bg-[var(--coach-ink)] text-[var(--coach-surface)]"
                    : "border-[var(--coach-border-strong)]"
                }`}
              >
                {checked[r.id] && <Check size={13} strokeWidth={3} />}
              </span>
              <span className="min-w-0">
                <span className="flex flex-wrap items-center gap-2 text-[15px] font-semibold leading-snug">
                  {r.title}
                  {r.bonus && (
                    <span className="rounded-full bg-[var(--coach-tint-lime-bg)] px-2 py-0.5 text-[11.5px] font-semibold text-[var(--coach-tint-lime-ink)]">
                      Bonus
                    </span>
                  )}
                </span>
                <span className="block text-[13.5px] leading-snug text-[var(--coach-ink-muted)]">{r.detail}</span>
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
