import 'dotenv/config'

export const env = {
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-change-me',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  PORT: parseInt(process.env.PORT || '3001', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
} as const

// Validar variables críticas en producción
if (env.NODE_ENV === 'production') {
  const required = ['DATABASE_URL', 'JWT_SECRET'] as const
  for (const key of required) {
    if (!env[key]) {
      throw new Error(`Variable de entorno requerida faltante: ${key}`)
    }
  }
}

