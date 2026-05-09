import type { StateCreator } from 'zustand'

export interface UiSlice {
  sidebarOpen: boolean
  activeChart: 'line' | 'bar' | 'doughnut'
  theme: 'dark' | 'light'
  toggleSidebar: () => void
  setActiveChart: (chart: 'line' | 'bar' | 'doughnut') => void
  setTheme: (theme: 'dark' | 'light') => void
}

export const createUiSlice: StateCreator<UiSlice> = (set) => ({
  sidebarOpen: true,
  activeChart: 'line',
  theme: 'dark',
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setActiveChart: (activeChart) => set({ activeChart }),
  setTheme: (theme) => set({ theme }),
})
