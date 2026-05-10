import { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'

function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-wider block mb-2"
        style={{ fontFamily: 'Manrope, sans-serif', color: '#767683' }}>
        {label}
      </label>
      {children}
    </div>
  )
}

const inputStyle = {
  width: '100%', padding: '12px 16px', borderRadius: '12px',
  border: '1px solid #e0e3e6', background: '#f7f9fc',
  fontFamily: 'Manrope, sans-serif', fontSize: '0.875rem', color: '#191c1e',
  outline: 'none',
}

export default function ContactPage() {
  const { t } = useLanguage()
  const [form, setForm]     = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent]     = useState(false)
  const [sending, setSending] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSending(true)
    setTimeout(() => { setSent(true); setSending(false) }, 800)
  }

  const infos = [
    { icon: '📍', labelKey: 'contact.addressLabel', valueKey: 'contact.addressValue' },
    { icon: '✉️', labelKey: 'contact.emailLabel',   valueKey: 'contact.emailValue' },
    { icon: '🕐', labelKey: 'contact.responseLabel', valueKey: 'contact.responseValue' },
  ]

  return (
    <div className="min-h-screen" style={{ background: '#f7f9fc' }}>

      <div className="py-16 px-6 text-center"
        style={{ background: 'linear-gradient(135deg, #000666 0%, #1a237e 100%)' }}>
        <p className="text-xs font-bold uppercase tracking-[0.25em] mb-3"
          style={{ color: '#fdd400', fontFamily: 'Manrope, sans-serif' }}>
          {t('contact.badge')}
        </p>
        <h1 className="text-4xl font-extrabold text-white mb-3"
          style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
          {t('contact.title')}
        </h1>
        <p className="text-sm max-w-xl mx-auto"
          style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Manrope, sans-serif' }}>
          {t('contact.subtitle')}
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* Infos */}
        <div className="space-y-6">
          {infos.map(({ icon, labelKey, valueKey }) => (
            <div key={labelKey} className="rounded-2xl p-5"
              style={{ background: '#fff', boxShadow: '0 2px 12px rgba(0,6,102,0.06)' }}>
              <div className="text-2xl mb-2">{icon}</div>
              <p className="text-xs font-bold uppercase tracking-wider mb-1"
                style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>{t(labelKey)}</p>
              <p className="text-sm whitespace-pre-line"
                style={{ fontFamily: 'Manrope, sans-serif', color: '#191c1e' }}>{t(valueKey)}</p>
            </div>
          ))}
        </div>

        {/* Formulaire */}
        <div className="md:col-span-2 rounded-2xl p-8"
          style={{ background: '#fff', boxShadow: '0 4px 24px rgba(0,6,102,0.07)' }}>

          {sent ? (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-xl font-bold mb-2"
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>
                {t('contact.sentTitle')}
              </h2>
              <p className="text-sm" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
                {t('contact.sentDesc')}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label={t('contact.fullName')}>
                  <input style={inputStyle} required value={form.name}
                    placeholder="Jean Dupont"
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                </Field>
                <Field label={t('contact.emailField')}>
                  <input style={inputStyle} type="email" required value={form.email}
                    placeholder="jean@exemple.be"
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                </Field>
              </div>
              <Field label={t('contact.subject')}>
                <select style={inputStyle} value={form.subject}
                  onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}>
                  <option value="">{t('contact.subjectPlaceholder')}</option>
                  <option>{t('contact.subject1')}</option>
                  <option>{t('contact.subject2')}</option>
                  <option>{t('contact.subject3')}</option>
                  <option>{t('contact.subject4')}</option>
                  <option>{t('contact.subject5')}</option>
                  <option>{t('contact.subject6')}</option>
                </select>
              </Field>
              <Field label={t('contact.message')}>
                <textarea style={{ ...inputStyle, resize: 'none' }} rows={5} required
                  value={form.message} placeholder={t('contact.messagePlaceholder')}
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))} />
              </Field>
              <button type="submit" disabled={sending}
                className="w-full py-3 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg, #000666, #1a237e)', fontFamily: '"Plus Jakarta Sans", sans-serif', border: 'none', cursor: 'pointer' }}>
                {sending ? t('contact.sending') : t('contact.send')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
