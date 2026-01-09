export interface User {
  _id: string
  name: string
  email: string
  role: 'user' | 'agent' | 'admin'
  createdAt: string
}

export interface Address {
  city: string
  neighborhood: string
  street: string
  number: string
  state: string
  zipCode?: string
}

export interface Property {
  _id: string
  title: string
  description: string
  type: 'apartment' | 'house' | 'commercial' | 'land'
  status: 'sale' | 'rent'
  price: number
  bedrooms: number
  bathrooms: number
  parkingSpots: number
  area: number
  address: Address
  featured: boolean
  images: string[]
  createdAt: string
  updatedAt: string
}

export interface Lead {
  _id: string
  name: string
  email: string
  phone: string
  message: string
  propertyId: string
  property?: Property
  createdAt: string
}

export interface Favorite {
  _id: string
  userId: string
  propertyId: string
  property: Property
  createdAt: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface PropertyFilters {
  q?: string
  city?: string
  neighborhood?: string
  type?: 'apartment' | 'house' | 'commercial' | 'land'
  status?: 'sale' | 'rent'
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  bathrooms?: number
  parkingSpots?: number
  featured?: boolean
  sort?: 'price' | 'createdAt'
  order?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface AuthResponse {
  token: string
  user: User
}

export interface CreatePropertyData {
  title: string
  description: string
  type: 'apartment' | 'house' | 'commercial' | 'land'
  status: 'sale' | 'rent'
  price: number
  bedrooms: number
  bathrooms: number
  parkingSpots: number
  area: number
  address: Address
  featured?: boolean
}

export interface CreateLeadData {
  name: string
  email: string
  phone: string
  message: string
  propertyId: string
}
