import { createContext, useContext, useState } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Vérifier d'abord localStorage (remember me)
    const storedLocal = localStorage.getItem('ovatio_user')
    if (storedLocal) {
      const rememberUntil = localStorage.getItem('ovatio_remember_until')
      if (rememberUntil && new Date(rememberUntil) > new Date()) {
        return JSON.parse(storedLocal)
      } else {
        // Token expiré, nettoyer
        localStorage.removeItem('ovatio_token')
        localStorage.removeItem('ovatio_user')
        localStorage.removeItem('ovatio_remember_until')
      }
    }
    // Sinon vérifier sessionStorage
    const storedSession = sessionStorage.getItem('ovatio_user')
    return storedSession ? JSON.parse(storedSession) : null
  })

  const [token, setToken] = useState(() => {
    // Vérifier d'abord localStorage
    const tokenLocal = localStorage.getItem('ovatio_token')
    if (tokenLocal) return tokenLocal
    // Sinon sessionStorage
    return sessionStorage.getItem('ovatio_token')
  })

  // Connexion
  const login = async (email, password, remember = false) => {
    const res = await api.post('/login', { email, password })
    const { token: newToken, user: newUser } = res.data

    if (remember) {
      // Rester connecté pendant 30 jours
      localStorage.setItem('ovatio_token', newToken)
      localStorage.setItem('ovatio_user', JSON.stringify(newUser))
      localStorage.setItem('ovatio_remember_until', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString())
    } else {
      // Connexion jusqu'à fermeture du navigateur
      sessionStorage.setItem('ovatio_token', newToken)
      sessionStorage.setItem('ovatio_user', JSON.stringify(newUser))
    }

    setToken(newToken)
    setUser(newUser)
    return newUser
  }

  // Déconnexion
  const logout = () => {
    // Nettoyer localStorage
    localStorage.removeItem('ovatio_token')
    localStorage.removeItem('ovatio_user')
    localStorage.removeItem('ovatio_remember_until')
    // Nettoyer sessionStorage
    sessionStorage.removeItem('ovatio_token')
    sessionStorage.removeItem('ovatio_user')
    setToken(null)
    setUser(null)
  }

  // Rafraîchit le profil utilisateur depuis le serveur (rôles mis à jour après approbation)
  const refreshUser = async () => {
    try {
      const res = await api.get('/user')
      const updated = res.data
      // Sauvegarder dans le stockage approprié
      if (localStorage.getItem('ovatio_user')) {
        localStorage.setItem('ovatio_user', JSON.stringify(updated))
      } else {
        sessionStorage.setItem('ovatio_user', JSON.stringify(updated))
      }
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
