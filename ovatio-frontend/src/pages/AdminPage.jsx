import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
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
  const { t } = useLanguage()
  const navigate = useNavigate()

  const isAdmin    = user?.roles?.includes('admin')
  const isProducer = user?.roles?.includes('producer')

  const defaultTab = isAdmin ? 'demandes' : 'stats'
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
            {isAdmin ? t('admin.adminTitle') : t('admin.producerTitle')}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'Manrope, sans-serif', fontSize: '0.875rem' }}>
            {isAdmin ? t('admin.adminDesc') : t('admin.producerDesc')}
          </p>
        </div>

        {/* Onglets */}
        <div className="flex flex-wrap gap-2 mb-8">
          {isAdmin && (
            <>
              <button style={styleTab(tab === 'demandes')} onClick={() => setTab('demandes')}>
                {t('admin.tabDemandes')}
              </button>
              <button style={styleTab(tab === 'membres')} onClick={() => setTab('membres')}>
                {t('admin.tabMembers')}
              </button>
              <button style={styleTab(tab === 'producteurs')} onClick={() => setTab('producteurs')}>
                {t('admin.tabProducers')}
              </button>
              <button style={styleTab(tab === 'artistes')} onClick={() => setTab('artistes')}>
                {t('admin.tabArtists')}
              </button>
            </>
          )}
          {isProducer && (
            <>
              <button style={styleTab(tab === 'stats')} onClick={() => setTab('stats')}>
                {t('admin.tabStats')}
              </button>
              <button style={styleTab(tab === 'spectacles')} onClick={() => setTab('spectacles')}>
                {t('admin.tabShows')}
              </button>
              <button style={styleTab(tab === 'avis')} onClick={() => setTab('avis')}>
                {t('admin.tabReviews')}
              </button>
            </>
          )}
        </div>

        {/* Contenu */}
        {tab === 'demandes'    && isAdmin    && <DemandesTab t={t} />}
        {tab === 'membres'     && isAdmin    && <MembresTab t={t} />}
        {tab === 'producteurs' && isAdmin    && <ProducteursTab t={t} />}
        {tab === 'artistes'    && isAdmin    && <ArtistesTab t={t} />}
        {tab === 'stats'       && isProducer && <StatsProducerTab t={t} />}
        {tab === 'spectacles'  && isProducer && <SpectaclesTab t={t} />}
        {tab === 'avis'        && isProducer && <AvisTab t={t} />}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   ONGLET DEMANDES PRODUCTEURS
