'use client'

import { useState, useRef } from 'react'
import { X, Upload } from 'lucide-react'
import Image from 'next/image'

interface ImageUploaderProps {
  images: File[]
  onChange: (images: File[]) => void
  maxImages?: number
  existingImages?: string[]
  onRemoveExisting?: (index: number) => void
}

export default function ImageUploader({
  images,
  onChange,
  maxImages = 10,
  existingImages = [],
  onRemoveExisting,
}: ImageUploaderProps) {
  const [previews, setPreviews] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newFiles = [...images, ...files].slice(0, maxImages)
    onChange(newFiles)

    // Criar previews
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file))
    setPreviews(newPreviews)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    onChange(newImages)
    
    // Remover preview
    if (previews[index]) {
      URL.revokeObjectURL(previews[index])
    }
    const newPreviews = previews.filter((_, i) => i !== index)
    setPreviews(newPreviews)
  }

  const removeExistingImage = (index: number) => {
    if (onRemoveExisting) {
      onRemoveExisting(index)
    }
  }

  const totalImages = images.length + existingImages.length
  const canAddMore = totalImages < maxImages

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {/* Imagens existentes */}
        {existingImages.map((imageUrl, index) => (
          <div key={`existing-${index}`} className="relative group">
            <div className="relative h-32 w-full rounded-lg overflow-hidden bg-dark-light">
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}${imageUrl}`}
                alt={`Imagem ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
            {onRemoveExisting && (
              <button
                type="button"
                onClick={() => removeExistingImage(index)}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}

        {/* Novas imagens com preview */}
        {previews.map((preview, index) => (
          <div key={`preview-${index}`} className="relative group">
            <div className="relative h-32 w-full rounded-lg overflow-hidden bg-dark-light">
              <Image
                src={preview}
                alt={`Preview ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}

        {/* Botão de upload */}
        {canAddMore && (
          <label className="relative h-32 w-full rounded-lg border-2 border-dashed border-dark-lighter flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="text-center">
              <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
              <span className="text-xs text-gray-400">Adicionar</span>
            </div>
          </label>
        )}
      </div>
      <p className="text-sm text-gray-400">
        {totalImages} / {maxImages} imagens
      </p>
    </div>
  )
}
