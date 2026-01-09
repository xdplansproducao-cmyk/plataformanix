'use client'

import { useLeads } from '@/hooks/useLeads'
import ProtectedRoute from '@/components/ProtectedRoute'
import { formatPrice } from '@/lib/utils'
import { MessageSquare, Mail, Phone, Calendar, Building2 } from 'lucide-react'
import Link from 'next/link'

export default function AdminLeadsPage() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminLeadsContent />
    </ProtectedRoute>
  )
}

function AdminLeadsContent() {
  const { data: leads, isLoading } = useLeads()

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card p-6">
              <div className="h-6 bg-dark-lighter rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-dark-lighter rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center space-x-3 mb-8">
        <MessageSquare className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold">Leads Recebidos</h1>
      </div>

      {leads && leads.length > 0 ? (
        <div className="space-y-4">
          {leads.map((lead) => (
            <div key={lead._id} className="card p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{lead.name}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      <span>{lead.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      <span>{lead.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{new Date(lead.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
                {lead.property && (
                  <Link
                    href={`/imoveis/${lead.propertyId}`}
                    className="flex items-center space-x-2 text-primary hover:text-primary-dark transition-colors"
                  >
                    <Building2 className="w-5 h-5" />
                    <span className="text-sm">Ver Imóvel</span>
                  </Link>
                )}
              </div>

              {lead.property && (
                <div className="mb-4 p-4 bg-dark-lighter rounded-lg">
                  <p className="text-sm text-gray-400 mb-1">Imóvel de interesse:</p>
                  <p className="font-semibold">{lead.property.title}</p>
                  <p className="text-sm text-gray-400">
                    {lead.property.address.neighborhood}, {lead.property.address.city} - {formatPrice(lead.property.price)}
                  </p>
                </div>
              )}

              <div className="mt-4">
                <p className="text-sm text-gray-400 mb-2">Mensagem:</p>
                <p className="text-gray-300 bg-dark-lighter p-4 rounded-lg">{lead.message}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Nenhum lead recebido ainda.</p>
        </div>
      )}
    </div>
  )
}
