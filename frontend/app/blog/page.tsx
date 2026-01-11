'use client'

import { useState } from 'react'
import { useBlogPosts, useBlogCategories } from '@/hooks/useBlog'
import { BlogPostFilters } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Eye, Tag, Search } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Pagination from '@/components/Pagination'

const CATEGORY_LABELS: Record<string, string> = {
  dicas: 'Dicas',
  mercado: 'Mercado Imobiliário',
  financiamento: 'Financiamento',
  decoracao: 'Decoração',
  noticias: 'Notícias',
  outros: 'Outros',
}

export default function BlogPage() {
  const [filters, setFilters] = useState<BlogPostFilters>({
    page: 1,
    limit: 12,
    published: true,
  })
  const [searchInput, setSearchInput] = useState('')

  const { data, isLoading } = useBlogPosts(filters)
  const { data: categories } = useBlogCategories()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setFilters({ ...filters, search: searchInput, page: 1 })
  }

  const handleCategoryFilter = (category: string | undefined) => {
    setFilters({ ...filters, category, page: 1 })
  }

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (isLoading && !data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-12 bg-dark-lighter rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card p-4">
                <div className="h-48 bg-dark-lighter rounded mb-4"></div>
                <div className="h-6 bg-dark-lighter rounded mb-2"></div>
                <div className="h-4 bg-dark-lighter rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Blog Nix Imóveis</h1>
        <p className="text-gray-400 text-lg">
          Dicas, notícias e informações sobre o mercado imobiliário
        </p>
      </div>

      {/* Filtros e Busca */}
      <div className="mb-8 space-y-4">
        {/* Busca */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar posts..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <button type="submit" className="btn-primary px-6">
            Buscar
          </button>
        </form>

        {/* Categorias */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCategoryFilter(undefined)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              !filters.category
                ? 'bg-primary text-dark-base'
                : 'bg-dark-lighter hover:bg-dark-lighter/80'
            }`}
          >
            Todas
          </button>
          {categories?.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryFilter(category)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filters.category === category
                  ? 'bg-primary text-dark-base'
                  : 'bg-dark-lighter hover:bg-dark-lighter/80'
              }`}
            >
              {CATEGORY_LABELS[category] || category}
            </button>
          ))}
        </div>

        {/* Resultados */}
        {filters.search && (
          <div className="flex items-center justify-between">
            <p className="text-gray-400">
              Resultados para: <span className="text-white font-semibold">{filters.search}</span>
            </p>
            <button
              onClick={() => {
                setSearchInput('')
                setFilters({ ...filters, search: undefined })
              }}
              className="text-primary hover:text-primary/80"
            >
              Limpar busca
            </button>
          </div>
        )}
      </div>

      {/* Grid de Posts */}
      {data?.posts && data.posts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {data.posts.map((post) => {
              const imageUrl = post.coverImage
                ? `${process.env.NEXT_PUBLIC_API_URL}${post.coverImage}`
                : 'https://dummyimage.com/600x400/2d2d2d/D4AF37&text=Blog+Post'

              return (
                <Link
                  key={post._id}
                  href={`/blog/${post.slug}`}
                  className="card overflow-hidden hover:ring-2 hover:ring-primary transition-all group"
                >
                  {/* Imagem */}
                  <div className="relative h-48 w-full">
                    <Image
                      src={imageUrl}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {post.featured && (
                      <div className="absolute top-2 right-2 bg-primary text-dark-base px-3 py-1 rounded-full text-xs font-semibold">
                        Destaque
                      </div>
                    )}
                  </div>

                  {/* Conteúdo */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded">
                        {CATEGORY_LABELS[post.category] || post.category}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h2>

                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{post.excerpt}</p>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {post.publishedAt
                            ? formatDistanceToNow(new Date(post.publishedAt), {
                                addSuffix: true,
                                locale: ptBR,
                              })
                            : 'Rascunho'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {post.views}
                        </span>
                      </div>
                    </div>

                    {post.tags && post.tags.length > 0 && (
                      <div className="flex items-center gap-2 mt-3 flex-wrap">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-xs text-gray-500 flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Paginação */}
          {data.pagination && data.pagination.pages > 1 && (
            <Pagination
              currentPage={data.pagination.page}
              totalPages={data.pagination.pages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">Nenhum post encontrado.</p>
        </div>
      )}
    </div>
  )
}
