import apiClient from '@/lib/api/client'
import { Favorite } from '@/types'

export const favoritesService = {
  getAll: async (): Promise<Favorite[]> => {
    const response = await apiClient.get<{ success: boolean; message: string; data: Favorite[] }>('/api/favorites')
    return response.data.data
  },

  add: async (propertyId: string): Promise<Favorite> => {
    const response = await apiClient.post<{ success: boolean; message: string; data: Favorite }>(`/api/favorites/${propertyId}`)
    return response.data.data
  },

  remove: async (propertyId: string): Promise<void> => {
    await apiClient.delete(`/api/favorites/${propertyId}`)
  },
}
