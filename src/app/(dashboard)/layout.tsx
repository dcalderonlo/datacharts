import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { StoreProvider } from '@/ui/providers/StoreProvider'
import { DashboardTemplate } from '@/ui/templates/DashboardTemplate'

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <StoreProvider>
      <DashboardTemplate>{children}</DashboardTemplate>
    </StoreProvider>
  )
}
