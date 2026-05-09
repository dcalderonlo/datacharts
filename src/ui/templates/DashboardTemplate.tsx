import type { ReactNode } from 'react'
import { auth } from '@/auth'
import { NavSidebar } from '@/ui/organisms/NavSidebar'
import { NotificationBell } from '@/ui/organisms/NotificationBell'

interface DashboardTemplateProps {
  children: ReactNode
}

export async function DashboardTemplate({ children }: DashboardTemplateProps) {
  const session = await auth()
  const userName = session?.user?.name ?? session?.user?.email ?? null

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
      <NavSidebar userName={userName} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center justify-end px-6 py-3 border-b border-gray-800 bg-gray-950">
          <NotificationBell />
        </header>
        <main className="flex-1 overflow-y-auto bg-gray-950">
          {children}
        </main>
      </div>
    </div>
  )
}
