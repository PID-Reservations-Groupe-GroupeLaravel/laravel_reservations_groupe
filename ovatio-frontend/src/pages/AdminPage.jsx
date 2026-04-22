import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../api/axios'

const TAB_ACTIVE = {
  background: '#000666', color: '#ffffff',
  fontFamily: 'Manrope, sans-serif', fontWeight: 600,
  padding: '0.5rem 1.25rem', borderRadius: '0.625rem',
  fontSize: '0.875rem', border: 'none', cursor: 'pointer',
}
const TAB_INACTIVE = {
  background: '#f2f4f7', color: '#454652',
  fontFamily: 'Manrope, sans-serif', fontWeight: 500,
  padding: '0.5rem 1.25rem', borderRadius: '0.625rem',
  fontSize: '0.875rem', border: 'none', cursor: 'pointer',
}

export default function AdminPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const isAdmin    = user?.roles?.includes('admin')
  const isProducer = user?.roles?.includes('producer')

  const [tab, setTab] = useState(isAdmin ? 'demandes' : 'avis')

  useEffect(() => {
    if (user && !isAdmin && !isProducer) {
      navigate('/')
    }
  }, [user, isAdmin, isProducer, navigate])

  if (!user) return null

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      {/* Header */}
      <div className="rounded-2xl p-8 mb-8 text-white"
        style={{ background: 'linear-gradient(135deg, #000666 0%, #1a237e 100%)' }}>
        <div className="flex items-center gap-3 mb-2">
          <span className="material-symbols-outlined" style={{ fontSize: '2.5rem' }}>
            {isAdmin ? 'admin_panel_settings' : 'manage_accounts'}
          </span>
          <h1 className="text-3xl font-bold" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            {isAdmin ? 'Administration' : 'Tableau producteur'}
          </h1>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Manrope, sans-serif', fontSize: '0.875rem' }}>
          {isAdmin
            ? 'Gérez les demandes pour devenir producteur.'
            : 'Modérez les avis laissés sur vos spectacles.'}
        </p>
      </div>

      {/* Onglets — visible uniquement si l'user a les deux rôles */}
      {isAdmin && isProducer && (
        <div className="flex gap-2 mb-6">
          <button style={tab === 'demandes' ? TAB_ACTIVE : TAB_INACTIVE} onClick={() => setTab('demandes')}>
            Demandes producteurs
          </button>
          <button style={tab === 'avis' ? TAB_ACTIVE : TAB_INACTIVE} onClick={() => setTab('avis')}>
            Modération des avis
          </button>
        </div>
      )}

      {/* Contenu selon rôle */}
      {(tab === 'demandes' && isAdmin) && <DemandesTab />}
      {(tab === 'avis'     || (!isAdmin && isProducer)) && <AvisTab />}
    </div>
  )
}

