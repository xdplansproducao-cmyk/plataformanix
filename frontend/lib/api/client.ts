import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor para adicionar token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor para tratar erros
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Don't redirect for GET requests to properties or auth/me
      if (error.config?.url?.includes('/api/auth/me') ||
          (error.config?.method === 'get' && error.config?.url?.includes('/api/properties'))) {
        // don't redirect
      } else {
        // Token inválido ou expirado
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          window.location.href = '/login'
        }
      }
    }

    if (error.response?.status === 429) {
      // Rate limit
      const message = error.response?.data as { message?: string }
      throw new Error(message?.message || 'Muitas requisições. Tente novamente em alguns instantes.')
    }

    return Promise.reject(error)
  }
)

export default apiClient
