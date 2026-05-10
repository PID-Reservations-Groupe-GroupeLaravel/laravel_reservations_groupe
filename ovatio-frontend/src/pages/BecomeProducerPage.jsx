import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import api from '../api/axios'

export default function BecomeProducerPage() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    company_name: '',
    siret: '',
    description: '',
    website: '',
    phone: '',
  })
  const [loading, setLoading]         = useState(false)
  const [success, setSuccess]         = useState(false)
  const [error, setError]             = useState('')
  const [requestStatus, setRequestStatus] = useState(null) // 'pending' | 'rejected' | 'none' | null
  const [rejectedReason, setRejectedReason] = useState('')
  const [statusLoading, setStatusLoading]   = useState(true)

  useEffect(() => {
    if (!user || user?.roles?.includes('producer') || user?.roles?.includes('admin')) {
      setStatusLoading(false)
      return
    }
    api.get('/producer/apply')
      .then(res => {
        setRequestStatus(res.data.status)
        if (res.data.rejection_reason) setRejectedReason(res.data.rejection_reason)
      })
      .catch(() => setRequestStatus('none'))
      .finally(() => setStatusLoading(false))
  }, [user])

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/producer/apply', form)
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message ?? t('producer.genericError'))
    } finally {
      setLoading(false)
    }
  }

  // Déjà producteur ou admin
  if (user?.roles?.includes('producer') || user?.roles?.includes('admin')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-md">
          <div className="text-5xl mb-4">🎭</div>
          <h2 className="text-2xl font-bold text-ovatio-blue mb-2">{t('producer.alreadyTitle')}</h2>
          <p className="text-gray-500 text-sm mb-6">{t('producer.alreadyDesc')}</p>
          <button
            onClick={() => navigate('/shows')}
            className="bg-ovatio-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {t('producer.backToShows')}
          </button>
        </div>
      </div>
    )
  }

  if (statusLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 rounded-full animate-spin"
          style={{ borderColor: '#e0e3e6', borderTopColor: '#000666' }} />
      </div>
    )
  }

  // Demande en attente
  if (requestStatus === 'pending') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-md">
          <div className="text-5xl mb-4">⏳</div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#f57f17' }}>{t('producer.pendingTitle')}</h2>
          <p className="text-gray-500 text-sm mb-6">{t('producer.pendingDesc')}</p>
          <button
            onClick={() => navigate('/shows')}
            className="bg-ovatio-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {t('producer.backToShows')}
          </button>
        </div>
      </div>
    )
  }

  // Demande refusée
  if (requestStatus === 'rejected') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-md">
          <div className="text-5xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-red-700 mb-2">{t('producer.rejectedTitle')}</h2>
          {rejectedReason && (
            <p className="text-sm text-red-600 mb-3">
              <strong>{t('producer.rejectedDesc')}</strong> {rejectedReason}
            </p>
          )}
          <p className="text-gray-500 text-sm mb-6">{t('producer.rejectedRetry')}</p>
          <button
            onClick={() => setRequestStatus('none')}
            className="bg-ovatio-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {t('producer.submit')}
          </button>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-md">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-green-700 mb-2">{t('producer.successTitle')}</h2>
          <p className="text-gray-500 text-sm mb-6">
            {t('producer.successDesc')}
          </p>
          <button
            onClick={() => navigate('/shows')}
            className="bg-ovatio-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {t('producer.backToShows')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Hero */}
        <div className="bg-gradient-to-r from-ovatio-blue to-ovatio-light text-white rounded-2xl p-8 mb-8 text-center">
          <div className="text-5xl mb-4">🎬</div>
          <h1 className="text-3xl font-bold mb-2">{t('producer.heroTitle')}</h1>
          <p className="text-blue-100 text-sm max-w-md mx-auto">
            {t('producer.heroDesc')}
          </p>
        </div>

        {/* Avantages */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { icon: '🎭', titleKey: 'producer.benefit1Title', descKey: 'producer.benefit1Desc' },
            { icon: '📅', titleKey: 'producer.benefit2Title', descKey: 'producer.benefit2Desc' },
            { icon: '🎟️', titleKey: 'producer.benefit3Title', descKey: 'producer.benefit3Desc' },
          ].map(({ icon, titleKey, descKey }) => (
            <div key={titleKey} className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
              <div className="text-3xl mb-2">{icon}</div>
              <p className="font-semibold text-gray-800 text-sm">{t(titleKey)}</p>
              <p className="text-gray-400 text-xs mt-1">{t(descKey)}</p>
            </div>
          ))}
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-ovatio-blue mb-6">{t('producer.formTitle')}</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('producer.companyName')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.company_name}
                onChange={set('company_name')}
                required
                placeholder="Théâtre du Soleil"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('producer.siret')}
              </label>
              <input
                type="text"
                value={form.siret}
                onChange={set('siret')}
                placeholder="BE 0123.456.789"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('producer.description')} <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.description}
                onChange={set('description')}
                required
                rows={4}
                placeholder={t('producer.descPlaceholder')}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('producer.website')}</label>
                <input
                  type="url"
                  value={form.website}
                  onChange={set('website')}
                  placeholder="https://macompagnie.be"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('producer.phone')}</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={set('phone')}
                  placeholder="+32 2 000 00 00"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ovatio-blue text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 mt-2"
            >
              {loading ? t('producer.submitting') : t('producer.submit')}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
