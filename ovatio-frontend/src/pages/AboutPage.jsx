import { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { useNavigate } from 'react-router-dom'
import axios from '../api/axios'

export default function AboutPage() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [featuredShows, setFeaturedShows] = useState([])

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


        {/* Iconic Venues - Visual Cards with Better Icons */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-12" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>
            Les plus beaux lieux de Bruxelles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                emoji: '🏰',
                name: 'Théâtre Royal de la Monnaie',
                desc: 'Opéra et danse prestigieux depuis 1819',
                genres: ['Opéra', 'Danse', 'Classique']
              },
              {
                emoji: '🎨',
                name: 'Palais des Beaux-Arts (BOZAR)',
                desc: 'Concerts et spectacles d\'exception',
                genres: ['Concerts', 'Théâtre', 'Danse']
              },
              {
                emoji: '🎪',
                name: 'Cirque Royal',
                desc: 'Variété, stand-up, humour et magie',
                genres: ['Stand-up', 'Variété', 'Humour']
              },
              {
                emoji: '🎭',
                name: 'Théâtre Le Public',
                desc: 'Théâtre contemporain et expérimental',
                genres: ['Contemporain', 'Expérimental', 'Jeune Public']
              },
            ].map(({ emoji, name, desc, genres }) => (
              <div key={name} className="rounded-2xl p-8 flex gap-6" style={{ background: '#ffffff', boxShadow: '0px 20px 40px rgba(25, 28, 30, 0.06)' }}>
                <div className="text-4xl">{emoji}</div>
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

        {/* Featured Shows Section */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-12" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>
            Spectacles en Vedette
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'La Reine des Neiges',
                venue: 'Théâtre Royal de la Monnaie',
                date: '15 juin 2024',
                genre: 'Opéra'
              },
              {
                title: 'Rhythm & Blues Night',
                venue: 'Palais des Beaux-Arts',
                date: '22 juin 2024',
                genre: 'Concerts'
              },
              {
                title: 'Cirque du Soleil',
                venue: 'Cirque Royal',
                date: '30 juin 2024',
                genre: 'Cirque'
              },
            ].map(({ title, venue, date, genre }) => (
              <div key={title} className="rounded-2xl p-8 border-l-4" style={{ background: '#ffffff', boxShadow: '0px 20px 40px rgba(25, 28, 30, 0.06)', borderLeftColor: '#000666' }}>
                <h3 className="text-lg font-bold mb-2" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>{title}</h3>
                <p className="text-sm mb-3" style={{ color: '#454652' }}>
                  <span style={{ fontWeight: 'bold' }}>📍</span> {venue}
                </p>
                <p className="text-sm mb-4" style={{ color: '#454652' }}>
                  <span style={{ fontWeight: 'bold' }}>📅</span> {date}
                </p>
                <span className="text-xs px-3 py-1 rounded-full"
                  style={{ background: '#f2f4f7', color: '#454652', fontFamily: 'Manrope, sans-serif' }}>
                  {genre}
                </span>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <a href="/shows" className="px-8 py-3 rounded-xl font-semibold text-base transition-all hover:scale-105 text-white"
              style={{ background: '#000666', fontFamily: '"Plus Jakarta Sans", sans-serif', display: 'inline-block' }}>
              Voir tous les spectacles →
            </a>
          </div>
        </div>

        {/* Why Standing Ovation */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-12" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>
            Pourquoi Standing Ovation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { emoji: '⚡', title: 'Réservation Rapide', desc: 'Billets en main en quelques secondes. Pas d\'attente, pur plaisir.' },
              { emoji: '🔒', title: '100% Sécurisé', desc: 'Paiements conformes aux standards internationaux. Vos données protégées.' },
              { emoji: '❤️', title: 'Vos Favorites', desc: 'Créez votre liste de spectacles à ne pas manquer et recevez des alertes.' },
            ].map(({ emoji, title, desc }) => (
              <div key={title} className="rounded-2xl p-8 text-center" style={{ background: '#ffffff', boxShadow: '0px 20px 40px rgba(25, 28, 30, 0.06)' }}>
                <div className="text-5xl mb-4">{emoji}</div>
                <h3 className="text-lg font-bold mb-3" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>{title}</h3>
                <p className="text-sm" style={{ color: '#454652', lineHeight: 1.8 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Getting Started CTA */}
        <div className="rounded-3xl p-12 text-center" style={{ background: 'linear-gradient(135deg, #000666 0%, #1a237e 100%)' }}>
          <h2 className="text-3xl font-bold text-white mb-6" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>Commencez maintenant</h2>
          <p className="text-white mb-8 max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', lineHeight: 1.8 }}>
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

      </div>

      {/* FOOTER - Separate at the bottom */}
      <footer style={{ background: '#1a1f3a', color: '#fff', marginTop: '6rem', paddingTop: '4rem', paddingBottom: '2rem' }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-sm">
            <div>
              <h4 className="font-bold mb-4 text-base" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>Utiliser Standing Ovation</h4>
              <ul className="space-y-2 text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
                <li><a href="/shows" className="hover:text-white transition-colors">Tous les spectacles</a></li>
                <li><a href="/reservations" className="hover:text-white transition-colors">Mes réservations</a></li>
                <li><a href="/account" className="hover:text-white transition-colors">Mon profil</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-base" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>Organisateurs</h4>
              <ul className="space-y-2 text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
                <li><a href="/become-producer" className="hover:text-white transition-colors">Devenir producteur</a></li>
                <li><a href="/dashboard" className="hover:text-white transition-colors">Tableau de bord</a></li>
                <li><a href="/support" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-base" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>Bruxelles</h4>
              <ul className="space-y-2 text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
                <li><a href="/categories/theatre" className="hover:text-white transition-colors">Théâtre</a></li>
                <li><a href="/categories/musique" className="hover:text-white transition-colors">Musique</a></li>
                <li><a href="/categories/danse" className="hover:text-white transition-colors">Danse</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-base" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>Légal</h4>
              <ul className="space-y-2 text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
                <li><a href="/privacy" className="hover:text-white transition-colors">Confidentialité</a></li>
                <li><a href="/terms" className="hover:text-white transition-colors">Conditions</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Nous contacter</a></li>
              </ul>
            </div>
          </div>

          <div className="text-center text-xs border-t pt-8" style={{ color: 'rgba(255,255,255,0.6)', borderTopColor: 'rgba(255,255,255,0.2)' }}>
            <p className="mb-2">Standing Ovation SPRL • BE 0123.456.789</p>
            <p>© 2024 Standing Ovation. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
