import { z } from "zod";

export const updateRoleSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID inválido"),
  }),
  body: z.object({
    role: z.enum(["admin", "agent", "user"], {
      errorMap: () => ({ message: "Role deve ser admin, agent ou user" }),
    }),
  }),
});
