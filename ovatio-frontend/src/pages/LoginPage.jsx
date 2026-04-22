import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password, remember)
      navigate('/reservations')
    } catch (err) {
      setError(err.response?.data?.message ?? 'Identifiants invalides.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #000666 0%, #1a237e 100%)' }}>

      {/* Ambient lights */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, #4051b5 0%, transparent 70%)' }} />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #fdd400 0%, transparent 70%)' }} />
        <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #7986cb 0%, transparent 70%)' }} />
      </div>

      <div className="relative w-full max-w-sm z-10">

        {/* Logo */}
        <Link to="/shows" className="block text-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight"
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            Ovatio<span style={{ color: '#fdd400' }}>.be</span>
          </h1>
          <p className="text-xs mt-1 tracking-[0.3em] uppercase"
            style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Manrope, sans-serif' }}>
            La Scène Curatée
          </p>
        </Link>

        {/* Card */}
        <div className="rounded-3xl p-8" style={{ background: 'white', boxShadow: '0 25px 50px rgba(0,0,0,0.3)' }}>

          <h2 className="text-xl font-bold mb-1" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>
            Bienvenue
          </h2>
          <p className="text-sm mb-6" style={{ fontFamily: 'Manrope, sans-serif', color: '#767683' }}>
            Connectez-vous pour accéder à vos réservations.
          </p>

          {error && (
            <div className="text-sm rounded-xl px-4 py-3 mb-4"
              style={{ background: '#ffdad6', color: '#93000a', fontFamily: 'Manrope, sans-serif' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-2"
                style={{ fontFamily: 'Manrope, sans-serif', color: '#454652' }}>
                Identifiant
              </label>
              <div className="flex items-center rounded-xl px-4 py-3 gap-3"
                style={{ background: '#f2f4f7' }}>
                <svg className="w-4 h-4 shrink-0" style={{ color: '#767683' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="email@exemple.com"
                  className="flex-1 bg-transparent text-sm outline-none"
                  style={{ fontFamily: 'Manrope, sans-serif', color: '#191c1e' }}
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wider"
                  style={{ fontFamily: 'Manrope, sans-serif', color: '#454652' }}>
                  Mot de passe
                </label>
                <Link to="/forgot-password" className="text-xs hover:underline"
                  style={{ fontFamily: 'Manrope, sans-serif', color: '#000666' }}>
                  Oublié ?
                </Link>
              </div>
              <div className="flex items-center rounded-xl px-4 py-3 gap-3"
                style={{ background: '#f2f4f7' }}>
                <svg className="w-4 h-4 shrink-0" style={{ color: '#767683' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="flex-1 bg-transparent text-sm outline-none"
                  style={{ fontFamily: 'Manrope, sans-serif', color: '#191c1e' }}
                />
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded"
                style={{ accentColor: '#000666' }}
              />
              <label htmlFor="remember" className="text-sm" style={{ fontFamily: 'Manrope, sans-serif', color: '#454652' }}>
                Rester connecté
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-opacity disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #000666, #1a237e)', fontFamily: '"Plus Jakarta Sans", sans-serif' }}
            >
              {loading ? 'Connexion...' : <><span>Se connecter</span><span>→</span></>}
            </button>
          </form>

          {/* Séparateur */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: '#eceef1' }} />
            <span className="text-xs" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>ou</span>
            <div className="flex-1 h-px" style={{ background: '#eceef1' }} />
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Google', icon: '🇬' },
              { label: 'Apple', icon: '🍎' },
            ].map(({ label, icon }) => (
              <button key={label}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition"
                style={{ background: '#f2f4f7', color: '#191c1e', fontFamily: 'Manrope, sans-serif' }}>
                <span>{icon}</span> {label}
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-sm mt-6" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Manrope, sans-serif' }}>
          Pas encore de compte ?{' '}
          <Link to="/register" className="font-semibold hover:underline" style={{ color: '#fdd400' }}>
            S'inscrire gratuitement
          </Link>
        </p>
      </div>
    </div>
  )
}
