import { useState } from 'react'

const VALEURS = [
  { emoji: '♥', title: 'Passion', desc: 'Nous vivons pour le frisson de la scène. Chaque sélection est faite avec le cœur, guidée par l\'amour inconditionnel de l\'art.' },
  { emoji: '✦', title: 'Soutien aux Talents', desc: 'Des artistes émergents aux noms établis, nous offrons une visibilité équitable et un tremplin vers leur audience.' },
  { emoji: '◎', title: 'Communauté', desc: 'Ovatio est un cercle. Un lieu d\'échange où spectateurs et créateurs se retrouvent autour d\'une expérience commune.' },
  { emoji: '◈', title: 'Diversité', desc: 'À l\'image de Bruxelles, nous célébrons la pluralité des genres, des origines et des expressions artistiques.' },
]

const TEMOIGNAGES = [
  { quote: 'Ovatio m\'a permis de découvrir des pépites musicales que je n\'aurais jamais trouvées seule. Le site est magnifique et la réservation fluide.', name: 'Sophie M.', role: 'Spectatrice Fidèle' },
  { quote: 'En tant que producteur, travailler avec Ovatio est un plaisir. Ils comprennent les enjeux artistiques et mettent en avant l\'œuvre avant tout.', name: 'Marc L.', role: 'Producteur Indépendant' },
  { quote: 'Leurs curation est toujours juste. On sent une vraie proposition. Une plateforme de confiance.', name: 'Elena R.', role: 'Blogueuse Culture' },
]

