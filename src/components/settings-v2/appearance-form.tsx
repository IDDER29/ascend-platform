"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { Choice } from "@/components/forms/coach-fields";
import { getThemePreference, setThemePreference, type ThemePreference } from "@/components/site/theme-toggle";
import { patchProfileSettingsAction } from "@/lib/progress/actions";

const THEMES: { id: ThemePreference; label: string; hint: string; icon: typeof Sun }[] = [
  { id: "light", label: "Light", hint: "Dark text on a light page.", icon: Sun },
  { id: "dark", label: "Dark", hint: "Light text on a dark page.", icon: Moon },
  { id: "system", label: "System", hint: "Follows this device.", icon: Monitor },
];

/** Light, dark or the device's choice: applied at once, and remembered on your account when signed in. */
export function AppearanceForm({ signedIn }: { signedIn: boolean }) {
  const [theme, setTheme] = useState<ThemePreference | null>(null);
  useEffect(() => {
    // The stored choice lives in this browser; read it after mount.
    queueMicrotask(() => setTheme(getThemePreference()));
  }, []);

  function pick(next: ThemePreference) {
    setTheme(next);
    setThemePreference(next);
    if (signedIn)
      void patchProfileSettingsAction({ theme: next === "system" ? "System" : next === "dark" ? "Dark" : "Light" });
  }

  return (
    <fieldset className="m-0 border-0 p-0">
      <legend className="sr-only">Theme</legend>
      <div className="grid gap-3 lg:grid-cols-3">
        {THEMES.map((t) => (
          <Choice key={t.id} name="theme" value={t.id} checked={theme === t.id} onChange={() => pick(t.id)}>
            <t.icon size={20} strokeWidth={2.2} aria-hidden className="mt-0.5 shrink-0" />
            <span className="min-w-0 flex-1">
              <span className="block text-[17px] font-bold leading-tight">{t.label}</span>
              <span className="mt-1 block text-[14.5px] leading-snug text-[var(--coach-ink-secondary)]">{t.hint}</span>
            </span>
          </Choice>
        ))}
      </div>
    </fieldset>
  );
}
