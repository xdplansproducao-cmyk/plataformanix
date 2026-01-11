import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  birthDate: z.string().min(1, 'Data de nascimento é obrigatória'),
  profession: z.string().min(2, 'Profissão é obrigatória'),
  city: z.string().min(2, 'Cidade é obrigatória'),
  password: z.string()
    .min(8, 'Senha deve ter no mínimo 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*\d)/, 'Senha deve conter pelo menos uma letra minúscula e um número'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword'],
})

export const propertySchema = z.object({
  title: z.string().min(3, 'Título deve ter no mínimo 3 caracteres'),
  description: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres'),
  type: z.enum(['apartment', 'house', 'commercial', 'land']),
  status: z.enum(['sale', 'rent']),
  price: z.number().min(0, 'Preço deve ser maior que 0'),
  bedrooms: z.number().min(0, 'Número de quartos inválido'),
  bathrooms: z.number().min(0, 'Número de banheiros inválido'),
  parkingSpots: z.number().min(0, 'Número de vagas inválido'),
  area: z.number().min(0, 'Área deve ser maior que 0'),
  address: z.object({
    city: z.string().min(2, 'Cidade é obrigatória'),
    neighborhood: z.string().min(2, 'Bairro é obrigatório'),
    street: z.string().min(2, 'Rua é obrigatória'),
    number: z.string().min(1, 'Número é obrigatório'),
    state: z.string().length(2, 'Estado deve ter 2 caracteres'),
    zipCode: z.string().optional(),
  }),
  featured: z.boolean().optional(),
})

export const leadSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  message: z.string().min(10, 'Mensagem deve ter no mínimo 10 caracteres'),
  propertyId: z.string().min(1, 'ID do imóvel é obrigatório'),
})

export const blogPostSchema = z.object({
  title: z.string().min(5, 'O título deve ter no mínimo 5 caracteres').max(200, 'O título deve ter no máximo 200 caracteres'),
  excerpt: z.string().min(10, 'O resumo deve ter no mínimo 10 caracteres').max(500, 'O resumo deve ter no máximo 500 caracteres'),
  content: z.string().min(50, 'O conteúdo deve ter no mínimo 50 caracteres'),
  category: z.enum(['dicas', 'mercado', 'financiamento', 'decoracao', 'noticias', 'outros']),
  tags: z.string().optional(),
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
})