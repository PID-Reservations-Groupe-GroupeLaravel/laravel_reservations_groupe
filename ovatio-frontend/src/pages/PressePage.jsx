import { useLanguage } from '../contexts/LanguageContext'

export default function PressePage() {
  const { t } = useLanguage()

  const COMMUNIQUES = [
    {
      date: t('press.release1Date'),
      titre: t('press.release1Title'),
      extrait: t('press.release1Excerpt'),
      tag: t('press.tag_launch'),
    },
    {
      date: t('press.release2Date'),
      titre: t('press.release2Title'),
      extrait: t('press.release2Excerpt'),
      tag: t('press.tag_partnership'),
    },
    {
      date: t('press.release3Date'),
      titre: t('press.release3Title'),
      extrait: t('press.release3Excerpt'),
      tag: t('press.tag_tribune'),
    },
  ]

  const TAG_COLORS = {
    [t('press.tag_launch')]:      { bg: '#e8f5e9', color: '#2e7d32' },
    [t('press.tag_partnership')]: { bg: '#e8eaf6', color: '#000666' },
    [t('press.tag_tribune')]:     { bg: '#fff8e1', color: '#f57f17' },
  }

  const KIT_ITEMS = [
    { icon: '🖼️', labelKey: 'press.kit1Label', descKey: 'press.kit1Desc' },
    { icon: '📄', labelKey: 'press.kit2Label', descKey: 'press.kit2Desc' },
    { icon: '📊', labelKey: 'press.kit3Label', descKey: 'press.kit3Desc' },
  ]

  return (
    <div className="min-h-screen" style={{ background: '#f7f9fc' }}>

      <div className="py-16 px-6 text-center"
        style={{ background: 'linear-gradient(135deg, #000666 0%, #1a237e 100%)' }}>
        <p className="text-xs font-bold uppercase tracking-[0.25em] mb-3"
          style={{ color: '#fdd400', fontFamily: 'Manrope, sans-serif' }}>
          {t('press.badge')}
        </p>
        <h1 className="text-4xl font-extrabold text-white mb-3"
          style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
          {t('press.title')}
        </h1>
        <p className="text-sm max-w-xl mx-auto"
          style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Manrope, sans-serif' }}>
          {t('press.subtitle')}
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* Contact presse */}
        <div className="rounded-2xl p-6 mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ background: '#fff', boxShadow: '0 4px 24px rgba(0,6,102,0.07)', border: '1px solid #eceef1' }}>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-1"
              style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>{t('press.pressContactLabel')}</p>
            <p className="text-base font-bold"
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>
              {t('press.pressContactName')}
            </p>
            <p className="text-sm" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
              {t('press.pressContactInfo')}
            </p>
          </div>
          <a href="mailto:presse@standing-ovation.be"
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity shrink-0"
            style={{ background: 'linear-gradient(135deg, #000666, #1a237e)', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            {t('press.pressContactBtn')}
          </a>
        </div>

        {/* Kit presse */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {KIT_ITEMS.map(({ icon, labelKey, descKey }) => (
            <div key={labelKey} className="rounded-2xl p-5 text-center cursor-pointer hover:shadow-md transition-shadow"
              style={{ background: '#fff', boxShadow: '0 2px 12px rgba(0,6,102,0.06)', border: '1px solid #eceef1' }}>
              <div className="text-3xl mb-3">{icon}</div>
              <p className="text-sm font-bold mb-1"
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>{t(labelKey)}</p>
              <p className="text-xs" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>{t(descKey)}</p>
              <p className="text-xs font-bold mt-3" style={{ color: '#000666', fontFamily: 'Manrope, sans-serif' }}>
                {t('press.download')}
              </p>
            </div>
          ))}
        </div>

        {/* Communiqués */}
        <h2 className="text-2xl font-bold mb-6"
          style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#0a0d2e' }}>
          {t('press.releasesTitle')}
        </h2>

        <div className="space-y-4">
          {COMMUNIQUES.map((c) => {
            const tc = TAG_COLORS[c.tag] ?? { bg: '#f2f4f7', color: '#454652' }
            return (
              <article key={c.titre} className="rounded-2xl p-6"
                style={{ background: '#fff', boxShadow: '0 2px 12px rgba(0,6,102,0.06)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs font-bold px-3 py-1 rounded-full"
                    style={{ background: tc.bg, color: tc.color, fontFamily: 'Manrope, sans-serif' }}>
                    {c.tag}
                  </span>
                  <span className="text-xs" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
                    {c.date}
                  </span>
                </div>
                <h3 className="text-base font-bold mb-2"
                  style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>
                  {c.titre}
                </h3>
                <p className="text-sm leading-relaxed"
                  style={{ fontFamily: 'Manrope, sans-serif', color: '#767683', lineHeight: 1.8 }}>
                  {c.extrait}
                </p>
              </article>
            )
          })}
        </div>

      </div>
    </div>
  )
}
