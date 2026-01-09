import { z } from "zod";

export const createLeadSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres").trim(),
    email: z.string().email("Email inválido").toLowerCase().trim(),
    phone: z.string().min(10, "Telefone inválido").trim(),
    message: z.string().min(10, "Mensagem deve ter no mínimo 10 caracteres").trim(),
    propertyId: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID de imóvel inválido").optional(),
    source: z.string().optional(),
  }),
});

export const getLeadSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID inválido"),
  }),
});
