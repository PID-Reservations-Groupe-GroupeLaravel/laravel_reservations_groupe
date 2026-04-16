import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../contexts/AuthContext'

export default function ShowDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [show, setShow]                   = useState(null)
  const [representations, setRepresentations] = useState([])
  const [prices, setPrices]               = useState([])
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState('')

  // Formulaire de réservation
  const [selectedRepr, setSelectedRepr]   = useState('')
  const [selectedPrice, setSelectedPrice] = useState('')
  const [quantity, setQuantity]           = useState(1)
  const [submitting, setSubmitting]       = useState(false)
  const [success, setSuccess]             = useState('')
  const [formError, setFormError]         = useState('')

  useEffect(() => {
    Promise.all([
      api.get(`/shows/${id}`),
      api.get(`/shows/${id}/representations`),
      api.get('/prices'),
    ])
      .then(([showRes, reprRes, priceRes]) => {
        setShow(showRes.data.data ?? showRes.data)
        setRepresentations(reprRes.data.data ?? reprRes.data)
        setPrices(priceRes.data.data ?? priceRes.data)
      })
      .catch(() => setError('Impossible de charger ce spectacle.'))
      .finally(() => setLoading(false))
  }, [id])

  const handleReserve = async (e) => {
    e.preventDefault()
    if (!user) { navigate('/login'); return }
    setFormError('')
    setSuccess('')
    setSubmitting(true)
    try {
      await api.post('/reservations', {
        representation_id: parseInt(selectedRepr),
        price_id: parseInt(selectedPrice),
        quantity: parseInt(quantity),
      })
      setSuccess('✅ Réservation créée avec succès ! Rendez-vous dans Mes réservations.')
      setSelectedRepr('')
      setSelectedPrice('')
      setQuantity(1)
    } catch (err) {
      const errors = err.response?.data?.errors
      if (errors) {
        setFormError(Object.values(errors).flat().join(' '))
      } else {
        setFormError(err.response?.data?.message ?? 'Erreur lors de la réservation.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Spinner />
  if (error)   return <p className="text-center text-red-500 mt-16">{error}</p>
  if (!show)   return (
    <div className="text-center py-24">
      <div className="text-6xl mb-4">🎭</div>
      <h2 className="text-2xl font-bold text-gray-700">Spectacle introuvable</h2>
      <a href="/shows" className="text-blue-600 hover:underline mt-4 inline-block">
        Retour aux spectacles
      </a>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header spectacle */}
      <div className="bg-gradient-to-r from-ovatio-blue to-ovatio-light text-white rounded-2xl p-8 mb-8">
        <h1 className="text-3xl font-bold mb-2">{show.title}</h1>
        <span className={`text-sm px-3 py-1 rounded-full ${
          show.status === 'CONFIRME' ? 'bg-green-400 text-green-900' : 'bg-yellow-300 text-yellow-900'
        }`}>
          {show.status === 'CONFIRME' ? '✓ Confirmé' : '⏳ À confirmer'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Représentations */}
        <div>
          <h2 className="text-xl font-bold text-ovatio-blue mb-4">Représentations</h2>
          {representations.length === 0 ? (
            <p className="text-gray-400">Aucune représentation disponible.</p>
          ) : (
            <ul className="space-y-3">
              {representations.map((r) => (
                <li key={r.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                  <div className="font-medium text-gray-800">
                    📅 {new Date(r.schedule ?? r.date_start).toLocaleDateString('fr-BE', {
                      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </div>
                  {r.location && (
                    <div className="text-sm text-gray-500 mt-1">
                      📍 {r.location?.name ?? r.location}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Formulaire réservation */}
        <div>
          <h2 className="text-xl font-bold text-ovatio-blue mb-4">Réserver</h2>

          {!user ? (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
              <p className="text-gray-600 mb-4">Connectez-vous pour réserver</p>
              <button
                onClick={() => navigate('/login')}
                className="bg-ovatio-blue text-white px-6 py-2 rounded-lg hover:bg-ovatio-light transition"
              >
                Se connecter
              </button>
            </div>
          ) : (
            <form onSubmit={handleReserve} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
              {success && (
                <div className="bg-green-50 border border-green-300 text-green-700 rounded-lg p-3 text-sm">
                  {success}
                </div>
              )}
              {formError && (
                <div className="bg-red-50 border border-red-300 text-red-700 rounded-lg p-3 text-sm">
                  {formError}
                </div>
              )}

              {/* Représentation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Représentation
                </label>
                <select
                  value={selectedRepr}
                  onChange={(e) => setSelectedRepr(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Choisir --</option>
                  {representations.map((r) => (
                    <option key={r.id} value={r.id}>
                      {new Date(r.schedule ?? r.date_start).toLocaleDateString('fr-BE')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tarif */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tarif
                </label>
                <select
                  value={selectedPrice}
                  onChange={(e) => setSelectedPrice(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Choisir --</option>
                  {prices.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label} — {p.price} €
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantité */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de places
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-ovatio-blue text-white font-semibold py-2.5 rounded-lg hover:bg-ovatio-light transition disabled:opacity-50"
              >
                {submitting ? 'Réservation...' : 'Confirmer la réservation'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

function Spinner() {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="w-10 h-10 border-4 border-blue-200 border-t-ovatio-blue rounded-full animate-spin" />
    </div>
  )
}
