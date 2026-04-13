import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import PrivateRoute from './components/PrivateRoute'

import LoginPage        from './pages/LoginPage'
import RegisterPage     from './pages/RegisterPage'
import ShowsPage        from './pages/ShowsPage'
import ShowDetailPage   from './pages/ShowDetailPage'
import ReservationsPage from './pages/ReservationsPage'
import SessionsPage     from './pages/SessionsPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Page d'accueil → spectacles */}
              <Route path="/" element={<Navigate to="/shows" replace />} />

              {/* Auth */}
              <Route path="/login"    element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Public */}
              <Route path="/shows"      element={<ShowsPage />} />
              <Route path="/shows/:id"  element={<ShowDetailPage />} />

              {/* Privé (token requis) */}
              <Route path="/reservations" element={
                <PrivateRoute><ReservationsPage /></PrivateRoute>
              } />
              <Route path="/sessions" element={
                <PrivateRoute><SessionsPage /></PrivateRoute>
              } />

              {/* 404 */}
              <Route path="*" element={
                <div className="text-center py-24">
                  <div className="text-6xl mb-4">🎭</div>
                  <h2 className="text-2xl font-bold text-gray-700">Page introuvable</h2>
                  <a href="/" className="text-blue-600 hover:underline mt-4 inline-block">
                    Retour à l'accueil
                  </a>
                </div>
              } />
            </Routes>
          </main>

          <footer className="bg-ovatio-blue text-blue-200 text-center text-xs py-4 mt-8">
            Ovatio — Projet PID ICC 2025-2026
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}
