import type { NextAuthConfig } from 'next-auth'

/**
 * Auth configuration that is safe to run in the Edge runtime (middleware).
 * Must NOT import Prisma, bcrypt, or any Node.js-only module.
 */
export const authConfig: NextAuthConfig = {
  session: { strategy: 'jwt' },
  providers: [],
  pages: { signIn: '/login' },
  // Trust the host in Vercel deployments or when AUTH_URL is explicitly set (local dev)
  trustHost: Boolean(process.env.VERCEL ?? process.env.AUTH_URL),
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const { pathname } = nextUrl

      const isDashboard =
        pathname.startsWith('/dashboard') ||
        pathname.startsWith('/overview') ||
        pathname.startsWith('/analytics') ||
        pathname.startsWith('/reports') ||
        pathname.startsWith('/alerts')

      if (isDashboard && !isLoggedIn) return false
      return true
    },
    jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    session({ session, token }) {
      if (token.id) session.user.id = token.id as string
      return session
    },
  },
}
