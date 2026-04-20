import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function EditProfilePage() {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    firstname: user?.firstname || '',
    lastname: user?.lastname || '',
    email: user?.email || '',
    langue: user?.langue || 'fr',
  })
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault(); setErrors({})
    try {
      const token = localStorage.getItem('ovatio_token')
      const { data } = await axios.put('/api/user/profile', form, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUser(data)
      setSuccess(true)
      setTimeout(() => navigate('/profil'), 1500)
    } catch (err) {
      if (err.response?.status === 422) setErrors(err.response.data.errors || {})
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Modifier mes informations</h1>
      {success && <p className="text-green-600 text-sm mb-4">Profil mis à jour !</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { name: 'firstname', label: 'Prénom', type: 'text' },
          { name: 'lastname', label: 'Nom', type: 'text' },
          { name: 'email', label: 'Email', type: 'email' },
        ].map(({ name, label, type }) => (
          <div key={name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <input type={type} name={name} value={form[name]} onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ovatio-blue" />
            {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name][0]}</p>}
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Langue</label>
          <select name="langue" value={form.langue} onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option value="fr">Français</option>
            <option value="en">English</option>
            <option value="nl">Nederlands</option>
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit"
            className="bg-ovatio-blue text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
            Enregistrer
          </button>
          <button type="button" onClick={() => navigate('/profil')}
            className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg text-sm hover:bg-gray-50 transition">
            Annuler
          </button>
        </div>
      </form>
    </div>
  )
}
