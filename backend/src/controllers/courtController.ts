import { Request, Response } from 'express'
import { prisma } from '../config/prisma'
import { AuthRequest } from '../middleware/auth'

export const getCourtsByVenue = async (req: Request, res: Response) => {
  try {
    const venueId = req.params.venueId as string
    const courts = await (prisma as any).court.findMany({
      where: { venueId },
      include: { schedules: true },
    })
    res.json(courts)
  } catch (error: any) {
    res.status(500).json({ error: 'Error al obtener canchas.' })
  }
}

export const getCourtAvailability = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string
    const date = req.query.date as string

    if (!date) {
      return res.status(400).json({ error: 'Parámetro date (YYYY-MM-DD) requerido.' })
    }

    const court = await (prisma as any).court.findUnique({
      where: { id },
      include: {
        venue: true,
        schedules: true,
      },
    })

    if (!court) {
      return res.status(404).json({ error: 'Cancha no encontrada.' })
    }

    const parsedDate = new Date(`${date}T00:00:00.000Z`)

    const existingBookings = await (prisma as any).booking.findMany({
      where: {
        courtId: id,
        date: parsedDate,
        status: { in: ['CONFIRMED', 'PENDING'] },
      },
      select: {
        startTime: true,
        endTime: true,
        status: true,
      },
    })

    const occupiedHours = new Set(existingBookings.map((b: any) => b.startTime))

    const startHour = parseInt(court.venue.openTime.split(':')[0], 10)
    let endHour = parseInt(court.venue.closeTime.split(':')[0], 10)
    if (endHour <= startHour) {
      endHour += 24
    }

    const slots = []
    for (let h = startHour; h < endHour; h++) {
      const displayHour = h % 24
      const nextDisplayHour = (h + 1) % 24
      const timeStr = `${displayHour.toString().padStart(2, '0')}:00`
      const nextTimeStr = `${nextDisplayHour.toString().padStart(2, '0')}:00`

      slots.push({
        time: timeStr,
        endTime: nextTimeStr,
        available: !occupiedHours.has(timeStr),
        price: court.pricePerHour,
      })
    }

    res.json({
      courtId: court.id,
      courtName: court.name,
      date,
      slots,
    })
  } catch (error: any) {
    console.error('Error in court availability:', error)
    res.status(500).json({ error: 'Error al consultar disponibilidad.' })
  }
}

export const createCourt = async (req: AuthRequest, res: Response) => {
  try {
    const { venueId, name, sport, type, capacity, pricePerHour, description, imageUrl } = req.body

    const venue = await (prisma as any).venue.findUnique({ where: { id: venueId } })
    if (!venue) return res.status(404).json({ error: 'Complejo no encontrado.' })

    if (req.user?.role !== 'ADMIN' && venue.adminId !== req.user?.id) {
      return res.status(403).json({ error: 'No autorizado para agregar canchas a este complejo.' })
    }

    const court = await (prisma as any).court.create({
      data: {
        name,
        sport: sport.toUpperCase() as any,
        type: type.toUpperCase() as any,
        capacity: Number(capacity) || 10,
        pricePerHour: Number(pricePerHour),
        description,
        imageUrl,
        venueId,
      },
    })

    res.status(201).json(court)
  } catch (error: any) {
    res.status(500).json({ error: 'Error al crear la cancha.' })
  }
}
