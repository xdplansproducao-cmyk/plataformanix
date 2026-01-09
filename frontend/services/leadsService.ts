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
}
