'use client'

import { useFavorites } from '@/hooks/useFavorites'
import { useAuth } from '@/hooks/useAuth'
import PropertyCard from '@/components/PropertyCard'
import { PropertyListSkeleton } from '@/components/LoadingSkeleton'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Heart } from 'lucide-react'

export default function FavoritesPage() {
  return (
    <ProtectedRoute>
      <FavoritesContent />
    </ProtectedRoute>
  )
}

function FavoritesContent() {
  const { favorites, isLoading } = useFavorites()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center space-x-3 mb-8">
        <Heart className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold">Meus Favoritos</h1>
      </div>

      {isLoading ? (
        <PropertyListSkeleton />
      ) : favorites && favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((favorite) => (
            <PropertyCard key={favorite._id} property={favorite.property} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-2">Nenhum favorito ainda</p>
          <p className="text-gray-500">Adicione imóveis aos seus favoritos para vê-los aqui.</p>
        </div>
      )}
    </div>
  )
}
