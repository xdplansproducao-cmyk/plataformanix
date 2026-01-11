'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCreatePage } from '@/hooks/usePages'
import ProtectedRoute from '@/components/ProtectedRoute'
import Link from 'next/link'
import { ArrowLeft, Save, Eye } from 'lucide-react'

function AdminNewPageContent() {
  const router = useRouter()
  const createMutation = useCreatePage()

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    metaTitle: '',
    metaDescription: '',
    published: false,
  })

  const [isPreview, setIsPreview] = useState(false)

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setFormData(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title),
      metaTitle: prev.metaTitle || title,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await createMutation.mutateAsync(formData)
      router.push('/admin/paginas')
    } catch (error) {
      console.error('Erro ao criar página:', error)
    }
  }

  const handleSaveDraft = async () => {
    try {
      await createMutation.mutateAsync({ ...formData, published: false })
      router.push('/admin/paginas')
    } catch (error) {
      console.error('Erro ao salvar rascunho:', error)
    }
  }

  const handlePublish = async () => {
    try {
      await createMutation.mutateAsync({ ...formData, published: true })
      router.push('/admin/paginas')
    } catch (error) {
      console.error('Erro ao publicar página:', error)
    }
  }

  if (isPreview) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => setIsPreview(false)}
            className="btn-secondary mb-4"
          >
            <ArrowLeft className="w-5 h-5 inline mr-2" />
            Voltar para edição
          </button>
          <h1 className="text-3xl font-bold mb-2">{formData.title || 'Título da Página'}</h1>
          {formData.metaDescription && (
            <p className="text-gray-400 mb-4">{formData.metaDescription}</p>
          )}
        </div>
        <div className="prose prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: formData.content.replace(/\n/g, '<br>') }} />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/paginas" className="btn-secondary">
            <ArrowLeft className="w-5 h-5 inline mr-2" />
            Voltar
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Nova Página</h1>
            <p className="text-gray-400 mt-2">Crie uma nova página para o site</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIsPreview(true)}
            className="btn-secondary"
            disabled={!formData.content}
          >
            <Eye className="w-5 h-5 inline mr-2" />
            Visualizar
          </button>
          <button
            type="button"
            onClick={handleSaveDraft}
            className="btn-secondary"
            disabled={!formData.title || createMutation.isPending}
          >
            <Save className="w-5 h-5 inline mr-2" />
            Salvar Rascunho
          </button>
          <button
            type="button"
            onClick={handlePublish}
            className="btn-primary"
            disabled={!formData.title || !formData.content || createMutation.isPending}
          >
            Publicar
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">
                Título da Página *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={handleTitleChange}
                className="input-field"
                placeholder="Digite o título da página"
                required
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                Slug (URL) *
              </label>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">/pages/</span>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="input-field flex-1"
                  placeholder="slug-da-pagina"
                  required
                />
              </div>
              <p className="text-gray-400 text-sm mt-1">
                Este será o URL da página. Use apenas letras minúsculas, números e hífens.
              </p>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                Conteúdo *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                className="input-field min-h-[400px] resize-y"
                placeholder="Digite o conteúdo da página..."
                required
              />
              <p className="text-gray-400 text-sm mt-1">
                Você pode usar HTML para formatar o conteúdo.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Configurações</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white font-medium mb-2">
                    Meta Título (SEO)
                  </label>
                  <input
                    type="text"
                    value={formData.metaTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                    className="input-field"
                    placeholder="Título para SEO (opcional)"
                    maxLength={60}
                  />
                  <p className="text-gray-400 text-sm mt-1">
                    {formData.metaTitle?.length || 0}/60 caracteres
                  </p>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Meta Descrição (SEO)
                  </label>
                  <textarea
                    value={formData.metaDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                    className="input-field min-h-[80px] resize-y"
                    placeholder="Descrição para SEO (opcional)"
                    maxLength={160}
                  />
                  <p className="text-gray-400 text-sm mt-1">
                    {formData.metaDescription?.length || 0}/160 caracteres
                  </p>
                </div>

                <div>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.published}
                      onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                      className="w-4 h-4 text-primary bg-dark-light border-dark-lighter rounded focus:ring-primary"
                    />
                    <span className="text-white font-medium">Publicar página</span>
                  </label>
                  <p className="text-gray-400 text-sm mt-1 ml-7">
                    Desmarque para salvar como rascunho
                  </p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Preview</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-400">URL:</span>
                  <span className="text-white ml-2">/pages/{formData.slug || 'slug-da-pagina'}</span>
                </div>
                <div>
                  <span className="text-gray-400">Status:</span>
                  <span className={`ml-2 ${formData.published ? 'text-green-400' : 'text-yellow-400'}`}>
                    {formData.published ? 'Publicada' : 'Rascunho'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default function AdminNewPagePage() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminNewPageContent />
    </ProtectedRoute>
  )
}
