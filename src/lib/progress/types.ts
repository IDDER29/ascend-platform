/** Client-safe progress/profile types (no server-only imports). */

export interface ContinueLesson {
  level: string;
  slug: string;
  title: string;
  href: string;
  order: number;
}

export interface LessonCompletion {
  level: string;
  slug: string;
  completedAt: Date;
}

export interface StreakInfo {
  current: number;
  longest: number;
  freezesAvailable: number;
  lastActiveDate: string | null;
}

export interface ProfileSettings {
  userId: string;
  email: string;
  name: string;
  username: string;
  bio: string;
  pace: string;
  theme: string;
  accent: string;
  reminderTime: string;
  notifStreakReminders: boolean;
  notifWeeklyRecap: boolean;
  notifPeerSolutions: boolean;
  notifProductUpdates: boolean;
}

export type ProfileSettingsUpdate = {
  name: string;
  username: string;
  bio: string;
  pace: string;
  theme: string;
  accent: string;
  reminderTime: string;
  notifStreakReminders: boolean;
  notifWeeklyRecap: boolean;
  notifPeerSolutions: boolean;
  notifProductUpdates: boolean;
};

/** Partial update for sectioned Settings panes. */
export type ProfileSettingsPatch = Partial<ProfileSettingsUpdate>;
