'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import apiClient from '@/lib/api/client'
import { Page } from '@/types'

export default function CmsPage() {
  const params = useParams()
  const slug = params.slug as string

  const [page, setPage] = useState<Page | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setIsLoading(true)
        const { data } = await apiClient.get<Page>(`/api/pages/slug/${slug}`)
        setPage(data)
      } catch (err) {
        setError('Página não encontrada')
        console.error('Erro ao buscar página:', err)
      } finally {
        setIsLoading(false)
      }
    }

    if (slug) {
      fetchPage()
    }
  }, [slug])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-400">Carregando página...</p>
        </div>
      </div>
    )
  }

  if (error || !page) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold text-white mb-4">Página Não Encontrada</h1>
          <p className="text-gray-400 text-lg mb-8">
            A página que você está procurando não existe ou foi removida.
          </p>
          <a href="/" className="btn-primary">
            Voltar para Home
          </a>
        </div>
      </div>
    )
  }

  return (
    <>
      <title>{page.metaTitle || page.title}</title>
      <meta name="description" content={page.metaDescription || (page.content?.substring(0, 160) || '')} />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">{page.title}</h1>

          <div className="text-white leading-relaxed">
            <div
              dangerouslySetInnerHTML={{
                __html: (page.content || '').replace(/\n/g, '<br>'),
              }}
            />
          </div>
        </div>
      </div>
    </>
  )
}
