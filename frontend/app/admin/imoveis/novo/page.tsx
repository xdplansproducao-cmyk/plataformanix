'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { propertySchema } from '@/lib/validations'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { propertiesService } from '@/services/propertiesService'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import ImageUploader from '@/components/ImageUploader'
import toast from 'react-hot-toast'
import { CreatePropertyData } from '@/types'

export default function NewPropertyPage() {
  return (
    <ProtectedRoute requireAdmin>
      <NewPropertyContent />
    </ProtectedRoute>
  )
}

function NewPropertyContent() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [images, setImages] = useState<File[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePropertyData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      featured: false,
    },
  })

  const createMutation = useMutation({
    mutationFn: (data: { property: CreatePropertyData; images: File[] }) =>
      propertiesService.create(data.property, data.images),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      toast.success('Imóvel cadastrado com sucesso!')
      router.push('/admin/imoveis')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao cadastrar imóvel')
    },
  })

  const onSubmit = (data: CreatePropertyData) => {
    if (images.length === 0) {
      toast.error('Adicione pelo menos uma imagem')
      return
    }
    createMutation.mutate({ property: data, images })
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Cadastrar Novo Imóvel</h1>

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
                placeholder="Ex: Apartamento 3 quartos com varanda"
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
                placeholder="Descreva o imóvel em detalhes..."
              />
              {errors.description && (
                <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Tipo *</label>
                <select {...register('type')} className="input-field">
                  <option value="">Selecione</option>
                  <option value="apartment">Apartamento</option>
                  <option value="house">Casa</option>
                  <option value="commercial">Comercial</option>
                  <option value="land">Terreno</option>
                </select>
                {errors.type && (
                  <p className="text-red-400 text-sm mt-1">{errors.type.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Status *</label>
                <select {...register('status')} className="input-field">
                  <option value="">Selecione</option>
                  <option value="sale">Venda</option>
                  <option value="rent">Aluguel</option>
                </select>
                {errors.status && (
                  <p className="text-red-400 text-sm mt-1">{errors.status.message}</p>
                )}
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
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="text-red-400 text-sm mt-1">{errors.price.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Área (m²) *</label>
                <input
                  type="number"
                  step="0.01"
                  {...register('area', { valueAsNumber: true })}
                  className="input-field"
                  placeholder="0"
                />
                {errors.area && (
                  <p className="text-red-400 text-sm mt-1">{errors.area.message}</p>
                )}
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
                {errors.bedrooms && (
                  <p className="text-red-400 text-sm mt-1">{errors.bedrooms.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Banheiros *</label>
                <input
                  type="number"
                  min="0"
                  {...register('bathrooms', { valueAsNumber: true })}
                  className="input-field"
                />
                {errors.bathrooms && (
                  <p className="text-red-400 text-sm mt-1">{errors.bathrooms.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Vagas *</label>
                <input
                  type="number"
                  min="0"
                  {...register('parkingSpots', { valueAsNumber: true })}
                  className="input-field"
                />
                {errors.parkingSpots && (
                  <p className="text-red-400 text-sm mt-1">{errors.parkingSpots.message}</p>
                )}
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
                {errors.address?.city && (
                  <p className="text-red-400 text-sm mt-1">{errors.address.city.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Estado (UF) *</label>
                <input
                  type="text"
                  maxLength={2}
                  {...register('address.state')}
                  className="input-field uppercase"
                />
                {errors.address?.state && (
                  <p className="text-red-400 text-sm mt-1">{errors.address.state.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Bairro *</label>
              <input
                type="text"
                {...register('address.neighborhood')}
                className="input-field"
              />
              {errors.address?.neighborhood && (
                <p className="text-red-400 text-sm mt-1">{errors.address.neighborhood.message}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="block text-sm text-gray-400 mb-2">Rua *</label>
                <input
                  type="text"
                  {...register('address.street')}
                  className="input-field"
                />
                {errors.address?.street && (
                  <p className="text-red-400 text-sm mt-1">{errors.address.street.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Número *</label>
                <input
                  type="text"
                  {...register('address.number')}
                  className="input-field"
                />
                {errors.address?.number && (
                  <p className="text-red-400 text-sm mt-1">{errors.address.number.message}</p>
                )}
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
          <h2 className="text-xl font-semibold mb-4">Imagens *</h2>
          <ImageUploader images={images} onChange={setImages} maxImages={10} />
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
            disabled={createMutation.isPending}
            className="btn-primary"
          >
            {createMutation.isPending ? 'Cadastrando...' : 'Cadastrar Imóvel'}
          </button>
        </div>
      </form>
    </div>
  )
}
