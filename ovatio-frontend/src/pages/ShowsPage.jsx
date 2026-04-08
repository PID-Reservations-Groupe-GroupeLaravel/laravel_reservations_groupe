import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

export default function ShowsPage() {
  const [shows, setShows]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    api.get('/shows')
      .then((res) => setShows(res.data.data ?? res.data))
      .catch(() => setError('Impossible de charger les spectacles.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Spinner />
  if (error)   return <ErrorMsg msg={error} />

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-ovatio-blue mb-2">Spectacles</h1>
      <p className="text-gray-500 mb-8">Découvrez nos prochaines représentations</p>

      {shows.length === 0 ? (
        <p className="text-gray-400 text-center py-16">Aucun spectacle disponible.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {shows.map((show) => (
            <ShowCard key={show.id} show={show} />
          ))}
        </div>
      )}
    </div>
  )
}

function ShowCard({ show }) {
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden">
      {/* Image poster */}
      {show.poster_url ? (
        <img
          src={`/storage/posters/${show.poster_url}`}
          alt={show.title}
          className="w-full h-48 object-cover"
          onError={(e) => { e.target.style.display = 'none' }}
        />
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-ovatio-blue to-ovatio-light flex items-center justify-center">
          <span className="text-5xl">🎭</span>
        </div>
      )}

      <div className="p-5">
        <h2 className="font-bold text-lg text-ovatio-blue mb-1 line-clamp-2">
          {show.title}
        </h2>

        {/* Statut */}
        <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium mb-3 ${
          show.status === 'CONFIRME'
            ? 'bg-green-100 text-green-700'
            : 'bg-yellow-100 text-yellow-700'
        }`}>
          {show.status === 'CONFIRME' ? '✓ Confirmé' : '⏳ À confirmer'}
        </span>

        {show.bookable && (
          <Link
            to={`/shows/${show.id}`}
            className="block text-center bg-ovatio-blue text-white text-sm py-2 rounded-lg hover:bg-ovatio-light transition mt-2"
          >
            Voir les représentations →
          </Link>
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

function ErrorMsg({ msg }) {
  return (
    <div className="max-w-xl mx-auto mt-16 text-center">
      <p className="text-red-500 text-lg">{msg}</p>
    </div>
  )
}
