'use client'

import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { propertiesService } from '@/services/propertiesService'
import { useProperties } from '@/hooks/useProperties'
import ProtectedRoute from '@/components/ProtectedRoute'
import PropertyCard from '@/components/PropertyCard'
import { PropertyListSkeleton } from '@/components/LoadingSkeleton'
import Link from 'next/link'
import { Plus, Edit, Trash2, Grid2X2, List, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import { formatPrice } from '@/lib/utils'

export default function AdminPropertiesPage() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminPropertiesContent />
    </ProtectedRoute>
  )
}

function AdminPropertiesContent() {
  const { data, isLoading } = useProperties({ limit: 100 })
  const queryClient = useQueryClient()

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem('adminPropertiesViewMode') : null
    if (saved === 'grid' || saved === 'list') {
      setViewMode(saved)
    }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 250)
    return () => clearTimeout(t)
  }, [search])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('adminPropertiesViewMode', viewMode)
    }
  }, [viewMode])

  const deleteMutation = useMutation({
    mutationFn: propertiesService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      toast.success('Imóvel excluído com sucesso!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao excluir imóvel')
    },
  })

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este imóvel?')) {
      deleteMutation.mutate(id)
    }
  }

  const properties = data?.data ?? []

  const filteredProperties = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase()
    if (!q) return properties
    return properties.filter((p) => (p.title || '').toLowerCase().includes(q))
  }, [properties, debouncedSearch])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Gerenciar Imóveis</h1>
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por título"
                className="w-full pl-10 pr-3 py-2 rounded-lg bg-dark-light border border-dark-lighter text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div className="inline-flex rounded-lg border border-dark-lighter overflow-hidden">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 text-sm flex items-center gap-2 transition-colors ${
                  viewMode === 'grid' ? 'bg-primary/20 text-white' : 'bg-dark-light text-gray-300 hover:text-white'
                }`}
                title="Visualizar em grade"
              >
                <Grid2X2 className="w-4 h-4" />
                Grade
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 text-sm flex items-center gap-2 transition-colors ${
                  viewMode === 'list' ? 'bg-primary/20 text-white' : 'bg-dark-light text-gray-300 hover:text-white'
                }`}
                title="Visualizar em lista"
              >
                <List className="w-4 h-4" />
                Lista
              </button>
            </div>
          </div>
        </div>

        <Link href="/admin/imoveis/novo" className="btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Novo Imóvel</span>
        </Link>
      </div>

      {isLoading ? (
        <PropertyListSkeleton />
      ) : properties.length > 0 ? (
        filteredProperties.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <div key={property._id} className="relative">
                  <PropertyCard property={property} />
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <Link
                      href={`/admin/imoveis/${property._id}`}
                      className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(property._id)}
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredProperties.map((property) => (
                <div key={property._id} className="card p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-col gap-1">
                      <Link href={`/admin/imoveis/${property._id}`} className="text-white font-semibold hover:underline truncate">
                        {property.title}
                      </Link>
                      <div className="text-sm text-gray-400 truncate">
                        {property.address?.neighborhood}, {property.address?.city}
                      </div>
                      <div className="text-sm text-gray-300">
                        {formatPrice(property.price)}
                        <span className="text-gray-500"> · </span>
                        <span className="capitalize">{property.type}</span>
                        <span className="text-gray-500"> · </span>
                        <span className="capitalize">{property.status === 'sale' ? 'venda' : 'aluguel'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/imoveis/${property._id}`}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition-colors inline-flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(property._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors inline-flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-2">Nenhum imóvel encontrado.</p>
            <p className="text-gray-500">Tente buscar por outro título.</p>
          </div>
        )
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg mb-4">Nenhum imóvel cadastrado.</p>
          <Link href="/admin/imoveis/novo" className="btn-primary inline-flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Cadastrar Primeiro Imóvel</span>
          </Link>
        </div>
      )}
    </div>
  )
}
