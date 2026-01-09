'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { PropertyFilters } from '@/types'
import { Search, X } from 'lucide-react'

export default function FilterBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [filters, setFilters] = useState<PropertyFilters>({
    q: searchParams.get('q') || '',
    city: searchParams.get('city') || '',
    neighborhood: searchParams.get('neighborhood') || '',
    type: (searchParams.get('type') as any) || '',
    status: (searchParams.get('status') as any) || '',
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    bedrooms: searchParams.get('bedrooms') ? Number(searchParams.get('bedrooms')) : undefined,
    bathrooms: searchParams.get('bathrooms') ? Number(searchParams.get('bathrooms')) : undefined,
    parkingSpots: searchParams.get('parkingSpots') ? Number(searchParams.get('parkingSpots')) : undefined,
    featured: searchParams.get('featured') === 'true' ? true : undefined,
    sort: (searchParams.get('sort') as any) || 'createdAt',
    order: (searchParams.get('order') as any) || 'desc',
  })

  const updateURL = (newFilters: PropertyFilters) => {
    const params = new URLSearchParams()
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(key, String(value))
      }
    })
    router.push(`/imoveis?${params.toString()}`)
  }

  const handleChange = (key: keyof PropertyFilters, value: any) => {
    const newFilters = { ...filters, [key]: value || undefined }
    setFilters(newFilters)
    updateURL(newFilters)
  }

  const clearFilters = () => {
    const emptyFilters: PropertyFilters = {}
    setFilters(emptyFilters)
    router.push('/imoveis')
  }

  const hasActiveFilters = Object.values(filters).some(
    (v) => v !== undefined && v !== null && v !== ''
  )

  return (
    <div className="bg-dark-light p-4 rounded-lg mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Buscar</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Título, descrição..."
              value={filters.q || ''}
              onChange={(e) => handleChange('q', e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Cidade</label>
          <input
            type="text"
            placeholder="Cidade"
            value={filters.city || ''}
            onChange={(e) => handleChange('city', e.target.value)}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Bairro</label>
          <input
            type="text"
            placeholder="Bairro"
            value={filters.neighborhood || ''}
            onChange={(e) => handleChange('neighborhood', e.target.value)}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Tipo</label>
          <select
            value={filters.type || ''}
            onChange={(e) => handleChange('type', e.target.value)}
            className="input-field"
          >
            <option value="">Todos</option>
            <option value="apartment">Apartamento</option>
            <option value="house">Casa</option>
            <option value="commercial">Comercial</option>
            <option value="land">Terreno</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Status</label>
          <select
            value={filters.status || ''}
            onChange={(e) => handleChange('status', e.target.value)}
            className="input-field"
          >
            <option value="">Todos</option>
            <option value="sale">Venda</option>
            <option value="rent">Aluguel</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Preço Mín.</label>
          <input
            type="number"
            placeholder="R$ 0"
            value={filters.minPrice || ''}
            onChange={(e) => handleChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Preço Máx.</label>
          <input
            type="number"
            placeholder="R$ 0"
            value={filters.maxPrice || ''}
            onChange={(e) => handleChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Quartos</label>
          <input
            type="number"
            placeholder="0"
            min="0"
            value={filters.bedrooms || ''}
            onChange={(e) => handleChange('bedrooms', e.target.value ? Number(e.target.value) : undefined)}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Banheiros</label>
          <input
            type="number"
            placeholder="0"
            min="0"
            value={filters.bathrooms || ''}
            onChange={(e) => handleChange('bathrooms', e.target.value ? Number(e.target.value) : undefined)}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Vagas</label>
          <input
            type="number"
            placeholder="0"
            min="0"
            value={filters.parkingSpots || ''}
            onChange={(e) => handleChange('parkingSpots', e.target.value ? Number(e.target.value) : undefined)}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Ordenar</label>
          <select
            value={filters.sort || 'createdAt'}
            onChange={(e) => handleChange('sort', e.target.value)}
            className="input-field"
          >
            <option value="createdAt">Data</option>
            <option value="price">Preço</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Ordem</label>
          <select
            value={filters.order || 'desc'}
            onChange={(e) => handleChange('order', e.target.value)}
            className="input-field"
          >
            <option value="desc">Decrescente</option>
            <option value="asc">Crescente</option>
          </select>
        </div>

        <div className="flex items-end">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.featured || false}
              onChange={(e) => handleChange('featured', e.target.checked ? true : undefined)}
              className="w-4 h-4 text-primary bg-dark-light border-dark-lighter rounded focus:ring-primary"
            />
            <span className="text-sm text-gray-400">Apenas Destaques</span>
          </label>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={clearFilters}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Limpar Filtros</span>
          </button>
        </div>
      )}
    </div>
  )
}
