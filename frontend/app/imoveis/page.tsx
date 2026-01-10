'use client'

import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useProperties } from '@/hooks/useProperties'
import PropertyCard from '@/components/PropertyCard'
import FilterBar from '@/components/FilterBar'
import Pagination from '@/components/Pagination'
import { PropertyListSkeleton } from '@/components/LoadingSkeleton'
import { PropertyFilters } from '@/types'

function PropertiesContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const filters: PropertyFilters = {
    q: searchParams.get('q') || undefined,
    city: searchParams.get('city') || undefined,
    neighborhood: searchParams.get('neighborhood') || undefined,
    type: (searchParams.get('type') as any) || undefined,
    status: (searchParams.get('status') as any) || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    bedrooms: searchParams.get('bedrooms') ? Number(searchParams.get('bedrooms')) : undefined,
    bathrooms: searchParams.get('bathrooms') ? Number(searchParams.get('bathrooms')) : undefined,
    parkingSpots: searchParams.get('parkingSpots') ? Number(searchParams.get('parkingSpots')) : undefined,
    featured: searchParams.get('featured') === 'true' ? true : undefined,
    sort: (searchParams.get('sort') as any) || 'createdAt',
    order: (searchParams.get('order') as any) || 'desc',
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
    limit: 12,
  }

  const { data, isLoading, error } = useProperties(filters)

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(page))
    router.push(`/imoveis?${params.toString()}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Imóveis Disponíveis</h1>

      <FilterBar />

      {isLoading ? (
        <PropertyListSkeleton />
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-400 mb-4">Erro ao carregar imóveis. Tente novamente.</p>
        </div>
      ) : data && data.data.length > 0 ? (
        <>
          <div className="mb-4 text-gray-400">
            {data.total} imóvel{data.total !== 1 ? 'eis' : ''} encontrado{data.total !== 1 ? 's' : ''}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.data.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
          {data.totalPages > 1 && (
            <Pagination
              currentPage={data.page}
              totalPages={data.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg mb-4">Nenhum imóvel encontrado.</p>
          <p className="text-gray-500">Tente ajustar os filtros de busca.</p>
        </div>
      )}
    </div>
  )
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8"><PropertyListSkeleton /></div>}>
      <PropertiesContent />
    </Suspense>
  )
}
