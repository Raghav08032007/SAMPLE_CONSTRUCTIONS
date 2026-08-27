import { create } from 'zustand';
import { supabase } from './supabase';
import { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialize: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,
  initialize: async () => {
    try {
      const { data } = await supabase.auth.getSession();
      set({ user: data.session?.user || null, session: data.session || null, loading: false });

      supabase.auth.onAuthStateChange((_event, session) => {
        set({ user: session?.user || null, session: session || null, loading: false });
      });
    } catch (err) {
      set({ user: null, session: null, loading: false });
    }
  },
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
  },
}));
