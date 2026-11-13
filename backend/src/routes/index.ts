import { Router } from 'express'
import { authMiddleware, requireRole } from '../middleware/auth'
import * as authCtrl from '../controllers/authController'
import * as venueCtrl from '../controllers/venueController'
import * as courtCtrl from '../controllers/courtController'
import * as bookingCtrl from '../controllers/bookingController'
import * as matchCtrl from '../controllers/matchController'
import * as adminCtrl from '../controllers/adminController'

export const router = Router()

// ==================== AUTH ====================
router.post('/auth/register', authCtrl.register)
router.post('/auth/login', authCtrl.login)
router.get('/auth/me', authMiddleware, authCtrl.getMe)
router.put('/auth/profile', authMiddleware, authCtrl.updateProfile)

// ==================== VENUES ====================
router.get('/venues', venueCtrl.getVenues)
router.get('/venues/:id', venueCtrl.getVenueById)
router.post('/venues', authMiddleware, requireRole('VENUE_ADMIN', 'ADMIN'), venueCtrl.createVenue)
router.put('/venues/:id', authMiddleware, requireRole('VENUE_ADMIN', 'ADMIN'), venueCtrl.updateVenue)

// ==================== COURTS ====================
router.get('/venues/:venueId/courts', courtCtrl.getCourtsByVenue)
router.get('/courts/:id/availability', courtCtrl.getCourtAvailability)
router.post('/courts', authMiddleware, requireRole('VENUE_ADMIN', 'ADMIN'), courtCtrl.createCourt)

// ==================== BOOKINGS ====================
router.get('/bookings/my', authMiddleware, bookingCtrl.getMyBookings)
router.post('/bookings', authMiddleware, bookingCtrl.createBooking)
router.patch('/bookings/:id/cancel', authMiddleware, bookingCtrl.cancelBooking)
router.get('/venues/:venueId/bookings', authMiddleware, requireRole('VENUE_ADMIN', 'ADMIN'), bookingCtrl.getVenueBookings)

// ==================== OPEN MATCHES ====================
router.get('/matches', matchCtrl.getMatches)
router.get('/matches/:id', matchCtrl.getMatchById)
router.post('/matches', authMiddleware, matchCtrl.createMatch)
router.post('/matches/:id/join', authMiddleware, matchCtrl.joinMatch)
router.post('/matches/:id/leave', authMiddleware, matchCtrl.leaveMatch)
router.patch('/matches/:id/cancel', authMiddleware, matchCtrl.cancelMatch)

// ==================== ADMIN PANEL ====================
router.get('/admin/stats', authMiddleware, requireRole('VENUE_ADMIN', 'ADMIN'), adminCtrl.getAdminStats)
