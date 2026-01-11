import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/lib/api/client'
import { MenuItem, CreateMenuItemData, UpdateMenuItemData } from '@/types'

type ApiResponse<T> = { success: boolean; data: T }

export function useMenuItems() {
  return useQuery({
    queryKey: ['menuItems'],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<MenuItem[]>>('/api/menu')
      return Array.isArray(data?.data) ? data.data : []
    }
  })
}

export function useCreateMenuItem() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (menuItemData: CreateMenuItemData) => {
      const { data } = await apiClient.post<ApiResponse<MenuItem>>('/api/menu', menuItemData)
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] })
    }
  })
}

export function useUpdateMenuItem() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...updateData }: { id: string; [key: string]: any }) => {
      const { data } = await apiClient.put<ApiResponse<MenuItem>>(`/api/menu/${id}`, updateData)
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] })
    }
  })
}

export function useDeleteMenuItem() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/menu/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] })
    }
  })
}

export function useReorderMenuItems() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (items: { id: string; order: number }[]) => {
      const { data } = await apiClient.put<ApiResponse<MenuItem[]>>('/api/menu/reorder', { items })
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['menuItems'] })
    }
  })
}

export function useAvailablePages() {
  return useQuery({
    queryKey: ['availablePages'],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<any[]>>('/api/menu/pages')
      return Array.isArray(data?.data) ? data.data : []
    }
  })
}

export function useAvailablePosts() {
  return useQuery({
    queryKey: ['availablePosts'],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<any[]>>('/api/menu/posts')
      return Array.isArray(data?.data) ? data.data : []
    }
  })
}
