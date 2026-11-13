import React, { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import type { Booking } from '@/types'
import {
  Calendar,
  Clock,
  MapPin,
  X,
  AlertCircle,
  CheckCircle2,
  Trophy,
} from 'lucide-react'

export const BookingsPage: React.FC = () => {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const res = await api.get<Booking[]>('/bookings/my')
      setBookings(res.data)
    } catch (err) {
      console.error('Error fetching bookings:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelBooking = async (id: string) => {
    if (!confirm('¿Estás seguro de cancelar esta reserva?')) return

    try {
      await api.patch(`/bookings/${id}/cancel`)
      setMessage({ type: 'success', text: 'Reserva cancelada correctamente.' })
      fetchBookings()
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Error al cancelar la reserva.' })
    }
  }

  return (
    <div className="min-h-screen bg-black text-white py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white tracking-tight">
            Mis Reservas y Turnos
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Consultá tus turnos activos, historial de partidos y estado de reservas.
          </p>
        </div>

        {message && (
          <div
            className={`p-4 rounded-xl mb-6 flex items-center justify-between text-xs font-semibold ${
              message.type === 'success'
                ? 'bg-lime-400/10 border border-lime-400/30 text-lime-400'
                : 'bg-red-500/10 border border-red-500/30 text-red-400'
            }`}
          >
            <div className="flex items-center gap-2">
              {message.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
            <button onClick={() => setMessage(null)} className="text-zinc-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-32 rounded-2xl bg-zinc-900 animate-pulse border border-zinc-800" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20 bg-zinc-950 rounded-2xl border border-zinc-800">
            <Calendar className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">Aún no tenés turnos reservados</h3>
            <p className="text-xs text-zinc-400 mb-4">
              Explorá las canchas disponibles en Mendoza y reservá tu horario.
            </p>
            <a
              href="/canchas"
              className="inline-block px-4 py-2 bg-lime-400 text-black font-bold text-xs rounded-xl"
            >
              Buscar Cancha
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const isCancelled = booking.status === 'CANCELLED'
              const dateFormatted = new Date(booking.date).toLocaleDateString('es-AR', {
                weekday: 'long',
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })

              return (
                <div
                  key={booking.id}
                  className={`p-6 rounded-2xl border bg-zinc-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                    isCancelled ? 'border-zinc-900 opacity-60' : 'border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          isCancelled
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                            : 'bg-lime-400/10 text-lime-400 border border-lime-400/20'
                        }`}
                      >
                        {isCancelled ? 'Cancelado' : 'Confirmado'}
                      </span>
                      {booking.match && (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          ⚽ Partido Abierto
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-white">
                      {booking.venue.name} — <span className="text-lime-400">{booking.court.name}</span>
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{booking.venue.address}, {booking.venue.city}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                        <span className="capitalize">{dateFormatted}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{booking.startTime} a {booking.endTime} hs</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 pt-4 sm:pt-0 border-t sm:border-t-0 border-zinc-900">
                    <div className="text-right">
                      <div className="text-[10px] text-zinc-400 uppercase">Total a abonar en cancha</div>
                      <div className="text-lg font-black text-white">
                        ${booking.totalPrice.toLocaleString('es-AR')}
                      </div>
                    </div>

                    {!isCancelled && (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-semibold transition-colors"
                      >
                        Cancelar Turno
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
