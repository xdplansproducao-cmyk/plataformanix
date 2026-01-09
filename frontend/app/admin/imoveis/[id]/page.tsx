'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { propertySchema } from '@/lib/validations'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { propertiesService } from '@/services/propertiesService'
import ProtectedRoute from '@/components/ProtectedRoute'
import ImageUploader from '@/components/ImageUploader'
import toast from 'react-hot-toast'
import { CreatePropertyData, Property } from '@/types'

export default function EditPropertyPage() {
  return (
    <ProtectedRoute requireAdmin>
      <EditPropertyContent />
    </ProtectedRoute>
  )
}

function EditPropertyContent() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const queryClient = useQueryClient()
  const [images, setImages] = useState<File[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([])

  const { data: property, isLoading } = useQuery<Property>({
    queryKey: ['properties', id],
    queryFn: () => propertiesService.getById(id),
    enabled: !!id,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreatePropertyData>({
    resolver: zodResolver(propertySchema),
  })

  useEffect(() => {
    if (property) {
      reset({
        title: property.title,
        description: property.description,
        type: property.type,
        status: property.status,
        price: property.price,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        parkingSpots: property.parkingSpots,
        area: property.area,
        address: property.address,
        featured: property.featured,
      })
      setExistingImages(property.images || [])
    }
  }, [property, reset])

  const updateMutation = useMutation({
    mutationFn: (data: { property: Partial<CreatePropertyData>; images: File[] }) =>
      propertiesService.update(id, data.property, data.images),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      toast.success('Imóvel atualizado com sucesso!')
      router.push('/admin/imoveis')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao atualizar imóvel')
    },
  })

  const onSubmit = (data: CreatePropertyData) => {
    updateMutation.mutate({ property: data, images })
  }

  const handleRemoveExistingImage = (index: number) => {
    const newImages = existingImages.filter((_, i) => i !== index)
    setExistingImages(newImages)
    // Nota: No backend, você precisará implementar a remoção de imagens
    // Por enquanto, apenas removemos do estado local
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-dark-lighter rounded w-1/3 mb-6"></div>
          <div className="h-96 bg-dark-lighter rounded"></div>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-400">Imóvel não encontrado.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Editar Imóvel</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Informações Básicas</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Título *</label>
              <input
                type="text"
                {...register('title')}
                className="input-field"
              />
              {errors.title && (
                <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Descrição *</label>
              <textarea
                rows={4}
                {...register('description')}
                className="input-field resize-none"
              />
              {errors.description && (
                <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Tipo *</label>
                <select {...register('type')} className="input-field">
                  <option value="apartment">Apartamento</option>
                  <option value="house">Casa</option>
                  <option value="commercial">Comercial</option>
                  <option value="land">Terreno</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Status *</label>
                <select {...register('status')} className="input-field">
                  <option value="sale">Venda</option>
                  <option value="rent">Aluguel</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Preço *</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('price', { valueAsNumber: true })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Área (m²) *</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('area', { valueAsNumber: true })}
                  className="input-field"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Quartos *</label>
                <input
                  type="number"
                  min="0"
                  {...register('bedrooms', { valueAsNumber: true })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Banheiros *</label>
                <input
                  type="number"
                  min="0"
                  {...register('bathrooms', { valueAsNumber: true })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Vagas *</label>
                <input
                  type="number"
                  min="0"
                  {...register('parkingSpots', { valueAsNumber: true })}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('featured')}
                  className="w-4 h-4 text-primary bg-dark-light border-dark-lighter rounded focus:ring-primary"
                />
                <span className="text-sm text-gray-400">Marcar como destaque</span>
              </label>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Endereço</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Cidade *</label>
                <input
                  type="text"
                  {...register('address.city')}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Estado (UF) *</label>
                <input
                  type="text"
                  maxLength={2}
                  {...register('address.state')}
                  className="input-field uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Bairro *</label>
              <input
                type="text"
                {...register('address.neighborhood')}
                className="input-field"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="block text-sm text-gray-400 mb-2">Rua *</label>
                <input
                  type="text"
                  {...register('address.street')}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Número *</label>
                <input
                  type="text"
                  {...register('address.number')}
                  className="input-field"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">CEP (opcional)</label>
              <input
                type="text"
                {...register('address.zipCode')}
                className="input-field"
              />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Imagens</h2>
          <ImageUploader
            images={images}
            onChange={setImages}
            maxImages={10}
            existingImages={existingImages}
            onRemoveExisting={handleRemoveExistingImage}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-secondary"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="btn-primary"
          >
            {updateMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </form>
    </div>
  )
}
