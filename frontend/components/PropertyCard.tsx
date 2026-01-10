'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Property } from '@/types'
import { formatPrice } from '@/lib/utils'
import { Bed, Bath, Car, MapPin } from 'lucide-react'

interface PropertyCardProps {
  property: Property
}

export default function PropertyCard({ property }: PropertyCardProps) {
  // property.images agora é um array de strings (URLs)
  const imageUrl = property.images && property.images.length > 0
    ? property.images[0].startsWith('http') 
      ? property.images[0]
      : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}${property.images[0]}`
    : 'https://dummyimage.com/400x300/2d2d2d/D4AF37&text=Sem+Imagem'

  return (
    <Link href={`/imoveis/${property._id}`}>
      <div className="card h-full cursor-pointer">
        <div className="relative h-48 w-full overflow-hidden">
          {property.featured && (
            <span className="absolute top-2 left-2 bg-primary text-dark px-2 py-1 rounded text-xs font-semibold z-10">
              Destaque
            </span>
          )}
          <Image
            src={imageUrl}
            alt={property.title}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-white line-clamp-1">
              {property.title}
            </h3>
            <span className="text-primary font-bold text-lg">
              {formatPrice(property.price)}
            </span>
          </div>
          
          <div className="flex items-center text-gray-400 text-sm mb-3">
            <MapPin className="w-4 h-4 mr-1" />
            <span>
              {property.address.neighborhood}, {property.address.city}
            </span>
          </div>

          <div className="flex items-center space-x-4 text-gray-400 text-sm">
            <div className="flex items-center">
              <Bed className="w-4 h-4 mr-1" />
              <span>{property.bedrooms}</span>
            </div>
            <div className="flex items-center">
              <Bath className="w-4 h-4 mr-1" />
              <span>{property.bathrooms}</span>
            </div>
            <div className="flex items-center">
              <Car className="w-4 h-4 mr-1" />
              <span>{property.parkingSpots}</span>
            </div>
            <span className="ml-auto">{property.area}m²</span>
          </div>

          <div className="mt-3 pt-3 border-t border-dark-lighter">
            <span className="text-xs text-gray-500 uppercase">
              {property.type} • {property.status === 'sale' ? 'Venda' : 'Aluguel'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
