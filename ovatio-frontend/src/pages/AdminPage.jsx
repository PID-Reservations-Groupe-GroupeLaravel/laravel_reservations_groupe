import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import api from '../api/axios'

const TAB_STYLE_ACTIVE = {
  background: '#000666', color: '#ffffff',
  fontFamily: 'Manrope, sans-serif', fontWeight: 600,
  padding: '0.5rem 1.25rem', borderRadius: '0.625rem',
  fontSize: '0.875rem', border: 'none', cursor: 'pointer',
}
const TAB_STYLE_INACTIVE = {
  background: '#f2f4f7', color: '#454652',
  fontFamily: 'Manrope, sans-serif', fontWeight: 500,
  padding: '0.5rem 1.25rem', borderRadius: '0.625rem',
  fontSize: '0.875rem', border: 'none', cursor: 'pointer',
}

export default function AdminPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('demandes')

  useEffect(() => {
    if (user && !user.roles?.includes('admin')) {
      navigate('/')
    }
  }, [user, navigate])

  if (!user) return null

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      <div className="rounded-2xl p-8 mb-8 text-white"
        style={{ background: 'linear-gradient(135deg, #000666 0%, #1a237e 100%)' }}>
        <div className="flex items-center gap-3 mb-2">
          <span className="material-symbols-outlined text-4xl">admin_panel_settings</span>
          <h1 className="text-3xl font-bold" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            Administration
          </h1>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Manrope, sans-serif', fontSize: '0.875rem' }}>
          Gérez les demandes producteurs et la modération des avis.
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        <button style={tab === 'demandes' ? TAB_STYLE_ACTIVE : TAB_STYLE_INACTIVE} onClick={() => setTab('demandes')}>
          Demandes producteurs
        </button>
        <button style={tab === 'avis' ? TAB_STYLE_ACTIVE : TAB_STYLE_INACTIVE} onClick={() => setTab('avis')}>
          Modération des avis
        </button>
      </div>

      {tab === 'demandes' && <DemandesTab />}
      {tab === 'avis' && <AvisTab />}
    </div>
  )
}

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
    } catch { alert('Erreur lors de l\'approbation.') }
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
      <div className="text-center py-16" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
        <span className="material-symbols-outlined text-5xl mb-3 block">inbox</span>
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
              <h3 className="font-bold text-lg" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>
                {d.company_name}
              </h3>
              <p className="text-sm" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
                Par {d.user_name ?? d.user_email} — {d.created_at}
              </p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full"
              style={{ background: '#f2f4f7', color: '#454652', fontFamily: 'Manrope, sans-serif' }}>
              En attente
            </span>
          </div>
          <p className="text-sm mb-4" style={{ color: '#454652', fontFamily: 'Manrope, sans-serif', lineHeight: 1.6 }}>
            {d.description}
          </p>
          {d.website && (
            <p className="text-xs mb-4" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
               {d.website}  {d.phone && `   ${d.phone}`}
            </p>
          )}
          <div className="flex gap-3">
            <button onClick={() => handleApprove(d.id)} className="text-sm font-semibold px-4 py-2 rounded-xl"
              style={{ background: '#000666', color: '#ffffff', fontFamily: 'Manrope, sans-serif', border: 'none', cursor: 'pointer' }}>
              ✓ Approuver
            </button>
            <button onClick={() => handleReject(d.id)} className="text-sm px-4 py-2 rounded-xl"
              style={{ background: '#ffdad6', color: '#93000a', fontFamily: 'Manrope, sans-serif', border: 'none', cursor: 'pointer' }}>
              ✕ Rejeter
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

function AvisTab() {
  const [avis, setAvis]       = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    api.get('/admin/avis')
      .then((res) => setAvis(res.data))
      .catch(() => setError('Impossible de charger les avis.'))
      .finally(() => setLoading(false))
  }, [])

  const handleApprove = async (id) => {
    try {
      await api.post(`/admin/avis/${id}/approve`)
      setAvis((prev) => prev.map((a) => a.id === id ? { ...a, status: 'approved' } : a))
    } catch { alert('Erreur.') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet avis ?')) return
    try {
      await api.delete(`/admin/avis/${id}`)
      setAvis((prev) => prev.filter((a) => a.id !== id))
    } catch { alert('Erreur lors de la suppression.') }
  }

  if (loading) return <Spinner />
  if (error)   return <ErrorMsg msg={error} />

  if (avis.length === 0) {
    return (
      <div className="text-center py-16" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
        <span className="material-symbols-outlined text-5xl mb-3 block">rate_review</span>
        Aucun avis à modérer.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {avis.map((a) => (
        <div key={a.id} className="rounded-2xl p-6"
          style={{ background: '#ffffff', boxShadow: '0px 20px 40px rgba(25, 28, 30, 0.06)' }}>
          <div className="flex items-start justify-between mb-2">
            <div>
              <span className="font-semibold text-sm" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', color: '#191c1e' }}>
                {a.user_name ?? 'Anonyme'}
              </span>
              <span className="mx-2 text-xs" style={{ color: '#c6c5d4' }}>•</span>
              <span className="text-xs" style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>{a.show_title}</span>
            </div>
            <div className="flex gap-1">
              {[1,2,3,4,5].map((s) => (
                <span key={s} className="text-sm" style={{ color: s <= a.rating ? '#fdd400' : '#c6c5d4' }}>★</span>
              ))}
            </div>
          </div>
          <p className="text-sm mb-4" style={{ color: '#454652', fontFamily: 'Manrope, sans-serif', lineHeight: 1.6 }}>
            {a.comment}
          </p>
          <div className="flex gap-3 items-center">
            {a.status !== 'approved' && (
              <button onClick={() => handleApprove(a.id)} className="text-sm font-semibold px-4 py-2 rounded-xl"
                style={{ background: '#000666', color: '#ffffff', fontFamily: 'Manrope, sans-serif', border: 'none', cursor: 'pointer' }}>
                ✓ Approuver
              </button>
            )}
            <button onClick={() => handleDelete(a.id)} className="text-sm px-4 py-2 rounded-xl"
              style={{ background: '#ffdad6', color: '#93000a', fontFamily: 'Manrope, sans-serif', border: 'none', cursor: 'pointer' }}>
              🗑 Supprimer
            </button>
            {a.status === 'approved' && (
              <span className="text-xs font-medium" style={{ color: '#4caf50', fontFamily: 'Manrope, sans-serif' }}>✓ Approuvé</span>
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
      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin" />
    </div>
  )
}

function ErrorMsg({ msg }) {
  return <p className="text-center py-8 text-sm" style={{ color: '#ba1a1a', fontFamily: 'Manrope, sans-serif' }}>{msg}</p>
}