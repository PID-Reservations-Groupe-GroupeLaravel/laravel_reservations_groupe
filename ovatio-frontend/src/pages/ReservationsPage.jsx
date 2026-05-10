import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
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
  const [cancelId, setCancelId]         = useState(null)
  const [ticketMsg, setTicketMsg]       = useState({})
  const [searchParams, setSearchParams] = useSearchParams()

  const paymentStatus = searchParams.get('payment')

  const fetchReservations = () => {
    setLoading(true)
    api.get('/reservations')
      .then((res) => setReservations(res.data.data ?? res.data))
      .catch(() => setError(t('reservations.loadError')))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchReservations() }, [])

  // Stripe Checkout
  const handleCheckout = async (id) => {
    try {
      const res = await api.post(`/reservations/${id}/checkout`)
      window.location.href = res.data.url
    } catch (err) {
      alert(err.response?.data?.message ?? t('reservations.payError'))
    }
  }

  // Annuler une réservation
  const handleCancel = async (id) => {
    if (!window.confirm(t('reservations.cancelConfirm'))) return
    try {
      await api.delete(`/reservations/${id}`)
      fetchReservations()
    } catch {
      alert(t('reservations.cancelError'))
    }
    setCancelId(null)
  }

  // Générer un ticket
  const handleTicket = async (id) => {
    try {
      const res = await api.post(`/reservations/${id}/ticket`)
      setTicketMsg((prev) => ({
        ...prev,
        [id]: `${t('reservations.ticketGenerated')} ${res.data.qr_code}`,
      }))
    } catch (err) {
      setTicketMsg((prev) => ({
        ...prev,
        [id]: err.response?.data?.message ?? t('reservations.ticketError'),
      }))
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
              ticketMsg={ticketMsg[r.id]}
              t={t}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function ReservationCard({ reservation: r, onCancel, onPay, onTicket, ticketMsg, t }) {
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

        {/* Total */}
        {r.total !== undefined && (
          <div className="text-right">
            <div className="text-xl font-bold text-ovatio-blue">{r.total} €</div>
            <div className="text-xs text-gray-400">{t('reservations.total')}</div>
          </div>
        )}
      </div>

      {/* Représentations */}
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

      {/* Message ticket */}
      {ticketMsg && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 text-sm mb-3">
          {ticketMsg}
        </div>
      )}

      {/* Actions */}
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
            onClick={() => onTicket(r.id)}
            className="bg-ovatio-blue text-white text-sm px-4 py-2 rounded-lg hover:bg-ovatio-light transition"
          >
            {t('reservations.generateTicket')}
          </button>
        )}
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
