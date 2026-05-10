import { createContext, useContext, useState } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('ovatio_user')
    return stored ? JSON.parse(stored) : null
  })

  const [token, setToken] = useState(() => localStorage.getItem('ovatio_token'))

  // Connexion
  const login = async (email, password, remember = false) => {
    const res = await api.post('/login', { email, password })
    const { token: newToken, user: newUser } = res.data

    localStorage.setItem('ovatio_token', newToken)
    localStorage.setItem('ovatio_user', JSON.stringify(newUser))

    setToken(newToken)
    setUser(newUser)
    return newUser
  }

  // Déconnexion
  const logout = () => {
    localStorage.removeItem('ovatio_token')
    localStorage.removeItem('ovatio_user')
    setToken(null)
    setUser(null)
  }

  // Rafraîchit le profil utilisateur depuis le serveur (rôles mis à jour après approbation)
  const refreshUser = async () => {
    try {
      const res = await api.get('/user')
      const updated = res.data
      localStorage.setItem('ovatio_user', JSON.stringify(updated))
      setUser(updated)
      return updated
    } catch {
      return null
    }
  }

  const isAdmin = () => user?.roles?.includes('admin') ?? false

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAdmin, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
