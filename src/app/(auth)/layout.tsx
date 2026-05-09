import type { ReactNode } from 'react'
import { AuthTemplate } from '@/ui/templates/AuthTemplate'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return <AuthTemplate>{children}</AuthTemplate>
}
