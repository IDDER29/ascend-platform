/** Client-safe Practice URLs. Every Practice link goes through here. */

const BASE = "/practice";

export const PRACTICE_ROUTES = {
  home: BASE,
  session: `${BASE}/session`,
  complete: `${BASE}/complete`,
  bank: `${BASE}/bank`,
  custom: `${BASE}/custom`,
  paths: `${BASE}/paths`,
} as const;

export function practicePathHref(slug: string): string {
  return `${PRACTICE_ROUTES.paths}/${slug}`;
}

export function practiceSessionHref(params: Record<string, string>): string {
  return `${PRACTICE_ROUTES.session}?${new URLSearchParams(params).toString()}`;
}

/** Custom deck builder with lessons (`level/slug` keys) pre-selected. */
export function practiceCustomHref(lessonKeys: string[] = []): string {
  return lessonKeys.length > 0
    ? `${PRACTICE_ROUTES.custom}?lessons=${lessonKeys.map(encodeURIComponent).join(",")}`
    : PRACTICE_ROUTES.custom;
}
