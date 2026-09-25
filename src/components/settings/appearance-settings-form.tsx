"use client";

import { useEffect, useState } from "react";
import { Check, Monitor, Moon, Sun } from "lucide-react";
import {
  getThemePreference,
  setThemePreference,
  type ThemePreference,
} from "@/components/homepage/theme-toggle";
import { patchProfileSettingsAction } from "@/lib/progress/actions";
import { SettingsBlock } from "@/components/settings/settings-field";
import { cn } from "@/lib/cn";

const THEMES: {
  id: ThemePreference;
  label: string;
  hint: string;
  icon: typeof Sun;
}[] = [
  { id: "light", label: "Light", hint: "Mint paper desk", icon: Sun },
  { id: "dark", label: "Dark", hint: "Night study charcoal", icon: Moon },
  { id: "system", label: "System", hint: "Match this device", icon: Monitor },
];

export function AppearanceSettingsForm({ signedIn }: { signedIn: boolean }) {
  const [theme, setTheme] = useState<ThemePreference>("system");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setTheme(getThemePreference());
    setReady(true);
  }, []);

  function pick(next: ThemePreference) {
    setTheme(next);
    setThemePreference(next);
    if (signedIn) {
      void patchProfileSettingsAction({
        theme:
          next === "system" ? "System" : next === "dark" ? "Dark" : "Light",
      });
    }
  }

  return (
    <SettingsBlock
      title="Theme"
      description="Applies instantly — same control as the sidebar toggle."
    >
      <div
        className={cn(
          "grid grid-cols-1 gap-2.5 sm:grid-cols-3",
          !ready && "opacity-0",
        )}
        role="radiogroup"
        aria-label="Theme"
      >
        {THEMES.map((t) => {
          const selected = theme === t.id;
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => pick(t.id)}
              className={cn(
                "group flex flex-col overflow-hidden rounded-[16px] border text-left transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet/35 focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
                selected
                  ? "border-xp-border ring-1 ring-xp-border"
                  : "border-divider hover:border-xp-border/40 hover:bg-elevated/30",
              )}
            >
              <div
                className={cn(
                  "relative flex h-[76px] items-end gap-2 overflow-hidden border-b border-divider p-3",
                  t.id === "dark"
                    ? "bg-[#121816]"
                    : t.id === "system"
                      ? "bg-[linear-gradient(135deg,#eef3f0_0%,#eef3f0_48%,#121816_48%,#121816_100%)]"
                      : "bg-[#eef3f0]",
                )}
              >
                <div
                  className={cn(
                    "h-full w-4 rounded-md",
                    t.id === "dark" ? "bg-white/10" : "bg-white/90 shadow-sm",
                  )}
                />
                <div className="mb-1 flex flex-1 flex-col gap-1.5 pb-0.5">
                  <div className="h-1.5 w-[72%] rounded-full bg-[#0d9f6e]/80" />
                  <div
                    className={cn(
                      "h-1 w-full rounded-full",
                      t.id === "dark" ? "bg-white/20" : "bg-[#0f1a14]/20",
                    )}
                  />
                  <div
                    className={cn(
                      "h-1 w-[58%] rounded-full",
                      t.id === "dark" ? "bg-white/12" : "bg-[#0f1a14]/12",
                    )}
                  />
                </div>
                {selected ? (
                  <span className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-xp-bg text-xp-text">
                    <Check size={12} strokeWidth={3} aria-hidden />
                  </span>
                ) : null}
              </div>
              <div className="flex items-center gap-2.5 px-3.5 py-3">
                <Icon
                  size={15}
                  strokeWidth={2.1}
                  className={selected ? "text-xp-text" : "text-ink-fainter"}
                  aria-hidden
                />
                <div className="min-w-0">
                  <div
                    className={cn(
                      "text-[13.5px] font-bold",
                      selected ? "text-xp-text" : "text-ink",
                    )}
                  >
                    {t.label}
                  </div>
                  <div className="font-mono text-[10.5px] text-ink-fainter">
                    {t.hint}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </SettingsBlock>
  );
}
