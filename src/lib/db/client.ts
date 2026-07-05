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

function initSqlite() {
  const filePath = process.env.SQLITE_PATH || path.join(process.cwd(), "local.db");
  const sqlite = new Database(filePath);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  sqlite.exec(SQLITE_DDL);
  return drizzleSqlite(sqlite, { schema: sqliteSchema });
}

interface GlobalDbCache {
  __ascendDb?: ReturnType<typeof initPostgres> | ReturnType<typeof initSqlite>;
  __ascendBackend?: Backend;
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
 */
if (!globalForDb.__ascendDb) {
  const url = process.env.DATABASE_URL;
  if (url) {
    globalForDb.__ascendBackend = "postgres";
    globalForDb.__ascendDb = initPostgres(url);
  } else {
    globalForDb.__ascendBackend = "sqlite";
    globalForDb.__ascendDb = initSqlite();
  }
}

export const dbBackend: Backend = globalForDb.__ascendBackend!;

/**
 * Both variants expose the same query-builder shape (select/insert/update/
 * delete/transaction) and schema.sqlite.ts mirrors schema.pg.ts column-for-
 * column, so it's safe to give repository code a single Postgres-flavored
 * compile-time type regardless of which dialect is actually live -- the
 * runtime object is always correctly dialect-matched to its own schema,
 * this cast only affects what TypeScript sees.
 */
export const db = globalForDb.__ascendDb! as unknown as PostgresJsDatabase<typeof pgSchema>;
export const schema = (dbBackend === "postgres" ? pgSchema : sqliteSchema) as unknown as typeof pgSchema;
