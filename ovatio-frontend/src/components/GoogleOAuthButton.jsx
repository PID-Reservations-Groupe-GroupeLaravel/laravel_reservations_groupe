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
        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 font-semibold text-sm transition-all hover:opacity-80"
        style={{
          borderColor: '#e0e3e6',
          color: '#191c1e',
          fontFamily: '"Plus Jakarta Sans", sans-serif',
          background: '#ffffff'
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.05 13.5c-.91 2.92.37 5.25 2.85 6.75.96.52 2.83 1.31 3.72 1.42v-8.5c-.504.031-3.016-.435-3.72-1.22-.374-.405-.563-.908-.563-1.42 0-1.04.896-2.082 2.023-2.082h1.77V8.075h-1.77C19.46 8.075 17.92 9.632 17.92 11.77c0 1.153.408 2.176 1.13 2.73zm-11 .25c1.066 0 2.13-.533 2.13-1.5s-1.064-1.5-2.13-1.5c-1.066 0-2.13.533-2.13 1.5s1.064 1.5 2.13 1.5zm0-9c1.066 0 2.13-.533 2.13-1.5S7.12 1.75 6.05 1.75 3.92 2.283 3.92 3.25s1.064 1.5 2.13 1.5z" />
        </svg>
        Apple
      </button>
    </div>
  )
}
