import { z } from "zod";

export const favoritePropertySchema = z.object({
  params: z.object({
    propertyId: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID de imóvel inválido"),
  }),
});
