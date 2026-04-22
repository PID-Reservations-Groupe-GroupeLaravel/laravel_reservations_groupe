import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../contexts/AuthContext'

export default function ShowDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [show, setShow]                       = useState(null)
  const [representations, setRepresentations] = useState([])
  const [prices, setPrices]                   = useState([])
  const [loading, setLoading]                 = useState(true)
  const [error, setError]                     = useState('')

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
      setSuccess('Réservation créée avec succès ! Rendez-vous dans Mes réservations.')
      setSelectedRepr('')
      setSelectedPrice('')
      setQuantity(1)
    } catch (err) {
      const errors = err.response?.data?.errors
      setFormError(errors ? Object.values(errors).flat().join(' ') : (err.response?.data?.message ?? 'Erreur lors de la réservation.'))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Spinner />
  if (error)   return (
    <div className="flex items-center justify-center h-64">
      <p className="text-sm" style={{ color: '#ba1a1a', fontFamily: 'Manrope, sans-serif' }}>{error}</p>
    </div>
  )
  if (!show) return (
    <div className="flex flex-col items-center justify-center py-32 gap-4">
      <span className="material-symbols-outlined text-6xl" style={{ color: '#c6c5d4' }}>theaters</span>
      <p className="text-sm" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>Spectacle introuvable.</p>
      <Link to="/shows" className="text-sm font-bold" style={{ color: '#000666' }}>← Retour aux spectacles</Link>
    </div>
  )

  const posterUrl = show.poster_url ? `/images/${show.poster_url}` : null

  return (
    <div style={{ background: '#f7f9fc', minHeight: '100vh' }}>

      {/* ── HERO avec image en fond ── */}
      <div className="relative overflow-hidden" style={{ minHeight: '480px' }}>

        {/* Image de fond */}
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={show.title}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'brightness(0.35) saturate(1.2)' }}
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, #000666 0%, #1a237e 100%)' }}
          />
        )}

        {/* Gradient overlay en bas pour transition douce */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,6,102,0.3) 0%, rgba(0,6,102,0.6) 60%, #f7f9fc 100%)',
          }}
        />

        {/* Lumières ambiantes */}
        <div className="absolute pointer-events-none"
          style={{ top: '-10%', left: '-10%', width: '40%', height: '60%',
            background: '#fdd400', borderRadius: '50%', filter: 'blur(140px)', opacity: 0.08 }} />
        <div className="absolute pointer-events-none"
          style={{ bottom: '10%', right: '-5%', width: '35%', height: '50%',
            background: '#8690ee', borderRadius: '50%', filter: 'blur(130px)', opacity: 0.1 }} />

        {/* Contenu hero */}
        <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-24 flex flex-col justify-end" style={{ minHeight: '480px' }}>

          {/* Lien retour */}
          <Link
            to="/shows"
            className="absolute top-8 left-6 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(8px)',
              color: 'rgba(255,255,255,0.85)',
              fontFamily: 'Manrope, sans-serif',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>arrow_back</span>
            Catalogue
          </Link>

          {/* Badge statut */}
          <span
            className="inline-block text-xs font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full mb-4 w-fit"
            style={{
              background: show.status === 'CONFIRME' ? 'rgba(0,255,120,0.2)' : 'rgba(253,212,0,0.25)',
              color: show.status === 'CONFIRME' ? '#a7f3d0' : '#fdd400',
              border: show.status === 'CONFIRME' ? '1px solid rgba(0,255,120,0.3)' : '1px solid rgba(253,212,0,0.3)',
              fontFamily: 'Manrope, sans-serif',
            }}
          >
            <span className="material-symbols-outlined align-middle" style={{ fontSize: '0.85rem', marginRight: '4px' }}>
              {show.status === 'CONFIRME' ? 'check_circle' : 'schedule'}
            </span>
            {show.status === 'CONFIRME' ? 'Confirmé' : 'À confirmer'}
          </span>

          {/* Titre */}
          <h1
            className="text-4xl md:text-5xl font-extrabold text-white mb-3 leading-tight"
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', letterSpacing: '-0.02em' }}
          >
            {show.title}
          </h1>

          {/* Description courte si disponible */}
          {show.description && (
            <p
              className="text-base max-w-2xl leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'Manrope, sans-serif' }}
            >
              {show.description.length > 180 ? show.description.slice(0, 180) + '…' : show.description}
            </p>
          )}
        </div>
      </div>

      {/* ── CONTENU principal ── */}
      <div className="max-w-7xl mx-auto px-6 pb-20" style={{ marginTop: '-2rem' }}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* ── Représentations (3/5) ── */}
          <div className="lg:col-span-3">
            <h2
              className="text-xl font-bold mb-5"
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}
            >
              Représentations
            </h2>

            {representations.length === 0 ? (
              <div
                className="rounded-2xl p-8 text-center"
                style={{ background: '#ffffff', boxShadow: '0 4px 24px rgba(0,6,102,0.06)' }}
              >
                <span className="material-symbols-outlined text-4xl block mb-3" style={{ color: '#c6c5d4' }}>event_busy</span>
                <p className="text-sm" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
                  Aucune représentation disponible pour le moment.
                </p>
              </div>
            ) : (
              <ul className="space-y-3">
                {representations.map((r) => (
                  <li
                    key={r.id}
                    className="rounded-2xl p-5 flex items-center justify-between gap-4"
                    style={{ background: '#ffffff', boxShadow: '0 4px 24px rgba(0,6,102,0.06)' }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: 'linear-gradient(135deg, #000666, #1a237e)' }}
                      >
                        <span className="material-symbols-outlined text-white" style={{ fontSize: '1.1rem' }}>calendar_month</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>
                          {new Date(r.schedule ?? r.date_start).toLocaleDateString('fr-BE', {
                            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                          })}
                        </p>
                        {r.location && (
                          <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '0.85rem' }}>location_on</span>
                            {r.location?.name ?? r.location}
                          </p>
                        )}
                      </div>
                    </div>
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full shrink-0"
                      style={{ background: '#f2f4f7', color: '#454652', fontFamily: 'Manrope, sans-serif' }}
                    >
                      {new Date(r.schedule ?? r.date_start).toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* ── Formulaire réservation (2/5) ── */}
          <div className="lg:col-span-2">
            <div
              className="rounded-2xl p-6 sticky top-24"
              style={{ background: '#ffffff', boxShadow: '0 8px 32px rgba(0,6,102,0.1)' }}
            >
              <h2
                className="text-lg font-bold mb-5"
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}
              >
                Réserver une place
              </h2>

              {!user ? (
                <div className="text-center py-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: '#f2f4f7' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '1.5rem', color: '#000666' }}>lock</span>
                  </div>
                  <p className="text-sm mb-4" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
                    Connectez-vous pour réserver vos places.
                  </p>
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-opacity"
                    style={{ background: 'linear-gradient(135deg, #000666, #1a237e)', fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                  >
                    Se connecter →
                  </button>
                </div>
              ) : (
                <form onSubmit={handleReserve} className="space-y-4">
                  {success && (
                    <div className="rounded-xl px-4 py-3 text-sm flex items-start gap-2"
                      style={{ background: '#d4f5e2', color: '#1a5c35', fontFamily: 'Manrope, sans-serif' }}>
                      <span className="material-symbols-outlined shrink-0" style={{ fontSize: '1rem', marginTop: '1px' }}>check_circle</span>
                      {success}
                    </div>
                  )}
                  {formError && (
                    <div className="rounded-xl px-4 py-3 text-sm"
                      style={{ background: '#ffdad6', color: '#93000a', fontFamily: 'Manrope, sans-serif' }}>
                      {formError}
                    </div>
                  )}

                  {/* Représentation */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2"
                      style={{ fontFamily: 'Manrope, sans-serif', color: '#454652' }}>
                      Représentation
                    </label>
                    <select
                      value={selectedRepr}
                      onChange={(e) => setSelectedRepr(e.target.value)}
                      required
                      className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                      style={{
                        background: '#f2f4f7',
                        border: 'none',
                        fontFamily: 'Manrope, sans-serif',
                        color: '#191c1e',
                      }}
                    >
                      <option value="">Choisir une date</option>
                      {representations.map((r) => (
                        <option key={r.id} value={r.id}>
                          {new Date(r.schedule ?? r.date_start).toLocaleDateString('fr-BE', {
                            day: 'numeric', month: 'long', year: 'numeric',
                          })}
                          {r.location ? ` — ${r.location?.name ?? r.location}` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Tarif */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2"
                      style={{ fontFamily: 'Manrope, sans-serif', color: '#454652' }}>
                      Tarif
                    </label>
                    <select
                      value={selectedPrice}
                      onChange={(e) => setSelectedPrice(e.target.value)}
                      required
                      className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                      style={{
                        background: '#f2f4f7',
                        border: 'none',
                        fontFamily: 'Manrope, sans-serif',
                        color: '#191c1e',
                      }}
                    >
                      <option value="">Choisir un tarif</option>
                      {prices.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label} — {p.price} €
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quantité */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2"
                      style={{ fontFamily: 'Manrope, sans-serif', color: '#454652' }}>
                      Nombre de places
                    </label>
                    <div className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ background: '#f2f4f7' }}>
                      <button type="button"
                        onClick={() => setQuantity(q => Math.max(1, parseInt(q) - 1))}
                        className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm hover:opacity-70 transition-opacity"
                        style={{ background: '#ffffff', color: '#000666' }}
                      >
                        −
                      </button>
                      <span className="flex-1 text-center text-sm font-bold"
                        style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>
                        {quantity}
                      </span>
                      <button type="button"
                        onClick={() => setQuantity(q => Math.min(10, parseInt(q) + 1))}
                        className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm hover:opacity-70 transition-opacity"
                        style={{ background: '#ffffff', color: '#000666' }}
                      >
                        +
                      </button>
                    </div>
                    <p className="text-xs mt-1" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
                      Maximum 10 places par commande
                    </p>
                  </div>

                  {/* Total estimé */}
                  {selectedPrice && (
                    <div className="rounded-xl px-4 py-3 flex items-center justify-between"
                      style={{ background: 'linear-gradient(135deg, rgba(0,6,102,0.05), rgba(26,35,126,0.08))' }}>
                      <span className="text-xs font-semibold" style={{ color: '#454652', fontFamily: 'Manrope, sans-serif' }}>Total estimé</span>
                      <span className="text-base font-black" style={{ color: '#000666', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                        {(prices.find(p => p.id === parseInt(selectedPrice))?.price * quantity).toFixed(2)} €
                      </span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 rounded-xl text-white font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg, #000666, #1a237e)', fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Réservation...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>confirmation_number</span>
                        Confirmer la réservation
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <div className="w-10 h-10 rounded-full border-4 animate-spin"
        style={{ borderColor: '#e0e3e6', borderTopColor: '#000666' }} />
      <p className="text-sm" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
        Chargement du spectacle...
      </p>
    </div>
  )
}
