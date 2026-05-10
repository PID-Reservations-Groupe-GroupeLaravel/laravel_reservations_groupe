import { createContext, useContext, useState } from 'react'
import fr from '../i18n/fr'
import en from '../i18n/en'
import nl from '../i18n/nl'

const TRANSLATIONS = { fr, en, nl }

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(localStorage.getItem('langue') ?? 'fr')

  const setLanguage = (code) => {
    setLang(code)
    localStorage.setItem('langue', code)
  }

  const t = (path) => {
    const keys = path.split('.')
    let val = TRANSLATIONS[lang] ?? TRANSLATIONS.fr
    for (const k of keys) {
      val = val?.[k]
      if (val === undefined) break
    }
    // fallback to french if key missing in target lang
    if (val === undefined) {
      val = TRANSLATIONS.fr
      for (const k of keys) val = val?.[k]
    }
    return val ?? path
  }

  return (
    <LanguageContext.Provider value={{ lang, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
