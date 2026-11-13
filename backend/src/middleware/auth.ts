import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    role: string
  }
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token no proporcionado' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
      id: string
      email: string
      role: string
    }
    req.user = decoded
    next()
  } catch {
    return res.status(401).json({ message: 'Token inválido o expirado' })
  }
}

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'No autenticado' })
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Sin permisos suficientes' })
    }
    next()
  }
}
