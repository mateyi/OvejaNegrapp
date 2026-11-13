import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import type { Venue, Court } from '@/types'
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Calendar as CalendarIcon,
  CheckCircle2,
  AlertCircle,
  Trophy,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react'

interface TimeSlot {
  time: string
  endTime: string
  available: boolean
  price: number
}

interface CourtAvailability {
  courtId: string
  courtName: string
  date: string
  slots: TimeSlot[]
}

export const VenueDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()

  const [venue, setVenue] = useState<Venue | null>(null)
  const [loading, setLoading] = useState(true)

  // Selección de reserva
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  )
  const [availability, setAvailability] = useState<CourtAvailability | null>(null)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)

  // Estado del proceso de confirmación
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [bookingError, setBookingError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Cargar datos del complejo
  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const res = await api.get<Venue>(`/venues/${id}`)
        setVenue(res.data)
        if (res.data.courts.length > 0) {
          setSelectedCourt(res.data.courts[0])
        }
      } catch (err) {
        console.error('Error fetching venue details:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchVenue()
  }, [id])

  // Cargar disponibilidad cuando cambia la cancha o la fecha
  useEffect(() => {
    if (!selectedCourt || !selectedDate) return

    const fetchAvailability = async () => {
      setLoadingSlots(true)
      setSelectedSlot(null)
      setBookingError(null)
      try {
        const res = await api.get<CourtAvailability>(
          `/courts/${selectedCourt.id}/availability?date=${selectedDate}`
        )
        setAvailability(res.data)
      } catch (err) {
        console.error('Error fetching availability:', err)
      } finally {
        setLoadingSlots(false)
      }
    }
    fetchAvailability()
  }, [selectedCourt, selectedDate])

  const handleConfirmBooking = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/canchas/${id}` } } })
      return
    }

    if (!selectedCourt || !selectedSlot || !venue) return

    setIsSubmitting(true)
    setBookingError(null)

    try {
      await api.post('/bookings', {
        courtId: selectedCourt.id,
        venueId: venue.id,
        date: selectedDate,
        startTime: selectedSlot.time,
        endTime: selectedSlot.endTime,
        notes: 'Reserva confirmada en web OvejaNegra',
      })

      setBookingSuccess(true)
    } catch (err: any) {
      setBookingError(err.response?.data?.error || 'No se pudo completar la reserva. El turno podría haber sido ocupado.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading || !venue) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-lime-400" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ================= ENCABEZADO Y GALERÍA ESTILO ATC SPORTS ================= */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-lime-400/10 text-lime-400 text-xs font-bold uppercase mb-2">
                <ShieldCheck className="w-4 h-4" /> Complejo Verificado
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                {venue.name}
              </h1>
              <p className="text-sm text-zinc-400 flex items-center gap-1.5 mt-2">
                <MapPin className="w-4 h-4 text-lime-400" />
                {venue.address}, {venue.neighborhood}, {venue.city}
              </p>
            </div>

            <div className="flex flex-col sm:items-end gap-1">
              <span className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">
                Horario de atención
              </span>
              <span className="text-base font-bold text-white flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-lime-400" />
                {venue.openTime} a {venue.closeTime} hs
              </span>
            </div>
          </div>

          {/* GALERÍA DE FOTOS EN GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-2xl overflow-hidden border border-zinc-800">
            <div className="sm:col-span-2 h-72 sm:h-96 bg-zinc-900">
              <img
                src={venue.imageUrl || venue.images?.[0]}
                alt={venue.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 h-72 sm:h-96">
              <div className="h-full bg-zinc-900 overflow-hidden">
                <img
                  src={venue.images?.[1] || venue.imageUrl}
                  alt={venue.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="h-full bg-zinc-900 overflow-hidden">
                <img
                  src={venue.images?.[2] || venue.imageUrl}
                  alt={venue.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ================= DETALLES Y SERVICIOS ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800">
              <h2 className="text-lg font-bold text-white mb-3">Sobre el complejo</h2>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {venue.description}
              </p>
            </div>

            <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800">
              <h2 className="text-lg font-bold text-white mb-4">Servicios e Instalaciones</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-zinc-300">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-900 border border-zinc-800/80">
                  <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
                  <span>Vestuarios y duchas</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-900 border border-zinc-800/80">
                  <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
                  <span>Iluminación LED pro</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-900 border border-zinc-800/80">
                  <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
                  <span>Estacionamiento</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-900 border border-zinc-800/80">
                  <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
                  <span>Cantina & Quincho</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-900 border border-zinc-800/80">
                  <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
                  <span>Pelotas y pecheras</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-900 border border-zinc-800/80">
                  <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
                  <span>WiFi en el club house</span>
                </div>
              </div>
            </div>
          </div>

          {/* TARJETA DE CONTACTO RÁPIDO */}
          <div className="space-y-4">
            <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Información de Contacto
              </h3>
              {venue.phone && (
                <div className="flex items-center gap-3 text-sm text-zinc-300">
                  <div className="w-9 h-9 rounded-lg bg-zinc-900 flex items-center justify-center text-lime-400 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-zinc-400 uppercase">Teléfono</div>
                    <div className="font-semibold">{venue.phone}</div>
                  </div>
                </div>
              )}
              {venue.email && (
                <div className="flex items-center gap-3 text-sm text-zinc-300">
                  <div className="w-9 h-9 rounded-lg bg-zinc-900 flex items-center justify-center text-lime-400 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-zinc-400 uppercase">Email</div>
                    <div className="font-semibold text-xs">{venue.email}</div>
                  </div>
                </div>
              )}
              <div className="p-3 rounded-xl bg-zinc-900 text-xs text-zinc-400">
                💡 <span className="font-semibold text-white">Importante:</span> El pago del turno se realiza en recepción del complejo al momento del ingreso.
              </div>
            </div>
          </div>
        </div>

        {/* ================= SISTEMA DE RESERVAS DE HORARIOS (EXPERIENCIA ATC SPORTS) ================= */}
        <div id="reservas" className="bg-zinc-950 rounded-3xl border border-zinc-800 p-6 sm:p-10 shadow-2xl">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 text-lime-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" /> Turnos Disponibles en Vivo
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Reservá tu Cancha
            </h2>
            <p className="text-sm text-zinc-400 mt-1">
              Seleccioná la cancha, la fecha deseada y hacé clic en un horario libre.
            </p>
          </div>

          {bookingSuccess ? (
            <div className="p-8 rounded-2xl bg-zinc-900 border border-lime-400/40 text-center max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-lime-400/20 text-lime-400 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">¡Reserva Confirmada!</h3>
              <p className="text-sm text-zinc-300 mb-6">
                Tu turno para <span className="font-bold text-white">{selectedCourt?.name}</span> el día{' '}
                <span className="font-bold text-lime-400">{selectedDate}</span> a las{' '}
                <span className="font-bold text-lime-400">{selectedSlot?.time} hs</span> quedó registrado.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setBookingSuccess(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-white font-medium"
                >
                  Hacer otra reserva
                </button>
                <button
                  onClick={() => navigate('/mis-reservas')}
                  className="px-4 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-black text-xs font-bold"
                >
                  Ver mis turnos
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* COLUMNA 1 & 2: SELECCIÓN DE CANCHA, FECHA Y GRILLA */}
              <div className="lg:col-span-2 space-y-6">
                {/* 1. SELECCIÓN DE CANCHA */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    1. Elegí la cancha:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {venue.courts.map((court) => {
                      const isSelected = selectedCourt?.id === court.id
                      return (
                        <button
                          key={court.id}
                          type="button"
                          onClick={() => setSelectedCourt(court)}
                          className={`p-4 rounded-xl border text-left transition-all relative ${
                            isSelected
                              ? 'border-lime-400 bg-lime-400/10 shadow-lg shadow-lime-400/5'
                              : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700'
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-lime-400" />
                          )}
                          <div className="text-[10px] uppercase font-bold text-zinc-400">
                            {court.sport} • {court.type}
                          </div>
                          <div className="font-bold text-sm text-white mt-1 mb-2">
                            {court.name}
                          </div>
                          <div className="text-xs font-semibold text-lime-400">
                            ${court.pricePerHour.toLocaleString('es-AR')}/h
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* 2. SELECCIÓN DE FECHA */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                    2. Fecha del partido:
                  </label>
                  <div className="relative max-w-xs">
                    <CalendarIcon className="w-4 h-4 text-lime-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      value={selectedDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white font-medium focus:outline-none focus:border-lime-400 [color-scheme:dark]"
                    />
                  </div>
                </div>

                {/* 3. GRILLA DE HORARIOS */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>3. Horarios disponibles ({selectedDate}):</span>
                    <span className="text-[11px] text-zinc-400 font-normal">
                      Verde = Libre • Gris = Ocupado
                    </span>
                  </label>

                  {loadingSlots ? (
                    <div className="h-40 rounded-xl bg-zinc-900 animate-pulse border border-zinc-800" />
                  ) : !availability || availability.slots.length === 0 ? (
                    <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800 text-center text-xs text-zinc-400">
                      No hay horarios configurados para esta fecha.
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
                      {availability.slots.map((slot) => {
                        const isSelected = selectedSlot?.time === slot.time
                        return (
                          <button
                            key={slot.time}
                            type="button"
                            disabled={!slot.available}
                            onClick={() => setSelectedSlot(slot)}
                            className={`p-3 rounded-xl text-center text-xs font-bold transition-all ${
                              !slot.available
                                ? 'bg-zinc-900/40 text-zinc-600 border border-zinc-900 cursor-not-allowed line-through'
                                : isSelected
                                ? 'bg-lime-400 text-black border-lime-400 shadow-md shadow-lime-400/20 scale-105'
                                : 'bg-zinc-900 text-white border border-zinc-800 hover:border-lime-400/50 hover:bg-zinc-800'
                            }`}
                          >
                            <div>{slot.time}</div>
                            <div className="text-[10px] font-normal opacity-80 mt-0.5">
                              {slot.available ? 'Libre' : 'Ocupado'}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* COLUMNA 3: RESUMEN DE LA RESERVA */}
              <div className="bg-zinc-900/80 p-6 rounded-2xl border border-zinc-800 flex flex-col justify-between h-fit">
                <div>
                  <h3 className="text-base font-bold text-white mb-4 pb-3 border-b border-zinc-800">
                    Resumen de tu Turno
                  </h3>

                  <div className="space-y-3 text-xs mb-6">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Complejo:</span>
                      <span className="font-semibold text-white text-right">{venue.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Cancha:</span>
                      <span className="font-semibold text-white">
                        {selectedCourt?.name || 'No seleccionada'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Fecha:</span>
                      <span className="font-semibold text-white">{selectedDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Horario:</span>
                      <span className="font-semibold text-lime-400">
                        {selectedSlot ? `${selectedSlot.time} a ${selectedSlot.endTime} hs` : 'Elegí un horario'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Pago:</span>
                      <span className="font-semibold text-zinc-300">En el complejo (Efectivo / MP)</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-black border border-zinc-800 mb-6 flex justify-between items-center">
                    <span className="text-xs text-zinc-400 font-semibold uppercase">Total a pagar:</span>
                    <span className="text-xl font-black text-lime-400">
                      ${selectedCourt?.pricePerHour.toLocaleString('es-AR') || 0}
                    </span>
                  </div>

                  {bookingError && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2 mb-4">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{bookingError}</span>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  disabled={!selectedSlot || isSubmitting}
                  onClick={handleConfirmBooking}
                  className="w-full py-3.5 px-4 rounded-xl bg-lime-400 hover:bg-lime-300 disabled:opacity-40 disabled:hover:bg-lime-400 text-black font-extrabold text-sm flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] shadow-xl shadow-lime-400/20"
                >
                  {isSubmitting
                    ? 'Procesando...'
                    : !isAuthenticated
                    ? 'Ingresar para confirmar reserva'
                    : 'Confirmar Reserva'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

