import { Database } from "./supabase";

export type Exercise = Database["public"]["Tables"]["exercises"]["Row"];
export type Workout = Database["public"]["Tables"]["workouts"]["Row"];
export type WorkoutSet = Database["public"]["Tables"]["workout_sets"]["Row"];
export type UserProgress = Database["public"]["Tables"]["user_progress"]["Row"];

export type ExerciseCategory =
  | "strength"
  | "cardio"
  | "flexibility"
  | "bodyweight";
export type MuscleGroup =
  | "chest"
  | "back"
  | "legs"
  | "shoulders"
  | "arms"
  | "core";
export type Difficulty = "beginner" | "intermediate" | "advanced";

export interface ExerciseWithSets extends Exercise {
  sets: WorkoutSet[];
}

export interface WorkoutWithExercises extends Workout {
  exercises: ExerciseWithSets[];
}

export interface RestTimerState {
  isActive: boolean;
  duration: number;
  timeRemaining: number;
  exerciseId: string | null;
}

export interface WorkoutState {
  currentWorkout: WorkoutWithExercises | null;
  exercises: Exercise[];
  isLoading: boolean;
  restTimer: RestTimerState;
  offlineWorkouts: WorkoutWithExercises[];
  isSyncing: boolean;
}

export interface SetFormData {
  weight?: number;
  reps: number;
  distance?: number;
  duration?: number;
  notes?: string;
}

export interface WorkoutFormData {
  name: string;
  notes?: string;
  exerciseIds: string[];
}
