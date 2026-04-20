import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'

export default function ProfilePage() {
  const { user } = useAuth()

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-8">
      {/* Mes billets actifs */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Mes billets actifs</h2>
        <p className="text-sm text-gray-400">Aucune réservation à venir.</p>
        <Link to="/reservations"
          className="mt-4 inline-block text-xs text-ovatio-blue hover:underline">
          Voir toutes mes réservations →
        </Link>
      </div>

      {/* Mon Profil */}
      <div className="md:col-span-2 bg-white border border-gray-200 rounded-xl p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Mon Profil</h1>

        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-full bg-ovatio-blue flex items-center justify-center text-white text-3xl font-bold">
            {user?.firstname?.[0]}{user?.lastname?.[0]}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{user?.firstname} {user?.lastname}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <p className="text-xs text-gray-400 mt-1">Langue : {user?.langue?.toUpperCase()}</p>
          </div>
        </div>

        <div className="space-y-3 text-sm text-gray-700 mb-8">
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500">Prénom</span>
            <span className="font-medium">{user?.firstname}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500">Nom</span>
            <span className="font-medium">{user?.lastname}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="text-gray-500">Email</span>
            <span className="font-medium">{user?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Langue</span>
            <span className="font-medium">{user?.langue?.toUpperCase()}</span>
          </div>
        </div>

        <Link to="/profil/modifier"
          className="inline-block bg-ovatio-blue text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
          Modifier mes informations
        </Link>
      </div>
    </div>
  )
}
