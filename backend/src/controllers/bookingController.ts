import { Response } from 'express'
import { prisma } from '../config/prisma'
import { AuthRequest } from '../middleware/auth'

export const getMyBookings = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'No autorizado' })

    const bookings = await (prisma as any).booking.findMany({
      where: { userId: req.user.id },
      include: {
        court: true,
        venue: true,
        match: true,
      },
      orderBy: { date: 'desc' },
    })

    res.json(bookings)
  } catch (error: any) {
    res.status(500).json({ error: 'Error al obtener tus reservas.' })
  }
}

export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'No autorizado' })

    const { courtId, venueId, date, startTime, endTime, notes } = req.body

    if (!courtId || !venueId || !date || !startTime || !endTime) {
      return res.status(400).json({ error: 'Faltan campos obligatorios para la reserva.' })
    }

    const court = await (prisma as any).court.findUnique({ where: { id: courtId } })
    if (!court) {
      return res.status(404).json({ error: 'Cancha no encontrada.' })
    }

    const bookingDate = new Date(`${date}T00:00:00.000Z`)

    const result = await (prisma as any).$transaction(async (tx: any) => {
      const existing = await tx.booking.findFirst({
        where: {
          courtId,
          date: bookingDate,
          startTime,
          status: { in: ['CONFIRMED', 'PENDING'] },
        },
      })

      if (existing) {
        throw new Error('El turno seleccionado ya no se encuentra disponible.')
      }

      const booking = await tx.booking.create({
        data: {
          userId: req.user!.id,
          courtId,
          venueId,
          date: bookingDate,
          startTime,
          endTime,
          totalPrice: court.pricePerHour,
          status: 'CONFIRMED',
          notes,
        },
        include: {
          court: true,
          venue: true,
        },
      })

      return booking
    })

    res.status(201).json(result)
  } catch (error: any) {
    console.error('Error creating booking:', error)
    res.status(400).json({ error: error.message || 'Error al crear la reserva.' })
  }
}

export const cancelBooking = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'No autorizado' })
    const id = req.params.id as string

    const booking = await (prisma as any).booking.findUnique({
      where: { id },
      include: { venue: true, match: true },
    })

    if (!booking) return res.status(404).json({ error: 'Reserva no encontrada.' })

    const isOwner = booking.userId === req.user.id
    const isVenueAdmin = booking.venue?.adminId === req.user.id
    const isAppAdmin = req.user.role === 'ADMIN'

    if (!isOwner && !isVenueAdmin && !isAppAdmin) {
      return res.status(403).json({ error: 'No tienes permiso para cancelar esta reserva.' })
    }

    await (prisma as any).$transaction(async (tx: any) => {
      await tx.booking.update({
        where: { id },
        data: { status: 'CANCELLED' },
      })

      if (booking.match) {
        await tx.openMatch.update({
          where: { id: booking.match.id },
          data: { status: 'CANCELLED' },
        })
      }
    })

    res.json({ message: 'Reserva cancelada con éxito.' })
  } catch (error: any) {
    res.status(500).json({ error: 'Error al cancelar la reserva.' })
  }
}

export const getVenueBookings = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'No autorizado' })
    const venueId = req.params.venueId as string

    const venue = await (prisma as any).venue.findUnique({ where: { id: venueId } })
    if (!venue) return res.status(404).json({ error: 'Complejo no encontrado.' })

    if (venue.adminId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Sin permisos sobre este complejo.' })
    }

    const bookings = await (prisma as any).booking.findMany({
      where: { venueId },
      include: {
        court: true,
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
        match: true,
      },
      orderBy: { date: 'desc' },
    })

    res.json(bookings)
  } catch (error: any) {
    res.status(500).json({ error: 'Error al consultar reservas del complejo.' })
  }
}
