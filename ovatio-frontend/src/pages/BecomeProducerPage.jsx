import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import api from '../api/axios'

export default function BecomeProducerPage() {
  const { user, refreshUser } = useAuth()
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
  const [fieldErrors, setFieldErrors] = useState({})
  const [touched, setTouched]         = useState({})
  const [requestStatus, setRequestStatus] = useState(null)
  const [rejectedReason, setRejectedReason] = useState('')
  const [statusLoading, setStatusLoading]   = useState(true)

  useEffect(() => {
    if (!user || user?.roles?.includes('producer') || user?.roles?.includes('admin')) {
      setStatusLoading(false)
      return
    }
    api.get('/producer/apply')
      .then(async res => {
        setRequestStatus(res.data.status)
        if (res.data.rejection_reason) setRejectedReason(res.data.rejection_reason)
        // Si approuvé mais rôle pas encore dans le cache local → rafraîchir
        if (res.data.status === 'approved' && !user?.roles?.includes('producer')) {
          await refreshUser()
        }
      })
      .catch(() => setRequestStatus('none'))
      .finally(() => setStatusLoading(false))
  }, [user])

  const SIRET_RE  = /^(BE\s*0\d{3}[\s.\-]?\d{3}[\s.\-]?\d{3}|\d{14})$/i
  const PHONE_RE  = /^\+?[\d\s\-().]{7,20}$/
  const URL_RE    = /^https?:\/\/.+\..+/i

  const validate = (values) => {
    const errs = {}
    if (!values.company_name.trim())
      errs.company_name = t('producer.errRequired')
    else if (values.company_name.trim().length < 2)
      errs.company_name = t('producer.errMinName')

    if (!values.description.trim())
      errs.description = t('producer.errRequired')
    else if (values.description.trim().length < 20)
      errs.description = t('producer.errMinDesc')

    if (values.siret && !SIRET_RE.test(values.siret.trim()))
      errs.siret = t('producer.errSiret')

    if (values.website && !URL_RE.test(values.website.trim()))
      errs.website = t('producer.errUrl')

    if (values.phone && !PHONE_RE.test(values.phone.trim()))
      errs.phone = t('producer.errPhone')

    return errs
  }

  const set = (field) => (e) => {
    const val = e.target.value
    setForm(prev => ({ ...prev, [field]: val }))
    if (touched[field]) {
      const errs = validate({ ...form, [field]: val })
      setFieldErrors(prev => ({ ...prev, [field]: errs[field] }))
    }
  }

  const blur = (field) => () => {
    setTouched(prev => ({ ...prev, [field]: true }))
    const errs = validate(form)
    setFieldErrors(prev => ({ ...prev, [field]: errs[field] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const allTouched = { company_name: true, siret: true, description: true, website: true, phone: true }
    setTouched(allTouched)
    const errs = validate(form)
    setFieldErrors(errs)
    if (Object.keys(errs).length > 0) return
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

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>

            {/* Nom de la compagnie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('producer.companyName')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.company_name}
                onChange={set('company_name')}
                onBlur={blur('company_name')}
                placeholder="Théâtre du Soleil"
                className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition ${
                  fieldErrors.company_name
                    ? 'border-red-400 focus:ring-red-300 bg-red-50'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {fieldErrors.company_name && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.company_name}</p>
              )}
            </div>

            {/* SIRET / BCE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('producer.siret')}
                <span className="text-gray-400 font-normal text-xs ml-2">{t('producer.siretHint')}</span>
              </label>
              <input
                type="text"
                value={form.siret}
                onChange={set('siret')}
                onBlur={blur('siret')}
                placeholder="BE 0123.456.789"
                className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition ${
                  fieldErrors.siret
                    ? 'border-red-400 focus:ring-red-300 bg-red-50'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {fieldErrors.siret && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.siret}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  {t('producer.description')} <span className="text-red-500">*</span>
                </label>
                <span className={`text-xs ${form.description.length < 20 ? 'text-gray-400' : 'text-green-600'}`}>
                  {form.description.length} / 20 min.
                </span>
              </div>
              <textarea
                value={form.description}
                onChange={set('description')}
                onBlur={blur('description')}
                rows={4}
                placeholder={t('producer.descPlaceholder')}
                className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 resize-none transition ${
                  fieldErrors.description
                    ? 'border-red-400 focus:ring-red-300 bg-red-50'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {fieldErrors.description && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.description}</p>
              )}
            </div>

            {/* Website + Téléphone */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('producer.website')}</label>
                <input
                  type="text"
                  value={form.website}
                  onChange={set('website')}
                  onBlur={blur('website')}
                  placeholder="https://macompagnie.be"
                  className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition ${
                    fieldErrors.website
                      ? 'border-red-400 focus:ring-red-300 bg-red-50'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {fieldErrors.website && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.website}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('producer.phone')}</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={set('phone')}
                  onBlur={blur('phone')}
                  placeholder="+32 2 000 00 00"
                  className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 transition ${
                    fieldErrors.phone
                      ? 'border-red-400 focus:ring-red-300 bg-red-50'
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                />
                {fieldErrors.phone && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.phone}</p>
                )}
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
