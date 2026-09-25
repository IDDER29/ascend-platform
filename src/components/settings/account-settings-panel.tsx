"use client";

import { useId, useState } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOutAction } from "@/lib/auth/actions";
import {
  SettingsBlock,
  SettingsField,
  SettingsPanel,
  settingsInputClass,
} from "@/components/settings/settings-field";
import { cn } from "@/lib/cn";

export function AccountSettingsPanel({
  email,
  signedIn,
}: {
  email: string;
  signedIn: boolean;
}) {
  const emailId = useId();
  const [confirmAction, setConfirmAction] = useState<"reset" | "delete" | null>(
    null,
  );

  return (
    <div className="flex flex-col gap-8">
      <SettingsBlock
        title="Sign-in email"
        description="This is how you sign in. Changing it isn’t available yet."
      >
        <SettingsField label="Email" htmlFor={emailId}>
          <input
            id={emailId}
            value={signedIn ? email : ""}
            readOnly
            placeholder={signedIn ? undefined : "Sign in to see your email"}
            className={cn(
              settingsInputClass,
              "cursor-not-allowed bg-elevated/50 text-ink-fainter",
            )}
          />
        </SettingsField>
      </SettingsBlock>

      {signedIn ? (
        <SettingsBlock
          title="Session"
          description="Sign out on this device. Progress stays on your account."
        >
          <form action={signOutAction}>
            <Button type="submit" variant="secondary" size="sm">
              <LogOut size={15} strokeWidth={2.2} aria-hidden />
              Sign out
            </Button>
          </form>
        </SettingsBlock>
      ) : null}

      <SettingsPanel className="border-divider bg-paper">
        <div className="mb-4">
          <h3 className="font-display text-[15px] font-extrabold text-ink">
            Danger zone
          </h3>
          <p className="mt-0.5 text-[13px] leading-relaxed text-ink-fainter">
            These actions aren’t wired yet. When they are, they won’t be
            undoable.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[12px] border border-divider bg-elevated/40 px-4 py-3.5">
            <div className="min-w-0">
              <div className="text-[14px] font-semibold text-ink">
                Reset all progress
              </div>
              <div className="mt-0.5 text-[12.5px] text-ink-fainter">
                Clear streaks and completed lessons — keep the account.
              </div>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setConfirmAction("reset")}
              disabled={!signedIn}
            >
              Reset
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[12px] border border-divider bg-elevated/40 px-4 py-3.5">
            <div className="min-w-0">
              <div className="text-[14px] font-semibold text-ink">
                Delete account
              </div>
              <div className="mt-0.5 text-[12.5px] text-ink-fainter">
                Permanently remove your account and data.
              </div>
            </div>
            <Button
              type="button"
              variant="dark"
              size="sm"
              onClick={() => setConfirmAction("delete")}
              disabled={!signedIn}
            >
              Delete
            </Button>
          </div>
        </div>

        {confirmAction ? (
          <div className="mt-4 rounded-[12px] border border-divider bg-elevated/70 px-4 py-3 text-[13px] leading-relaxed text-ink-secondary">
            {confirmAction === "reset"
              ? "Reset all progress"
              : "Delete account"}{" "}
            isn’t available yet — nothing will change.
            <button
              type="button"
              onClick={() => setConfirmAction(null)}
              className="ml-2 font-bold text-brand-violet hover:underline"
            >
              Dismiss
            </button>
          </div>
        ) : null}
      </SettingsPanel>
    </div>
  );
}
