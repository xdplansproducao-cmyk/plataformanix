'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useProperties } from '@/hooks/useProperties'
import { useFeaturedPosts } from '@/hooks/useBlog'
import PropertyCard from '@/components/PropertyCard'
import { PropertyListSkeleton } from '@/components/LoadingSkeleton'
import { Search, Calendar, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const CATEGORY_LABELS: Record<string, string> = {
  dicas: 'Dicas',
  mercado: 'Mercado Imobiliário',
  financiamento: 'Financiamento',
  decoracao: 'Decoração',
  noticias: 'Notícias',
  outros: 'Outros',
}

export default function HomePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  // Buscar destaques
  const { data: featuredData, isLoading: featuredLoading } = useProperties({
    featured: true,
    limit: 6,
  })

  // Buscar para alugar
  const { data: rentData, isLoading: rentLoading } = useProperties({
    status: 'rent',
    limit: 6,
  })

  // Buscar para comprar
  const { data: saleData, isLoading: saleLoading } = useProperties({
    status: 'sale',
    limit: 6,
  })

  // Buscar posts em destaque
  const { data: featuredPosts, isLoading: blogLoading } = useFeaturedPosts(3)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/imoveis?q=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      router.push('/imoveis')
    }
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-dark to-dark-light py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Encontre seu <span className="text-primary">imóvel ideal</span>
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Milhares de opções de casas, apartamentos e imóveis comerciais
            </p>
            
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por cidade, bairro, tipo..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-dark-light border border-dark-lighter rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <button type="submit" className="btn-primary px-8 py-4">
                  Buscar
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Destaques */}
      <section className="py-16 container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Destaques</h2>
          <button
            onClick={() => router.push('/imoveis?featured=true')}
            className="text-primary hover:text-primary-dark transition-colors"
          >
            Ver todos →
          </button>
        </div>
        {featuredLoading ? (
          <PropertyListSkeleton />
        ) : featuredData?.data && featuredData.data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredData.data.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-8">Nenhum imóvel em destaque no momento.</p>
        )}
      </section>

      {/* Para Alugar */}
      <section className="py-16 bg-dark-light container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Para Alugar</h2>
          <button
            onClick={() => router.push('/imoveis?status=rent')}
            className="text-primary hover:text-primary-dark transition-colors"
          >
            Ver todos →
          </button>
        </div>
        {rentLoading ? (
          <PropertyListSkeleton />
        ) : rentData?.data && rentData.data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rentData.data.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-8">Nenhum imóvel para alugar no momento.</p>
        )}
      </section>

      {/* Para Comprar */}
      <section className="py-16 container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Para Comprar</h2>
          <button
            onClick={() => router.push('/imoveis?status=sale')}
            className="text-primary hover:text-primary-dark transition-colors"
          >
            Ver todos →
          </button>
        </div>
        {saleLoading ? (
          <PropertyListSkeleton />
        ) : saleData?.data && saleData.data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {saleData.data.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-center py-8">Nenhum imóvel para venda no momento.</p>
        )}
      </section>

      {/* Blog em Destaque */}
      <section className="py-16 bg-dark-light">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold">Blog</h2>
              <p className="text-gray-400 mt-2">Últimas notícias e dicas sobre o mercado imobiliário</p>
            </div>
            <Link
              href="/blog"
              className="text-primary hover:text-primary/80 transition-colors flex items-center gap-2"
            >
              Ver todos
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {blogLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="card p-4 animate-pulse">
                  <div className="h-48 bg-dark-lighter rounded mb-4"></div>
                  <div className="h-6 bg-dark-lighter rounded mb-2"></div>
                  <div className="h-4 bg-dark-lighter rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : featuredPosts && featuredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredPosts.map((post) => {
                const imageUrl = post.coverImage
                  ? `${process.env.NEXT_PUBLIC_API_URL}${post.coverImage}`
                  : 'https://dummyimage.com/600x400/2d2d2d/D4AF37&text=Blog+Post'

                return (
                  <Link
                    key={post._id}
                    href={`/blog/${post.slug}`}
                    className="card overflow-hidden hover:ring-2 hover:ring-primary transition-all group"
                  >
                    <div className="relative h-48 w-full">
                      <Image
                        src={imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <div className="p-6">
                      <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded">
                        {CATEGORY_LABELS[post.category] || post.category}
                      </span>
                      <h3 className="text-xl font-bold mt-3 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        {post.publishedAt
                          ? formatDistanceToNow(new Date(post.publishedAt), {
                              addSuffix: true,
                              locale: ptBR,
                            })
                          : 'Rascunho'}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">Nenhum post no blog ainda.</p>
          )}
        </div>
      </section>
    </div>
  )
}
