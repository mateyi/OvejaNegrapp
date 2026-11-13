import { Request, Response } from 'express'
import { prisma } from '../config/prisma'
import { AuthRequest } from '../middleware/auth'

export const getVenues = async (req: Request, res: Response) => {
  try {
    const { city, neighborhood, sport, search } = req.query

    const where: any = { isActive: true }

    if (city && typeof city === 'string') {
      where.city = { contains: city, mode: 'insensitive' }
    }

    if (neighborhood && typeof neighborhood === 'string') {
      where.neighborhood = { contains: neighborhood, mode: 'insensitive' }
    }

    if (search && typeof search === 'string') {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { neighborhood: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (sport && typeof sport === 'string') {
      where.courts = {
        some: {
          sport: sport.toUpperCase() as any,
        },
      }
    }

    const venues = await (prisma as any).venue.findMany({
      where,
      include: {
        courts: true,
        _count: {
          select: { courts: true, bookings: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    res.json(venues)
  } catch (error: any) {
    console.error('Error fetching venues:', error)
    res.status(500).json({ error: 'Error al obtener complejos deportivos.' })
  }
}

export const getVenueById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string

    const venue = await (prisma as any).venue.findUnique({
      where: { id },
      include: {
        courts: {
          include: {
            schedules: true,
          },
        },
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    })

    if (!venue) {
      return res.status(404).json({ error: 'Complejo no encontrado.' })
    }

    res.json(venue)
  } catch (error: any) {
    res.status(500).json({ error: 'Error al obtener el complejo.' })
  }
}

export const createVenue = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'No autorizado' })

    const {
      name,
      description,
      address,
      neighborhood,
      city,
      phone,
      email,
      imageUrl,
      images,
      openTime,
      closeTime,
      days,
    } = req.body

    const venue = await (prisma as any).venue.create({
      data: {
        name,
        description,
        address,
        neighborhood,
        city,
        phone,
        email,
        imageUrl: imageUrl || images?.[0],
        images: images || [],
        openTime: openTime || '08:00',
        closeTime: closeTime || '23:00',
        days: days || ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO', 'DOMINGO'],
        adminId: req.user.id,
      },
    })

    res.status(201).json(venue)
  } catch (error: any) {
    res.status(500).json({ error: 'Error al crear el complejo.' })
  }
}

export const updateVenue = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string

    const venue = await (prisma as any).venue.findUnique({ where: { id } })
    if (!venue) return res.status(404).json({ error: 'Complejo no encontrado.' })

    if (req.user?.role !== 'ADMIN' && venue.adminId !== req.user?.id) {
      return res.status(403).json({ error: 'No tienes permiso para modificar este complejo.' })
    }

    const updated = await (prisma as any).venue.update({
      where: { id },
      data: req.body,
    })

    res.json(updated)
  } catch (error: any) {
    res.status(500).json({ error: 'Error al actualizar el complejo.' })
  }
}
