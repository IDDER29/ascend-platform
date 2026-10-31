import "server-only";
import { and, eq, gte, lt } from "drizzle-orm";
import { headers } from "next/headers";
import { db, schema } from "@/lib/db/client";
import { clientIp, overLimit, type Limit } from "./rate-limit-rules";

/** Attempts older than this are deleted as new ones come in. */
const KEEP_MS = 24 * 60 * 60 * 1000;

export async function requestIp(): Promise<string> {
  const h = await headers();
  return clientIp((name) => h.get(name));
}

/**
 * Record an attempt against every rule, unless one of them is already over its limit: then nothing is
 * recorded and this returns true (blocked). With no database, nothing is limited (accounts are offline
 * anyway).
 */
export async function hitRateLimit(rules: Limit[]): Promise<boolean> {
  const conn = db;
  if (!conn) return false;
  const now = Date.now();
  for (const rule of rules) {
    const rows = await conn
      .select({ createdAt: schema.authAttempts.createdAt })
      .from(schema.authAttempts)
      .where(and(eq(schema.authAttempts.key, rule.key), gte(schema.authAttempts.createdAt, new Date(now - rule.windowMs))));
    const times = rows.map((r) => (r.createdAt instanceof Date ? r.createdAt.getTime() : Number(r.createdAt)));
    if (overLimit(times, now, rule)) return true;
  }
  for (const rule of rules) {
    await conn.insert(schema.authAttempts).values({ id: crypto.randomUUID(), key: rule.key, createdAt: new Date(now) });
    await conn
      .delete(schema.authAttempts)
      .where(and(eq(schema.authAttempts.key, rule.key), lt(schema.authAttempts.createdAt, new Date(now - KEEP_MS))));
  }
  return false;
}
