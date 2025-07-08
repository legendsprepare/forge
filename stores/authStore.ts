import { create } from "zustand";
import {
  AuthState,
  AuthCredentials,
  SignUpData,
  AuthError,
} from "../types/auth";
import { supabase } from "../lib/supabase";
import { Session } from "@supabase/supabase-js";

interface AuthStore extends AuthState {
  initialize: () => Promise<void>;
  signUp: (data: SignUpData) => Promise<AuthError | null>;
  signIn: (credentials: AuthCredentials) => Promise<AuthError | null>;
  signInWithGoogle: () => Promise<AuthError | null>;
  signOut: () => Promise<void>;
  setGuest: (isGuest: boolean) => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  session: null,
  isLoading: true,
  isGuest: false,

  initialize: async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        set({ user: session.user, session, isLoading: false });
      } else {
        set({ user: null, session: null, isLoading: false });
      }

      // Set up auth state change listener
      supabase.auth.onAuthStateChange((_event, session) => {
        set({ user: session?.user ?? null, session, isLoading: false });
      });
    } catch (error) {
      console.error("Error initializing auth:", error);
      set({ user: null, session: null, isLoading: false });
    }
  },

  signUp: async (data: SignUpData) => {
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            username: data.username,
          },
        },
      });

      if (error) throw error;
      return null;
    } catch (error: any) {
      return { message: error.message, code: error.code };
    }
  },

  signIn: async (credentials: AuthCredentials) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) throw error;
      return null;
    } catch (error: any) {
      return { message: error.message, code: error.code };
    }
  },

  signInWithGoogle: async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });

      if (error) throw error;
      return null;
    } catch (error: any) {
      return { message: error.message, code: error.code };
    }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Error signing out:", error);
    set({ user: null, session: null, isGuest: false });
  },

  setGuest: (isGuest: boolean) => {
    set({ isGuest });
  },
}));
