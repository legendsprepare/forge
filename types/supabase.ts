export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      workout_history: {
        Row: {
          id: string;
          userId: string;
          date: string;
          exercise: string;
          sets: number;
          reps: number;
          weight: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          userId: string;
          date: string;
          exercise: string;
          sets: number;
          reps: number;
          weight: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          userId?: string;
          date?: string;
          exercise?: string;
          sets?: number;
          reps?: number;
          weight?: number;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
