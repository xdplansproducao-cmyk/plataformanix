'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { propertiesService } from '@/services/propertiesService'
import { useProperties } from '@/hooks/useProperties'
import ProtectedRoute from '@/components/ProtectedRoute'
import PropertyCard from '@/components/PropertyCard'
import { PropertyListSkeleton } from '@/components/LoadingSkeleton'
import Link from 'next/link'
import { Plus, Edit, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gerenciar Imóveis</h1>
        <Link href="/admin/imoveis/novo" className="btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Novo Imóvel</span>
        </Link>
      </div>

      {isLoading ? (
        <PropertyListSkeleton />
      ) : data && data.data.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.data.map((property) => (
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
