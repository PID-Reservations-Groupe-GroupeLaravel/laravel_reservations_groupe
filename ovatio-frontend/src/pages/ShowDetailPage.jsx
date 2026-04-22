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
      setSuccess('Réservation créée ! Retrouvez-la dans Mes réservations.')
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
      <p className="text-sm" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>Spectacle introuvable.</p>
      <Link to="/shows" className="text-sm font-bold" style={{ color: '#000666' }}>← Retour aux spectacles</Link>
    </div>
  )

  const posterUrl = show.poster_url ? `/images/${show.poster_url}` : null
  const selectedPriceObj = prices.find(p => p.id === parseInt(selectedPrice))

  return (
    <div style={{ background: '#f7f9fc', minHeight: '100vh' }}>

      {/* ── HERO image plein écran ── */}
      <div className="relative overflow-hidden" style={{ height: '520px' }}>

        {posterUrl ? (
          <img
            src={posterUrl}
            alt={show.title}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'brightness(0.3) saturate(1.3)' }}
          />
        ) : (
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, #000666 0%, #1a237e 100%)' }} />
        )}

        {/* Dégradé bas → fond page */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,6,102,0.55) 55%, #f7f9fc 100%)'
        }} />

        {/* Lumières */}
        <div className="absolute pointer-events-none" style={{
          top: '-15%', left: '-10%', width: '45%', height: '70%',
          background: '#fdd400', borderRadius: '50%', filter: 'blur(160px)', opacity: 0.07
        }} />
        <div className="absolute pointer-events-none" style={{
          bottom: '5%', right: '-5%', width: '35%', height: '55%',
          background: '#8690ee', borderRadius: '50%', filter: 'blur(140px)', opacity: 0.09
        }} />

        {/* Bouton retour */}
        <Link to="/shows"
          className="absolute top-7 left-6 flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full"
          style={{
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(10px)',
            color: 'rgba(255,255,255,0.9)',
            fontFamily: 'Manrope, sans-serif',
            border: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          ← Catalogue
        </Link>

        {/* Infos hero (bas gauche) */}
        <div className="absolute bottom-10 left-6 right-6 max-w-7xl mx-auto">
          <span
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4"
            style={{
              background: show.status === 'CONFIRME' ? 'rgba(0,220,100,0.18)' : 'rgba(253,212,0,0.2)',
              color: show.status === 'CONFIRME' ? '#6effc0' : '#fdd400',
              border: show.status === 'CONFIRME' ? '1px solid rgba(0,220,100,0.25)' : '1px solid rgba(253,212,0,0.25)',
              fontFamily: 'Manrope, sans-serif',
            }}
          >
            {show.status === 'CONFIRME' ? '✓ Confirmé' : '⏳ À confirmer'}
          </span>

          <h1
            className="text-4xl md:text-5xl font-extrabold text-white leading-tight"
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', letterSpacing: '-0.02em' }}
          >
            {show.title}
          </h1>
        </div>
      </div>

      {/* ── CORPS PRINCIPAL ── */}
      <div className="max-w-7xl mx-auto px-6 pb-24" style={{ marginTop: '-1rem' }}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* ══ GAUCHE — Infos spectacle (3/5) ══ */}
          <div className="lg:col-span-3 space-y-8">

            {/* Synopsis */}
            {show.description && (
              <section>
                <h2 className="text-lg font-bold mb-3 flex items-center gap-2"
                  style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>
                  <span style={{ width: 3, height: 20, background: '#000666', borderRadius: 2, display: 'inline-block' }} />
                  Synopsis
                </h2>
                <p className="text-sm leading-relaxed"
                  style={{ color: '#454652', fontFamily: 'Manrope, sans-serif', lineHeight: 1.8 }}>
                  {show.description}
                </p>
              </section>
            )}

            {/* Artistes */}
            {show.artists && show.artists.length > 0 && (
              <section>
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2"
                  style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>
                  <span style={{ width: 3, height: 20, background: '#000666', borderRadius: 2, display: 'inline-block' }} />
                  Artistes
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {show.artists.map((artist, i) => (
                    <div key={i}
                      className="flex items-center gap-3 rounded-2xl p-4"
                      style={{ background: '#ffffff', boxShadow: '0 2px 12px rgba(0,6,102,0.06)' }}>
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                        style={{ background: 'linear-gradient(135deg, #000666, #1a237e)' }}
                      >
                        {(artist.firstname ?? artist.name ?? '?')[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>
                          {artist.firstname} {artist.lastname ?? ''}
                        </p>
                        {artist.type && (
                          <p className="text-xs mt-0.5 capitalize" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
                            {artist.type}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Représentations */}
            <section>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2"
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>
                <span style={{ width: 3, height: 20, background: '#000666', borderRadius: 2, display: 'inline-block' }} />
                Représentations
              </h2>

              {representations.length === 0 ? (
                <div className="rounded-2xl p-8 text-center"
                  style={{ background: '#ffffff', boxShadow: '0 2px 12px rgba(0,6,102,0.06)' }}>
                  <p className="text-sm" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
                    Aucune représentation disponible pour le moment.
                  </p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {representations.map((r) => {
                    const date = new Date(r.schedule ?? r.date_start)
                    return (
                      <li key={r.id}
                        className="flex items-center justify-between gap-4 rounded-2xl p-4"
                        style={{ background: '#ffffff', boxShadow: '0 2px 12px rgba(0,6,102,0.06)' }}>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white text-xs font-bold"
                            style={{ background: 'linear-gradient(135deg, #000666, #1a237e)' }}>
                            {date.getDate()}
                          </div>
                          <div>
                            <p className="text-sm font-semibold"
                              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>
                              {date.toLocaleDateString('fr-BE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                            {r.location && (
                              <p className="text-xs mt-0.5" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
                                📍 {r.location?.name ?? r.location}
                              </p>
                            )}
                          </div>
                        </div>
                        <span className="text-xs font-semibold px-3 py-1 rounded-full shrink-0"
                          style={{ background: '#f2f4f7', color: '#454652', fontFamily: 'Manrope, sans-serif' }}>
                          {date.toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              )}
            </section>

            {/* Producteur */}
            {show.producer && (
              <section>
                <h2 className="text-lg font-bold mb-3 flex items-center gap-2"
                  style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>
                  <span style={{ width: 3, height: 20, background: '#000666', borderRadius: 2, display: 'inline-block' }} />
                  Producteur
                </h2>
                <div className="flex items-center gap-3 rounded-2xl p-4 w-fit"
                  style={{ background: '#ffffff', boxShadow: '0 2px 12px rgba(0,6,102,0.06)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shrink-0"
                    style={{ background: 'linear-gradient(135deg, #fdd400, #f9a825)', color: '#6f5c00' }}>
                    {(show.producer.name ?? show.producer.firstname ?? 'P')[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>
                      {show.producer.name ?? `${show.producer.firstname} ${show.producer.lastname}`}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>Producteur</p>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* ══ DROITE — Réservation (2/5) ══ */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl p-6 sticky top-24"
              style={{ background: '#ffffff', boxShadow: '0 8px 40px rgba(0,6,102,0.10)' }}>

              {/* Prix indicatif */}
              {prices.length > 0 && (
                <div className="flex items-baseline gap-1 mb-5">
                  <span className="text-2xl font-black" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#000666' }}>
                    À partir de {Math.min(...prices.map(p => p.price))} €
                  </span>
                  <span className="text-xs" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>/place</span>
                </div>
              )}

              <h2 className="text-base font-bold mb-5 pb-4"
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e', borderBottom: '1px solid #eceef1' }}>
                Réserver une place
              </h2>

              {!user ? (
                <div className="text-center py-6">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: '#f2f4f7' }}>
                    <span style={{ fontSize: '1.5rem' }}>🔒</span>
                  </div>
                  <p className="text-sm mb-5" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
                    Connectez-vous pour réserver vos places.
                  </p>
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full py-3 rounded-xl text-white font-bold text-sm hover:opacity-90 transition-opacity"
                    style={{ background: 'linear-gradient(135deg, #000666, #1a237e)', fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                  >
                    Se connecter →
                  </button>
                </div>
              ) : (
                <form onSubmit={handleReserve} className="space-y-4">
                  {success && (
                    <div className="rounded-xl px-4 py-3 text-sm"
                      style={{ background: '#d4f5e2', color: '#1a5c35', fontFamily: 'Manrope, sans-serif' }}>
                      ✓ {success}
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
                      Date
                    </label>
                    <select value={selectedRepr} onChange={(e) => setSelectedRepr(e.target.value)} required
                      className="w-full rounded-xl px-4 py-3 text-sm outline-none cursor-pointer"
                      style={{ background: '#f2f4f7', border: 'none', fontFamily: 'Manrope, sans-serif', color: '#191c1e' }}>
                      <option value="">Choisir une date</option>
                      {representations.map((r) => {
                        const d = new Date(r.schedule ?? r.date_start)
                        return (
                          <option key={r.id} value={r.id}>
                            {d.toLocaleDateString('fr-BE', { day: 'numeric', month: 'long', year: 'numeric' })}
                            {r.location ? ` — ${r.location?.name ?? r.location}` : ''}
                          </option>
                        )
                      })}
                    </select>
                  </div>

                  {/* Tarif */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2"
                      style={{ fontFamily: 'Manrope, sans-serif', color: '#454652' }}>
                      Tarif
                    </label>
                    <select value={selectedPrice} onChange={(e) => setSelectedPrice(e.target.value)} required
                      className="w-full rounded-xl px-4 py-3 text-sm outline-none cursor-pointer"
                      style={{ background: '#f2f4f7', border: 'none', fontFamily: 'Manrope, sans-serif', color: '#191c1e' }}>
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
                      Places
                    </label>
                    <div className="flex items-center rounded-xl overflow-hidden"
                      style={{ background: '#f2f4f7' }}>
                      <button type="button"
                        onClick={() => setQuantity(q => Math.max(1, parseInt(q) - 1))}
                        className="px-4 py-3 text-lg font-bold hover:bg-gray-200 transition-colors"
                        style={{ color: '#000666', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                        −
                      </button>
                      <span className="flex-1 text-center text-sm font-bold"
                        style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>
                        {quantity} place{quantity > 1 ? 's' : ''}
                      </span>
                      <button type="button"
                        onClick={() => setQuantity(q => Math.min(10, parseInt(q) + 1))}
                        className="px-4 py-3 text-lg font-bold hover:bg-gray-200 transition-colors"
                        style={{ color: '#000666', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                        +
                      </button>
                    </div>
                  </div>

                  {/* Total */}
                  {selectedPriceObj && (
                    <div className="rounded-xl px-5 py-4 flex items-center justify-between"
                      style={{ background: 'linear-gradient(135deg, rgba(0,6,102,0.04), rgba(26,35,126,0.07))' }}>
                      <div>
                        <p className="text-xs" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>Total</p>
                        <p className="text-xs mt-0.5" style={{ color: '#454652', fontFamily: 'Manrope, sans-serif' }}>
                          {quantity} × {selectedPriceObj.price} €
                        </p>
                      </div>
                      <span className="text-xl font-black" style={{ color: '#000666', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                        {(selectedPriceObj.price * quantity).toFixed(2)} €
                      </span>
                    </div>
                  )}

                  <button type="submit" disabled={submitting}
                    className="w-full py-4 rounded-xl text-white font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg, #000666, #1a237e)', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                    {submitting ? (
                      <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Réservation...</>
                    ) : (
                      '🎟 Confirmer la réservation'
                    )}
                  </button>

                  <p className="text-center text-xs" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
                    Paiement sécurisé · Annulation possible avant paiement
                  </p>
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
