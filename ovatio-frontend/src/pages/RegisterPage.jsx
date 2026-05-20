import { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import api from '../api/axios'

export default function RegisterPage() {
  const { login } = useAuth()
  const { t } = useLanguage()
  const navigate   = useNavigate()

  const [form, setForm] = useState({
    login: '',
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    password_confirmation: '',
    langue: 'fr',
    accept_terms: false,
  })
  const [photo, setPhoto]               = useState(null)
  const [preview, setPreview]           = useState(null)
  const [errors, setErrors]             = useState({})
  const [loading, setLoading]           = useState(false)
  const [loginAvail, setLoginAvail]     = useState(null)
  const [emailAvail, setEmailAvail]     = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm]   = useState(false)
  const fileRef = useRef()

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handlePhoto = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPhoto(file)
    setPreview(URL.createObjectURL(file))
  }

  const checkLogin = async () => {
    if (!form.login) return
    const { data } = await api.post('/check-login', { login: form.login })
    setLoginAvail(data.available)
  }

  const checkEmail = async () => {
    if (!form.email) return
    const { data } = await api.post('/check-email', { email: form.email })
    setEmailAvail(data.available)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setLoading(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      if (photo) fd.append('photo', photo)

      const { data } = await api.post('/register', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      localStorage.setItem('ovatio_token', data.token)
      localStorage.setItem('ovatio_user', JSON.stringify(data.user))
      navigate('/shows')
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors ?? {})
      }
    } finally {
      setLoading(false)
    }
  }

  const inputClass = (name) => ({
    background: errors[name] ? '#ffdad6' : '#ffffff',
    color: '#191c1e',
    fontFamily: 'Manrope, sans-serif',
    border: '1px solid #e0e3e6',
  })

  return (
    <div className="h-screen w-screen flex" style={{ background: '#f7f9fc' }}>

      {/* ── Gauche — Hero ── */}
      <div className="hidden lg:flex lg:w-5/12 flex-col justify-between p-12 relative overflow-hidden"
        style={{
          background: 'linear-gradient(160deg, #000666 0%, #1a237e 100%)',
          backgroundImage: 'url("https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=1000&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlend: 'multiply'
        }}>

        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(160deg, rgba(0, 6, 102, 0.7) 0%, rgba(26, 35, 126, 0.7) 100%)' }} />

        {/* Logo */}
        <Link to="/shows" className="inline-block relative z-10">
          <h2 className="text-2xl font-bold text-white" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            Standing-Ovation<span style={{ color: '#fdd400' }}>.be</span>
          </h2>
        </Link>

        {/* Tagline */}
        <div className="relative z-10">
          <p className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: '#fdd400', fontFamily: 'Manrope, sans-serif' }}>
            {t('auth.joinCommunity')}
          </p>
          <h1 className="text-5xl font-extrabold text-white leading-tight mb-6"
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            {t('auth.joinElite')}
          </h1>
          <p className="text-sm leading-relaxed mb-8"
            style={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'Manrope, sans-serif' }}>
            {t('auth.joinDesc')}
          </p>

        </div>

        <p className="text-xs relative z-10" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Manrope, sans-serif' }}>
          Standing Ovation.be — {t('shows.hero_badge')}
        </p>
      </div>

      {/* ── Droite — Formulaire ── */}
      <div className="flex-1 flex flex-col items-center justify-start py-8 px-6 overflow-y-auto">
        <div className="w-full max-w-md">

          {/* Bouton retour */}
          <div className="mb-6">
            <Link to="/shows"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 transition-opacity hover:opacity-80"
              style={{ fontFamily: 'Manrope, sans-serif', background: '#f2f4f7' }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Retour
            </Link>
          </div>

          {/* Logo mobile */}
          <div className="lg:hidden text-center mb-8">
            <h2 className="text-2xl font-bold" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#000666' }}>
              Standing-Ovation<span style={{ color: '#fdd400' }}>.be</span>
            </h2>
          </div>

          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>
            {t('auth.createAccount')}
          </h1>
          <p className="text-sm mb-8" style={{ fontFamily: 'Manrope, sans-serif', color: '#767683' }}>
            {t('auth.alreadyMember')}{' '}
            <Link to="/login" style={{ color: '#000666' }} className="font-semibold hover:underline">
              {t('auth.loginLink')}
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Photo */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative w-20 h-20">
                <button type="button" onClick={() => fileRef.current.click()}
                  className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center transition"
                  style={{ background: errors.photo ? '#ffdad6' : '#eceef1', border: '3px dashed #c6c5d4' }}>
                  {preview ? (
                    <img src={preview} alt="Aperçu" className="w-full h-full object-cover" />
                  ) : (
                    <svg className="w-8 h-8" style={{ color: '#767683' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
                <button type="button" onClick={() => fileRef.current.click()}
                  className="absolute bottom-0 right-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs"
                  style={{ background: '#000666' }}>
                  +
                </button>
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
              <p className="text-xs" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
                {t('auth.profilePhoto')}
              </p>
              {errors.photo && <p className="text-xs" style={{ color: '#ba1a1a' }}>{errors.photo[0]}</p>}
            </div>

            {/* Prénom / Nom */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                  style={{ fontFamily: 'Manrope, sans-serif', color: '#454652' }}>{t('auth.firstname')}</label>
                <input type="text" value={form.firstname} onChange={set('firstname')}
                  placeholder="Jean"
                  className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                  style={inputClass('firstname')} />
                {errors.firstname && <p className="text-xs mt-1" style={{ color: '#ba1a1a' }}>{errors.firstname[0]}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                  style={{ fontFamily: 'Manrope, sans-serif', color: '#454652' }}>{t('auth.lastname')}</label>
                <input type="text" value={form.lastname} onChange={set('lastname')}
                  placeholder="Dupont"
                  className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                  style={inputClass('lastname')} />
                {errors.lastname && <p className="text-xs mt-1" style={{ color: '#ba1a1a' }}>{errors.lastname[0]}</p>}
              </div>
            </div>

            {/* Login */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                style={{ fontFamily: 'Manrope, sans-serif', color: '#454652' }}>{t('auth.loginField')}</label>
              <input type="text" value={form.login} onChange={set('login')}
                onBlur={checkLogin} placeholder="mon_login"
                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                style={inputClass('login')} />
              {loginAvail === true  && <p className="text-xs mt-1" style={{ color: '#386a20' }}>{t('auth.loginAvailable')}</p>}
              {loginAvail === false && <p className="text-xs mt-1" style={{ color: '#ba1a1a' }}>{t('auth.loginTaken')}</p>}
              {errors.login && <p className="text-xs mt-1" style={{ color: '#ba1a1a' }}>{errors.login[0]}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                style={{ fontFamily: 'Manrope, sans-serif', color: '#454652' }}>{t('auth.emailField')}</label>
              <input type="email" value={form.email} onChange={set('email')}
                onBlur={checkEmail} placeholder="email@exemple.com"
                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                style={inputClass('email')} />
              {emailAvail === true  && <p className="text-xs mt-1" style={{ color: '#386a20' }}>{t('auth.emailAvailable')}</p>}
              {emailAvail === false && <p className="text-xs mt-1" style={{ color: '#ba1a1a' }}>{t('auth.emailUsed')}</p>}
              {errors.email && <p className="text-xs mt-1" style={{ color: '#ba1a1a' }}>{errors.email[0]}</p>}
            </div>

            {/* Langue / Mot de passe */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                  style={{ fontFamily: 'Manrope, sans-serif', color: '#454652' }}>{t('auth.languagePref')}</label>
                <select value={form.langue} onChange={set('langue')}
                  className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                  style={{ background: '#ffffff', color: '#191c1e', fontFamily: 'Manrope, sans-serif', border: '1px solid #e0e3e6' }}>
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="nl">Nederlands</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                  style={{ fontFamily: 'Manrope, sans-serif', color: '#454652' }}>{t('auth.passwordField')}</label>
                <div className="flex items-center rounded-xl px-3 py-2.5 gap-2" style={inputClass('password')}>
                  <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={set('password')}
                    placeholder={t('auth.minPassword')}
                    className="flex-1 bg-transparent text-sm outline-none"
                    style={{ fontFamily: 'Manrope, sans-serif', color: '#191c1e', minWidth: 0 }} />
                  <button type="button" onClick={() => setShowPassword(p => !p)} style={{ color: '#767683', flexShrink: 0 }}>
                    {showPassword
                      ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    }
                  </button>
                </div>
                {errors.password && <p className="text-xs mt-1" style={{ color: '#ba1a1a' }}>{errors.password[0]}</p>}
              </div>
            </div>

            {/* Confirmation */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                style={{ fontFamily: 'Manrope, sans-serif', color: '#454652' }}>{t('auth.confirmPassword')}</label>
              <div className="flex items-center rounded-xl px-3 py-2.5 gap-2" style={inputClass('password_confirmation')}>
                <input type={showConfirm ? 'text' : 'password'} value={form.password_confirmation}
                  onChange={set('password_confirmation')}
                  placeholder={t('auth.repeatPassword')}
                  className="flex-1 bg-transparent text-sm outline-none"
                  style={{ fontFamily: 'Manrope, sans-serif', color: '#191c1e', minWidth: 0 }} />
                <button type="button" onClick={() => setShowConfirm(p => !p)} style={{ color: '#767683', flexShrink: 0 }}>
                  {showConfirm
                    ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                    : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  }
                </button>
              </div>
            </div>

            {/* Accept Terms Checkbox */}
            <div className="flex items-start gap-3 pt-2">
              <input
                type="checkbox"
                id="accept_terms"
                checked={form.accept_terms}
                onChange={(e) => setForm({ ...form, accept_terms: e.target.checked })}
                className="w-5 h-5 mt-0.5 rounded"
                style={{ accentColor: '#000666' }}
              />
              <label htmlFor="accept_terms" className="text-xs flex-1 cursor-pointer"
                style={{ color: '#454652', fontFamily: 'Manrope, sans-serif', lineHeight: 1.5 }}>
                {t('auth.termsText')}{' '}
                <Link to="/cookies" style={{ color: '#000666' }} className="hover:underline font-semibold">{t('auth.termsLink')}</Link>
                {' '}{t('auth.termsAnd')}{' '}
                <a href="#" style={{ color: '#000666' }} className="hover:underline font-semibold">{t('auth.privacyLink')}</a>.
              </label>
              {errors.accept_terms && <p className="text-xs" style={{ color: '#ba1a1a' }}>{errors.accept_terms[0]}</p>}
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading || !form.accept_terms}
              className="w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-opacity disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #000666, #1a237e)', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
              {loading ? t('auth.registering') : t('auth.registerBtn')}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
