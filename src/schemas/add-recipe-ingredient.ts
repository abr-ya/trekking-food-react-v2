import { z } from "zod";

export const addRecipeIngredientSchema = z.object({
  product: z.object({
    label: z.string(),
    value: z.string(),
  }),
  quantity: z.number().positive("Quantity must be greater than 0"),
});

export type AddRecipeIngredientFormData = z.infer<typeof addRecipeIngredientSchema>;
