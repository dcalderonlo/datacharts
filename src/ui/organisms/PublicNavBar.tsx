export function PublicNavBar() {
  return (
    <nav className="sticky top-0 z-50 bg-gray-950/90 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <span className="text-white font-bold text-lg tracking-tight">dataCharts</span>
        <div className="flex items-center gap-3">
          <a
            href="/login"
            className="px-4 py-2 text-sm text-gray-300 hover:text-white rounded-lg transition"
          >
            Sign In
          </a>
          <a
            href="/register"
            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition"
          >
            Get Started
          </a>
        </div>
      </div>
    </nav>
  )
}
