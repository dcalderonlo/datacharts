'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/ui/providers/StoreProvider'

const NAV_LINKS = [
  { href: '/overview', label: 'Overview', icon: '⊞' },
  { href: '/analytics', label: 'Analytics', icon: '📊' },
  { href: '/reports', label: 'Reports', icon: '📋' },
  { href: '/alerts', label: 'Alerts', icon: '🔔' },
]

interface NavSidebarProps {
  userName?: string | null
}

export function NavSidebar({ userName }: NavSidebarProps) {
  const pathname = usePathname()
  const sidebarOpen = useAppStore((s) => s.sidebarOpen)
  const toggleSidebar = useAppStore((s) => s.toggleSidebar)

  return (
    <motion.aside
      animate={{ width: sidebarOpen ? 220 : 64 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="flex-shrink-0 bg-gray-950 border-r border-gray-800 flex flex-col h-full overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
        <AnimatePresence>
          {sidebarOpen && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-white font-bold text-lg tracking-tight whitespace-nowrap"
            >
              DataCharts
            </motion.span>
          )}
        </AnimatePresence>
        <button
          onClick={toggleSidebar}
          className="text-gray-400 hover:text-white transition-colors p-1 rounded"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? '◂' : '▸'}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 flex flex-col gap-1 px-2">
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + '/')
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
                ${isActive
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-700/40'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'}
              `}
            >
              <span className="text-base flex-shrink-0">{link.icon}</span>
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="whitespace-nowrap"
                  >
                    {link.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {userName ? userName.charAt(0).toUpperCase() : 'U'}
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm text-gray-400 truncate whitespace-nowrap"
              >
                {userName ?? 'User'}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  )
}
