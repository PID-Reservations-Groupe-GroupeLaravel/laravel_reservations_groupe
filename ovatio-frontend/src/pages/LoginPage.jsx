import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import GoogleOAuthButton from '../components/GoogleOAuthButton'

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
    <div className="h-screen w-screen flex relative overflow-hidden"
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

      {/* Left side - Image */}
      <div className="hidden md:flex md:w-1/2 relative justify-center items-center">
        <img
          src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=1000&fit=crop"
          alt="scène de spectacle"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0, 6, 102, 0.4) 0%, rgba(26, 35, 126, 0.4) 100%)' }}></div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center px-4 py-8 relative z-10">

        <div className="w-full max-w-sm">
          {/* Bouton retour */}
          <div className="mb-6">
            <Link to="/shows"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-80"
              style={{ fontFamily: 'Manrope, sans-serif', background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)' }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Retour
            </Link>
          </div>

          {/* Logo */}
          <Link to="/shows" className="block text-center mb-8">
            <h1 className="text-3xl font-bold text-white tracking-tight"
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
              Standing-Ovation<span style={{ color: '#fdd400' }}>.be</span>
            </h1>
            <p className="text-xs mt-1 tracking-[0.3em] uppercase"
              style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Manrope, sans-serif' }}>
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
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="votre.email@example.com"
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

          {/* Google OAuth Button */}
          <GoogleOAuthButton t={t} />
        </div>

          <p className="text-center text-sm mt-6" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Manrope, sans-serif' }}>
            {t('auth.noAccountYet')}{' '}
            <Link to="/register" className="font-semibold hover:underline" style={{ color: '#fdd400' }}>
              {t('auth.signupFree')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
