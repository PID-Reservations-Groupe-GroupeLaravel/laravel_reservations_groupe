import { useState } from 'react'

const PREFERENCES = [
  { id: 'nouveautes',    label: 'Nouvelles programmations',    desc: 'Dès qu\'un spectacle rejoint le catalogue' },
  { id: 'promotions',   label: 'Offres & réductions',         desc: 'Places à tarif réduit et codes promo' },
  { id: 'coulisses',    label: 'Dans les coulisses',           desc: 'Interviews d\'artistes et contenus exclusifs' },
  { id: 'agenda',       label: 'Agenda mensuel',               desc: 'Récapitulatif des spectacles du mois' },
]

export default function NewsletterPage() {
  const [email, setEmail]   = useState('')
  const [prefs, setPrefs]   = useState({ nouveautes: true, promotions: false, coulisses: false, agenda: true })
  const [sent, setSent]     = useState(false)
  const [sending, setSending] = useState(false)
  const [err, setErr]       = useState('')

  const togglePref = (id) => setPrefs(p => ({ ...p, [id]: !p[id] }))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email.includes('@')) { setErr('Adresse e-mail invalide.'); return }
    setSending(true); setErr('')
    setTimeout(() => { setSent(true); setSending(false) }, 800)
  }

  return (
    <div className="min-h-screen" style={{ background: '#f7f9fc' }}>

      <div className="py-16 px-6 text-center"
        style={{ background: 'linear-gradient(135deg, #000666 0%, #1a237e 100%)' }}>
        <p className="text-xs font-bold uppercase tracking-[0.25em] mb-3"
          style={{ color: '#fdd400', fontFamily: 'Manrope, sans-serif' }}>
          Restez informé
        </p>
        <h1 className="text-4xl font-extrabold text-white mb-3"
          style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
          Newsletter Ovatio.be
        </h1>
        <p className="text-sm max-w-xl mx-auto"
          style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Manrope, sans-serif' }}>
          Recevez les meilleures programmations bruxelloises directement dans votre boîte mail. Sans spam, désabonnement en un clic.
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12">

        {sent ? (
          <div className="rounded-2xl p-12 text-center"
            style={{ background: '#fff', boxShadow: '0 4px 24px rgba(0,6,102,0.07)' }}>
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-3"
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>
              Bienvenue dans la communauté !
            </h2>
            <p className="text-sm mb-2"
              style={{ fontFamily: 'Manrope, sans-serif', color: '#767683' }}>
              Votre inscription à la newsletter Ovatio.be a bien été enregistrée.
            </p>
            <p className="text-sm"
              style={{ fontFamily: 'Manrope, sans-serif', color: '#767683' }}>
              Un e-mail de confirmation a été envoyé à <strong style={{ color: '#191c1e' }}>{email}</strong>.
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
                  Adresse e-mail
                </label>
                <input
                  type="email" required value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="vous@exemple.be"
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
                  Je souhaite recevoir
                </p>
                <div className="space-y-3">
                  {PREFERENCES.map(({ id, label, desc }) => (
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
                          {label}
                        </p>
                        <p className="text-xs mt-0.5"
                          style={{ fontFamily: 'Manrope, sans-serif', color: '#767683' }}>
                          {desc}
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
                {sending ? 'Inscription…' : "S'abonner à la newsletter →"}
              </button>

              <p className="text-xs text-center"
                style={{ fontFamily: 'Manrope, sans-serif', color: '#aaa' }}>
                Vos données ne seront jamais partagées. Désabonnement possible à tout moment.
              </p>

            </form>
          </div>
        )}

        {/* Chiffres */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          {[
            { n: '2 400+', label: 'abonnés' },
            { n: '2×/mois', label: 'fréquence' },
            { n: '0 spam', label: 'garanti' },
          ].map(({ n, label }) => (
            <div key={label} className="rounded-2xl p-5 text-center"
              style={{ background: '#fff', boxShadow: '0 2px 12px rgba(0,6,102,0.06)' }}>
              <p className="text-2xl font-extrabold mb-1"
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#000666' }}>{n}</p>
              <p className="text-xs" style={{ fontFamily: 'Manrope, sans-serif', color: '#767683' }}>{label}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
