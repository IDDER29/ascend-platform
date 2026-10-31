import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db, dbBackend, dbInitError, schema } from "@/lib/db/client";
import { withRetry } from "@/lib/db/retry";

/**
 * For uptime checks: whether the app is up and can reach its database. Reveals nothing about the data;
 * returns 503 when the database can't be reached, so a monitor can alert on it.
 */
export async function GET() {
  const version = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? "local";
  if (!db || dbInitError) {
    return NextResponse.json({ ok: false, database: "unavailable", version }, { status: 503 });
  }
  const conn = db;
  try {
    await withRetry(() => conn.select({ one: sql<number>`1` }).from(schema.users).limit(1));
    return NextResponse.json({ ok: true, database: dbBackend, version }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    console.error("[health] database check failed:", err);
    return NextResponse.json({ ok: false, database: "unreachable", version }, { status: 503 });
  }
}
