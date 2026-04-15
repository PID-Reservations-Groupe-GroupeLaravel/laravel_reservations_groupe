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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-ovatio-dark text-white shadow-2xl">
      <div className="max-w-5xl mx-auto px-4 py-4">

        {!open ? (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-300 text-center sm:text-left">
              Nous utilisons des cookies pour améliorer votre expérience.{' '}
              <Link to="/cookies" className="text-blue-400 hover:underline">En savoir plus</Link>
            </p>
            <div className="flex gap-3 shrink-0">
              <button onClick={declineAll}
                className="px-4 py-2 text-sm border border-gray-500 text-gray-300 rounded-lg hover:bg-gray-700 transition">
                Refuser
              </button>
              <button onClick={() => setOpen(true)}
                className="px-4 py-2 text-sm border border-blue-400 text-blue-400 rounded-lg hover:bg-gray-700 transition">
                Personnaliser
              </button>
              <button onClick={acceptAll}
                className="px-4 py-2 text-sm bg-ovatio-blue text-white rounded-lg hover:bg-blue-700 transition font-semibold">
                Accepter tout
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-300 mb-2">Choisissez vos préférences de cookies.</p>

            <div className="flex items-center justify-between bg-gray-800 rounded-lg px-4 py-3">
              <div>
                <p className="text-sm font-semibold">Nécessaires</p>
                <p className="text-xs text-gray-400">Authentification et session. Toujours actifs.</p>
              </div>
              <span className="text-xs text-green-400 font-semibold">Toujours actif</span>
            </div>

            {[
              { key: 'analytiques', label: 'Analytiques', desc: 'Statistiques de navigation anonymes.' },
              { key: 'marketing',   label: 'Marketing',   desc: 'Publicités personnalisées.' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between bg-gray-800 rounded-lg px-4 py-3">
                <div>
                  <p className="text-sm font-semibold">{label}</p>
                  <p className="text-xs text-gray-400">{desc}</p>
                </div>
                <button onClick={() => toggle(key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    local[key] ? 'bg-ovatio-blue' : 'bg-gray-600'
                  }`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    local[key] ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            ))}

            <div className="flex gap-3 pt-1">
              <button onClick={declineAll}
                className="px-4 py-2 text-sm border border-gray-500 text-gray-300 rounded-lg hover:bg-gray-700 transition">
                Tout refuser
              </button>
              <button onClick={() => savePrefs({ necessaires: true, ...local })}
                className="px-4 py-2 text-sm bg-ovatio-blue text-white rounded-lg hover:bg-blue-700 transition font-semibold">
                Enregistrer mes choix
              </button>
              <button onClick={acceptAll}
                className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold">
                Tout accepter
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}