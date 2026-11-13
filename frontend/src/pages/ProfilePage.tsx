import React, { useState } from 'react'
import { api } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import { User, Phone, Mail, Shield, CheckCircle2, AlertCircle } from 'lucide-react'

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth()

  const [name, setName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setLoading(true)

    try {
      const payload: any = { name, phone }
      if (password) payload.password = password

      const res = await api.put('/auth/profile', payload)
      updateUser(res.data)
      setMessage({ type: 'success', text: 'Perfil actualizado exitosamente.' })
      setPassword('')
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Error al actualizar perfil.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white py-8 sm:py-12">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <div className="bg-zinc-950 p-6 sm:p-8 rounded-3xl border border-zinc-800 shadow-2xl">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-zinc-800">
            <div className="w-16 h-16 rounded-2xl bg-lime-400 text-black font-black text-2xl flex items-center justify-center">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
              <p className="text-xs text-zinc-400 flex items-center gap-1.5 mt-0.5">
                <Shield className="w-3.5 h-3.5 text-lime-400" />
                Rol: <span className="font-semibold text-white">{user?.role}</span>
              </p>
            </div>
          </div>

          {message && (
            <div
              className={`p-3.5 rounded-xl mb-6 text-xs font-semibold flex items-center gap-2 ${
                message.type === 'success'
                  ? 'bg-lime-400/10 border border-lime-400/30 text-lime-400'
                  : 'bg-red-500/10 border border-red-500/30 text-red-400'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">
                Email (no modificable)
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900/40 border border-zinc-900 text-xs text-zinc-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">
                Nombre y Apellido
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-lime-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">
                Teléfono / WhatsApp de contacto
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+54 261 412-3456"
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-lime-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase mb-1">
                Nueva Contraseña (dejar en blanco para mantener)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-lime-400"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-lime-400 hover:bg-lime-300 disabled:opacity-50 text-black font-extrabold text-xs transition-transform hover:scale-[1.01]"
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
