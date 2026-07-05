import "server-only";
import path from "node:path";
import Database from "better-sqlite3";
import postgres from "postgres";
import { drizzle as drizzlePg, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { drizzle as drizzleSqlite } from "drizzle-orm/better-sqlite3";
import * as pgSchema from "./schema.pg";
import * as sqliteSchema from "./schema.sqlite";
import { SQLITE_DDL } from "./sqlite-ddl";

export type Backend = "postgres" | "sqlite";

function initPostgres(url: string) {
  const client = postgres(url, { max: 5 });
  return drizzlePg(client, { schema: pgSchema });
}

function isServerless(): boolean {
  // Serverless runtimes (Vercel, Netlify, Lambda) ship a read-only
  // filesystem outside /tmp -- process.cwd() can't be written to there.
  return Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NETLIFY);
}

function initSqlite() {
  const filePath = process.env.SQLITE_PATH || path.join(isServerless() ? "/tmp" : process.cwd(), "local.db");
  const sqlite = new Database(filePath);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  sqlite.exec(SQLITE_DDL);
  return drizzleSqlite(sqlite, { schema: sqliteSchema });
}

type DbInstance = ReturnType<typeof initPostgres> | ReturnType<typeof initSqlite>;

interface GlobalDbCache {
  __ascendDb?: DbInstance | null;
  __ascendBackend?: Backend;
  __ascendDbError?: Error | null;
}

const globalForDb = globalThis as unknown as GlobalDbCache;

/**
 * The active Drizzle instance -- backed by Supabase/Postgres when
 * DATABASE_URL is set, otherwise a local SQLite file (auto-created, schema
 * applied on first use) so the whole data layer works with zero external
 * setup. Column shapes are kept identical between schema.pg.ts and
 * schema.sqlite.ts specifically so repository code never needs to branch
 * on which backend is live. Cached on globalThis so dev-mode hot reloads
 * don't reopen the sqlite file / postgres pool on every request.
 *
 * Deliberately never throws at import time: a database that's unreachable
 * (no DATABASE_URL and a read-only filesystem, e.g. a serverless deploy
 * with no Postgres configured) must not crash every page that merely
 * checks who's signed in -- see dbInitError / auth.ts's null checks.
 */
if (globalForDb.__ascendDb === undefined) {
  try {
    const url = process.env.DATABASE_URL;
    if (url) {
      globalForDb.__ascendBackend = "postgres";
      globalForDb.__ascendDb = initPostgres(url);
    } else {
      globalForDb.__ascendBackend = "sqlite";
      globalForDb.__ascendDb = initSqlite();
    }
    globalForDb.__ascendDbError = null;
  } catch (err) {
    globalForDb.__ascendDb = null;
    globalForDb.__ascendDbError = err instanceof Error ? err : new Error(String(err));
    console.error(
      "[db] Failed to initialize the database -- auth/account features are disabled for this request. " +
        (process.env.DATABASE_URL
          ? "Check DATABASE_URL is a reachable Postgres connection string."
          : "The local SQLite fallback couldn't open its file -- if this is a serverless deployment, set DATABASE_URL to a real Postgres/Supabase instance instead of relying on the local-file fallback."),
      globalForDb.__ascendDbError,
    );
  }
}

export const dbBackend: Backend = globalForDb.__ascendBackend!;
export const dbInitError: Error | null = globalForDb.__ascendDbError ?? null;

/**
 * Both variants expose the same query-builder shape (select/insert/update/
 * delete/transaction) and schema.sqlite.ts mirrors schema.pg.ts column-for-
 * column, so it's safe to give repository code a single Postgres-flavored
 * compile-time type regardless of which dialect is actually live -- the
 * runtime object is always correctly dialect-matched to its own schema,
 * this cast only affects what TypeScript sees. `db` is null when init
 * failed (see dbInitError) -- callers must check before use.
 */
export const db = globalForDb.__ascendDb as unknown as PostgresJsDatabase<typeof pgSchema> | null;
export const schema = (dbBackend === "postgres" ? pgSchema : sqliteSchema) as unknown as typeof pgSchema;
