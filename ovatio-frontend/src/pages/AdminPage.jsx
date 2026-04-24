import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../api/axios'

const styleTab = (active) => ({
  background: active ? '#000666' : '#f2f4f7',
  color: active ? '#ffffff' : '#454652',
  fontFamily: 'Manrope, sans-serif',
  fontWeight: 600,
  padding: '0.5rem 1.25rem',
  borderRadius: '0.625rem',
  fontSize: '0.875rem',
  border: 'none',
  cursor: 'pointer',
})

export default function AdminPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const isAdmin    = user?.roles?.includes('admin')
  const isProducer = user?.roles?.includes('producer')

  const defaultTab = isAdmin ? 'demandes' : 'avis'
  const [tab, setTab] = useState(defaultTab)

  useEffect(() => {
    if (user && !isAdmin && !isProducer) navigate('/')
  }, [user, isAdmin, isProducer, navigate])

  if (!user) return null

  return (
    <div style={{ background: '#f7f9fc', minHeight: '100vh' }}>
      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="rounded-2xl p-8 mb-8 text-white"
          style={{ background: 'linear-gradient(135deg, #000666 0%, #1a237e 100%)' }}>
          <h1 className="text-3xl font-bold mb-1"
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            {isAdmin ? 'Administration' : 'Tableau producteur'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'Manrope, sans-serif', fontSize: '0.875rem' }}>
            {isAdmin
              ? 'Gérez les demandes producteurs et les membres de la plateforme.'
              : 'Modérez les avis laissés sur vos spectacles.'}
          </p>
        </div>

        {/* Onglets */}
        <div className="flex flex-wrap gap-2 mb-8">
          {isAdmin && (
            <>
              <button style={styleTab(tab === 'demandes')} onClick={() => setTab('demandes')}>
                Demandes producteurs
              </button>
              <button style={styleTab(tab === 'membres')} onClick={() => setTab('membres')}>
                Membres
              </button>
            </>
          )}
          {isProducer && (
            <button style={styleTab(tab === 'avis')} onClick={() => setTab('avis')}>
              Modération des avis
            </button>
          )}
        </div>

        {/* Contenu */}
        {tab === 'demandes' && isAdmin && <DemandesTab />}
        {tab === 'membres'  && isAdmin && <MembresTab />}
        {tab === 'avis'     && isProducer && <AvisTab />}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   ONGLET DEMANDES PRODUCTEURS
