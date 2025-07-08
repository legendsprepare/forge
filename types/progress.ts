import { Database } from './supabase';

export interface WorkoutHistory {
  id: string;
  userId: string;
  date: string;
  exercise: string;
  sets: number;
  reps: number;
  weight: number;
  created_at: string;
}

export interface ProgressMetrics {
  streakCount: number;
  totalWorkouts: number;
  personalRecords: number;
  volumeByMuscle: Record<string, number>;
  consistencyScore: number;
}

export interface StrengthProgression {
  exercise: string;
  date: string;
  weight: number;
  reps: number;
  estimatedOneRM: number;
}

export interface WorkoutStreak {
  date: string;
  workoutCount: number;
}

export interface Tables {
  workout_history: WorkoutHistory;
  exercise_entries: ExerciseEntry;
  progress_metrics: ProgressMetrics;
}

// Extend Database types
export type ProgressDatabase = Database & {
  public: {
    Tables: Tables;
  };
};
