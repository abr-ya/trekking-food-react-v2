import { z } from "zod";

const recipeIngredientSchema = z
  .object({
    product: z
      .object({
        label: z.string(),
        value: z.string(),
      })
      .nullable(),
    quantity: z.number().min(1, "Quantity must be greater than 0"),
  })
  .refine((data) => data.product !== null && data.product.value.trim() !== "", {
    message: "Product is required",
    path: ["product"],
  });

export const createRecipeSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  categoryId: z.string().min(1, "Recipe category is required"),
  description: z.string().trim().min(1, "Description is required"),
  ingredients: z.array(recipeIngredientSchema).min(1, "Add at least one ingredient"),
  isCommon: z.boolean(),
});

export type CreateRecipeFormData = z.infer<typeof createRecipeSchema>;
