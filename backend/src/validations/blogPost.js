import { z } from 'zod'

const categoryEnum = z.enum(['dicas', 'mercado', 'financiamento', 'decoracao', 'noticias', 'outros'])

export const createBlogPostSchema = z.object({
  body: z.object({
    title: z
      .string({ required_error: 'O título é obrigatório' })
      .min(5, 'O título deve ter no mínimo 5 caracteres')
      .max(200, 'O título deve ter no máximo 200 caracteres'),
    excerpt: z
      .string({ required_error: 'O resumo é obrigatório' })
      .min(10, 'O resumo deve ter no mínimo 10 caracteres')
      .max(500, 'O resumo deve ter no máximo 500 caracteres'),
    content: z
      .string({ required_error: 'O conteúdo é obrigatório' })
      .min(50, 'O conteúdo deve ter no mínimo 50 caracteres'),
    category: categoryEnum.optional().default('outros'),
    tags: z
      .union([
        z.string(),
        z.array(z.string())
      ])
      .optional()
      .default([]),
    published: z
      .union([z.boolean(), z.string()])
      .optional()
      .default(false),
    featured: z
      .union([z.boolean(), z.string()])
      .optional()
      .default(false),
  }),
})

export const updateBlogPostSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(5, 'O título deve ter no mínimo 5 caracteres')
      .max(200, 'O título deve ter no máximo 200 caracteres')
      .optional(),
    excerpt: z
      .string()
      .min(10, 'O resumo deve ter no mínimo 10 caracteres')
      .max(500, 'O resumo deve ter no máximo 500 caracteres')
      .optional(),
    content: z
      .string()
      .min(50, 'O conteúdo deve ter no mínimo 50 caracteres')
      .optional(),
    category: categoryEnum.optional(),
    tags: z
      .union([
        z.string(),
        z.array(z.string())
      ])
      .optional(),
    published: z
      .union([z.boolean(), z.string()])
      .optional(),
    featured: z
      .union([z.boolean(), z.string()])
      .optional(),
  }),
})

export const getBlogPostsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(12),
    category: categoryEnum.optional(),
    tag: z.string().optional(),
    featured: z
      .string()
      .transform((val) => val === 'true')
      .optional(),
    published: z
      .string()
      .transform((val) => val === 'true')
      .optional(),
    search: z.string().optional(),
  }),
})

export const slugSchema = z.object({
  params: z.object({
    slug: z.string().min(1, 'Slug inválido'),
  }),
})
