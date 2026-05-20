import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { QRCodeCanvas } from 'qrcode.react'
import api from '../api/axios'
import { useLanguage } from '../contexts/LanguageContext'

const STATUS_COLORS = {
  'En attente': 'bg-yellow-100 text-yellow-800',
  'Payée':      'bg-green-100 text-green-800',
  'Annulée':    'bg-red-100 text-red-800',
}

export default function ReservationsPage() {
  const { t } = useLanguage()
  const [reservations, setReservations] = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState('')
  const [searchParams, setSearchParams] = useSearchParams()
  const [ticketModal, setTicketModal]   = useState(null) // { qrCode, reservation }

  const paymentStatus = searchParams.get('payment')
  const sessionId     = searchParams.get('session_id')

  const fetchReservations = () => {
    setLoading(true)
    return api.get('/reservations')
      .then((res) => setReservations(res.data.data ?? res.data))
      .catch(() => setError(t('reservations.loadError')))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (paymentStatus === 'success' && sessionId) {
      api.get(`/reservations/verify-payment?session_id=${sessionId}`)
        .then(async (res) => {
          await fetchReservations()
          const reservation = await api.get('/reservations')
            .then(r => (r.data.data ?? r.data).find(rv => rv.id === res.data.reservation_id))
          if (reservation) {
            setTicketModal({ qrCode: res.data.qr_code, reservation })
          }
        })
        .catch(() => fetchReservations())
    } else {
      fetchReservations()
    }
  }, [])

  const handleCheckout = async (id) => {
    try {
      const res = await api.post(`/reservations/${id}/checkout`)
      window.location.href = res.data.url
    } catch (err) {
      alert(err.response?.data?.message ?? t('reservations.payError'))
    }
  }

  const handleCancel = async (id) => {
    if (!window.confirm(t('reservations.cancelConfirm'))) return
    try {
      await api.delete(`/reservations/${id}`)
      fetchReservations()
    } catch {
      alert(t('reservations.cancelError'))
    }
  }

  const handleTicket = async (reservation) => {
    try {
      const res = await api.post(`/reservations/${reservation.id}/ticket`)
      setTicketModal({ qrCode: res.data.qr_code, reservation })
    } catch (err) {
      alert(err.response?.data?.message ?? t('reservations.ticketError'))
    }
  }

  if (loading) return <Spinner />
  if (error)   return <p className="text-center text-red-500 mt-16">{error}</p>

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-ovatio-blue mb-2">{t('reservations.title')}</h1>
      <p className="text-gray-500 mb-8">{t('reservations.subtitle')}</p>

      {paymentStatus === 'success' && (
        <div className="mb-6 rounded-xl px-5 py-4 text-sm font-semibold flex items-center gap-3"
          style={{ background: '#e8f5e9', color: '#2e7d32', border: '1px solid #a5d6a7' }}>
          <span>✅</span>
          <span>{t('reservations.paySuccess')}</span>
          <button onClick={() => setSearchParams({})}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#2e7d32', fontSize: '1rem' }}>
            ×
          </button>
        </div>
      )}

      {paymentStatus === 'cancel' && (
        <div className="mb-6 rounded-xl px-5 py-4 text-sm font-semibold flex items-center gap-3"
          style={{ background: '#ffdad6', color: '#93000a', border: '1px solid #ffb4ab' }}>
          <span>❌</span>
          <span>{t('reservations.payCancel')}</span>
          <button onClick={() => setSearchParams({})}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#93000a', fontSize: '1rem' }}>
            ×
          </button>
        </div>
      )}

      {reservations.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-6xl mb-4">🎭</div>
          <p className="text-lg">{t('reservations.none')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map((r) => (
            <ReservationCard
              key={r.id}
              reservation={r}
              onCancel={handleCancel}
              onPay={handleCheckout}
              onTicket={handleTicket}
              t={t}
            />
          ))}
        </div>
      )}

      {ticketModal && (
        <TicketModal
          qrCode={ticketModal.qrCode}
          reservation={ticketModal.reservation}
          onClose={() => setTicketModal(null)}
          t={t}
        />
      )}
    </div>
  )
}

