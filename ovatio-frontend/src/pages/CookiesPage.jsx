import { useCookies } from '../contexts/CookieContext'

export default function CookiesPage() {
  const { prefs, acceptAll, declineAll, savePrefs, reset } = useCookies()

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-ovatio-blue mb-2">Politique de cookies</h1>
      <p className="text-gray-500 text-sm mb-8">Dernière mise à jour : avril 2026</p>

      <section className="prose prose-sm max-w-none text-gray-700 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Qu'est-ce qu'un cookie ?</h2>
          <p>
            Un cookie est un petit fichier texte déposé sur votre appareil lors de votre visite sur
            notre site. Il permet de mémoriser vos préférences et d'améliorer votre expérience de
            navigation.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Cookies utilisés par Ovatio</h2>
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-2 font-medium text-gray-600">Nom</th>
                <th className="text-left px-4 py-2 font-medium text-gray-600">Finalité</th>
                <th className="text-left px-4 py-2 font-medium text-gray-600">Durée</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-4 py-2 font-mono text-xs">ovatio_token</td>
                <td className="px-4 py-2">Authentification (token API)</td>
                <td className="px-4 py-2">Session</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">ovatio_user</td>
                <td className="px-4 py-2">Données de l'utilisateur connecté</td>
                <td className="px-4 py-2">Session</td>
              </tr>
              <tr>
                <td className="px-4 py-2 font-mono text-xs">ovatio_cookie_consent</td>
                <td className="px-4 py-2">Mémorisation de votre choix de cookies</td>
                <td className="px-4 py-2">1 an</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Base légale (RGPD)</h2>
          <p>
            Conformément au Règlement Général sur la Protection des Données (RGPD), nous collectons
            votre consentement avant de déposer tout cookie non strictement nécessaire au
            fonctionnement du site.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Vos droits</h2>
          <p>
            Vous pouvez à tout moment modifier votre choix ci-dessous. Pour exercer vos droits
            d'accès, de rectification ou de suppression, contactez-nous à{' '}
            <a href="mailto:contact@ovatio.be" className="text-blue-600 hover:underline">
              contact@ovatio.be
            </a>
            .
          </p>
        </div>
      </section>

      {/* Gestion du consentement */}
     <div className="mt-10 p-6 bg-gray-50 border border-gray-200 rounded-xl space-y-4">
  <h2 className="text-base font-semibold text-gray-900">Gérer mes préférences</h2>

  <div className="flex items-center justify-between border-b pb-3">
    <div>
      <p className="text-sm font-medium text-gray-900">Nécessaires</p>
      <p className="text-xs text-gray-500">Requis pour le fonctionnement du site.</p>
    </div>
    <span className="text-xs text-green-600 font-semibold">Toujours actif</span>
  </div>

  {[
    { key: 'analytiques', label: 'Analytiques', desc: 'Statistiques anonymes de navigation.' },
    { key: 'marketing',   label: 'Marketing',   desc: 'Publicités personnalisées.' },
  ].map(({ key, label, desc }) => (
    <div key={key} className="flex items-center justify-between border-b pb-3 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <p className="text-xs text-gray-500">{desc}</p>
      </div>
      <button
        onClick={() => savePrefs({ ...prefs, [key]: !prefs?.[key] })}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          prefs?.[key] ? 'bg-ovatio-blue' : 'bg-gray-300'
        }`}>
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          prefs?.[key] ? 'translate-x-6' : 'translate-x-1'
        }`} />
      </button>
    </div>
  ))}

  <div className="flex flex-wrap gap-3 pt-2">
    <button onClick={acceptAll}
      className="px-4 py-2 text-sm bg-ovatio-blue text-white rounded-lg hover:bg-blue-700 transition font-semibold">
      Tout accepter
    </button>
    <button onClick={declineAll}
      className="px-4 py-2 text-sm border border-gray-400 text-gray-700 rounded-lg hover:bg-gray-100 transition">
      Tout refuser
    </button>
    <button onClick={reset}
      className="px-4 py-2 text-sm text-red-600 hover:underline transition">
      Réinitialiser
    </button>
  </div>
</div>
    </div>
  )
}
