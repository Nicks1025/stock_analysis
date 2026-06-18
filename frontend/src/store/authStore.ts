/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  roles: string[];
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (tokens: { accessToken: string; refreshToken: string }, user: User) => void;
  logout: () => void;
  updateTokens: (accessToken: string, refreshToken?: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      login: (tokens, user) => set({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user,
        isAuthenticated: true
      }),
      logout: () => set({
        accessToken: null,
        refreshToken: null,
        user: null,
        isAuthenticated: false
      }),
      updateTokens: (accessToken, refreshToken) => set((prev) => ({
        accessToken,
        refreshToken: refreshToken || prev.refreshToken
      }))
    }),
    {
      name: 'stocksense-auth-storage',
      partialize: (state) => ({ 
        accessToken: state.accessToken, 
        refreshToken: state.refreshToken, 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
