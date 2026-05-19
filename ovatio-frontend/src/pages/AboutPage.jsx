import { useLanguage } from '../contexts/LanguageContext'

export default function AboutPage() {
  const { t } = useLanguage()

  return (
    <div style={{ background: '#f7f9fc', minHeight: '100vh', fontFamily: 'Manrope, sans-serif' }}>

      {/* Hero Section */}
      <div className="py-24 px-4 text-center text-white"
        style={{ background: 'linear-gradient(135deg, #000666 0%, #1a237e 100%)' }}>
        <h1 className="text-5xl font-bold mb-6" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
          Découvrez la Culture à Bruxelles
        </h1>
        <p className="max-w-2xl mx-auto text-lg mb-2" style={{ color: 'rgba(255,255,255,0.9)', lineHeight: 1.8 }}>
          Standing Ovation simplifie votre accès aux meilleurs spectacles vivants de Bruxelles.
        </p>
        <p className="max-w-2xl mx-auto text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
          Réservation en ligne facile • Programmation diversifiée • Une seule plateforme pour tous les spectacles
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16 space-y-16">

        {/* Why Standing Ovation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: 'search', title: 'Découverte Simple', desc: 'Trouvez vos spectacles préférés en quelques clics. Filtrez par genre, date ou lieu.' },
            { icon: 'check_circle', title: 'Réservation Rapide', desc: 'Achetez vos billets en ligne de façon sécurisée. Plus besoin de files d\'attente.' },
            { icon: 'favorite', title: 'Votre Sélection', desc: 'Sauvegardez vos spectacles favoris et recevez des recommandations personnalisées.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="rounded-2xl p-8 text-center" style={{ background: '#ffffff', boxShadow: '0px 20px 40px rgba(25, 28, 30, 0.06)' }}>
              <div className="flex justify-center mb-4">
                <span className="material-symbols-outlined text-5xl" style={{ color: '#000666' }}>{icon}</span>
              </div>
              <h3 className="text-lg font-bold mb-3" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>{title}</h3>
              <p className="text-sm" style={{ color: '#454652', lineHeight: 1.8 }}>{desc}</p>
            </div>
          ))}
        </div>

        {/* Comment ça marche */}
        <div className="rounded-2xl p-12" style={{ background: '#ffffff', boxShadow: '0px 20px 40px rgba(25, 28, 30, 0.06)' }}>
          <h2 className="text-2xl font-bold text-center mb-12" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>Comment ça marche</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { num: '1', title: 'Inscrivez-vous', desc: 'Créez votre compte gratuitement en quelques secondes.' },
              { num: '2', title: 'Explorez', desc: 'Parcourez notre programmation de spectacles à Bruxelles.' },
              { num: '3', title: 'Réservez', desc: 'Choisissez vos places et complétez votre achat.' },
              { num: '4', title: 'Profitez', desc: 'Consultez vos billets et profitez du spectacle !' },
            ].map(({ num, title, desc }) => (
              <div key={num} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white mb-4"
                  style={{ background: 'linear-gradient(135deg, #000666, #1a237e)' }}>
                  {num}
                </div>
                <h3 className="font-semibold mb-2" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>{title}</h3>
                <p className="text-xs" style={{ color: '#767683' }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bruxelles Culturelle */}
        <div className="rounded-2xl p-12" style={{ background: '#ffffff', boxShadow: '0px 20px 40px rgba(25, 28, 30, 0.06)' }}>
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-4xl" style={{ color: '#000666' }}>location_on</span>
            <div>
              <h2 className="text-2xl font-bold" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>Bruxelles, capitale de la culture</h2>
              <p className="text-sm mt-1" style={{ color: '#767683' }}>Une scène vivante et diversifiée qui ne cesse de surprendre</p>
            </div>
          </div>
          <p className="text-sm mb-8" style={{ color: '#454652', lineHeight: 1.9 }}>
            Bruxelles vibre au rythme de ses spectacles : théâtre d'avant-garde, productions musicales de prestige, danse contemporaine et comédies entraînantes. La capitale belge accueille chaque année des centaines de représentations dans ses plus beaux lieux culturels. Standing Ovation vous ouvre les portes de cette scène riche et dynamique.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: 'theater_comedy', name: 'Théâtres', count: '20+', desc: 'Scènes de qualité pour le théâtre, stand-up et performances' },
              { icon: 'music_note', name: 'Concerts', count: '100+', desc: 'Musique classique, jazz, rock et découvertes' },
              { icon: 'dance', name: 'Danse', count: '30+', desc: 'Danse contemporaine et classique toute l\'année' },
              { icon: 'event', name: 'Festivals', count: '15+', desc: 'Événements saisonniers et festivals majeurs' },
            ].map(({ icon, name, count, desc }) => (
              <div key={name} className="flex gap-4 p-6 rounded-xl" style={{ background: '#f7f9fc' }}>
                <span className="material-symbols-outlined text-3xl shrink-0" style={{ color: '#000666' }}>{icon}</span>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 mb-1">
                    <h3 className="font-bold" style={{ color: '#191c1e', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>{name}</h3>
                    <span className="text-lg font-bold" style={{ color: '#000666' }}>{count}</span>
                  </div>
                  <p className="text-xs" style={{ color: '#767683' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust & Security */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: 'security', title: 'Paiement Sécurisé', desc: 'Vos données de paiement sont protégées par les standards internationaux les plus stricts.' },
            { icon: 'lock', title: 'Données Protégées', desc: 'Conformes au RGPD. Vos informations ne sont jamais partagées avec des tiers.' },
            { icon: 'verified_user', title: 'Billets Garantis', desc: 'Vos billets sont confirmés et utilisables immédiatement après achat.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="rounded-2xl p-8 text-center" style={{ background: '#ffffff', boxShadow: '0px 20px 40px rgba(25, 28, 30, 0.06)' }}>
              <span className="material-symbols-outlined text-4xl block mb-4" style={{ color: '#000666' }}>{icon}</span>
              <h3 className="text-lg font-bold mb-3" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>{title}</h3>
              <p className="text-sm" style={{ color: '#454652', lineHeight: 1.8 }}>{desc}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="rounded-2xl p-12 text-center" style={{ background: 'linear-gradient(135deg, #000666 0%, #1a237e 100%)' }}>
          <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>Prêt à réserver ?</h2>
          <p className="text-white mb-8 max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.9)' }}>
            Rejoignez des milliers de spectateurs qui réservent déjà leurs billets sur Standing Ovation.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="/shows" className="px-8 py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-90"
              style={{ background: '#fdd400', color: '#000666', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
              Voir les spectacles
            </a>
            <a href="/register" className="px-8 py-3 rounded-xl font-semibold text-sm border-2 text-white transition-opacity hover:opacity-90"
              style={{ borderColor: 'rgba(255,255,255,0.3)', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
              S'inscrire gratuitement
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="rounded-2xl p-8 text-sm" style={{ background: '#ffffff', boxShadow: '0px 20px 40px rgba(25, 28, 30, 0.06)' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4" style={{ color: '#191c1e', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>À propos</h3>
              <p style={{ color: '#767683', lineHeight: 1.8 }}>Standing Ovation simplifie la réservation de spectacles à Bruxelles. Une seule plateforme pour tous les événements culturels.</p>
            </div>
            <div>
              <h3 className="font-bold mb-4" style={{ color: '#191c1e', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>Contact</h3>
              <p style={{ color: '#767683' }}><strong>Email :</strong> contact@standing-ovation.be</p>
              <p style={{ color: '#767683' }}><strong>Adresse :</strong> Bruxelles, Belgique</p>
            </div>
            <div>
              <h3 className="font-bold mb-4" style={{ color: '#191c1e', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>Légal</h3>
              <p style={{ color: '#767683' }}>Standing Ovation SPRL — BE 0123.456.789</p>
              <p style={{ color: '#767683' }}>Hébergement : OVH SAS, France</p>
            </div>
          </div>
          <div className="border-t pt-6" style={{ borderColor: '#eceef1' }}>
            <p className="text-center text-xs" style={{ color: '#767683' }}>
              © 2024 Standing Ovation. Tous droits réservés. | Conformément au RGPD, vous pouvez demander la suppression de votre compte en contactant contact@standing-ovation.be.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
