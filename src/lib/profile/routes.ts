/** Profile URLs. The owner page moves to /profile at cutover. */
export const PROFILE_ROUTES = {
  owner: "/profilev2",
  public: (username: string) => `/u/${encodeURIComponent(username)}`,
  settings: "/settings",
} as const;
