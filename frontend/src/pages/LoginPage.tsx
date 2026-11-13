import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { api } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import { LogIn, ArrowRight, AlertCircle } from 'lucide-react'

export const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const from = (location.state as any)?.from?.pathname || '/'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await api.post('/auth/login', { email, password })
      login(res.data.token, res.data.user)
      navigate(from, { replace: true })
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al iniciar sesión. Verificá tus credenciales.')
    } finally {
      setLoading(false)
    }
  }

  // Atajos para pruebas de demo
  const fillDemo = (demoEmail: string) => {
    setEmail(demoEmail)
    setPassword('OvejaNegra2026!')
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8 bg-zinc-950 p-8 rounded-2xl border border-zinc-800 shadow-2xl relative">
        <div className="text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-lime-400 text-black font-black text-2xl mb-4 shadow-lg shadow-lime-400/20">
            ON
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Iniciar Sesión
          </h2>
          <p className="mt-1 text-xs text-zinc-400">
            Accedé a tu cuenta para reservar canchas y sumarte a partidos
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-lime-400 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-lime-400 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-lime-400 hover:bg-lime-300 disabled:opacity-50 text-black font-bold text-sm flex items-center justify-center gap-2 transition-transform hover:scale-[1.01] shadow-lg shadow-lime-400/20"
          >
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* DEMO ACCOUNTS QUICK-FILL */}
        <div className="pt-4 border-t border-zinc-900">
          <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2 text-center">
            Credenciales de prueba rápida:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillDemo('jugador@ovejanegra.com')}
              className="px-2 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-lime-400 text-[11px] text-zinc-300 transition-colors"
            >
              ⚽ Jugador
            </button>
            <button
              type="button"
              onClick={() => fillDemo('admin.godoycruz@ovejanegra.com')}
              className="px-2 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-lime-400 text-[11px] text-zinc-300 transition-colors"
            >
              🏟️ Complejo
            </button>
            <button
              type="button"
              onClick={() => fillDemo('admin@ovejanegra.com')}
              className="px-2 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-lime-400 text-[11px] text-zinc-300 transition-colors"
            >
              ⚡ Admin
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-zinc-400">
          ¿No tenés una cuenta?{' '}
          <Link to="/registro" className="font-semibold text-lime-400 hover:underline">
            Registrate acá
          </Link>
        </div>
      </div>
    </div>
  )
}
