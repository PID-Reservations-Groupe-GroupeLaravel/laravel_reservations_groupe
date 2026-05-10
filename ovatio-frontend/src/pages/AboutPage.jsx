import { useLanguage } from '../contexts/LanguageContext'

export default function AboutPage() {
  const { t } = useLanguage()

  return (
    <div style={{ background: '#f7f9fc', minHeight: '100vh', fontFamily: 'Manrope, sans-serif' }}>

      <div className="py-20 px-4 text-center text-white"
        style={{ background: 'linear-gradient(135deg, #000666 0%, #1a237e 100%)' }}>
        <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
          {t('about.heroTitle')}
        </h1>
        <p className="max-w-xl mx-auto text-base" style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}>
          {t('about.heroSubtitle')}
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">

        <Section icon="theater_comedy" title={t('about.missionTitle')}
          content={t('about.missionContent')} />

        <div className="rounded-2xl p-8" style={{ background: '#ffffff', boxShadow: '0px 20px 40px rgba(25, 28, 30, 0.06)' }}>
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-3xl" style={{ color: '#000666' }}>group</span>
            <h2 className="text-xl font-bold" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>{t('about.teamTitle')}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { name: 'Soufiane', role: 'Développeur Back-end & Admin', icon: 'code' },
              { name: 'Salim',    role: 'Développeur Front-end & UI/UX', icon: 'brush' },
            ].map(({ name, role, icon }) => (
              <div key={name} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: '#f7f9fc' }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #000666, #1a237e)' }}>
                  <span className="material-symbols-outlined text-white text-xl">{icon}</span>
                </div>
                <div>
                  <p className="font-semibold" style={{ color: '#191c1e', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>{name}</p>
                  <p className="text-sm" style={{ color: '#767683' }}>{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Section icon="build" title={t('about.techTitle')}
          content={t('about.techContent')}
          chips={['Laravel 11', 'React 18', 'Vite', 'Tailwind CSS', 'MySQL', 'Sanctum']} />

        <Section icon="movie" title={t('about.producerTitle')}
          content={t('about.producerContent')} />

        <div className="rounded-2xl p-8" style={{ background: '#ffffff', boxShadow: '0px 20px 40px rgba(25, 28, 30, 0.06)' }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-3xl" style={{ color: '#000666' }}>gavel</span>
            <h2 className="text-xl font-bold" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>{t('about.legalTitle')}</h2>
          </div>
          <div className="space-y-3 text-sm" style={{ color: '#454652', lineHeight: 1.7 }}>
            <p><strong>{t('about.legalEditor')}</strong> Ovatio SPRL — BE 0123.456.789</p>
            <p><strong>{t('about.legalAddress')}</strong> Rue de la Culture 42, 1000 Bruxelles, Belgique</p>
            <p><strong>{t('about.legalEmail')}</strong> contact@ovatio.be</p>
            <p><strong>{t('about.legalHost')}</strong> OVH SAS, 2 rue Kellermann, 59100 Roubaix, France</p>
            <p><strong>{t('about.legalResponsible')}</strong> Soufiane &amp; Salim — Étudiants PID 2024-2025</p>
          </div>
        </div>

        <Section icon="privacy_tip" title={t('about.privacyTitle')}
          content={t('about.privacyContent')} />

      </div>
    </div>
  )
}

function Section({ icon, title, content, chips }) {
  return (
    <div className="rounded-2xl p-8" style={{ background: '#ffffff', boxShadow: '0px 20px 40px rgba(25, 28, 30, 0.06)' }}>
      <div className="flex items-center gap-3 mb-4">
        <span className="material-symbols-outlined text-3xl" style={{ color: '#000666' }}>{icon}</span>
        <h2 className="text-xl font-bold" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>{title}</h2>
      </div>
      <p className="text-sm" style={{ color: '#454652', lineHeight: 1.8 }}>{content}</p>
      {chips && (
        <div className="flex flex-wrap gap-2 mt-4">
          {chips.map((c) => (
            <span key={c} className="text-xs px-3 py-1 rounded-full"
              style={{ background: '#f2f4f7', color: '#454652', fontFamily: 'Manrope, sans-serif' }}>{c}</span>
          ))}
        </div>
      )}
    </div>
  )
}
