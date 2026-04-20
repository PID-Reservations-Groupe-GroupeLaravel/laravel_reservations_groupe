import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCookies } from '../contexts/CookieContext'

export default function CookieBanner() {
  const { consent, acceptAll, declineAll, savePrefs } = useCookies()
  const [open, setOpen] = useState(false)
  const [local, setLocal] = useState({ analytiques: false, marketing: false })

  if (consent !== null) return null

  const toggle = (key) => setLocal(prev => ({ ...prev, [key]: !prev[key] }))

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(45, 49, 51, 0.97)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 -4px 40px rgba(0,0,0,0.2)',
      }}
    >
      <div className="max-w-5xl mx-auto px-6 py-5">

        {!open ? (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold mb-0.5" style={{ color: '#ffffff', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                Vos préférences de cookies
              </p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'Manrope, sans-serif' }}>
                Nous utilisons des cookies pour améliorer votre expérience.{' '}
                <Link to="/cookies" style={{ color: '#fdd400' }} className="hover:underline">
                  En savoir plus
                </Link>
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={declineAll}
                className="px-4 py-2 text-xs font-semibold rounded-xl transition-colors"
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  background: 'rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.7)',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                Refuser
              </button>
              <button
                onClick={() => setOpen(true)}
                className="px-4 py-2 text-xs font-semibold rounded-xl transition-colors"
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  background: 'rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.7)',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                Personnaliser
              </button>
              <button
                onClick={acceptAll}
                className="px-5 py-2 text-xs font-bold rounded-xl transition-opacity hover:opacity-90"
                style={{
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  background: '#fdd400',
                  color: '#6f5c00',
                }}
              >
                Accepter tout
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p
              className="text-sm font-semibold mb-3"
              style={{ color: '#ffffff', fontFamily: '"Plus Jakarta Sans", sans-serif' }}
            >
              Personnaliser mes cookies
            </p>

            {/* Nécessaires — toujours actif */}
            <div
              className="flex items-center justify-between px-4 py-3 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.06)' }}
            >
              <div>
                <p className="text-sm font-semibold" style={{ color: '#ffffff', fontFamily: 'Manrope, sans-serif' }}>
                  Nécessaires
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'Manrope, sans-serif' }}>
                  Authentification et session. Toujours actifs.
                </p>
              </div>
              <span className="text-xs font-bold" style={{ color: '#fdd400', fontFamily: 'Manrope, sans-serif' }}>
                Toujours actif
              </span>
            </div>

            {[
              { key: 'analytiques', label: 'Analytiques', desc: 'Statistiques de navigation anonymes.' },
              { key: 'marketing',   label: 'Marketing',   desc: 'Publicités personnalisées.' },
            ].map(({ key, label, desc }) => (
              <div
                key={key}
                className="flex items-center justify-between px-4 py-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              >
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#ffffff', fontFamily: 'Manrope, sans-serif' }}>
                    {label}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'Manrope, sans-serif' }}>
                    {desc}
                  </p>
                </div>
                <button
                  onClick={() => toggle(key)}
                  className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0"
                  style={{ background: local[key] ? '#000666' : 'rgba(255,255,255,0.2)' }}
                >
                  <span
                    className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                    style={{ transform: local[key] ? 'translateX(1.5rem)' : 'translateX(0.25rem)' }}
                  />
                </button>
              </div>
            ))}

            <div className="flex gap-2 pt-1">
              <button
                onClick={declineAll}
                className="px-4 py-2 text-xs font-semibold rounded-xl"
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  background: 'rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.7)',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                Tout refuser
              </button>
              <button
                onClick={() => savePrefs({ necessaires: true, ...local })}
                className="px-4 py-2 text-xs font-bold rounded-xl hover:opacity-90 transition-opacity"
                style={{
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  background: 'linear-gradient(135deg, #000666, #1a237e)',
                  color: '#ffffff',
                }}
              >
                Enregistrer mes choix
              </button>
              <button
                onClick={acceptAll}
                className="px-4 py-2 text-xs font-bold rounded-xl hover:opacity-90 transition-opacity"
                style={{
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                  background: '#fdd400',
                  color: '#6f5c00',
                }}
              >
                Tout accepter
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
