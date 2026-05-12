'use client'
import { createContext, useContext, useRef, type ReactNode } from 'react'
import { useStore } from 'zustand'
import { createStore, type RootStore, type StoreType } from '@/store'
import { usePushNotifications } from '@/ui/hooks/usePushNotifications'

const StoreContext = createContext<StoreType | null>(null)

function PushRegistrar() {
  usePushNotifications()
  return null
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<StoreType | null>(null)
  if (storeRef.current == null) storeRef.current = createStore()
  // eslint-disable-next-line react-hooks/refs -- storeRef.current is guaranteed non-null after lazy-init above; this is the recommended SSR-safe Zustand pattern
  const store = storeRef.current
  return (
    <StoreContext.Provider value={store}>
      <PushRegistrar />
      {children}
    </StoreContext.Provider>
  )
}

export function useAppStore<T>(selector: (state: RootStore) => T): T {
  const store = useContext(StoreContext)
  if (!store) throw new Error('useAppStore must be used within StoreProvider')
  return useStore(store, selector)
}
