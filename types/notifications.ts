import { MuscleGroup } from "./progress";

export type NotificationType =
  | "streak_reminder"
  | "achievement_unlock"
  | "rest_timer"
  | "social_interaction"
  | "streak_warning"
  | "league_update"
  | "progress_report";

export type NotificationPriority = "high" | "default" | "low";

export interface BaseNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  priority: NotificationPriority;
  data?: Record<string, any>;
  sound?: boolean;
  vibrate?: boolean;
}

export interface StreakNotification extends BaseNotification {
  type: "streak_reminder" | "streak_warning";
  data: {
    currentStreak: number;
    hoursRemaining: number;
  };
}

export interface AchievementNotification extends BaseNotification {
  type: "achievement_unlock";
  data: {
    achievementId: string;
    achievementName: string;
    xpGained: number;
    description: string;
  };
}

export interface RestTimerNotification extends BaseNotification {
  type: "rest_timer";
  data: {
    exerciseName: string;
    muscleGroup: MuscleGroup;
    setNumber: number;
    restDuration: number;
  };
}

export interface SocialNotification extends BaseNotification {
  type: "social_interaction";
  data: {
    actionType: "like" | "comment" | "challenge" | "follow";
    userId: string;
    userName: string;
    targetId: string;
    targetType: "workout" | "achievement" | "challenge";
  };
}

export interface LeagueNotification extends BaseNotification {
  type: "league_update";
  data: {
    leagueId: string;
    leagueName: string;
    rank: number;
    totalParticipants: number;
    xpGained: number;
  };
}

export interface ProgressNotification extends BaseNotification {
  type: "progress_report";
  data: {
    period: "weekly" | "monthly";
    totalWorkouts: number;
    volumeIncrease: number;
    newRecords: number;
    consistencyScore: number;
  };
}

export type AppNotification =
  | StreakNotification
  | AchievementNotification
  | RestTimerNotification
  | SocialNotification
  | LeagueNotification
  | ProgressNotification;

export interface NotificationSettings {
  streakReminders: boolean;
  achievementAlerts: boolean;
  restTimers: boolean;
  socialInteractions: boolean;
  leagueUpdates: boolean;
  progressReports: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  quietHoursStart: number; // 24-hour format
  quietHoursEnd: number; // 24-hour format
  customSounds: Record<NotificationType, string>;
}
