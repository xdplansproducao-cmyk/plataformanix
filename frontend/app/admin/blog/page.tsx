'use client'

import { useState } from 'react'
import { useBlogPosts, useDeleteBlogPost } from '@/hooks/useBlog'
import { BlogPostFilters } from '@/types'
import ProtectedRoute from '@/components/ProtectedRoute'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Edit, Trash2, Eye, Calendar, CheckCircle, XCircle, Star } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Pagination from '@/components/Pagination'

const CATEGORY_LABELS: Record<string, string> = {
  dicas: 'Dicas',
  mercado: 'Mercado',
  financiamento: 'Financiamento',
  decoracao: 'Decoração',
  noticias: 'Notícias',
  outros: 'Outros',
}

function AdminBlogContent() {
  const [filters, setFilters] = useState<BlogPostFilters>({
    page: 1,
    limit: 10,
  })

  const { data, isLoading } = useBlogPosts(filters)
  const deleteMutation = useDeleteBlogPost()

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o post "${title}"?`)) {
      deleteMutation.mutate(id)
    }
  }

  const handleFilterPublished = (published?: boolean) => {
    setFilters({ ...filters, published, page: 1 })
  }

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar Blog</h1>
          <p className="text-gray-400 mt-2">Crie e gerencie posts do blog</p>
        </div>
        <Link href="/admin/blog/novo" className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Novo Post
        </Link>
      </div>

      {/* Filtros */}
      <div className="card p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleFilterPublished(undefined)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filters.published === undefined
                ? 'bg-primary text-dark-base'
                : 'bg-dark-lighter hover:bg-dark-lighter/80'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => handleFilterPublished(true)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filters.published === true
                ? 'bg-primary text-dark-base'
                : 'bg-dark-lighter hover:bg-dark-lighter/80'
            }`}
          >
            Publicados
          </button>
          <button
            onClick={() => handleFilterPublished(false)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filters.published === false
                ? 'bg-primary text-dark-base'
                : 'bg-dark-lighter hover:bg-dark-lighter/80'
            }`}
          >
            Rascunhos
          </button>
        </div>
      </div>

      {/* Tabela de Posts */}
      {isLoading ? (
        <div className="card p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="h-20 w-32 bg-dark-lighter rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-6 bg-dark-lighter rounded w-1/2"></div>
                  <div className="h-4 bg-dark-lighter rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : data?.posts && data.posts.length > 0 ? (
        <>
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dark-lighter">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Post
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Visualizações
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-lighter">
                  {data.posts.map((post) => {
                    const imageUrl = post.coverImage
                      ? `${process.env.NEXT_PUBLIC_API_URL}${post.coverImage}`
                      : 'https://dummyimage.com/200x150/2d2d2d/D4AF37&text=Blog'

                    return (
                      <tr key={post._id} className="hover:bg-dark-lighter/50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="relative h-16 w-24 flex-shrink-0">
                              <Image
                                src={imageUrl}
                                alt={post.title}
                                fill
                                className="object-cover rounded"
                                sizes="96px"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-medium truncate">{post.title}</p>
                                {post.featured && (
                                  <Star className="w-4 h-4 text-primary fill-current" />
                                )}
                              </div>
                              <p className="text-sm text-gray-400 truncate">{post.excerpt}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm px-2 py-1 bg-primary/20 text-primary rounded">
                            {CATEGORY_LABELS[post.category]}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {post.published ? (
                              <>
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span className="text-sm text-green-500">Publicado</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-500">Rascunho</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Eye className="w-4 h-4" />
                            {post.views}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {post.publishedAt
                              ? formatDistanceToNow(new Date(post.publishedAt), {
                                  addSuffix: true,
                                  locale: ptBR,
                                })
                              : formatDistanceToNow(new Date(post.createdAt), {
                                  addSuffix: true,
                                  locale: ptBR,
                                })}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {post.published && (
                              <Link
                                href={`/blog/${post.slug}`}
                                target="_blank"
                                className="p-2 hover:bg-dark-lighter rounded-lg transition-colors text-gray-400 hover:text-white"
                                title="Ver post"
                              >
                                <Eye className="w-4 h-4" />
                              </Link>
                            )}
                            <Link
                              href={`/admin/blog/${post._id}`}
                              className="p-2 hover:bg-dark-lighter rounded-lg transition-colors text-primary hover:text-primary/80"
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => handleDelete(post._id, post.title)}
                              disabled={deleteMutation.isPending}
                              className="p-2 hover:bg-dark-lighter rounded-lg transition-colors text-red-400 hover:text-red-300 disabled:opacity-50"
                              title="Excluir"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Paginação */}
          {data.pagination && data.pagination.pages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={data.pagination.page}
                totalPages={data.pagination.pages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      ) : (
        <div className="card p-12 text-center">
          <p className="text-gray-400 mb-4">Nenhum post encontrado.</p>
          <Link href="/admin/blog/novo" className="btn-primary inline-flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Criar Primeiro Post
          </Link>
        </div>
      )}
    </div>
  )
}

export default function AdminBlogPage() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminBlogContent />
    </ProtectedRoute>
  )
}
