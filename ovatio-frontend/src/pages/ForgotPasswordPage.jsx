import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState('')
  const [sent, setSent]       = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/forgot-password', { email })
      setSent(true)
    } catch (err) {
      setError(err.response?.data?.message ?? 'Erreur lors de l\'envoi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #000666 0%, #1a237e 100%)' }}>
      <div className="w-full max-w-sm">
        <Link to="/shows" className="block text-center mb-8">
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            Ovatio<span style={{ color: '#fdd400' }}>.be</span>
          </h1>
          <p className="text-xs mt-1 tracking-widest uppercase"
            style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Manrope, sans-serif' }}>
            La Scène Curatée
          </p>
        </Link>

        <div className="rounded-3xl p-8" style={{ background: '#ffffff', boxShadow: '0 25px 50px rgba(0,0,0,0.3)' }}>
          <h2 className="text-xl font-bold mb-1" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>
            Mot de passe oublié
          </h2>
          <p className="text-sm mb-6" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
            Entrez votre email pour recevoir un lien de réinitialisation.
          </p>

          {sent ? (
            <div className="text-center py-4">
              <div className="text-4xl mb-3">📧</div>
              <p className="text-sm font-semibold mb-2" style={{ color: '#191c1e', fontFamily: 'Manrope, sans-serif' }}>
                Email envoyé !
              </p>
              <p className="text-xs" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
                Vérifiez votre boîte mail et suivez le lien reçu.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="text-sm rounded-xl px-4 py-3"
                  style={{ background: '#ffdad6', color: '#93000a', fontFamily: 'Manrope, sans-serif' }}>
                  {error}
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-2"
                  style={{ color: '#454652', fontFamily: 'Manrope, sans-serif' }}>
                  Adresse email
                </label>
                <div className="flex items-center rounded-xl px-4 py-3 gap-3" style={{ background: '#f2f4f7' }}>
                  <svg className="w-4 h-4 shrink-0" style={{ color: '#767683' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                    placeholder="email@exemple.com" className="flex-1 bg-transparent text-sm outline-none"
                    style={{ fontFamily: 'Manrope, sans-serif', color: '#191c1e' }} />
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-opacity disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #000666, #1a237e)', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                {loading ? 'Envoi...' : 'Envoyer le lien'}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-sm mt-6" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Manrope, sans-serif' }}>
          <Link to="/login" className="font-semibold hover:underline" style={{ color: '#fdd400' }}>
            ← Retour à la connexion
          </Link>
        </p>
      </div>
    </div>
  )
}