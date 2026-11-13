import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { router } from './routes'

export const app = express()

// Middlewares globales
app.use(helmet())
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL
    : 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Rutas
app.use('/api', router)

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' })
})
