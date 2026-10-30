"use client";

import { useState } from "react";
import { saveProjectLinkAction } from "@/lib/profile/actions";
import { FIELD } from "./styles";
import { useProfileAction } from "./use-profile-action";

export function ProjectLinkForm({
  projectId,
  badgeLabel,
  onCancel,
}: {
  projectId: string;
  badgeLabel: string | null;
  onCancel?: () => void;
}) {
  const { pending, error, run } = useProfileAction();
  const [url, setUrl] = useState("");
  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        run(() => saveProjectLinkAction(projectId, url));
      }}
    >
      <label className="flex flex-col gap-1.5 text-[13px] font-semibold">
        Link your repo
        <input
          autoFocus={Boolean(onCancel)}
          required
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="github.com/you/project"
          className={FIELD}
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="h-9 rounded-lg bg-[var(--coach-lime)] px-4 text-[13px] font-bold text-[var(--coach-lime-ink)] shadow-[0_3px_0_var(--coach-lime-shadow)] disabled:opacity-60"
      >
        {badgeLabel ? `Ship it and earn ${badgeLabel}` : "Ship it"}
      </button>
      {onCancel ? (
        <button
          type="button"
          onClick={onCancel}
          className="h-8 text-[13px] font-semibold text-[var(--coach-ink-secondary)] hover:text-[var(--coach-ink)]"
        >
          Cancel
        </button>
      ) : null}
      {error ? (
        <p role="alert" className="m-0 text-[13px] text-[var(--coach-wrong-ink)]">
          {error}
        </p>
      ) : null}
    </form>
  );
}
