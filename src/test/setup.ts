import '@testing-library/jest-dom/vitest'
import { beforeAll, afterEach, afterAll } from 'vitest'
import { setGlobalOrigin } from 'undici'
import { server } from './msw/server'

beforeAll(() => {
  setGlobalOrigin('http://localhost')
  server.listen({ onUnhandledRequest: 'warn' })
})
afterEach(() => server.resetHandlers())
afterAll(() => {
  setGlobalOrigin(undefined)
  server.close()
})
