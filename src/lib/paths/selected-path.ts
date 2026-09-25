import "server-only";
import { cookies } from "next/headers";
import { getPathBySlug } from "@/lib/paths/catalog";

/** Legacy single active slug — migrated into following on read. */
const LEGACY_SELECTED = "ascend_selected_path";
/** slug → ISO selectedAt */
const FOLLOWING_COOKIE = "ascend_paths_following";
/** Legacy enter stamps — no longer used for tenure; left unread. */
const MAX_AGE = 60 * 60 * 24 * 400; // ~13 months

type IsoMap = Record<string, string>;

function cookieOpts() {
  return {
    httpOnly: true as const,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: MAX_AGE,
  };
}

function parseIsoMap(raw: string | undefined): IsoMap {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    const out: IsoMap = {};
    for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
      if (typeof v === "string" && !Number.isNaN(Date.parse(v))) out[k] = v;
    }
    return out;
  } catch {
    return {};
  }
}

async function readFollowingRaw(): Promise<IsoMap> {
  const store = await cookies();
  return parseIsoMap(store.get(FOLLOWING_COOKIE)?.value);
}

async function writeFollowingRaw(map: IsoMap): Promise<void> {
  const store = await cookies();
  store.set(
    FOLLOWING_COOKIE,
    encodeURIComponent(JSON.stringify(map)),
    cookieOpts(),
  );
}

/**
 * Paths the learner is following (Select). Values = last selectedAt.
 * Migrates legacy `ascend_selected_path` into the map when empty.
 * Read-only from RSC — never writes during render.
 */
export async function getFollowingMap(): Promise<Record<string, Date>> {
  const store = await cookies();
  const map = await readFollowingRaw();
  const out: Record<string, Date> = {};

  for (const [slug, iso] of Object.entries(map)) {
    const path = getPathBySlug(slug);
    if (!path || path.status !== "live") continue;
    const d = new Date(iso);
    if (!Number.isNaN(d.getTime())) out[slug] = d;
  }

  // Migration: legacy single cookie → treat as following (RSC cannot write;
  // seed happens on next Select/Unselect via ensureFollowingMigrated).
  if (Object.keys(out).length === 0) {
    const legacy = store.get(LEGACY_SELECTED)?.value;
    if (legacy) {
      const path = getPathBySlug(legacy);
      if (path && path.status === "live") {
        out[path.slug] = new Date();
      }
    }
  }

  return out;
}

/** Most recently selected followed path (compat for catalog “selected”). */
export async function getSelectedPathSlug(): Promise<string | null> {
  const following = await getFollowingMap();
  let best: { slug: string; at: number } | null = null;
  for (const [slug, at] of Object.entries(following)) {
    const t = at.getTime();
    if (!best || t > best.at) best = { slug, at: t };
  }
  return best?.slug ?? null;
}

/** @deprecated Tenure uses first lesson completion — kept as empty for callers. */
export async function getPathEnteredMap(): Promise<Record<string, Date>> {
  return {};
}

/** @deprecated */
export async function getPathEnteredAt(_slug: string): Promise<Date | null> {
  return null;
}

/**
 * Follow a path (Select). Updates selectedAt; keeps legacy selected cookie in sync.
 * Server Actions only.
 */
export async function setSelectedPathSlug(slug: string): Promise<void> {
  const path = getPathBySlug(slug);
  if (!path || path.status !== "live") return;

  const store = await cookies();
  const map = await readFollowingRaw();

  // One-time migrate legacy into map before write
  if (Object.keys(map).length === 0) {
    const legacy = store.get(LEGACY_SELECTED)?.value;
    if (legacy && legacy !== slug) {
      const legacyPath = getPathBySlug(legacy);
      if (legacyPath && legacyPath.status === "live") {
        map[legacy] = new Date().toISOString();
      }
    }
  }

  map[slug] = new Date().toISOString();
  await writeFollowingRaw(map);
  store.set(LEGACY_SELECTED, slug, cookieOpts());
}

/**
 * Unfollow a path. Server Actions only.
 */
export async function unfollowPathSlug(slug: string): Promise<void> {
  const store = await cookies();
  const map = await readFollowingRaw();

  // Migrate legacy into map so unfollow can clear it
  if (Object.keys(map).length === 0) {
    const legacy = store.get(LEGACY_SELECTED)?.value;
    if (legacy) {
      map[legacy] = new Date().toISOString();
    }
  }

  delete map[slug];
  await writeFollowingRaw(map);

  const remaining = Object.entries(map)
    .filter(([s]) => {
      const p = getPathBySlug(s);
      return p && p.status === "live";
    })
    .sort((a, b) => Date.parse(b[1]) - Date.parse(a[1]));

  if (remaining[0]) {
    store.set(LEGACY_SELECTED, remaining[0][0], cookieOpts());
  } else {
    store.delete(LEGACY_SELECTED);
  }
}
