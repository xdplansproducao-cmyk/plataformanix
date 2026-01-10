'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Home, Building2, Heart, User, LogOut, LogIn, Settings, Menu, X } from 'lucide-react'

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const firstName = user?.name?.split(' ')[0] || 'Perfil'

  return (
    <nav className="bg-dark-light border-b border-dark-lighter sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo.png"
              alt="Nix Imóveis"
              width={200}
              height={100}
              className="h-auto"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
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
                  <span className="text-gray-300">{firstName}</span>
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-primary"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-dark-lighter">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/"
                className="block px-3 py-2 text-gray-300 hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/imoveis"
                className="block px-3 py-2 text-gray-300 hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Imóveis
              </Link>

              {isAuthenticated && (
                <>
                  <Link
                    href="/favoritos"
                    className="block px-3 py-2 text-gray-300 hover:text-primary transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Favoritos
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="block px-3 py-2 text-gray-300 hover:text-primary transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Admin
                    </Link>
                  )}
                  <div className="border-t border-dark-lighter mt-3 pt-3">
                    <div className="px-3 py-2 text-gray-300">
                      Olá, {firstName}
                    </div>
                    <button
                      onClick={() => {
                        logout()
                        setIsMobileMenuOpen(false)
                      }}
                      className="block w-full text-left px-3 py-2 text-gray-300 hover:text-red-400 transition-colors"
                    >
                      Sair
                    </button>
                  </div>
                </>
              )}

              {!isAuthenticated && (
                <Link
                  href="/login"
                  className="block px-3 py-2 btn-primary text-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Entrar
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
