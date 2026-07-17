import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Load .env for local dev so process.env.GROQ_API_KEY reaches the API
// middleware below (Vercel injects real env vars itself in production).
try {
  process.loadEnvFile()
} catch {
  // no .env file present — fine in prod or CI
}

// Mounts our /api/* Vercel-style serverless functions directly in Vite's dev
// server, so `npm run dev` works end-to-end without needing `vercel dev`.
function apiDevMiddleware() {
  return {
    name: 'api-dev-middleware',
    configureServer(server) {
      server.middlewares.use('/api/breakdown', async (req, res) => {
        const { default: handler } = await server.ssrLoadModule('/api/breakdown.js')

        if (req.method === 'POST') {
          const chunks = []
          for await (const chunk of req) chunks.push(chunk)
          req.body = chunks.length ? JSON.parse(Buffer.concat(chunks).toString()) : {}
        }

        res.status = (code) => {
          res.statusCode = code
          return res
        }
        res.json = (payload) => {
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(payload))
        }

        await handler(req, res)
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), apiDevMiddleware()],
})
