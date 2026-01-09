import apiClient from '@/lib/api/client'
import { Property, PropertyFilters, PaginatedResponse, CreatePropertyData } from '@/types'

export const propertiesService = {
  getAll: async (filters?: PropertyFilters): Promise<PaginatedResponse<Property>> => {
    const params = new URLSearchParams()
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, String(value))
        }
      })
    }

    const response = await apiClient.get<{ success: boolean; message: string; data: PaginatedResponse<Property> }>(
      `/api/properties?${params.toString()}`
    )
    // Extrai o campo 'data' da resposta do backend que vem como { success, message, data }
    return response.data.data
  },

  getById: async (id: string): Promise<Property> => {
    const response = await apiClient.get<{ success: boolean; message: string; data: Property }>(`/api/properties/${id}`)
    // Extrai o campo 'data' da resposta do backend
    return response.data.data
  },

  create: async (data: CreatePropertyData, images: File[]): Promise<Property> => {
    const formData = new FormData()
    formData.append('data', JSON.stringify(data))
    
    images.forEach((image) => {
      formData.append('images', image)
    })

    const response = await apiClient.post<{ success: boolean; message: string; data: Property }>('/api/properties', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    // Extrai o campo 'data' da resposta do backend
    return response.data.data
  },

  update: async (id: string, data: Partial<CreatePropertyData>, images?: File[]): Promise<Property> => {
    const formData = new FormData()
    formData.append('data', JSON.stringify(data))
    
    if (images && images.length > 0) {
      images.forEach((image) => {
        formData.append('images', image)
      })
    }

    const response = await apiClient.patch<{ success: boolean; message: string; data: Property }>(`/api/properties/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    // Extrai o campo 'data' da resposta do backend
    return response.data.data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/properties/${id}`)
  },
}
