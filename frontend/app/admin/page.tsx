'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import Link from 'next/link'
import { Building2, MessageSquare, Plus, List, BookOpen, FileText, FileText as PageIcon, Menu as MenuIcon } from 'lucide-react'

export default function AdminDashboard() {
  return (
    <ProtectedRoute requireAdmin>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Painel Administrativo</h1>

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
            <FileText className="w-12 h-12 text-primary mb-4" />
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
