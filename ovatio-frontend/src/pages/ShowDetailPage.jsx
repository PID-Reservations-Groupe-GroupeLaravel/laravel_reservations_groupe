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

  const [selectedRepr, setSelectedRepr]   = useState(null)
  const [selectedPrice, setSelectedPrice] = useState(null)
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
        const showData = showRes.data.data ?? showRes.data
        const reprs    = reprRes.data.data ?? reprRes.data
        const prcs     = priceRes.data.data ?? priceRes.data
        setShow(showData)
        setRepresentations(reprs)
        setPrices(prcs)
        if (reprs.length > 0) setSelectedRepr(reprs[0])
        if (prcs.length > 0)  setSelectedPrice(prcs[0])
      })
      .catch(() => setError('Impossible de charger ce spectacle.'))
      .finally(() => setLoading(false))
  }, [id])

  const handleReserve = async (e) => {
    e.preventDefault()
    if (!user) { navigate('/login'); return }
    if (!selectedRepr || !selectedPrice) return
    setFormError('')
    setSuccess('')
    setSubmitting(true)
    try {
      await api.post('/reservations', {
        representation_id: selectedRepr.id,
        price_id: selectedPrice.id,
        quantity,
      })
      setSuccess('Réservation créée ! Retrouvez-la dans Mes réservations.')
    } catch (err) {
      const errors = err.response?.data?.errors
      setFormError(errors
        ? Object.values(errors).flat().join(' ')
        : (err.response?.data?.message ?? 'Erreur lors de la réservation.'))
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Spinner />
  if (error)   return <ErrorScreen msg={error} />
  if (!show)   return <ErrorScreen msg="Spectacle introuvable." />

  const posterUrl      = show.poster_url ? `/images/${show.poster_url}` : null
  const total          = selectedPrice ? (selectedPrice.price * quantity).toFixed(2) : null
  const minPrice       = prices.length > 0 ? Math.min(...prices.map(p => p.price)) : null

  return (
    <div style={{ background: '#f5f6fa', minHeight: '100vh' }}>

      {/* ── HERO ── */}
      <div className="relative overflow-hidden" style={{ height: '500px' }}>
        {posterUrl
          ? <img src={posterUrl} alt={show.title}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: 'brightness(0.28) saturate(1.4)' }} />
          : <div className="absolute inset-0"
              style={{ background: 'linear-gradient(135deg, #000666 0%, #0d1a6e 100%)' }} />
        }

        {/* overlay dégradé bas */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0) 30%, rgba(0,6,60,0.92) 100%)'
        }} />

        {/* Bouton retour */}
        <Link to="/shows"
          className="absolute top-6 left-6 flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full"
          style={{
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#fff',
            fontFamily: 'Manrope, sans-serif',
          }}>
          ← Catalogue
        </Link>

        {/* Infos hero */}
        <div className="absolute bottom-0 left-0 right-0 px-8 pb-10 max-w-7xl mx-auto">
          {/* Genre / catégorie */}
          <p className="text-xs font-black uppercase tracking-[0.25em] mb-3"
            style={{ color: '#fdd400', fontFamily: 'Manrope, sans-serif' }}>
            {show.status === 'CONFIRME' ? 'Spectacle · Confirmé' : 'Spectacle · À confirmer'}
          </p>

          {/* Titre */}
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-5 leading-none"
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', letterSpacing: '-0.03em' }}>
            {show.title}
          </h1>

          {/* Date + lieu de la première représentation */}
          {representations.length > 0 && (
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2 text-sm"
                style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'Manrope, sans-serif' }}>
                <span style={{ fontSize: '1rem' }}>📅</span>
                {new Date(representations[0].schedule).toLocaleDateString('fr-BE', { day: 'numeric', month: 'long', year: 'numeric' })}
                {representations.length > 1 && (
                  <> — {new Date(representations[representations.length - 1].schedule).toLocaleDateString('fr-BE', { day: 'numeric', month: 'long', year: 'numeric' })}</>
                )}
              </div>
              {representations[0].location && (
                <div className="flex items-center gap-2 text-sm"
                  style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'Manrope, sans-serif' }}>
                  <span style={{ fontSize: '1rem' }}>📍</span>
                  {representations[0].location.name}
                </div>
              )}
              {minPrice && (
                <div className="flex items-center gap-2 text-sm font-semibold"
                  style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'Manrope, sans-serif' }}>
                  <span style={{ fontSize: '1rem' }}>🎟</span>
                  À partir de {minPrice} €
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── CORPS ── */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ══ GAUCHE — 2/3 ══ */}
          <div className="lg:col-span-2 space-y-10">

            {/* À propos */}
            {show.description && (
              <section>
                <h2 className="text-2xl font-bold mb-4"
                  style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#0a0d2e' }}>
                  À propos du spectacle
                </h2>
                <p className="text-base leading-loose"
                  style={{ color: '#444', fontFamily: 'Manrope, sans-serif' }}>
                  {show.description}
                </p>
              </section>
            )}

            {/* Artistes */}
            {show.artists && show.artists.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-5"
                  style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#0a0d2e' }}>
                  Distribution
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {show.artists.map((artist, i) => (
                    <div key={i}
                      className="flex items-center gap-4 rounded-2xl p-4"
                      style={{ background: '#fff', boxShadow: '0 2px 16px rgba(0,6,102,0.07)' }}>
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 text-white"
                        style={{ background: 'linear-gradient(135deg, #000666, #1a237e)' }}>
                        {(artist.firstname ?? artist.name ?? '?')[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold"
                          style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#0a0d2e' }}>
                          {artist.firstname} {artist.lastname ?? ''}
                        </p>
                        {artist.type && (
                          <p className="text-xs mt-0.5 capitalize"
                            style={{ color: '#888', fontFamily: 'Manrope, sans-serif' }}>
                            {artist.type}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Représentations liste */}
            <section>
              <h2 className="text-2xl font-bold mb-5"
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#0a0d2e' }}>
                Toutes les dates
              </h2>
              {representations.length === 0 ? (
                <div className="rounded-2xl p-8 text-center"
                  style={{ background: '#fff', color: '#888', fontFamily: 'Manrope, sans-serif' }}>
                  Aucune représentation disponible pour le moment.
                </div>
              ) : (
                <div className="space-y-3">
                  {representations.map((r) => {
                    const d = new Date(r.schedule ?? r.date_start)
                    const isSelected = selectedRepr?.id === r.id
                    return (
                      <button key={r.id} type="button"
                        onClick={() => setSelectedRepr(r)}
                        className="w-full flex items-center justify-between gap-4 rounded-2xl p-4 text-left transition-all"
                        style={{
                          background: isSelected ? '#000666' : '#fff',
                          boxShadow: isSelected
                            ? '0 4px 20px rgba(0,6,102,0.25)'
                            : '0 2px 12px rgba(0,6,102,0.06)',
                          border: isSelected ? 'none' : '1px solid #eceef1',
                          cursor: 'pointer',
                        }}>
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-xl flex flex-col items-center justify-center shrink-0"
                            style={{
                              background: isSelected ? 'rgba(255,255,255,0.15)' : '#f2f4f7',
                            }}>
                            <span className="text-xs font-black leading-none"
                              style={{ color: isSelected ? '#fdd400' : '#000666', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                              {d.getDate()}
                            </span>
                            <span className="text-xs leading-none uppercase"
                              style={{ color: isSelected ? 'rgba(255,255,255,0.6)' : '#888', fontFamily: 'Manrope, sans-serif' }}>
                              {d.toLocaleDateString('fr-BE', { month: 'short' })}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold"
                              style={{
                                fontFamily: '"Plus Jakarta Sans", sans-serif',
                                color: isSelected ? '#fff' : '#0a0d2e',
                              }}>
                              {d.toLocaleDateString('fr-BE', { weekday: 'long', day: 'numeric', month: 'long' })}
                            </p>
                            {r.location && (
                              <p className="text-xs mt-0.5"
                                style={{ color: isSelected ? 'rgba(255,255,255,0.55)' : '#888', fontFamily: 'Manrope, sans-serif' }}>
                                📍 {r.location?.name ?? r.location}
                              </p>
                            )}
                          </div>
                        </div>
                        <span className="text-sm font-bold shrink-0"
                          style={{ color: isSelected ? 'rgba(255,255,255,0.7)' : '#767683', fontFamily: 'Manrope, sans-serif' }}>
                          {d.toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}
            </section>

            {/* Producteur */}
            {show.producer && (
              <section>
                <h2 className="text-2xl font-bold mb-4"
                  style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#0a0d2e' }}>
                  Producteur
                </h2>
                <div className="flex items-center gap-4 rounded-2xl p-4 w-fit"
                  style={{ background: '#fff', boxShadow: '0 2px 12px rgba(0,6,102,0.07)' }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm shrink-0"
                    style={{ background: '#fdd400', color: '#6f5c00' }}>
                    {(show.producer.name ?? show.producer.firstname ?? 'P')[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold"
                      style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#0a0d2e' }}>
                      {show.producer.name ?? `${show.producer.firstname} ${show.producer.lastname}`}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: '#888', fontFamily: 'Manrope, sans-serif' }}>Producteur</p>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* ══ DROITE — sidebar sticky 1/3 ══ */}
          <div className="lg:col-span-1">
            <div className="rounded-3xl p-6 sticky top-24"
              style={{ background: '#fff', boxShadow: '0 8px 48px rgba(0,6,102,0.11)' }}>

              <h2 className="text-xl font-bold mb-6"
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#0a0d2e' }}>
                Réserver vos places
              </h2>

              {!user ? (
                <>
                  <p className="text-sm mb-5 text-center"
                    style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
                    Connectez-vous pour réserver.
                  </p>
                  <button onClick={() => navigate('/login')}
                    className="w-full py-4 rounded-2xl font-bold text-sm text-white hover:opacity-90 transition-opacity"
                    style={{ background: 'linear-gradient(135deg, #000666, #1a237e)', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                    Se connecter →
                  </button>
                </>
              ) : (
                <form onSubmit={handleReserve} className="space-y-5">
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

                  {/* Sélection date */}
                  {representations.length > 0 && (
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest mb-3"
                        style={{ color: '#888', fontFamily: 'Manrope, sans-serif' }}>
                        Choisir une date
                      </p>
                      <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                        {representations.map((r) => {
                          const d = new Date(r.schedule ?? r.date_start)
                          const isSelected = selectedRepr?.id === r.id
                          return (
                            <button key={r.id} type="button"
                              onClick={() => setSelectedRepr(r)}
                              className="w-full rounded-xl px-4 py-3 text-left transition-all"
                              style={{
                                background: isSelected ? '#000666' : '#f5f6fa',
                                border: isSelected ? 'none' : '1px solid #eceef1',
                                cursor: 'pointer',
                              }}>
                              <p className="text-sm font-bold"
                                style={{
                                  color: isSelected ? '#fff' : '#0a0d2e',
                                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                                }}>
                                {d.toLocaleDateString('fr-BE', { weekday: 'short', day: 'numeric', month: 'short' }).replace('.', '')}
                              </p>
                              <p className="text-xs mt-0.5"
                                style={{ color: isSelected ? 'rgba(255,255,255,0.55)' : '#888', fontFamily: 'Manrope, sans-serif' }}>
                                {d.toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' })}
                                {r.location ? ` · ${r.location?.name ?? r.location}` : ''}
                              </p>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Type de billet */}
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest mb-3"
                      style={{ color: '#888', fontFamily: 'Manrope, sans-serif' }}>
                      Type de billet
                    </p>
                    <div className="space-y-2">
                      {prices.map((p, i) => {
                        const isSelected = selectedPrice?.id === p.id
                        const isPopular  = i === prices.length - 1
                        return (
                          <button key={p.id} type="button"
                            onClick={() => setSelectedPrice(p)}
                            className="w-full rounded-xl px-4 py-3 text-left transition-all relative"
                            style={{
                              background: isSelected ? '#fff8e1' : '#f5f6fa',
                              border: isSelected ? '2px solid #fdd400' : '1px solid #eceef1',
                              cursor: 'pointer',
                            }}>
                            {isPopular && (
                              <span className="absolute top-2 right-2 text-xs font-black px-2 py-0.5 rounded-full"
                                style={{ background: '#fdd400', color: '#6f5c00', fontFamily: 'Manrope, sans-serif' }}>
                                POPULAIRE
                              </span>
                            )}
                            <div className="flex items-center justify-between pr-16">
                              <div>
                                <p className="text-sm font-bold"
                                  style={{ color: '#0a0d2e', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                                  {p.label}
                                </p>
                              </div>
                              <p className="text-sm font-black"
                                style={{ color: '#000666', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                                {p.price} €
                              </p>
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Quantité */}
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest mb-3"
                      style={{ color: '#888', fontFamily: 'Manrope, sans-serif' }}>
                      Nombre de places
                    </p>
                    <div className="flex items-center rounded-xl overflow-hidden"
                      style={{ background: '#f5f6fa', border: '1px solid #eceef1' }}>
                      <button type="button"
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="px-5 py-3 text-lg font-bold hover:bg-gray-200 transition-colors"
                        style={{ color: '#000666', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                        −
                      </button>
                      <span className="flex-1 text-center text-sm font-bold"
                        style={{ color: '#0a0d2e', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                        {quantity} place{quantity > 1 ? 's' : ''}
                      </span>
                      <button type="button"
                        onClick={() => setQuantity(q => Math.min(10, q + 1))}
                        className="px-5 py-3 text-lg font-bold hover:bg-gray-200 transition-colors"
                        style={{ color: '#000666', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                        +
                      </button>
                    </div>
                  </div>

                  {/* Total */}
                  {total && (
                    <div className="flex items-center justify-between pt-2 pb-1"
                      style={{ borderTop: '1px solid #eceef1' }}>
                      <p className="text-sm" style={{ color: '#888', fontFamily: 'Manrope, sans-serif' }}>
                        Total pour {quantity} billet{quantity > 1 ? 's' : ''}
                      </p>
                      <p className="text-2xl font-black"
                        style={{ color: '#0a0d2e', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                        {total} €
                      </p>
                    </div>
                  )}

                  <button type="submit" disabled={submitting || !selectedRepr || !selectedPrice}
                    className="w-full py-4 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #000666, #1a237e)', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                    {submitting
                      ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Réservation...</>
                      : 'Confirmer la réservation ⚡'}
                  </button>

                  <p className="text-center text-xs" style={{ color: '#aaa', fontFamily: 'Manrope, sans-serif' }}>
                    🔒 Paiement sécurisé via Ovatio Member
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

function ErrorScreen({ msg }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-4">
      <p className="text-sm" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>{msg}</p>
      <Link to="/shows" className="text-sm font-bold" style={{ color: '#000666' }}>← Retour aux spectacles</Link>
    </div>
  )
}
