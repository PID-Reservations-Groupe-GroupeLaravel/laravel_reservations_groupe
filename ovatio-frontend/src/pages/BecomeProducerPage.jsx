import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../api/axios'

export default function BecomeProducerPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    company_name: '',
    siret: '',
    description: '',
    website: '',
    phone: '',
  })
  const [loading, setLoading]   = useState(false)
  const [success, setSuccess]   = useState(false)
  const [error, setError]       = useState('')

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/producer/apply', form)
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message ?? 'Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  // Déjà producteur ou admin
  if (user?.roles?.includes('producer') || user?.roles?.includes('admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-md">
          <div className="text-5xl mb-4">🎭</div>
          <h2 className="text-2xl font-bold text-ovatio-blue mb-2">Vous êtes déjà producteur !</h2>
          <p className="text-gray-500 text-sm mb-6">Vous avez déjà accès au tableau de bord producteur.</p>
          <button
            onClick={() => navigate('/shows')}
            className="bg-ovatio-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Retour aux spectacles
          </button>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-md">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-green-700 mb-2">Demande envoyée !</h2>
          <p className="text-gray-500 text-sm mb-6">
            Votre demande a été transmise à notre équipe. Vous serez notifié par email sous 48h.
          </p>
          <button
            onClick={() => navigate('/shows')}
            className="bg-ovatio-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Retour aux spectacles
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Hero */}
        <div className="bg-gradient-to-r from-ovatio-blue to-ovatio-light text-white rounded-2xl p-8 mb-8 text-center">
          <div className="text-5xl mb-4">🎬</div>
          <h1 className="text-3xl font-bold mb-2">Devenez Producteur</h1>
          <p className="text-blue-100 text-sm max-w-md mx-auto">
            Publiez vos spectacles, gérez vos représentations et atteignez votre public sur Ovatio.
          </p>
        </div>

        {/* Avantages */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: '🎭', title: 'Publiez', desc: 'Ajoutez vos spectacles facilement' },
            { icon: '📅', title: 'Planifiez', desc: 'Gérez vos représentations' },
            { icon: '🎟️', title: 'Vendez', desc: 'Recevez des réservations en ligne' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <div className="text-3xl mb-2">{icon}</div>
              <p className="font-semibold text-gray-800 text-sm">{title}</p>
              <p className="text-gray-400 text-xs mt-1">{desc}</p>
            </div>
          ))}
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-ovatio-blue mb-6">Formulaire de demande</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom de la compagnie / organisation <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.company_name}
                onChange={set('company_name')}
                required
                placeholder="Théâtre du Soleil"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Numéro d'entreprise (BCE/SIRET)
              </label>
              <input
                type="text"
                value={form.siret}
                onChange={set('siret')}
                placeholder="BE 0123.456.789"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description de votre activité <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.description}
                onChange={set('description')}
                required
                rows={4}
                placeholder="Présentez votre compagnie, vos spectacles, votre style artistique..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Site web</label>
                <input
                  type="url"
                  value={form.website}
                  onChange={set('website')}
                  placeholder="https://macompagnie.be"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={set('phone')}
                  placeholder="+32 2 000 00 00"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ovatio-blue text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 mt-2"
            >
              {loading ? 'Envoi en cours...' : 'Envoyer ma demande'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
