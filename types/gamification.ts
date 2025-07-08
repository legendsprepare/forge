import { Database } from "./supabase";

export type UserStats = Database["public"]["Tables"]["user_stats"]["Row"];
export type Achievement = Database["public"]["Tables"]["achievements"]["Row"];
export type UserAchievement =
  Database["public"]["Tables"]["user_achievements"]["Row"];
export type LeagueCohort =
  Database["public"]["Tables"]["league_cohorts"]["Row"];
export type LeagueMember =
  Database["public"]["Tables"]["league_members"]["Row"];

export type LeagueTier = "bronze" | "silver" | "gold" | "platinum" | "diamond";
export type AchievementCategory =
  | "consistency"
  | "strength"
  | "social"
  | "milestone";
export type AchievementRarity = "common" | "rare" | "epic" | "legendary";

export interface XPSource {
  amount: number;
  multiplier: number;
  description: string;
}

export interface LevelUpReward {
  type: "shield" | "avatar_evolution" | "skill_point";
  amount: number;
}

export interface StreakState {
  count: number;
  lastWorkoutDate: string;
  shieldCount: number;
  multiplier: number;
}

export interface LeagueState {
  currentCohort: LeagueCohort | null;
  members: LeagueMember[];
  userRank: number;
  isPromotionZone: boolean;
  isDemotionZone: boolean;
}

export interface GamificationState {
  stats: UserStats | null;
  achievements: Achievement[];
  userAchievements: UserAchievement[];
  streak: StreakState;
  league: LeagueState;
  isLoading: boolean;
  showLevelUpModal: boolean;
  showAchievementModal: boolean;
  latestAchievement: Achievement | null;
}

export interface SkillTree {
  muscleGroup: string;
  level: number;
  unlockedPerks: string[];
  availablePoints: number;
}

export const XP_REWARDS = {
  WORKOUT_COMPLETION: 50,
  PRACTICE_SESSION: 25,
  NEW_EXERCISE: 100,
  ACHIEVEMENT_COMMON: 50,
  ACHIEVEMENT_RARE: 100,
  ACHIEVEMENT_EPIC: 200,
  ACHIEVEMENT_LEGENDARY: 500,
  STREAK_MILESTONE: 150,
} as const;

export const STREAK_THRESHOLDS = {
  FLAME_1: 3, // Orange flame
  FLAME_2: 7, // Blue flame
  FLAME_3: 14, // Purple flame
  FLAME_4: 30, // Rainbow flame
} as const;

export const LEVEL_THRESHOLDS = {
  EVOLUTION_1: 10, // First avatar evolution
  EVOLUTION_2: 25, // Second evolution
  EVOLUTION_3: 50, // Final evolution
} as const;

export const LEAGUE_SETTINGS = {
  COHORT_SIZE: 30,
  PROMOTION_THRESHOLD: 5,
  DEMOTION_THRESHOLD: 25,
  SEASON_LENGTH_DAYS: 7,
} as const;
