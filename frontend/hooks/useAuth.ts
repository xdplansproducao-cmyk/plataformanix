'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authService } from '@/services/authService'
import { tokenStorage, userStorage } from '@/lib/auth/token'
import { User } from '@/types'
import toast from 'react-hot-toast'

export function useAuth() {
  const router = useRouter()
  const queryClient = useQueryClient()

  // Verificar usuário atual
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const token = tokenStorage.get()
      if (!token) return null
      
      try {
        const userData = await authService.getMe()
        userStorage.set(userData)
        return userData
      } catch (error) {
        tokenStorage.remove()
        return null
      }
    },
    retry: false,
  })

  // Login
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      tokenStorage.set(data.token)
      userStorage.set(data.user)
      queryClient.setQueryData(['auth', 'me'], data.user)
      toast.success('Login realizado com sucesso!')
      router.push('/')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao fazer login')
    },
  })

  // Register
  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      tokenStorage.set(data.token)
      userStorage.set(data.user)
      queryClient.setQueryData(['auth', 'me'], data.user)
      toast.success('Cadastro realizado com sucesso!')
      router.push('/')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao fazer cadastro')
    },
  })

  // Logout
  const logout = () => {
    tokenStorage.remove()
    queryClient.setQueryData(['auth', 'me'], null)
    queryClient.clear()
    router.push('/login')
    toast.success('Logout realizado com sucesso!')
  }

  // Verifica se o usuário é admin (não agent)
  const isAdmin = user?.role === 'admin'
  const isAuthenticated = !!user

  return {
    user,
    isLoading,
    isAuthenticated,
    isAdmin,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
  }
}
