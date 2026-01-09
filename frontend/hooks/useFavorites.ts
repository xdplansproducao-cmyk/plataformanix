'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { favoritesService } from '@/services/favoritesService'
import { Favorite } from '@/types'
import toast from 'react-hot-toast'

export function useFavorites() {
  const queryClient = useQueryClient()

  const { data: favorites = [], isLoading } = useQuery<Favorite[]>({
    queryKey: ['favorites'],
    queryFn: favoritesService.getAll,
    retry: false,
  })

  const addMutation = useMutation({
    mutationFn: favoritesService.add,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
      toast.success('Imóvel adicionado aos favoritos!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao favoritar imóvel')
    },
  })

  const removeMutation = useMutation({
    mutationFn: favoritesService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
      toast.success('Imóvel removido dos favoritos!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao remover favorito')
    },
  })

  const isFavorite = (propertyId: string) => {
    return favorites.some((fav) => fav.propertyId === propertyId)
  }

  return {
    favorites,
    isLoading,
    addFavorite: addMutation.mutate,
    removeFavorite: removeMutation.mutate,
    isFavorite,
    isAdding: addMutation.isPending,
    isRemoving: removeMutation.isPending,
  }
}
