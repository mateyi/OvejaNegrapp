import React, { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import type { OpenMatch, Venue, Court } from '@/types'
import {
  Users,
  Calendar,
  Clock,
  MapPin,
  Plus,
  X,
  CheckCircle2,
  AlertCircle,
  Trophy,
  Filter,
} from 'lucide-react'

export const MatchesPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth()
  const [matches, setMatches] = useState<OpenMatch[]>([])
  const [loading, setLoading] = useState(true)

  // Filtros
  const [sportFilter, setSportFilter] = useState('')

  // Modal Crear Partido
  const [modalOpen, setModalOpen] = useState(false)
  const [venues, setVenues] = useState<Venue[]>([])
  const [selectedVenueId, setSelectedVenueId] = useState('')
  const [selectedCourtId, setSelectedCourtId] = useState('')
  const [title, setTitle] = useState('')
  const [sport, setSport] = useState('FUTBOL')
  const [format, setFormat] = useState('5v5')
  const [totalPlayers, setTotalPlayers] = useState(10)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [startTime, setStartTime] = useState('20:00')
  const [description, setDescription] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Mensajes de acción
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchMatches()
  }, [sportFilter])

  const fetchMatches = async () => {
    setLoading(true)
    try {
      const url = sportFilter ? `/matches?sport=${sportFilter}` : '/matches'
      const res = await api.get<OpenMatch[]>(url)
      setMatches(res.data)
    } catch (err) {
      console.error('Error fetching matches:', err)
    } finally {
      setLoading(false)
    }
  }

  const openCreateModal = async () => {
    setFormError(null)
    setModalOpen(true)
    try {
      const res = await api.get<Venue[]>('/venues')
      setVenues(res.data)
      if (res.data.length > 0) {
        setSelectedVenueId(res.data[0].id)
        if (res.data[0].courts.length > 0) {
          setSelectedCourtId(res.data[0].courts[0].id)
        }
      }
    } catch (err) {
      console.error('Error loading venues:', err)
    }
  }

  const handleVenueChange = (venueId: string) => {
    setSelectedVenueId(venueId)
    const v = venues.find((x) => x.id === venueId)
    if (v && v.courts.length > 0) {
      setSelectedCourtId(v.courts[0].id)
    } else {
      setSelectedCourtId('')
    }
  }

  const handleCreateMatch = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setSubmitting(true)

    try {
      const endH = (parseInt(startTime.split(':')[0], 10) + 1) % 24
      const endTime = `${endH.toString().padStart(2, '0')}:00`

      await api.post('/matches', {
        venueId: selectedVenueId,
        courtId: selectedCourtId,
        title,
        sport,
        format,
        totalPlayers: Number(totalPlayers),
        date,
        startTime,
        endTime,
        description,
      })

      setModalOpen(false)
      setActionMessage({ type: 'success', text: '¡Partido y cancha reservados con éxito! Ya sos el primer participante.' })
      fetchMatches()
    } catch (err: any) {
      setFormError(err.response?.data?.error || 'Error al crear partido.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleJoin = async (matchId: string) => {
    if (!isAuthenticated) {
      setActionMessage({ type: 'error', text: 'Iniciá sesión para unirte a un partido.' })
      return
    }

    try {
      await api.post(`/matches/${matchId}/join`)
      setActionMessage({ type: 'success', text: '¡Te uniste al partido exitosamente!' })
      fetchMatches()
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.response?.data?.error || 'No pudiste unirte al partido.' })
    }
  }

  const handleLeave = async (matchId: string) => {
    try {
      await api.post(`/matches/${matchId}/leave`)
      setActionMessage({ type: 'success', text: 'Abandonaste el partido.' })
      fetchMatches()
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.response?.data?.error || 'Error al abandonar el partido.' })
    }
  }

  const handleCancelMatch = async (matchId: string) => {
    if (!confirm('¿Estás seguro de cancelar este partido? Se liberará la cancha reservada.')) return

    try {
      await api.patch(`/matches/${matchId}/cancel`)
      setActionMessage({ type: 'success', text: 'Partido y reserva cancelados.' })
      fetchMatches()
    } catch (err: any) {
      setActionMessage({ type: 'error', text: err.response?.data?.error || 'Error al cancelar.' })
    }
  }

  const selectedVenue = venues.find((v) => v.id === selectedVenueId)

  return (
    <div className="min-h-screen bg-black text-white py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ENCABEZADO */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-lime-400/10 text-lime-400 text-xs font-bold uppercase mb-2">
              <Users className="w-4 h-4" /> Comunidad OvejaNegra
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Buscar Partido Abierto
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              Unite a encuentros organizados por otros jugadores o publicá el tuyo para completar el equipo.
            </p>
          </div>

          {isAuthenticated ? (
            <button
              onClick={openCreateModal}
              className="py-3 px-5 rounded-xl bg-lime-400 hover:bg-lime-300 text-black font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-lime-400/20 transition-transform hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" /> Publicar un Partido
            </button>
          ) : (
            <a
              href="/login"
              className="py-3 px-5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-sm border border-zinc-800"
            >
              Ingresá para organizar
            </a>
          )}
        </div>

        {/* FEEDBACK ALERT */}
        {actionMessage && (
          <div
            className={`p-4 rounded-xl mb-6 flex items-center justify-between text-xs font-semibold ${
              actionMessage.type === 'success'
                ? 'bg-lime-400/10 border border-lime-400/30 text-lime-400'
                : 'bg-red-500/10 border border-red-500/30 text-red-400'
            }`}
          >
            <div className="flex items-center gap-2">
              {actionMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{actionMessage.text}</span>
            </div>
            <button onClick={() => setActionMessage(null)} className="text-zinc-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* FILTROS POR DEPORTE */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          <button
            onClick={() => setSportFilter('')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              sportFilter === ''
                ? 'bg-lime-400 text-black'
                : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            Todos los deportes
          </button>
          <button
            onClick={() => setSportFilter('FUTBOL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              sportFilter === 'FUTBOL'
                ? 'bg-lime-400 text-black'
                : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            ⚽ Fútbol
          </button>
          <button
            onClick={() => setSportFilter('PADEL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              sportFilter === 'PADEL'
                ? 'bg-lime-400 text-black'
                : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            🎾 Pádel
          </button>
          <button
            onClick={() => setSportFilter('TENIS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              sportFilter === 'TENIS'
                ? 'bg-lime-400 text-black'
                : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            🎾 Tenis
          </button>
        </div>

        {/* LISTADO DE PARTIDOS */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 rounded-2xl bg-zinc-900 animate-pulse border border-zinc-800" />
            ))}
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-20 bg-zinc-950 rounded-2xl border border-zinc-800">
            <Trophy className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No hay partidos abiertos en este momento</h3>
            <p className="text-xs text-zinc-400 mb-4">
              ¡Sé el primero en crear uno para reunir a otros jugadores!
            </p>
            {isAuthenticated && (
              <button
                onClick={openCreateModal}
                className="px-4 py-2 bg-lime-400 text-black font-bold text-xs rounded-xl"
              >
                Publicar un Partido
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => {
              const isOrganizer = user?.id === match.organizerId
              const isParticipant = match.participants.some((p) => p.userId === user?.id)
              const spotsLeft = match.totalPlayers - match.confirmedPlayers
              const matchDateFormatted = new Date(match.date).toLocaleDateString('es-AR', {
                weekday: 'short',
                day: '2-digit',
                month: '2-digit',
              })

              return (
                <div
                  key={match.id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 flex flex-col justify-between hover:border-zinc-700 transition-colors relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-28 h-28 bg-lime-400/5 rounded-bl-full pointer-events-none" />

                  <div>
                    {/* Header de la tarjeta */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase bg-lime-400/10 text-lime-400 border border-lime-400/20">
                        {match.sport} • {match.format}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          match.status === 'FULL'
                            ? 'bg-zinc-800 text-zinc-400'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {match.status === 'FULL' ? 'Completo' : 'Cupos Libres'}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-1">
                      {match.title}
                    </h3>

                    <div className="space-y-1.5 text-xs text-zinc-400 mb-4">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-lime-400 shrink-0" />
                        <span className="text-zinc-200 font-medium">{match.venue.name}</span>
                        <span className="text-zinc-400">({match.court.name})</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                          {matchDateFormatted}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-zinc-400" />
                          {match.startTime} a {match.endTime} hs
                        </span>
                      </div>
                    </div>

                    {match.description && (
                      <p className="p-2.5 rounded-xl bg-zinc-900 text-xs text-zinc-300 italic mb-4">
                        "{match.description}"
                      </p>
                    )}

                    {/* Estado de cupos */}
                    <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 mb-4 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-zinc-400">Organizador:</span>
                        <span className="font-semibold text-white">{match.organizer.name}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-zinc-400">Jugadores confirmados:</span>
                        <span className="font-bold text-white">
                          {match.confirmedPlayers} / {match.totalPlayers}
                        </span>
                      </div>

                      {/* Barra de progreso */}
                      <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-lime-400 h-2 rounded-full transition-all"
                          style={{
                            width: `${(match.confirmedPlayers / match.totalPlayers) * 100}%`,
                          }}
                        />
                      </div>

                      <div className="flex justify-between items-center text-xs pt-1">
                        <span className="text-lime-400 font-bold">
                          {spotsLeft > 0 ? `Faltan ${spotsLeft} jugador${spotsLeft > 1 ? 'es' : ''}` : 'Equipo completo'}
                        </span>
                        {match.estimatedPrice && (
                          <span className="text-zinc-300 font-semibold">
                            ~${match.estimatedPrice.toLocaleString('es-AR')} por persona
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Acciones de la tarjeta */}
                  <div className="space-y-2">
                    {isOrganizer ? (
                      <div className="flex gap-2">
                        <div className="flex-1 py-2 text-center text-xs font-bold text-lime-400 bg-lime-400/10 rounded-xl border border-lime-400/20">
                          Sos el organizador
                        </div>
                        <button
                          onClick={() => handleCancelMatch(match.id)}
                          className="px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 border border-red-500/20 rounded-xl"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : isParticipant ? (
                      <div className="flex gap-2">
                        <div className="flex-1 py-2 text-center text-xs font-bold text-lime-400 bg-lime-400/10 rounded-xl border border-lime-400/20 flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Ya estás anotado
                        </div>
                        <button
                          onClick={() => handleLeave(match.id)}
                          className="px-3 py-2 text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 border border-zinc-800 rounded-xl"
                        >
                          Salir
                        </button>
                      </div>
                    ) : match.status === 'FULL' ? (
                      <button
                        disabled
                        className="w-full py-2.5 rounded-xl bg-zinc-900 text-zinc-600 text-xs font-bold cursor-not-allowed"
                      >
                        Cupo completo
                      </button>
                    ) : (
                      <button
                        onClick={() => handleJoin(match.id)}
                        className="w-full py-2.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-black font-extrabold text-xs transition-transform hover:scale-[1.01] shadow-md shadow-lime-400/10"
                      >
                        Unirme al partido
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* ================= MODAL CREAR PARTIDO ================= */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="w-full max-w-lg bg-zinc-950 p-6 sm:p-8 rounded-3xl border border-zinc-800 shadow-2xl relative my-8">
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-5 right-5 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-2xl font-black text-white mb-1">
                Publicar Nuevo Partido
              </h2>
              <p className="text-xs text-zinc-400 mb-6">
                Al crear el partido, el sistema reservará automáticamente la cancha a tu nombre.
              </p>

              {formError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2 mb-4">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleCreateMatch} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                    Título o convocatoria
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej: Fútbol 5 viernes noche con amigos"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-lime-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                      Complejo Deportivo
                    </label>
                    <select
                      value={selectedVenueId}
                      onChange={(e) => handleVenueChange(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-lime-400"
                    >
                      {venues.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                      Cancha
                    </label>
                    <select
                      value={selectedCourtId}
                      onChange={(e) => setSelectedCourtId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-lime-400"
                    >
                      {selectedVenue?.courts.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} (${c.pricePerHour}/h)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                      Deporte
                    </label>
                    <select
                      value={sport}
                      onChange={(e) => setSport(e.target.value)}
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
                      Formato
                    </label>
                    <select
                      value={format}
                      onChange={(e) => setFormat(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-lime-400"
                    >
                      <option value="5v5">5 vs 5</option>
                      <option value="6v6">6 vs 6</option>
                      <option value="7v7">7 vs 7</option>
                      <option value="8v8">8 vs 8</option>
                      <option value="11v11">11 vs 11</option>
                      <option value="2v2">2 vs 2 (Pádel/Tenis)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                      Total Jugadores
                    </label>
                    <input
                      type="number"
                      min={2}
                      max={30}
                      value={totalPlayers}
                      onChange={(e) => setTotalPlayers(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-lime-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                      Fecha
                    </label>
                    <input
                      type="date"
                      value={date}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-lime-400 [color-scheme:dark]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                      Horario inicio
                    </label>
                    <input
                      type="time"
                      step={3600}
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-lime-400 [color-scheme:dark]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 uppercase mb-1">
                    Descripción / Nivel de juego (opcional)
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ej: Jugamos tranqui, tercer tiempo asegurado."
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-lime-400"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 rounded-xl bg-lime-400 hover:bg-lime-300 disabled:opacity-50 text-black font-extrabold text-xs transition-transform hover:scale-[1.01] shadow-lg shadow-lime-400/20"
                  >
                    {submitting ? 'Creando partido y reservando cancha...' : 'Confirmar y Publicar Partido'}
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

