import type { ReactNode } from 'react'

interface AuthTemplateProps {
  children: ReactNode
}

export function AuthTemplate({ children }: AuthTemplateProps) {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white tracking-tight">DataCharts</h1>
        <p className="text-gray-500 mt-2 text-sm">Enterprise Market Intelligence</p>
      </div>
      {children}
    </div>
  )
}