═══════════════════════════════════════════════════════ */
function DemandesTab({ t }) {
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
      .catch(() => setError(t('admin.loadDemandesError')))
      .finally(() => setLoading(false))
  }, [])

  const handleApprove = async (id) => {
    try {
      await api.post(`/admin/demandes/${id}/approve`)
      setDemandes(prev => prev.map(d => d.id === id ? { ...d, status: 'approved' } : d))
    } catch { alert(t('admin.approveError')) }
  }

  const handleRejectSubmit = async () => {
    if (!reason.trim() || reason.trim().length < 10) {
      setReasonErr(t('admin.rejectMinLength'))
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

  const filters = [
    { key: 'pending',  label: t('admin.filterPending'),  color: '#f57f17', bg: '#fff8e1' },
    { key: 'approved', label: t('admin.filterApproved'), color: '#2e7d32', bg: '#e8f5e9' },
    { key: 'rejected', label: t('admin.filterRejected'), color: '#c62828', bg: '#ffebee' },
    { key: 'all',      label: t('admin.filterAll'),      color: '#454652', bg: '#f2f4f7' },
  ]

  return (
    <>
      {/* Filtres */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {filters.map(f => (
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
          {t('admin.noDemandes')}
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
              <StatusBadge status={d.status} t={t} />
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
                <strong>{t('admin.rejectionReason')}</strong> {d.rejection_reason}
              </div>
            )}

            {/* Actions — seulement si pending */}
            {d.status === 'pending' && (
              <div className="flex gap-3">
                <button onClick={() => handleApprove(d.id)}
                  className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl"
                  style={{ background: '#000666', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }}>
                  {t('admin.approveBtn')}
                </button>
                <button onClick={() => { setRejectId(d.id); setReason(''); setReasonErr('') }}
                  className="flex items-center gap-2 text-sm px-5 py-2.5 rounded-xl"
                  style={{ background: '#ffdad6', color: '#93000a', border: 'none', cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }}>
                  {t('admin.rejectBtn')}
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
              {t('admin.rejectModalTitle')}
            </h3>
            <p className="text-sm mb-4" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
              {t('admin.rejectModalDesc')}
            </p>
            <textarea
              value={reason}
              onChange={e => { setReason(e.target.value); setReasonErr('') }}
              placeholder={t('admin.rejectPlaceholder')}
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
                {t('admin.confirmReject')}
              </button>
              <button onClick={() => setRejectId(null)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold"
                style={{ background: '#f2f4f7', color: '#454652', border: 'none', cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }}>
                {t('admin.cancelBtn')}
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
function MembresTab({ t }) {
  const [members, setMembers]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [search, setSearch]     = useState('')

  useEffect(() => {
    api.get('/admin/members')
      .then(res => setMembers(res.data))
      .catch(() => setError(t('admin.loadMembersError')))
      .finally(() => setLoading(false))
  }, [])

  const handleToggleDisable = async (id, isDisabled) => {
    const endpoint = isDisabled ? `/admin/users/${id}/enable` : `/admin/users/${id}/disable`
    try {
      await api.post(endpoint)
      setMembers(prev => prev.map(m => m.id === id ? { ...m, is_disabled: !isDisabled } : m))
    } catch (err) {
      alert(err.response?.data?.message ?? 'Erreur.')
    }
  }

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
          placeholder={t('admin.searchPlaceholder')}
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
          <span className="col-span-3">{t('admin.colMember')}</span>
          <span className="col-span-2">{t('admin.colLogin')}</span>
          <span className="col-span-3">{t('admin.colRoles')}</span>
          <span className="col-span-2">{t('admin.colJoined')}</span>
          <span className="col-span-2 text-right">{t('admin.colAction')}</span>
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
            {t('admin.noMembers')}
          </div>
        )}

        {filtered.map((m, i) => (
          <div key={m.id}
            className="grid grid-cols-12 px-6 py-4 items-center"
            style={{
              borderBottom: i < filtered.length - 1 ? '1px solid #f2f4f7' : 'none',
            }}>
            {/* Nom + email */}
            <div className="col-span-3 flex items-center gap-3">
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
            <div className="col-span-2">
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
                    background: role === 'admin' ? '#fdd400' : role === 'producer' ? '#e0f2fe' : '#f2f4f7',
                    color:      role === 'admin' ? '#6f5c00' : role === 'producer' ? '#0369a1' : '#454652',
                    fontFamily: 'Manrope, sans-serif',
                  }}>
                  {role}
                </span>
              ))}
              {m.is_producer && !(m.roles ?? []).includes('producer') && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: '#e0f2fe', color: '#0369a1', fontFamily: 'Manrope, sans-serif' }}>
                  producteur
                </span>
              )}
            </div>

            {/* Date */}
            <div className="col-span-2 text-xs" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
              {m.created_at}
            </div>

            {/* Action */}
            <div className="col-span-2 flex justify-end">
              <button
                onClick={() => handleToggleDisable(m.id, m.is_disabled)}
                style={{
                  background: m.is_disabled ? '#e8f5e9' : '#ffdad6',
                  color: m.is_disabled ? '#2e7d32' : '#93000a',
                  border: 'none', cursor: 'pointer',
                  padding: '4px 12px', borderRadius: '8px',
                  fontFamily: 'Manrope, sans-serif', fontSize: '0.75rem', fontWeight: 600,
                }}>
                {m.is_disabled ? t('admin.enable') : t('admin.disable')}
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs mt-3 text-right" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
        {filtered.length} {search
          ? t('admin.memberFound').replace('{n}', '').replace('{s}', filtered.length > 1 ? 's' : '')
          : t('admin.memberCount').replace('{n}', '').replace('{s}', filtered.length > 1 ? 's' : '')
        }
      </p>
    </>
  )
}

