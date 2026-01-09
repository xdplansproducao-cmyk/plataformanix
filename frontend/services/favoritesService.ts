import apiClient from '@/lib/api/client'
import { Favorite } from '@/types'

export const favoritesService = {
  getAll: async (): Promise<Favorite[]> => {
    const response = await apiClient.get<Favorite[]>('/api/favorites')
    return response.data
  },

  add: async (propertyId: string): Promise<Favorite> => {
    const response = await apiClient.post<Favorite>(`/api/favorites/${propertyId}`)
    return response.data
  },

  remove: async (propertyId: string): Promise<void> => {
    await apiClient.delete(`/api/favorites/${propertyId}`)
  },
}
