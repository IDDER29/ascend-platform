"use server";

import { redirect } from "next/navigation";
import { signIn, signUp, AuthError } from "@/lib/auth/auth";
import { AFTER_SIGN_IN_HREF, AFTER_SIGN_UP_HREF, safeNextHref } from "@/lib/auth/next-href";
import { hitRateLimit, requestIp } from "@/lib/auth/rate-limit";
import { LIMITS, TOO_MANY } from "@/lib/auth/rate-limit-rules";
import { setSessionCookie } from "@/lib/auth/session";

export interface AuthActionState {
  error: string | null;
}

export async function signInAction(_prev: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const keepSignedIn = formData.get("keepSignedIn") === "true";
  const next = safeNextHref(String(formData.get("next") || ""));

  if (await hitRateLimit(LIMITS.signIn(email, await requestIp()))) return { error: TOO_MANY };

  let userId: string;
  try {
    const user = await signIn({ email, password });
    userId = user.id;
  } catch (err) {
    return { error: err instanceof AuthError ? err.message : "Something went wrong. Try again." };
  }

  await setSessionCookie(userId, keepSignedIn);
  redirect(next ?? AFTER_SIGN_IN_HREF);
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
  if (await hitRateLimit(LIMITS.signUp(await requestIp()))) return { error: TOO_MANY };

  let userId: string;
  try {
    const user = await signUp({ name, email, password });
    userId = user.id;
  } catch (err) {
    return { error: err instanceof AuthError ? err.message : "Something went wrong. Try again." };
  }

  await setSessionCookie(userId, keepSignedIn);
  redirect(AFTER_SIGN_UP_HREF);
}
