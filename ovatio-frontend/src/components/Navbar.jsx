import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const LANGS = ['FR', 'EN', 'NL']

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <nav className="bg-ovatio-dark text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-wide hover:opacity-80">
          🎭 Ovatio
        </Link>

        <div className="flex items-center gap-5 text-sm">
          <Link to="/shows" className="hover:text-yellow-400 transition">Spectacles</Link>
          <Link to="/a-propos" className="hover:text-yellow-400 transition">À propos</Link>

          {/* Sélecteur langue */}
          <select className="bg-transparent border border-gray-600 text-white text-xs rounded px-2 py-1">
            {LANGS.map(l => <option key={l} value={l.toLowerCase()}>{l}</option>)}
          </select>

          {user ? (
            <>
              <Link to="/reservations" className="hover:text-yellow-400 transition">Mes réservations</Link>
              <Link to="/profil" className="hover:text-yellow-400 transition">{user.firstname ?? user.name}</Link>

              {user.roles?.includes('admin') && (
                <Link to="/admin"
                  className="px-3 py-1 text-xs font-semibold bg-yellow-400 text-yellow-900 rounded-full hover:bg-yellow-300 transition">
                  Back-office
                </Link>
              )}

              <button onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs transition">
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/devenir-producteur" className="hover:text-yellow-400 transition">
                Devenir Producteur
              </Link>
              <Link to="/register"
                className="border border-white px-3 py-1 rounded hover:bg-white hover:text-black transition text-xs">
                Inscription
              </Link>
              <Link to="/login"
                className="bg-yellow-400 text-black px-3 py-1 rounded font-semibold hover:bg-yellow-300 transition text-xs">
                Connexion
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}