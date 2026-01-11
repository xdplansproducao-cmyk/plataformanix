'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useUnreadLeadsCount } from '@/hooks/useLeads'
import { useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import {
  LayoutDashboard,
  Building2,
  Plus,
  BookOpen,
  FileText,
  MessageSquare,
  Menu as MenuIcon,
  Palette,
  Settings,
} from 'lucide-react'

type NavItem = {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

type NavGroup = {
  title: string
  items: NavItem[]
}

const navGroups: NavGroup[] = [
  {
    title: 'Visão Geral',
    items: [{ href: '/admin', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    title: 'Imóveis',
    items: [
      { href: '/admin/imoveis', label: 'Lista de imóveis', icon: Building2 },
      { href: '/admin/imoveis/novo', label: 'Novo imóvel', icon: Plus },
      { href: '/admin/leads', label: 'Leads', icon: MessageSquare },
    ],
  },
  {
    title: 'Conteúdo',
    items: [
      { href: '/admin/paginas', label: 'Páginas', icon: FileText },
      { href: '/admin/paginas/nova', label: 'Nova página', icon: Plus },
      { href: '/admin/blog', label: 'Posts', icon: BookOpen },
      { href: '/admin/blog/novo', label: 'Novo post', icon: Plus },
    ],
  },
  {
    title: 'Edições do Site',
    items: [
      { href: '/admin/edicoes', label: 'Edições', icon: Settings },
      { href: '/admin/menu', label: 'Menu', icon: MenuIcon },
      { href: '/admin/edicoes/cores', label: 'Cores', icon: Palette },
    ],
  },
]

function isActive(pathname: string, href: string) {
  if (href === '/admin') return pathname === '/admin'
  return pathname === href || pathname.startsWith(`${href}/`)
}

function NavLink({ href, label, icon: Icon, unreadCount }: NavItem & { unreadCount?: number }) {
  const pathname = usePathname()
  const active = isActive(pathname, href)
  const showLeadsBadge = href === '/admin/leads' && !!unreadCount && unreadCount > 0

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
        active
          ? 'bg-primary/20 text-white border border-primary/40'
          : 'text-gray-300 hover:text-white hover:bg-dark-light'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm font-medium">{label}</span>
      {showLeadsBadge && (
        <span className="ml-auto text-xs font-semibold bg-red-600 text-white px-2 py-0.5 rounded-full">
          {unreadCount}
        </span>
      )}
    </Link>
  )
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { data: unreadCount } = useUnreadLeadsCount()

  const prevUnreadCountRef = useRef<number | null>(null)

  useEffect(() => {
    if (typeof unreadCount !== 'number') return

    if (prevUnreadCountRef.current !== null && unreadCount > prevUnreadCountRef.current) {
      toast.success(`Novo lead recebido (${unreadCount} não lidos)`)
    }

    prevUnreadCountRef.current = unreadCount
  }, [unreadCount])

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen">
        <div className="flex">
          <aside className="hidden lg:flex lg:flex-col w-72 min-h-screen border-r border-dark-lighter bg-dark/60">
            <div className="p-6">
              <Link href="/admin" className="flex items-center gap-2 text-white">
                <LayoutDashboard className="w-5 h-5 text-primary" />
                <span className="font-semibold">Painel Admin</span>
              </Link>
            </div>

            <nav className="px-4 pb-6 space-y-6">
              {navGroups.map((group) => (
                <div key={group.title} className="space-y-2">
                  <div className="px-2 text-xs uppercase tracking-wider text-gray-500">
                    {group.title}
                  </div>
                  <div className="space-y-1">
                    {group.items.map((item) => (
                      <NavLink key={item.href} {...item} unreadCount={unreadCount} />
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </aside>

          <div className="flex-1 min-w-0">
            <header className="sticky top-0 z-10 border-b border-dark-lighter bg-dark/60 backdrop-blur">
              <div className="px-4 md:px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-white font-semibold">Admin</span>
                  <span className="text-gray-500 text-sm">/</span>
                  <span className="text-gray-300 text-sm">Gerenciamento</span>
                </div>
                <Link href="/" className="text-sm text-gray-300 hover:text-white">
                  Ver site
                </Link>
              </div>

              <div className="lg:hidden px-4 pb-4 flex flex-wrap gap-2">
                {navGroups.flatMap((g) => g.items).map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-xs px-3 py-2 rounded-lg border border-dark-lighter text-gray-300 hover:text-white hover:bg-dark-light"
                  >
                    {item.label}
                    {item.href === '/admin/leads' && !!unreadCount && unreadCount > 0 ? ` (${unreadCount})` : ''}
                  </Link>
                ))}
              </div>
            </header>

            <main className="px-4 md:px-8 py-8">{children}</main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
