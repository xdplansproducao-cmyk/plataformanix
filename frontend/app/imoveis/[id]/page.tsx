'use client'

import { useParams } from 'next/navigation'
import { useProperty } from '@/hooks/useProperties'
import { useFavorites } from '@/hooks/useFavorites'
import { useCreateLead } from '@/hooks/useLeads'
import { useAuth } from '@/hooks/useAuth'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { leadSchema } from '@/lib/validations'
import { CreateLeadData } from '@/types'
import { formatPrice } from '@/lib/utils'
import { Bed, Bath, Car, MapPin, Heart, Mail, Phone, MessageSquare } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

export default function PropertyDetailPage() {
  const params = useParams()
  const id = params.id as string
  const { data: property, isLoading } = useProperty(id)
  const { isAuthenticated } = useAuth()
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()
  const createLead = useCreateLead()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateLeadData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      propertyId: id,
    },
  })

  const onSubmit = (data: CreateLeadData) => {
    createLead.mutate(data, {
      onSuccess: () => {
        reset()
      },
    })
  }

  const handleFavorite = () => {
    if (!isAuthenticated) {
      return
    }
    if (isFavorite(id)) {
      removeFavorite(id)
    } else {
      addFavorite(id)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-96 bg-dark-lighter rounded-lg mb-6"></div>
          <div className="h-8 bg-dark-lighter rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-dark-lighter rounded w-1/3"></div>
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

  const imageUrl = property.images?.[currentImageIndex]
    ? `${process.env.NEXT_PUBLIC_API_URL}${property.images[currentImageIndex]}`
    : 'https://via.placeholder.com/800x600/2d2d2d/D4AF37?text=Sem+Imagem'

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Galeria e Informações */}
        <div className="lg:col-span-2">
          {/* Galeria Principal */}
          <div className="relative h-96 w-full rounded-lg overflow-hidden bg-dark-light mb-4">
            <Image
              src={imageUrl}
              alt={property.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 66vw"
            />
          </div>

          {/* Miniaturas */}
          {property.images && property.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mb-8">
              {property.images.slice(0, 8).map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative h-20 w-full rounded overflow-hidden ${
                    currentImageIndex === index ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}${img}`}
                    alt={`Imagem ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 25vw, 16vw"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Informações */}
          <div className="card p-6 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                <div className="flex items-center text-gray-400">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>
                    {property.address.street}, {property.address.number} - {property.address.neighborhood}, {property.address.city} - {property.address.state}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary mb-2">
                  {formatPrice(property.price)}
                </div>
                <div className="text-sm text-gray-400">
                  {property.status === 'sale' ? 'Venda' : 'Aluguel'}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-6 py-4 border-t border-b border-dark-lighter">
              <div className="flex items-center">
                <Bed className="w-5 h-5 mr-2 text-gray-400" />
                <span>{property.bedrooms} Quarto{property.bedrooms !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center">
                <Bath className="w-5 h-5 mr-2 text-gray-400" />
                <span>{property.bathrooms} Banheiro{property.bathrooms !== 1 ? 's' : ''}</span>
              </div>
              <div className="flex items-center">
                <Car className="w-5 h-5 mr-2 text-gray-400" />
                <span>{property.parkingSpots} Vaga{property.parkingSpots !== 1 ? 's' : ''}</span>
              </div>
              <div>
                <span className="font-semibold">{property.area}m²</span>
              </div>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-3">Descrição</h2>
              <p className="text-gray-300 leading-relaxed">{property.description}</p>
            </div>

            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-3">Características</h2>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-gray-300">
                  <span className="text-gray-400">Tipo:</span> {property.type === 'apartment' ? 'Apartamento' : property.type === 'house' ? 'Casa' : property.type === 'commercial' ? 'Comercial' : 'Terreno'}
                </div>
                <div className="text-gray-300">
                  <span className="text-gray-400">Status:</span> {property.status === 'sale' ? 'Venda' : 'Aluguel'}
                </div>
                <div className="text-gray-300">
                  <span className="text-gray-400">Área:</span> {property.area}m²
                </div>
                {property.featured && (
                  <div className="text-gray-300">
                    <span className="text-gray-400">Destaque:</span> Sim
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Favoritar e Form de Lead */}
        <div className="space-y-6">
          {/* Botão Favoritar */}
          {isAuthenticated && (
            <div className="card p-6">
              <button
                onClick={handleFavorite}
                className={`w-full flex items-center justify-center space-x-2 py-3 rounded-lg transition-colors ${
                  isFavorite(id)
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-dark-lighter hover:bg-dark-lighter/80 text-white'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite(id) ? 'fill-current' : ''}`} />
                <span>{isFavorite(id) ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}</span>
              </button>
            </div>
          )}

          {/* Form de Lead */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              Interessado neste imóvel?
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              Preencha o formulário e entraremos em contato!
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Seu nome"
                  {...register('name')}
                  className="input-field"
                />
                {errors.name && (
                  <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Seu email"
                  {...register('email')}
                  className="input-field"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="Seu telefone"
                  {...register('phone')}
                  className="input-field"
                />
                {errors.phone && (
                  <p className="text-red-400 text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>
              <div>
                <textarea
                  placeholder="Sua mensagem"
                  rows={4}
                  {...register('message')}
                  className="input-field resize-none"
                />
                {errors.message && (
                  <p className="text-red-400 text-sm mt-1">{errors.message.message}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={createLead.isPending}
                className="w-full btn-primary"
              >
                {createLead.isPending ? 'Enviando...' : 'Enviar Mensagem'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
