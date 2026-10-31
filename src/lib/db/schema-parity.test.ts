import assert from "node:assert/strict";
import { test } from "node:test";
import { getTableConfig as pgConfig, PgTable } from "drizzle-orm/pg-core";
import { getTableConfig as sqliteConfig, SQLiteTable } from "drizzle-orm/sqlite-core";
import * as pg from "./schema.pg";
import * as sqlite from "./schema.sqlite";
import { SQLITE_ADDED_COLUMNS, SQLITE_DDL } from "./sqlite-ddl";

/** table name → sorted column names */
type Shape = Record<string, string[]>;

function pgShape(): Shape {
  return Object.fromEntries(
    Object.values(pg)
      .filter((t: unknown): t is PgTable => t instanceof PgTable)
      .map((t) => {
        const c = pgConfig(t);
        return [c.name, c.columns.map((col) => col.name).sort()];
      }),
  );
}

function sqliteShape(): Shape {
  return Object.fromEntries(
    Object.values(sqlite)
      .filter((t: unknown): t is SQLiteTable => t instanceof SQLiteTable)
      .map((t) => {
        const c = sqliteConfig(t);
        return [c.name, c.columns.map((col) => col.name).sort()];
      }),
  );
}

function ddlShape(withAdded = true): Shape {
  const shape: Shape = {};
  for (const m of SQLITE_DDL.matchAll(/CREATE TABLE IF NOT EXISTS (\w+) \(([\s\S]*?)\n\);/g)) {
    const cols = m[2]
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l && !/^(PRIMARY KEY|UNIQUE|FOREIGN KEY)\b/.test(l))
      .map((l) => l.split(/\s+/)[0]);
    shape[m[1]] = cols;
  }
  if (withAdded) {
    for (const { table, column } of SQLITE_ADDED_COLUMNS) {
      if (!shape[table]?.includes(column)) shape[table] = [...(shape[table] ?? []), column];
    }
  }
  for (const t of Object.keys(shape)) shape[t] = [...new Set(shape[t])].sort();
  return shape;
}

test("the Postgres schema, the SQLite schema and the SQLite DDL have the same tables and columns", () => {
  const a = pgShape();
  assert.deepEqual(sqliteShape(), a, "schema.sqlite.ts differs from schema.pg.ts");
  assert.deepEqual(ddlShape(), a, "sqlite-ddl.ts differs from schema.pg.ts");
  assert.ok(Object.keys(a).length >= 17);
});

test("every column added after shipping is also in the CREATE TABLE for new databases", () => {
  // A brand-new local.db gets its columns from CREATE TABLE alone.
  const created = ddlShape(false);
  for (const { table, column } of SQLITE_ADDED_COLUMNS) assert.ok(created[table]?.includes(column), `${table}.${column}`);
  // The ALTER must name the same table and column.
  for (const { table, column, ddl } of SQLITE_ADDED_COLUMNS) assert.match(ddl, new RegExp(`ALTER TABLE ${table} ADD COLUMN ${column}\\b`));
});
