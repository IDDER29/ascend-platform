"use server";

import { redirect } from "next/navigation";
import { SIGNIN_HREF } from "@/lib/routes";
import { clearSessionCookie } from "./session";

export async function signOutAction() {
  await clearSessionCookie();
  redirect(SIGNIN_HREF);
}
