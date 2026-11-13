import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { router } from './routes'

export const app = express()

// Middlewares globales
app.use(helmet())
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health checks (tanto en /health como en /api/health y en la raíz /)
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'OvejaNegra API', timestamp: new Date().toISOString() })
})

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'OvejaNegra API', timestamp: new Date().toISOString() })
})

app.get('/', (_req, res) => {
  res.json({ message: 'Bienvenido a OvejaNegra API 🐑⚽', docs: '/api/venues, /api/matches' })
})

// Rutas principales bajo /api
app.use('/api', router)

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada', status: 404 })
})
