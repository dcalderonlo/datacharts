import type { ReactNode } from 'react'
import { auth } from '@/auth'
import { NavSidebar } from '@/ui/organisms/NavSidebar'

interface DashboardTemplateProps {
  children: ReactNode
}

export async function DashboardTemplate({ children }: DashboardTemplateProps) {
  const session = await auth()
  const userName = session?.user?.name ?? session?.user?.email ?? null

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
      <NavSidebar userName={userName} />
      <main className="flex-1 overflow-y-auto bg-gray-950">
        {children}
      </main>
    </div>
  )
}
