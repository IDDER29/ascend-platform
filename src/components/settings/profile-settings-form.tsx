"use client";

import { useId, useState } from "react";
import { PlaceholderAvatar } from "@/components/ui/placeholder-avatar";
import { patchProfileSettingsAction } from "@/lib/progress/actions";
import {
  SettingsBlock,
  SettingsField,
  SettingsPanel,
  SettingsSaveBar,
  settingsInputClass,
} from "@/components/settings/settings-field";
import { cn } from "@/lib/cn";

export function ProfileSettingsForm({
  initialName,
  initialUsername,
  initialBio,
  signedIn,
}: {
  initialName: string;
  initialUsername: string;
  initialBio: string;
  signedIn: boolean;
}) {
  const nameId = useId();
  const userId = useId();
  const bioId = useId();
  const [name, setName] = useState(initialName);
  const [username, setUsername] = useState(initialUsername);
  const [bio, setBio] = useState(initialBio);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    if (!signedIn || saving) return;
    setSaving(true);
    setError(null);
    setSaved(false);
    const result = await patchProfileSettingsAction({ name, username, bio });
    setSaving(false);
    if (result.ok) {
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2200);
    } else {
      setError(result.error);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <SettingsPanel>
        <div className="flex items-center gap-4">
          <PlaceholderAvatar name={name || null} size="md" />
          <div className="min-w-0">
            <p className="text-[14px] font-semibold text-ink">Avatar</p>
            <p className="mt-0.5 text-[12.5px] leading-relaxed text-ink-fainter">
              Photos aren&apos;t wired yet. We show your initial on Profile and
              in the sidebar.
            </p>
          </div>
        </div>
      </SettingsPanel>

      <SettingsBlock>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SettingsField label="Full name" htmlFor={nameId}>
            <input
              id={nameId}
              value={name}
              disabled={!signedIn}
              autoComplete="name"
              onChange={(e) => setName(e.target.value)}
              className={settingsInputClass}
            />
          </SettingsField>
          <SettingsField
            label="Username"
            htmlFor={userId}
            hint="Letters, numbers, hyphens. Shown as @username."
          >
            <div className="flex items-center overflow-hidden rounded-[12px] border border-divider bg-paper focus-within:border-xp-border focus-within:ring-[3px] focus-within:ring-brand-violet/15">
              <span className="select-none pl-3.5 font-mono text-[13px] text-ink-fainter">
                @
              </span>
              <input
                id={userId}
                value={username}
                disabled={!signedIn}
                autoComplete="username"
                onChange={(e) => setUsername(e.target.value)}
                className="min-w-0 flex-1 bg-transparent px-1.5 py-2.5 text-[14.5px] text-ink outline-none disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
          </SettingsField>
        </div>

        <SettingsField label="Bio" htmlFor={bioId} className="mt-4">
          <textarea
            id={bioId}
            rows={4}
            value={bio}
            maxLength={160}
            disabled={!signedIn}
            onChange={(e) => setBio(e.target.value)}
            className={cn(settingsInputClass, "resize-y leading-relaxed")}
          />
          <div className="mt-1.5 flex items-center justify-between gap-3 text-[12.5px] text-ink-fainter">
            <span>Optional. Keep it short.</span>
            <span className="font-mono text-[11px] tabular-nums">
              {bio.length}/160
            </span>
          </div>
        </SettingsField>
      </SettingsBlock>

      <SettingsSaveBar
        error={error}
        saved={saved}
        saving={saving}
        disabled={!signedIn}
        label="Update profile"
        onSave={save}
      />
    </div>
  );
}
