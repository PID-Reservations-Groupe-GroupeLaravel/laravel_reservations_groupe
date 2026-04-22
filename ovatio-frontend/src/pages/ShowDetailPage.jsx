import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../contexts/AuthContext'

/* ─── Étoiles ─────────────────────────────────────────────────────── */
function Stars({ score, size = '1rem' }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{
          fontSize: size,
          color: i <= score ? '#fdd400' : '#e0e3e6',
          lineHeight: 1,
        }}>★</span>
      ))}
    </div>
  )
}

export default function ShowDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [show, setShow]                       = useState(null)
  const [representations, setRepresentations] = useState([])
  const [prices, setPrices]                   = useState([])
  const [reviews, setReviews]                 = useState([])
  const [loading, setLoading]                 = useState(true)
  const [error, setError]                     = useState('')
  const [showAllReviews, setShowAllReviews]   = useState(false)

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
      api.get(`/shows/${id}/reviews`).catch(() => ({ data: [] })),
    ])
      .then(([showRes, reprRes, priceRes, reviewsRes]) => {
        const s = showRes.data.data ?? showRes.data
        const r = reprRes.data.data ?? reprRes.data
        const p = priceRes.data.data ?? priceRes.data
        const v = reviewsRes.data ?? []
        setShow(s)
        setRepresentations(r)
        setPrices(p)
        setReviews(v)
        if (r.length > 0) setSelectedRepr(r[0])
        if (p.length > 0) setSelectedPrice(p[0])
      })
      .catch(() => setError('Impossible de charger ce spectacle.'))
      .finally(() => setLoading(false))
  }, [id])

  const handleReserve = async (e) => {
    e.preventDefault()
    if (!user) { navigate('/login'); return }
    if (!selectedRepr || !selectedPrice) return
    setFormError(''); setSuccess(''); setSubmitting(true)
    try {
      await api.post('/reservations', {
        representation_id: selectedRepr.id,
        price_id: selectedPrice.id,
        quantity,
      })
      setSuccess('Réservation créée ! Retrouvez-la dans Mes réservations.')
    } catch (err) {
      const errors = err.response?.data?.errors
      setFormError(errors ? Object.values(errors).flat().join(' ') : (err.response?.data?.message ?? 'Erreur lors de la réservation.'))
    } finally {
      setSubmitting(false) }
  }

  if (loading) return <Spinner />
  if (error)   return <ErrorScreen msg={error} />
  if (!show)   return <ErrorScreen msg="Spectacle introuvable." />

  const posterUrl      = show.poster_url ? `/images/${show.poster_url}` : null
  const total          = selectedPrice ? (selectedPrice.price * quantity).toFixed(2) : null
  const minPrice       = prices.length > 0 ? Math.min(...prices.map(p => p.price)) : null
  const avgScore       = reviews.length > 0 ? (reviews.reduce((a, r) => a + r.score, 0) / reviews.length).toFixed(1) : null
  const visibleReviews = showAllReviews ? reviews : reviews.slice(0, 2)

  return (
    <div style={{ background: '#f5f6fa', minHeight: '100vh' }}>

      {/* ══ HERO ══ */}
      <div className="relative overflow-hidden" style={{ height: '520px' }}>
        {posterUrl
          ? <img src={posterUrl} alt={show.title}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: 'brightness(0.28) saturate(1.4)' }} />
          : <div className="absolute inset-0"
              style={{ background: 'linear-gradient(135deg, #000666 0%, #0d1a6e 100%)' }} />
        }
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0) 25%, rgba(0,6,60,0.95) 100%)'
        }} />

        <Link to="/shows"
          className="absolute top-6 left-6 flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full"
          style={{
            background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.15)', color: '#fff',
            fontFamily: 'Manrope, sans-serif',
          }}>
          ← Catalogue
        </Link>

        <div className="absolute bottom-0 left-0 right-0 px-8 pb-10 max-w-7xl mx-auto w-full"
          style={{ left: '50%', transform: 'translateX(-50%)' }}>
          <p className="text-xs font-black uppercase tracking-[0.25em] mb-3"
            style={{ color: '#fdd400', fontFamily: 'Manrope, sans-serif' }}>
            {show.status === 'CONFIRME' ? '✓ Spectacle confirmé' : '⏳ À confirmer'}
          </p>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-5 leading-none"
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', letterSpacing: '-0.03em' }}>
            {show.title}
          </h1>
          <div className="flex flex-wrap items-center gap-6">
            {representations.length > 0 && (
              <span className="flex items-center gap-2 text-sm"
                style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'Manrope, sans-serif' }}>
                📅&nbsp;
                {new Date(representations[0].schedule).toLocaleDateString('fr-BE', { day: 'numeric', month: 'long', year: 'numeric' })}
                {representations.length > 1 && <> — {new Date(representations[representations.length - 1].schedule).toLocaleDateString('fr-BE', { day: 'numeric', month: 'long', year: 'numeric' })}</>}
              </span>
            )}
            {representations[0]?.location && (
              <span className="flex items-center gap-2 text-sm"
                style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'Manrope, sans-serif' }}>
                📍 {representations[0].location.name}
              </span>
            )}
            {minPrice && (
              <span className="flex items-center gap-2 text-sm font-semibold"
                style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'Manrope, sans-serif' }}>
                🎟 À partir de {minPrice} €
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ══ CORPS ══ */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ══ GAUCHE — 2/3 ══ */}
          <div className="lg:col-span-2 space-y-12">

            {/* À propos */}
            {show.description && (
              <section>
                <h2 className="text-2xl font-bold mb-4"
                  style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#0a0d2e' }}>
                  À propos du spectacle
                </h2>
                <p className="text-base leading-loose"
                  style={{ color: '#555', fontFamily: 'Manrope, sans-serif', lineHeight: 1.9 }}>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {show.artists.map((artist, i) => (
                    <div key={i} className="flex items-center gap-4 rounded-2xl p-4"
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
                            style={{ color: '#888', fontFamily: 'Manrope, sans-serif' }}>{artist.type}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Avis curateur Ovatio */}
            <section>
              <div className="rounded-2xl p-7 relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #000666 0%, #1a237e 100%)' }}>
                {/* Guillemets décoratifs */}
                <span className="absolute top-4 right-6 text-8xl font-black leading-none select-none"
                  style={{ color: 'rgba(255,255,255,0.06)', fontFamily: 'Georgia, serif' }}>"</span>

                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
                    style={{ background: '#fdd400', color: '#6f5c00' }}>O</div>
                  <div>
                    <p className="text-sm font-bold text-white"
                      style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                      L'avis de la rédaction Ovatio
                    </p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Manrope, sans-serif' }}>
                      Curateurs Arts Vivants
                    </p>
                  </div>
                  <div className="ml-auto">
                    <Stars score={5} size="0.9rem" />
                  </div>
                </div>

                <p className="text-base italic leading-relaxed"
                  style={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'Manrope, sans-serif', lineHeight: 1.8 }}>
                  {show.slug === 'ayiti' || show.id === 1
                    ? '"Un voyage humain d\'une rare intensité. La performance captive de la première à la dernière seconde. Un must-see absolu de la saison bruxelloise."'
                    : show.slug === 'cible-mouvante' || show.id === 2
                    ? '"Un thriller social qui dérange et questionne. La mise en scène est d\'une précision chirurgicale, le texte d\'une actualité troublante. À voir absolument."'
                    : show.id === 3
                    ? '"Claude Semal au sommet de son art. Entre poésie et dérision, il nous offre un portrait de la Belgique tendre et universel. Un moment rare."'
                    : '"Un seul-en-scène d\'une virtuosité étourdissante. Drôle, émouvant, inattendu — ce spectacle vous restera longtemps en mémoire."'
                  }
                </p>
              </div>
            </section>

            {/* Avis spectateurs */}
            {reviews.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold"
                      style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#0a0d2e' }}>
                      Avis des spectateurs
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <Stars score={Math.round(avgScore)} size="1rem" />
                      <span className="text-sm font-semibold" style={{ color: '#0a0d2e', fontFamily: 'Manrope, sans-serif' }}>
                        {avgScore}/5
                      </span>
                      <span className="text-sm" style={{ color: '#888', fontFamily: 'Manrope, sans-serif' }}>
                        · {reviews.length} avis
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {visibleReviews.map((review) => (
                    <div key={review.id} className="rounded-2xl p-6"
                      style={{ background: '#fff', boxShadow: '0 2px 12px rgba(0,6,102,0.06)' }}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                            style={{ background: 'linear-gradient(135deg, #000666, #1a237e)' }}>
                            {(review.user_name ?? 'A')[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold"
                              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#0a0d2e' }}>
                              {review.user_name ?? 'Spectateur anonyme'}
                            </p>
                            <Stars score={review.score} size="0.85rem" />
                          </div>
                        </div>
                        <span className="text-xs" style={{ color: '#aaa', fontFamily: 'Manrope, sans-serif' }}>
                          {review.created_at}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed"
                        style={{ color: '#555', fontFamily: 'Manrope, sans-serif', lineHeight: 1.7 }}>
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>

                {reviews.length > 2 && (
                  <button
                    onClick={() => setShowAllReviews(v => !v)}
                    className="mt-5 flex items-center gap-2 text-sm font-bold hover:opacity-70 transition-opacity"
                    style={{ color: '#000666', fontFamily: 'Manrope, sans-serif', background: 'none', border: 'none', cursor: 'pointer' }}>
                    {showAllReviews
                      ? 'Voir moins d\'avis ↑'
                      : `Voir les ${reviews.length - 2} autres avis →`}
                  </button>
                )}
              </section>
            )}

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
          <div className="lg:col-span-1 space-y-5">

            {/* Bloc réservation */}
            <div className="rounded-3xl p-6 sticky top-24"
              style={{ background: '#fff', boxShadow: '0 8px 48px rgba(0,6,102,0.11)' }}>

              <h2 className="text-xl font-bold mb-6"
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#0a0d2e' }}>
                Réserver vos places
              </h2>

              {!user ? (
                <div className="text-center py-4">
                  <p className="text-sm mb-5" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
                    Connectez-vous pour réserver.
                  </p>
                  <button onClick={() => navigate('/login')}
                    className="w-full py-4 rounded-2xl font-bold text-sm text-white hover:opacity-90 transition-opacity"
                    style={{ background: 'linear-gradient(135deg, #000666, #1a237e)', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                    Se connecter →
                  </button>
                </div>
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

                  {/* Dates */}
                  {representations.length > 0 && (
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest mb-3"
                        style={{ color: '#888', fontFamily: 'Manrope, sans-serif' }}>Choisir une date</p>
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {representations.map((r) => {
                          const d = new Date(r.schedule ?? r.date_start)
                          const isSel = selectedRepr?.id === r.id
                          return (
                            <button key={r.id} type="button" onClick={() => setSelectedRepr(r)}
                              className="w-full rounded-xl px-4 py-3 text-left transition-all flex items-center justify-between"
                              style={{
                                background: isSel ? '#000666' : '#f5f6fa',
                                border: isSel ? 'none' : '1px solid #eceef1',
                                cursor: 'pointer',
                              }}>
                              <div>
                                <p className="text-sm font-bold"
                                  style={{ color: isSel ? '#fff' : '#0a0d2e', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                                  {d.toLocaleDateString('fr-BE', { weekday: 'short', day: 'numeric', month: 'short' })}
                                </p>
                                <p className="text-xs mt-0.5"
                                  style={{ color: isSel ? 'rgba(255,255,255,0.5)' : '#888', fontFamily: 'Manrope, sans-serif' }}>
                                  {d.toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' })}
                                  {r.location ? ` · ${r.location?.name ?? r.location}` : ''}
                                </p>
                              </div>
                              {isSel && <span style={{ color: '#fdd400', fontSize: '1rem' }}>✓</span>}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Tarifs */}
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest mb-3"
                      style={{ color: '#888', fontFamily: 'Manrope, sans-serif' }}>Type de billet</p>
                    <div className="space-y-2">
                      {prices.map((p, i) => {
                        const isSel = selectedPrice?.id === p.id
                        const isPopular = i === prices.length - 1 && prices.length > 1
                        return (
                          <button key={p.id} type="button" onClick={() => setSelectedPrice(p)}
                            className="w-full rounded-xl px-4 py-3 text-left transition-all relative"
                            style={{
                              background: isSel ? '#fff8e1' : '#f5f6fa',
                              border: isSel ? '2px solid #fdd400' : '1px solid #eceef1',
                              cursor: 'pointer',
                            }}>
                            {isPopular && (
                              <span className="absolute top-2 right-2 text-xs font-black px-2 py-0.5 rounded-full"
                                style={{ background: '#fdd400', color: '#6f5c00', fontFamily: 'Manrope, sans-serif' }}>
                                POPULAIRE
                              </span>
                            )}
                            <div className="flex items-center justify-between" style={{ paddingRight: isPopular ? '5rem' : 0 }}>
                              <p className="text-sm font-bold"
                                style={{ color: '#0a0d2e', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                                {p.label}
                              </p>
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
                      style={{ color: '#888', fontFamily: 'Manrope, sans-serif' }}>Nombre de places</p>
                    <div className="flex items-center rounded-xl"
                      style={{ background: '#f5f6fa', border: '1px solid #eceef1' }}>
                      <button type="button" onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="px-5 py-3 text-xl font-bold hover:bg-gray-200 transition-colors rounded-l-xl"
                        style={{ color: '#000666', background: 'transparent', border: 'none', cursor: 'pointer' }}>−</button>
                      <span className="flex-1 text-center text-sm font-bold"
                        style={{ color: '#0a0d2e', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                        {quantity} place{quantity > 1 ? 's' : ''}
                      </span>
                      <button type="button" onClick={() => setQuantity(q => Math.min(10, q + 1))}
                        className="px-5 py-3 text-xl font-bold hover:bg-gray-200 transition-colors rounded-r-xl"
                        style={{ color: '#000666', background: 'transparent', border: 'none', cursor: 'pointer' }}>+</button>
                    </div>
                  </div>

                  {/* Total */}
                  {total && (
                    <div className="flex items-center justify-between pt-3"
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
                      ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> En cours...</>
                      : 'Confirmer la réservation ⚡'}
                  </button>

                  <p className="text-center text-xs" style={{ color: '#aaa', fontFamily: 'Manrope, sans-serif' }}>
                    🔒 Paiement sécurisé via Ovatio Member
                  </p>
                </form>
              )}
            </div>

            {/* Coulisses & Galerie */}
            {posterUrl && (
              <div className="rounded-3xl overflow-hidden relative"
                style={{ boxShadow: '0 8px 32px rgba(0,6,102,0.12)' }}>
                <img src={posterUrl} alt={show.title}
                  className="w-full object-cover"
                  style={{ height: '160px', filter: 'brightness(0.45) saturate(1.2)' }} />
                <div className="absolute inset-0 flex flex-col justify-end p-5"
                  style={{ background: 'linear-gradient(to top, rgba(0,6,60,0.9) 40%, transparent)' }}>
                  <p className="text-base font-bold text-white"
                    style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                    Coulisses &amp; Galerie
                  </p>
                  <p className="text-xs mt-1"
                    style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'Manrope, sans-serif' }}>
                    Découvrez l'univers visuel du spectacle avant votre venue.
                  </p>
                  {/* Thumbnails */}
                  <div className="flex gap-2 mt-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-12 h-12 rounded-lg overflow-hidden"
                        style={{ border: '2px solid rgba(255,255,255,0.2)' }}>
                        <img src={posterUrl} alt="" className="w-full h-full object-cover"
                          style={{ filter: `brightness(${0.5 + i * 0.15})` }} />
                      </div>
                    ))}
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center text-xs font-bold"
                      style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '2px solid rgba(255,255,255,0.2)', fontFamily: 'Manrope, sans-serif' }}>
                      +12
                    </div>
                  </div>
                </div>
              </div>
            )}

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
