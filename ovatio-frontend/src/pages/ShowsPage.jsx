import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

export default function ShowsPage() {
  const [shows, setShows]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    api.get('/shows')
      .then((res) => setShows(res.data.data ?? res.data))
      .catch(() => setError('Impossible de charger les spectacles.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />
  if (error)   return <ErrorMsg msg={error} />

  return (
    <div style={{ background: '#f7f9fc', minHeight: '100vh' }}>

      {/* ── HERO ── */}
      <div
        className="relative py-24 px-6 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #000666 0%, #1a237e 100%)' }}
      >
        <div className="absolute pointer-events-none"
          style={{ top: '-20%', left: '-15%', width: '50%', height: '50%',
            background: '#fdd400', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.15 }} />
        <div className="absolute pointer-events-none"
          style={{ bottom: '-20%', right: '-15%', width: '45%', height: '45%',
            background: '#8690ee', borderRadius: '50%', filter: 'blur(120px)', opacity: 0.12 }} />

        <div className="relative max-w-7xl mx-auto">
          <span
            className="inline-block text-xs font-black uppercase tracking-[0.25em] px-4 py-1.5 rounded-full mb-6"
            style={{ background: '#fdd400', color: '#6f5c00', fontFamily: 'Manrope, sans-serif' }}
          >
            La Scène Curatée
          </span>
          <h1
            className="text-5xl md:text-6xl font-extrabold text-white mb-4"
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', letterSpacing: '-0.02em', lineHeight: 1.1 }}
          >
            Catalogue
          </h1>
          <p className="text-lg max-w-xl"
            style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'Manrope, sans-serif' }}>
            Découvrez les spectacles les plus exclusifs de Bruxelles, sélectionnés avec soin.
          </p>
        </div>
      </div>

      {/* ── GRID ── */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {shows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <span className="text-6xl">🎭</span>
            <p className="text-sm" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
              Aucun spectacle disponible pour le moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {shows.map((show) => <ShowCard key={show.id} show={show} />)}
          </div>
        )}
      </div>
    </div>
  )
}

function ShowCard({ show }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: '#ffffff',
        boxShadow: hovered ? '0 16px 48px rgba(0,6,102,0.14)' : '0 4px 24px rgba(0,6,102,0.06)',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative overflow-hidden"
        style={{ height: '220px', background: 'linear-gradient(135deg, #000666, #1a237e)' }}>
        {show.poster_url ? (
          <img
            src={`/storage/posters/${show.poster_url}`}
            alt={show.title}
            className="w-full h-full object-cover"
            style={{ transform: hovered ? 'scale(1.06)' : 'scale(1)', transition: 'transform 0.5s ease' }}
            onError={(e) => { e.target.style.display = 'none' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">🎭</div>
        )}
        <div className="absolute top-3 left-3">
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full"
            style={{
              fontFamily: 'Manrope, sans-serif',
              background: show.status === 'CONFIRME' ? 'rgba(0,6,102,0.88)' : 'rgba(253,212,0,0.95)',
              color: show.status === 'CONFIRME' ? '#ffffff' : '#6f5c00',
            }}>
            {show.status === 'CONFIRME' ? 'Confirmé' : 'À confirmer'}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col flex-1">
        <p className="text-xs font-black uppercase tracking-[0.2em] mb-2"
          style={{ color: '#705d00', fontFamily: 'Manrope, sans-serif' }}>
          Spectacle
        </p>
        <h2 className="text-lg font-bold mb-4 line-clamp-2 leading-snug flex-1"
          style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>
          {show.title}
        </h2>

        {show.bookable ? (
          <Link to={`/shows/${show.id}`}
            className="flex items-center justify-center gap-2 text-sm font-bold py-3 px-5 rounded-xl hover:opacity-90 transition-opacity"
            style={{
              background: 'linear-gradient(135deg, #000666, #1a237e)',
              color: '#ffffff',
              fontFamily: '"Plus Jakarta Sans", sans-serif',
            }}>
            Voir les représentations
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        ) : (
          <div className="flex items-center justify-center text-xs font-semibold py-3 px-5 rounded-xl"
            style={{ background: '#f2f4f7', color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
            Non disponible à la réservation
          </div>
        )}
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
        Chargement des spectacles...
      </p>
    </div>
  )
}

function ErrorMsg({ msg }) {
  return (
    <div className="flex items-center justify-center h-64">
      <p className="text-sm" style={{ color: '#ba1a1a', fontFamily: 'Manrope, sans-serif' }}>{msg}</p>
    </div>
  )
}
