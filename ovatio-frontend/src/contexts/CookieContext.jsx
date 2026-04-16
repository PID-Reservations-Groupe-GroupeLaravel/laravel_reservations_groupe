import { createContext, useContext, useState } from 'react'

const CookieContext = createContext(null)
const STORAGE_KEY = 'ovatio_cookie_consent'

function loadPrefs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function CookieProvider({ children }) {
  const [prefs, setPrefs] = useState(() => loadPrefs())

  const acceptAll = () => {
    const p = { necessaires: true, analytiques: true, marketing: true }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p))
    setPrefs(p)
  }

  const declineAll = () => {
    const p = { necessaires: true, analytiques: false, marketing: false }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p))
    setPrefs(p)
  }

  const savePrefs = (newPrefs) => {
    const p = { ...newPrefs, necessaires: true }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p))
    setPrefs(p)
  }

  const reset = () => {
    localStorage.removeItem(STORAGE_KEY)
    setPrefs(null)
  }

  const consent = prefs === null ? null : (prefs.analytiques ? 'accepted' : 'declined')

  return (
    <CookieContext.Provider value={{ consent, prefs, acceptAll, declineAll, savePrefs, reset }}>
      {children}
    </CookieContext.Provider>
  )
}

export function useCookies() {
  return useContext(CookieContext)
}