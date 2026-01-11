'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { leadsService } from '@/services/leadsService'
import { Lead, CreateLeadData } from '@/types'
import toast from 'react-hot-toast'

export function useLeads() {
  return useQuery<Lead[]>({
    queryKey: ['leads'],
    queryFn: leadsService.getAll,
  })
}

export function useUnreadLeadsCount() {
  return useQuery<number>({
    queryKey: ['leads', 'unreadCount'],
    queryFn: leadsService.getUnreadCount,
    refetchInterval: 10000,
  })
}

export function useLeadsCount() {
  return useQuery<number>({
    queryKey: ['leads', 'count'],
    queryFn: leadsService.getCount,
    staleTime: 30 * 1000,
  })
}

export function useMarkLeadAsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: leadsService.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
      queryClient.invalidateQueries({ queryKey: ['leads', 'unreadCount'] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao marcar lead como lido')
    },
  })
}

export function useCreateLead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: leadsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
      queryClient.invalidateQueries({ queryKey: ['leads', 'unreadCount'] })
      toast.success('Lead enviado com sucesso! Entraremos em contato em breve.')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao enviar lead')
    },
  })
}