function ReservationCard({ reservation: r, onCancel, onPay, onTicket, t }) {
  const statusClass = STATUS_COLORS[r.status] ?? 'bg-gray-100 text-gray-700'

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="text-sm text-gray-400">{t('reservations.reservationId')}{r.id}</span>
          <div className="flex items-center gap-3 mt-1">
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusClass}`}>
              {r.status}
            </span>
            {r.booking_date && (
              <span className="text-xs text-gray-400">
                {new Date(r.booking_date).toLocaleDateString('fr-BE')}
              </span>
            )}
          </div>
        </div>

        {r.total !== undefined && (
          <div className="text-right">
            <div className="text-xl font-bold text-ovatio-blue">{r.total} €</div>
            <div className="text-xs text-gray-400">{t('reservations.total')}</div>
          </div>
        )}
      </div>

      {r.representations?.map((repr) => (
        <div key={repr.id} className="bg-gray-50 rounded-lg p-3 mb-3 text-sm">
          <div className="font-medium text-gray-800">{repr.show_title}</div>
          <div className="text-gray-500 mt-0.5">
            📅 {repr.schedule
              ? new Date(repr.schedule).toLocaleDateString('fr-BE', {
                  weekday: 'long', day: 'numeric', month: 'long',
                })
              : '—'
            }
            {repr.quantity && (
              <span className="ml-3">🪑 {repr.quantity} {repr.quantity > 1 ? t('reservations.seatPlural') : t('reservations.seatSingular')}</span>
            )}
            {repr.unit_price && (
              <span className="ml-3">💶 {repr.unit_price} €/{t('reservations.seatSingular')}</span>
            )}
          </div>
        </div>
      ))}

      <div className="flex gap-3 mt-4 flex-wrap">
        {r.status === 'En attente' && (
          <>
            <button
              onClick={() => onPay(r.id)}
              className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-700 transition font-semibold"
            >
              💳 {t('reservations.payStripe')}
            </button>
            <button
              onClick={() => onCancel(r.id)}
              className="bg-red-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              {t('reservations.cancel')}
            </button>
          </>
        )}
        {r.status === 'Payée' && (
          <button
            onClick={() => onTicket(r)}
            className="text-sm px-5 py-2 rounded-lg font-semibold transition"
            style={{ background: '#000666', color: '#fff' }}
          >
            🎟️ {t('reservations.generateTicket')}
          </button>
        )}
      </div>
    </div>
  )
}

function TicketModal({ qrCode, reservation: r, onClose, t }) {
  const canvasRef = useRef(null)

  const showTitle = r.representations?.[0]?.show_title ?? '—'
  const showDate  = r.representations?.[0]?.schedule
    ? new Date(r.representations[0].schedule).toLocaleDateString('fr-BE', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      })
    : '—'
  const totalSeats = r.representations?.reduce((acc, rep) => acc + (rep.quantity ?? 1), 0) ?? 1

  const handleDownload = () => {
    const canvas = document.getElementById('ovatio-ticket-qr')
    if (!canvas) return
    const url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = `billet-ovatio-${r.id}.png`
    a.click()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl overflow-hidden"
        style={{ background: '#fff', boxShadow: '0 24px 80px rgba(0,6,102,0.25)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-8 pt-8 pb-5 text-center"
          style={{ background: 'linear-gradient(135deg, #000666 0%, #1a237e 100%)' }}>
          <p className="text-xs font-bold tracking-widest mb-1"
            style={{ color: 'rgba(255,255,255,0.55)', fontFamily: 'Manrope, sans-serif', letterSpacing: '0.18em' }}>
            OVATIO.BE
          </p>
          <h2 className="text-2xl font-black text-white mb-0.5"
            style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
            {t('reservations.ticketModalTitle')}
          </h2>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.65)', fontFamily: 'Manrope, sans-serif' }}>
            {t('reservations.reservationId')}{r.id}
          </p>
        </div>

        {/* Tirets (découpe billet) */}
        <div className="flex items-center px-6" style={{ margin: '-1px 0' }}>
          <div className="w-5 h-5 rounded-full shrink-0" style={{ background: '#f7f9fc', border: '1px solid #e0e3e6' }} />
          <div className="flex-1 border-t-2 border-dashed" style={{ borderColor: '#e0e3e6' }} />
          <div className="w-5 h-5 rounded-full shrink-0" style={{ background: '#f7f9fc', border: '1px solid #e0e3e6' }} />
        </div>

        {/* Infos spectacle */}
        <div className="px-8 py-5 space-y-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-0.5"
              style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
              {t('reservations.ticketShow')}
            </p>
            <p className="text-base font-bold" style={{ color: '#191c1e', fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
              {showTitle}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-0.5"
                style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
                {t('reservations.ticketDate')}
              </p>
              <p className="text-sm font-medium" style={{ color: '#191c1e', fontFamily: 'Manrope, sans-serif' }}>
                {showDate}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-0.5"
                style={{ color: '#767683', fontFamily: 'Manrope, sans-serif' }}>
                {t('reservations.ticketSeats')}
              </p>
              <p className="text-sm font-medium" style={{ color: '#191c1e', fontFamily: 'Manrope, sans-serif' }}>
                {totalSeats} {totalSeats > 1 ? t('reservations.seatPlural') : t('reservations.seatSingular')}
              </p>
            </div>
          </div>
        </div>

        {/* Tirets */}
        <div className="flex items-center px-6">
          <div className="w-5 h-5 rounded-full shrink-0" style={{ background: '#f7f9fc', border: '1px solid #e0e3e6' }} />
          <div className="flex-1 border-t-2 border-dashed" style={{ borderColor: '#e0e3e6' }} />
          <div className="w-5 h-5 rounded-full shrink-0" style={{ background: '#f7f9fc', border: '1px solid #e0e3e6' }} />
        </div>

        {/* QR code */}
        <div className="px-8 py-6 flex flex-col items-center gap-3">
          <div className="rounded-2xl p-4" style={{ background: '#f7f9fc', border: '1px solid #e0e3e6' }}>
            <QRCodeCanvas
              id="ovatio-ticket-qr"
              value={qrCode}
              size={180}
              bgColor="#f7f9fc"
              fgColor="#000666"
              level="M"
              ref={canvasRef}
            />
          </div>
          <p className="text-xs font-mono text-center" style={{ color: '#767683' }}>{qrCode}</p>
        </div>

        {/* Actions */}
        <div className="px-8 pb-8 flex gap-3">
          <button
            onClick={handleDownload}
            className="flex-1 text-sm font-semibold py-3 rounded-xl transition"
            style={{ background: '#000666', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }}
          >
            ⬇ {t('reservations.ticketDownload')}
          </button>
          <button
            onClick={onClose}
            className="text-sm py-3 px-5 rounded-xl transition"
            style={{ background: '#f2f4f7', color: '#454652', border: 'none', cursor: 'pointer', fontFamily: 'Manrope, sans-serif' }}
          >
            {t('reservations.ticketClose')}
          </button>
        </div>

        {/* Bouton fermer (coin) */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(255,255,255,0.15)',
            border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer',
            color: '#fff', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          ×
        </button>
      </div>
    </div>
  )
}

function Spinner() {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="w-10 h-10 border-4 border-blue-200 border-t-ovatio-blue rounded-full animate-spin" />
    </div>
  )
}
