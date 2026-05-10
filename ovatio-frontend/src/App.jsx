import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { CookieProvider } from './contexts/CookieContext'
import Navbar from './components/Navbar'
import CookieBanner from './components/CookieBanner'
import PrivateRoute from './components/PrivateRoute'

import LoginPage          from './pages/LoginPage'
import RegisterPage       from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ShowsPage          from './pages/ShowsPage'
import ShowDetailPage     from './pages/ShowDetailPage'
import ReservationsPage   from './pages/ReservationsPage'
import SessionsPage       from './pages/SessionsPage'
import CookiesPage        from './pages/CookiesPage'
import BecomeProducerPage from './pages/BecomeProducerPage'
import AboutPage          from './pages/AboutPage'
import AdminPage          from './pages/AdminPage'
import OAuthCallbackPage  from './pages/OAuthCallbackPage'
import MentionsLegalesPage from './pages/MentionsLegalesPage'
import ContactPage         from './pages/ContactPage'
import PressePage          from './pages/PressePage'
import NewsletterPage      from './pages/NewsletterPage'

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
              {[
                { label: 'Mentions Légales', to: '/mentions-legales' },
                { label: 'Contact',          to: '/contact' },
                { label: 'Presse',           to: '/presse' },
                { label: 'Newsletter',       to: '/newsletter' },
              ].map(({ label, to }) => (
                <a
                  key={label}
                  href={to}
                  className="text-sm hover:text-white transition-colors"
                  style={{ fontFamily: 'Manrope, sans-serif', color: 'rgba(255,255,255,0.55)' }}
                >
                  {label}
                </a>
              ))}
              <a
                href="http://localhost:8001/api/rss"
                target="_blank"
                rel="noreferrer"
                className="text-sm hover:opacity-100 transition-opacity flex items-center gap-1"
                style={{ fontFamily: 'Manrope, sans-serif', color: '#e07b39' }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19.01 7.38 20 6.18 20C4.98 20 4 19.01 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z"/>
                </svg>
                RSS
              </a>
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

/* ─── Layout sans Navbar (Login / Register / Forgot-password) ─── */
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
              <Route path="/login"           element={<LoginPage />} />
              <Route path="/register"        element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/auth/callback"   element={<OAuthCallbackPage />} />
            </Route>

            {/* Pages APP — avec Navbar + Footer */}
            <Route element={<AppLayout />}>
              <Route path="/" element={<Navigate to="/shows" replace />} />
              <Route path="/shows"     element={<ShowsPage />} />
              <Route path="/shows/:id" element={<ShowDetailPage />} />
              <Route path="/cookies"   element={<CookiesPage />} />
              <Route path="/about"     element={<AboutPage />} />
              <Route path="/devenir-producteur"  element={<BecomeProducerPage />} />
              <Route path="/mentions-legales"   element={<MentionsLegalesPage />} />
              <Route path="/contact"            element={<ContactPage />} />
              <Route path="/presse"             element={<PressePage />} />
              <Route path="/newsletter"         element={<NewsletterPage />} />

              <Route path="/reservations" element={
                <PrivateRoute><ReservationsPage /></PrivateRoute>
              } />
              <Route path="/sessions" element={
                <PrivateRoute><SessionsPage /></PrivateRoute>
              } />
              <Route path="/admin" element={
                <PrivateRoute><AdminPage /></PrivateRoute>
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
