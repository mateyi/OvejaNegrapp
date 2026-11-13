import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '@/lib/api'
import type { Venue, OpenMatch } from '@/types'
import {
  Search,
  Calendar,
  Clock,
  MapPin,
  Users,
  ChevronRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Trophy,
} from 'lucide-react'

export const HomePage: React.FC = () => {
  const navigate = useNavigate()
  const [featuredVenues, setFeaturedVenues] = useState<Venue[]>([])
  const [activeMatches, setActiveMatches] = useState<OpenMatch[]>([])
  const [loading, setLoading] = useState(true)

  // Filtros del buscador hero
  const [city, setCity] = useState('')
  const [sport, setSport] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [venuesRes, matchesRes] = await Promise.all([
          api.get<Venue[]>('/venues'),
          api.get<OpenMatch[]>('/matches'),
        ])
        setFeaturedVenues(venuesRes.data.slice(0, 3))
        setActiveMatches(matchesRes.data.slice(0, 3))
      } catch (err) {
        console.error('Error fetching home data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (city) params.append('city', city)
    if (sport) params.append('sport', sport)
    if (date) params.append('date', date)
    navigate(`/canchas?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-lime-400 selection:text-black">
      {/* ================= HERO SECTION ================= */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 border-b border-zinc-800">
        {/* Glow de fondo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-lime-400/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-lime-400/30 bg-lime-400/10 text-lime-400 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse">
            <Zap className="w-3.5 h-3.5" />
            La plataforma deportiva de Mendoza
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white mb-6 leading-tight">
            Encontrá tu cancha.{' '}
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-lime-400 via-lime-300 to-white">
              Reservá y jugá sin vueltas.
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-base sm:text-lg text-zinc-400 mb-10 leading-relaxed">
            Consultá disponibilidad en tiempo real en los mejores complejos deportivos de Godoy Cruz, Capital, Chacras y Maipú. ¿Te faltan jugadores? Sumate a un partido abierto.
          </p>

          {/* BUSCADOR HERO FLOTANTE */}
          <div className="mx-auto max-w-4xl bg-zinc-950/80 border border-zinc-800 p-3 sm:p-4 rounded-2xl shadow-2xl backdrop-blur-xl">
            <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-left">
              {/* Ciudad */}
              <div className="p-2 sm:p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80 hover:border-zinc-700 transition-colors">
                <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-lime-400" />
                  Zona / Ciudad
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-transparent text-sm text-white font-medium focus:outline-none"
                >
                  <option value="" className="bg-zinc-900">Todas las zonas</option>
                  <option value="Godoy Cruz" className="bg-zinc-900">Godoy Cruz</option>
                  <option value="Capital (Mendoza)" className="bg-zinc-900">Capital / Parque</option>
                  <option value="Luján de Cuyo" className="bg-zinc-900">Chacras / Luján</option>
                  <option value="Guaymallén" className="bg-zinc-900">Guaymallén</option>
                  <option value="Maipú" className="bg-zinc-900">Maipú</option>
                </select>
              </div>

              {/* Deporte */}
              <div className="p-2 sm:p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80 hover:border-zinc-700 transition-colors">
                <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-lime-400" />
                  Deporte
                </label>
                <select
                  value={sport}
                  onChange={(e) => setSport(e.target.value)}
                  className="w-full bg-transparent text-sm text-white font-medium focus:outline-none"
                >
                  <option value="" className="bg-zinc-900">Todos los deportes</option>
                  <option value="FUTBOL" className="bg-zinc-900">Fútbol (5, 7, 8, 11)</option>
                  <option value="PADEL" className="bg-zinc-900">Pádel (Pro / Indoor)</option>
                  <option value="TENIS" className="bg-zinc-900">Tenis (Polvo de ladrillo)</option>
                  <option value="BASQUET" className="bg-zinc-900">Básquetbol</option>
                </select>
              </div>

              {/* Fecha */}
              <div className="p-2 sm:p-3 rounded-xl bg-zinc-900/80 border border-zinc-800/80 hover:border-zinc-700 transition-colors">
                <label className="block text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-lime-400" />
                  Fecha
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-transparent text-sm text-white font-medium focus:outline-none [color-scheme:dark]"
                />
              </div>

              {/* Botón Buscar */}
              <div className="flex items-center">
                <button
                  type="submit"
                  className="w-full h-full min-h-[52px] bg-lime-400 hover:bg-lime-300 text-black font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] shadow-lg shadow-lime-400/20"
                >
                  <Search className="w-4 h-4" />
                  Buscar Canchas
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ================= COMPLEJOS DESTACADOS ================= */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-lime-400 text-xs font-bold uppercase tracking-wider mb-2">
              Selección Exclusiva
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Complejos deportivos destacados
            </h2>
          </div>
          <Link
            to="/canchas"
            className="inline-flex items-center gap-1 text-sm font-semibold text-lime-400 hover:text-lime-300 transition-colors"
          >
            Ver todos los complejos <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 rounded-2xl bg-zinc-900 animate-pulse border border-zinc-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredVenues.map((venue) => {
              const minPrice = venue.courts.length
                ? Math.min(...venue.courts.map((c) => c.pricePerHour))
                : 0

              return (
                <Link
                  key={venue.id}
                  to={`/canchas/${venue.id}`}
                  className="group rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden hover:border-lime-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-lime-400/5 flex flex-col"
                >
                  <div className="relative h-56 w-full overflow-hidden bg-zinc-900">
                    <img
                      src={venue.imageUrl || venue.images?.[0]}
                      alt={venue.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-md text-xs font-medium text-white flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-lime-400" />
                      {venue.city}
                    </div>
                    <div className="absolute bottom-3 right-3 bg-lime-400 text-black px-2.5 py-1 rounded-md text-xs font-bold">
                      Desde ${minPrice.toLocaleString('es-AR')}/h
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-lime-400 transition-colors mb-2">
                        {venue.name}
                      </h3>
                      <p className="text-zinc-400 text-xs line-clamp-2 mb-4 leading-relaxed">
                        {venue.description}
                      </p>
                      <div className="text-xs text-zinc-400 flex items-center gap-1.5 mb-4">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                        {venue.address}, {venue.neighborhood}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-900 flex items-center justify-between">
                      <div className="flex gap-1.5 flex-wrap">
                        {venue.courts.slice(0, 2).map((c) => (
                          <span
                            key={c.id}
                            className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800"
                          >
                            {c.sport}
                          </span>
                        ))}
                        {venue.courts.length > 2 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400">
                            +{venue.courts.length - 2} más
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-semibold text-lime-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Reservar <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      {/* ================= PARTIDOS ABIERTOS (CALL TO ACTION) ================= */}
      <section className="py-16 bg-zinc-950 border-y border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-lime-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Users className="w-3.5 h-3.5" />
                Comunidad de Jugadores
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Sumate a un partido abierto
              </h2>
              <p className="text-zinc-400 text-sm mt-1">
                ¿Te faltan amigos para armar el equipo? Encontrá partidos con cupos libres hoy mismo.
              </p>
            </div>
            <Link
              to="/partidos"
              className="inline-flex items-center gap-1 text-sm font-semibold text-lime-400 hover:text-lime-300 transition-colors"
            >
              Ver todos los partidos <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activeMatches.map((match) => {
              const spotsLeft = match.totalPlayers - match.confirmedPlayers

              return (
                <div
                  key={match.id}
                  className="rounded-2xl border border-zinc-800 bg-black p-6 flex flex-col justify-between hover:border-zinc-700 transition-colors relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-lime-400/5 rounded-bl-full pointer-events-none" />

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase bg-lime-400/10 text-lime-400 border border-lime-400/20">
                        {match.sport} • {match.format}
                      </span>
                      <span className="text-xs font-semibold text-zinc-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-zinc-400" />
                        {match.startTime} hs
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">
                      {match.title}
                    </h3>
                    <p className="text-xs text-zinc-400 mb-4 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                      {match.venue.name}
                    </p>

                    <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 mb-4 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-zinc-400">Jugadores:</span>
                        <span className="font-semibold text-white">
                          {match.confirmedPlayers} / {match.totalPlayers} confirmados
                        </span>
                      </div>
                      {/* Barra de progreso */}
                      <div className="w-full bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-lime-400 h-1.5 rounded-full transition-all"
                          style={{ width: `${(match.confirmedPlayers / match.totalPlayers) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-xs pt-1">
                        <span className="text-lime-400 font-semibold">
                          {spotsLeft > 0 ? `Faltan ${spotsLeft} jugador${spotsLeft > 1 ? 'es' : ''}` : 'Cupo lleno'}
                        </span>
                        {match.estimatedPrice && (
                          <span className="text-zinc-300 font-medium">
                            ~${match.estimatedPrice.toLocaleString('es-AR')} c/u
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/partidos`}
                    className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-lime-400 hover:text-black text-white text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5"
                  >
                    Unirme al partido <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ================= CÓMO FUNCIONA ================= */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-lime-400 text-xs font-bold uppercase tracking-wider">
            Simple y Moderno
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
            ¿Cómo funciona OvejaNegra?
          </h2>
          <p className="text-zinc-400 text-sm mt-3">
            Sin llamadas innecesarias ni esperas por WhatsApp. Tu turno asegurado en 3 pasos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-zinc-950 border border-zinc-800 text-center relative group hover:border-zinc-700 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 text-lime-400 font-black text-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-lime-400 group-hover:text-black transition-colors">
              1
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Buscá tu complejo</h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Filtrá por barrio de Mendoza, deporte (fútbol, pádel, tenis, básquet) y fecha para ver qué canchas tienen turnos libres.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-zinc-950 border border-zinc-800 text-center relative group hover:border-zinc-700 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 text-lime-400 font-black text-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-lime-400 group-hover:text-black transition-colors">
              2
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Elegí tu horario</h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Seleccioná en la grilla el horario disponible. El sistema bloquea el turno en tiempo real para evitar reservas duplicadas.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-zinc-950 border border-zinc-800 text-center relative group hover:border-zinc-700 transition-colors">
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 text-lime-400 font-black text-xl flex items-center justify-center mx-auto mb-6 group-hover:bg-lime-400 group-hover:text-black transition-colors">
              3
            </div>
            <h3 className="text-xl font-bold text-white mb-3">¡A la cancha!</h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Recibís tu confirmación inmediata. Vas a jugar con tu equipo y abonás directamente en la administración del complejo.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
