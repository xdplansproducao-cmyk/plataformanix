'use client'

import { useQuery } from '@tanstack/react-query'
import { propertiesService } from '@/services/propertiesService'
import { PropertyFilters, PaginatedResponse, Property } from '@/types'

export function useProperties(filters?: PropertyFilters) {
  return useQuery<PaginatedResponse<Property>>({
    queryKey: ['properties', filters],
    queryFn: () => propertiesService.getAll(filters),
  })
}

export function useProperty(id: string) {
  return useQuery<Property>({
    queryKey: ['properties', id],
    queryFn: () => propertiesService.getById(id),
    enabled: !!id,
  })
}
