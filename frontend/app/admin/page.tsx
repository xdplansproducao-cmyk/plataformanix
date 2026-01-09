'use client'

import ProtectedRoute from '@/components/ProtectedRoute'
import Link from 'next/link'
import { Building2, MessageSquare, Plus, List } from 'lucide-react'

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
        </div>
      </div>
    </ProtectedRoute>
  )
}
