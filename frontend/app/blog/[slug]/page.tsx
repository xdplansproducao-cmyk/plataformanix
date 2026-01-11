'use client'

import { useParams } from 'next/navigation'
import { useBlogPostBySlug, useRelatedPosts } from '@/hooks/useBlog'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Eye, Tag, ArrowLeft, User } from 'lucide-react'
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

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string
  const { data: post, isLoading } = useBlogPostBySlug(slug)
  const { data: relatedPosts } = useRelatedPosts(post?._id || '', 3)

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-dark-lighter rounded w-1/4 mb-6"></div>
          <div className="h-96 bg-dark-lighter rounded mb-6"></div>
          <div className="h-12 bg-dark-lighter rounded w-3/4 mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-dark-lighter rounded"></div>
            <div className="h-4 bg-dark-lighter rounded"></div>
            <div className="h-4 bg-dark-lighter rounded w-2/3"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-400">Post não encontrado.</p>
        <Link href="/blog" className="text-primary hover:text-primary/80 mt-4 inline-block">
          Voltar para o blog
        </Link>
      </div>
    )
  }

  const imageUrl = post.coverImage
    ? `${process.env.NEXT_PUBLIC_API_URL}${post.coverImage}`
    : 'https://dummyimage.com/1200x600/2d2d2d/D4AF37&text=Blog+Post'

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[500px] w-full">
        <Image
          src={imageUrl}
          alt={post.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-base/50 to-dark-base"></div>
      </div>

      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Voltar */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-white hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar para o blog
          </Link>

          {/* Card do Artigo */}
          <article className="card p-8 mb-8">
            {/* Categoria e Featured */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm px-3 py-1 bg-primary/20 text-primary rounded">
                {CATEGORY_LABELS[post.category] || post.category}
              </span>
              {post.featured && (
                <span className="text-sm px-3 py-1 bg-primary text-dark-base rounded font-semibold">
                  Destaque
                </span>
              )}
            </div>

            {/* Título */}
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>

            {/* Excerpt */}
            <p className="text-xl text-gray-300 mb-6 leading-relaxed">{post.excerpt}</p>

            {/* Meta Informações */}
            <div className="flex flex-wrap items-center gap-4 py-4 border-t border-b border-dark-lighter text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {post.publishedAt
                    ? formatDistanceToNow(new Date(post.publishedAt), {
                        addSuffix: true,
                        locale: ptBR,
                      })
                    : 'Rascunho'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{post.views} visualizações</span>
              </div>
            </div>

            {/* Conteúdo */}
            <div
              className="prose prose-invert prose-lg max-w-none mt-8"
              style={{
                color: '#e5e5e5',
              }}
            >
              {post.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 pt-8 border-t border-dark-lighter">
                <h3 className="text-sm font-semibold text-gray-400 mb-3">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/blog?tag=${encodeURIComponent(tag)}`}
                      className="flex items-center gap-1 px-3 py-1 bg-dark-lighter hover:bg-dark-lighter/80 rounded-full text-sm transition-colors"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Posts Relacionados */}
          {relatedPosts && relatedPosts.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Posts Relacionados</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => {
                  const relatedImageUrl = relatedPost.coverImage
                    ? `${process.env.NEXT_PUBLIC_API_URL}${relatedPost.coverImage}`
                    : 'https://dummyimage.com/400x300/2d2d2d/D4AF37&text=Blog+Post'

                  return (
                    <Link
                      key={relatedPost._id}
                      href={`/blog/${relatedPost.slug}`}
                      className="card overflow-hidden hover:ring-2 hover:ring-primary transition-all group"
                    >
                      <div className="relative h-40 w-full">
                        <Image
                          src={relatedImageUrl}
                          alt={relatedPost.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-bold line-clamp-2 group-hover:text-primary transition-colors">
                          {relatedPost.title}
                        </h3>
                        <p className="text-sm text-gray-400 mt-2 line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
