// Service Worker for DataCharts Web Push Notifications
// Located at /public/sw.js — served from root by Next.js

self.addEventListener('push', (event) => {
  if (!event.data) return

  let payload
  try {
    payload = event.data.json()
  } catch {
    payload = { title: 'DataCharts', body: event.data.text() }
  }

  const options = {
    body: payload.body ?? payload.message ?? '',
    icon: '/icon-192.png',
    badge: '/icon-96.png',
    tag: payload.alertId ?? 'datacharts-notification',
    renotify: true,
    data: { url: payload.url ?? '/alerts' },
  }

  event.waitUntil(
    self.registration.showNotification(payload.title ?? 'DataCharts Alert', options)
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification.data?.url ?? '/alerts'
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus()
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url)
      }
    })
  )
})
