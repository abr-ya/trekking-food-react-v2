import { z } from "zod";

const recipeIngredientSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  quantity: z.number().positive("Quantity must be greater than 0"),
});

export const createRecipeSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  categoryId: z.string().min(1, "Recipe category is required"),
  description: z.string().trim().min(1, "Description is required"),
  ingredients: z.array(recipeIngredientSchema).min(1, "Add at least one ingredient"),
  isCommon: z.boolean(),
});

export type CreateRecipeFormData = z.infer<typeof createRecipeSchema>;
