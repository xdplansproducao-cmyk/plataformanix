export interface User {
  _id: string
  name: string
  email: string
  phone: string
  birthDate: string
  profession: string
  city: string
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
  images?: string[]
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

export interface BlogPost {
  _id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string | null
  author: {
    _id: string
    name: string
    email: string
  }
  category: 'dicas' | 'mercado' | 'financiamento' | 'decoracao' | 'noticias' | 'outros'
  tags: string[]
  published: boolean
  publishedAt: string | null
  views: number
  featured: boolean
  createdAt: string
  updatedAt: string
}

export interface BlogPostFilters {
  page?: number
  limit?: number
  category?: string
  tag?: string
  featured?: boolean
  published?: boolean
  search?: string
}

export interface CreateBlogPostData {
  title: string
  excerpt: string
  content: string
  category?: 'dicas' | 'mercado' | 'financiamento' | 'decoracao' | 'noticias' | 'outros'
  tags?: string[]
  published?: boolean
  featured?: boolean
}

export interface UpdateBlogPostData {
  title?: string
  excerpt?: string
  content?: string
  category?: 'dicas' | 'mercado' | 'financiamento' | 'decoracao' | 'noticias' | 'outros'
  tags?: string[]
  published?: boolean
  featured?: boolean
}

export interface BlogPaginatedResponse {
  posts: BlogPost[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface Page {
  _id: string
  title: string
  slug: string
  content: string
  metaTitle?: string
  metaDescription?: string
  published: boolean
  publishedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface MenuItem {
  _id: string
  label: string
  href: string
  order: number
  published: boolean
  parentId?: string
  children?: MenuItem[]
  menuType: 'main' | 'footer' | 'sidebar'
  contentType: 'custom' | 'page' | 'post' | 'link'
  pageId?: string
  postId?: string
  target: '_self' | '_blank'
  createdAt: string
  updatedAt: string
}

export interface CreatePageData {
  title: string
  slug: string
  content: string
  metaTitle?: string
  metaDescription?: string
  published?: boolean
}

export interface UpdatePageData {
  title?: string
  slug?: string
  content?: string
  metaTitle?: string
  metaDescription?: string
  published?: boolean
}

export interface CreateMenuItemData {
  label: string
  href: string
  order: number
  published?: boolean
  parentId?: string
  menuType?: 'main' | 'footer' | 'sidebar'
  contentType?: 'custom' | 'page' | 'post' | 'link'
  pageId?: string
  postId?: string
  target?: '_self' | '_blank'
}

export interface UpdateMenuItemData {
  id: string
  [key: string]: any
}

export interface PageFilters {
  page?: number
  limit?: number
  published?: boolean
  search?: string
}