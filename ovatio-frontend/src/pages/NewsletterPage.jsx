import { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'

export default function NewsletterPage() {
  const { t } = useLanguage()

  const PREFERENCES = [
    { id: 'nouveautes',    labelKey: 'newsletter.pref1Label', descKey: 'newsletter.pref1Desc' },
    { id: 'promotions',   labelKey: 'newsletter.pref2Label', descKey: 'newsletter.pref2Desc' },
    { id: 'coulisses',    labelKey: 'newsletter.pref3Label', descKey: 'newsletter.pref3Desc' },
    { id: 'agenda',       labelKey: 'newsletter.pref4Label', descKey: 'newsletter.pref4Desc' },
  ]

  const [email, setEmail]   = useState('')
  const [prefs, setPrefs]   = useState({ nouveautes: true, promotions: false, coulisses: false, agenda: true })
  const [sent, setSent]     = useState(false)
  const [sending, setSending] = useState(false)
  const [err, setErr]       = useState('')

  const togglePref = (id) => setPrefs(p => ({ ...p, [id]: !p[id] }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email.includes('@')) { setErr(t('newsletter.invalidEmail')); return }
    setSending(true); setErr('')
    setTimeout(() => { setSent(true); setSending(false) }, 800)
  }

  const STATS = [
    { nKey: 'newsletter.stat1n', labelKey: 'newsletter.stat1label' },
    { nKey: 'newsletter.stat2n', labelKey: 'newsletter.stat2label' },
    { nKey: 'newsletter.stat3n', labelKey: 'newsletter.stat3label' },
  ]

  return (
    <div className="min-h-screen" style={{ background: '#f7f9fc' }}>

      <div className="py-16 px-6 text-center"
        style={{ background: 'linear-gradient(135deg, #000666 0%, #1a237e 100%)' }}>
        <p className="text-xs font-bold uppercase tracking-[0.25em] mb-3"
          style={{ color: '#fdd400', fontFamily: 'Manrope, sans-serif' }}>
          {t('newsletter.badge')}
        </p>
        <h1 className="text-4xl font-extrabold text-white mb-3"
          style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
          {t('newsletter.title')}
        </h1>
        <p className="text-sm max-w-xl mx-auto"
          style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Manrope, sans-serif' }}>
          {t('newsletter.subtitle')}
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">

        {sent ? (
          <div className="rounded-2xl p-12 text-center"
            style={{ background: '#fff', boxShadow: '0 4px 24px rgba(0,6,102,0.07)' }}>
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-3"
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>
              {t('newsletter.successTitle')}
            </h2>
            <p className="text-sm mb-2"
              style={{ fontFamily: 'Manrope, sans-serif', color: '#767683' }}>
              {t('newsletter.successDesc')}
            </p>
            <p className="text-sm"
              style={{ fontFamily: 'Manrope, sans-serif', color: '#767683' }}>
              {t('newsletter.successEmail')} <strong style={{ color: '#191c1e' }}>{email}</strong>.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl p-8"
            style={{ background: '#fff', boxShadow: '0 4px 24px rgba(0,6,102,0.07)' }}>

            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Email */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider block mb-2"
                  style={{ fontFamily: 'Manrope, sans-serif', color: '#767683' }}>
                  {t('newsletter.emailLabel')}
                </label>
                <input
                  type="email" required value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={t('newsletter.emailPlaceholder')}
                  className="w-full outline-none"
                  style={{
                    padding: '12px 16px', borderRadius: '12px',
                    border: '1px solid #e0e3e6', background: '#f7f9fc',
                    fontFamily: 'Manrope, sans-serif', fontSize: '0.875rem', color: '#191c1e',
                  }}
                />
              </div>

              {/* Préférences */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider mb-3"
                  style={{ fontFamily: 'Manrope, sans-serif', color: '#767683' }}>
                  {t('newsletter.prefsLabel')}
                </p>
                <div className="space-y-3">
                  {PREFERENCES.map(({ id, labelKey, descKey }) => (
                    <label key={id}
                      className="flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-colors"
                      style={{
                        background: prefs[id] ? '#f0f1ff' : '#f7f9fc',
                        border: `1px solid ${prefs[id] ? '#c5c8ff' : '#eceef1'}`,
                      }}>
                      <input type="checkbox" checked={prefs[id]} onChange={() => togglePref(id)}
                        className="mt-0.5 shrink-0 accent-[#000666]" />
                      <div>
                        <p className="text-sm font-semibold"
                          style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>
                          {t(labelKey)}
                        </p>
                        <p className="text-xs mt-0.5"
                          style={{ fontFamily: 'Manrope, sans-serif', color: '#767683' }}>
                          {t(descKey)}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {err && (
                <p className="text-xs" style={{ color: '#93000a', fontFamily: 'Manrope, sans-serif' }}>{err}</p>
              )}

              <button type="submit" disabled={sending}
                className="w-full py-3 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #000666, #1a237e)', fontFamily: '"Plus Jakarta Sans", sans-serif', border: 'none', cursor: 'pointer' }}>
                {sending ? t('newsletter.subscribing') : t('newsletter.subscribe')}
              </button>

              <p className="text-xs text-center"
                style={{ fontFamily: 'Manrope, sans-serif', color: '#aaa' }}>
                {t('newsletter.privacyNote')}
              </p>

            </form>
          </div>
        )}

        {/* Chiffres */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          {STATS.map(({ nKey, labelKey }) => (
            <div key={nKey} className="rounded-2xl p-5 text-center"
              style={{ background: '#fff', boxShadow: '0 2px 12px rgba(0,6,102,0.06)' }}>
              <p className="text-2xl font-extrabold mb-1"
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#000666' }}>{t(nKey)}</p>
              <p className="text-xs" style={{ fontFamily: 'Manrope, sans-serif', color: '#767683' }}>{t(labelKey)}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
