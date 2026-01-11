import { useQuery } from '@tanstack/react-query'
import apiClient from '@/lib/api/client'
import { MenuItem } from '@/types'

export function useDynamicMenu() {
  return useQuery({
    queryKey: ['dynamicMenu'],
    queryFn: async () => {
      const { data } = await apiClient.get<{success: boolean, data: MenuItem[]}>('/api/menu')
      return data.data // Extrai apenas o array de MenuItem
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
