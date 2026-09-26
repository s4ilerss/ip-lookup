import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import handler from './api/lookup.js'

// vite doesnt run the vercel function, so in dev we call it ourselves on /api/lookup
function apiDev(env) {
  return {
    name: 'api-dev',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/lookup', async (req, res) => {
        process.env.API_KEY = env.API_KEY
        const { searchParams } = new URL(req.url, 'http://localhost')
        const fakeRes = {
          status(code) { res.statusCode = code; return this },
          json(body) {
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(body))
          }
        }
        try {
          await handler({ query: Object.fromEntries(searchParams) }, fakeRes)
        } catch (err) {
          console.error(err)
          fakeRes.status(500).json({ error: 'Lookup failed' })
        }
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '') // '' so we get API_KEY too, not just VITE_ ones
  return {
    plugins: [react(), apiDev(env)]
  }
})
