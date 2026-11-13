// =====================
// Enums
// =====================

export type UserRole = 'PLAYER' | 'VENUE_ADMIN' | 'ADMIN'
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED'
export type MatchStatus = 'OPEN' | 'FULL' | 'CANCELLED' | 'COMPLETED'
export type SportType = 'FUTBOL' | 'TENIS' | 'PADEL' | 'BASQUET' | 'VOLEY' | 'OTRO'
export type CourtType = 'INDOOR' | 'OUTDOOR' | 'SEMICUBIERTA'
export type DayOfWeek = 'LUNES' | 'MARTES' | 'MIERCOLES' | 'JUEVES' | 'VIERNES' | 'SABADO' | 'DOMINGO'

// =====================
// Entidades
// =====================

export interface User {
  id: string
  email: string
  name: string
  phone?: string
  role: UserRole
  createdAt: string
  updatedAt?: string
}

export interface Venue {
  id: string
  name: string
  description?: string
  address: string
  neighborhood?: string
  city: string
  phone?: string
  email?: string
  imageUrl?: string
  images: string[]
  openTime: string
  closeTime: string
  days: DayOfWeek[]
  isActive: boolean
  adminId: string
  admin?: User
  courts: Court[]
  createdAt: string
  updatedAt?: string
}

export interface Court {
  id: string
  name: string
  sport: SportType
  type: CourtType
  capacity: number
  pricePerHour: number
  description?: string
  imageUrl?: string
  venueId: string
  venue?: Venue
  schedules?: CourtSchedule[]
  createdAt: string
  updatedAt?: string
}

export interface CourtSchedule {
  id: string
  courtId: string
  court?: Court
  dayOfWeek: DayOfWeek
  openTime: string
  closeTime: string
  slotDuration: number
  isActive: boolean
}

export interface Booking {
  id: string
  userId: string
  user?: User
  courtId: string
  court: Court
  venueId: string
  venue: Venue
  date: string
  startTime: string
  endTime: string
  totalPrice: number
  status: BookingStatus
  notes?: string
  match?: OpenMatch
  createdAt: string
}

export interface OpenMatch {
  id: string
  organizerId: string
  organizer: User
  bookingId: string
  booking?: Booking
  courtId: string
  court: Court
  venueId: string
  venue: Venue
  title: string
  sport: SportType
  format: string
  totalPlayers: number
  confirmedPlayers: number
  description?: string
  estimatedPrice?: number
  status: MatchStatus
  date: string
  startTime: string
  endTime: string
  participants: MatchParticipant[]
  createdAt: string
}

export interface MatchParticipant {
  id: string
  matchId: string
  match?: OpenMatch
  userId: string
  user: User
  joinedAt: string
}

// =====================
// DTOs / Requests
// =====================

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
  phone?: string
}

export interface AuthResponse {
  token: string
  user: User
}
