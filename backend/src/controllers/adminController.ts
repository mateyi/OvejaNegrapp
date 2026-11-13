import { Response } from 'express'
import { prisma } from '../config/prisma'
import { AuthRequest } from '../middleware/auth'

export const getAdminStats = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'No autorizado' })

    if (req.user.role === 'ADMIN') {
      const [totalUsers, totalVenues, totalCourts, totalBookings, totalMatches] = await Promise.all([
        prisma.user.count(),
        prisma.venue.count(),
        prisma.court.count(),
        prisma.booking.count(),
        prisma.openMatch.count(),
      ])

      const recentBookings = await prisma.booking.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true } },
          court: true,
          venue: true,
        },
      })

      return res.json({
        type: 'PLATFORM_ADMIN',
        totalUsers,
        totalVenues,
        totalCourts,
        totalBookings,
        totalMatches,
        recentBookings,
      })
    }

    if (req.user.role === 'VENUE_ADMIN') {
      const myVenues = await prisma.venue.findMany({
        where: { adminId: req.user.id },
        include: {
          courts: true,
          bookings: {
            include: {
              user: { select: { id: true, name: true, email: true, phone: true } },
              court: true,
            },
            orderBy: { date: 'desc' },
          },
        },
      })

      return res.json({
        type: 'VENUE_ADMIN',
        venues: myVenues,
      })
    }

    res.status(403).json({ error: 'No tienes acceso al panel de administración.' })
  } catch (error: any) {
    res.status(500).json({ error: 'Error al consultar panel administrativo.' })
  }
}

