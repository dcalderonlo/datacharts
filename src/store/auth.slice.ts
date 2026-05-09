import type { StateCreator } from 'zustand'

export interface AuthSlice {
  isAuthenticated: boolean
  userName: string | null
  setAuth: (isAuthenticated: boolean, userName?: string) => void
  clearAuth: () => void
}

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  isAuthenticated: false,
  userName: null,
  setAuth: (isAuthenticated, userName) => set({ isAuthenticated, userName: userName ?? null }),
  clearAuth: () => set({ isAuthenticated: false, userName: null }),
})
