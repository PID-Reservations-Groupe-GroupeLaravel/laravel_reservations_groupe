import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { CookieProvider } from './contexts/CookieContext'
import Navbar from './components/Navbar'
import CookieBanner from './components/CookieBanner'
import PrivateRoute from './components/PrivateRoute'

import LoginPage        from './pages/LoginPage'
import RegisterPage     from './pages/RegisterPage'
import ShowsPage        from './pages/ShowsPage'
import ShowDetailPage   from './pages/ShowDetailPage'
import ReservationsPage from './pages/ReservationsPage'
import SessionsPage     from './pages/SessionsPage'
import CookiesPage      from './pages/CookiesPage'
import BecomeProducerPage from './pages/BecomeProducerPage'

/* ─── Layout WITH Navbar + Footer (toutes les pages sauf auth) ─── */
function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f7f9fc' }}>
      <Navbar />
      <CookieBanner />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer style={{ background: 'linear-gradient(135deg, #000666 0%, #1a237e 100%)' }}>
        <div className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <span
              className="text-xl font-black tracking-tight block mb-3"
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#ffffff' }}
            >
              Ovatio<span style={{ color: '#fdd400' }}>.be</span>
            </span>
            <p
              className="text-sm max-w-xs leading-relaxed"
              style={{ fontFamily: 'Manrope, sans-serif', color: 'rgba(255,255,255,0.55)' }}
            >
              La scène curatée de Bruxelles. Redéfinir l'élégance de la performance vivante.
            </p>
          </div>
          <div className="flex flex-col md:items-end justify-between gap-6">
            <nav className="flex flex-wrap gap-6">
              {['Mentions Légales', 'Contact', 'Presse', 'Newsletter'].map(link => (
                <a
                  key={link}
                  href="#"
                  className="text-sm hover:text-white transition-colors"
                  style={{ fontFamily: 'Manrope, sans-serif', color: 'rgba(255,255,255,0.55)' }}
                >
                  {link}
                </a>
              ))}
            </nav>
            <p
              className="text-sm font-semibold"
              style={{ fontFamily: 'Manrope, sans-serif', color: '#fdd400' }}
            >
              © 2026 Ovatio.be — La Scène Curatée
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

/* ─── Layout sans Navbar (Login / Register) ─── */
function AuthLayout() {
  return (
    <>
      <CookieBanner />
      <Outlet />
    </>
  )
}

export default function App() {
  return (
    <CookieProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>

            {/* Pages AUTH — sans Navbar ni Footer */}
            <Route element={<AuthLayout />}>
              <Route path="/login"    element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Pages APP — avec Navbar + Footer */}
            <Route element={<AppLayout />}>
              <Route path="/" element={<Navigate to="/shows" replace />} />
              <Route path="/shows"     element={<ShowsPage />} />
              <Route path="/shows/:id" element={<ShowDetailPage />} />
              <Route path="/cookies"   element={<CookiesPage />} />
              <Route path="/devenir-producteur" element={<BecomeProducerPage />} />

              <Route path="/reservations" element={
                <PrivateRoute><ReservationsPage /></PrivateRoute>
              } />
              <Route path="/sessions" element={
                <PrivateRoute><SessionsPage /></PrivateRoute>
              } />

              {/* 404 */}
              <Route path="*" element={
                <div className="flex flex-col items-center justify-center py-32 text-center px-4">
                  <div
                    className="text-7xl font-black mb-4"
                    style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#000666' }}
                  >
                    404
                  </div>
                  <h2
                    className="text-2xl font-bold mb-2"
                    style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}
                  >
                    Page introuvable
                  </h2>
                  <p className="text-sm mb-8" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
                    La page que vous cherchez n'existe pas ou a été déplacée.
                  </p>
                  <a
                    href="/"
                    className="px-6 py-3 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity"
                    style={{ background: 'linear-gradient(135deg, #000666, #1a237e)', fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                  >
                    Retour à l'accueil →
                  </a>
                </div>
              } />
            </Route>

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </CookieProvider>
  )
}
