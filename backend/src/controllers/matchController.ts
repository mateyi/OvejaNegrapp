import { Request, Response } from 'express'
import { prisma } from '../config/prisma'
import { AuthRequest } from '../middleware/auth'

export const getMatches = async (req: Request, res: Response) => {
  try {
    const { sport, format, status } = req.query

    const where: any = {}
    if (sport && typeof sport === 'string') {
      where.sport = sport.toUpperCase() as any
    }
    if (format && typeof format === 'string') {
      where.format = format
    }
    if (status && typeof status === 'string') {
      where.status = status.toUpperCase() as any
    } else {
      where.status = { in: ['OPEN', 'FULL'] }
    }

    const matches = await (prisma as any).openMatch.findMany({
      where,
      include: {
        venue: true,
        court: true,
        organizer: {
          select: { id: true, name: true, phone: true },
        },
        participants: {
          include: {
            user: {
              select: { id: true, name: true },
            },
          },
        },
      },
      orderBy: { date: 'asc' },
    })

    res.json(matches)
  } catch (error: any) {
    console.error('Error fetching matches:', error)
    res.status(500).json({ error: 'Error al obtener partidos abiertos.' })
  }
}

export const getMatchById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string

    const match = await (prisma as any).openMatch.findUnique({
      where: { id },
      include: {
        venue: true,
        court: true,
        organizer: {
          select: { id: true, name: true, phone: true },
        },
        participants: {
          include: {
            user: {
              select: { id: true, name: true },
            },
          },
        },
      },
    })

    if (!match) return res.status(404).json({ error: 'Partido no encontrado.' })

    res.json(match)
  } catch (error: any) {
    res.status(500).json({ error: 'Error al obtener detalle del partido.' })
  }
}

export const createMatch = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'No autorizado' })

    const {
      venueId,
      courtId,
      title,
      sport,
      format,
      totalPlayers,
      date,
      startTime,
      endTime,
      description,
    } = req.body

    if (!venueId || !courtId || !date || !startTime || !endTime || !totalPlayers) {
      return res.status(400).json({ error: 'Faltan datos obligatorios para el partido.' })
    }

    const court = await (prisma as any).court.findUnique({ where: { id: courtId } })
    if (!court) return res.status(404).json({ error: 'Cancha no encontrada.' })

    const matchDate = new Date(`${date}T00:00:00.000Z`)
    const estimatedPrice = Math.round(court.pricePerHour / Number(totalPlayers))

    const newMatch = await (prisma as any).$transaction(async (tx: any) => {
      const existingBooking = await tx.booking.findFirst({
        where: {
          courtId,
          date: matchDate,
          startTime,
          status: { in: ['CONFIRMED', 'PENDING'] },
        },
      })

      if (existingBooking) {
        throw new Error('La cancha ya está ocupada en ese horario.')
      }

      const booking = await tx.booking.create({
        data: {
          userId: req.user!.id,
          courtId,
          venueId,
          date: matchDate,
          startTime,
          endTime,
          totalPrice: court.pricePerHour,
          status: 'CONFIRMED',
          notes: `Partido abierto: ${title || 'Partido OvejaNegra'}`,
        },
      })

      const match = await tx.openMatch.create({
        data: {
          organizerId: req.user!.id,
          bookingId: booking.id,
          courtId,
          venueId,
          title: title || `Partido de ${sport || 'Fútbol'}`,
          sport: (sport || 'FUTBOL').toUpperCase() as any,
          format: format || '5v5',
          totalPlayers: Number(totalPlayers),
          confirmedPlayers: 1,
          estimatedPrice,
          description,
          status: 'OPEN',
          date: matchDate,
          startTime,
          endTime,
        },
      })

      await tx.matchParticipant.create({
        data: {
          matchId: match.id,
          userId: req.user!.id,
        },
      })

      return match
    })

    res.status(201).json(newMatch)
  } catch (error: any) {
    console.error('Error in createMatch:', error)
    res.status(400).json({ error: error.message || 'Error al crear partido.' })
  }
}

export const joinMatch = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'No autorizado' })
    const id = req.params.id as string

    const result = await (prisma as any).$transaction(async (tx: any) => {
      const match = await tx.openMatch.findUnique({
        where: { id },
        include: { participants: true },
      })

      if (!match) throw new Error('Partido no encontrado.')
      if (match.status === 'CANCELLED') throw new Error('El partido ha sido cancelado.')
      if (match.status === 'COMPLETED') throw new Error('El partido ya ha finalizado.')
      if (match.status === 'FULL' || match.confirmedPlayers >= match.totalPlayers) {
        throw new Error('El cupo para este partido ya está completo.')
      }

      const isAlreadyParticipant = match.participants.some((p: any) => p.userId === req.user!.id)
      if (isAlreadyParticipant) {
        throw new Error('Ya estás registrado en este partido.')
      }

      await tx.matchParticipant.create({
        data: {
          matchId: match.id,
          userId: req.user!.id,
        },
      })

      const newConfirmed = match.confirmedPlayers + 1
      const newStatus = newConfirmed >= match.totalPlayers ? 'FULL' : 'OPEN'

      const updated = await tx.openMatch.update({
        where: { id },
        data: {
          confirmedPlayers: newConfirmed,
          status: newStatus,
        },
        include: {
          venue: true,
          court: true,
          participants: {
            include: { user: { select: { id: true, name: true } } },
          },
        },
      })

      return updated
    })

    res.json(result)
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Error al unirse al partido.' })
  }
}

export const leaveMatch = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'No autorizado' })
    const id = req.params.id as string

    const result = await (prisma as any).$transaction(async (tx: any) => {
      const match = await tx.openMatch.findUnique({
        where: { id },
        include: { participants: true },
      })

      if (!match) throw new Error('Partido no encontrado.')
      if (match.organizerId === req.user!.id) {
        throw new Error('El organizador no puede abandonar su propio partido. Puede cancelarlo si lo desea.')
      }

      const participation = match.participants.find((p: any) => p.userId === req.user!.id)
      if (!participation) {
        throw new Error('No estabas inscripto en este partido.')
      }

      await tx.matchParticipant.delete({
        where: { id: participation.id },
      })

      const newConfirmed = Math.max(1, match.confirmedPlayers - 1)

      const updated = await tx.openMatch.update({
        where: { id },
        data: {
          confirmedPlayers: newConfirmed,
          status: 'OPEN',
        },
      })

      return updated
    })

    res.json({ message: 'Has abandonado el partido.', match: result })
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Error al abandonar el partido.' })
  }
}

export const cancelMatch = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'No autorizado' })
    const id = req.params.id as string

    const match = await (prisma as any).openMatch.findUnique({
      where: { id },
    })

    if (!match) return res.status(404).json({ error: 'Partido no encontrado.' })

    const isOrganizer = match.organizerId === req.user.id
    const isAppAdmin = req.user.role === 'ADMIN'

    if (!isOrganizer && !isAppAdmin) {
      return res.status(403).json({ error: 'Solo el organizador o el administrador pueden cancelar el partido.' })
    }

    await (prisma as any).$transaction(async (tx: any) => {
      await tx.openMatch.update({
        where: { id },
        data: { status: 'CANCELLED' },
      })

      await tx.booking.update({
        where: { id: match.bookingId },
        data: { status: 'CANCELLED' },
      })
    })

    res.json({ message: 'Partido y reserva asociada cancelados exitosamente.' })
  } catch (error: any) {
    res.status(500).json({ error: 'Error al cancelar el partido.' })
  }
}
