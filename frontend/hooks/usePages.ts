import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/lib/api/client'
import { Page, CreatePageData, UpdatePageData, PageFilters, PaginatedResponse } from '@/types'

export function usePages(filters: PageFilters = {}) {
  return useQuery({
    queryKey: ['pages', filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString())
        }
      })
      
      const { data } = await apiClient.get<PaginatedResponse<Page>>(`/api/pages?${params.toString()}`)
      return data
    }
  })
}

export function usePage(id: string) {
  return useQuery({
    queryKey: ['page', id],
    queryFn: async () => {
      const { data } = await apiClient.get<Page>(`/api/pages/${id}`)
      return data
    },
    enabled: !!id
  })
}

export function useCreatePage() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (pageData: CreatePageData) => {
      const { data } = await apiClient.post<Page>('/api/pages', pageData)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] })
    }
  })
}

export function useUpdatePage() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...pageData }: UpdatePageData & { id: string }) => {
      const { data } = await apiClient.put<Page>(`/api/pages/${id}`, pageData)
      return data
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['pages'] })
      queryClient.invalidateQueries({ queryKey: ['page', id] })
    }
  })
}

export function useDeletePage() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/pages/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] })
    }
  })
}
