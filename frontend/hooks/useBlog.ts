'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { blogService } from '@/services/blogService'
import { BlogPostFilters, CreateBlogPostData, UpdateBlogPostData } from '@/types'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export function useBlogPosts(filters?: BlogPostFilters) {
  return useQuery({
    queryKey: ['blog', 'posts', filters],
    queryFn: () => blogService.getAll(filters),
    staleTime: 1000 * 60 * 5, // 5 minutos
  })
}

export function useBlogPost(id: string) {
  return useQuery({
    queryKey: ['blog', 'post', id],
    queryFn: () => blogService.getById(id),
    enabled: !!id,
  })
}

export function useBlogPostBySlug(slug: string) {
  return useQuery({
    queryKey: ['blog', 'post', 'slug', slug],
    queryFn: () => blogService.getBySlug(slug),
    enabled: !!slug,
  })
}

export function useFeaturedPosts(limit = 3) {
  return useQuery({
    queryKey: ['blog', 'featured', limit],
    queryFn: () => blogService.getFeatured(limit),
    staleTime: 1000 * 60 * 10, // 10 minutos
  })
}

export function useRelatedPosts(id: string, limit = 3) {
  return useQuery({
    queryKey: ['blog', 'related', id, limit],
    queryFn: () => blogService.getRelated(id, limit),
    enabled: !!id,
  })
}

export function useBlogCategories() {
  return useQuery({
    queryKey: ['blog', 'categories'],
    queryFn: blogService.getCategories,
    staleTime: 1000 * 60 * 30, // 30 minutos
  })
}

export function useBlogTags() {
  return useQuery({
    queryKey: ['blog', 'tags'],
    queryFn: blogService.getTags,
    staleTime: 1000 * 60 * 30, // 30 minutos
  })
}

export function useCreateBlogPost() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: ({ data, coverImage }: { data: CreateBlogPostData; coverImage?: File }) =>
      blogService.create(data, coverImage),
    onSuccess: (post) => {
      queryClient.invalidateQueries({ queryKey: ['blog'] })
      toast.success('Post criado com sucesso!')
      router.push('/admin/blog')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao criar post')
    },
  })
}

export function useUpdateBlogPost() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: ({ id, data, coverImage }: { id: string; data: UpdateBlogPostData; coverImage?: File }) =>
      blogService.update(id, data, coverImage),
    onSuccess: (post) => {
      queryClient.invalidateQueries({ queryKey: ['blog'] })
      toast.success('Post atualizado com sucesso!')
      router.push('/admin/blog')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao atualizar post')
    },
  })
}

export function useDeleteBlogPost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: blogService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog'] })
      toast.success('Post excluído com sucesso!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao excluir post')
    },
  })
}
