import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

/**
 * Page de callback OAuth — Laravel redirige ici après Google/Apple avec
 * token + user encodés en base64 dans les query params.
 */
export default function OAuthCallbackPage() {
  const [params] = useSearchParams()
  const navigate  = useNavigate()
  const { setUserFromOAuth } = useAuth()

  useEffect(() => {
    const token = params.get('token')
    const userB64 = params.get('user')

    if (!token || !userB64) {
      navigate('/login?oauth_error=missing')
      return
    }

    try {
      const user = JSON.parse(atob(userB64))
      localStorage.setItem('ovatio_token', token)
      localStorage.setItem('ovatio_user', JSON.stringify(user))
      // Met à jour le contexte Auth
      if (setUserFromOAuth) setUserFromOAuth(user)
      navigate('/shows', { replace: true })
    } catch {
      navigate('/login?oauth_error=parse')
    }
  }, [params, navigate, setUserFromOAuth])

  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #000666 0%, #1a237e 100%)' }}>
      <div className="text-center text-white">
        <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
        <p style={{ fontFamily: 'Manrope, sans-serif', opacity: 0.7 }}>Connexion en cours…</p>
      </div>
    </div>
  )
}
