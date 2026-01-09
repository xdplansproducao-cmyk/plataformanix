import { z } from "zod";

const addressSchema = z.object({
  city: z.string().min(1, "Cidade é obrigatória").trim(),
  neighborhood: z.string().min(1, "Bairro é obrigatório").trim(),
  street: z.string().min(1, "Rua é obrigatória").trim(),
  number: z.string().min(1, "Número é obrigatório").trim(),
  zip: z.string().optional(),
  state: z.string().length(2, "Estado deve ter 2 caracteres").toUpperCase().trim(),
});

export const createPropertySchema = z.object({
  body: z.object({
    title: z.string().min(3, "Título deve ter no mínimo 3 caracteres").trim(),
    description: z.string().min(10, "Descrição deve ter no mínimo 10 caracteres").trim(),
    type: z.enum(["apartment", "house", "commercial", "land"], {
      errorMap: () => ({ message: "Tipo inválido" }),
    }),
    status: z.enum(["sale", "rent"], {
      errorMap: () => ({ message: "Status inválido" }),
    }),
    price: z.number().positive("Preço deve ser positivo"),
    condoFee: z.number().nonnegative("Condomínio deve ser positivo ou zero").optional(),
    iptu: z.number().nonnegative("IPTU deve ser positivo ou zero").optional(),
    bedrooms: z.number().int().nonnegative("Quartos deve ser um número inteiro positivo ou zero"),
    bathrooms: z.number().int().nonnegative("Banheiros deve ser um número inteiro positivo ou zero"),
    parkingSpots: z.number().int().nonnegative("Vagas deve ser um número inteiro positivo ou zero"),
    area: z.number().positive("Área deve ser positiva"),
    address: addressSchema,
    features: z.array(z.string().trim()).optional(),
    isFeatured: z.boolean().optional(),
  }),
});

export const updatePropertySchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID inválido"),
  }),
  body: createPropertySchema.shape.body.partial(),
});

export const getPropertiesSchema = z.object({
  query: z.object({
    q: z.string().optional(),
    city: z.string().optional(),
    neighborhood: z.string().optional(),
    type: z.enum(["apartment", "house", "commercial", "land"]).optional(),
    status: z.enum(["sale", "rent"]).optional(),
    minPrice: z.coerce.number().positive().optional(),
    maxPrice: z.coerce.number().positive().optional(),
    bedrooms: z.coerce.number().int().nonnegative().optional(),
    bathrooms: z.coerce.number().int().nonnegative().optional(),
    parkingSpots: z.coerce.number().int().nonnegative().optional(),
    featured: z.coerce.boolean().optional(),
    sort: z.enum(["price", "createdAt"]).optional(),
    order: z.enum(["asc", "desc"]).optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
  }),
});

export const getPropertySchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID inválido"),
  }),
});

export const deletePropertySchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID inválido"),
  }),
});
