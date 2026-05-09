import { createStore as zustandCreateStore } from 'zustand'
import { devtools } from 'zustand/middleware'
import { createMarketSlice, type MarketSlice } from './market.slice'
import { createAuthSlice, type AuthSlice } from './auth.slice'
import { createUiSlice, type UiSlice } from './ui.slice'
import { createWatchlistSlice, type WatchlistSlice } from './watchlist.slice'
import { createNotificationSlice, type NotificationSlice } from './notification.slice'

export type RootStore = MarketSlice & AuthSlice & UiSlice & WatchlistSlice & NotificationSlice

export const createStore = () =>
  zustandCreateStore<RootStore>()(
    devtools(
      (...a) => ({
        ...createMarketSlice(...a),
        ...createAuthSlice(...a),
        ...createUiSlice(...a),
        ...createWatchlistSlice(...a),
        ...createNotificationSlice(...a),
      }),
      { name: 'datacharts-store' }
    )
  )

export type StoreType = ReturnType<typeof createStore>
