import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "../lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import {
  Exercise,
  WorkoutState,
  WorkoutWithExercises,
  WorkoutSet,
  SetFormData,
} from "../types/workout";

const useWorkoutStore = create<
  WorkoutState & {
    // Workout Management
    startWorkout: (name: string, exerciseIds: string[]) => Promise<void>;
    endWorkout: () => Promise<void>;
    addExerciseToWorkout: (exerciseId: string) => Promise<void>;
    removeExerciseFromWorkout: (exerciseId: string) => Promise<void>;

    // Set Management
    logSet: (exerciseId: string, setData: SetFormData) => Promise<void>;
    updateSet: (setId: string, setData: SetFormData) => Promise<void>;
    deleteSet: (setId: string) => Promise<void>;

    // Rest Timer
    startRestTimer: (duration: number, exerciseId: string) => void;
    pauseRestTimer: () => void;
    stopRestTimer: () => void;
    updateRestTimer: (timeRemaining: number) => void;

    // Data Management
    fetchExercises: () => Promise<void>;
    syncOfflineWorkouts: () => Promise<void>;
    clearCurrentWorkout: () => void;
  }
>(
  persist(
    (set, get) => ({
      currentWorkout: null,
      exercises: [],
      isLoading: false,
      restTimer: {
        isActive: false,
        duration: 0,
        timeRemaining: 0,
        exerciseId: null,
      },
      offlineWorkouts: [],
      isSyncing: false,

      startWorkout: async (name: string, exerciseIds: string[]) => {
        set({ isLoading: true });
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) throw new Error("No user found");

          const workout: WorkoutWithExercises = {
            id: crypto.randomUUID(),
            user_id: user.id,
            name,
            duration: 0,
            total_sets: 0,
            is_synced: false,
            created_at: new Date().toISOString(),
            exercises: exerciseIds.map(
              (id) =>
                ({
                  id,
                  sets: [],
                } as any)
            ), // We'll fetch full exercise details later
          };

          set({ currentWorkout: workout, isLoading: false });
        } catch (error) {
          console.error("Error starting workout:", error);
          set({ isLoading: false });
        }
      },

      endWorkout: async () => {
        const { currentWorkout, offlineWorkouts } = get();
        if (!currentWorkout) return;

        const completedWorkout = {
          ...currentWorkout,
          completed_at: new Date().toISOString(),
        };

        set({
          offlineWorkouts: [...offlineWorkouts, completedWorkout],
          currentWorkout: null,
        });

        try {
          await get().syncOfflineWorkouts();
        } catch (error) {
          console.error("Error syncing completed workout:", error);
        }
      },

      logSet: async (exerciseId: string, setData: SetFormData) => {
        const { currentWorkout } = get();
        if (!currentWorkout) return;

        const exercise = currentWorkout.exercises.find(
          (e) => e.id === exerciseId
        );
        if (!exercise) return;

        const newSet: WorkoutSet = {
          id: crypto.randomUUID(),
          workout_id: currentWorkout.id,
          exercise_id: exerciseId,
          set_number: exercise.sets.length + 1,
          created_at: new Date().toISOString(),
          is_personal_record: false,
          ...setData,
        };

        const updatedExercises = currentWorkout.exercises.map((e) =>
          e.id === exerciseId ? { ...e, sets: [...e.sets, newSet] } : e
        );

        set({
          currentWorkout: {
            ...currentWorkout,
            exercises: updatedExercises,
            total_sets: currentWorkout.total_sets + 1,
          },
        });
      },

      startRestTimer: async (duration: number, exerciseId: string) => {
        // Schedule a notification for when the timer ends
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Rest Timer Complete!",
            body: "Time to start your next set",
            sound: true,
          },
          trigger: { seconds: duration },
        });

        set({
          restTimer: {
            isActive: true,
            duration,
            timeRemaining: duration,
            exerciseId,
          },
        });
      },

      pauseRestTimer: () => {
        set((state) => ({
          restTimer: { ...state.restTimer, isActive: false },
        }));
      },

      stopRestTimer: async () => {
        await Notifications.cancelAllScheduledNotificationsAsync();
        set({
          restTimer: {
            isActive: false,
            duration: 0,
            timeRemaining: 0,
            exerciseId: null,
          },
        });
      },

      updateRestTimer: (timeRemaining: number) => {
        set((state) => ({
          restTimer: { ...state.restTimer, timeRemaining },
        }));
      },

      fetchExercises: async () => {
        set({ isLoading: true });
        try {
          const { data: exercises, error } = await supabase
            .from("exercises")
            .select("*")
            .order("name");

          if (error) throw error;
          set({ exercises: exercises as Exercise[], isLoading: false });
        } catch (error) {
          console.error("Error fetching exercises:", error);
          set({ isLoading: false });
        }
      },

      syncOfflineWorkouts: async () => {
        const { offlineWorkouts } = get();
        if (offlineWorkouts.length === 0) return;

        set({ isSyncing: true });
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) throw new Error("No user found");

          // Sync each workout and its sets
          for (const workout of offlineWorkouts) {
            // Insert workout
            const { error: workoutError } = await supabase
              .from("workouts")
              .insert(workout);

            if (workoutError) throw workoutError;

            // Insert all sets
            const sets = workout.exercises.flatMap((e) => e.sets);
            if (sets.length > 0) {
              const { error: setsError } = await supabase
                .from("workout_sets")
                .insert(sets);

              if (setsError) throw setsError;
            }

            // Update user progress
            for (const exercise of workout.exercises) {
              if (exercise.sets.length === 0) continue;

              const maxWeight = Math.max(
                ...exercise.sets.map((s) => s.weight || 0)
              );
              const maxReps = Math.max(...exercise.sets.map((s) => s.reps));
              const totalVolume = exercise.sets.reduce(
                (sum, s) => sum + (s.weight || 0) * s.reps,
                0
              );

              const { error: progressError } = await supabase
                .from("user_progress")
                .upsert({
                  user_id: user.id,
                  exercise_id: exercise.id,
                  personal_best_weight: maxWeight,
                  personal_best_reps: maxReps,
                  total_volume: totalVolume,
                  total_sets: exercise.sets.length,
                  last_performed_at: new Date().toISOString(),
                });

              if (progressError) throw progressError;
            }
          }

          set({ offlineWorkouts: [], isSyncing: false });
        } catch (error) {
          console.error("Error syncing workouts:", error);
          set({ isSyncing: false });
        }
      },

      clearCurrentWorkout: () => {
        set({ currentWorkout: null });
      },

      // Implement remaining methods
      addExerciseToWorkout: async () => {},
      removeExerciseFromWorkout: async () => {},
      updateSet: async () => {},
      deleteSet: async () => {},
    }),
    {
      name: "workout-store",
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  )
);

export default useWorkoutStore;
