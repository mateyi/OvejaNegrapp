import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/hooks/useAuth'
import { Navbar, Footer } from '@/components/Navbar'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { VenuesPage } from '@/pages/VenuesPage'
import { VenueDetailPage } from '@/pages/VenueDetailPage'
import { MatchesPage } from '@/pages/MatchesPage'
import { BookingsPage } from '@/pages/BookingsPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { DashboardPage } from '@/pages/DashboardPage'

// Wrapper de ruta protegida
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({
  children,
  allowedRoles,
}) => {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-lime-400" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Públicas con Navbar y Footer */}
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/canchas" element={<Layout><VenuesPage /></Layout>} />
          <Route path="/canchas/:id" element={<Layout><VenueDetailPage /></Layout>} />
          <Route path="/partidos" element={<Layout><MatchesPage /></Layout>} />

          {/* Auth standalone */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />

          {/* Protegidas con Layout */}
          <Route
            path="/mis-reservas"
            element={
              <ProtectedRoute>
                <Layout>
                  <BookingsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <Layout>
                  <ProfilePage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'VENUE_ADMIN']}>
                <Layout>
                  <DashboardPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* 404 */}
          <Route
            path="*"
            element={
              <Layout>
                <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                  <div className="text-6xl font-black text-lime-400 mb-2">404</div>
                  <h1 className="text-xl font-bold text-white mb-2">Página no encontrada</h1>
                  <p className="text-xs text-zinc-400 mb-6">
                    El contenido que buscás no existe o fue movido.
                  </p>
                  <a
                    href="/"
                    className="px-4 py-2 rounded-xl bg-lime-400 text-black text-xs font-bold"
                  >
                    Volver al inicio
                  </a>
                </div>
              </Layout>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
