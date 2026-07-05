import { getCurrentUser } from "@/lib/auth/auth";
import { AuthProvider } from "@/lib/auth/context";

/**
 * Route group for every screen that uses LabeledSidebar/AppTopbar and
 * therefore needs to know who's actually signed in. Reading the session
 * cookie (via getCurrentUser) opts a route into dynamic rendering, so
 * that cost is scoped to just this group instead of the whole app --
 * the homepage, curriculum/lesson pages, and marketing routes stay
 * statically generated.
 */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  return <AuthProvider user={user}>{children}</AuthProvider>;
}
