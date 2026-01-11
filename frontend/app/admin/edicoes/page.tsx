'use client'

import Link from 'next/link'
import { Menu as MenuIcon, Palette } from 'lucide-react'

export default function AdminEdicoesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-2">Edições do Site</h1>
      <p className="text-gray-400 mb-8">Configurações gerais de aparência e navegação.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/admin/menu" className="card p-6 hover:scale-105 transition-transform">
          <MenuIcon className="w-12 h-12 text-primary mb-4" />
          <h2 className="text-xl font-semibold mb-2 text-white">Menu</h2>
          <p className="text-gray-400">Gerenciar menus principal, rodapé e lateral.</p>
        </Link>

        <Link href="/admin/edicoes/cores" className="card p-6 hover:scale-105 transition-transform">
          <Palette className="w-12 h-12 text-primary mb-4" />
          <h2 className="text-xl font-semibold mb-2 text-white">Cores</h2>
          <p className="text-gray-400">Definir paleta do site (em breve).</p>
        </Link>
      </div>
    </div>
  )
}
