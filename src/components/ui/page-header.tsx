import type { ReactNode } from "react";

export type PageHeaderProps = {
  /** Optional quiet label above the title (avoid fake Learn/You slash trails on hubs). */
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

/** Standard content width for AppShell learner hubs (Continue / Practice / Paths / …). */
export const HUB_CONTENT_CLASS = "mx-auto w-full max-w-[960px]";
