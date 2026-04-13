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
  const [photo, setPhoto]         = useState(null)
  const [preview, setPreview]     = useState(null)
  const [errors, setErrors]       = useState({})
  const [loading, setLoading]     = useState(false)
  const [loginAvail, setLoginAvail]   = useState(null)
  const [emailAvail, setEmailAvail]   = useState(null)
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

      // Auto-login après inscription
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

  const fieldClass = (name) =>
    `w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      errors[name] ? 'border-red-400 bg-red-50' : 'border-gray-300'
    }`

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ovatio-dark to-ovatio-blue py-12 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🎭</div>
          <h1 className="text-2xl font-bold text-ovatio-blue">Créer un compte</h1>
          <p className="text-gray-500 text-sm mt-1">Rejoignez Ovatio</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* ===== PHOTO EN HAUT ===== */}
          <div className="flex flex-col items-center gap-2 mb-2">
            <div className="relative w-24 h-24">
              <button
                type="button"
                onClick={() => fileRef.current.click()}
                className={`w-24 h-24 rounded-full overflow-hidden border-4 transition
                  ${errors.photo ? 'border-red-400' : 'border-blue-300 hover:border-blue-500'}
                  bg-gray-100 focus:outline-none shadow`}
              >
                {preview ? (
                  <img src={preview} alt="Aperçu" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-9 h-9 mb-1" fill="none"
                         viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M5.121 17.804A4 4 0 018 16h8a4 4 0 012.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-xs">Photo</span>
                  </div>
                )}
              </button>

              {/* Bouton + */}
              <button
                type="button"
                onClick={() => fileRef.current.click()}
                className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full w-7 h-7
                           flex items-center justify-center hover:bg-blue-700 shadow"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none"
                     viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>

            <input ref={fileRef} type="file" accept="image/*"
                   onChange={handlePhoto} className="hidden" />
            <p className="text-xs text-gray-400">Photo de profil (optionnelle)</p>
            {errors.photo && <p className="text-xs text-red-600">{errors.photo[0]}</p>}
          </div>
          {/* ========================= */}

          {/* Prénom / Nom */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
              <input type="text" value={form.firstname} onChange={set('firstname')}
                     placeholder="Jean" className={fieldClass('firstname')} />
              {errors.firstname && <p className="text-xs text-red-600 mt-1">{errors.firstname[0]}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input type="text" value={form.lastname} onChange={set('lastname')}
                     placeholder="Dupont" className={fieldClass('lastname')} />
              {errors.lastname && <p className="text-xs text-red-600 mt-1">{errors.lastname[0]}</p>}
            </div>
          </div>

          {/* Login */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Login</label>
            <input type="text" value={form.login} onChange={set('login')}
                   onBlur={checkLogin} placeholder="mon_login"
                   className={fieldClass('login')} />
            {loginAvail === true  && <p className="text-xs text-green-600 mt-1">✓ Login disponible</p>}
            {loginAvail === false && <p className="text-xs text-red-600 mt-1">✗ Login déjà pris</p>}
            {errors.login && <p className="text-xs text-red-600 mt-1">{errors.login[0]}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={form.email} onChange={set('email')}
                   onBlur={checkEmail} placeholder="email@exemple.com"
                   className={fieldClass('email')} />
            {emailAvail === true  && <p className="text-xs text-green-600 mt-1">✓ Email disponible</p>}
            {emailAvail === false && <p className="text-xs text-red-600 mt-1">✗ Email déjà utilisé</p>}
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email[0]}</p>}
          </div>

          {/* Langue */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Langue</label>
            <select value={form.langue} onChange={set('langue')}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="fr">Français</option>
              <option value="en">English</option>
              <option value="nl">Nederlands</option>
            </select>
          </div>

          {/* Mot de passe / Confirmation */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <input type="password" value={form.password} onChange={set('password')}
                     placeholder="Min. 6 car." className={fieldClass('password')} />
              {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password[0]}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmation</label>
              <input type="password" value={form.password_confirmation}
                     onChange={set('password_confirmation')}
                     placeholder="Répéter"
                     className={fieldClass('password_confirmation')} />
            </div>
          </div>

          <p className="text-xs text-gray-400">Min. 6 caractères, 1 majuscule, 1 caractère spécial</p>

          <button type="submit" disabled={loading}
                  className="w-full bg-ovatio-blue hover:bg-ovatio-light text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50">
            {loading ? 'Inscription...' : "S'inscrire"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">Se connecter</Link>
        </p>
      </div>
    </div>
  )
}
