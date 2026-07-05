"use client";

import { useState } from "react";
import { User, Target, Bell, Palette, ShieldAlert, Check } from "lucide-react";
import { LabeledSidebar } from "@/components/ui/labeled-sidebar";
import { AppTopbar } from "@/components/ui/app-topbar";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

const SECTIONS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "goals", label: "Learning goals", icon: Target },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "danger", label: "Privacy", icon: ShieldAlert },
];

const PACES = [
  { id: "casual", label: "Casual", meta: "1 concept / day" },
  { id: "regular", label: "Regular", meta: "3 concepts / day" },
  { id: "intense", label: "Intense", meta: "5 concepts / day" },
];

const THEMES = ["Light", "Dark", "System"] as const;
const ACCENTS = ["#6D46F2", "#C13AE0", "#FF6B4A", "#12B981", "#2F6BFF"];

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex h-[26px] w-[44px] flex-none items-center rounded-full p-[3px] transition-colors",
        on ? "justify-end bg-gradient-to-r from-[#7B4DFF] to-[#C13AE0]" : "justify-start bg-[#DCD7E8]",
      )}
    >
      <span className="h-5 w-5 rounded-full bg-white shadow-[0_2px_5px_rgba(0,0,0,0.2)]" />
    </button>
  );
}

export default function SettingsPage() {
  const [name, setName] = useState("Amine El Khaldi");
  const [username, setUsername] = useState("amine");
  const [email, setEmail] = useState("amine@example.com");
  const [bio, setBio] = useState("Learning how computers really work, bottom-up. Currently deep in C & systems.");
  const [pace, setPace] = useState("regular");
  const [reminderTime, setReminderTime] = useState("7:30 PM");
  const [notifs, setNotifs] = useState({
    streakReminders: true,
    weeklyRecap: true,
    peerSolutions: false,
    productUpdates: false,
  });
  const [theme, setTheme] = useState<(typeof THEMES)[number]>("Light");
  const [accent, setAccent] = useState(ACCENTS[0]);
  const [saved, setSaved] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"reset" | "delete" | null>(null);

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }

  return (
    <div className="flex min-h-screen bg-radial-wash text-ink">
      <LabeledSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar />
        <main className="flex-1 px-5 py-8 sm:px-10">
          <div className="mx-auto w-full max-w-[1080px]">
            <div className="mb-1.5 font-mono text-xs text-ink-secondary">
              You / <span className="text-brand-violet">Settings</span>
            </div>
            <h1 className="mb-6 font-display text-[28px] font-extrabold tracking-[-0.032em] sm:text-[32px]">
              Settings
            </h1>

            <div className="flex flex-wrap items-start gap-7">
              <aside className="sticky top-24 w-full max-w-[240px] flex-1 basis-[210px]">
                <Card hover={false} className="p-2.5">
                  {SECTIONS.map((s) => (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-ink-secondary transition-colors hover:bg-[#F3F1FB]"
                    >
                      <s.icon size={16} strokeWidth={2.1} />
                      {s.label}
                    </a>
                  ))}
                </Card>
              </aside>

              <div className="flex min-w-0 flex-[100_1_480px] flex-col gap-6">
                <Card id="profile" hover={false} className="p-6.5 scroll-mt-24">
                  <div className="mb-5">
                    <div className="font-display text-lg font-extrabold">Profile</div>
                    <div className="mt-0.5 text-[13px] text-ink-muted">
                      How you appear across Ascend and on your public page.
                    </div>
                  </div>
                  <div className="mb-5.5 flex items-center gap-4.5 border-b border-[#F2F0F8] pb-5.5">
                    <div className="flex h-[72px] w-[72px] flex-none items-center justify-center rounded-2xl bg-gradient-to-br from-[#7B4DFF] via-[#C13AE0] to-[#FF6B4A] font-display text-[30px] font-extrabold text-white shadow-[0_10px_24px_rgba(123,77,255,0.4)]">
                      A
                    </div>
                    <div className="flex-1">
                      <div className="mb-0.5 text-sm font-bold">Profile photo</div>
                      <div className="mb-2.5 text-xs text-ink-muted">PNG or JPG, up to 2MB.</div>
                      <div className="flex gap-2">
                        <button className="rounded-lg bg-[#181528] px-4 py-2 text-[13px] font-bold text-white">
                          Upload
                        </button>
                        <button className="rounded-lg border border-[#E9E5F4] px-4 py-2 text-[13px] font-bold text-ink-secondary">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-[12.5px] font-bold text-ink-secondary">Full name</label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-[11px] border border-[#E4E1EE] bg-[#FBFAFE] px-3.5 py-3 text-[14.5px] text-[#2A2540] outline-none focus:border-[#B79AF2] focus:ring-[3px] focus:ring-[#7B4DFF]/[0.14]"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[12.5px] font-bold text-ink-secondary">Username</label>
                      <div className="flex items-center overflow-hidden rounded-[11px] border border-[#E4E1EE] bg-[#FBFAFE]">
                        <span className="pl-3.5 font-mono text-sm text-ink-faint">@</span>
                        <input
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="flex-1 bg-transparent px-1.5 py-3 text-[14.5px] text-[#2A2540] outline-none"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="mb-1.5 block text-[12.5px] font-bold text-ink-secondary">Email</label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-[11px] border border-[#E4E1EE] bg-[#FBFAFE] px-3.5 py-3 text-[14.5px] text-[#2A2540] outline-none focus:border-[#B79AF2] focus:ring-[3px] focus:ring-[#7B4DFF]/[0.14]"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[12.5px] font-bold text-ink-secondary">Bio</label>
                    <textarea
                      rows={3}
                      value={bio}
                      maxLength={160}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full resize-y rounded-[11px] border border-[#E4E1EE] bg-[#FBFAFE] px-3.5 py-3 text-[14.5px] leading-relaxed text-[#2A2540] outline-none focus:border-[#B79AF2] focus:ring-[3px] focus:ring-[#7B4DFF]/[0.14]"
                    />
                    <div className="mt-1.5 text-right font-mono text-[11.5px] text-ink-faint">{bio.length} / 160</div>
                  </div>
                </Card>

                <Card id="goals" hover={false} className="p-6.5 scroll-mt-24">
                  <div className="mb-5">
                    <div className="font-display text-lg font-extrabold">Learning goals</div>
                    <div className="mt-0.5 text-[13px] text-ink-muted">
                      Set the pace that keeps your streak alive without burning out.
                    </div>
                  </div>
                  <div className="mb-5">
                    <label className="mb-2 block text-[12.5px] font-bold text-ink-secondary">Daily goal</label>
                    <div className="grid grid-cols-3 gap-2.5">
                      {PACES.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => setPace(p.id)}
                          className={cn(
                            "relative rounded-[13px] border-[1.5px] p-3.5 text-center transition-transform hover:-translate-y-0.5",
                            pace === p.id ? "border-[#C13AE0] bg-[#FBF3FE]" : "border-[#E9E5F4] bg-white",
                          )}
                        >
                          {pace === p.id && (
                            <Check size={15} className="absolute right-2 top-2 text-[#C13AE0]" strokeWidth={3} />
                          )}
                          <div className={cn("font-display text-[15px] font-extrabold", pace === p.id ? "text-[#5A32D6]" : "text-[#2A2540]")}>
                            {p.label}
                          </div>
                          <div className="mt-0.5 font-mono text-[11.5px] text-ink-muted">{p.meta}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[12.5px] font-bold text-ink-secondary">Reminder time</label>
                    <div className="flex items-center gap-2.5">
                      <input
                        value={reminderTime}
                        onChange={(e) => setReminderTime(e.target.value)}
                        className="w-[140px] rounded-[11px] border border-[#E4E1EE] bg-[#FBFAFE] px-3.5 py-3 text-[14.5px] text-[#2A2540] outline-none focus:border-[#B79AF2]"
                      />
                      <span className="text-[13px] text-ink-muted">
                        We&apos;ll nudge you if you haven&apos;t studied by then.
                      </span>
                    </div>
                  </div>
                </Card>

                <Card id="notifications" hover={false} className="p-6.5 scroll-mt-24">
                  <div className="mb-5 font-display text-lg font-extrabold">Notifications</div>
                  {[
                    { key: "streakReminders" as const, label: "Streak reminders", desc: "A gentle nudge when your daily streak is at risk." },
                    { key: "weeklyRecap" as const, label: "Weekly progress recap", desc: "A Sunday summary of XP, concepts and badges earned." },
                    { key: "peerSolutions" as const, label: "New solutions on passed projects", desc: "When peers publish notable solutions to projects you finished." },
                    { key: "productUpdates" as const, label: "Product updates", desc: "New levels, features and curriculum additions." },
                  ].map((n, i, arr) => (
                    <div
                      key={n.key}
                      className={cn("flex items-center gap-4 py-4", i < arr.length - 1 && "border-b border-[#F2F0F8]")}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-[14.5px] font-semibold text-[#2A2540]">{n.label}</div>
                        <div className="mt-0.5 text-[12.5px] leading-relaxed text-ink-muted">{n.desc}</div>
                      </div>
                      <Toggle on={notifs[n.key]} onClick={() => setNotifs((prev) => ({ ...prev, [n.key]: !prev[n.key] }))} />
                    </div>
                  ))}
                </Card>

                <Card id="appearance" hover={false} className="p-6.5 scroll-mt-24">
                  <div className="mb-5">
                    <div className="font-display text-lg font-extrabold">Appearance</div>
                    <div className="mt-0.5 text-[13px] text-ink-muted">
                      Choose how Ascend looks.{" "}
                      <span className="rounded-full bg-[#F3F1F8] px-2 py-0.5 font-mono text-[11px] text-ink-faint">
                        Dark mode isn&apos;t built in this preview yet
                      </span>
                    </div>
                  </div>
                  <div className="mb-5 grid grid-cols-3 gap-3">
                    {THEMES.map((t) => (
                      <button
                        key={t}
                        onClick={() => setTheme(t)}
                        className={cn(
                          "rounded-[15px] border-[1.5px] bg-white p-1.5 transition-transform hover:-translate-y-0.5",
                          theme === t ? "border-[#C13AE0]" : "border-[#E9E5F4]",
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-[70px] gap-1.5 overflow-hidden rounded-[11px] border border-black/[0.06] p-2",
                            t === "Dark" ? "bg-[#1B1730]" : t === "System" ? "bg-gradient-to-br from-[#F1F0F7] from-50% to-[#1B1730] to-50%" : "bg-[#F1F0F7]",
                          )}
                        >
                          <div className={cn("w-[18px] rounded", t === "Dark" ? "bg-[#2C2548]" : "bg-white/90")} />
                          <div className="flex flex-1 flex-col justify-center gap-1">
                            <div className={cn("h-[7px] w-[70%] rounded", t === "Dark" ? "bg-[#C6A6FF]" : "bg-[#7B4DFF]")} />
                            <div className="h-[5px] w-[90%] rounded bg-[rgba(128,128,128,0.3)]" />
                            <div className="h-[5px] w-[60%] rounded bg-[rgba(128,128,128,0.25)]" />
                          </div>
                        </div>
                        <div className={cn("flex items-center justify-center gap-1.5 py-2 text-[13px] font-bold", theme === t ? "text-[#5A32D6]" : "text-[#2A2540]")}>
                          {theme === t && <Check size={13} strokeWidth={3} className="text-[#C13AE0]" />}
                          {t}
                        </div>
                      </button>
                    ))}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[12.5px] font-bold text-ink-secondary">Accent color</label>
                    <div className="flex gap-2.5">
                      {ACCENTS.map((c) => (
                        <button
                          key={c}
                          onClick={() => setAccent(c)}
                          style={{ background: c, boxShadow: accent === c ? `0 0 0 2px #fff, 0 0 0 4px ${c}` : undefined }}
                          className="h-[34px] w-[34px] rounded-[10px]"
                        />
                      ))}
                    </div>
                  </div>
                </Card>

                <Card id="danger" hover={false} className="border-[#F6D9D6] p-6.5 shadow-[0_8px_24px_rgba(213,52,43,0.06)] scroll-mt-24">
                  <div className="mb-1.5 flex items-center gap-2">
                    <ShieldAlert size={18} className="text-[#D5342B]" strokeWidth={2.2} />
                    <div className="font-display text-lg font-extrabold text-[#C22D24]">Danger zone</div>
                  </div>
                  <div className="mb-4.5 text-[13px] text-ink-muted">
                    Irreversible actions. Your progress, XP and badges can&apos;t be recovered.
                  </div>
                  <div className="flex items-center gap-4 border-b border-[#F7ECEB] py-4">
                    <div className="flex-1">
                      <div className="text-[14.5px] font-semibold text-[#2A2540]">Reset all progress</div>
                      <div className="mt-0.5 text-xs text-ink-muted">
                        Wipe XP, streaks and completed concepts — keep your account.
                      </div>
                    </div>
                    <button
                      onClick={() => setConfirmAction("reset")}
                      className="whitespace-nowrap rounded-lg border border-[#F0C4C0] px-4 py-2 text-[13px] font-bold text-[#C22D24]"
                    >
                      Reset
                    </button>
                  </div>
                  <div className="flex items-center gap-4 pt-4">
                    <div className="flex-1">
                      <div className="text-[14.5px] font-semibold text-[#2A2540]">Delete account</div>
                      <div className="mt-0.5 text-xs text-ink-muted">Permanently remove your account and all data.</div>
                    </div>
                    <button
                      onClick={() => setConfirmAction("delete")}
                      className="whitespace-nowrap rounded-lg bg-[#D5342B] px-4 py-2 text-[13px] font-bold text-white shadow-[0_8px_18px_rgba(213,52,43,0.3)]"
                    >
                      Delete
                    </button>
                  </div>
                  {confirmAction && (
                    <div className="mt-4 rounded-xl border border-[#F0C4C0] bg-[#FFF7F5] p-4 text-[13px] leading-relaxed text-[#8A3A32]">
                      This is a demo preview with a single fixed account and no real backend — there&apos;s nothing to{" "}
                      {confirmAction === "reset" ? "reset" : "delete"} here. In a real deployment, this would{" "}
                      {confirmAction === "reset" ? "wipe your XP, streaks and completed concepts" : "permanently delete your account"}
                      .
                      <button onClick={() => setConfirmAction(null)} className="ml-2 font-bold text-[#C22D24] underline">
                        Dismiss
                      </button>
                    </div>
                  )}
                </Card>

                <div className="flex items-center justify-end gap-3">
                  {saved && <span className="text-sm font-semibold text-[#12A472]">Saved (this session only)</span>}
                  <button
                    onClick={save}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#7B4DFF] to-[#C13AE0] px-6.5 py-3 text-sm font-bold text-white shadow-[0_12px_28px_rgba(123,77,255,0.36)] transition-transform hover:-translate-y-0.5"
                  >
                    <Check size={16} strokeWidth={2.4} />
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
