import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function SessionsPage() {
  const [history, setHistory]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [password, setPassword] = useState('')
  const [logoutMsg, setLogoutMsg] = useState('')
  const [logoutErr, setLogoutErr] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    api.get('/profile/sessions')
      .then((res) => setHistory(res.data.history ?? res.data))
      .catch(() => setError('Impossible de charger l\'historique.'))
      .finally(() => setLoading(false))
  }, [])

  const handleLogoutOthers = async (e) => {
    e.preventDefault()
    setLogoutMsg('')
    setLogoutErr('')
    setSubmitting(true)
    try {
      await api.delete('/profile/sessions/others', { data: { password } })
      setLogoutMsg('✅ Tous les autres appareils ont été déconnectés.')
      setPassword('')
    } catch (err) {
      setLogoutErr(err.response?.data?.message ?? 'Mot de passe incorrect.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <Spinner />

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-ovatio-blue mb-2">Gestion des sessions</h1>
      <p className="text-gray-500 mb-8">Historique de vos connexions et déconnexion à distance</p>

      {/* Historique */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800">Historique de connexion</h2>
        </div>

        {error ? (
          <p className="text-center text-red-400 py-8 text-sm">{error}</p>
        ) : history.length === 0 ? (
          <p className="text-center text-gray-400 py-8 text-sm">Aucun historique disponible.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Adresse IP</th>
                  <th className="px-6 py-3 text-left">Navigateur</th>
                  <th className="px-6 py-3 text-left">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {history.map((entry, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
                      {new Date(entry.logged_at).toLocaleString('fr-BE')}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">
                      {entry.ip_address ?? '—'}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs max-w-xs truncate">
                      {entry.user_agent
                        ? entry.user_agent.substring(0, 60) + '...'
                        : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        entry.success
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {entry.success ? '✓ Succès' : '✗ Échec'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Déconnexion tous les appareils — B1 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="font-bold text-gray-800 mb-1">Déconnecter tous les autres appareils</h2>
        <p className="text-sm text-gray-500 mb-4">
          Confirmez votre mot de passe pour révoquer toutes les autres sessions actives.
        </p>

        {logoutMsg && (
          <div className="mb-4 bg-green-50 border border-green-300 text-green-700 rounded-lg p-3 text-sm">
            {logoutMsg}
          </div>
        )}
        {logoutErr && (
          <div className="mb-4 bg-red-50 border border-red-300 text-red-700 rounded-lg p-3 text-sm">
            {logoutErr}
          </div>
        )}

        <form onSubmit={handleLogoutOthers} className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe actuel
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-50 whitespace-nowrap"
          >
            {submitting ? 'En cours...' : 'Déconnecter les autres'}
          </button>
        </form>
      </div>
    </div>
  )
}

function Spinner() {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="w-10 h-10 border-4 border-blue-200 border-t-ovatio-blue rounded-full animate-spin" />
    </div>
  )
}
