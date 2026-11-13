import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../config/prisma'
import { AuthRequest } from '../middleware/auth'

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, phone, role } = req.body

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, contraseña y nombre son requeridos.' })
    }

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ error: 'El email ya se encuentra registrado.' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const validRole = role === 'VENUE_ADMIN' ? 'VENUE_ADMIN' : 'PLAYER'

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        role: validRole,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    })

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'ovejanegra-secret',
      { expiresIn: '7d' }
    )

    res.status(201).json({ user, token })
  } catch (error: any) {
    console.error('Error in register:', error)
    res.status(500).json({ error: 'Error al registrar usuario.' })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña requeridos.' })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas.' })
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return res.status(401).json({ error: 'Credenciales inválidas.' })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'ovejanegra-secret',
      { expiresIn: '7d' }
    )

    const { password: _, ...userWithoutPassword } = user
    res.json({ user: userWithoutPassword, token })
  } catch (error: any) {
    console.error('Error in login:', error)
    res.status(500).json({ error: 'Error al iniciar sesión.' })
  }
}

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'No autorizado' })
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    })

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' })
    }

    res.json(user)
  } catch (error: any) {
    res.status(500).json({ error: 'Error al obtener usuario.' })
  }
}

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: 'No autorizado' })
    }

    const { name, phone, password } = req.body
    const updateData: any = {}

    if (name) updateData.name = name
    if (phone !== undefined) updateData.phone = phone
    if (password) {
      updateData.password = await bcrypt.hash(password, 10)
    }

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    })

    res.json(updated)
  } catch (error: any) {
    res.status(500).json({ error: 'Error al actualizar perfil.' })
  }
}
