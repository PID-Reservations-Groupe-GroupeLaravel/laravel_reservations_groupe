import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import api from '../api/axios'

const LANGS = [
  { code: 'fr', label: 'FR', flag: '🇫🇷' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'nl', label: 'NL', flag: '🇳🇱' },
]

function LangSwitcher({ user }) {
  const { lang, setLanguage, t } = useLanguage()
  const [open, setOpen] = useState(false)

  const current = LANGS.find(l => l.code === lang) ?? LANGS[0]

  const handleSelect = async (code) => {
    setLanguage(code)
    setOpen(false)
    if (user) {
      try { await api.patch('/profile/langue', { langue: code }) } catch {}
    }
  }

  return (
    <div className="relative">
      <button onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold hover:opacity-80 transition-opacity"
        style={{ background: '#f2f4f7', fontFamily: 'Manrope, sans-serif', color: '#454652', border: 'none', cursor: 'pointer' }}>
        <span>{current.flag}</span>
        <span>{current.label}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.5 }}>
          <path d="M7 10l5 5 5-5z"/>
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 rounded-xl overflow-hidden z-50"
          style={{ background: '#fff', boxShadow: '0 8px 32px rgba(0,6,102,0.12)', minWidth: '110px' }}>
          {LANGS.map(l => (
            <button key={l.code} onClick={() => handleSelect(l.code)}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold hover:opacity-70 transition-opacity text-left"
              style={{
                fontFamily: 'Manrope, sans-serif',
                color: l.code === lang ? '#000666' : '#454652',
                background: l.code === lang ? '#f0f1ff' : 'transparent',
                border: 'none', cursor: 'pointer',
              }}>
              <span>{l.flag}</span>
              <span>{l.label}</span>
              {l.code === lang && <span style={{ marginLeft: 'auto', color: '#000666' }}>✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/login') }

  const isAdmin    = user?.roles?.includes('admin')
  const isProducer = user?.roles?.includes('producer')

  return (
    <nav
      className="sticky top-0 z-50"
      style={{
        background: 'rgba(247, 249, 252, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0px 1px 0px rgba(198, 197, 212, 0.4)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-black tracking-tight shrink-0"
          style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#000666' }}
        >
          Standing-Ovation<span style={{ color: '#fdd400' }}>.be</span>
        </Link>

        {/* Nav links — centre */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/shows"
            className="text-sm font-semibold transition-colors hover:text-[#000666]"
            style={{ fontFamily: 'Manrope, sans-serif', color: '#454652' }}
          >
            {t('nav.shows')}
          </Link>
          <Link
            to="/about"
            className="text-sm font-semibold transition-colors hover:text-[#000666]"
            style={{ fontFamily: 'Manrope, sans-serif', color: '#454652' }}
          >
            {t('nav.about')}
          </Link>
          {user && (
            <Link
              to="/reservations"
              className="text-sm font-semibold transition-colors hover:text-[#000666]"
              style={{ fontFamily: 'Manrope, sans-serif', color: '#454652' }}
            >
              {t('nav.reservations')}
            </Link>
          )}
          <a
            href="http://localhost:8000/api/rss"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-semibold transition-colors hover:opacity-80 flex items-center gap-1"
            style={{ fontFamily: 'Manrope, sans-serif', color: '#e07b39' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19.01 7.38 20 6.18 20C4.98 20 4 19.01 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z"/>
            </svg>
            RSS
          </a>
          {/* Devenir producteur — visible si connecté ET pas encore producteur/admin */}
          {user && !isProducer && !isAdmin && (
            <Link
              to="/devenir-producteur"
              className="text-sm font-semibold transition-colors"
              style={{ fontFamily: 'Manrope, sans-serif', color: '#000666' }}
            >
              {t('nav.becomeProducer')} ✦
            </Link>
          )}
          {!user && (
            <Link
              to="/devenir-producteur"
              className="text-sm font-semibold transition-colors hover:text-[#000666]"
              style={{ fontFamily: 'Manrope, sans-serif', color: '#454652' }}
            >
              {t('nav.becomeProducer')}
            </Link>
          )}
        </div>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-3">
          <LangSwitcher user={user} />
          {user ? (
            <>
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm"
                style={{ background: '#f2f4f7', fontFamily: 'Manrope, sans-serif', color: '#191c1e' }}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ background: 'linear-gradient(135deg, #000666, #1a237e)' }}
                >
                  {(user.firstname ?? user.name ?? 'U')[0].toUpperCase()}
                </div>
                <span className="font-semibold text-xs">{user.firstname ?? user.name}</span>
                {isAdmin && (
                  <span
                    className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: '#fdd400', color: '#6f5c00' }}
                  >
                    admin
                  </span>
                )}
                {isProducer && !isAdmin && (
                  <span
                    className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: '#e8f5e9', color: '#1b5e20' }}
                  >
                    producteur
                  </span>
                )}
              </div>

              {(isAdmin || isProducer) && (
                <Link
                  to="/admin"
                  className="text-xs font-bold px-3 py-2 rounded-xl"
                  style={{ fontFamily: 'Manrope, sans-serif', background: '#eceef1', color: '#000666' }}
                >
                  {t('nav.backoffice')}
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="text-xs font-semibold px-4 py-2 rounded-xl hover:opacity-80 transition-opacity"
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  background: 'linear-gradient(135deg, #000666, #1a237e)',
                  color: '#ffffff',
                }}
              >
                {t('nav.logout')}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="text-xs font-bold px-4 py-2 rounded-xl"
                style={{ fontFamily: 'Manrope, sans-serif', background: '#f2f4f7', color: '#000666' }}
              >
                {t('nav.register')}
              </Link>
              <Link
                to="/login"
                className="text-xs font-bold px-4 py-2 rounded-xl hover:opacity-90 transition-opacity"
                style={{
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  background: 'linear-gradient(135deg, #000666, #1a237e)',
                  color: '#ffffff',
                }}
              >
                {t('nav.login')}
              </Link>
            </>
          )}
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden p-2 rounded-xl"
          style={{ background: '#f2f4f7' }}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <svg className="w-5 h-5" style={{ color: '#191c1e' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-6 pt-2 space-y-3" style={{ borderTop: '1px solid rgba(198,197,212,0.3)' }}>
          <MobileLink to="/shows" onClick={() => setMenuOpen(false)}>Spectacles</MobileLink>
          <MobileLink to="/about" onClick={() => setMenuOpen(false)}>À propos</MobileLink>
          {user ? (
            <>
              <MobileLink to="/reservations" onClick={() => setMenuOpen(false)}>Mes réservations</MobileLink>
              {!isProducer && !isAdmin && (
                <MobileLink to="/devenir-producteur" onClick={() => setMenuOpen(false)}>Devenir producteur ✦</MobileLink>
              )}
              {(isAdmin || isProducer) && (
                <MobileLink to="/admin" onClick={() => setMenuOpen(false)}>Back-office</MobileLink>
              )}
              <button
                onClick={() => { setMenuOpen(false); handleLogout() }}
                className="block text-sm font-semibold py-2"
                style={{ fontFamily: 'Manrope, sans-serif', color: '#ba1a1a' }}
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <MobileLink to="/devenir-producteur" onClick={() => setMenuOpen(false)}>Devenir producteur</MobileLink>
              <MobileLink to="/register" onClick={() => setMenuOpen(false)}>S'inscrire</MobileLink>
              <MobileLink to="/login" onClick={() => setMenuOpen(false)}>Connexion</MobileLink>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

function MobileLink({ to, onClick, children }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block text-sm font-semibold py-2"
      style={{ fontFamily: 'Manrope, sans-serif', color: '#454652' }}
    >
      {children}
    </Link>
  )
}
