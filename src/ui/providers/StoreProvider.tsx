'use client'
import { createContext, useContext, useRef, type ReactNode } from 'react'
import { useStore } from 'zustand'
import { createStore, type RootStore, type StoreType } from '@/store'

const StoreContext = createContext<StoreType | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<StoreType | null>(null)
  if (!storeRef.current) storeRef.current = createStore()
  return <StoreContext.Provider value={storeRef.current}>{children}</StoreContext.Provider>
}

export function useAppStore<T>(selector: (state: RootStore) => T): T {
  const store = useContext(StoreContext)
  if (!store) throw new Error('useAppStore must be used within StoreProvider')
  return useStore(store, selector)
}
