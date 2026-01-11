'use client'

import { useState } from 'react'
import { useMenuItems, useCreateMenuItem, useUpdateMenuItem, useDeleteMenuItem, useReorderMenuItems, useAvailablePages, useAvailablePosts } from '@/hooks/useMenu'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Plus, Edit, Trash2, Eye, EyeOff, GripVertical, Menu as MenuIcon, Link, ChevronDown } from 'lucide-react'
import { MenuItem, CreateMenuItemData } from '@/types'

function AdminMenuContent() {
  const queryResult = useMenuItems()
  const menuItems = Array.isArray(queryResult.data) ? queryResult.data : []
  const isLoading = queryResult.isLoading || false
  
  const createMutation = useCreateMenuItem()
  const updateMutation = useUpdateMenuItem()
  const deleteMutation = useDeleteMenuItem()
  const reorderMutation = useReorderMenuItems()

  const [isAddingItem, setIsAddingItem] = useState(false)
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [formData, setFormData] = useState<CreateMenuItemData>({
    label: '',
    href: '',
    order: 0,
    published: true,
    parentId: '',
    menuType: 'main',
    contentType: 'custom',
    pageId: '',
    postId: '',
    target: '_self',
  })

  // Hooks para buscar conteúdo disponível
  const { data: availablePages = [] } = useAvailablePages()
  const { data: availablePosts = [] } = useAvailablePosts()

  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  const resetForm = () => {
    setFormData({
      label: '',
      href: '',
      order: 0,
      published: true,
      parentId: '',
      menuType: 'main',
      contentType: 'custom',
      pageId: '',
      postId: '',
      target: '_self',
    })
    setIsAddingItem(false)
    setEditingItem(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingItem) {
        await updateMutation.mutateAsync({ id: editingItem, ...formData })
      } else {
        await createMutation.mutateAsync(formData)
      }
      resetForm()
    } catch (error) {
      console.error('Erro ao salvar item do menu:', error)
    }
  }

  const handleEdit = (item: MenuItem) => {
    setFormData({
      label: item.label,
      href: item.href,
      order: item.order,
      published: item.published,
      parentId: item.parentId || '',
      menuType: item.menuType,
      contentType: item.contentType,
      pageId: item.pageId || '',
      postId: item.postId || '',
      target: item.target,
    })
    setEditingItem(item._id)
    setIsAddingItem(true)
  }

  const handleDelete = async (id: string, label: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o item "${label}"?`)) {
      deleteMutation.mutate(id)
    }
  }

  const handleTogglePublished = async (id: string, published: boolean) => {
    try {
      await updateMutation.mutateAsync({ id, published })
    } catch (error) {
      console.error('Erro ao atualizar status do item:', error)
    }
  }

  const handleDragStart = (itemId: string) => {
    setDraggedItem(itemId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = async (e: React.DragEvent, targetItemId: string) => {
    e.preventDefault()
    
    if (!draggedItem || draggedItem === targetItemId) return

    const items = menuItems || []
    const draggedIndex = items.findIndex(item => item._id === draggedItem)
    const targetIndex = items.findIndex(item => item._id === targetItemId)

    if (draggedIndex === -1 || targetIndex === -1) return

    const newItems = [...items]
    const [draggedItemObj] = newItems.splice(draggedIndex, 1)
    newItems.splice(targetIndex, 0, draggedItemObj)

    const reorderedItems = newItems.map((item, index) => ({
      id: item._id,
      order: index,
    }))

    try {
      await reorderMutation.mutateAsync(reorderedItems)
    } catch (error) {
      console.error('Erro ao reordenar menu:', error)
    }

    setDraggedItem(null)
  }

  const topLevelItems = menuItems?.filter(item => !item.parentId) || []
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Gerenciar Menu</h1>
          <p className="text-gray-400 mt-2">Organize os itens de navegação do site</p>
        </div>
        <button
          onClick={() => setIsAddingItem(true)}
          className="btn-primary"
        >
          <Plus className="w-5 h-5 inline mr-2" />
          Novo Item
        </button>
      </div>

      {/* Add/Edit Form */}
      {isAddingItem && (
        <div className="card p-6 mb-8">
          <h3 className="text-xl font-semibold text-white mb-6">
            {editingItem ? 'Editar Item' : 'Novo Item do Menu'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-medium mb-2">
                  Label *
                </label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData((prev: CreateMenuItemData) => ({ ...prev, label: e.target.value }))}
                  className="input-field"
                  placeholder="Nome do item"
                  required
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">
                  URL/Path *
                </label>
                <input
                  type="text"
                  value={formData.href}
                  onChange={(e) => setFormData((prev: CreateMenuItemData) => ({ ...prev, href: e.target.value }))}
                  className="input-field"
                  placeholder="/pagina-exemplo"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-medium mb-2">
                  Ordem
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData((prev: CreateMenuItemData) => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                  className="input-field"
                  min="0"
                />
              </div>
              <div>
                <label className="flex items-center space-x-3 cursor-pointer mt-6">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData((prev: CreateMenuItemData) => ({ ...prev, published: e.target.checked }))}
                    className="w-4 h-4 text-primary bg-dark-light border-dark-lighter rounded focus:ring-primary"
                  />
                  <span className="text-white font-medium">Publicado</span>
                </label>
              </div>
            </div>
            
            {/* Campos adicionais para múltiplos menus e tipos de conteúdo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-medium mb-2">
                  Tipo de Menu
                </label>
                <select
                  value={formData.menuType}
                  onChange={(e) => setFormData((prev: CreateMenuItemData) => ({ ...prev, menuType: e.target.value as any }))}
                  className="input-field"
                >
                  <option value="main">Menu Principal</option>
                  <option value="footer">Menu Rodapé</option>
                  <option value="sidebar">Menu Lateral</option>
                </select>
              </div>
              <div>
                <label className="block text-white font-medium mb-2">
                  Tipo de Conteúdo
                </label>
                <select
                  value={formData.contentType}
                  onChange={(e) => setFormData((prev: CreateMenuItemData) => ({ ...prev, contentType: e.target.value as any }))}
                  className="input-field"
                >
                  <option value="custom">Link Personalizado</option>
                  <option value="page">Página</option>
                  <option value="post">Post</option>
                  <option value="link">Link Externo</option>
                </select>
              </div>
            </div>

            {/* Campos condicionais baseados no tipo de conteúdo */}
            {(formData.contentType === 'page' || formData.contentType === 'post' || formData.contentType === 'link') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.contentType === 'page' && (
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Página
                    </label>
                    <select
                      value={formData.pageId}
                      onChange={(e) => {
                        const pageId = e.target.value
                        const selectedPage = Array.isArray(availablePages) ? (availablePages as any[]).find((p: any) => p._id === pageId) : null
                        setFormData((prev: CreateMenuItemData) => ({ 
                          ...prev, 
                          pageId,
                          href: selectedPage ? `/pages/${(selectedPage as any).slug}` : prev.href 
                        }))
                      }}
                      className="input-field"
                    >
                      <option value="">Selecione uma página</option>
                      {Array.isArray(availablePages) && availablePages.map((page: any) => (
                        <option key={page._id} value={page._id}>
                          {page.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                {formData.contentType === 'post' && (
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Post
                    </label>
                    <select
                      value={formData.postId}
                      onChange={(e) => {
                        const postId = e.target.value
                        const selectedPost = Array.isArray(availablePosts) ? (availablePosts as any[]).find((p: any) => p._id === postId) : null
                        setFormData((prev: CreateMenuItemData) => ({ 
                          ...prev, 
                          postId,
                          href: selectedPost ? `/blog/${(selectedPost as any).slug}` : prev.href 
                        }))
                      }}
                      className="input-field"
                    >
                      <option value="">Selecione um post</option>
                      {Array.isArray(availablePosts) && availablePosts.map((post: any) => (
                        <option key={post._id} value={post._id}>
                          {post.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                {formData.contentType === 'link' && (
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Target do Link
                    </label>
                    <select
                      value={formData.target}
                      onChange={(e) => setFormData((prev: CreateMenuItemData) => ({ ...prev, target: e.target.value as any }))}
                      className="input-field"
                    >
                      <option value="_self">Mesma Janela (_self)</option>
                      <option value="_blank">Nova Janela (_blank)</option>
                    </select>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="submit"
                className="btn-primary"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {editingItem ? 'Atualizar' : 'Adicionar'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="btn-secondary"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Menu Items List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-400">Carregando menu...</p>
        </div>
      ) : menuItems.length === 0 ? (
        <div className="text-center py-12">
          <MenuIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-4">Nenhum item no menu encontrado</p>
          <button
            onClick={() => setIsAddingItem(true)}
            className="btn-primary"
          >
            <Plus className="w-5 h-5 inline mr-2" />
            Adicionar Primeiro Item
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Menu Principal */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="bg-primary text-white text-xs px-2 py-1 rounded">1</span>
              Menu Principal
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              Arraste e solte para reordenar os itens
            </p>
            
            <div className="space-y-2">
              {menuItems
                .filter(item => (item.menuType ?? 'main') === 'main' && !item.parentId)
                .sort((a, b) => a.order - b.order)
                .map((item) => (
                <div
                  key={item._id}
                  draggable
                  onDragStart={() => handleDragStart(item._id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, item._id)}
                  className={`flex items-center justify-between p-4 bg-dark-light rounded-lg border border-dark-lighter transition-all cursor-move hover:border-primary ${
                    draggedItem === item._id ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{item.label}</span>
                        <span className="text-xs bg-gray-600 px-2 py-1 rounded">
                          {item.contentType === 'custom' ? 'Custom' : 
                           item.contentType === 'page' ? 'Página' : 
                           item.contentType === 'post' ? 'Post' : 'Link'}
                        </span>
                        {item.target === '_blank' && (
                          <span className="text-xs bg-blue-600 px-2 py-1 rounded">Nova Janela</span>
                        )}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {item.href}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTogglePublished(item._id, !item.published)}
                      className={`p-2 rounded-lg transition-colors ${
                        item.published 
                          ? 'bg-green-600 hover:bg-green-700 text-white' 
                          : 'bg-gray-600 hover:bg-gray-700 text-white'
                      }`}
                      title={item.published ? 'Despublicar' : 'Publicar'}
                    >
                      {item.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id, item.label)}
                      className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Menu Rodapé */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded">2</span>
              Menu Rodapé
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              Links que aparecem no rodapé do site
            </p>
            
            <div className="space-y-2">
              {menuItems
                .filter(item => item.menuType === 'footer' && !item.parentId)
                .sort((a, b) => a.order - b.order)
                .map((item) => (
                <div
                  key={item._id}
                  draggable
                  onDragStart={() => handleDragStart(item._id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, item._id)}
                  className={`flex items-center justify-between p-4 bg-dark-light rounded-lg border border-dark-lighter transition-all cursor-move hover:border-primary ${
                    draggedItem === item._id ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{item.label}</span>
                        <span className="text-xs bg-gray-600 px-2 py-1 rounded">
                          {item.contentType === 'custom' ? 'Custom' : 
                           item.contentType === 'page' ? 'Página' : 
                           item.contentType === 'post' ? 'Post' : 'Link'}
                        </span>
                        {item.target === '_blank' && (
                          <span className="text-xs bg-blue-600 px-2 py-1 rounded">Nova Janela</span>
                        )}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {item.href}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTogglePublished(item._id, !item.published)}
                      className={`p-2 rounded-lg transition-colors ${
                        item.published 
                          ? 'bg-green-600 hover:bg-green-700 text-white' 
                          : 'bg-gray-600 hover:bg-gray-700 text-white'
                      }`}
                      title={item.published ? 'Despublicar' : 'Publicar'}
                    >
                      {item.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id, item.label)}
                      className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Menu Lateral */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span className="bg-orange-600 text-white text-xs px-2 py-1 rounded">3</span>
              Menu Lateral
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              Menu opcional para barra lateral
            </p>
            
            <div className="space-y-2">
              {menuItems
                .filter(item => item.menuType === 'sidebar' && !item.parentId)
                .sort((a, b) => a.order - b.order)
                .map((item) => (
                <div
                  key={item._id}
                  draggable
                  onDragStart={() => handleDragStart(item._id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, item._id)}
                  className={`flex items-center justify-between p-4 bg-dark-light rounded-lg border border-dark-lighter transition-all cursor-move hover:border-primary ${
                    draggedItem === item._id ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <GripVertical className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{item.label}</span>
                        <span className="text-xs bg-gray-600 px-2 py-1 rounded">
                          {item.contentType === 'custom' ? 'Custom' : 
                           item.contentType === 'page' ? 'Página' : 
                           item.contentType === 'post' ? 'Post' : 'Link'}
                        </span>
                        {item.target === '_blank' && (
                          <span className="text-xs bg-blue-600 px-2 py-1 rounded">Nova Janela</span>
                        )}
                      </div>
                      <div className="text-gray-400 text-sm">
                        {item.href}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleTogglePublished(item._id, !item.published)}
                      className={`p-2 rounded-lg transition-colors ${
                        item.published 
                          ? 'bg-green-600 hover:bg-green-700 text-white' 
                          : 'bg-gray-600 hover:bg-gray-700 text-white'
                      }`}
                      title={item.published ? 'Despublicar' : 'Publicar'}
                    >
                      {item.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id, item.label)}
                      className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AdminMenuPage() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminMenuContent />
    </ProtectedRoute>
  )
}
