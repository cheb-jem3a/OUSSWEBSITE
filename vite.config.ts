import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Studio cover capture save endpoint
 */
function saveThumbnailPlugin(): Plugin {
  return {
    name: 'save-thumbnail-middleware',
    configureServer(server) {
      server.middlewares.use('/api/save-thumbnail', (req, res) => {
        if (req.method === 'POST') {
          let body = ''
          req.on('data', (chunk) => {
            body += chunk
          })
          req.on('end', () => {
            try {
              const { filename, base64 } = JSON.parse(body)
              if (filename && base64) {
                const thumbnailsDir = path.resolve(__dirname, 'public/thumbnails')
                if (!fs.existsSync(thumbnailsDir)) {
                  fs.mkdirSync(thumbnailsDir, { recursive: true })
                }
                const base64Data = base64.replace(/^data:image\/\w+;base64,/, '')
                const buffer = Buffer.from(base64Data, 'base64')
                fs.writeFileSync(path.join(thumbnailsDir, filename), buffer)
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ success: true, file: filename }))
                return
              }
            } catch (err: unknown) {
              console.error('Error saving thumbnail:', err)
            }
            res.writeHead(400, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'Invalid payload' }))
          })
        } else {
          res.writeHead(405)
          res.end()
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), saveThumbnailPlugin()],
  server: {
    host: true,
    allowedHosts: true,
    headers: {
      'Accept-Ranges': 'bytes',
    },
  },
  preview: {
    headers: {
      'Accept-Ranges': 'bytes',
    },
  },
})
