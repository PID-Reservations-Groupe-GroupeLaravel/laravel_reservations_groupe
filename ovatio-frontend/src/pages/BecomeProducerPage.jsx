import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../api/axios'

const FEATURES = [
  { emoji: '👁', title: 'Visibilité Premium', desc: 'Mise en avant éditoriale de vos spectacles et artistes.' },
  { emoji: '📊', title: 'Tableau de bord', desc: 'Analytiques détaillées et gestion des réservations en temps réel.' },
]

const inputStyle = {
  width: '100%', padding: '1rem 1.25rem', borderRadius: '0.75rem',
  border: 'none', outline: 'none', background: '#f2f4f7',
  fontSize: '0.875rem', fontFamily: 'Manrope, sans-serif', color: '#191c1e',
}

export default function BecomeProducerPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ company_name: '', siret: '', description: '', website: '', phone: '', firstname: '', lastname: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError]     = useState('')

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try { await api.post('/producer/apply', form); setSuccess(true) }
    catch (err) { setError(err.response?.data?.message ?? 'Une erreur est survenue.') }
    finally { setLoading(false) }
  }

  if (user?.roles?.includes('producer') || user?.roles?.includes('admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#f7f9fc' }}>
        <div className="text-center max-w-md">
          <div className="text-5xl mb-6">🎭</div>
          <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>
            Vous êtes déjà producteur !
          </h2>
          <p className="text-sm mb-8" style={{ color: '#454652', fontFamily: 'Manrope, sans-serif' }}>
            Vous avez déjà accès au tableau de bord producteur.
          </p>
          <button onClick={() => navigate('/shows')}
            className="px-6 py-3 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity"
            style={{ background: 'linear-gradient(135deg, #000666, #1a237e)', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            Retour aux spectacles
          </button>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#f7f9fc' }}>
        <div className="text-center max-w-md">
          <div className="text-5xl mb-6">✅</div>
          <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>
            Candidature envoyée !
          </h2>
          <p className="text-sm mb-8" style={{ color: '#454652', fontFamily: 'Manrope, sans-serif' }}>
            Notre équipe vous contactera sous 48h pour étudier votre dossier.
          </p>
          <button onClick={() => navigate('/shows')}
            className="px-6 py-3 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity"
            style={{ background: 'linear-gradient(135deg, #000666, #1a237e)', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            Retour aux spectacles
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#f7f9fc', minHeight: '100vh' }}>
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

          {/* ── LEFT ── */}
          <div>
            <span className="inline-block text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-8"
              style={{ background: '#fdd400', color: '#6f5c00', fontFamily: 'Manrope, sans-serif' }}>
              Partenariat
            </span>
            <h1 className="font-extrabold mb-6 leading-none"
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: '3.5rem', letterSpacing: '-0.02em', color: '#000666' }}>
              Devenez<br /><span style={{ color: '#1a237e' }}>Producteur.</span>
            </h1>
            <p className="text-base leading-relaxed mb-10"
              style={{ color: '#454652', fontFamily: 'Manrope, sans-serif', maxWidth: '360px' }}>
              Rejoignez l'élite de la scène culturelle belge. Ovatio.be offre aux producteurs
              une vitrine d'exception et des outils de gestion de classe mondiale.
            </p>
            <div className="space-y-4 mb-10">
              {FEATURES.map((f) => (
                <div key={f.title} className="flex items-start gap-4 p-5 rounded-2xl"
                  style={{ background: '#ffffff', boxShadow: '0 2px 16px rgba(0,6,102,0.06)' }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                    style={{ background: 'linear-gradient(135deg, #000666, #1a237e)' }}>
                    {f.emoji}
                  </div>
                  <div>
                    <p className="text-sm font-bold mb-0.5"
                      style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>{f.title}</p>
                    <p className="text-xs leading-relaxed"
                      style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-2xl overflow-hidden" style={{ height: '240px' }}>
              <img src="https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=700&q=80"
                alt="Théâtre" className="w-full h-full object-cover"
                onError={(e) => { e.target.parentElement.style.background = 'linear-gradient(135deg, #000666, #1a237e)'; e.target.style.display = 'none' }} />
            </div>
          </div>

          {/* ── RIGHT — form ── */}
          <div className="rounded-2xl p-8" style={{ background: '#ffffff', boxShadow: '0 4px 40px rgba(0,6,102,0.06)' }}>
            <form onSubmit={handleSubmit} className="space-y-6">

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: '#454652', fontFamily: 'Manrope, sans-serif' }}>Structure de production</label>
                <input type="text" value={form.company_name} onChange={set('company_name')}
                  placeholder="ex: Les Productions du Soir" required style={inputStyle} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2"
                    style={{ color: '#454652', fontFamily: 'Manrope, sans-serif' }}>Prénom</label>
                  <input type="text" value={form.firstname} onChange={set('firstname')}
                    placeholder="Jean" style={inputStyle} />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2"
                    style={{ color: '#454652', fontFamily: 'Manrope, sans-serif' }}>Nom</label>
                  <input type="text" value={form.lastname} onChange={set('lastname')}
                    placeholder="Dupont" style={inputStyle} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: '#454652', fontFamily: 'Manrope, sans-serif' }}>Email professionnel</label>
                <input type="email" value={form.website} onChange={set('website')}
                  placeholder="contact@votreproduction.be" required style={inputStyle} />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: '#454652', fontFamily: 'Manrope, sans-serif' }}>Description de la demande</label>
                <textarea value={form.description} onChange={set('description')} rows={5} required
                  placeholder="Présentez votre activité, vos productions actuelles et vos besoins..."
                  style={{ ...inputStyle, resize: 'none' }} />
                <p className="text-xs mt-1.5" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
                  Décrivez en quelques mots l'univers de votre maison de production.
                </p>
              </div>

              {error && <p className="text-sm" style={{ color: '#ba1a1a', fontFamily: 'Manrope, sans-serif' }}>{error}</p>}

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pt-2">
                <button type="submit" disabled={loading}
                  className="px-8 py-4 rounded-xl font-bold text-base text-white hover:opacity-90 transition-opacity disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #000666, #1a237e)', fontFamily: '"Plus Jakarta Sans", sans-serif', minWidth: '200px' }}>
                  {loading ? 'Envoi…' : 'Soumettre la candidature'}
                </button>
                <p className="text-xs leading-relaxed" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
                  En soumettant, vous acceptez nos{' '}
                  <a href="/cookies" style={{ color: '#000666' }} className="underline">conditions générales</a> de partenariat.
                </p>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-center gap-2">
          <svg className="w-4 h-4" style={{ color: '#767683' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <p className="text-xs font-bold uppercase tracking-widest"
            style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
            Traitement de dossier sous 48h
          </p>
        </div>
      </div>
    </div>
  )
}
