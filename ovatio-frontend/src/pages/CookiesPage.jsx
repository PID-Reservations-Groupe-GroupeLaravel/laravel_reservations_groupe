import { useCookies } from '../contexts/CookieContext'

export default function CookiesPage() {
  const { prefs, acceptAll, declineAll, savePrefs, reset } = useCookies()

  return (
    <div className="min-h-screen" style={{ background: '#f7f9fc' }}>
      {/* Hero */}
      <div
        className="py-16 px-6 text-center"
        style={{ background: 'linear-gradient(135deg, #000666 0%, #1a237e 100%)' }}
      >
        <p
          className="text-xs font-bold uppercase tracking-[0.25em] mb-3"
          style={{ color: '#fdd400', fontFamily: 'Manrope, sans-serif' }}
        >
          RGPD &amp; Transparence
        </p>
        <h1
          className="text-4xl font-extrabold text-white mb-3"
          style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
        >
          Politique de cookies
        </h1>
        <p
          className="text-sm max-w-xl mx-auto"
          style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Manrope, sans-serif' }}
        >
          Dernière mise à jour : avril 2026
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12 space-y-10">

        {/* Section */}
        <Section title="Qu'est-ce qu'un cookie ?">
          <p>
            Un cookie est un petit fichier texte déposé sur votre appareil lors de votre visite sur
            notre site. Il permet de mémoriser vos préférences et d'améliorer votre expérience de
            navigation.
          </p>
        </Section>

        {/* Tableau cookies */}
        <Section title="Cookies utilisés par Ovatio">
          <div className="overflow-hidden rounded-xl" style={{ background: '#ffffff', boxShadow: '0 2px 20px rgba(0,0,0,0.04)' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: '#f2f4f7' }}>
                  <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider" style={{ color: '#454652', fontFamily: 'Manrope, sans-serif' }}>Nom</th>
                  <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider" style={{ color: '#454652', fontFamily: 'Manrope, sans-serif' }}>Finalité</th>
                  <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider" style={{ color: '#454652', fontFamily: 'Manrope, sans-serif' }}>Durée</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'ovatio_token',          purpose: 'Authentification (token API)',             duration: 'Session' },
                  { name: 'ovatio_user',            purpose: "Données de l'utilisateur connecté",        duration: 'Session' },
                  { name: 'ovatio_cookie_consent',  purpose: 'Mémorisation de votre choix de cookies',   duration: '1 an' },
                ].map((row, i) => (
                  <tr key={row.name} style={{ borderTop: i > 0 ? '1px solid #f2f4f7' : undefined }}>
                    <td className="px-5 py-3 font-mono text-xs" style={{ color: '#000666' }}>{row.name}</td>
                    <td className="px-5 py-3 text-sm" style={{ color: '#454652', fontFamily: 'Manrope, sans-serif' }}>{row.purpose}</td>
                    <td className="px-5 py-3 text-sm" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>{row.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="Base légale (RGPD)">
          <p>
            Conformément au Règlement Général sur la Protection des Données (RGPD), nous collectons
            votre consentement avant de déposer tout cookie non strictement nécessaire au
            fonctionnement du site.
          </p>
        </Section>

        <Section title="Vos droits">
          <p>
            Vous pouvez à tout moment modifier votre choix ci-dessous. Pour exercer vos droits
            d'accès, de rectification ou de suppression, contactez-nous à{' '}
            <a href="mailto:contact@ovatio.be" style={{ color: '#000666' }} className="font-semibold hover:underline">
              contact@ovatio.be
            </a>.
          </p>
        </Section>

        {/* Gestion consentement */}
        <div
          className="rounded-2xl p-8"
          style={{ background: '#ffffff', boxShadow: '0 4px 40px rgba(0,6,102,0.06)' }}
        >
          <h2
            className="text-lg font-bold mb-6"
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}
          >
            Gérer mes préférences
          </h2>

          {/* Nécessaires */}
          <div
            className="flex items-center justify-between py-4"
            style={{ borderBottom: '1px solid #f2f4f7' }}
          >
            <div>
              <p className="text-sm font-semibold" style={{ fontFamily: 'Manrope, sans-serif', color: '#191c1e' }}>
                Nécessaires
              </p>
              <p className="text-xs mt-0.5" style={{ fontFamily: 'Manrope, sans-serif', color: '#767683' }}>
                Requis pour le fonctionnement du site.
              </p>
            </div>
            <span className="text-xs font-bold" style={{ color: '#000666', fontFamily: 'Manrope, sans-serif' }}>
              Toujours actif
            </span>
          </div>

          {[
            { key: 'analytiques', label: 'Analytiques', desc: 'Statistiques anonymes de navigation.' },
            { key: 'marketing',   label: 'Marketing',   desc: 'Publicités personnalisées.' },
          ].map(({ key, label, desc }, i, arr) => (
            <div
              key={key}
              className="flex items-center justify-between py-4"
              style={{ borderBottom: i < arr.length - 1 ? '1px solid #f2f4f7' : undefined }}
            >
              <div>
                <p className="text-sm font-semibold" style={{ fontFamily: 'Manrope, sans-serif', color: '#191c1e' }}>
                  {label}
                </p>
                <p className="text-xs mt-0.5" style={{ fontFamily: 'Manrope, sans-serif', color: '#767683' }}>
                  {desc}
                </p>
              </div>
              <button
                onClick={() => savePrefs({ ...prefs, [key]: !prefs?.[key] })}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0"
                style={{ background: prefs?.[key] ? '#000666' : '#e0e3e6' }}
              >
                <span
                  className="inline-block h-4 w-4 rounded-full bg-white transition-transform"
                  style={{ transform: prefs?.[key] ? 'translateX(1.5rem)' : 'translateX(0.25rem)' }}
                />
              </button>
            </div>
          ))}

          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={acceptAll}
              className="px-5 py-2.5 text-sm font-bold rounded-xl hover:opacity-90 transition-opacity"
              style={{
                fontFamily: '"Plus Jakarta Sans", sans-serif',
                background: 'linear-gradient(135deg, #000666, #1a237e)',
                color: '#ffffff',
              }}
            >
              Tout accepter
            </button>
            <button
              onClick={declineAll}
              className="px-5 py-2.5 text-sm font-semibold rounded-xl transition-colors"
              style={{
                fontFamily: 'Manrope, sans-serif',
                background: '#f2f4f7',
                color: '#454652',
              }}
            >
              Tout refuser
            </button>
            <button
              onClick={reset}
              className="px-5 py-2.5 text-sm font-semibold hover:underline transition"
              style={{ fontFamily: 'Manrope, sans-serif', color: '#ba1a1a' }}
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div>
      <h2
        className="text-base font-bold mb-3"
        style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}
      >
        {title}
      </h2>
      <div
        className="text-sm leading-relaxed"
        style={{ fontFamily: 'Manrope, sans-serif', color: '#454652' }}
      >
        {children}
      </div>
    </div>
  )
}
