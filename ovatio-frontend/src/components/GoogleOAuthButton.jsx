export default function GoogleOAuthButton({ t }) {
  const handleGoogleAuth = () => {
    const backendUrl = 'http://localhost:8000'
    window.location.href = `${backendUrl}/api/auth/google`
  }

  const handleAppleAuth = () => {
    const backendUrl = 'http://localhost:8000'
    window.location.href = `${backendUrl}/api/auth/apple`
  }

  return (
    <div className="flex gap-3">
      {/* Google Button */}
      <button
        type="button"
        onClick={handleGoogleAuth}
        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 font-semibold text-sm transition-all hover:opacity-80"
        style={{
          borderColor: '#e0e3e6',
          color: '#191c1e',
          fontFamily: '"Plus Jakarta Sans", sans-serif',
          background: '#ffffff'
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Google
      </button>

      {/* Apple Button */}
      <button
        type="button"
        onClick={handleAppleAuth}
        disabled
        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 font-semibold text-sm transition-all opacity-50 cursor-not-allowed"
        style={{
          borderColor: '#e0e3e6',
          color: '#191c1e',
          fontFamily: '"Plus Jakarta Sans", sans-serif',
          background: '#ffffff'
        }}
        title="Disponible bientôt - Nécessite Apple Developer Program"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.3-3.14-2.53C4.25 17 2.94 12.46 4.7 9.12c.9-1.56 2.64-2.55 4.48-2.58 1.3-.02 2.53.75 3.32.75.78 0 2.26-1.01 3.79-.85.64.1 2.45.44 3.61 3.3-.36.23-2.09 1.28-2.06 3.85.03 3.02 2.69 4.05 2.95 4.1 0 0-.37 1.02-1.24 1.97l-1.52-.12c-1.32-.15-1.78.38-3.47.4z" />
        </svg>
        Apple
      </button>
    </div>
  )
}
