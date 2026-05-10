import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Injecter automatiquement le token Bearer depuis localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ovatio_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Rediriger vers login si 401, SAUF sur le endpoint de connexion lui-même
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginRequest = error.config?.url?.includes('/login')
    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem('ovatio_token')
      localStorage.removeItem('ovatio_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
