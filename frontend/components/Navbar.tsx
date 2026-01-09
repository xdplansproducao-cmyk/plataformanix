'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Home, Building2, Heart, User, LogOut, LogIn, Settings } from 'lucide-react'

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()

  return (
    <nav className="bg-dark-light border-b border-dark-lighter sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Building2 className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-primary">Nix Imóveis</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link
              href="/"
              className="flex items-center space-x-1 text-gray-300 hover:text-primary transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </Link>
            <Link
              href="/imoveis"
              className="flex items-center space-x-1 text-gray-300 hover:text-primary transition-colors"
            >
              <Building2 className="w-5 h-5" />
              <span>Imóveis</span>
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  href="/favoritos"
                  className="flex items-center space-x-1 text-gray-300 hover:text-primary transition-colors"
                >
                  <Heart className="w-5 h-5" />
                  <span>Favoritos</span>
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center space-x-1 text-gray-300 hover:text-primary transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                    <span>Admin</span>
                  </Link>
                )}
              </>
            )}

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-gray-300" />
                  <span className="text-gray-300">{user?.name}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 text-gray-300 hover:text-red-400 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sair</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center space-x-1 btn-primary"
              >
                <LogIn className="w-5 h-5" />
                <span>Entrar</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
