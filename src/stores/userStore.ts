import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthStoreState } from '../types/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set, get) => ({
      user: null,
      sessionToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_URL}/auth/login`, {
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
          const response = await fetch(`${API_URL}/auth/register`, {
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
          const response = await fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${sessionToken}`,
            },
          });

          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error);
          }

          set({
            user: null,
            sessionToken: null,
            isAuthenticated: false,
            isLoading: false,
          });
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
          const response = await fetch(`${API_URL}/auth/me`, {
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
        sessionToken: state.sessionToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
