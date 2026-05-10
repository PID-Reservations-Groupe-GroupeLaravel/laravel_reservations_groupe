const COMMUNIQUES = [
  {
    date: 'Avril 2026',
    titre: 'Ovatio.be lance sa plateforme de réservation de spectacles vivants à Bruxelles',
    extrait: 'La nouvelle plateforme culturelle bruxelloise Ovatio.be ouvre ses portes et propose une sélection curatée de spectacles de théâtre, danse et musique dans la capitale belge.',
    tag: 'Lancement',
  },
  {
    date: 'Mars 2026',
    titre: 'Partenariat avec les salles de spectacle bruxelloises pour une offre culturelle élargie',
    extrait: 'Ovatio.be annonce un accord de diffusion avec plusieurs salles emblématiques de Bruxelles afin d\'enrichir son catalogue et d\'offrir une expérience de réservation unifiée.',
    tag: 'Partenariat',
  },
  {
    date: 'Février 2026',
    titre: 'Ovatio.be, la réponse belge aux grandes plateformes de billetterie culturelle',
    extrait: 'Dans un contexte de montée en puissance du numérique dans le secteur culturel, Ovatio.be se positionne comme une alternative locale, indépendante et centrée sur les arts vivants.',
    tag: 'Tribune',
  },
]

const TAG_COLORS = {
  'Lancement':   { bg: '#e8f5e9', color: '#2e7d32' },
  'Partenariat': { bg: '#e8eaf6', color: '#000666' },
  'Tribune':     { bg: '#fff8e1', color: '#f57f17' },
}

export default function PressePage() {
  return (
    <div className="min-h-screen" style={{ background: '#f7f9fc' }}>

      <div className="py-16 px-6 text-center"
        style={{ background: 'linear-gradient(135deg, #000666 0%, #1a237e 100%)' }}>
        <p className="text-xs font-bold uppercase tracking-[0.25em] mb-3"
          style={{ color: '#fdd400', fontFamily: 'Manrope, sans-serif' }}>
          Médias & journalistes
        </p>
        <h1 className="text-4xl font-extrabold text-white mb-3"
          style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
          Espace Presse
        </h1>
        <p className="text-sm max-w-xl mx-auto"
          style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Manrope, sans-serif' }}>
          Communiqués, ressources visuelles et contact presse pour les journalistes et blogueurs culturels.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* Contact presse */}
        <div className="rounded-2xl p-6 mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ background: '#fff', boxShadow: '0 4px 24px rgba(0,6,102,0.07)', border: '1px solid #eceef1' }}>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-1"
              style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>Contact presse</p>
            <p className="text-base font-bold"
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>
              Service communication Ovatio.be
            </p>
            <p className="text-sm" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
              presse@ovatio.be · Réponse sous 24h
            </p>
          </div>
          <a href="mailto:presse@ovatio.be"
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity shrink-0"
            style={{ background: 'linear-gradient(135deg, #000666, #1a237e)', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            Contacter le service presse →
          </a>
        </div>

        {/* Kit presse */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { icon: '🖼️', label: 'Logos & visuels', desc: 'Pack haute résolution (PNG, SVG)' },
            { icon: '📄', label: 'Dossier de presse', desc: 'Présentation complète de la plateforme' },
            { icon: '📊', label: 'Chiffres clés', desc: 'Statistiques et faits marquants 2026' },
          ].map(({ icon, label, desc }) => (
            <div key={label} className="rounded-2xl p-5 text-center cursor-pointer hover:shadow-md transition-shadow"
              style={{ background: '#fff', boxShadow: '0 2px 12px rgba(0,6,102,0.06)', border: '1px solid #eceef1' }}>
              <div className="text-3xl mb-3">{icon}</div>
              <p className="text-sm font-bold mb-1"
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>{label}</p>
              <p className="text-xs" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>{desc}</p>
              <p className="text-xs font-bold mt-3" style={{ color: '#000666', fontFamily: 'Manrope, sans-serif' }}>
                Télécharger →
              </p>
            </div>
          ))}
        </div>

        {/* Communiqués */}
        <h2 className="text-2xl font-bold mb-6"
          style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#0a0d2e' }}>
          Communiqués de presse
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
