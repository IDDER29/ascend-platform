"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/auth";
import { confirmationMatches, PROGRESS_TABLES } from "@/lib/auth/account-rules";
import { MIN_PASSWORD_LENGTH } from "@/lib/auth/reset-flow";
import { clearSessionCookie } from "@/lib/auth/session";
import { db, schema } from "@/lib/db/client";

export type AccountActionState = { error: string | null; ok?: boolean };

const OFFLINE = "Accounts aren't available right now. Try again shortly.";

/** The signed-in user and their stored password hash, or null. */
async function me() {
  const user = await getCurrentUser();
  if (!user || !db) return null;
  const row = await db.query.users.findFirst({ where: eq(schema.users.id, user.id) });
  return row ? { user, passwordHash: row.passwordHash } : null;
}

export async function changePasswordAction(_prev: AccountActionState, formData: FormData): Promise<AccountActionState> {
  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  if (next.length < MIN_PASSWORD_LENGTH) return { error: `Use at least ${MIN_PASSWORD_LENGTH} characters.` };
  if (next !== confirm) return { error: "The two new passwords don't match." };

  const found = await me();
  if (!found || !db) return { error: OFFLINE };
  if (!(await bcrypt.compare(current, found.passwordHash))) return { error: "Your current password isn't right." };

  await db
    .update(schema.users)
    .set({ passwordHash: await bcrypt.hash(next, 10) })
    .where(eq(schema.users.id, found.user.id));
  return { error: null, ok: true };
}

export async function resetProgressAction(_prev: AccountActionState, formData: FormData): Promise<AccountActionState> {
  const found = await me();
  if (!found || !db) return { error: OFFLINE };
  if (!confirmationMatches(String(formData.get("confirm") ?? ""), found.user.username)) {
    return { error: `Type your username, ${found.user.username}, to confirm.` };
  }

  const conn = db;
  for (const name of PROGRESS_TABLES) {
    const table = schema[name];
    await conn.delete(table).where(eq(table.userId, found.user.id));
  }
  // A fresh streak row: lessons finished from now on count again (see bumpStreak).
  await conn.insert(schema.streaks).values({ userId: found.user.id });
  for (const path of ["/dashboard", "/progress", "/profile", "/practice", "/achievements", "/paths"]) {
    revalidatePath(path);
  }
  return { error: null, ok: true };
}

export async function deleteAccountAction(_prev: AccountActionState, formData: FormData): Promise<AccountActionState> {
  const found = await me();
  if (!found || !db) return { error: OFFLINE };
  if (!confirmationMatches(String(formData.get("confirm") ?? ""), found.user.username)) {
    return { error: `Type your username, ${found.user.username}, to confirm.` };
  }
  if (!(await bcrypt.compare(String(formData.get("password") ?? ""), found.passwordHash))) {
    return { error: "That password isn't right." };
  }

  // Every other table references users with ON DELETE CASCADE.
  await db.delete(schema.users).where(eq(schema.users.id, found.user.id));
  await clearSessionCookie();
  // The home page then clears this browser's copy (see DELETING_KEY).
  redirect("/?deleted=1");
}
