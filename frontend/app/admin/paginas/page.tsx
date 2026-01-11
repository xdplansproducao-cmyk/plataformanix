'use client'

import { useState } from 'react'
import { usePages, useDeletePage } from '@/hooks/usePages'
import { PageFilters } from '@/types'
import ProtectedRoute from '@/components/ProtectedRoute'
import Link from 'next/link'
import { Plus, Edit, Trash2, Eye, EyeOff, Search, Filter } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

function AdminPagesContent() {
  const [filters, setFilters] = useState<PageFilters>({
    page: 1,
    limit: 10,
  })
  const [searchTerm, setSearchTerm] = useState('')

  const { data, isLoading } = usePages(filters)
  const deleteMutation = useDeletePage()

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Tem certeza que deseja excluir a página "${title}"?`)) {
      deleteMutation.mutate(id)
    }
  }

  const handleFilterPublished = (published?: boolean) => {
    setFilters({ ...filters, published, page: 1 })
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    setFilters({ ...filters, search: term || undefined, page: 1 })
  }

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar Páginas</h1>
          <p className="text-gray-400 mt-2">Crie e gerencie as páginas do site</p>
        </div>
        <Link href="/admin/paginas/nova" className="btn-primary">
          <Plus className="w-5 h-5 inline mr-2" />
          Nova Página
        </Link>
      </div>

      {/* Filters */}
      <div className="card p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar páginas..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleFilterPublished(undefined)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filters.published === undefined
                  ? 'bg-primary text-dark'
                  : 'bg-dark-light text-gray-300 hover:bg-dark-lighter'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => handleFilterPublished(true)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filters.published === true
                  ? 'bg-primary text-dark'
                  : 'bg-dark-light text-gray-300 hover:bg-dark-lighter'
              }`}
            >
              Publicadas
            </button>
            <button
              onClick={() => handleFilterPublished(false)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filters.published === false
                  ? 'bg-primary text-dark'
                  : 'bg-dark-light text-gray-300 hover:bg-dark-lighter'
              }`}
            >
              Rascunhos
            </button>
          </div>
        </div>
      </div>

      {/* Pages List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-400">Carregando páginas...</p>
        </div>
      ) : data?.data?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">Nenhuma página encontrada</p>
          <Link href="/admin/paginas/nova" className="btn-primary mt-4 inline-block">
            <Plus className="w-5 h-5 inline mr-2" />
            Criar Primeira Página
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {data?.data?.map((page) => (
            <div key={page._id} className="card p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-white">{page.title}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        page.published
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {page.published ? 'Publicada' : 'Rascunho'}
                    </span>
                  </div>
                  <p className="text-gray-400 mb-3 line-clamp-2">{page.content}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Slug: /{page.slug}</span>
                    <span>
                      Criada {formatDistanceToNow(new Date(page.createdAt), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </span>
                    {page.publishedAt && (
                      <span>
                        Publicada {formatDistanceToNow(new Date(page.publishedAt), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Link
                    href={`/${page.slug}`}
                    target="_blank"
                    className="p-2 text-gray-400 hover:text-primary transition-colors"
                    title="Visualizar página"
                  >
                    <Eye className="w-5 h-5" />
                  </Link>
                  <Link
                    href={`/admin/paginas/${page._id}/editar`}
                    className="p-2 text-gray-400 hover:text-primary transition-colors"
                    title="Editar página"
                  >
                    <Edit className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(page._id, page.title)}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    title="Excluir página"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(data.page - 1)}
              disabled={data.page <= 1}
              className="px-4 py-2 bg-dark-light text-gray-300 rounded-lg hover:bg-dark-lighter transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  data.page === page
                    ? 'bg-primary text-dark'
                    : 'bg-dark-light text-gray-300 hover:bg-dark-lighter'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(data.page + 1)}
              disabled={data.page >= data.totalPages}
              className="px-4 py-2 bg-dark-light text-gray-300 rounded-lg hover:bg-dark-lighter transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Próxima
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AdminPagesPage() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminPagesContent />
    </ProtectedRoute>
  )
}
