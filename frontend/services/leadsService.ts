import apiClient from '@/lib/api/client'
import { Lead, CreateLeadData } from '@/types'

export const leadsService = {
  create: async (data: CreateLeadData): Promise<Lead> => {
    const response = await apiClient.post<{ success: boolean; message: string; data: Lead }>('/api/leads', data)
    // Extrai o campo 'data' da resposta do backend
    return response.data.data
  },

  getAll: async (): Promise<Lead[]> => {
    const response = await apiClient.get<{ success: boolean; message: string; data: Lead[] }>('/api/leads')
    // Extrai o campo 'data' da resposta do backend
    return response.data.data
  },

  getUnreadCount: async (): Promise<number> => {
    const response = await apiClient.get<{ success: boolean; message: string; data: { count: number } }>(
      '/api/leads/unread-count'
    )
    return response.data.data.count
  },

  markAsRead: async (id: string): Promise<Lead> => {
    const response = await apiClient.patch<{ success: boolean; message: string; data: Lead }>(`/api/leads/${id}/read`)
    return response.data.data
  },

  getCount: async (): Promise<number> => {
    const response = await apiClient.get<{ success: boolean; message: string; data: { count: number } }>(
      '/api/leads/count'
    )
    return response.data.data.count
  },
}
