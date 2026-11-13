import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '@/lib/api'
import type { Venue } from '@/types'
import {
  Search,
  MapPin,
  Trophy,
  Filter,
  DollarSign,
  ChevronRight,
  ShieldCheck,
  Calendar,
} from 'lucide-react'

export const VenuesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [venues, setVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(true)

  // Filtros
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [city, setCity] = useState(searchParams.get('city') || '')
  const [sport, setSport] = useState(searchParams.get('sport') || '')
  const [maxPrice, setMaxPrice] = useState<number>(50000)

  useEffect(() => {
    fetchVenues()
  }, [searchParams])

  const fetchVenues = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      const qCity = searchParams.get('city')
      const qSport = searchParams.get('sport')
      const qSearch = searchParams.get('search')

      if (qCity) params.append('city', qCity)
      if (qSport) params.append('sport', qSport)
      if (qSearch) params.append('search', qSearch)

      const res = await api.get<Venue[]>(`/venues?${params.toString()}`)
      setVenues(res.data)
    } catch (err) {
      console.error('Error fetching venues:', err)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (city) params.append('city', city)
    if (sport) params.append('sport', sport)
    if (search) params.append('search', search)
    setSearchParams(params)
  }

  const clearFilters = () => {
    setSearch('')
    setCity('')
    setSport('')
    setMaxPrice(50000)
    setSearchParams(new URLSearchParams())
  }

  const filteredVenues = venues.filter((venue) => {
    const minPrice = venue.courts.length
      ? Math.min(...venue.courts.map((c) => c.pricePerHour))
      : 0
    return minPrice <= maxPrice
  })

  return (
    <div className="min-h-screen bg-black text-white py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ENCABEZADO */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Explorar Canchas en Mendoza
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Descubrí y reservá en los complejos deportivos más destacados de Mendoza.
          </p>
        </div>

        {/* BARRA DE FILTROS SUPERIOR */}
        <div className="bg-zinc-950 p-4 rounded-2xl border border-zinc-800 mb-8 grid grid-cols-1 sm:grid-cols-4 gap-3">
          {/* Búsqueda por texto */}
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Nombre o dirección..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-lime-400"
            />
          </div>

          {/* Selector de Ciudad */}
          <div>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-lime-400"
            >
              <option value="">Todas las Zonas</option>
              <option value="Godoy Cruz">Godoy Cruz</option>
              <option value="Capital (Mendoza)">Capital / Parque San Martín</option>
              <option value="Luján de Cuyo">Chacras de Coria / Luján</option>
              <option value="Guaymallén">Guaymallén</option>
              <option value="Maipú">Maipú</option>
            </select>
          </div>

          {/* Selector de Deporte */}
          <div>
            <select
              value={sport}
              onChange={(e) => setSport(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-lime-400"
            >
              <option value="">Todos los Deportes</option>
              <option value="FUTBOL">Fútbol</option>
              <option value="PADEL">Pádel</option>
              <option value="TENIS">Tenis</option>
              <option value="BASQUET">Básquet</option>
            </select>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-2">
            <button
              onClick={applyFilters}
              className="flex-1 py-2 px-3 bg-lime-400 hover:bg-lime-300 text-black font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-transform hover:scale-[1.02]"
            >
              <Filter className="w-3.5 h-3.5" /> Filtrar
            </button>
            <button
              onClick={clearFilters}
              className="py-2 px-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white text-xs rounded-xl font-medium"
            >
              Limpiar
            </button>
          </div>
        </div>

        {/* LISTADO DE COMPLEJOS */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-zinc-900 animate-pulse border border-zinc-800" />
            ))}
          </div>
        ) : filteredVenues.length === 0 ? (
          <div className="text-center py-20 bg-zinc-950 rounded-2xl border border-zinc-800">
            <Trophy className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">No se encontraron complejos</h3>
            <p className="text-xs text-zinc-400 mb-4">
              Probá modificando los filtros de zona, deporte o búsqueda.
            </p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-white rounded-xl"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVenues.map((venue) => {
              const minPrice = venue.courts.length
                ? Math.min(...venue.courts.map((c) => c.pricePerHour))
                : 0

              return (
                <Link
                  key={venue.id}
                  to={`/canchas/${venue.id}`}
                  className="group rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden hover:border-lime-400/50 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Imagen con badges */}
                    <div className="relative h-56 w-full overflow-hidden bg-zinc-900">
                      <img
                        src={venue.imageUrl || venue.images?.[0]}
                        alt={venue.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-semibold text-white flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-lime-400" />
                        {venue.city}
                      </div>
                      <div className="absolute bottom-3 right-3 bg-lime-400 text-black px-2.5 py-1 rounded-md text-xs font-bold shadow-lg shadow-black/50">
                        Desde ${minPrice.toLocaleString('es-AR')}/h
                      </div>
                    </div>

                    {/* Contenido */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white group-hover:text-lime-400 transition-colors mb-2">
                        {venue.name}
                      </h3>
                      <p className="text-zinc-400 text-xs line-clamp-2 mb-4 leading-relaxed">
                        {venue.description}
                      </p>
                      <div className="text-xs text-zinc-400 flex items-center gap-1.5 mb-4">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span>{venue.address}, {venue.neighborhood}</span>
                      </div>

                      {/* Canchas y deportes */}
                      <div className="space-y-1.5 mb-4">
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                          Canchas disponibles ({venue.courts.length}):
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {venue.courts.map((court) => (
                            <span
                              key={court.id}
                              className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300"
                            >
                              {court.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer de la tarjeta */}
                  <div className="px-6 py-4 border-t border-zinc-900 bg-zinc-950/50 flex items-center justify-between">
                    <span className="text-[11px] text-zinc-400">
                      Horarios: {venue.openTime} a {venue.closeTime} hs
                    </span>
                    <span className="text-xs font-bold text-lime-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Ver Canchas <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