/* ═══════════════════════════════════════════════════════
   ONGLET PRODUCTEURS
═══════════════════════════════════════════════════════ */
function ProducteursTab({ t }) {
  const [producers, setProducers] = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')
  const [search, setSearch]       = useState('')

  useEffect(() => {
    api.get('/admin/producers')
      .then(res => setProducers(res.data))
      .catch(() => setError(t('admin.loadProducersError')))
      .finally(() => setLoading(false))
  }, [])

  const handleToggleDisable = async (id, isDisabled) => {
    const endpoint = isDisabled ? `/admin/users/${id}/enable` : `/admin/users/${id}/disable`
    try {
      await api.post(endpoint)
      setProducers(prev => prev.map(p => p.id === id ? { ...p, is_disabled: !isDisabled } : p))
    } catch (err) {
      alert(err.response?.data?.message ?? 'Erreur.')
    }
  }

  if (loading) return <Spinner />
  if (error)   return <ErrorMsg msg={error} />

  const filtered = producers.filter(p =>
    (p.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (p.email ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (p.company_name ?? '').toLowerCase().includes(search.toLowerCase())
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
          placeholder={t('admin.searchProducerPlaceholder')}
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

      {filtered.length === 0 && (
        <div className="text-center py-16 rounded-2xl"
          style={{ background: '#fff', color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
          {t('admin.noProducers')}
        </div>
      )}

      <div className="space-y-4">
        {filtered.map(p => (
          <div key={p.id} className="rounded-2xl p-6"
            style={{ background: '#fff', boxShadow: '0 4px 24px rgba(0,6,102,0.07)' }}>

            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white shrink-0"
                  style={{ background: 'linear-gradient(135deg, #0369a1, #0284c7)' }}>
                  {(p.company_name ?? p.name ?? 'P')[0].toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-base"
                    style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>
                    {p.company_name}
                  </h3>
                  <p className="text-xs mt-0.5" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
                    {p.name} · {p.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: '#f2f4f7', color: '#454652', fontFamily: 'Manrope, sans-serif' }}>
                  membre
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: '#e0f2fe', color: '#0369a1', fontFamily: 'Manrope, sans-serif' }}>
                  producteur
                </span>
              </div>
            </div>

            {/* Infos complémentaires */}
            <div className="flex flex-wrap gap-3 mb-4">
              {p.login && (
                <code className="text-xs px-2 py-1 rounded-lg"
                  style={{ background: '#f2f4f7', color: '#454652', fontFamily: 'monospace' }}>
                  {p.login}
                </code>
              )}
              {p.siret && (
                <span className="text-xs px-3 py-1 rounded-full"
                  style={{ background: '#f2f4f7', color: '#454652', fontFamily: 'Manrope, sans-serif' }}>
                  BCE/SIRET : {p.siret}
                </span>
              )}
              {p.website && (
                <a href={p.website} target="_blank" rel="noreferrer"
                  className="text-xs px-3 py-1 rounded-full hover:opacity-80"
                  style={{ background: '#f2f4f7', color: '#000666', fontFamily: 'Manrope, sans-serif' }}>
                  {p.website}
                </a>
              )}
              {p.phone && (
                <span className="text-xs px-3 py-1 rounded-full"
                  style={{ background: '#f2f4f7', color: '#454652', fontFamily: 'Manrope, sans-serif' }}>
                  {p.phone}
                </span>
              )}
              <span className="text-xs px-3 py-1 rounded-full"
                style={{ background: '#e8f5e9', color: '#2e7d32', fontFamily: 'Manrope, sans-serif' }}>
                ✓ {t('admin.approvedSince')} {p.approved_at}
              </span>
            </div>

            {/* Action */}
            <div className="flex justify-end">
              <button
                onClick={() => handleToggleDisable(p.id, p.is_disabled)}
                style={{
                  background: p.is_disabled ? '#e8f5e9' : '#ffdad6',
                  color:      p.is_disabled ? '#2e7d32' : '#93000a',
                  border: 'none', cursor: 'pointer',
                  padding: '4px 14px', borderRadius: '8px',
                  fontFamily: 'Manrope, sans-serif', fontSize: '0.75rem', fontWeight: 600,
                }}>
                {p.is_disabled ? t('admin.enable') : t('admin.disable')}
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs mt-3 text-right" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
        {filtered.length} {t('admin.producerCount')}
      </p>
    </>
  )
}

/* ═══════════════════════════════════════════════════════
   ONGLET MES SPECTACLES (producteur) — CRUD complet
═══════════════════════════════════════════════════════ */
const EMPTY_FORM = { title: '', description: '', duration: '', created_in: '', location_id: '', bookable: false }

function SpectaclesTab({ t }) {
  const [view, setView]           = useState('list')
  const [shows, setShows]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')
  const [refData, setRefData]     = useState({ locations: [], prices: [], artists: [] })
  const [editingShow, setEditingShow] = useState(null)
  const [form, setForm]           = useState(EMPTY_FORM)
  const [saving, setSaving]       = useState(false)
  const [formError, setFormError] = useState('')
  // reps view
  const [repsShow, setRepsShow]   = useState(null)
  const [reps, setReps]           = useState([])
  const [repsLoading, setRepsLoading] = useState(false)
  const [repsError, setRepsError] = useState('')
  const [newRep, setNewRep]       = useState({ schedule: '', location_id: '' })
  const [addingRep, setAddingRep] = useState(false)

  const loadShows = () =>
    api.get('/producer/shows')
      .then(res => setShows(res.data))
      .catch(() => setError(t('admin.loadShowsError')))
      .finally(() => setLoading(false))

  useEffect(() => {
    loadShows()
    api.get('/producer/data').then(res => setRefData(res.data)).catch(() => {})
  }, [])

  const handleToggle = async (id, bookable) => {
    const ep = bookable ? `/producer/shows/${id}/unconfirm` : `/producer/shows/${id}/confirm`
    try {
      await api.patch(ep)
      setShows(prev => prev.map(s => s.id === id ? { ...s, bookable: !bookable } : s))
    } catch { alert(t('admin.saveError')) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin.deleteShowConfirm'))) return
    try {
      await api.delete(`/producer/shows/${id}`)
      setShows(prev => prev.filter(s => s.id !== id))
    } catch { alert(t('admin.deleteError')) }
  }

  const openCreate = () => {
    setEditingShow(null)
    setForm({ ...EMPTY_FORM, location_id: refData.locations[0]?.id ?? '' })
    setFormError('')
    setView('form')
  }

  const openEdit = (show) => {
    setEditingShow(show)
    setForm({
      title:       show.title ?? '',
      description: show.description ?? '',
      duration:    show.duration ?? '',
      created_in:  show.created_in ?? '',
      location_id: show.location_id ?? '',
      bookable:    show.bookable ?? false,
    })
    setFormError('')
    setView('form')
  }

  const openReps = (show) => {
    setRepsShow(show)
    setRepsLoading(true)
    setRepsError('')
    setNewRep({ schedule: '', location_id: refData.locations[0]?.id ?? '' })
    setView('reps')
    api.get(`/producer/shows/${show.id}/detail`)
      .then(res => setReps(res.data.representations ?? []))
      .catch(() => setRepsError(t('admin.loadRepsError')))
      .finally(() => setRepsLoading(false))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    setSaving(true)
    const payload = {
      ...form,
      duration:    parseInt(form.duration, 10) || undefined,
      created_in:  parseInt(form.created_in, 10) || undefined,
      location_id: form.location_id || undefined,
    }
    try {
      if (editingShow) {
        const res = await api.put(`/producer/shows/${editingShow.id}`, payload)
        setShows(prev => prev.map(s => s.id === editingShow.id ? res.data : s))
      } else {
        const res = await api.post('/producer/shows', payload)
        setShows(prev => [res.data, ...prev])
      }
      setView('list')
    } catch (err) {
      setFormError(err.response?.data?.message ?? t('admin.saveError'))
    } finally {
      setSaving(false)
    }
  }

  const handleAddRep = async (e) => {
    e.preventDefault()
    setAddingRep(true)
    try {
      const res = await api.post(`/producer/shows/${repsShow.id}/representations`, newRep)
      setReps(prev => [...prev, res.data])
      setNewRep({ schedule: '', location_id: refData.locations[0]?.id ?? '' })
      setShows(prev => prev.map(s =>
        s.id === repsShow.id ? { ...s, representations_count: (s.representations_count ?? 0) + 1 } : s
      ))
    } catch (err) {
      alert(err.response?.data?.message ?? t('admin.saveError'))
    } finally {
      setAddingRep(false)
    }
  }

  const handleCancelRep = async (repId) => {
    if (!window.confirm(t('admin.cancelRepConfirm'))) return
    try {
      await api.delete(`/producer/representations/${repId}`)
      setReps(prev => prev.filter(r => r.id !== repId))
      setShows(prev => prev.map(s =>
        s.id === repsShow.id ? { ...s, representations_count: Math.max(0, (s.representations_count ?? 1) - 1) } : s
      ))
    } catch { alert(t('admin.deleteError')) }
  }

  if (loading) return <Spinner />
  if (error)   return <ErrorMsg msg={error} />

  const inputStyle = {
    fontFamily: 'Manrope, sans-serif', fontSize: '0.875rem', color: '#191c1e',
    background: '#f7f9fc', border: '1px solid #e0e3e6', borderRadius: '8px',
    padding: '8px 12px', outline: 'none', width: '100%',
  }

  /* ── Vue FORMULAIRE ───────────────────────────────── */
  if (view === 'form') {
    return (
      <div>
        <button onClick={() => setView('list')}
          style={{ background: 'none', border: 'none', cursor: 'pointer',
            color: '#000666', fontFamily: 'Manrope, sans-serif', fontSize: '0.875rem',
            fontWeight: 600, marginBottom: '1.5rem', padding: 0 }}>
          ← {t('admin.backToList')}
        </button>

        <div className="rounded-2xl p-8"
          style={{ background: '#fff', boxShadow: '0 4px 24px rgba(0,6,102,0.07)' }}>
          <h2 className="text-xl font-bold mb-6"
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>
            {editingShow ? t('admin.editShow') : t('admin.createShow')}
          </h2>

          {formError && (
            <div className="rounded-xl px-4 py-3 mb-4 text-sm"
              style={{ background: '#ffebee', color: '#c62828', fontFamily: 'Manrope, sans-serif' }}>
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
                {t('admin.fieldTitle')} *
              </label>
              <input style={inputStyle} required value={form.title}
                onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
            </div>

            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
                {t('admin.fieldDescription')}
              </label>
              <textarea style={{ ...inputStyle, resize: 'none' }} rows={4} value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
                  {t('admin.fieldDuration')} *
                </label>
                <input style={inputStyle} type="number" min="1" max="600" required value={form.duration}
                  onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs font-semibold mb-1 block" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
                  {t('admin.fieldCreatedIn')} *
                </label>
                <input style={inputStyle} type="number" min="1900" max="2100" required value={form.created_in}
                  onChange={e => setForm(p => ({ ...p, created_in: e.target.value }))} />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold mb-1 block" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
                {t('admin.fieldLocation')}
              </label>
              <select style={inputStyle} value={form.location_id}
                onChange={e => setForm(p => ({ ...p, location_id: e.target.value }))}>
                <option value="">—</option>
                {refData.locations.map(l => (
                  <option key={l.id} value={l.id}>{l.designation}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <input type="checkbox" id="bookable" checked={form.bookable}
                onChange={e => setForm(p => ({ ...p, bookable: e.target.checked }))}
                style={{ width: '16px', height: '16px', accentColor: '#000666' }} />
              <label htmlFor="bookable" className="text-sm"
                style={{ fontFamily: 'Manrope, sans-serif', color: '#454652', cursor: 'pointer' }}>
                {t('admin.fieldBookable')}
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving}
                style={{ background: '#000666', color: '#fff', border: 'none', cursor: 'pointer',
                  padding: '10px 24px', borderRadius: '10px', fontFamily: 'Manrope, sans-serif',
                  fontSize: '0.875rem', fontWeight: 600, opacity: saving ? 0.7 : 1 }}>
                {saving ? t('admin.saving') : editingShow ? t('admin.updateBtn') : t('admin.addBtn')}
              </button>
              <button type="button" onClick={() => setView('list')}
                style={{ background: '#f2f4f7', color: '#454652', border: 'none', cursor: 'pointer',
                  padding: '10px 20px', borderRadius: '10px', fontFamily: 'Manrope, sans-serif', fontSize: '0.875rem' }}>
                {t('admin.cancelBtn')}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  /* ── Vue REPRÉSENTATIONS ──────────────────────────── */
  if (view === 'reps') {
    return (
      <div>
        <button onClick={() => setView('list')}
          style={{ background: 'none', border: 'none', cursor: 'pointer',
            color: '#000666', fontFamily: 'Manrope, sans-serif', fontSize: '0.875rem',
            fontWeight: 600, marginBottom: '1.5rem', padding: 0 }}>
          ← {t('admin.backToList')}
        </button>

        <h2 className="text-xl font-bold mb-6"
          style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>
          {t('admin.representationsFor')} <span style={{ color: '#000666' }}>{repsShow?.title}</span>
        </h2>

        {repsLoading ? <Spinner /> : repsError ? <ErrorMsg msg={repsError} /> : (
          <>
            {/* Liste des représentations */}
            <div className="rounded-2xl overflow-hidden mb-6"
              style={{ background: '#fff', boxShadow: '0 4px 24px rgba(0,6,102,0.07)' }}>
              {reps.length === 0 ? (
                <div className="py-10 text-center text-sm" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
                  {t('admin.noReps')}
                </div>
              ) : reps.map((r, i) => (
                <div key={r.id} className="flex items-center justify-between px-6 py-4"
                  style={{ borderBottom: i < reps.length - 1 ? '1px solid #f2f4f7' : 'none' }}>
                  <div>
                    <p className="text-sm font-semibold"
                      style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>
                      {r.schedule ? new Date(r.schedule).toLocaleString('fr-BE', {
                        dateStyle: 'medium', timeStyle: 'short'
                      }) : '—'}
                    </p>
                    {r.location?.name && (
                      <p className="text-xs mt-0.5" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
                        {r.location.name}
                      </p>
                    )}
                  </div>
                  <button onClick={() => handleCancelRep(r.id)}
                    style={{ background: '#ffdad6', color: '#93000a', border: 'none', cursor: 'pointer',
                      padding: '4px 14px', borderRadius: '8px', fontFamily: 'Manrope, sans-serif',
                      fontSize: '0.75rem', fontWeight: 600 }}>
                    {t('admin.deleteBtn')}
                  </button>
                </div>
              ))}
            </div>

            {/* Formulaire ajout représentation */}
            <div className="rounded-2xl p-6"
              style={{ background: '#fff', boxShadow: '0 4px 24px rgba(0,6,102,0.07)' }}>
              <h3 className="text-sm font-bold mb-4"
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>
                {t('admin.addRep')}
              </h3>
              <form onSubmit={handleAddRep} className="flex flex-wrap gap-3 items-end">
                <div className="flex-1 min-w-48">
                  <label className="text-xs font-semibold mb-1 block" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
                    {t('admin.fieldSchedule')}
                  </label>
                  <input style={inputStyle} type="datetime-local" required value={newRep.schedule}
                    onChange={e => setNewRep(p => ({ ...p, schedule: e.target.value }))} />
                </div>
                <div className="flex-1 min-w-48">
                  <label className="text-xs font-semibold mb-1 block" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
                    {t('admin.repLocation')}
                  </label>
                  <select style={inputStyle} value={newRep.location_id}
                    onChange={e => setNewRep(p => ({ ...p, location_id: e.target.value }))}>
                    <option value="">—</option>
                    {refData.locations.map(l => (
                      <option key={l.id} value={l.id}>{l.designation}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" disabled={addingRep}
                  style={{ background: '#000666', color: '#fff', border: 'none', cursor: 'pointer',
                    padding: '9px 20px', borderRadius: '8px', fontFamily: 'Manrope, sans-serif',
                    fontSize: '0.875rem', fontWeight: 600, opacity: addingRep ? 0.7 : 1 }}>
                  {addingRep ? '…' : t('admin.addBtn')}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    )
  }

  /* ── Vue LISTE ────────────────────────────────────── */
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <p className="text-xs" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
          {shows.length} {t('admin.showCount').replace('{n}', '').replace('{s}', shows.length > 1 ? 's' : '')}
        </p>
        <button onClick={openCreate}
          style={{ background: '#000666', color: '#fff', border: 'none', cursor: 'pointer',
            padding: '9px 20px', borderRadius: '10px', fontFamily: 'Manrope, sans-serif',
            fontSize: '0.875rem', fontWeight: 600 }}>
          {t('admin.createShow')}
        </button>
      </div>

      {shows.length === 0 ? (
        <div className="text-center py-16 rounded-2xl"
          style={{ background: '#fff', color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
          {t('admin.noShows')}
        </div>
      ) : (
        <div className="space-y-4">
          {shows.map(s => (
            <div key={s.id} className="rounded-2xl p-6"
              style={{ background: '#fff', boxShadow: '0 4px 24px rgba(0,6,102,0.07)' }}>

              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {s.poster_url
                    ? <img src={`/images/${s.poster_url}`} alt={s.title}
                        className="w-12 h-12 rounded-xl object-cover shrink-0" />
                    : <div className="w-12 h-12 rounded-xl shrink-0 flex items-center justify-center text-white text-xl"
                        style={{ background: 'linear-gradient(135deg, #000666, #1a237e)' }}>🎭</div>
                  }
                  <div>
                    <h3 className="font-bold text-base"
                      style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>
                      {s.title}
                    </h3>
                    <p className="text-xs mt-0.5" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
                      {s.location_name ?? '—'} · {s.representations_count ?? 0} {t('admin.colReps').toLowerCase()}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full shrink-0"
                  style={{
                    background: s.bookable ? '#e8f5e9' : '#fff8e1',
                    color:      s.bookable ? '#2e7d32' : '#f57f17',
                    fontFamily: 'Manrope, sans-serif',
                  }}>
                  {s.bookable ? t('admin.showConfirmed') : t('admin.showToConfirm')}
                </span>
              </div>

              {s.description && (
                <p className="text-sm mb-4 leading-relaxed line-clamp-2"
                  style={{ color: '#454652', fontFamily: 'Manrope, sans-serif', lineHeight: 1.6 }}>
                  {s.description}
                </p>
              )}

              <div className="flex flex-wrap gap-2">
                <button onClick={() => openEdit(s)}
                  style={{ background: '#e8eaf6', color: '#000666', border: 'none', cursor: 'pointer',
                    padding: '6px 14px', borderRadius: '8px', fontFamily: 'Manrope, sans-serif',
                    fontSize: '0.8rem', fontWeight: 600 }}>
                  {t('admin.editBtn')}
                </button>
                <button onClick={() => openReps(s)}
                  style={{ background: '#f2f4f7', color: '#454652', border: 'none', cursor: 'pointer',
                    padding: '6px 14px', borderRadius: '8px', fontFamily: 'Manrope, sans-serif',
                    fontSize: '0.8rem', fontWeight: 600 }}>
                  📅 {t('admin.manageReps')}
                </button>
                <button onClick={() => handleToggle(s.id, s.bookable)}
                  style={{
                    background: s.bookable ? '#fff8e1' : '#e8f5e9',
                    color:      s.bookable ? '#f57f17' : '#2e7d32',
                    border: 'none', cursor: 'pointer',
                    padding: '6px 14px', borderRadius: '8px', fontFamily: 'Manrope, sans-serif',
                    fontSize: '0.8rem', fontWeight: 600,
                  }}>
                  {s.bookable ? t('admin.removeBtn') : t('admin.confirmBtn')}
                </button>
                <button onClick={() => handleDelete(s.id)}
                  style={{ background: '#ffdad6', color: '#93000a', border: 'none', cursor: 'pointer',
                    padding: '6px 14px', borderRadius: '8px', fontFamily: 'Manrope, sans-serif',
                    fontSize: '0.8rem', fontWeight: 600 }}>
                  {t('admin.deleteBtn')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

/* ═══════════════════════════════════════════════════════
   ONGLET STATS (producteur)
═══════════════════════════════════════════════════════ */
function StatsProducerTab({ t }) {
  const [stats, setStats]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    api.get('/producer/stats')
      .then(res => setStats(res.data))
      .catch(() => setError(t('admin.loadStatsError')))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />
  if (error)   return <ErrorMsg msg={error} />

  const cards = [
    { key: 'total_shows',        label: t('admin.totalShows'),        icon: '🎭', accent: '#000666', bg: '#eef0ff' },
    { key: 'confirmed_shows',    label: t('admin.confirmedShows'),    icon: '✅', accent: '#2e7d32', bg: '#e8f5e9' },
    { key: 'total_reps',         label: t('admin.totalReps'),         icon: '📅', accent: '#1565c0', bg: '#e3f2fd' },
    { key: 'upcoming_reps',      label: t('admin.upcomingReps'),      icon: '⏭️', accent: '#f57f17', bg: '#fff8e1' },
    { key: 'total_reservations', label: t('admin.totalReservations'), icon: '🎟️', accent: '#6a1b9a', bg: '#f3e5f5' },
    { key: 'pending_reviews',    label: t('admin.pendingReviews'),    icon: '⭐', accent: '#c62828', bg: '#ffebee' },
  ]

  return (
    <div className="grid grid-cols-3 gap-4">
      {cards.map(c => (
        <div key={c.key} className="rounded-2xl p-6"
          style={{ background: '#fff', boxShadow: '0 4px 24px rgba(0,6,102,0.07)' }}>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl mb-4"
            style={{ background: c.bg }}>
            {c.icon}
          </div>
          <div className="text-4xl font-black mb-1"
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: c.accent }}>
            {stats?.[c.key] ?? 0}
          </div>
          <div className="text-sm" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
            {c.label}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   ONGLET AVIS (producteur)
═══════════════════════════════════════════════════════ */
function AvisTab({ t }) {
  const [avis, setAvis]       = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    api.get('/producer/avis')
      .then(res => setAvis(res.data))
      .catch(() => setError(t('admin.loadReviewsError')))
      .finally(() => setLoading(false))
  }, [])

  const handleApprove = async (id) => {
    try {
      await api.post(`/producer/avis/${id}/approve`)
      setAvis(prev => prev.map(a => a.id === id ? { ...a, validated: true } : a))
    } catch { alert('Erreur.') }
  }

  const handleReject = async (id) => {
    try {
      await api.post(`/producer/avis/${id}/reject`)
      setAvis(prev => prev.map(a => a.id === id ? { ...a, validated: -1 } : a))
    } catch { alert('Erreur.') }
  }

  if (loading) return <Spinner />
  if (error)   return <ErrorMsg msg={error} />

  if (avis.length === 0) return (
    <div className="text-center py-16 rounded-2xl"
      style={{ background: '#fff', color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
      {t('admin.noReviews')}
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
                  {a.user_name ?? t('admin.anonymous')}
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
                  {a.show_title}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ color: '#fdd400', fontSize: '0.9rem' }}>{'★'.repeat(a.score ?? 0)}</span>
              <StatusBadge status={a.validated === true ? 'approved' : a.validated === -1 ? 'rejected' : 'pending'} t={t} />
            </div>
          </div>

          <p className="text-sm mb-4 leading-relaxed"
            style={{ color: '#454652', fontFamily: 'Manrope, sans-serif', lineHeight: 1.7 }}>
            {a.comment}
          </p>

          {a.validated !== true && a.validated !== -1 && (
            <div className="flex gap-3">
              <button onClick={() => handleApprove(a.id)}
                className="flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl"
                style={{ background: '#000666', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }}>
                {t('admin.validateBtn')}
              </button>
              <button onClick={() => handleReject(a.id)}
                className="flex items-center gap-2 text-sm px-5 py-2.5 rounded-xl"
                style={{ background: '#ffdad6', color: '#93000a', border: 'none', cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }}>
                {t('admin.rejectReviewBtn')}
              </button>
            </div>
          )}
          {(a.validated === true || a.validated === -1) && (
            <StatusBadge status={a.validated === true ? 'approved' : 'rejected'} t={t} />
          )}
        </div>
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   ONGLET ARTISTES
═══════════════════════════════════════════════════════ */
function ArtistesTab({ t }) {
  const [artists, setArtists]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [form, setForm]         = useState({ firstname: '', lastname: '', country: '' })
  const [editId, setEditId]     = useState(null)
  const [saving, setSaving]     = useState(false)

  const load = () => {
    setLoading(true)
    api.get('/artists')
      .then(res => setArtists(res.data.data ?? res.data))
      .catch(() => setError(t('admin.loadArtistsError')))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editId) {
        const res = await api.put(`/artists/${editId}`, form)
        setArtists(prev => prev.map(a => a.id === editId ? (res.data.data ?? res.data) : a))
      } else {
        const res = await api.post('/artists', form)
        setArtists(prev => [...prev, res.data.data ?? res.data])
      }
      setForm({ firstname: '', lastname: '', country: '' })
      setEditId(null)
    } catch (err) {
      alert(err.response?.data?.message ?? t('admin.saveError'))
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (a) => {
    setEditId(a.id)
    setForm({ firstname: a.firstname ?? '', lastname: a.lastname ?? '', country: a.country ?? '' })
  }

  const handleDelete = async (id) => {
    if (!window.confirm(t('admin.deleteConfirm'))) return
    try {
      await api.delete(`/artists/${id}`)
      setArtists(prev => prev.filter(a => a.id !== id))
    } catch { alert(t('admin.deleteError')) }
  }

  if (loading) return <Spinner />
  if (error)   return <ErrorMsg msg={error} />

  const inputStyle = {
    fontFamily: 'Manrope, sans-serif', fontSize: '0.875rem', color: '#191c1e',
    background: '#f7f9fc', border: '1px solid #e0e3e6', borderRadius: '8px',
    padding: '8px 12px', outline: 'none', width: '100%',
  }

  return (
    <>
      {/* Formulaire ajout / édition */}
      <div className="rounded-2xl p-6 mb-6"
        style={{ background: '#fff', boxShadow: '0 4px 24px rgba(0,6,102,0.07)' }}>
        <h3 className="text-sm font-bold mb-4"
          style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>
          {editId ? t('admin.editArtist') : t('admin.addArtist')}
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-32">
            <label className="text-xs font-semibold mb-1 block" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>{t('admin.colFirstname')}</label>
            <input style={inputStyle} value={form.firstname} required
              onChange={e => setForm(p => ({ ...p, firstname: e.target.value }))} />
          </div>
          <div className="flex-1 min-w-32">
            <label className="text-xs font-semibold mb-1 block" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>{t('admin.colLastname')}</label>
            <input style={inputStyle} value={form.lastname} required
              onChange={e => setForm(p => ({ ...p, lastname: e.target.value }))} />
          </div>
          <div className="flex-1 min-w-32">
            <label className="text-xs font-semibold mb-1 block" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>{t('admin.colCountry')}</label>
            <input style={inputStyle} value={form.country}
              onChange={e => setForm(p => ({ ...p, country: e.target.value }))} />
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={saving}
              style={{ background: '#000666', color: '#fff', border: 'none', cursor: 'pointer',
                padding: '9px 20px', borderRadius: '8px', fontFamily: 'Manrope, sans-serif',
                fontSize: '0.875rem', fontWeight: 600, opacity: saving ? 0.7 : 1 }}>
              {saving ? '…' : editId ? t('admin.updateBtn') : t('admin.addBtn')}
            </button>
            {editId && (
              <button type="button"
                onClick={() => { setEditId(null); setForm({ firstname: '', lastname: '', country: '' }) }}
                style={{ background: '#f2f4f7', color: '#454652', border: 'none', cursor: 'pointer',
                  padding: '9px 16px', borderRadius: '8px', fontFamily: 'Manrope, sans-serif', fontSize: '0.875rem' }}>
                {t('admin.cancelBtn')}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Liste */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background: '#fff', boxShadow: '0 4px 24px rgba(0,6,102,0.07)' }}>
        <div className="grid grid-cols-12 px-6 py-3 text-xs font-black uppercase tracking-widest"
          style={{ background: '#f7f9fc', color: '#767683', fontFamily: 'Manrope, sans-serif', borderBottom: '1px solid #eceef1' }}>
          <span className="col-span-4">{t('admin.colFirstname')}</span>
          <span className="col-span-4">{t('admin.colLastname')}</span>
          <span className="col-span-2">{t('admin.colCountry')}</span>
          <span className="col-span-2 text-right">{t('admin.colActions')}</span>
        </div>

        {artists.length === 0 && (
          <div className="py-12 text-center text-sm" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
            {t('admin.noArtists')}
          </div>
        )}

        {artists.map((a, i) => (
          <div key={a.id} className="grid grid-cols-12 px-6 py-4 items-center"
            style={{ borderBottom: i < artists.length - 1 ? '1px solid #f2f4f7' : 'none' }}>
            <div className="col-span-4 text-sm font-semibold"
              style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>
              {a.firstname}
            </div>
            <div className="col-span-4 text-sm" style={{ color: '#454652', fontFamily: 'Manrope, sans-serif' }}>
              {a.lastname}
            </div>
            <div className="col-span-2 text-xs" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
              {a.country ?? '—'}
            </div>
            <div className="col-span-2 flex justify-end gap-2">
              <button onClick={() => handleEdit(a)}
                style={{ background: '#e8eaf6', color: '#000666', border: 'none', cursor: 'pointer',
                  padding: '4px 12px', borderRadius: '8px', fontFamily: 'Manrope, sans-serif',
                  fontSize: '0.75rem', fontWeight: 600 }}>
                {t('admin.editBtn')}
              </button>
              <button onClick={() => handleDelete(a.id)}
                style={{ background: '#ffdad6', color: '#93000a', border: 'none', cursor: 'pointer',
                  padding: '4px 12px', borderRadius: '8px', fontFamily: 'Manrope, sans-serif',
                  fontSize: '0.75rem', fontWeight: 600 }}>
                {t('admin.deleteBtn')}
              </button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs mt-3 text-right" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
        {artists.length} {t('admin.artistCount').replace('{n}', '').replace('{s}', artists.length > 1 ? 's' : '')}
      </p>
    </>
  )
}

/* ═══════════════════════════════════════════════════════
   COMPOSANTS PARTAGÉS
═══════════════════════════════════════════════════════ */
function StatusBadge({ status, t }) {
  const map = {
    pending:  { labelKey: 'admin.statusPending',  bg: '#fff8e1', color: '#f57f17' },
    approved: { labelKey: 'admin.statusApproved', bg: '#e8f5e9', color: '#2e7d32' },
    rejected: { labelKey: 'admin.statusRejected', bg: '#ffebee', color: '#c62828' },
  }
  const s = map[status] ?? map.pending
  return (
    <span className="text-xs font-bold px-3 py-1 rounded-full"
      style={{ background: s.bg, color: s.color, fontFamily: 'Manrope, sans-serif' }}>
      {t(s.labelKey)}
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
