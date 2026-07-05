"use server";

import { redirect } from "next/navigation";
import { signIn, signUp, AuthError } from "@/lib/auth/auth";
import { setSessionCookie } from "@/lib/auth/session";

export interface AuthActionState {
  error: string | null;
}

export async function signInAction(_prev: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const keepSignedIn = formData.get("keepSignedIn") === "true";

  let userId: string;
  try {
    const user = await signIn({ email, password });
    userId = user.id;
  } catch (err) {
    return { error: err instanceof AuthError ? err.message : "Something went wrong. Try again." };
  }

  await setSessionCookie(userId, keepSignedIn);
  redirect("/dashboard");
}

export async function signUpAction(_prev: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const name = String(formData.get("name") || "");
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const confirm = String(formData.get("confirm") || "");
  const keepSignedIn = formData.get("keepSignedIn") === "true";

  if (password !== confirm) {
    return { error: "Passwords don't match." };
  }

  let userId: string;
  try {
    const user = await signUp({ name, email, password });
    userId = user.id;
  } catch (err) {
    return { error: err instanceof AuthError ? err.message : "Something went wrong. Try again." };
  }

  await setSessionCookie(userId, keepSignedIn);
  redirect("/dashboard");
}
