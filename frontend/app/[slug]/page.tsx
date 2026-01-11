'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function DynamicPage() {
  const params = useParams()
  const slug = params.slug as string
  const router = useRouter()

  useEffect(() => {
    if (slug) {
      router.replace(`/pages/${slug}`)
    }
  }, [slug, router])

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-4 text-gray-400">Redirecionando...</p>
      </div>
    </div>
  )
}
