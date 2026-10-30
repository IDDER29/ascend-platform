import type { Metadata } from "next";
import Link from "next/link";
import { LegalArticle } from "@/components/site/legal-article";
import { SiteShell } from "@/components/site/site-shell";

export const metadata: Metadata = {
  title: "Terms — Ascend",
  description: "The few rules for using Ascend.",
};

export default function TermsPage() {
  return (
    <SiteShell>
      <LegalArticle title="Terms" updated="30 October 2026">
        <section>
          <p>
            By using Ascend you agree to these terms. They&apos;re short on purpose. How we handle your data is on the{" "}
            <Link href="/privacy">Privacy</Link> page.
          </p>
        </section>

        <section>
          <h2>Using Ascend</h2>
          <ul>
            <li>Ascend is free. There&apos;s no paid plan and nothing to buy.</li>
            <li>You need to give a real email address to create an account, and keep your password to yourself.</li>
            <li>One person per account.</li>
          </ul>
        </section>

        <section>
          <h2>What you add</h2>
          <p>
            Links, projects and profile text you add stay yours. If you make your profile public, anyone can see them.
            Don&apos;t add anything illegal, hateful or that isn&apos;t yours to share. We may remove content, or an
            account, that breaks this.
          </p>
        </section>

        <section>
          <h2>The lessons</h2>
          <p>
            We work to keep lessons correct, and anyone can report or fix a mistake on GitHub. Still, they come as they
            are, without any guarantee, and Ascend isn&apos;t responsible for what you build with what you learn here.
          </p>
        </section>

        <section>
          <h2>Changes</h2>
          <p>
            Ascend can change, add or remove features and lessons. If these terms change in a way that matters, the date
            above changes and we&apos;ll say so on the site.
          </p>
        </section>

        <section>
          <h2>Leaving</h2>
          <p>
            You can delete your account at any time in <Link href="/settings/account">Settings → Account</Link>.
          </p>
        </section>
      </LegalArticle>
    </SiteShell>
  );
}
