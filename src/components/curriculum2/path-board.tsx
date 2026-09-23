"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { LevelRegion } from "./level-region";
import type { Curriculum2LevelRegion } from "./types";

export function PathBoard({
  regions,
  currentLevel,
  currentOrder,
}: {
  regions: Curriculum2LevelRegion[];
  currentLevel: string;
  currentOrder: number;
}) {
  const [focusedId, setFocusedId] = useState<string | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setFocusedId(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="relative min-h-[min(70vh,720px)] flex-1">
      {/* soft spine */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-8 hidden h-[calc(100%-4rem)] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-divider to-transparent lg:block"
      />

      <div
        className={cn(
          "relative grid gap-4",
          "grid-cols-1 sm:grid-cols-2",
          focusedId ? "lg:grid-cols-1 lg:max-w-xl lg:mx-auto" : "lg:grid-cols-2",
        )}
        onClick={(e) => {
          if (e.target === e.currentTarget) setFocusedId(null);
        }}
      >
        {regions.map((region) => {
          const focused = focusedId === region.id;
          const dimmed = focusedId !== null && !focused;
          return (
            <LevelRegion
              key={region.id}
              region={region}
              focused={focused}
              dimmed={dimmed}
              isCurrentLevel={region.id === currentLevel}
              currentOrder={currentOrder}
              onFocus={() =>
                setFocusedId((prev) => (prev === region.id ? null : region.id))
              }
            />
          );
        })}
      </div>

      {focusedId ? (
        <button
          type="button"
          onClick={() => setFocusedId(null)}
          className="mt-4 text-[13px] font-medium text-ink-fainter hover:text-ink-secondary"
        >
          Back to full path
        </button>
      ) : null}
    </div>
  );
}
