import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres").trim(),
    email: z.string().email("Email inválido").toLowerCase().trim(),
    phone: z.string().min(10, "Telefone inválido").trim(),
    birthDate: z.string().min(1, "Data de nascimento é obrigatória"),
    profession: z.string().min(2, "Profissão é obrigatória").trim(),
    city: z.string().min(2, "Cidade é obrigatória").trim(),
    password: z.string()
      .min(8, "Senha deve ter no mínimo 8 caracteres")
      .regex(/^(?=.*[a-z])(?=.*\d)/, "Senha deve conter pelo menos uma letra minúscula e um número"),
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não coincidem",
    path: ["body", "confirmPassword"],
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Email inválido").toLowerCase().trim(),
    password: z.string().min(1, "Senha é obrigatória"),
  }),
});
