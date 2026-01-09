'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema } from '@/lib/validations'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { Building2 } from 'lucide-react'

export default function RegisterPage() {
  const { register: registerUser, isAuthenticated, isRegistering } = useAuth()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  })

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  const onSubmit = (data: any) => {
    registerUser(data)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Building2 className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Criar conta</h1>
          <p className="text-gray-400">Cadastre-se para começar</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Nome</label>
              <input
                type="text"
                placeholder="Seu nome completo"
                {...register('name')}
                className="input-field"
              />
              {errors.name && (
                <p className="text-red-400 text-sm mt-1">{errors.name.message as string}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Email</label>
              <input
                type="email"
                placeholder="seu@email.com"
                {...register('email')}
                className="input-field"
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email.message as string}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Senha</label>
              <input
                type="password"
                placeholder="••••••••"
                {...register('password')}
                className="input-field"
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{errors.password.message as string}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isRegistering}
              className="w-full btn-primary"
            >
              {isRegistering ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Já tem uma conta?{' '}
              <Link href="/login" className="text-primary hover:text-primary-dark">
                Faça login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
