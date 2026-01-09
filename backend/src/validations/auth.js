import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres").trim(),
    email: z.string().email("Email inválido").toLowerCase().trim(),
    password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Email inválido").toLowerCase().trim(),
    password: z.string().min(1, "Senha é obrigatória"),
  }),
});
