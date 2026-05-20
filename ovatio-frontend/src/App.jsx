import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { CookieProvider } from './contexts/CookieContext'
import { LanguageProvider, useLanguage } from './contexts/LanguageContext'
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
      <footer style={{ background: 'linear-gradient(135deg, #000666 0%, #1a237e 100%)', color: '#fff' }}>
        <div className="max-w-7xl mx-auto px-8 py-12">
          {/* Header avec logo */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-1">
              <span
                className="text-xl font-black tracking-tight block mb-3"
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#ffffff' }}
              >
                Standing Ovation<span style={{ color: '#fdd400' }}>.be</span>
              </span>
              <p
                className="text-xs leading-relaxed"
                style={{ fontFamily: 'Manrope, sans-serif', color: 'rgba(255,255,255,0.6)' }}
              >
                <FooterTagline />
              </p>
            </div>

            {/* Navigation - 3 colonnes */}
            <div>
              <h4 className="font-bold mb-4 text-sm" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                Utiliser Standing Ovation
              </h4>
              <ul className="space-y-2 text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
                <li><a href="/shows" className="hover:text-white transition-colors">Tous les spectacles</a></li>
                <li><a href="/reservations" className="hover:text-white transition-colors">Mes réservations</a></li>
                <li><a href="/account" className="hover:text-white transition-colors">Mon profil</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-sm" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                Bruxelles
              </h4>
              <ul className="space-y-2 text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
                <li><a href="/categories/theatre" className="hover:text-white transition-colors">Théâtre</a></li>
                <li><a href="/categories/musique" className="hover:text-white transition-colors">Musique</a></li>
                <li><a href="/categories/danse" className="hover:text-white transition-colors">Danse</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-sm" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                Légal & Contact
              </h4>
              <ul className="space-y-2 text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
                <li><a href="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Nous contacter</a></li>
                <li><a href="/presse" className="hover:text-white transition-colors">Presse</a></li>
                <li><a href="/newsletter" className="hover:text-white transition-colors">Newsletter</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom - Copyright + RSS */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between pt-8 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            <p
              className="text-xs font-semibold mb-4 md:mb-0"
              style={{ fontFamily: 'Manrope, sans-serif', color: '#fdd400' }}
            >
              <FooterCopyright />
            </p>
            <a
              href="http://localhost:8000/api/rss"
              target="_blank"
              rel="noreferrer"
              className="text-xs hover:opacity-100 transition-opacity flex items-center gap-1"
              style={{ fontFamily: 'Manrope, sans-serif', color: '#e07b39' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19.01 7.38 20 6.18 20C4.98 20 4 19.01 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z"/>
              </svg>
              RSS
            </a>
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

function FooterTagline() {
  const { t } = useLanguage()
  return <>{t('footer.tagline')}</>
}
function FooterCopyright() {
  const { t } = useLanguage()
  return <>{t('footer.copyright')}</>
}
function FooterLinks() {
  const { t } = useLanguage()
  const links = [
    { key: 'footer.legal',      to: '/mentions-legales' },
    { key: 'footer.contact',    to: '/contact' },
    { key: 'footer.press',      to: '/presse' },
    { key: 'footer.newsletter', to: '/newsletter' },
  ]
  return (
    <>
      {links.map(({ key, to }) => (
        <a key={key} href={to}
          className="text-sm hover:text-white transition-colors"
          style={{ fontFamily: 'Manrope, sans-serif', color: 'rgba(255,255,255,0.55)' }}>
          {t(key)}
        </a>
      ))}
    </>
  )
}

export default function App() {
  return (
    <LanguageProvider>
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
    </LanguageProvider>
  )
}
