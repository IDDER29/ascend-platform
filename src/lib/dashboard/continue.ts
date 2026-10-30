

export type RecentProject = {
  id: string;
  title: string;
  href: string;
  statusLabel: string;
  statusTone: "pass" | "fail" | "neutral";
  meta?: string;
  repoUrl?: string;
};

export type NextProjectCta = {
  title: string;
  href: string;
  blurb: string;
  kind: "project" | "shellforge" | "explore";
};

export type PathHandoff = {
  kind: "next-course" | "capstone" | "path-complete";
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  cta: string;
};

export function greetingForHour(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function lessonBlurb(why: string, max = 140): string {
  const one = why.replace(/\s+/g, " ").trim();
  if (one.length <= max) return one;
  const cut = one.slice(0, max - 1);
  const at = cut.lastIndexOf(" ");
  return `${(at > 80 ? cut.slice(0, at) : cut).trimEnd()}…`;
}
