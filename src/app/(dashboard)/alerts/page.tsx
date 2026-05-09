'use client'
import { useState } from 'react'
import { AlertForm } from '@/ui/organisms/AlertForm'
import { AlertList } from '@/ui/organisms/AlertList'

export default function AlertsPage() {
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <div className="p-6 flex flex-col gap-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Price Alerts</h1>
        <p className="text-gray-500 text-sm mt-1">
          Get notified when a stock hits your target price.
        </p>
      </div>

      <AlertForm onCreated={() => setRefreshKey((k) => k + 1)} />

      <section>
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">
          Your Alerts
        </h2>
        <AlertList refreshKey={refreshKey} />
      </section>
    </div>
  )
}
