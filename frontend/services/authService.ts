import apiClient from '@/lib/api/client'
import { AuthResponse, User } from '@/types'

export const authService = {
  register: async (data: { name: string; email: string; password: string }): Promise<AuthResponse> => {
    const response = await apiClient.post<{ success: boolean; message: string; data: AuthResponse }>('/api/auth/register', data)
    // Extrai o campo 'data' da resposta do backend
    return response.data.data
  },

  login: async (data: { email: string; password: string }): Promise<AuthResponse> => {
    const response = await apiClient.post<{ success: boolean; message: string; data: AuthResponse }>('/api/auth/login', data)
    // Extrai o campo 'data' da resposta do backend
    return response.data.data
  },

  getMe: async (): Promise<User> => {
    const response = await apiClient.get<{ success: boolean; message: string; data: User }>('/api/auth/me')
    // Extrai o campo 'data' da resposta do backend
    return response.data.data
  },
}
