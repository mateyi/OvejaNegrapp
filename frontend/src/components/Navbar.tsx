import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import {
  Calendar,
  Users,
  Search,
  LayoutDashboard,
  LogOut,
  User as UserIcon,
  Menu,
  X,
  ShieldAlert,
} from 'lucide-react'

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path: string) => location.pathname === path

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-black/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-400 text-black font-black text-xl shadow-lg shadow-lime-400/20 group-hover:scale-105 transition-transform">
            ON
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-white flex items-center">
              OVEJANEGRA<span className="text-lime-400">.</span>
            </span>
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold -mt-1">
              Mendoza Sports
            </span>
          </div>
        </Link>

        {/* NAVEGACIÓN DESKTOP */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/canchas"
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              isActive('/canchas')
                ? 'bg-zinc-800 text-lime-400'
                : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Search className="w-4 h-4" />
            Explorar Canchas
          </Link>
          <Link
            to="/partidos"
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
              isActive('/partidos')
                ? 'bg-zinc-800 text-lime-400'
                : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <Users className="w-4 h-4" />
            Partidos Abiertos
            <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-lime-400/20 text-lime-400 font-bold rounded-full">
              Activos
            </span>
          </Link>
          {isAuthenticated && (
            <Link
              to="/mis-reservas"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                isActive('/mis-reservas')
                  ? 'bg-zinc-800 text-lime-400'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Mis Turnos
            </Link>
          )}
          {isAuthenticated && (user?.role === 'ADMIN' || user?.role === 'VENUE_ADMIN') && (
            <Link
              to="/dashboard"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                isActive('/dashboard')
                  ? 'bg-zinc-800 text-lime-400'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Panel de Control
            </Link>
          )}
        </nav>

        {/* AUTH BUTTONS */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/perfil"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 text-sm text-zinc-200"
              >
                <div className="w-7 h-7 rounded-full bg-lime-400/20 text-lime-400 flex items-center justify-center font-bold text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-xs">{user.name.split(' ')[0]}</span>
                {user.role !== 'PLAYER' && (
                  <span className="text-[10px] px-1.5 py-0.2 bg-zinc-800 text-zinc-400 rounded">
                    {user.role === 'ADMIN' ? 'Admin' : 'Complejo'}
                  </span>
                )}
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-900 rounded-lg transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
              >
                Ingresar
              </Link>
              <Link
                to="/registro"
                className="px-4 py-2 text-sm font-semibold text-black bg-lime-400 hover:bg-lime-300 rounded-lg shadow-md shadow-lime-400/20 transition-all hover:scale-[1.02]"
              >
                Registrarme
              </Link>
            </div>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-zinc-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-zinc-950 px-4 py-4 space-y-2">
          <Link
            to="/canchas"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-zinc-200 hover:bg-zinc-900"
          >
            Explorar Canchas
          </Link>
          <Link
            to="/partidos"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-zinc-200 hover:bg-zinc-900"
          >
            Partidos Abiertos
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to="/mis-reservas"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-zinc-200 hover:bg-zinc-900"
              >
                Mis Reservas
              </Link>
              {(user?.role === 'ADMIN' || user?.role === 'VENUE_ADMIN') && (
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-zinc-200 hover:bg-zinc-900"
                >
                  Panel de Control
                </Link>
              )}
              <Link
                to="/perfil"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-zinc-200 hover:bg-zinc-900"
              >
                Mi Perfil ({user?.name})
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  handleLogout()
                }}
                className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-400 hover:bg-zinc-900"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <div className="pt-2 border-t border-zinc-800 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center px-4 py-2 rounded-lg bg-zinc-900 text-white font-medium"
              >
                Ingresar
              </Link>
              <Link
                to="/registro"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center px-4 py-2 rounded-lg bg-lime-400 text-black font-semibold"
              >
                Registrarme
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-zinc-800 bg-black text-zinc-400 text-sm">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-lime-400 text-black font-black text-base">
                ON
              </div>
              <span className="text-lg font-bold text-white">
                OVEJANEGRA<span className="text-lime-400">.</span>
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Plataforma digital para la búsqueda de canchas, reserva de horarios y organización de partidos comunitarios en Mendoza, Argentina.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              Deportes
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/canchas?sport=FUTBOL" className="hover:text-lime-400 transition-colors">Fútbol 5 / 7 / 8 / 11</Link></li>
              <li><Link to="/canchas?sport=PADEL" className="hover:text-lime-400 transition-colors">Pádel Panorámico y Cubierto</Link></li>
              <li><Link to="/canchas?sport=TENIS" className="hover:text-lime-400 transition-colors">Tenis Polvo de Ladrillo</Link></li>
              <li><Link to="/canchas?sport=BASQUET" className="hover:text-lime-400 transition-colors">Básquetbol Parquet</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              Zonas Mendoza
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/canchas?city=Godoy Cruz" className="hover:text-lime-400 transition-colors">Godoy Cruz</Link></li>
              <li><Link to="/canchas?city=Capital (Mendoza)" className="hover:text-lime-400 transition-colors">Mendoza Capital / Parque</Link></li>
              <li><Link to="/canchas?city=Luján de Cuyo" className="hover:text-lime-400 transition-colors">Chacras de Coria / Luján</Link></li>
              <li><Link to="/canchas?city=Guaymallén" className="hover:text-lime-400 transition-colors">Guaymallén</Link></li>
              <li><Link to="/canchas?city=Maipú" className="hover:text-lime-400 transition-colors">Maipú</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              Proyecto Escolar
            </h4>
            <p className="text-xs text-zinc-400 mb-2">
              Laboratorio de Software 2026.
            </p>
            <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300">
              Demo con datos reales de Mendoza. Moneda: ARS ($). Pago presencial en cancha.
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-4">
          <p>© 2026 OvejaNegra Deportes. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <span className="text-lime-400 font-medium">Argentina / America/Argentina/Buenos_Aires</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
