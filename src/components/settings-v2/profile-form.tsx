"use client";

import { useState } from "react";
import Link from "next/link";
import { Field, inputClass, LIME_BUTTON } from "@/components/forms/coach-fields";
import { patchProfileSettingsAction } from "@/lib/progress/actions";
import { SaveStatus } from "./settings-card";

const BIO_MAX = 160;
/** What the server keeps of a username (see updateProfileSettings). */
const cleanUsername = (raw: string) =>
  raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, "")
    .slice(0, 32);

type Status = { kind: "idle" | "saving" | "saved" } | { kind: "error"; message: string };

/** Name, username and bio: how you appear on your public profile. */
export function ProfileForm({ name: n0, username: u0, bio: b0 }: { name: string; username: string; bio: string }) {
  const [name, setName] = useState(n0);
  const [username, setUsername] = useState(u0);
  const [bio, setBio] = useState(b0);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [tried, setTried] = useState(false);
  // What's saved now: the page's values at first, then each successful save.
  const [savedAs, setSavedAs] = useState({ name: n0, username: u0, bio: b0 });
  const changed = name !== savedAs.name || username !== savedAs.username || bio !== savedAs.bio;
  const errors = {
    name: !name.trim() ? "Enter your name." : null,
    username: !cleanUsername(username) ? "Use letters, numbers, - or _." : null,
  };

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setTried(true);
    if (errors.name || errors.username) return;
    setStatus({ kind: "saving" });
    const result = await patchProfileSettingsAction({ name, username: cleanUsername(username), bio });
    if (result.ok) {
      setUsername(cleanUsername(username));
      setSavedAs({ name, username: cleanUsername(username), bio });
      setStatus({ kind: "saved" });
    } else setStatus({ kind: "error", message: result.error });
  }

  return (
    <form onSubmit={save} noValidate className="flex flex-col gap-4">
      <Field id="profile-name" label="Name" error={tried ? errors.name : null}>
        <input
          id="profile-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          aria-invalid={(tried && Boolean(errors.name)) || undefined}
          aria-describedby="profile-name-hint"
          className={inputClass(tried && Boolean(errors.name))}
        />
      </Field>
      <Field
        id="profile-username"
        label="Username"
        hint={
          <>
            Your public profile: <span className="font-mono text-[12.5px]">/u/{cleanUsername(username) || "…"}</span>
          </>
        }
        error={tried ? errors.username : null}
      >
        <input
          id="profile-username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoCapitalize="none"
          spellCheck={false}
          maxLength={32}
          aria-invalid={(tried && Boolean(errors.username)) || undefined}
          aria-describedby="profile-username-hint"
          className={inputClass(tried && Boolean(errors.username))}
        />
      </Field>
      <Field
        id="profile-bio"
        label="Bio"
        hint={`${bio.length}/${BIO_MAX}. A line about you, if you like.`}
        error={null}
      >
        <textarea
          id="profile-bio"
          value={bio}
          onChange={(e) => setBio(e.target.value.slice(0, BIO_MAX))}
          rows={3}
          aria-describedby="profile-bio-hint"
          className={`${inputClass()} h-auto min-h-24 py-3 leading-relaxed`}
        />
      </Field>
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={!changed || status.kind === "saving"}
          className={`${LIME_BUTTON} disabled:cursor-not-allowed`}
        >
          Save profile
        </button>
        <SaveStatus status={status} />
      </div>
      <p className="m-0 text-[14px] text-[var(--coach-ink-muted)]">
        Links, projects and who can see your profile are set on{" "}
        <Link href="/profile" className="font-semibold text-[var(--coach-ink)] underline underline-offset-2">
          your profile page
        </Link>
        .
      </p>
    </form>
  );
}