export default function AboutPage() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) { setSubscribed(true) }
  }

  return (
    <div style={{ background: '#f7f9fc' }}>

      {/* ── HERO ── */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left */}
          <div className="flex-1">
            <span className="inline-block text-xs font-black uppercase tracking-[0.25em] px-4 py-1.5 rounded-full mb-8"
              style={{ background: '#fdd400', color: '#6f5c00', fontFamily: 'Manrope, sans-serif' }}>
              Notre Manifeste
            </span>
            <h1 className="font-extrabold mb-6 leading-none"
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 'clamp(3rem, 7vw, 5rem)', letterSpacing: '-0.02em', color: '#000666' }}>
              La Scène<br />
              <span style={{ color: '#1a237e' }}>Curatée.</span>
            </h1>
            <p className="text-lg leading-relaxed max-w-lg"
              style={{ color: '#454652', fontFamily: 'Manrope, sans-serif' }}>
              Plus qu'une plateforme de réservation, Ovatio est une fenêtre ouverte sur l'excellence
              culturelle bruxelloise. Nous transformons chaque spectacle en un moment de connexion pure.
            </p>
          </div>
          {/* Right — image */}
          <div className="lg:w-5/12 shrink-0">
            <div className="rounded-3xl overflow-hidden aspect-[4/5]"
              style={{ boxShadow: '0 20px 60px rgba(0,6,102,0.12)' }}>
              <img
                src="https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=700&q=80"
                alt="Artiste"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.parentElement.style.background = 'linear-gradient(135deg, #000666, #1a237e)'
                  e.target.style.display = 'none'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── NOTRE MISSION ── */}
      <section className="py-20 px-6" style={{ background: '#ffffff' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            {/* Left */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-6">
                <div style={{ width: '2.5rem', height: '4px', background: '#fdd400', borderRadius: '2px' }} />
                <h2 className="text-3xl font-extrabold"
                  style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>
                  Notre Mission
                </h2>
              </div>
              <p className="text-base leading-relaxed"
                style={{ color: '#454652', fontFamily: 'Manrope, sans-serif', maxWidth: '480px' }}>
                Depuis notre création, nous nous efforçons de briser les barrières entre les artistes
                et leur public. À Bruxelles, creuset de cultures et de talents, nous avons vu le besoin
                d'un espace qui ne se contente pas de vendre des billets, mais qui raconte des histoires.
              </p>
            </div>
            {/* Right — quote */}
            <div className="lg:w-5/12 shrink-0">
              <blockquote className="p-8 rounded-2xl"
                style={{ background: '#f7f9fc', borderLeft: '4px solid #fdd400' }}>
                <p className="text-lg italic leading-relaxed mb-4"
                  style={{ fontFamily: 'Manrope, sans-serif', color: '#191c1e' }}>
                  "Le spectacle vivant est le dernier rempart de l'émotion partagée. Ovatio en est le gardien."
                </p>
                <footer className="text-sm font-semibold"
                  style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
                  — L'Équipe Ovatio
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* ── NOS VALEURS ── */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-extrabold mb-2"
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>
            Nos Valeurs
          </h2>
          <p className="text-sm mb-12"
            style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
            Les piliers qui soutiennent chaque levée de rideau.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {VALEURS.map((v) => (
              <div key={v.title} className="p-8 rounded-2xl"
                style={{ background: '#ffffff', boxShadow: '0 2px 20px rgba(0,6,102,0.05)' }}>
                <div className="text-2xl mb-4" style={{ color: '#fdd400' }}>{v.emoji}</div>
                <h3 className="text-lg font-bold mb-2"
                  style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>
                  {v.title}
                </h3>
                <p className="text-sm leading-relaxed"
                  style={{ color: '#454652', fontFamily: 'Manrope, sans-serif' }}>
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NOS COUPS DE CŒUR ── */}
      <section className="py-20 px-6"
        style={{ background: 'linear-gradient(135deg, #000666 0%, #1a237e 100%)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            {/* Left text */}
            <div className="lg:w-5/12">
              <p className="text-xs font-black uppercase tracking-[0.25em] mb-4"
                style={{ color: '#fdd400', fontFamily: 'Manrope, sans-serif' }}>
                Sélection éditoriale
              </p>
              <h2 className="text-4xl font-extrabold text-white mb-4"
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', letterSpacing: '-0.02em' }}>
                Nos Coups de Cœur
              </h2>
              <p className="text-base mb-8"
                style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Manrope, sans-serif' }}>
                Une sélection subjective mais exigeante. Ce qui nous a fait vibrer ces derniers mois
                sur les planches bruxelloises.
              </p>
              <a href="/shows"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
                style={{ background: '#fdd400', color: '#6f5c00', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                Découvrir la sélection
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
            {/* Right — show cards */}
            <div className="flex-1 grid grid-cols-2 gap-4">
              {[
                { title: "L'Éveil des Sens", venue: 'Théâtre National · Danse', img: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434?w=400&q=80' },
                { title: 'Néon Midnight', venue: 'Ancienne Belgique · Concert', img: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=80' },
              ].map((s) => (
                <div key={s.title} className="rounded-2xl overflow-hidden"
                  style={{ aspectRatio: '3/4' }}>
                  <div className="relative w-full h-full">
                    <img src={s.img} alt={s.title} className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.parentElement.style.background = 'rgba(255,255,255,0.1)'
                        e.target.style.display = 'none'
                      }} />
                    <div className="absolute inset-0"
                      style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)' }} />
                    <div className="absolute bottom-0 left-0 p-4">
                      <p className="text-white font-bold text-sm"
                        style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                        {s.title}
                      </p>
                      <p className="text-xs mt-0.5"
                        style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Manrope, sans-serif' }}>
                        {s.venue}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TÉMOIGNAGES ── */}
      <section className="py-20 px-6" style={{ background: '#ffffff' }}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center mb-12"
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>
            Ils ont vécu l'expérience
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TEMOIGNAGES.map((t) => (
              <div key={t.name} className="p-6 rounded-2xl"
                style={{ background: '#f7f9fc', boxShadow: '0 2px 20px rgba(0,6,102,0.04)' }}>
                <div className="text-3xl mb-4" style={{ color: '#fdd400' }}>"</div>
                <p className="text-sm leading-relaxed mb-6"
                  style={{ color: '#454652', fontFamily: 'Manrope, sans-serif' }}>
                  {t.quote}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ background: 'linear-gradient(135deg, #000666, #1a237e)' }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold"
                      style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>
                      {t.name}
                    </p>
                    <p className="text-xs uppercase tracking-wider"
                      style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="py-20 px-6">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold mb-3"
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e', letterSpacing: '-0.02em' }}>
            Restez dans la lumière.
          </h2>
          <p className="text-sm mb-8"
            style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
            Inscrivez-vous pour recevoir nos coups de cœur et les avant-premières de la scène bruxelloise.
          </p>
          {subscribed ? (
            <p className="text-sm font-semibold" style={{ color: '#000666', fontFamily: 'Manrope, sans-serif' }}>
              ✓ Merci ! Vous recevrez nos prochaines sélections.
            </p>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-3 max-w-sm mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                className="flex-1 py-3 px-4 rounded-xl text-sm outline-none"
                style={{
                  background: '#ffffff',
                  border: 'none',
                  boxShadow: '0 2px 20px rgba(0,6,102,0.08)',
                  fontFamily: 'Manrope, sans-serif',
                  color: '#191c1e',
                }}
              />
              <button type="submit"
                className="px-5 py-3 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-opacity shrink-0"
                style={{ background: 'linear-gradient(135deg, #000666, #1a237e)', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                S'abonner
              </button>
            </form>
          )}
        </div>
      </section>

    </div>
  )
}
