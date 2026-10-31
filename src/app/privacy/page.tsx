import type { Metadata } from "next";
import Link from "next/link";
import { LegalArticle } from "@/components/site/legal-article";
import { SiteShell } from "@/components/site/site-shell";
import { CONTENT_REPO_URL } from "@/lib/brand/repo";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What Ascend keeps about you, why, and how to delete it.",
};

export default function PrivacyPage() {
  return (
    <SiteShell>
      <LegalArticle title="Privacy" updated="30 October 2026">
        <section>
          <p>
            Ascend keeps as little as it can: what it needs to save your progress, and nothing to sell. There are no
            ads, no analytics and no trackers on the site.
          </p>
        </section>

        <section>
          <h2>Without an account</h2>
          <p>
            You can read every lesson and use Practice without signing up. What you do then (your Practice cards and
            history, bookmarks, answers to Check yourself, your theme and daily goal) is kept in your own browser&apos;s
            storage and never sent to us. Clearing your browser&apos;s site data removes it.
          </p>
        </section>

        <section>
          <h2>With an account</h2>
          <p>We keep:</p>
          <ul>
            <li>
              <strong>Your account:</strong> your name, email address and password. The password is stored only as a
              one-way hash, so nobody can read it.
            </li>
            <li>
              <strong>Your profile:</strong> your username and bio, and any links and projects you add. Your profile is
              private until you choose to make it public.
            </li>
            <li>
              <strong>Your progress:</strong> the lessons you finish, your Practice cards and review sessions, the
              projects you link, and your settings (daily goal, theme).
            </li>
          </ul>
          <p className="mt-3">
            We use this only to run Ascend for you. We don&apos;t sell it, share it or use it for advertising.
          </p>
        </section>

        <section>
          <h2>Cookies</h2>
          <p>Ascend sets two cookies, both needed for the site to work:</p>
          <ul>
            <li>
              <strong>ascend_session</strong> keeps you signed in.
            </li>
            <li>
              <strong>ascend_paths_following</strong> remembers which paths you joined.
            </li>
          </ul>
        </section>

        <section>
          <h2>Your choices</h2>
          <ul>
            <li>Change your name, username, bio and password in Settings.</li>
            <li>Make your profile public or private from your profile page.</li>
            <li>
              Reset your progress, or delete your account and everything in it, in{" "}
              <Link href="/settings/account">Settings → Account</Link>. Deletion is immediate and can&apos;t be undone.
            </li>
          </ul>
        </section>

        <section>
          <h2>Questions</h2>
          <p>
            Ascend is open source, so you can read exactly what it stores in{" "}
            <a href={CONTENT_REPO_URL} target="_blank" rel="noopener noreferrer">
              its code
            </a>
            . For anything else, open an issue on GitHub; don&apos;t include personal details in it.
          </p>
        </section>
      </LegalArticle>
    </SiteShell>
  );
}
