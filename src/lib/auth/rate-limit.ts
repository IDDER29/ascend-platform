import "server-only";
import { and, count, eq, gte, lt } from "drizzle-orm";
import { headers } from "next/headers";
import { db, schema } from "@/lib/db/client";
import { clientIp, type Limit } from "./rate-limit-rules";

/** Attempts older than this are deleted as new ones come in. */
const KEEP_MS = 24 * 60 * 60 * 1000;

export async function requestIp(): Promise<string> {
  const h = await headers();
  return clientIp((name) => h.get(name));
}

/**
 * Record this attempt against every rule, then count: if any rule now has more attempts in its window
 * than its limit, this returns true (blocked). Recording first and counting after means parallel requests
 * all see each other, so a burst can't slip past the limit. With no database, nothing is limited (accounts
 * are offline anyway).
 */
export async function hitRateLimit(rules: Limit[]): Promise<boolean> {
  const conn = db;
  if (!conn) return false;
  const now = Date.now();
  for (const rule of rules) {
    await conn.insert(schema.authAttempts).values({ id: crypto.randomUUID(), key: rule.key, createdAt: new Date(now) });
  }
  let blocked = false;
  for (const rule of rules) {
    const [row] = await conn
      .select({ n: count() })
      .from(schema.authAttempts)
      .where(and(eq(schema.authAttempts.key, rule.key), gte(schema.authAttempts.createdAt, new Date(now - rule.windowMs))));
    if (Number(row?.n ?? 0) > rule.limit) blocked = true;
    await conn
      .delete(schema.authAttempts)
      .where(and(eq(schema.authAttempts.key, rule.key), lt(schema.authAttempts.createdAt, new Date(now - KEEP_MS))));
  }
  return blocked;
}

/** Whether a rule is already at its limit, without recording anything (used with recordAttempt). */
export async function atLimit(rule: Limit): Promise<boolean> {
  const conn = db;
  if (!conn) return false;
  const [row] = await conn
    .select({ n: count() })
    .from(schema.authAttempts)
    .where(and(eq(schema.authAttempts.key, rule.key), gte(schema.authAttempts.createdAt, new Date(Date.now() - rule.windowMs))));
  return Number(row?.n ?? 0) >= rule.limit;
}

/** Record one attempt against a rule (for limits that only count some outcomes, such as failures). */
export async function recordAttempt(rule: Limit): Promise<void> {
  if (!db) return;
  await db.insert(schema.authAttempts).values({ id: crypto.randomUUID(), key: rule.key, createdAt: new Date() });
}
