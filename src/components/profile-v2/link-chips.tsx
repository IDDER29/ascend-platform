"use client";

import { Globe, Plus, X } from "lucide-react";
import { useState } from "react";
import type { LinkKind } from "@/lib/profile/links";
import { MAX_PROFILE_LINKS } from "@/lib/profile/links";
import { addProfileLinkAction, removeProfileLinkAction } from "@/lib/profile/actions";
import type { ProfileLink } from "@/lib/profile/profile-model";
import { useProfileAction } from "./use-profile-action";

const MARKS: Record<Exclude<LinkKind, "website">, string> = {
  github: "GH",
  gitlab: "GL",
  linkedin: "in",
  x: "X",
  youtube: "YT",
};

const CHIP =
  "inline-flex h-8 items-center gap-2 rounded-full bg-white/10 px-3 text-[13px] font-medium text-[var(--coach-hero-ink)] no-underline";

function Mark({ kind }: { kind: LinkKind }) {
  if (kind === "website") return <Globe size={14} aria-hidden="true" className="text-[var(--coach-hero-muted)]" />;
  return (
    <span aria-hidden="true" className="font-mono text-[11px] font-bold text-[var(--coach-lime)]">
      {MARKS[kind]}
    </span>
  );
}

export function LinkChips({ links, editable }: { links: ProfileLink[]; editable: boolean }) {
  const { pending, error, run } = useProfileAction();
  const [adding, setAdding] = useState(false);
  const [url, setUrl] = useState("");
  const [label, setLabel] = useState("");

  if (links.length === 0 && !editable) return null;

  return (
    <div className="flex flex-col gap-2">
      <ul aria-label="Links" className="m-0 flex list-none flex-wrap gap-2 p-0">
        {links.map((link) => (
          <li key={link.id} className="flex items-center">
            <a href={link.url} target="_blank" rel="noopener noreferrer nofollow ugc" className={CHIP}>
              <Mark kind={link.kind} />
              {link.label}
            </a>
            {editable ? (
              <button
                type="button"
                disabled={pending}
                aria-label={`Remove ${link.label}`}
                onClick={() => run(() => removeProfileLinkAction(link.id))}
                className="-ml-1 flex size-7 items-center justify-center rounded-full text-[var(--coach-hero-muted)] hover:text-[var(--coach-hero-ink)]"
              >
                <X size={13} aria-hidden="true" />
              </button>
            ) : null}
          </li>
        ))}
        {editable && !adding && links.length < MAX_PROFILE_LINKS ? (
          <li>
            <button
              type="button"
              onClick={() => setAdding(true)}
              className={`${CHIP} border border-dashed border-[var(--coach-hero-track)] bg-transparent text-[var(--coach-hero-muted)] hover:text-[var(--coach-hero-ink)]`}
            >
              <Plus size={14} aria-hidden="true" />
              {links.length === 0 ? "Add GitHub, LinkedIn or a site" : "Add link"}
            </button>
          </li>
        ) : null}
      </ul>
      {editable && adding ? (
        <form
          className="flex flex-col gap-2 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            run(() => addProfileLinkAction(url, label), () => {
              setAdding(false);
              setUrl("");
              setLabel("");
            });
          }}
        >
          <input
            autoFocus
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="github.com/you"
            aria-label="Link address"
            className="h-9 min-w-0 flex-1 rounded-lg border border-[var(--coach-hero-track)] bg-white/10 px-3 text-[13.5px] text-[var(--coach-hero-ink)] outline-none placeholder:text-[var(--coach-hero-muted)] focus:border-[var(--coach-lime)]"
          />
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Label (optional)"
            aria-label="Link label"
            className="h-9 min-w-0 rounded-lg border border-[var(--coach-hero-track)] bg-white/10 px-3 text-[13.5px] text-[var(--coach-hero-ink)] outline-none placeholder:text-[var(--coach-hero-muted)] focus:border-[var(--coach-lime)] sm:w-40"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={pending}
              className="h-9 rounded-lg bg-[var(--coach-lime)] px-4 text-[13px] font-bold text-[var(--coach-lime-ink)] disabled:opacity-60"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setAdding(false)}
              className="h-9 rounded-lg px-3 text-[13px] font-semibold text-[var(--coach-hero-muted)] hover:text-[var(--coach-hero-ink)]"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}
      {error ? (
        <p role="alert" className="m-0 text-[13px] text-[var(--coach-orange)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}
