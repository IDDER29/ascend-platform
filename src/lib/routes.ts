/** Canonical learner entry URLs. Curriculum was replaced by Paths; the name stays for the homepage's links. */
export const CURRICULUM_HREF = "/paths";

export const PATHS_HREF = "/paths";

export const FIRST_LESSON_HREF =
  "/lessons/foundations-information-what-is-a-bit";

/** Auth — one page; signup via query for deep links / analytics. */
export const SIGNIN_HREF = "/signin";
export const SIGNUP_HREF = "/signin?mode=signup";

/** Password reset flow (on when email is configured: see src/lib/email.ts). */
export {
  RESET_HREF,
  RESET_NEW_PASSWORD_HREF,
  RESET_EXPIRED_HREF,
} from "@/lib/auth/reset-flow";
