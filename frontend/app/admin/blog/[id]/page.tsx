'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useBlogPost, useUpdateBlogPost } from '@/hooks/useBlog'
import { blogPostSchema } from '@/lib/validations'
import ProtectedRoute from '@/components/ProtectedRoute'
import Link from 'next/link'
import { ArrowLeft, Upload, X } from 'lucide-react'
import Image from 'next/image'

type BlogPostFormData = z.infer<typeof blogPostSchema>

function EditBlogPostContent() {
  const params = useParams()
  const id = params.id as string
  const { data: post, isLoading } = useBlogPost(id)
  const updateMutation = useUpdateBlogPost()

  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
  })

  useEffect(() => {
    if (post) {
      reset({
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        tags: post.tags.join(', '),
        published: post.published,
        featured: post.featured,
      })

      if (post.coverImage) {
        setExistingImageUrl(`${process.env.NEXT_PUBLIC_API_URL}${post.coverImage}`)
      }
    }
  }, [post, reset])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
      setExistingImageUrl(null)
    }
  }

  const removeImage = () => {
    setCoverImage(null)
    setPreviewUrl(null)
    setExistingImageUrl(null)
  }

  const onSubmit = (data: BlogPostFormData) => {
    const tags = data.tags ? data.tags.split(',').map((tag) => tag.trim()).filter(Boolean) : []
    
    const formData = {
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      category: data.category,
      tags,
      published: data.published || false,
      featured: data.featured || false,
    }

    updateMutation.mutate({ id, data: formData, coverImage: coverImage || undefined })
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto animate-pulse space-y-6">
          <div className="h-8 bg-dark-lighter rounded w-1/3"></div>
          <div className="h-64 bg-dark-lighter rounded"></div>
          <div className="h-12 bg-dark-lighter rounded"></div>
          <div className="h-32 bg-dark-lighter rounded"></div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-400">Post não encontrado.</p>
        <Link href="/admin/blog" className="text-primary hover:text-primary/80 mt-4 inline-block">
          Voltar para gerenciamento
        </Link>
      </div>
    )
  }

  const displayImageUrl = previewUrl || existingImageUrl

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin/blog"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </Link>
          <h1 className="text-3xl font-bold">Editar Post</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Imagem de Capa */}
          <div className="card p-6">
            <label className="block text-sm font-medium mb-2">Imagem de Capa</label>
            {displayImageUrl ? (
              <div className="relative w-full h-64 rounded-lg overflow-hidden">
                <Image src={displayImageUrl} alt="Preview" fill className="object-cover" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-dark-lighter rounded-lg cursor-pointer hover:border-primary transition-colors">
                <Upload className="w-12 h-12 text-gray-400 mb-2" />
                <span className="text-gray-400">Clique para adicionar uma imagem</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>

          {/* Título */}
          <div className="card p-6">
            <label className="block text-sm font-medium mb-2">
              Título <span className="text-red-400">*</span>
            </label>
            <input type="text" {...register('title')} className="input-field" placeholder="Digite o título do post" />
            {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>}
          </div>

          {/* Resumo */}
          <div className="card p-6">
            <label className="block text-sm font-medium mb-2">
              Resumo <span className="text-red-400">*</span>
            </label>
            <textarea
              {...register('excerpt')}
              rows={3}
              className="input-field resize-none"
              placeholder="Breve resumo do post"
            />
            {errors.excerpt && <p className="text-red-400 text-sm mt-1">{errors.excerpt.message}</p>}
          </div>

          {/* Conteúdo */}
          <div className="card p-6">
            <label className="block text-sm font-medium mb-2">
              Conteúdo <span className="text-red-400">*</span>
            </label>
            <textarea
              {...register('content')}
              rows={15}
              className="input-field resize-none"
              placeholder="Escreva o conteúdo completo do post..."
            />
            {errors.content && <p className="text-red-400 text-sm mt-1">{errors.content.message}</p>}
          </div>

          {/* Categoria e Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card p-6">
              <label className="block text-sm font-medium mb-2">
                Categoria <span className="text-red-400">*</span>
              </label>
              <select {...register('category')} className="input-field">
                <option value="outros">Outros</option>
                <option value="dicas">Dicas</option>
                <option value="mercado">Mercado Imobiliário</option>
                <option value="financiamento">Financiamento</option>
                <option value="decoracao">Decoração</option>
                <option value="noticias">Notícias</option>
              </select>
              {errors.category && <p className="text-red-400 text-sm mt-1">{errors.category.message}</p>}
            </div>

            <div className="card p-6">
              <label className="block text-sm font-medium mb-2">Tags</label>
              <input
                type="text"
                {...register('tags')}
                className="input-field"
                placeholder="Ex: imóveis, compra, venda (separadas por vírgula)"
              />
              <p className="text-xs text-gray-500 mt-1">Separe as tags por vírgula</p>
            </div>
          </div>

          {/* Opções */}
          <div className="card p-6">
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" {...register('published')} className="w-5 h-5 rounded border-dark-lighter" />
                <div>
                  <span className="font-medium">Publicar</span>
                  <p className="text-sm text-gray-400">Tornar este post visível publicamente</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" {...register('featured')} className="w-5 h-5 rounded border-dark-lighter" />
                <div>
                  <span className="font-medium">Destacar</span>
                  <p className="text-sm text-gray-400">Destacar este post na página inicial</p>
                </div>
              </label>
            </div>
          </div>

          {/* Ações */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="btn-primary flex-1"
            >
              {updateMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
            </button>
            <Link href="/admin/blog" className="btn-secondary flex-1 text-center">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function EditBlogPostPage() {
  return (
    <ProtectedRoute requireAdmin>
      <EditBlogPostContent />
    </ProtectedRoute>
  )
}
