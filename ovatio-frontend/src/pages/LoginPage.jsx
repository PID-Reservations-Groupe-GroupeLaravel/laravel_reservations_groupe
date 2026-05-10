import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'

export default function LoginPage() {
  const { login } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()

  const [email, setEmail]           = useState('')
  const [password, setPassword]     = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember]     = useState(false)
  const [error, setError]           = useState('')
  const [loading, setLoading]       = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password, remember)
      navigate('/reservations')
    } catch (err) {
      setError(err.response?.data?.message ?? t('auth.invalidCredentials'))
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
            {t('shows.hero_badge')}
          </p>
        </Link>

        {/* Card */}
        <div className="rounded-3xl p-8" style={{ background: 'white', boxShadow: '0 25px 50px rgba(0,0,0,0.3)' }}>

          <h2 className="text-xl font-bold mb-1" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>
            {t('auth.welcome')}
          </h2>
          <p className="text-sm mb-6" style={{ fontFamily: 'Manrope, sans-serif', color: '#767683' }}>
            {t('auth.loginDesc')}
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
                {t('auth.identifier')}
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
                  {t('auth.password')}
                </label>
                <Link to="/forgot-password" className="text-xs hover:underline"
                  style={{ fontFamily: 'Manrope, sans-serif', color: '#000666' }}>
                  {t('auth.forgot')}
                </Link>
              </div>
              <div className="flex items-center rounded-xl px-4 py-3 gap-3"
                style={{ background: '#f2f4f7' }}>
                <svg className="w-4 h-4 shrink-0" style={{ color: '#767683' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="flex-1 bg-transparent text-sm outline-none"
                  style={{ fontFamily: 'Manrope, sans-serif', color: '#191c1e' }}
                />
                <button type="button" onClick={() => setShowPassword(p => !p)}
                  className="shrink-0 focus:outline-none" style={{ color: '#767683' }}>
                  {showPassword
                    ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  }
                </button>
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
                {t('auth.rememberMe')}
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-opacity disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #000666, #1a237e)', fontFamily: '"Plus Jakarta Sans", sans-serif' }}
            >
              {loading ? t('auth.loggingIn') : <><span>{t('auth.loginAction')}</span><span>→</span></>}
            </button>
          </form>

          {/* Séparateur */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: '#eceef1' }} />
            <span className="text-xs" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>{t('auth.or')}</span>
            <div className="flex-1 h-px" style={{ background: '#eceef1' }} />
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => window.location.href = 'http://localhost:8001/auth/google'}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition hover:bg-gray-200"
              style={{ background: '#f2f4f7', color: '#191c1e', fontFamily: 'Manrope, sans-serif' }}>
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </button>
            <button
              type="button"
              onClick={() => window.location.href = 'http://localhost:8001/auth/apple'}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition hover:bg-gray-200"
              style={{ background: '#f2f4f7', color: '#191c1e', fontFamily: 'Manrope, sans-serif' }}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              Apple
            </button>
          </div>
        </div>

        <p className="text-center text-sm mt-6" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Manrope, sans-serif' }}>
          {t('auth.noAccountYet')}{' '}
          <Link to="/register" className="font-semibold hover:underline" style={{ color: '#fdd400' }}>
            {t('auth.signupFree')}
          </Link>
        </p>
      </div>
    </div>
  )
}
