'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import Link from 'next/link'
import apiClient from '@/lib/api/client'
import { useQuery } from '@tanstack/react-query'
import { propertiesService } from '@/services/propertiesService'
import { blogService } from '@/services/blogService'
import { useLeadsCount, useUnreadLeadsCount } from '@/hooks/useLeads'
import { Building2, MessageSquare, Plus, BookOpen, FileText as PageIcon, Menu as MenuIcon } from 'lucide-react'

export default function AdminDashboard() {
  const { data: propertiesCount } = useQuery<number>({
    queryKey: ['dashboard', 'propertiesCount'],
    queryFn: async () => {
      const result = await propertiesService.getAll({ limit: 1 })
      return typeof result.total === 'number' ? result.total : 0
    },
    staleTime: 30 * 1000,
  })

  const { data: pagesCount } = useQuery<number>({
    queryKey: ['dashboard', 'pagesCount'],
    queryFn: async () => {
      const { data } = await apiClient.get<any>('/api/pages?page=1&limit=1')
      return typeof data?.pagination?.total === 'number' ? data.pagination.total : 0
    },
    staleTime: 30 * 1000,
  })

  const { data: postsCount } = useQuery<number>({
    queryKey: ['dashboard', 'postsCount'],
    queryFn: async () => {
      const result = await blogService.getAll({ page: 1, limit: 1 })
      return typeof result?.pagination?.total === 'number' ? result.pagination.total : 0
    },
    staleTime: 30 * 1000,
  })

  const { data: leadsCount } = useLeadsCount()
  const { data: unreadLeadsCount } = useUnreadLeadsCount()

  return (
    <ProtectedRoute requireAdmin>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Painel Administrativo</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Link href="/admin/imoveis" className="card p-6 hover:scale-105 transition-transform">
            <Building2 className="w-10 h-10 text-primary mb-3" />
            <div className="text-3xl font-bold text-white">{propertiesCount ?? '—'}</div>
            <div className="text-gray-400">Imóveis</div>
          </Link>

          <Link href="/admin/paginas" className="card p-6 hover:scale-105 transition-transform">
            <PageIcon className="w-10 h-10 text-primary mb-3" />
            <div className="text-3xl font-bold text-white">{pagesCount ?? '—'}</div>
            <div className="text-gray-400">Páginas</div>
          </Link>

          <Link href="/admin/blog" className="card p-6 hover:scale-105 transition-transform">
            <BookOpen className="w-10 h-10 text-primary mb-3" />
            <div className="text-3xl font-bold text-white">{postsCount ?? '—'}</div>
            <div className="text-gray-400">Posts</div>
          </Link>

          <Link href="/admin/leads" className="card p-6 hover:scale-105 transition-transform">
            <MessageSquare className="w-10 h-10 text-primary mb-3" />
            <div className="text-3xl font-bold text-white">{leadsCount ?? '—'}</div>
            <div className="text-gray-400">Leads</div>
            {!!unreadLeadsCount && unreadLeadsCount > 0 && (
              <div className="mt-2 text-sm text-red-400">{unreadLeadsCount} não lidos</div>
            )}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/admin/imoveis" className="card p-6 hover:scale-105 transition-transform">
            <Building2 className="w-12 h-12 text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-2">Imóveis</h2>
            <p className="text-gray-400">Gerenciar imóveis cadastrados</p>
          </Link>

          <Link href="/admin/imoveis/novo" className="card p-6 hover:scale-105 transition-transform">
            <Plus className="w-12 h-12 text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-2">Novo Imóvel</h2>
            <p className="text-gray-400">Cadastrar um novo imóvel</p>
          </Link>

          <Link href="/admin/leads" className="card p-6 hover:scale-105 transition-transform">
            <MessageSquare className="w-12 h-12 text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-2">Leads</h2>
            <p className="text-gray-400">Visualizar leads recebidos</p>
          </Link>

          <Link href="/admin/blog" className="card p-6 hover:scale-105 transition-transform">
            <BookOpen className="w-12 h-12 text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-2">Blog</h2>
            <p className="text-gray-400">Gerenciar posts do blog</p>
          </Link>

          <Link href="/admin/blog/novo" className="card p-6 hover:scale-105 transition-transform">
            <Plus className="w-12 h-12 text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-2">Novo Post</h2>
            <p className="text-gray-400">Criar um novo post no blog</p>
          </Link>

          <Link href="/admin/paginas" className="card p-6 hover:scale-105 transition-transform">
            <PageIcon className="w-12 h-12 text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-2">Páginas</h2>
            <p className="text-gray-400">Gerenciar páginas do site</p>
          </Link>

          <Link href="/admin/paginas/nova" className="card p-6 hover:scale-105 transition-transform">
            <Plus className="w-12 h-12 text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-2">Nova Página</h2>
            <p className="text-gray-400">Criar uma nova página</p>
          </Link>

          <Link href="/admin/menu" className="card p-6 hover:scale-105 transition-transform">
            <MenuIcon className="w-12 h-12 text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-2">Menu</h2>
            <p className="text-gray-400">Gerenciar menu de navegação</p>
          </Link>
        </div>
      </div>
    </ProtectedRoute>
  )
}
