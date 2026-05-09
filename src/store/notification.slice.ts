import type { StateCreator } from 'zustand'

export interface AppNotification {
  id: string
  title: string
  message: string
  read: boolean
  createdAt: string
  alertId?: string
}

export interface NotificationSlice {
  notifications: AppNotification[]
  unreadCount: number
  fetchNotifications: () => Promise<void>
  markRead: (id: string) => Promise<void>
  markAllRead: () => Promise<void>
}

export const createNotificationSlice: StateCreator<NotificationSlice> = (set) => ({
  notifications: [],
  unreadCount: 0,
  fetchNotifications: async () => {
    const res = await fetch('/api/notifications')
    const json = await res.json()
    const notifications: AppNotification[] = json.data ?? []
    set({ notifications, unreadCount: notifications.filter((n) => !n.read).length })
  },
  markRead: async (id) => {
    await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' })
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }))
  },
  markAllRead: async () => {
    await fetch('/api/notifications/read-all', { method: 'PATCH' })
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }))
  },
})
