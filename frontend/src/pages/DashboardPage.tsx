import React, { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import type { Venue, Booking } from '@/types'
import {
  LayoutDashboard,
  Calendar,
  DollarSign,
  Plus,
  Users,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  X,
  Trophy,
} from 'lucide-react'

export const DashboardPage: React.FC = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Crear nueva cancha
  const [courtModalOpen, setCourtModalOpen] = useState(false)
  const [selectedVenueId, setSelectedVenueId] = useState('')
  const [courtName, setCourtName] = useState('')
  const [courtSport, setCourtSport] = useState('FUTBOL')
  const [courtType, setCourtType] = useState('OUTDOOR')
  const [courtCapacity, setCourtCapacity] = useState(10)
  const [courtPrice, setCourtPrice] = useState(20000)
  const [courtDescription, setCourtDescription] = useState('')
  const [courtSubmitting, setCourtSubmitting] = useState(false)

  // Mensajes
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    setLoading(true)
    try {
      const res = await api.get('/admin/stats')
      setStats(res.data)
      if (res.data.venues && res.data.venues.length > 0) {
        setSelectedVenueId(res.data.venues[0].id)
      }
    } catch (err: any) {
      console.error('Error fetching admin stats:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCourt = async (e: React.FormEvent) => {
    e.preventDefault()
    setCourtSubmitting(true)
    try {
      await api.post('/courts', {
        venueId: selectedVenueId,
        name: courtName,
        sport: courtSport,
        type: courtType,
        capacity: Number(courtCapacity),
        pricePerHour: Number(courtPrice),
        description: courtDescription,
      })

      setCourtModalOpen(false)
      setFeedback({ type: 'success', text: '¡Nueva cancha creada con éxito!' })
      setCourtName('')
      setCourtDescription('')
      fetchStats()
    } catch (err: any) {
      setFeedback({ type: 'error', text: err.response?.data?.error || 'Error al crear cancha.' })
    } finally {
      setCourtSubmitting(false)
    }
  }

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('¿Desea cancelar esta reserva desde la administración del complejo?')) return
    try {
      await api.patch(`/bookings/${bookingId}/cancel`)
      setFeedback({ type: 'success', text: 'Reserva cancelada.' })
      fetchStats()
    } catch (err: any) {
      setFeedback({ type: 'error', text: 'Error al cancelar reserva.' })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-lime-400" />
      </div>
    )
  }

  const isSuperAdmin = stats?.type === 'PLATFORM_ADMIN'

  return (
    <div className="min-h-screen bg-black text-white py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ENCABEZADO */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-lime-400/10 text-lime-400 text-xs font-bold uppercase mb-2">
              <LayoutDashboard className="w-4 h-4" />
              {isSuperAdmin ? 'Administración General de la Plataforma' : 'Panel de Administración de Complejo'}
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Panel de Control
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              Bienvenido, {user?.name}. Supervisá canchas, tarifas y reservas en vivo.
            </p>
          </div>

          {!isSuperAdmin && stats?.venues?.length > 0 && (
            <button
              onClick={() => setCourtModalOpen(true)}
              className="py-2.5 px-4 rounded-xl bg-lime-400 hover:bg-lime-300 text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-lime-400/20"
            >
              <Plus className="w-4 h-4" /> Agregar Cancha
            </button>
          )}
        </div>

        {feedback && (
          <div
            className={`p-4 rounded-xl mb-6 flex items-center justify-between text-xs font-semibold ${
              feedback.type === 'success'
                ? 'bg-lime-400/10 border border-lime-400/30 text-lime-400'
                : 'bg-red-500/10 border border-red-500/30 text-red-400'
            }`}
          >
            <div className="flex items-center gap-2">
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{feedback.text}</span>
            </div>
            <button onClick={() => setFeedback(null)} className="text-zinc-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* MÉTRICAS SUPER ADMIN */}
        {isSuperAdmin ? (
          <div className="space-y-8">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800">
                <div className="text-[11px] font-semibold text-zinc-400 uppercase">Usuarios</div>
                <div className="text-3xl font-black text-white mt-1">{stats.totalUsers}</div>
              </div>
              <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800">
                <div className="text-[11px] font-semibold text-zinc-400 uppercase">Complejos</div>
                <div className="text-3xl font-black text-lime-400 mt-1">{stats.totalVenues}</div>
              </div>
              <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800">
                <div className="text-[11px] font-semibold text-zinc-400 uppercase">Canchas</div>
                <div className="text-3xl font-black text-white mt-1">{stats.totalCourts}</div>
              </div>
              <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800">
                <div className="text-[11px] font-semibold text-zinc-400 uppercase">Reservas</div>
                <div className="text-3xl font-black text-lime-400 mt-1">{stats.totalBookings}</div>
              </div>
              <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800">
                <div className="text-[11px] font-semibold text-zinc-400 uppercase">Partidos</div>
                <div className="text-3xl font-black text-white mt-1">{stats.totalMatches}</div>
              </div>
            </div>

            <div className="bg-zinc-950 rounded-2xl border border-zinc-800 p-6">
              <h2 className="text-lg font-bold text-white mb-4">Últimas 10 Reservas en el Sistema</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-zinc-800 text-zinc-400 uppercase text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Usuario</th>
                      <th className="py-3 px-4">Complejo</th>
                      <th className="py-3 px-4">Cancha</th>
                      <th className="py-3 px-4">Fecha & Hora</th>
                      <th className="py-3 px-4">Precio</th>
                      <th className="py-3 px-4">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900">
                    {stats.recentBookings.map((b: any) => (
                      <tr key={b.id} className="hover:bg-zinc-900/50">
                        <td className="py-3 px-4 font-semibold text-white">{b.user?.name}</td>
                        <td className="py-3 px-4 text-zinc-300">{b.venue?.name}</td>
                        <td className="py-3 px-4 text-zinc-400">{b.court?.name}</td>
                        <td className="py-3 px-4 text-zinc-300">
                          {new Date(b.date).toLocaleDateString('es-AR')} ({b.startTime} hs)
                        </td>
                        <td className="py-3 px-4 font-bold text-lime-400">${b.totalPrice.toLocaleString('es-AR')}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              b.status === 'CONFIRMED'
                                ? 'bg-lime-400/10 text-lime-400'
                                : 'bg-red-500/10 text-red-400'
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* PANEL DUEÑO DE COMPLEJO */
          <div className="space-y-8">
            {stats.venues?.map((v: any) => (
              <div key={v.id} className="bg-zinc-950 rounded-2xl border border-zinc-800 p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-800 gap-3">
                  <div>
                    <h2 className="text-2xl font-bold text-white">{v.name}</h2>
                    <p className="text-xs text-zinc-400 flex items-center gap-1.5 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-lime-400" />
                      {v.address}, {v.neighborhood}, {v.city}
                    </p>
                  </div>
                  <div className="text-xs text-zinc-400">
                    Horario de atención: <span className="font-bold text-white">{v.openTime} a {v.closeTime} hs</span>
                  </div>
                </div>

                {/* CANCHAS REGISTRADAS */}
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
                    Canchas y Tarifas ({v.courts.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {v.courts.map((court: any) => (
                      <div
                        key={court.id}
                        className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between"
                      >
                        <div>
                          <div className="text-[10px] uppercase font-bold text-zinc-400">
                            {court.sport} • {court.type}
                          </div>
                          <div className="text-sm font-bold text-white mt-1">{court.name}</div>
                          <p className="text-[11px] text-zinc-400 mt-1 line-clamp-1">{court.description}</p>
                        </div>
                        <div className="mt-3 pt-2 border-t border-zinc-800/80 flex justify-between items-center text-xs">
                          <span className="text-zinc-400">Tarifa turno:</span>
                          <span className="font-bold text-lime-400">
                            ${court.pricePerHour.toLocaleString('es-AR')}/h
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CALENDARIO DE RESERVAS DEL COMPLEJO */}
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
                    Reservas Registradas ({v.bookings.length})
                  </h3>
                  {v.bookings.length === 0 ? (
                    <div className="p-8 rounded-xl bg-zinc-900 text-center text-xs text-zinc-400">
                      No hay reservas registradas aún para este complejo.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="border-b border-zinc-800 text-zinc-400 uppercase text-[10px]">
                          <tr>
                            <th className="py-2.5 px-3">Cliente</th>
                            <th className="py-2.5 px-3">Contacto</th>
                            <th className="py-2.5 px-3">Cancha</th>
                            <th className="py-2.5 px-3">Fecha & Turno</th>
                            <th className="py-2.5 px-3">Importe</th>
                            <th className="py-2.5 px-3">Estado</th>
                            <th className="py-2.5 px-3 text-right">Acción</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-900">
                          {v.bookings.map((b: any) => (
                            <tr key={b.id} className="hover:bg-zinc-900/50">
                              <td className="py-2.5 px-3 font-semibold text-white">{b.user?.name}</td>
                              <td className="py-2.5 px-3 text-zinc-400">{b.user?.phone || b.user?.email}</td>
                              <td className="py-2.5 px-3 text-zinc-300">{b.court?.name}</td>
                              <td className="py-2.5 px-3 text-zinc-300">
                                {new Date(b.date).toLocaleDateString('es-AR')} ({b.startTime} hs)
                              </td>
                              <td className="py-2.5 px-3 font-bold text-lime-400">
                                ${b.totalPrice.toLocaleString('es-AR')}
                              </td>
                              <td className="py-2.5 px-3">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                    b.status === 'CONFIRMED'
                                      ? 'bg-lime-400/10 text-lime-400'
                                      : 'bg-red-500/10 text-red-400'
                                  }`}
                                >
                                  {b.status}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-right">
                                {b.status === 'CONFIRMED' && (
                                  <button
                                    onClick={() => handleCancelBooking(b.id)}
                                    className="px-2 py-1 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 text-[10px] font-semibold"
                                  >
                                    Cancelar
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MODAL CREAR CANCHA */}
        {courtModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="w-full max-w-md bg-zinc-950 p-6 sm:p-8 rounded-3xl border border-zinc-800 shadow-2xl relative">
              <button
                onClick={() => setCourtModalOpen(false)}
                className="absolute top-5 right-5 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-black text-white mb-1">
                Agregar Cancha al Complejo
              </h2>
              <p className="text-xs text-zinc-400 mb-6">
                Configurá nombre, deporte y tarifa por hora.
              </p>

              <form onSubmit={handleCreateCourt} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                    Nombre de la Cancha
                  </label>
                  <input
                    type="text"
                    required
                    value={courtName}
                    onChange={(e) => setCourtName(e.target.value)}
                    placeholder="Ej: Cancha 4 - Techada"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-lime-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                      Deporte
                    </label>
                    <select
                      value={courtSport}
                      onChange={(e) => setCourtSport(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-lime-400"
                    >
                      <option value="FUTBOL">Fútbol</option>
                      <option value="PADEL">Pádel</option>
                      <option value="TENIS">Tenis</option>
                      <option value="BASQUET">Básquet</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                      Tipo
                    </label>
                    <select
                      value={courtType}
                      onChange={(e) => setCourtType(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-lime-400"
                    >
                      <option value="OUTDOOR">Descubierta</option>
                      <option value="INDOOR">Cubierta (Techada)</option>
                      <option value="SEMICUBIERTA">Semicubierta</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                      Capacidad Jugadores
                    </label>
                    <input
                      type="number"
                      required
                      min={2}
                      max={30}
                      value={courtCapacity}
                      onChange={(e) => setCourtCapacity(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-lime-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                      Precio por Hora ($)
                    </label>
                    <input
                      type="number"
                      required
                      step={500}
                      value={courtPrice}
                      onChange={(e) => setCourtPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-lime-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                    Descripción / Características
                  </label>
                  <input
                    type="text"
                    value={courtDescription}
                    onChange={(e) => setCourtDescription(e.target.value)}
                    placeholder="Ej: Césped sintético monofilamento con LED 400 lux"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-lime-400"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={courtSubmitting}
                    className="w-full py-3 rounded-xl bg-lime-400 hover:bg-lime-300 disabled:opacity-50 text-black font-extrabold text-xs transition-transform hover:scale-[1.01]"
                  >
                    {courtSubmitting ? 'Guardando...' : 'Crear Cancha'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

