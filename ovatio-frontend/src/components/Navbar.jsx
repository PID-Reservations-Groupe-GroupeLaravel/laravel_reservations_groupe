import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/login') }

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
          Ovatio<span style={{ color: '#fdd400' }}>.be</span>
        </Link>

        {/* Nav links — centre */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/shows"
            className="text-sm font-semibold transition-colors"
            style={{ fontFamily: 'Manrope, sans-serif', color: '#454652' }}
          >
            Spectacles
          </Link>
          <Link
            to="/a-propos"
            className="text-sm font-semibold transition-colors"
            style={{ fontFamily: 'Manrope, sans-serif', color: '#454652' }}
          >
            À propos
          </Link>
          {!user && (
            <Link
              to="/devenir-producteur"
              className="text-sm font-semibold transition-colors"
              style={{ fontFamily: 'Manrope, sans-serif', color: '#454652' }}
            >
              Devenir Producteur
            </Link>
          )}
          {user && (
            <Link
              to="/reservations"
              className="text-sm font-semibold transition-colors"
              style={{ fontFamily: 'Manrope, sans-serif', color: '#454652' }}
            >
              Mes réservations
            </Link>
          )}
        </div>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-3">
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
                {user.roles?.includes('admin') && (
                  <span
                    className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: '#fdd400', color: '#6f5c00' }}
                  >
                    admin
                  </span>
                )}
              </div>

              {user.roles?.includes('admin') && (
                <Link
                  to="/admin"
                  className="text-xs font-bold px-3 py-2 rounded-xl"
                  style={{ fontFamily: 'Manrope, sans-serif', background: '#eceef1', color: '#000666' }}
                >
                  Back-office
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
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="text-xs font-bold px-4 py-2 rounded-xl"
                style={{ fontFamily: 'Manrope, sans-serif', background: '#f2f4f7', color: '#000666' }}
              >
                S'inscrire
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
                Connexion →
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
          <MobileLink to="/a-propos" onClick={() => setMenuOpen(false)}>À propos</MobileLink>
          {user ? (
            <>
              <MobileLink to="/reservations" onClick={() => setMenuOpen(false)}>Mes réservations</MobileLink>
              {user.roles?.includes('admin') && (
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
              <MobileLink to="/devenir-producteur" onClick={() => setMenuOpen(false)}>Devenir Producteur</MobileLink>
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
