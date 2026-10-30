"use client";

import { useEffect, useId, useState } from "react";
import { Check } from "lucide-react";
import { patchProfileSettingsAction } from "@/lib/progress/actions";
import {
  SettingsBlock,
  SettingsField,
  SettingsSaveBar,
  SettingsToggle,
  settingsInputClass,
} from "@/components/settings/settings-field";
import { cn } from "@/lib/cn";
import { savePracticeDailyGoalAction } from "@/lib/practice/actions";
import {
  DAILY_GOALS,
  GOAL_PLANS,
  paceForGoal,
  readDailyGoal,
  writeDailyGoal,
  type DailyGoal,
} from "@/lib/practice/daily-goal";

/** The one daily goal: it sizes the dashboard's checklist and Practice's card target. */
const GOALS = DAILY_GOALS.map(({ value }) => ({ value, ...GOAL_PLANS[value] }));

export function PreferencesSettingsForm({
  initialGoal,
  initialReminderTime,
  initialNotifStreakReminders,
  initialNotifWeeklyRecap,
  initialNotifPeerSolutions,
  initialNotifProductUpdates,
  signedIn,
}: {
  initialGoal: DailyGoal;
  initialReminderTime: string;
  initialNotifStreakReminders: boolean;
  initialNotifWeeklyRecap: boolean;
  initialNotifPeerSolutions: boolean;
  initialNotifProductUpdates: boolean;
  signedIn: boolean;
}) {
  const reminderId = useId();
  const [goal, setGoal] = useState<DailyGoal>(initialGoal);
  // Guests keep their goal in this browser.
  useEffect(() => {
    if (signedIn) return;
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) setGoal(readDailyGoal(null));
    });
    return () => {
      cancelled = true;
    };
  }, [signedIn]);
  const [reminderTime, setReminderTime] = useState(initialReminderTime);
  const [notifStreakReminders, setNotifStreakReminders] = useState(
    initialNotifStreakReminders,
  );
  const [notifWeeklyRecap, setNotifWeeklyRecap] = useState(
    initialNotifWeeklyRecap,
  );
  const [notifPeerSolutions, setNotifPeerSolutions] = useState(
    initialNotifPeerSolutions,
  );
  const [notifProductUpdates, setNotifProductUpdates] = useState(
    initialNotifProductUpdates,
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    if (!signedIn || saving) return;
    setSaving(true);
    setError(null);
    setSaved(false);
    const [result] = await Promise.all([
      patchProfileSettingsAction({
        pace: paceForGoal(goal),
      reminderTime,
      notifStreakReminders,
      notifWeeklyRecap,
      notifPeerSolutions,
      notifProductUpdates,
      }),
      savePracticeDailyGoalAction(goal),
    ]);
    setSaving(false);
    if (result.ok) {
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2200);
    } else {
      setError(result.error);
    }
  }

  const notifs = [
    {
      on: notifStreakReminders,
      set: setNotifStreakReminders,
      label: "Streak reminders",
      desc: "A quiet nudge when your daily streak is at risk.",
      id: "notif-streak",
    },
    {
      on: notifWeeklyRecap,
      set: setNotifWeeklyRecap,
      label: "Weekly progress recap",
      desc: "Sunday summary of lessons you completed.",
      id: "notif-weekly",
    },
    {
      on: notifPeerSolutions,
      set: setNotifPeerSolutions,
      label: "Project solution alerts",
      desc: "When peers publish solutions to projects you finished.",
      id: "notif-peers",
    },
    {
      on: notifProductUpdates,
      set: setNotifProductUpdates,
      label: "Product updates",
      desc: "New levels, features, and curriculum additions.",
      id: "notif-product",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <SettingsBlock
        title="Daily goal"
        description="What a day takes. It sets your checklist on the dashboard; a lesson a day keeps your streak."
      >
        <div
          className="grid grid-cols-1 gap-2.5 sm:grid-cols-3"
          role="radiogroup"
          aria-label="Daily goal"
        >
          {GOALS.map((p) => {
            const selected = goal === p.value;
            return (
              <button
                key={p.value}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => {
                  setGoal(p.value);
                  // Guests keep their goal in this browser; signed-in learners save it below.
                  if (!signedIn) writeDailyGoal(null, p.value);
                }}
                className={cn(
                  "relative rounded-[14px] border px-3.5 py-3.5 text-left transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-violet/35 focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
                  "disabled:cursor-not-allowed disabled:opacity-50",
                  selected
                    ? "border-xp-border bg-xp-bg"
                    : "border-divider bg-paper hover:border-xp-border/50 hover:bg-elevated/40",
                )}
              >
                {selected ? (
                  <Check
                    size={14}
                    className="absolute right-2.5 top-2.5 text-xp-text"
                    strokeWidth={3}
                    aria-hidden
                  />
                ) : null}
                <div
                  className={cn(
                    "font-display text-[15px] font-extrabold",
                    selected ? "text-xp-text" : "text-ink",
                  )}
                >
                  {p.label}
                </div>
                <div className="mt-0.5 font-mono text-[11px] text-ink-fainter">
                  {p.cards}
                </div>
                <div className="mt-1.5 text-[12px] leading-snug text-ink-secondary">
                  {p.plan}
                </div>
              </button>
            );
          })}
        </div>
      </SettingsBlock>

      <SettingsBlock
        title="Reminder"
        description="We’ll use this when email or push reminders ship."
      >
        <SettingsField label="Time" htmlFor={reminderId}>
          <input
            id={reminderId}
            type="time"
            value={reminderTime}
            disabled={!signedIn}
            onChange={(e) => setReminderTime(e.target.value)}
            className={cn(settingsInputClass, "w-full max-w-[180px]")}
          />
        </SettingsField>
      </SettingsBlock>

      <SettingsBlock
        title="Notifications"
        description="Saved as preferences for later — delivery isn’t wired yet."
      >
        <div className="overflow-hidden rounded-[14px] border border-divider">
          {notifs.map((n, i) => (
            <div
              key={n.id}
              className={cn(
                "flex items-center gap-4 px-4 py-3.5",
                i < notifs.length - 1 && "border-b border-divider",
              )}
            >
              <div className="min-w-0 flex-1">
                <div
                  id={n.id}
                  className="text-[14px] font-semibold text-ink"
                >
                  {n.label}
                </div>
                <div className="mt-0.5 text-[12.5px] leading-snug text-ink-fainter">
                  {n.desc}
                </div>
              </div>
              <SettingsToggle
                on={n.on}
                disabled={!signedIn}
                labelledBy={n.id}
                onClick={() => n.set((v) => !v)}
              />
            </div>
          ))}
        </div>
      </SettingsBlock>

      <SettingsSaveBar
        error={error}
        saved={saved}
        saving={saving}
        disabled={!signedIn}
        label="Update preferences"
        onSave={save}
      />
    </div>
  );
}
