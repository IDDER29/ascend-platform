"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/cn";

const STORAGE_KEY = "ascend-theme";

function applyTheme(mode: "light" | "dark") {
  document.documentElement.classList.toggle("dark", mode === "dark");
}

/**
 * Light / dark toggle — persists in localStorage, syncs the `dark` class on <html>.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const next =
      stored === "dark" || stored === "light"
        ? stored
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
    setMode(next);
    applyTheme(next);
    setReady(true);
  }, []);

  function toggle() {
    const next = mode === "dark" ? "light" : "dark";
    setMode(next);
    applyTheme(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-full border border-card-border bg-bg text-ink-secondary transition-colors hover:border-xp-border hover:bg-xp-bg hover:text-xp-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet/35 focus-visible:ring-offset-2",
        !ready && "opacity-0",
        className,
      )}
      aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={mode === "dark" ? "Light mode" : "Dark mode"}
    >
      {mode === "dark" ? <Sun size={16} strokeWidth={2.2} /> : <Moon size={16} strokeWidth={2.2} />}
    </button>
  );
}
