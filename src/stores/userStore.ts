import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthStoreState } from '../types/auth';
import { API_BASE_URL } from '../config/api';

const DEV_MODE = import.meta.env.MODE === 'development';
const BYPASS_AUTH = import.meta.env.VITE_BYPASS_AUTH === 'true';

console.log('DEV_MODE', DEV_MODE);
console.log('BYPASS_AUTH', BYPASS_AUTH);

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set, get) => ({
      user: null,
      sessionToken: null,
      isAuthenticated: DEV_MODE && BYPASS_AUTH ? true : false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();
          if (!response.ok) throw new Error(data.error);

          set({
            user: data.user,
            sessionToken: data.session_token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          throw error;
        }
      },

      register: async (username: string, email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
          });

          const data = await response.json();
          if (!response.ok) throw new Error(data.error);

          set({
            user: data.user,
            isLoading: false,
          });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        const { sessionToken } = get();
        if (!sessionToken) return;

        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${sessionToken}`,
            },
          });

          set({
            user: null,
            sessionToken: null,
            isAuthenticated: false,
            isLoading: false,
          });

          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error);
          }
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });
          throw error;
        }
      },

      fetchUser: async () => {
        const { sessionToken } = get();
        if (!sessionToken) return;

        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
              Authorization: `Bearer ${sessionToken}`,
            },
          });

          const data = await response.json();
          if (!response.ok) throw new Error(data.error);

          set({
            user: data,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            user: null,
            sessionToken: null,
            isAuthenticated: false,
            error: (error as Error).message,
            isLoading: false,
          });
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        sessionToken: state.sessionToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
