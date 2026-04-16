import { create } from 'zustand';
import { supabase } from '../services/supabase';
import { UserProfile } from '../types';

interface AuthState {
  user: UserProfile | null;
  session: any;
  loading: boolean;
  initialized: boolean;
  setUser: (user: UserProfile | null) => void;
  setSession: (session: any) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  loading: false,
  initialized: false,

  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setLoading: (loading) => set({ loading }),
  setInitialized: (initialized) => set({ initialized }),

  signIn: async (email, password) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.user && !data.user.email_confirmed_at) {
        await supabase.auth.signOut();
        throw new Error('EMAIL_NOT_CONFIRMED');
      }
      set({
        session: data.session,
        user: data.user ? {
          id: data.user.id,
          email: data.user.email ?? '',
          display_name: data.user.user_metadata?.display_name ?? null,
          created_at: data.user.created_at,
        } : null,
      });
    } finally {
      set({ loading: false });
    }
  },

  signUp: async (email, password) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      // Don't set user/session — wait for email confirmation
      if (data.user && !data.user.email_confirmed_at) {
        await supabase.auth.signOut();
        throw new Error('EMAIL_CONFIRMATION_SENT');
      }
      set({
        session: data.session,
        user: data.user ? {
          id: data.user.id,
          email: data.user.email ?? '',
          display_name: null,
          created_at: data.user.created_at,
        } : null,
      });
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
  },

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user && session.user.email_confirmed_at) {
        set({
          session,
          user: {
            id: session.user.id,
            email: session.user.email ?? '',
            display_name: session.user.user_metadata?.display_name ?? null,
            created_at: session.user.created_at,
          },
        });
      }

      supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user && session.user.email_confirmed_at) {
          set({
            session,
            user: {
              id: session.user.id,
              email: session.user.email ?? '',
              display_name: session.user.user_metadata?.display_name ?? null,
              created_at: session.user.created_at,
            },
          });
        } else {
          set({ user: null, session: null });
        }
      });
    } catch {
      // Supabase not configured — app runs without auth
    } finally {
      set({ initialized: true });
    }
  },
}));
