import { useLanguage } from '../contexts/LanguageContext'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function AboutPage() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <div style={{ background: '#f7f9fc', minHeight: '100vh', fontFamily: 'Manrope, sans-serif' }}>

      {/* Hero Section - Inspired by Eventbrite */}
      <div className="py-20 px-4 text-center text-white"
        style={{ background: 'linear-gradient(135deg, #000666 0%, #1a237e 100%)' }}>
        <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
          Apportez le spectacle à la vie
        </h1>
        <p className="max-w-3xl mx-auto text-xl mb-8" style={{ color: 'rgba(255,255,255,0.95)', lineHeight: 1.8 }}>
          Standing Ovation connecte les artistes, les producteurs et le public pour créer des moments mémorables sur scène.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-20 space-y-20">

        {/* Key Metrics Section - Like Eventbrite "2024 at a Glance" */}
        <div className="rounded-3xl p-12" style={{ background: '#ffffff', boxShadow: '0px 20px 40px rgba(25, 28, 30, 0.06)' }}>
          <h2 className="text-3xl font-bold text-center mb-12" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>
            Standing Ovation 2024
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: 'theater_comedy', label: 'Spectacles', value: '500+', color: '#000666' },
              { icon: 'people', label: 'Spectateurs', value: '50K+', color: '#1a237e' },
              { icon: 'location_on', label: 'Lieux', value: '40+', color: '#4051b5' },
              { icon: 'event_available', label: 'Billets Vendus', value: '100K+', color: '#7986cb' },
            ].map(({ icon, label, value, color }) => (
              <div key={label} className="text-center">
                <span className="material-symbols-outlined block text-6xl mb-4" style={{ color }}>{icon}</span>
                <p className="text-sm font-semibold mb-2" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>{label}</p>
                <p className="text-4xl font-bold" style={{ color: '#000666', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Cards - Like Eventbrite "Host/Discover/Join" */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-12" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>
            Rejoignez l'aventure
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Découvrir Card - Always visible */}
            <div className="rounded-2xl p-8" style={{ background: '#ffffff', boxShadow: '0px 20px 40px rgba(25, 28, 30, 0.06)' }}>
              <span className="material-symbols-outlined block text-5xl mb-4" style={{ color: '#000666' }}>person_add</span>
              <h3 className="text-xl font-bold mb-3" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>Découvrir</h3>
              <p className="text-sm mb-6" style={{ color: '#454652', lineHeight: 1.8 }}>Explorez les meilleurs spectacles de Bruxelles et réservez en quelques clics.</p>
              <a href="/shows" className="inline-block px-6 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80 text-white"
                style={{ background: '#000666', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                Voir les spectacles →
              </a>
            </div>

            {/* Partager Card - Only if authenticated */}
            <div className="rounded-2xl p-8" style={{ background: '#ffffff', boxShadow: '0px 20px 40px rgba(25, 28, 30, 0.06)', opacity: user ? 1 : 0.6 }}>
              <span className="material-symbols-outlined block text-5xl mb-4" style={{ color: '#1a237e' }}>stage</span>
              <h3 className="text-xl font-bold mb-3" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>Partager</h3>
              <p className="text-sm mb-6" style={{ color: '#454652', lineHeight: 1.8 }}>Vous êtes artiste ou producteur ? Partagez vos spectacles avec le public bruxellois.</p>
              <button
                onClick={() => user ? navigate('/become-producer') : navigate('/login')}
                className="inline-block px-6 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80 text-white cursor-pointer"
                style={{ background: '#1a237e', fontFamily: '"Plus Jakarta Sans", sans-serif', border: 'none' }}>
                {user ? 'Devenir producteur' : 'Se connecter'} →
              </button>
              {!user && <p className="text-xs mt-2" style={{ color: '#767683' }}>Connectez-vous pour continuer</p>}
            </div>

            {/* Collaborer Card - Always visible */}
            <div className="rounded-2xl p-8" style={{ background: '#ffffff', boxShadow: '0px 20px 40px rgba(25, 28, 30, 0.06)' }}>
              <span className="material-symbols-outlined block text-5xl mb-4" style={{ color: '#4051b5' }}>business_center</span>
              <h3 className="text-xl font-bold mb-3" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>Collaborer</h3>
              <p className="text-sm mb-6" style={{ color: '#454652', lineHeight: 1.8 }}>Vous êtes un lieu de spectacle ? Partenariez avec Standing Ovation.</p>
              <a href="/contact" className="inline-block px-6 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80 text-white"
                style={{ background: '#4051b5', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                Nous contacter →
              </a>
            </div>
          </div>
        </div>

        {/* Iconic Venues - Visual Cards */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-12" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>
            Les plus beaux lieux de Bruxelles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                icon: 'castle',
                name: 'Théâtre Royal de la Monnaie',
                desc: 'Opéra et danse prestigieux depuis 1819',
                genres: ['Opéra', 'Danse', 'Classique']
              },
              {
                icon: 'museum',
                name: 'Palais des Beaux-Arts (BOZAR)',
                desc: 'Concerts et spectacles d\'exception',
                genres: ['Concerts', 'Théâtre', 'Danse']
              },
              {
                icon: 'theater_comedy',
                name: 'Cirque Royal',
                desc: 'Variété, stand-up, humour et magie',
                genres: ['Stand-up', 'Variété', 'Humour']
              },
              {
                icon: 'stage',
                name: 'Théâtre Le Public',
                desc: 'Théâtre contemporain et expérimental',
                genres: ['Contemporain', 'Expérimental', 'Jeune Public']
              },
            ].map(({ icon, name, desc, genres }) => (
              <div key={name} className="rounded-2xl p-8 flex gap-6" style={{ background: '#ffffff', boxShadow: '0px 20px 40px rgba(25, 28, 30, 0.06)' }}>
                <div>
                  <span className="material-symbols-outlined text-5xl" style={{ color: '#000666' }}>{icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>{name}</h3>
                  <p className="text-sm mb-4" style={{ color: '#454652' }}>{desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {genres.map(genre => (
                      <span key={genre} className="text-xs px-3 py-1 rounded-full"
                        style={{ background: '#f2f4f7', color: '#454652', fontFamily: 'Manrope, sans-serif' }}>
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why Standing Ovation */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-12" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>
            Pourquoi Standing Ovation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: 'lightning_bolt', title: 'Réservation Rapide', desc: 'Billets en main en quelques secondes. Pas d\'attente, pur plaisir.' },
              { icon: 'security', title: '  100% Sécurisé', desc: 'Paiements conformes aux standards internationaux. Vos données protégées.' },
              { icon: 'favorite', title: 'Vos Favorites', desc: 'Créez votre liste de spectacles à ne pas manquer et recevez des alertes.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="rounded-2xl p-8 text-center" style={{ background: '#ffffff', boxShadow: '0px 20px 40px rgba(25, 28, 30, 0.06)' }}>
                <span className="material-symbols-outlined text-5xl block mb-4" style={{ color: '#000666' }}>{icon}</span>
                <h3 className="text-lg font-bold mb-3" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>{title}</h3>
                <p className="text-sm" style={{ color: '#454652', lineHeight: 1.8 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Getting Started */}
        <div className="rounded-3xl p-12 text-center" style={{ background: 'linear-gradient(135deg, #000666 0%, #1a237e 100%)' }}>
          <h2 className="text-3xl font-bold text-white mb-6" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>Commencez maintenant</h2>
          <p className="text-white mb-10 max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', lineHeight: 1.8 }}>
            Rejoignez des milliers de mélomanes et fans de spectacles qui découvrent et réservent sur Standing Ovation chaque jour.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="/register" className="px-8 py-4 rounded-xl font-semibold text-base transition-all hover:scale-105"
              style={{ background: '#fdd400', color: '#000666', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
              S'inscrire gratuitement
            </a>
            <a href="/shows" className="px-8 py-4 rounded-xl font-semibold text-base border-2 text-white transition-all hover:scale-105"
              style={{ borderColor: '#fdd400', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
              Découvrir les spectacles
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="rounded-2xl p-12 text-sm" style={{ background: '#ffffff', boxShadow: '0px 20px 40px rgba(25, 28, 30, 0.06)' }}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="font-bold mb-4 text-base" style={{ color: '#191c1e', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>Utiliser Standing Ovation</h4>
              <ul className="space-y-2 text-xs" style={{ color: '#767683' }}>
                <li><a href="/shows" className="hover:text-blue-600">Tous les spectacles</a></li>
                <li><a href="/reservations" className="hover:text-blue-600">Mes réservations</a></li>
                <li><a href="/account" className="hover:text-blue-600">Mon profil</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-base" style={{ color: '#191c1e', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>Organisateurs</h4>
              <ul className="space-y-2 text-xs" style={{ color: '#767683' }}>
                <li><a href="/become-producer" className="hover:text-blue-600">Devenir producteur</a></li>
                <li><a href="/dashboard" className="hover:text-blue-600">Tableau de bord</a></li>
                <li><a href="/support" className="hover:text-blue-600">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-base" style={{ color: '#191c1e', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>Bruxelles</h4>
              <ul className="space-y-2 text-xs" style={{ color: '#767683' }}>
                <li><a href="/categories/theatre" className="hover:text-blue-600">Théâtre</a></li>
                <li><a href="/categories/musique" className="hover:text-blue-600">Musique</a></li>
                <li><a href="/categories/danse" className="hover:text-blue-600">Danse</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-base" style={{ color: '#191c1e', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>Légal</h4>
              <ul className="space-y-2 text-xs" style={{ color: '#767683' }}>
                <li><a href="/privacy" className="hover:text-blue-600">Confidentialité</a></li>
                <li><a href="/terms" className="hover:text-blue-600">Conditions</a></li>
                <li><a href="/contact" className="hover:text-blue-600">Nous contacter</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-xs" style={{ color: '#767683', borderColor: '#eceef1' }}>
            <p className="mb-2">Standing Ovation SPRL • BE 0123.456.789</p>
            <p>© 2024 Standing Ovation. Tous droits réservés.</p>
          </div>
        </div>

      </div>
    </div>
  )
}
