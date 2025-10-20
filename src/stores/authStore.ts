import { create } from 'zustand';
import { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  setAuth: (user: User | null, session: Session | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isAuthenticated: false,
  setAuth: (user, session) => set({ user, session, isAuthenticated: !!user }),
  logout: () => set({ user: null, session: null, isAuthenticated: false }),
}));
