import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-ovatio-blue text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold tracking-wide hover:opacity-80">
          🎭 Ovatio
        </Link>

        {/* Liens */}
        <div className="flex items-center gap-6 text-sm">
          <Link to="/shows" className="hover:text-blue-200 transition">
            Spectacles
          </Link>

          {user ? (
            <>
              <Link to="/reservations" className="hover:text-blue-200 transition">
                Mes réservations
              </Link>
              <Link to="/sessions" className="hover:text-blue-200 transition">
                Sessions
              </Link>
              <div className="flex items-center gap-3 ml-4 border-l border-blue-400 pl-4">
                <span className="text-blue-200 text-xs">
                  {user.firstname ?? user.name}
                  {user.roles?.includes('admin') && (
                    <span className="ml-1 bg-yellow-400 text-yellow-900 text-xs px-1 rounded">
                      admin
                    </span>
                  )}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs transition"
                >
                  Déconnexion
                </button>
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded transition"
            >
              Connexion
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
