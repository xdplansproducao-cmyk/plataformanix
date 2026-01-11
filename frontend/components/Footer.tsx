'use client'

import Link from 'next/link'
import { useDynamicMenu } from '@/hooks/useDynamicMenu'
import { MenuItem } from '@/types'

export default function Footer() {
  const { data: menuItems } = useDynamicMenu()

  const footerItems = (menuItems || [])
    .filter((item: MenuItem) => item && typeof item === 'object' && item.published === true)
    .filter((item: MenuItem) => item.menuType === 'footer' && !item.parentId)
    .sort((a: MenuItem, b: MenuItem) => (a?.order || 0) - (b?.order || 0))

  const year = new Date().getFullYear()

  return (
    <footer className="mt-16 border-t border-dark-lighter bg-dark-light">
      <div className="container mx-auto px-4 py-10">
        {footerItems.length > 0 && (
          <nav className="flex flex-wrap gap-x-6 gap-y-3 justify-center md:justify-start">
            {footerItems.map((item) => (
              <Link
                key={item._id}
                href={item.href}
                target={item.target}
                rel={item.target === '_blank' ? 'noreferrer' : undefined}
                className="text-sm text-gray-300 hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-sm">
          <div className="text-gray-400">
            © {year} Nix Imóveis. Todos os direitos reservados.
          </div>
          <div className="text-gray-400">
            Criado pela{' '}
            <a
              href="https://www.xdplans.space"
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:text-primary-dark transition-colors"
            >
              XD Plans
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
