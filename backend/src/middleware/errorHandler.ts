import { Request, Response, NextFunction } from 'express'

interface AppError extends Error {
  statusCode?: number
  errors?: Record<string, string[]>
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Error interno del servidor'

  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err)
  }

  res.status(statusCode).json({
    message,
    ...(err.errors && { errors: err.errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public errors?: Record<string, string[]>
  ) {
    super(message)
    this.name = 'ApiError'
  }
}
