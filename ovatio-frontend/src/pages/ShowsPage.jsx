import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import { useLanguage } from '../contexts/LanguageContext'

export default function ShowsPage() {
  const { t } = useLanguage()
  const [shows, setShows]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    api.get('/shows')
      .then((res) => setShows(res.data.data ?? res.data))
      .catch(() => setError(t('shows.loadError')))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner t={t} />
  if (error)   return <ErrorMsg msg={error} />

  return (
    <div style={{ background: '#f7f9fc', minHeight: '100vh' }}>

      {/* ── HERO ── */}
      <div
        className="relative py-24 px-6 overflow-hidden text-center"
        style={{
          background: 'linear-gradient(135deg, #000666 0%, #1a237e 100%)',
          backgroundImage: 'url("https://images.unsplash.com/photo-1501612780353-7e5c60a588b9?w=1200&h=600&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlend: 'multiply'
        }}
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(135deg, rgba(0, 6, 102, 0.87) 0%, rgba(26, 35, 126, 0.87) 100%)' }} />

        <div className="relative max-w-4xl mx-auto">
          <h1
            className="text-5xl md:text-6xl font-extrabold text-white mb-6"
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', letterSpacing: '-0.02em', lineHeight: 1.2 }}
          >
            {t('shows.hero_title')}
          </h1>
          <p className="text-lg max-w-3xl mx-auto"
            style={{ color: 'rgba(255,255,255,0.90)', fontFamily: 'Manrope, sans-serif', lineHeight: 1.8 }}>
            {t('shows.hero_subtitle')}
          </p>
        </div>
      </div>

      {/* ── GRID ── */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {shows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <span className="text-6xl">🎭</span>
            <p className="text-sm" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
              {t('shows.noShows')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {shows.map((show) => <ShowCard key={show.id} show={show} t={t} />)}
          </div>
        )}
      </div>
    </div>
  )
}

function ShowCard({ show, t }) {
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
            src={`/images/${show.poster_url}`}
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
            {show.status === 'CONFIRME' ? t('shows.card_confirmed') : t('shows.card_toConfirm')}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col flex-1">
        <p className="text-xs font-black uppercase tracking-[0.2em] mb-2"
          style={{ color: '#705d00', fontFamily: 'Manrope, sans-serif' }}>
          {t('shows.card_label')}
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
            {t('shows.card_seeRepresentations')}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        ) : (
          <div className="flex items-center justify-center text-xs font-semibold py-3 px-5 rounded-xl"
            style={{ background: '#f2f4f7', color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
            {t('shows.card_notAvailable')}
          </div>
        )}
      </div>
    </div>
  )
}

function Spinner({ t }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <div className="w-10 h-10 rounded-full border-4 animate-spin"
        style={{ borderColor: '#e0e3e6', borderTopColor: '#000666' }} />
      <p className="text-sm" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
        {t('shows.loading')}
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
