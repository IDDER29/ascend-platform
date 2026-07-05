"use client";

import { createContext, useContext } from "react";
import type { PublicUser } from "./auth";

const AuthContext = createContext<PublicUser | null>(null);

export function AuthProvider({ user, children }: { user: PublicUser | null; children: React.ReactNode }) {
  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
}

/** The real signed-in user, or null when browsing without an account. */
export function useAuthUser(): PublicUser | null {
  return useContext(AuthContext);
}
