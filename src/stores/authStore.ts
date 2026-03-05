import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../api/auth';
import { playersApi } from '../api/players';
import type { Player, RegisterRequest, LoginRequest } from '../types/domain';

interface AuthState {
  token: string | null;
  player: Player | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
  updatePlayer: (updates: Partial<Player>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      player: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (data) => {
        set({ isLoading: true });
        const res = await authApi.login(data);
        set({ token: res.access_token, isAuthenticated: true, isLoading: false });
        await get().fetchMe();
      },

      register: async (data) => {
        set({ isLoading: true });
        const res = await authApi.register(data);
        set({ token: res.access_token, isAuthenticated: true, isLoading: false });
        await get().fetchMe();
      },

      logout: () => {
        set({ token: null, player: null, isAuthenticated: false });
      },

      fetchMe: async () => {
        try {
          const player = await playersApi.getMe();
          set({ player });
        } catch {
          set({ token: null, player: null, isAuthenticated: false });
        }
      },

      updatePlayer: (updates) => {
        const current = get().player;
        if (current) set({ player: { ...current, ...updates } });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (s) => ({ token: s.token, isAuthenticated: s.isAuthenticated }),
    }
  )
);
