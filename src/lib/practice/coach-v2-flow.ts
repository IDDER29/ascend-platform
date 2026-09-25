import type { PracticeSessionRecord } from "@/lib/practice/history";
import type { PracticeScope } from "@/lib/practice/session";
import { PRACTICE_PATH_TITLES } from "@/lib/practice/path-map";

function first(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function asParams(
  input: URLSearchParams | Record<string, string | string[] | undefined>,
): { get(name: string): string | undefined } {
  if (input instanceof URLSearchParams) {
    return { get: (name) => input.get(name) ?? undefined };
  }
  return { get: (name) => first(input[name]) };
}

export function parseCoachV2Scope(
  input: URLSearchParams | Record<string, string | string[] | undefined>,
): PracticeScope {
  const p = asParams(input);
  const scope = p.get("scope") ?? "due";
  if (scope === "all") return { type: "all" };
  if (scope === "due") return { type: "due" };
  if (scope === "path") {
    const pathSlug = p.get("path") ?? p.get("pathSlug") ?? "foundations";
    return { type: "path", pathSlug };
  }
  if (scope === "section") {
    const pathSlug = p.get("path") ?? "foundations";
    const sectionId = p.get("section") ?? "";
    return { type: "section", pathSlug, sectionId };
  }
  return { type: "due" };
}

export function labelCoachV2Scope(scope: PracticeScope): {
  scope: PracticeScope;
  scopeLabel: string;
  pathSlug: string | null;
} {
  if (scope.type === "due") {
    return { scope, scopeLabel: "Due review", pathSlug: null };
  }
  if (scope.type === "all") {
    return { scope, scopeLabel: "Free study", pathSlug: null };
  }
  if (scope.type === "path") {
    const title =
      PRACTICE_PATH_TITLES[scope.pathSlug] ?? scope.pathSlug;
    return { scope, scopeLabel: title, pathSlug: scope.pathSlug };
  }
  if (scope.type === "section") {
    return {
      scope,
      scopeLabel: `${scope.pathSlug} · ${scope.sectionId}`,
      pathSlug: scope.pathSlug,
    };
  }
  // lessons
  return {
    scope,
    scopeLabel: "Selected lessons",
    pathSlug: null,
  };
}

export function findCoachV2SessionRecord(
  history: PracticeSessionRecord[],
  sessionId: string | null | undefined,
): PracticeSessionRecord | null {
  if (sessionId) {
    return history.find((row) => row.id === sessionId) ?? null;
  }
  if (history.length === 0) return null;
  return [...history].sort((a, b) => b.at.localeCompare(a.at))[0] ?? null;
}