/* ─── Onglet Demandes (admin) ─────────────────────────────────────────── */
function DemandesTab() {
  const [demandes, setDemandes] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')

  useEffect(() => {
    api.get('/admin/demandes')
      .then((res) => setDemandes(res.data))
      .catch(() => setError('Impossible de charger les demandes.'))
      .finally(() => setLoading(false))
  }, [])

  const handleApprove = async (id) => {
    try {
      await api.post(`/admin/demandes/${id}/approve`)
      setDemandes((prev) => prev.filter((d) => d.id !== id))
    } catch { alert("Erreur lors de l'approbation.") }
  }

  const handleReject = async (id) => {
    try {
      await api.post(`/admin/demandes/${id}/reject`)
      setDemandes((prev) => prev.filter((d) => d.id !== id))
    } catch { alert('Erreur lors du rejet.') }
  }

  if (loading) return <Spinner />
  if (error)   return <ErrorMsg msg={error} />

  if (demandes.length === 0) {
    return (
      <div className="text-center py-16 rounded-2xl"
        style={{ background: '#ffffff', color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
        <span className="material-symbols-outlined block mb-3" style={{ fontSize: '3rem', color: '#c6c5d4' }}>inbox</span>
        Aucune demande en attente.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {demandes.map((d) => (
        <div key={d.id} className="rounded-2xl p-6"
          style={{ background: '#ffffff', boxShadow: '0px 20px 40px rgba(25, 28, 30, 0.06)' }}>

          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-bold text-lg"
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>
                {d.company_name}
              </h3>
              <p className="text-sm" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
                Par {d.user_name ?? d.user_email} — {d.created_at}
              </p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full"
              style={{ background: '#fff8e1', color: '#f57f17', fontFamily: 'Manrope, sans-serif', fontWeight: 600 }}>
              En attente
            </span>
          </div>

          <p className="text-sm mb-4"
            style={{ color: '#454652', fontFamily: 'Manrope, sans-serif', lineHeight: 1.7 }}>
            {d.description}
          </p>

          {(d.website || d.phone) && (
            <div className="flex gap-4 mb-4">
              {d.website && (
                <div className="flex items-center gap-1 text-xs" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>language</span>
                  {d.website}
                </div>
              )}
              {d.phone && (
                <div className="flex items-center gap-1 text-xs" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>phone</span>
                  {d.phone}
                </div>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={() => handleApprove(d.id)}
              className="flex items-center gap-1 text-sm font-semibold px-4 py-2 rounded-xl"
              style={{ background: '#000666', color: '#ffffff', fontFamily: 'Manrope, sans-serif', border: 'none', cursor: 'pointer' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>check</span>
              Approuver
            </button>
            <button onClick={() => handleReject(d.id)}
              className="flex items-center gap-1 text-sm px-4 py-2 rounded-xl"
              style={{ background: '#ffdad6', color: '#93000a', fontFamily: 'Manrope, sans-serif', border: 'none', cursor: 'pointer' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>close</span>
              Rejeter
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─── Onglet Avis (producteur) ────────────────────────────────────────── */
function AvisTab() {
  const [avis, setAvis]       = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    // Route producteur — uniquement les avis de ses spectacles
    api.get('/producer/avis')
      .then((res) => setAvis(res.data))
      .catch(() => setError('Impossible de charger les avis.'))
      .finally(() => setLoading(false))
  }, [])

  const handleApprove = async (id) => {
    try {
      await api.post(`/producer/avis/${id}/approve`)
      setAvis((prev) => prev.map((a) => a.id === id ? { ...a, status: 'approved' } : a))
    } catch { alert('Erreur lors de la validation.') }
  }

  const handleReject = async (id) => {
    try {
      await api.post(`/producer/avis/${id}/reject`)
      setAvis((prev) => prev.map((a) => a.id === id ? { ...a, status: 'rejected' } : a))
    } catch { alert('Erreur lors du rejet.') }
  }

  if (loading) return <Spinner />
  if (error)   return <ErrorMsg msg={error} />

  if (avis.length === 0) {
    return (
      <div className="text-center py-16 rounded-2xl"
        style={{ background: '#ffffff', color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
        <span className="material-symbols-outlined block mb-3" style={{ fontSize: '3rem', color: '#c6c5d4' }}>rate_review</span>
        Aucun avis en attente de modération.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {avis.map((a) => (
        <div key={a.id} className="rounded-2xl p-6"
          style={{ background: '#ffffff', boxShadow: '0px 20px 40px rgba(25, 28, 30, 0.06)' }}>

          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="font-semibold text-sm"
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>
                {a.user_name ?? 'Anonyme'}
              </p>
              <p className="text-xs mt-0.5" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
                {a.show_title}
              </p>
            </div>

            {/* Étoiles — rendu simple avec du texte */}
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className="material-symbols-outlined"
                  style={{ fontSize: '1rem', color: s <= a.rating ? '#fdd400' : '#e0e3e6',
                    fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
              ))}
            </div>
          </div>

          <p className="text-sm mb-4"
            style={{ color: '#454652', fontFamily: 'Manrope, sans-serif', lineHeight: 1.7 }}>
            {a.comment}
          </p>

          <div className="flex gap-3 items-center">
            {a.status === 'approved' ? (
              <div className="flex items-center gap-1 text-xs font-semibold"
                style={{ color: '#2e7d32', fontFamily: 'Manrope, sans-serif' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>check_circle</span>
                Approuvé
              </div>
            ) : a.status === 'rejected' ? (
              <div className="flex items-center gap-1 text-xs font-semibold"
                style={{ color: '#93000a', fontFamily: 'Manrope, sans-serif' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>cancel</span>
                Rejeté
              </div>
            ) : (
              <>
                <button onClick={() => handleApprove(a.id)}
                  className="flex items-center gap-1 text-sm font-semibold px-4 py-2 rounded-xl"
                  style={{ background: '#000666', color: '#ffffff', fontFamily: 'Manrope, sans-serif', border: 'none', cursor: 'pointer' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>check</span>
                  Valider
                </button>
                <button onClick={() => handleReject(a.id)}
                  className="flex items-center gap-1 text-sm px-4 py-2 rounded-xl"
                  style={{ background: '#ffdad6', color: '#93000a', fontFamily: 'Manrope, sans-serif', border: 'none', cursor: 'pointer' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '1rem' }}>close</span>
                  Rejeter
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
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
