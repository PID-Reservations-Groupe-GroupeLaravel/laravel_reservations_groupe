export default function AboutPage() {
  return (
    <div style={{ background: '#f7f9fc', minHeight: '100vh', fontFamily: 'Manrope, sans-serif' }}>

      <div className="py-20 px-4 text-center text-white"
        style={{ background: 'linear-gradient(135deg, #000666 0%, #1a237e 100%)' }}>
        <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
          À propos d'Ovatio
        </h1>
        <p className="max-w-xl mx-auto text-base" style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}>
          La plateforme de réservation dédiée aux spectacles vivants en Belgique.
          Connecter les artistes, les producteurs et le public depuis 2024.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">

        <Section icon="theater_comedy" title="Notre Mission"
          content="Ovatio est né de la conviction que le spectacle vivant mérite une vitrine numérique à la hauteur de son art. Nous mettons en relation les compagnies de théâtre, danse et performance avec un public passionné, en simplifiant la découverte et la réservation en ligne." />

        <div className="rounded-2xl p-8" style={{ background: '#ffffff', boxShadow: '0px 20px 40px rgba(25, 28, 30, 0.06)' }}>
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-3xl" style={{ color: '#000666' }}>group</span>
            <h2 className="text-xl font-bold" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>L'Équipe</h2>
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

        <Section icon="build" title="Technologies"
          content="Ovatio est construit avec Laravel 11 (API REST) côté serveur, React 18 + Vite côté client, et une base de données MySQL. L'authentification est gérée par Laravel Sanctum. Le design system suit les principes Material Design 3."
          chips={['Laravel 11', 'React 18', 'Vite', 'Tailwind CSS', 'MySQL', 'Sanctum']} />

        <Section icon="movie" title="Pour les Producteurs"
          content="Les compagnies et producteurs peuvent rejoindre Ovatio en soumettant une demande. Une fois approuvés, ils accèdent à un tableau de bord pour publier leurs spectacles, gérer les représentations et suivre les réservations en temps réel." />

        <div className="rounded-2xl p-8" style={{ background: '#ffffff', boxShadow: '0px 20px 40px rgba(25, 28, 30, 0.06)' }}>
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-3xl" style={{ color: '#000666' }}>gavel</span>
            <h2 className="text-xl font-bold" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>Mentions Légales</h2>
          </div>
          <div className="space-y-3 text-sm" style={{ color: '#454652', lineHeight: 1.7 }}>
            <p><strong>Éditeur :</strong> Ovatio SPRL — BE 0123.456.789</p>
            <p><strong>Siège social :</strong> Rue de la Culture 42, 1000 Bruxelles, Belgique</p>
            <p><strong>Email :</strong> contact@ovatio.be</p>
            <p><strong>Hébergement :</strong> OVH SAS, 2 rue Kellermann, 59100 Roubaix, France</p>
            <p><strong>Responsable de publication :</strong> Soufiane & Salim — Étudiants PID 2024-2025</p>
          </div>
        </div>

        <Section icon="privacy_tip" title="Politique de Confidentialité"
          content="Vos données personnelles (nom, email, historique de réservations) sont conservées de façon sécurisée et ne sont jamais partagées avec des tiers. Conformément au RGPD, vous pouvez demander la suppression de votre compte en contactant contact@ovatio.be. Les cookies utilisés sont strictement fonctionnels." />

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