═══════════════════════════════════════════════════════ */
function DemandesTab() {
  const [demandes, setDemandes]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')
  const [filter, setFilter]       = useState('pending')
  const [rejectId, setRejectId]   = useState(null)
  const [reason, setReason]       = useState('')
  const [reasonErr, setReasonErr] = useState('')

  useEffect(() => {
    api.get('/admin/demandes')
      .then(res => setDemandes(res.data))
      .catch(() => setError('Impossible de charger les demandes.'))
      .finally(() => setLoading(false))
  }, [])

  const handleApprove = async (id) => {
    try {
      await api.post(`/admin/demandes/${id}/approve`)
      setDemandes(prev => prev.map(d => d.id === id ? { ...d, status: 'approved' } : d))
    } catch { alert("Erreur lors de l'approbation.") }
  }

  const handleRejectSubmit = async () => {
    if (!reason.trim() || reason.trim().length < 10) {
      setReasonErr('Le motif doit faire au moins 10 caractères.')
      return
    }
    try {
      await api.post(`/admin/demandes/${rejectId}/reject`, { reason })
      setDemandes(prev => prev.map(d => d.id === rejectId ? { ...d, status: 'rejected', rejection_reason: reason } : d))
      setRejectId(null)
      setReason('')
      setReasonErr('')
    } catch (err) {
      setReasonErr(err.response?.data?.errors?.reason?.[0] ?? 'Erreur.')
    }
  }

  if (loading) return <Spinner />
  if (error)   return <ErrorMsg msg={error} />

  const filtered = demandes.filter(d => filter === 'all' ? true : d.status === filter)

  return (
    <>
      {/* Filtres */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { key: 'pending',  label: 'En attente', color: '#f57f17', bg: '#fff8e1' },
          { key: 'approved', label: 'Approuvées', color: '#2e7d32', bg: '#e8f5e9' },
          { key: 'rejected', label: 'Refusées',   color: '#c62828', bg: '#ffebee' },
          { key: 'all',      label: 'Toutes',     color: '#454652', bg: '#f2f4f7' },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className="text-xs font-bold px-4 py-2 rounded-full"
            style={{
              background: filter === f.key ? f.bg : '#f2f4f7',
              color: filter === f.key ? f.color : '#767683',
              border: filter === f.key ? `1px solid ${f.color}40` : '1px solid transparent',
              fontFamily: 'Manrope, sans-serif', cursor: 'pointer',
            }}>
            {f.label}
            <span className="ml-2 font-black">
              {f.key === 'all' ? demandes.length : demandes.filter(d => d.status === f.key).length}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 rounded-2xl"
          style={{ background: '#fff', color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
          Aucune demande dans cette catégorie.
        </div>
      )}

      <div className="space-y-4">
        {filtered.map((d) => (
          <div key={d.id} className="rounded-2xl p-6"
            style={{ background: '#fff', boxShadow: '0 4px 24px rgba(0,6,102,0.07)' }}>

            {/* En-tête */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white shrink-0"
                  style={{ background: 'linear-gradient(135deg, #000666, #1a237e)' }}>
                  {(d.company_name ?? 'C')[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-base"
                    style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>
                    {d.company_name}
                  </h3>
                  <p className="text-xs mt-0.5" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
                    {d.user_name} · {d.user_email} · {d.created_at}
                  </p>
                </div>
              </div>
              <StatusBadge status={d.status} />
            </div>

            {/* Description */}
            <p className="text-sm mb-4 leading-relaxed"
              style={{ color: '#454652', fontFamily: 'Manrope, sans-serif', lineHeight: 1.7 }}>
              {d.description}
            </p>

            {/* Infos complémentaires */}
            <div className="flex flex-wrap gap-4 mb-4">
              {d.siret && (
                <span className="text-xs px-3 py-1 rounded-full"
                  style={{ background: '#f2f4f7', color: '#454652', fontFamily: 'Manrope, sans-serif' }}>
                  BCE/SIRET : {d.siret}
                </span>
              )}
              {d.website && (
                <a href={d.website} target="_blank" rel="noreferrer"
                  className="text-xs px-3 py-1 rounded-full hover:opacity-80 transition-opacity"
                  style={{ background: '#f2f4f7', color: '#000666', fontFamily: 'Manrope, sans-serif' }}>
                  {d.website}
                </a>
              )}
              {d.phone && (
                <span className="text-xs px-3 py-1 rounded-full"
                  style={{ background: '#f2f4f7', color: '#454652', fontFamily: 'Manrope, sans-serif' }}>
                  {d.phone}
                </span>
              )}
            </div>

            {/* Motif de refus si rejeté */}
            {d.status === 'rejected' && d.rejection_reason && (
              <div className="rounded-xl px-4 py-3 mb-4 text-sm"
                style={{ background: '#fff0f0', color: '#c62828', fontFamily: 'Manrope, sans-serif', borderLeft: '3px solid #c62828' }}>
                <strong>Motif de refus :</strong> {d.rejection_reason}
              </div>
            )}

            {/* Actions — seulement si pending */}
            {d.status === 'pending' && (
              <div className="flex gap-3">
                <button onClick={() => handleApprove(d.id)}
                  className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl"
                  style={{ background: '#000666', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }}>
                  ✓ Approuver
                </button>
                <button onClick={() => { setRejectId(d.id); setReason(''); setReasonErr('') }}
                  className="flex items-center gap-2 text-sm px-5 py-2.5 rounded-xl"
                  style={{ background: '#ffdad6', color: '#93000a', border: 'none', cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }}>
                  ✕ Refuser
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal motif de refus */}
      {rejectId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div className="rounded-2xl p-8 w-full max-w-md"
            style={{ background: '#fff', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}>
            <h3 className="text-lg font-bold mb-2"
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>
              Motif de refus
            </h3>
            <p className="text-sm mb-4" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
              Expliquez au demandeur pourquoi sa demande a été refusée. Ce message lui sera communiqué.
            </p>
            <textarea
              value={reason}
              onChange={e => { setReason(e.target.value); setReasonErr('') }}
              placeholder="Ex : Le dossier est incomplet, merci de fournir un numéro BCE valide..."
              rows={4}
              className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none mb-1"
              style={{ background: '#f2f4f7', border: reasonErr ? '1px solid #c62828' : 'none', fontFamily: 'Manrope, sans-serif', color: '#191c1e' }}
            />
            {reasonErr && (
              <p className="text-xs mb-3" style={{ color: '#c62828', fontFamily: 'Manrope, sans-serif' }}>{reasonErr}</p>
            )}
            <div className="flex gap-3 mt-4">
              <button onClick={handleRejectSubmit}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-white"
                style={{ background: '#c62828', border: 'none', cursor: 'pointer', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
                Confirmer le refus
              </button>
              <button onClick={() => setRejectId(null)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold"
                style={{ background: '#f2f4f7', color: '#454652', border: 'none', cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/* ═══════════════════════════════════════════════════════
   ONGLET MEMBRES
═══════════════════════════════════════════════════════ */
function MembresTab() {
  const [members, setMembers]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [search, setSearch]     = useState('')

  useEffect(() => {
    api.get('/admin/members')
      .then(res => setMembers(res.data))
      .catch(() => setError('Impossible de charger les membres.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />
  if (error)   return <ErrorMsg msg={error} />

  const filtered = members.filter(m =>
    (m.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (m.email ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (m.login ?? '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      {/* Barre de recherche */}
      <div className="mb-6 flex items-center gap-3 rounded-xl px-4 py-3"
        style={{ background: '#fff', boxShadow: '0 2px 12px rgba(0,6,102,0.06)' }}>
        <span style={{ color: '#767683', fontSize: '1rem' }}>🔍</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un membre..."
          className="flex-1 outline-none text-sm bg-transparent"
          style={{ fontFamily: 'Manrope, sans-serif', color: '#191c1e' }}
        />
        {search && (
          <button onClick={() => setSearch('')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#767683', fontSize: '1rem' }}>
            ×
          </button>
        )}
      </div>

      <div className="rounded-2xl overflow-hidden"
        style={{ background: '#fff', boxShadow: '0 4px 24px rgba(0,6,102,0.07)' }}>
        {/* Header tableau */}
        <div className="grid grid-cols-12 px-6 py-3 text-xs font-black uppercase tracking-widest"
          style={{ background: '#f7f9fc', color: '#767683', fontFamily: 'Manrope, sans-serif', borderBottom: '1px solid #eceef1' }}>
          <span className="col-span-4">Membre</span>
          <span className="col-span-3">Login</span>
          <span className="col-span-3">Rôles</span>
          <span className="col-span-2 text-right">Inscrit</span>
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
            Aucun membre trouvé.
          </div>
        )}

        {filtered.map((m, i) => (
          <div key={m.id}
            className="grid grid-cols-12 px-6 py-4 items-center"
            style={{
              borderBottom: i < filtered.length - 1 ? '1px solid #f2f4f7' : 'none',
            }}>
            {/* Nom + email */}
            <div className="col-span-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                style={{ background: 'linear-gradient(135deg, #000666, #1a237e)' }}>
                {(m.name ?? 'U')[0].toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold"
                  style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>
                  {m.name}
                </p>
                <p className="text-xs" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>{m.email}</p>
              </div>
            </div>

            {/* Login */}
            <div className="col-span-3">
              <code className="text-xs px-2 py-1 rounded-lg"
                style={{ background: '#f2f4f7', color: '#454652', fontFamily: 'monospace' }}>
                {m.login}
              </code>
            </div>

            {/* Rôles */}
            <div className="col-span-3 flex flex-wrap gap-1">
              {(m.roles ?? []).map(role => (
                <span key={role}
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{
                    background: role === 'admin' ? '#fdd400' : role === 'producer' ? '#e8f5e9' : '#f2f4f7',
                    color: role === 'admin' ? '#6f5c00' : role === 'producer' ? '#2e7d32' : '#454652',
                    fontFamily: 'Manrope, sans-serif',
                  }}>
                  {role}
                </span>
              ))}
            </div>

            {/* Date */}
            <div className="col-span-2 text-right text-xs" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
              {m.created_at}
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs mt-3 text-right" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
        {filtered.length} membre{filtered.length > 1 ? 's' : ''}
        {search ? ` trouvé${filtered.length > 1 ? 's' : ''}` : ' au total'}
      </p>
    </>
  )
}

/* ═══════════════════════════════════════════════════════
   ONGLET AVIS (producteur)
═══════════════════════════════════════════════════════ */
function AvisTab() {
  const [avis, setAvis]       = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    api.get('/producer/avis')
      .then(res => setAvis(res.data))
      .catch(() => setError('Impossible de charger les avis.'))
      .finally(() => setLoading(false))
  }, [])

  const handleApprove = async (id) => {
    try {
      await api.post(`/producer/avis/${id}/approve`)
      setAvis(prev => prev.map(a => a.id === id ? { ...a, status: 'approved' } : a))
    } catch { alert('Erreur.') }
  }

  const handleReject = async (id) => {
    try {
      await api.post(`/producer/avis/${id}/reject`)
      setAvis(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' } : a))
    } catch { alert('Erreur.') }
  }

  if (loading) return <Spinner />
  if (error)   return <ErrorMsg msg={error} />

  if (avis.length === 0) return (
    <div className="text-center py-16 rounded-2xl"
      style={{ background: '#fff', color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
      Aucun avis en attente de modération.
    </div>
  )

  return (
    <div className="space-y-4">
      {avis.map((a) => (
        <div key={a.id} className="rounded-2xl p-6"
          style={{ background: '#fff', boxShadow: '0 4px 24px rgba(0,6,102,0.07)' }}>

          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                style={{ background: 'linear-gradient(135deg, #000666, #1a237e)' }}>
                {(a.user_name ?? 'A')[0].toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-bold"
                  style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>
                  {a.user_name ?? 'Anonyme'}
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
                  {a.show_title}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ color: '#fdd400', fontSize: '0.9rem' }}>{'★'.repeat(a.rating ?? 0)}</span>
              <StatusBadge status={a.status === 'approved' ? 'approved' : a.status === 'rejected' ? 'rejected' : 'pending'} />
            </div>
          </div>

          <p className="text-sm mb-4 leading-relaxed"
            style={{ color: '#454652', fontFamily: 'Manrope, sans-serif', lineHeight: 1.7 }}>
            {a.comment}
          </p>

          {a.status === 'pending' && (
            <div className="flex gap-3">
              <button onClick={() => handleApprove(a.id)}
                className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl"
                style={{ background: '#000666', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }}>
                ✓ Valider
              </button>
              <button onClick={() => handleReject(a.id)}
                className="flex items-center gap-2 text-sm px-5 py-2.5 rounded-xl"
                style={{ background: '#ffdad6', color: '#93000a', border: 'none', cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }}>
                ✕ Rejeter
              </button>
            </div>
          )}
          {(a.status === 'approved' || a.status === 'rejected') && (
            <StatusBadge status={a.status} />
          )}
        </div>
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   COMPOSANTS PARTAGÉS
═══════════════════════════════════════════════════════ */
function StatusBadge({ status }) {
  const map = {
    pending:  { label: 'En attente', bg: '#fff8e1', color: '#f57f17' },
    approved: { label: 'Approuvé',   bg: '#e8f5e9', color: '#2e7d32' },
    rejected: { label: 'Refusé',     bg: '#ffebee', color: '#c62828' },
  }
  const s = map[status] ?? map.pending
  return (
    <span className="text-xs font-bold px-3 py-1 rounded-full"
      style={{ background: s.bg, color: s.color, fontFamily: 'Manrope, sans-serif' }}>
      {s.label}
    </span>
  )
}

function Spinner() {
  return (
    <div className="flex justify-center items-center h-40">
      <div className="w-8 h-8 border-4 rounded-full animate-spin"
        style={{ borderColor: '#e0e3e6', borderTopColor: '#000666' }} />
    </div>
  )
}

function ErrorMsg({ msg }) {
  return (
    <p className="text-center py-8 text-sm"
      style={{ color: '#ba1a1a', fontFamily: 'Manrope, sans-serif' }}>{msg}</p>
  )
}
