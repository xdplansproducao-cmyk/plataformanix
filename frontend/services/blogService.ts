import apiClient from '@/lib/api/client'
import { BlogPost, BlogPostFilters, CreateBlogPostData, UpdateBlogPostData, BlogPaginatedResponse } from '@/types'

export const blogService = {
  getAll: async (filters?: BlogPostFilters): Promise<BlogPaginatedResponse> => {
    const response = await apiClient.get<{ success: boolean; message: string; data: BlogPaginatedResponse }>(
      '/api/blog',
      { params: filters }
    )
    return response.data.data
  },

  getById: async (id: string): Promise<BlogPost> => {
    const response = await apiClient.get<{ success: boolean; message: string; data: BlogPost }>(`/api/blog/${id}`)
    return response.data.data
  },

  getBySlug: async (slug: string): Promise<BlogPost> => {
    const response = await apiClient.get<{ success: boolean; message: string; data: BlogPost }>(`/api/blog/slug/${slug}`)
    return response.data.data
  },

  getFeatured: async (limit = 3): Promise<BlogPost[]> => {
    const response = await apiClient.get<{ success: boolean; message: string; data: BlogPost[] }>(
      '/api/blog/featured',
      { params: { limit } }
    )
    return response.data.data
  },

  getRelated: async (id: string, limit = 3): Promise<BlogPost[]> => {
    const response = await apiClient.get<{ success: boolean; message: string; data: BlogPost[] }>(
      `/api/blog/${id}/related`,
      { params: { limit } }
    )
    return response.data.data
  },

  getCategories: async (): Promise<string[]> => {
    const response = await apiClient.get<{ success: boolean; message: string; data: string[] }>('/api/blog/categories')
    return response.data.data
  },

  getTags: async (): Promise<{ tag: string; count: number }[]> => {
    const response = await apiClient.get<{ success: boolean; message: string; data: { tag: string; count: number }[] }>(
      '/api/blog/tags'
    )
    return response.data.data
  },

  create: async (data: CreateBlogPostData, coverImage?: File): Promise<BlogPost> => {
    const formData = new FormData()
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value))
        } else {
          formData.append(key, String(value))
        }
      }
    })

    if (coverImage) {
      formData.append('coverImage', coverImage)
    }

    const response = await apiClient.post<{ success: boolean; message: string; data: BlogPost }>(
      '/api/blog',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data.data
  },

  update: async (id: string, data: UpdateBlogPostData, coverImage?: File): Promise<BlogPost> => {
    const formData = new FormData()
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value))
        } else {
          formData.append(key, String(value))
        }
      }
    })

    if (coverImage) {
      formData.append('coverImage', coverImage)
    }

    const response = await apiClient.put<{ success: boolean; message: string; data: BlogPost }>(
      `/api/blog/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data.data
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/blog/${id}`)
  },
}
