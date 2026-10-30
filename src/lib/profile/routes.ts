/** Profile URLs: the owner page and the opt-in public view. */
export const PROFILE_ROUTES = {
  owner: "/profile",
  public: (username: string) => `/u/${encodeURIComponent(username)}`,
  settings: "/settings",
} as const;
