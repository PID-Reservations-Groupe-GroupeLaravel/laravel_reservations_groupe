import { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../api/axios'

export default function RegisterPage() {
  const { login } = useAuth()
  const navigate   = useNavigate()

  const [form, setForm] = useState({
    login: '',
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    password_confirmation: '',
    langue: 'fr',
  })
  const [photo, setPhoto]           = useState(null)
  const [preview, setPreview]       = useState(null)
  const [errors, setErrors]         = useState({})
  const [loading, setLoading]       = useState(false)
  const [loginAvail, setLoginAvail] = useState(null)
  const [emailAvail, setEmailAvail] = useState(null)
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
    background: errors[name] ? '#ffdad6' : '#f2f4f7',
    color: '#191c1e',
    fontFamily: 'Manrope, sans-serif',
  })

  return (
    <div className="min-h-screen flex" style={{ background: '#f7f9fc' }}>

      {/* ── Gauche — Hero ── */}
      <div className="hidden lg:flex lg:w-5/12 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #000666 0%, #1a237e 100%)' }}>

        {/* Ambient */}
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #7986cb, transparent 70%)' }} />

        {/* Logo */}
        <div>
          <h2 className="text-2xl font-bold text-white" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            Ovatio<span style={{ color: '#fdd400' }}>.be</span>
          </h2>
        </div>

        {/* Tagline */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: '#fdd400', fontFamily: 'Manrope, sans-serif' }}>
            Rejoignez la communauté
          </p>
          <h1 className="text-5xl font-extrabold text-white leading-tight mb-6"
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            Rejoignez<br />
            <span style={{ color: '#fdd400' }}>l'Élite</span><br />
            Culturelle.
          </h1>
          <p className="text-sm leading-relaxed mb-8"
            style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Manrope, sans-serif' }}>
            Accédez aux meilleurs spectacles de Bruxelles, réservez en quelques clics et rejoignez une communauté de passionnés.
          </p>

        </div>

        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'Manrope, sans-serif' }}>
          Ovatio.be — La Scène Curatée
        </p>
      </div>

      {/* ── Droite — Formulaire ── */}
      <div className="flex-1 flex items-start justify-center py-12 px-6 overflow-y-auto">
        <div className="w-full max-w-md">

          {/* Logo mobile */}
          <div className="lg:hidden text-center mb-8">
            <h2 className="text-2xl font-bold" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#000666' }}>
              Ovatio<span style={{ color: '#fdd400' }}>.be</span>
            </h2>
          </div>

          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>
            Créer votre compte
          </h1>
          <p className="text-sm mb-8" style={{ fontFamily: 'Manrope, sans-serif', color: '#767683' }}>
            Déjà membre ?{' '}
            <Link to="/login" style={{ color: '#000666' }} className="font-semibold hover:underline">
              Connectez-vous
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
                Photo de profil (optionnelle) · JPG ou PNG, Max 5MB
              </p>
              {errors.photo && <p className="text-xs" style={{ color: '#ba1a1a' }}>{errors.photo[0]}</p>}
            </div>

            {/* Prénom / Nom */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                  style={{ fontFamily: 'Manrope, sans-serif', color: '#454652' }}>Prénom</label>
                <input type="text" value={form.firstname} onChange={set('firstname')}
                  placeholder="Jean"
                  className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                  style={inputClass('firstname')} />
                {errors.firstname && <p className="text-xs mt-1" style={{ color: '#ba1a1a' }}>{errors.firstname[0]}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                  style={{ fontFamily: 'Manrope, sans-serif', color: '#454652' }}>Nom</label>
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
                style={{ fontFamily: 'Manrope, sans-serif', color: '#454652' }}>Identifiant (public)</label>
              <input type="text" value={form.login} onChange={set('login')}
                onBlur={checkLogin} placeholder="mon_login"
                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                style={inputClass('login')} />
              {loginAvail === true  && <p className="text-xs mt-1" style={{ color: '#386a20' }}>✓ Login disponible</p>}
              {loginAvail === false && <p className="text-xs mt-1" style={{ color: '#ba1a1a' }}>✗ Login déjà pris</p>}
              {errors.login && <p className="text-xs mt-1" style={{ color: '#ba1a1a' }}>{errors.login[0]}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                style={{ fontFamily: 'Manrope, sans-serif', color: '#454652' }}>Adresse email</label>
              <input type="email" value={form.email} onChange={set('email')}
                onBlur={checkEmail} placeholder="email@exemple.com"
                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                style={inputClass('email')} />
              {emailAvail === true  && <p className="text-xs mt-1" style={{ color: '#386a20' }}>✓ Email disponible</p>}
              {emailAvail === false && <p className="text-xs mt-1" style={{ color: '#ba1a1a' }}>✗ Email déjà utilisé</p>}
              {errors.email && <p className="text-xs mt-1" style={{ color: '#ba1a1a' }}>{errors.email[0]}</p>}
            </div>

            {/* Langue / Mot de passe */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                  style={{ fontFamily: 'Manrope, sans-serif', color: '#454652' }}>Langue de préférence</label>
                <select value={form.langue} onChange={set('langue')}
                  className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                  style={{ background: '#f2f4f7', color: '#191c1e', fontFamily: 'Manrope, sans-serif' }}>
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="nl">Nederlands</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                  style={{ fontFamily: 'Manrope, sans-serif', color: '#454652' }}>Mot de passe</label>
                <input type="password" value={form.password} onChange={set('password')}
                  placeholder="Min. 6 car."
                  className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                  style={inputClass('password')} />
                {errors.password && <p className="text-xs mt-1" style={{ color: '#ba1a1a' }}>{errors.password[0]}</p>}
              </div>
            </div>

            {/* Confirmation */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                style={{ fontFamily: 'Manrope, sans-serif', color: '#454652' }}>Confirmation du mot de passe</label>
              <input type="password" value={form.password_confirmation}
                onChange={set('password_confirmation')}
                placeholder="Répéter le mot de passe"
                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                style={inputClass('password_confirmation')} />
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-opacity disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #000666, #1a237e)', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
              {loading ? 'Inscription...' : 'Créer mon compte'}
            </button>

            <p className="text-xs text-center" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
              En cliquant sur "Créer mon compte", vous acceptez nos{' '}
              <Link to="/cookies" style={{ color: '#000666' }} className="hover:underline">Conditions d'utilisation</Link>
              {' '}et notre{' '}
              <a href="#" style={{ color: '#000666' }} className="hover:underline">Politique de confidentialité</a>.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
